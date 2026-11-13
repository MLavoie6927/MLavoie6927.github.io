from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import hashlib
import json
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
TEXT_CHECKSUM_SUFFIXES = {".css", ".html", ".js", ".json", ".md"}
HTML_FILES = sorted(
    [
        path for path in ROOT.rglob("index.html")
        if ".git" not in path.parts and "work" not in path.parts
    ]
    + [
        ROOT / "full-portfolio.html",
        ROOT / "intelligence-officer" / "core-literacy.html",
        ROOT / "intelligence-officer" / "collection-workbench.html",
        ROOT / "intelligence-officer" / "strategy-investigations.html",
        ROOT / "intelligence-officer" / "influence-analysis.html",
        ROOT / "intelligence-officer" / "study.html",
        ROOT / "intelligence-officer" / "sectors.html",
    ]
)


def manifest_digest(path: Path) -> str:
    data = path.read_bytes()
    if path.suffix.lower() in TEXT_CHECKSUM_SUFFIXES:
        data = data.replace(b"\r\n", b"\n").replace(b"\r", b"\n")
    return hashlib.sha256(data).hexdigest()


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.references: list[tuple[str, str]] = []
        self.blank_links_without_noopener: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"] or "")
        for attribute in ("href", "src", "poster"):
            if values.get(attribute):
                self.references.append((attribute, values[attribute] or ""))
        if tag == "a" and values.get("target") == "_blank":
            rel = set((values.get("rel") or "").split())
            if "noopener" not in rel:
                self.blank_links_without_noopener.append(values.get("href") or "(missing href)")


def local_target(page: Path, reference: str) -> Path | None:
    if not reference or reference.startswith(("#", "data:", "mailto:", "tel:", "javascript:")):
        return None
    parsed = urlsplit(reference)
    if parsed.scheme or parsed.netloc:
        return None
    clean = unquote(parsed.path)
    if not clean:
        return None
    return (ROOT / clean.lstrip("/")) if clean.startswith("/") else (page.parent / clean)


def validate_html(errors: list[str]) -> None:
    for page in HTML_FILES:
        parser = PageParser()
        text = page.read_text(encoding="utf-8")
        parser.feed(text)
        relative = page.relative_to(ROOT).as_posix()
        duplicates = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
        if duplicates:
            errors.append(f"{relative}: duplicate IDs {duplicates}")
        for attribute, reference in parser.references:
            target = local_target(page, reference)
            if target is not None and not target.exists():
                errors.append(f"{relative}: missing {attribute} target {reference}")
            if attribute == "href" and "placeholder" in reference.lower():
                errors.append(f"{relative}: placeholder link {reference}")
        for reference in parser.blank_links_without_noopener:
            errors.append(f"{relative}: target=_blank without rel=noopener ({reference})")


def validate_home(errors: list[str]) -> None:
    text = (ROOT / "index.html").read_text(encoding="utf-8")
    nav = re.search(r'<ul class="nav-links" id="primary-menu">(.*?)</ul>', text, re.S)
    if not nav or nav.group(1).count("<li>") != 13:
        errors.append("index.html: primary navigation must contain exactly thirteen choices")
    for marker in (
        'id="featured-projects"',
        'id="project-library"',
        'id="skills"',
        'rel="canonical" href="https://mlavoie6927.github.io/"',
        'projects/operation-glass-meridian/',
        'projects/k12-network-operations/',
        'full-portfolio.html',
        'interview/',
        'general-it/',
        'soc-management/',
        'intelligence-officer/',
        'id="general-it"',
        'id="intelligence-officer"',
        'id="space-science"',
        'href="#space-science">Space Science</a>',
        'space-science/',
        'intelligence-officer/collection-workbench.html',
        'intelligence-officer/strategy-investigations.html',
    ):
        if marker not in text:
            errors.append(f"index.html: missing required recruiter-first marker {marker}")
    if "GitHub Profile" in text:
        errors.append("index.html: public GitHub profile button must not be present")
    if nav and 'href="#contact">Contact</a>' in nav.group(1):
        errors.append("index.html: Contact must be replaced by Space Science in the primary navigation")


def validate_full_portfolio(errors: list[str]) -> None:
    text = (ROOT / "full-portfolio.html").read_text(encoding="utf-8")
    nav = re.search(r'<ul class="nav-links" id="primary-menu">(.*?)</ul>', text, re.S)
    if not nav or nav.group(1).count("<li>") < 23:
        errors.append("full-portfolio.html: complete legacy navigation was not restored")
    for marker in (
        'id="soc-projects"',
        'id="wazuh-elk"',
        'id="detection-rules"',
        'id="gcp-labs"',
        'id="windows-hardening"',
        'id="scripting-projects"',
        'id="cpp-projects"',
        'id="network-server-lab"',
        'id="digital-forensics"',
        'id="ethical-hacking"',
        'id="network-engineering"',
        'id="firewall-security"',
        'id="security-stacks"',
        'id="cryptography"',
        'id="securityplus-study-guide"',
        'id="certificates"',
        'id="public-recognition"',
        'interview/',
        'general-it/',
        'soc-management/',
        'id="general-it"',
        'science/',
        'id="science"',
        'geology/',
        'id="geology"',
    ):
        if marker not in text:
            errors.append(f"full-portfolio.html: missing recovered section marker {marker}")


def validate_general_it(errors: list[str]) -> None:
    base = ROOT / "general-it"
    html = (base / "index.html").read_text(encoding="utf-8")
    css = (base / "general-it.css").read_text(encoding="utf-8")
    scripts = "\n".join(
        (base / name).read_text(encoding="utf-8")
        for name in ("data.js", "general-it.js")
    )

    for marker in (
        "General IT Field Desk",
        "1,000 common IT problems and fixes",
        "100 interview Q&amp;A",
        "The FIELD troubleshooting loop",
        "Twenty technical domains × ten issue families × five support contexts",
        "Escalate a decision, not a mystery",
        "Do not bypass MFA, endpoint protection, certificate warnings, encryption, access controls, or change approval",
        'id="problem-search"',
        'id="problem-category"',
        'id="problem-context"',
        'id="problem-pattern"',
        'id="interview-search"',
        'id="random-question"',
        'id="it-menu-toggle"',
        'href="../full-portfolio.html#general-it"',
    ):
        if marker not in html:
            errors.append(f"General IT Field Desk: missing marker {marker}")

    for marker in (
        "@media(max-width:850px)",
        ".problem-card",
        ".interview-card",
        ".it-menu.is-open",
    ):
        if marker not in css:
            errors.append(f"General IT Field Desk: missing responsive style marker {marker}")

    for marker in (
        "window.GENERAL_IT_DATA",
        "Expected 1000 IT problems",
        "Expected 100 help-desk interview questions",
        "setLibraryView",
        "filteredProblems",
        "filteredInterviews",
    ):
        if marker not in scripts:
            errors.append(f"General IT Field Desk: missing application marker {marker}")

    without_comments = re.sub(r"/\*.*?\*/|//[^\n]*", "", scripts, flags=re.S)
    for label, pattern in {
        "fetch calls": r"(?<![\w])fetch\s*\(",
        "XMLHttpRequest": r"new\s+XMLHttpRequest",
        "WebSocket": r"new\s+WebSocket\s*\(",
        "localStorage": r"localStorage",
        "sessionStorage": r"sessionStorage",
        "eval": r"(?<![\w])eval\s*\(",
        "Function constructor": r"new\s+Function\s*\(",
    }.items():
        if re.search(pattern, without_comments):
            errors.append(f"General IT Field Desk: forbidden {label}")

    for page_name in ("index.html", "full-portfolio.html"):
        if "general-it/" not in (ROOT / page_name).read_text(encoding="utf-8"):
            errors.append(f"General IT Field Desk: missing navigation link from {page_name}")
    if "https://mlavoie6927.github.io/general-it/" not in (ROOT / "sitemap.xml").read_text(encoding="utf-8"):
        errors.append("General IT Field Desk: sitemap URL is missing")


def validate_geology(errors: list[str]) -> None:
    base = ROOT / "geology"
    html = (base / "index.html").read_text(encoding="utf-8")
    css = (base / "geology.css").read_text(encoding="utf-8")
    scripts = "\n".join(
        (base / name).read_text(encoding="utf-8")
        for name in ("geology-data.js", "geology.js")
    )

    for marker in (
        "Geology Field Guide",
        "Read the planet",
        "The geology topic atlas",
        "Before the first watt, there is a geological system.",
        "Geologic hydrogen",
        "Geologic energy &amp; carbon storage",
        "Do not confuse “present” with “producible.”",
        "Interactive plate-tectonics laboratory",
        "Twenty field investigations",
        "Observation first. Interpretation second.",
        'id="topic-search"',
        'id="topic-filters"',
        'id="plate-selector"',
        'id="investigation-select"',
        'href="../full-portfolio.html#geology"',
        'href="../index.html"',
    ):
        if marker not in html:
            errors.append(f"Geology Field Guide: missing marker {marker}")
    if html.count('class="energy-card"') != 6:
        errors.append("Geology Field Guide: expected six geologic energy system cards")
    if html.count("<article><span>0") < 11:
        errors.append("Geology Field Guide: method and energy lifecycle architecture is incomplete")

    for marker in (
        ".topic-grid",
        ".energy-system-grid",
        ".energy-decision",
        ".plate-lab",
        ".investigation-card",
        ".nav-links.is-open",
        "@media (max-width: 680px)",
        "prefers-reduced-motion",
    ):
        if marker not in css:
            errors.append(f"Geology Field Guide: missing responsive style marker {marker}")

    for marker in (
        "window.GEOLOGY_DATA",
        "renderTopics",
        "renderPlateSetting",
        "renderInvestigation",
        "searchableDomain",
    ):
        if marker not in scripts:
            errors.append(f"Geology Field Guide: missing application marker {marker}")

    without_comments = re.sub(r"/\*.*?\*/|//[^\n]*", "", scripts, flags=re.S)
    for label, pattern in {
        "fetch calls": r"(?<![\w])fetch\s*\(",
        "XMLHttpRequest": r"new\s+XMLHttpRequest",
        "WebSocket": r"new\s+WebSocket\s*\(",
        "localStorage": r"localStorage",
        "sessionStorage": r"sessionStorage",
        "eval": r"(?<![\w])eval\s*\(",
        "Function constructor": r"new\s+Function\s*\(",
    }.items():
        if re.search(pattern, without_comments):
            errors.append(f"Geology Field Guide: forbidden {label}")

    full_portfolio = (ROOT / "full-portfolio.html").read_text(encoding="utf-8")
    for marker in ('id="geology"', 'href="geology/"', 'href="#geology">Geology</a>'):
        if marker not in full_portfolio:
            errors.append(f"Geology Field Guide: missing Full Portfolio marker {marker}")
    if "https://mlavoie6927.github.io/geology/" not in (ROOT / "sitemap.xml").read_text(encoding="utf-8"):
        errors.append("Geology Field Guide: sitemap URL is missing")


def validate_archaeology(errors: list[str]) -> None:
    base = ROOT / "archaeology"
    html = (base / "index.html").read_text(encoding="utf-8")
    css = (base / "archaeology.css").read_text(encoding="utf-8")
    script = (base / "archaeology.js").read_text(encoding="utf-8")
    pdf = base / "global-archaeological-record-1000-page-reference-edition.pdf"
    cover = base / "assets" / "reference-edition-cover.png"

    for marker in (
        "The Global Archaeological Record",
        "Dig deeper than a list of sites.",
        "A research instrument, not a trophy shelf.",
        "Explore 61 verified entry points.",
        "The critical-evidence method.",
        "Read the record here.",
        "Published with a verifiable boundary.",
        "not a complete census, independently audited excavation catalogue, fieldwork credential",
        'id="archaeology-menu-toggle"',
        'id="record-search"',
        'id="record-grid"',
        'id="pdf-frame"',
        'href="../full-portfolio.html#archaeology"',
        'href="../index.html"',
    ):
        if marker not in html:
            errors.append(f"Archaeology reference: missing marker {marker}")

    for marker in (
        ".cover-stage",
        ".purpose-grid",
        ".record-grid",
        ".method-flow",
        ".evidence-matrix",
        ".pdf-shell",
        ".integrity-grid",
        ".nav-menu.is-open",
        "@media (max-width: 760px)",
        "prefers-reduced-motion",
    ):
        if marker not in css:
            errors.append(f"Archaeology reference: missing responsive style marker {marker}")

    for marker in (
        "var chapters = [",
        "var regionNames = [",
        "renderRecords",
        "openReaderPage",
        "navigator.clipboard.writeText",
        '"Close archaeology navigation"',
        "Math.max(1, Math.min(1000",
    ):
        if marker not in script:
            errors.append(f"Archaeology reference: missing application marker {marker}")

    chapter_block = re.search(r"var chapters = \[(.*?)\]\.map", script, re.S)
    region_block = re.search(r"var regionNames = \[(.*?)\];", script, re.S)
    chapter_count = len(re.findall(r'^\s*"[^"]+",?\s*$', chapter_block.group(1), re.M)) if chapter_block else 0
    region_count = len(re.findall(r'^\s*"[^"]+",?\s*$', region_block.group(1), re.M)) if region_block else 0
    if chapter_count != 39:
        errors.append(f"Archaeology reference: expected 39 research chapters, found {chapter_count}")
    if region_count != 22:
        errors.append(f"Archaeology reference: expected 22 atlas regions, found {region_count}")

    without_comments = re.sub(r"/\*.*?\*/|//[^\n]*", "", script, flags=re.S)
    for label, pattern in {
        "fetch calls": r"(?<![\w])fetch\s*\(",
        "XMLHttpRequest": r"new\s+XMLHttpRequest",
        "WebSocket": r"new\s+WebSocket\s*\(",
        "localStorage": r"localStorage",
        "sessionStorage": r"sessionStorage",
        "eval": r"(?<![\w])eval\s*\(",
        "Function constructor": r"new\s+Function\s*\(",
    }.items():
        if re.search(pattern, without_comments):
            errors.append(f"Archaeology reference: forbidden {label}")

    expected_pdf_sha256 = "0468b3acda34f21c685fdbdf88df0a78f74c46a29de995160eff0ca99f21c6cb"
    if not pdf.exists():
        errors.append("Archaeology reference: published PDF is missing")
    else:
        if pdf.stat().st_size != 3515331:
            errors.append(f"Archaeology reference: PDF size changed to {pdf.stat().st_size} bytes")
        if hashlib.sha256(pdf.read_bytes()).hexdigest() != expected_pdf_sha256:
            errors.append("Archaeology reference: PDF hash does not match the supplied artifact")
    if not cover.exists() or cover.stat().st_size < 50000:
        errors.append("Archaeology reference: rendered cover preview is missing or unexpectedly small")

    full_portfolio = (ROOT / "full-portfolio.html").read_text(encoding="utf-8")
    for marker in ('id="archaeology"', 'href="archaeology/"', 'href="#archaeology">Archaeology</a>'):
        if marker not in full_portfolio:
            errors.append(f"Archaeology reference: missing Full Portfolio marker {marker}")
    if "https://mlavoie6927.github.io/archaeology/" not in (ROOT / "sitemap.xml").read_text(encoding="utf-8"):
        errors.append("Archaeology reference: sitemap URL is missing")


def validate_science(errors: list[str]) -> None:
    base = ROOT / "science"
    html = (base / "index.html").read_text(encoding="utf-8")
    css = (base / "science.css").read_text(encoding="utf-8")
    script = (base / "science.js").read_text(encoding="utf-8")
    pdf = base / "general-science-reference-2026-expanded-edition.pdf"
    cover = base / "assets" / "general-science-cover.png"

    for marker in (
        "General Science Reference",
        "A map of science.",
        "Built to connect ideas—not collect trivia.",
        "Explore all 28 disciplines.",
        "Move from signal to explanation without skipping the hard parts.",
        "Turn a broad curiosity into a testable plan.",
        "Read the science here.",
        "Published with a verifiable boundary.",
        "not original laboratory research, a professional credential",
        'id="science-menu-toggle"',
        'id="discipline-search"',
        'id="discipline-grid"',
        'id="investigation-select"',
        'id="pdf-frame"',
        'href="../full-portfolio.html#science"',
        'href="../index.html"',
    ):
        if marker not in html:
            errors.append(f"Science reference: missing marker {marker}")

    for marker in (
        ".cover-stage",
        ".architecture-grid",
        ".discipline-grid",
        ".method-flow",
        ".reasoning-matrix",
        ".workbench-shell",
        ".pdf-shell",
        ".integrity-grid",
        ".nav-menu.is-open",
        "@media (max-width:760px)",
        "prefers-reduced-motion",
    ):
        if marker not in css:
            errors.append(f"Science reference: missing responsive style marker {marker}")

    for marker in (
        "var disciplines = [",
        "var investigations = {",
        "renderDisciplines",
        "renderInvestigation",
        "openReaderPage",
        '"Close science navigation"',
        "Math.max(1,Math.min(1195",
    ):
        if marker not in script:
            errors.append(f"Science reference: missing application marker {marker}")

    discipline_count = len(re.findall(r"\{n:\d+,page:\d+,domain:", script))
    investigation_count = len(re.findall(r"^\s{4}[a-z]+:\{title:", script, re.M))
    if discipline_count != 28:
        errors.append(f"Science reference: expected 28 disciplines, found {discipline_count}")
    if investigation_count != 4:
        errors.append(f"Science reference: expected 4 illustrative investigations, found {investigation_count}")

    without_comments = re.sub(r"/\*.*?\*/|//[^\n]*", "", script, flags=re.S)
    for label, pattern in {
        "fetch calls": r"(?<![\w])fetch\s*\(",
        "XMLHttpRequest": r"new\s+XMLHttpRequest",
        "WebSocket": r"new\s+WebSocket\s*\(",
        "localStorage": r"localStorage",
        "sessionStorage": r"sessionStorage",
        "eval": r"(?<![\w])eval\s*\(",
        "Function constructor": r"new\s+Function\s*\(",
    }.items():
        if re.search(pattern, without_comments):
            errors.append(f"Science reference: forbidden {label}")

    expected_pdf_sha256 = "6ca68598e32dcd4a685d247b917a78ed515828328aec898a6c891776da76b637"
    if not pdf.exists():
        errors.append("Science reference: published PDF is missing")
    else:
        if pdf.stat().st_size != 3806792:
            errors.append(f"Science reference: PDF size changed to {pdf.stat().st_size} bytes")
        if hashlib.sha256(pdf.read_bytes()).hexdigest() != expected_pdf_sha256:
            errors.append("Science reference: PDF hash does not match the supplied artifact")
    if not cover.exists() or cover.stat().st_size < 50000:
        errors.append("Science reference: rendered cover preview is missing or unexpectedly small")

    full_portfolio = (ROOT / "full-portfolio.html").read_text(encoding="utf-8")
    for marker in ('id="science"', 'href="science/"', 'href="#science">Science</a>'):
        if marker not in full_portfolio:
            errors.append(f"Science reference: missing Full Portfolio marker {marker}")
    if "https://mlavoie6927.github.io/science/" not in (ROOT / "sitemap.xml").read_text(encoding="utf-8"):
        errors.append("Science reference: sitemap URL is missing")


def validate_space_science(errors: list[str]) -> None:
    base = ROOT / "space-science"
    html = (base / "index.html").read_text(encoding="utf-8")
    css = (base / "space-science.css").read_text(encoding="utf-8")
    landing_css = (base / "landing-space.css").read_text(encoding="utf-8")
    script = (base / "space-science.js").read_text(encoding="utf-8")
    catalog_script = (base / "catalog-data.js").read_text(encoding="utf-8")
    pdf = base / "complete-encyclopedia-space-science-aerospace-engineering-2026.pdf"
    cover = base / "assets" / "encyclopedia-cover.png"

    for marker in (
        "Space Science &amp; Aerospace Engineering",
        "From starlight",
        "Twenty-six divisions. One connected aerospace system.",
        "Every subject is here.",
        "Eight views of every subject",
        "See how altitude changes a circular Earth orbit.",
        "All 5,294 pages, inside the mission desk.",
        "Complete means verifiable.",
        "650 / 650",
        "not a flight-qualified design, launch authorization",
        'id="space-menu-toggle"',
        'id="division-grid"',
        'id="subject-search"',
        'id="subject-grid"',
        'id="altitude-input"',
        'id="pdf-frame"',
        'href="../index.html#space-science"',
    ):
        if marker not in html:
            errors.append(f"Space Science mission desk: missing marker {marker}")

    for marker in (
        ".space-stage",
        ".division-grid",
        ".subject-grid",
        ".treatment-grid",
        ".orbit-lab",
        ".pdf-shell",
        ".integrity-grid",
        ".nav-menu.is-open",
        "@media(max-width:760px)",
        "prefers-reduced-motion",
    ):
        if marker not in css:
            errors.append(f"Space Science mission desk: missing responsive style marker {marker}")

    for marker in (
        ".space-home-feature",
        ".space-home-art",
        ".space-home-metrics",
        "@media(max-width:560px)",
        "prefers-reduced-motion",
    ):
        if marker not in landing_css:
            errors.append(f"Space Science landing feature: missing responsive style marker {marker}")

    for marker in (
        "window.SPACE_SCIENCE_CATALOG",
        "Expected 26 divisions and 650 Space Science subjects.",
        "renderDivisions",
        "renderSubjects",
        "renderSelectedSubject",
        "openReaderPage",
        "updateOrbit",
        '"Close Space Science navigation"',
        "Math.min(5294",
    ):
        if marker not in catalog_script + "\n" + script:
            errors.append(f"Space Science mission desk: missing application marker {marker}")

    prefix = "window.SPACE_SCIENCE_CATALOG="
    if not catalog_script.startswith(prefix) or not catalog_script.rstrip().endswith(";"):
        errors.append("Space Science mission desk: catalog data wrapper is invalid")
    else:
        catalog = json.loads(catalog_script[len(prefix):].strip().removesuffix(";"))
        divisions = catalog.get("divisions", [])
        subjects = catalog.get("subjects", [])
        if len(divisions) != 26:
            errors.append(f"Space Science mission desk: expected 26 divisions, found {len(divisions)}")
        if len(subjects) != 650:
            errors.append(f"Space Science mission desk: expected 650 subjects, found {len(subjects)}")
        ids = [item.get("id") for item in subjects]
        if len(set(ids)) != 650:
            errors.append("Space Science mission desk: subject IDs are not unique")
        if any(item.get("endPage") != item.get("page", 0) + 7 for item in subjects):
            errors.append("Space Science mission desk: one or more subject ranges are not eight pages")

    scripts = catalog_script + "\n" + script
    without_comments = re.sub(r"/\*.*?\*/|//[^\n]*", "", scripts, flags=re.S)
    for label, pattern in {
        "fetch calls": r"(?<![\w])fetch\s*\(",
        "XMLHttpRequest": r"new\s+XMLHttpRequest",
        "WebSocket": r"new\s+WebSocket\s*\(",
        "localStorage": r"localStorage",
        "sessionStorage": r"sessionStorage",
        "eval": r"(?<![\w])eval\s*\(",
        "Function constructor": r"new\s+Function\s*\(",
    }.items():
        if re.search(pattern, without_comments):
            errors.append(f"Space Science mission desk: forbidden {label}")

    expected_pdf_sha256 = "eeb5c91be0d0daec99d33b9530fa738e69e0a49a6b1ac63c9f464b6b3fccba44"
    if not pdf.exists():
        errors.append("Space Science mission desk: published PDF is missing")
    else:
        if pdf.stat().st_size != 16822339:
            errors.append(f"Space Science mission desk: PDF size changed to {pdf.stat().st_size} bytes")
        if hashlib.sha256(pdf.read_bytes()).hexdigest() != expected_pdf_sha256:
            errors.append("Space Science mission desk: PDF hash does not match the supplied artifact")
    if not cover.exists() or cover.stat().st_size < 50000:
        errors.append("Space Science mission desk: rendered cover preview is missing or unexpectedly small")

    home = (ROOT / "index.html").read_text(encoding="utf-8")
    for marker in (
        'href="#space-science">Space Science</a>',
        'id="space-science"',
        'href="space-science/"',
        'href="space-science/#catalog"',
        'href="space-science/#reader"',
        "5,294-page encyclopedia",
        "650 / 650 MODULES ONLINE",
    ):
        if marker not in home:
            errors.append(f"Space Science landing feature: missing marker {marker}")
    if "https://mlavoie6927.github.io/space-science/" not in (ROOT / "sitemap.xml").read_text(encoding="utf-8"):
        errors.append("Space Science mission desk: sitemap URL is missing")


def validate_soc_management(errors: list[str]) -> None:
    base = ROOT / "soc-management"
    html = (base / "index.html").read_text(encoding="utf-8")
    css = (base / "soc-management.css").read_text(encoding="utf-8")
    script = (base / "soc-management.js").read_text(encoding="utf-8")

    for marker in (
        "Enterprise SOC Management",
        "From alert queue to",
        "90-second recruiter path",
        "A SOC is a decision system",
        "Four views of the same incident",
        "Management oversight",
        "Synthetic incident SOC-2026-1142",
        "Interactive command exercise",
        "Measure security outcomes",
        "Automate enrichment freely",
        "Four reports. One incident.",
        "The incident is not finished when the malware is removed.",
        "NIST CSF 2.0 alignment",
        "No live tenant, employer incident, production rule deployment",
        'id="menu-toggle"',
        'id="decision-room"',
        'href="../index.html"',
        'href="../full-portfolio.html#soc-projects"',
    ):
        if marker not in html:
            errors.append(f"SOC Management: missing marker {marker}")

    expected_counts = {
        'role="tab"': 4,
        'data-tier-panel="': 4,
        'data-decision="': 3,
        'class="metric-card"': 10,
        "<article><time>": 8,
    }
    for marker, expected in expected_counts.items():
        actual = html.count(marker)
        if actual != expected:
            errors.append(
                f"SOC Management: expected {expected} occurrences of {marker}, found {actual}"
            )

    for marker in (
        ".command-card",
        ".operating-map",
        ".role-workbench",
        ".decision-room",
        ".metric-grid",
        ".authority-layout",
        ".soar-flow",
        ".report-stack",
        ".backlog",
        "@media (max-width: 640px)",
        "prefers-reduced-motion",
    ):
        if marker not in css:
            errors.append(f"SOC Management: missing responsive style marker {marker}")

    for marker in (
        "function showTier",
        "function showDecision",
        "function copyText",
        'navigator.clipboard.writeText',
        '"Close navigation menu"',
        "Compromise confirmed; scope evolving",
    ):
        if marker not in script:
            errors.append(f"SOC Management: missing interaction marker {marker}")

    without_comments = re.sub(r"/\*.*?\*/|//[^\n]*", "", script, flags=re.S)
    for label, pattern in {
        "fetch calls": r"(?<![\w])fetch\s*\(",
        "XMLHttpRequest": r"new\s+XMLHttpRequest",
        "WebSocket": r"new\s+WebSocket\s*\(",
        "localStorage": r"localStorage",
        "sessionStorage": r"sessionStorage",
        "eval": r"(?<![\w])eval\s*\(",
        "Function constructor": r"new\s+Function\s*\(",
    }.items():
        if re.search(pattern, without_comments):
            errors.append(f"SOC Management: forbidden {label}")

    for page_name in ("index.html", "full-portfolio.html"):
        if "soc-management/" not in (ROOT / page_name).read_text(encoding="utf-8"):
            errors.append(f"SOC Management: missing navigation link from {page_name}")
    if "https://mlavoie6927.github.io/soc-management/" not in (ROOT / "sitemap.xml").read_text(encoding="utf-8"):
        errors.append("SOC Management: sitemap URL is missing")


def validate_hamburger_navigation(errors: list[str]) -> None:
    for page_name in ("index.html", "full-portfolio.html"):
        text = (ROOT / page_name).read_text(encoding="utf-8")
        if text.count('<button class="nav-toggle"') != 1:
            errors.append(f"{page_name}: expected one persistent hamburger control")
        if text.count('<span class="nav-toggle-line"></span>') != 3:
            errors.append(f"{page_name}: hamburger control must contain exactly three lines")
        for marker in (
            'aria-controls="primary-menu"',
            'navigation-restore.css?v=20261109a',
            'script.js?v=hamburger-menu-20261109a',
        ):
            if marker not in text:
                errors.append(f"{page_name}: missing hamburger marker {marker}")

    css = (ROOT / "navigation-restore.css").read_text(encoding="utf-8")
    for marker in (
        ".nav-ready .landing-page .nav-toggle",
        ".nav-ready .portfolio-library-page .nav-toggle",
        'display: inline-flex !important',
        '.nav-links.is-open',
        '@media (min-width: 1600px)',
        '@media (max-width: 620px)',
    ):
        if marker not in css:
            errors.append(f"Hamburger navigation CSS: missing marker {marker}")

    script = (ROOT / "script.js").read_text(encoding="utf-8")
    for marker in (
        'document.documentElement.classList.add("nav-ready")',
        "var shouldOpen = Boolean(open);",
        '"Close navigation menu"',
        '"--active-header-height"',
    ):
        if marker not in script:
            errors.append(f"Hamburger navigation script: missing marker {marker}")


def validate_atlas_upgrade(errors: list[str]) -> None:
    for page_name in ("index.html", "full-portfolio.html"):
        text = (ROOT / page_name).read_text(encoding="utf-8")
        version = "hamburger-menu-20261109a"
        style_order = (f"styles.css?v={version}", "atlas-enterprise-v2.css?v=2.0.0", "atlas-os-v3.css?v=3.1.0")
        script_order = (f"script.js?v={version}", "atlas-enterprise-v2.js?v=2.0.0", "atlas-os-v3.js?v=3.1.0")
        if 'data-network-server-lab' not in text:
            errors.append(f"{page_name}: ATLAS-NET-01 host section is missing")
        for assets, label in ((style_order, "styles"), (script_order, "scripts")):
            positions = [text.find(asset) for asset in assets]
            if any(position < 0 for position in positions):
                errors.append(f"{page_name}: ATLAS {label} are incomplete")
            elif positions != sorted(positions):
                errors.append(f"{page_name}: ATLAS {label} are in the wrong load order")

    sources = {
        "atlas-enterprise-v2.js": ("window.ATLAS", "Browser-only simulation"),
        "atlas-os-v3.js": ("window.ATLAS_OS", "Static GitHub Pages safe", 'const VERSION = "3.1.0"'),
    }
    forbidden = {
        "fetch calls": r"(?<![\w])fetch\s*\(",
        "XMLHttpRequest": r"new\s+XMLHttpRequest",
        "WebSocket": r"new\s+WebSocket\s*\(",
        "eval": r"(?<![\w])eval\s*\(",
        "Function constructor": r"new\s+Function\s*\(",
        "GitHub API": r"api\.github\.com",
    }
    for name, markers in sources.items():
        source = (ROOT / name).read_text(encoding="utf-8")
        without_comments = re.sub(r"/\*.*?\*/|//[^\n]*", "", source, flags=re.S)
        for marker in markers:
            if marker not in source:
                errors.append(f"{name}: missing ATLAS integration marker {marker}")
        for label, pattern in forbidden.items():
            if re.search(pattern, without_comments):
                errors.append(f"{name}: forbidden {label}")

    atlas_css = (ROOT / "atlas-os-v3.css").read_text(encoding="utf-8")
    for marker in ("--aos-font-md", "ATLAS OS v3.1 readability", "@media (max-width: 800px)"):
        if marker not in atlas_css:
            errors.append(f"atlas-os-v3.css: missing readability marker {marker}")


def validate_glass_meridian(errors: list[str]) -> None:
    base = ROOT / "projects" / "operation-glass-meridian"
    html = (base / "index.html").read_text(encoding="utf-8")
    scripts = "\n".join(
        (base / name).read_text(encoding="utf-8")
        for name in ("glass-meridian.js", "glass-meridian-v4-addon.js")
    )
    required_csp = (
        "script-src 'self'",
        "connect-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
    )
    if any(directive not in html for directive in required_csp):
        errors.append("Glass Meridian: static browser boundary CSP is incomplete")
    if "frame-ancestors" in html:
        errors.append("Glass Meridian: frame-ancestors cannot be enforced from a meta CSP on GitHub Pages")
    if "Portfolio truth boundary" not in html or "synthetic" not in html.lower():
        errors.append("Glass Meridian: public truth boundary is missing")
    buttons = set(re.findall(r'data-gm-view="([^"]+)"', html))
    panels = set(re.findall(r'data-gm-view-panel="([^"]+)"', html))
    if buttons - panels:
        errors.append(f"Glass Meridian: controls without panels {sorted(buttons - panels)}")
    if panels - buttons:
        errors.append(f"Glass Meridian: panels without controls {sorted(panels - buttons)}")
    report_block = scripts.split("const reports = [", 1)[-1].split("const hypotheses =", 1)[0]
    report_count = len(re.findall(r"\{\s*id:\s*\d+", report_block))
    if report_count != 30:
        errors.append(f"Glass Meridian: expected 30 synthetic reports, found {report_count}")
    without_comments = re.sub(r"/\*.*?\*/|//[^\n]*", "", scripts, flags=re.S)
    forbidden = {
        "fetch calls": r"(?<![\w])fetch\s*\(",
        "XMLHttpRequest": r"new\s+XMLHttpRequest",
        "WebSocket": r"new\s+WebSocket\s*\(",
        "eval": r"(?<![\w])eval\s*\(",
        "Function constructor": r"new\s+Function\s*\(",
        "GitHub API": r"api\.github\.com",
        "global localStorage clear": r"localStorage\.clear\s*\(",
    }
    for label, pattern in forbidden.items():
        if re.search(pattern, without_comments):
            errors.append(f"Glass Meridian: forbidden {label}")
    validation = json.loads((base / "VALIDATION.json").read_text(encoding="utf-8"))
    if validation.get("structure", {}).get("reports_preserved") != 30:
        errors.append("Glass Meridian: validation manifest report count is not 30")
    checksums = json.loads((base / "SHA256SUMS.json").read_text(encoding="utf-8-sig"))
    for name, expected in checksums.items():
        target = base / name
        if not target.is_file():
            errors.append(f"Glass Meridian: checksum target is missing ({name})")
            continue
        actual = manifest_digest(target)
        if actual != expected:
            errors.append(f"Glass Meridian: stale checksum for {name}")


def validate_reconstructing_system(errors: list[str]) -> None:
    base = ROOT / "projects" / "reconstructing-the-system"
    manuscript_name = "Reconstructing_the_System_First_Run_HUMINT_Expanded.docx"
    pdf_name = "Reconstructing_the_System_First_Run_HUMINT_Expanded.pdf"
    required_files = (
        "index.html",
        "project.css",
        "preview.svg",
        "README.md",
        "SHA256SUMS.txt",
        pdf_name,
        manuscript_name,
    )
    for name in required_files:
        if not (base / name).is_file():
            errors.append(f"Reconstructing the System: missing required file {name}")
    if any(not (base / name).is_file() for name in required_files):
        return

    html = (base / "index.html").read_text(encoding="utf-8")
    for marker in (
        "Portfolio truth boundary",
        "fictional nation-state",
        "1,000",
        "protected source lines",
        "40",
        pdf_name,
        manuscript_name,
        "Read PDF in browser",
        "connect-src 'none'",
        "object-src 'none'",
        "script-src 'none'",
    ):
        if marker not in html:
            errors.append(f"Reconstructing the System: missing project marker {marker}")

    expected = "D457D797FA5C943D5BB7E7351F62D4A115889B6844F548B8203A301D723B88EB"
    manuscript = base / manuscript_name
    actual = hashlib.sha256(manuscript.read_bytes()).hexdigest().upper()
    if actual != expected:
        errors.append("Reconstructing the System: manuscript SHA-256 mismatch")
    expected_pdf = "76DD6731170EE9D7EC8DB69592C35D60AAD705A6AE0633C97A52EAC42A8DB78D"
    pdf = base / pdf_name
    actual_pdf = hashlib.sha256(pdf.read_bytes()).hexdigest().upper()
    if actual_pdf != expected_pdf:
        errors.append("Reconstructing the System: PDF SHA-256 mismatch")
    checksum_text = (base / "SHA256SUMS.txt").read_text(encoding="utf-8")
    if any(marker not in checksum_text for marker in (expected, manuscript_name, expected_pdf, pdf_name)):
        errors.append("Reconstructing the System: checksum manifest is incomplete")

    for page_name in ("index.html", "full-portfolio.html"):
        page_text = (ROOT / page_name).read_text(encoding="utf-8")
        if "projects/reconstructing-the-system/" not in page_text:
            errors.append(f"{page_name}: HUMINT manuscript project link is missing")


def validate_intelligence_fieldbook(errors: list[str]) -> None:
    fieldbook = ROOT / "intelligence-officer" / "sectors.html"
    text = fieldbook.read_text(encoding="utf-8")
    if text.count('class="sector-brief"') != 22:
        errors.append("Intelligence fieldbook: expected exactly 22 sector briefs")
    if text.count("<dt>") != 110:
        errors.append("Intelligence fieldbook: expected five analytic fields for each of 22 sectors")
    for marker in (
        "Questions to ask",
        "Investigation path",
        "Issues and indicators",
        "Evidence and specialists",
        "Cross-sector investigations",
        "International relations",
        "Environment &amp; climate systems",
        "Water &amp; wastewater",
        "There is no universal “best” source",
        "All 30 source types",
        "88</b> priority questions",
        "66</b> decision gates",
        'id="sector-search"',
        'id="expand-all"',
        'id="collapse-all"',
        'id="fieldbook-menu-toggle"',
        'aria-controls="fieldbook-navigation"',
    ):
        if marker not in text:
            errors.append(f"Intelligence fieldbook: missing marker {marker}")

    fieldbook_script = (ROOT / "intelligence-officer" / "sectors.js").read_text(encoding="utf-8")
    catalog_block, investigation_block = fieldbook_script.split("const sectorInvestigations =", maxsplit=1)
    investigation_block = investigation_block.split("const sourceById", maxsplit=1)[0]
    source_catalog_ids = {
        int(source_id)
        for source_id in re.findall(r'\{ id: (\d+), label:', catalog_block)
    }
    used_source_ids = {
        int(source_id)
        for source_id in re.findall(r'\[(\d+), "', investigation_block)
    }
    if source_catalog_ids != set(range(1, 31)):
        errors.append("Intelligence fieldbook: source effectiveness directory must define source IDs 1 through 30")
    if used_source_ids != set(range(1, 31)):
        errors.append("Intelligence fieldbook: sector source stacks must collectively use all 30 source types")
    for marker, expected in {
        'decision: "': 22,
        "questions: [": 22,
        "sources: [": 22,
        "gates: [": 22,
    }.items():
        actual = investigation_block.count(marker)
        if actual != expected:
            errors.append(
                f"Intelligence fieldbook: expected {expected} sector investigation occurrences of {marker}, found {actual}"
            )
    if fieldbook_script.count('createElement("li", "", question)') != 1:
        errors.append("Intelligence fieldbook: priority-question renderer is missing")
    if fieldbook_script.count('createElement("strong", "", label)') != 1:
        errors.append("Intelligence fieldbook: decision-gate renderer is missing")
    if any(pattern in fieldbook_script for pattern in ("fetch(", "XMLHttpRequest", "WebSocket", "localStorage", "sessionStorage")):
        errors.append("Intelligence fieldbook: interactive fieldbook must remain network- and storage-free")
    study = (ROOT / "intelligence-officer" / "study.html").read_text(encoding="utf-8")
    if study.count('class="question"') != 12:
        errors.append("Intelligence study guide: expected exactly 12 scenario questions")
    for marker in (
        "Operation Glass Meridian",
        "Operation Harbor Lantern",
        "Reconstructing the System",
        "30 intelligence source types",
        "22-sector intelligence investigations",
    ):
        if marker not in study:
            errors.append(f"Intelligence study guide: missing restored project marker {marker}")

    literacy = (ROOT / "intelligence-officer" / "core-literacy.html").read_text(encoding="utf-8")
    if literacy.count('class="literacy-card"') != 22:
        errors.append("Intelligence core literacy lab: expected exactly 22 sector exercises")
    if literacy.count('class="literacy-example"') != 22:
        errors.append("Intelligence core literacy lab: expected one fictional example per sector")
    if literacy.count('class="literacy-question"') != 66:
        errors.append("Intelligence core literacy lab: expected three questions per sector")
    if literacy.count('class="literacy-data"') != 22:
        errors.append("Intelligence core literacy lab: expected one operational data request per sector")
    for marker in (
        "The universal data request",
        "Decision + unit of analysis + baseline",
        "Operational data request",
        "Repetition alone does not prove attribution",
        "Turn the data into a decision product",
    ):
        if marker not in literacy:
            errors.append(f"Intelligence core literacy lab: missing marker {marker}")

    workbench = (ROOT / "intelligence-officer" / "collection-workbench.html").read_text(encoding="utf-8")
    expected_counts = {
        'class="requirement-card"': 3,
        'class="hypothesis-card"': 3,
        'class="evidence-card"': 12,
        'class="collection-row"': 6,
        'class="indicator-card"': 12,
    }
    for marker, expected in expected_counts.items():
        actual = workbench.count(marker)
        if actual != expected:
            errors.append(
                f"Intelligence collection workbench: expected {expected} occurrences of {marker}, found {actual}"
            )
    for marker in (
        "Operation Cascade Line",
        "Portfolio truth boundary",
        "Priority intelligence requirements",
        "Synthetic evidence ledger",
        "Indicator and warning matrix",
        "Interactive analyst lab",
        "Worked decision brief",
        'id="assessment-builder"',
        "entirely fictional",
    ):
        if marker not in workbench:
            errors.append(f"Intelligence collection workbench: missing marker {marker}")

    workbench_script = (ROOT / "intelligence-officer" / "collection-workbench.js").read_text(encoding="utf-8")
    without_comments = re.sub(r"/\*.*?\*/|//[^\n]*", "", workbench_script, flags=re.S)
    forbidden = {
        "fetch calls": r"(?<![\w])fetch\s*\(",
        "XMLHttpRequest": r"new\s+XMLHttpRequest",
        "WebSocket": r"new\s+WebSocket\s*\(",
        "localStorage": r"localStorage",
        "sessionStorage": r"sessionStorage",
        "eval": r"(?<![\w])eval\s*\(",
        "Function constructor": r"new\s+Function\s*\(",
    }
    for label, pattern in forbidden.items():
        if re.search(pattern, without_comments):
            errors.append(f"Intelligence collection workbench: forbidden {label}")

    for page_name in ("index.html", "core-literacy.html", "study.html", "sectors.html"):
        page = ROOT / "intelligence-officer" / page_name
        if "collection-workbench.html" not in page.read_text(encoding="utf-8"):
            errors.append(f"Intelligence collection workbench: missing navigation link from {page_name}")
    if "intelligence-officer/collection-workbench.html" not in (
        ROOT / "full-portfolio.html"
    ).read_text(encoding="utf-8"):
        errors.append("Full portfolio: intelligence collection workbench link is missing")

    influence = (ROOT / "intelligence-officer" / "influence-analysis.html").read_text(encoding="utf-8")
    influence_counts = {
        'class="doctrine-phase"': 6,
        'class="vector-card': 6,
        'class="matrix-row"': 6,
        'class="coercive-domain ': 6,
        'class="coercive-row"': 6,
        'href="#coercive-control"': 2,
        'id="influence-menu-toggle"': 1,
        'class="hamburger-lines"': 1,
        'class="proxy-role"': 6,
        'class="indicator-check"': 12,
    }
    for marker, expected in influence_counts.items():
        actual = influence.count(marker)
        if actual != expected:
            errors.append(
                f"PSYOP analysis division: expected {expected} occurrences of {marker}, found {actual}"
            )
    for marker in (
        "Safety and truth boundary",
        "No legitimate method guarantees control over a person",
        "The function exists—but it is governed, authorized, and assessed",
        "eight-step Target Audience Analysis Model",
        "Six-direction convergence",
        "The Six-Domain Coercive-Control Matrix",
        "Descriptive, not sequential",
        "No domain is required",
        "Observed harm does not prove coordinated authorship",
        "Evidence ladder for coercive-control analysis",
        "Open navigation menu",
        "Operation Mirror Current",
        "Convergence is not control",
        "Mandatory legal and ethical gates",
        "TM3_53x11.pdf",
        "adp3_13.pdf",
        "AJP-10.1%20EDA%20V1%20E.pdf",
    ):
        if marker not in influence:
            errors.append(f"PSYOP analysis division: missing marker {marker}")

    influence_script = (ROOT / "intelligence-officer" / "influence-analysis.js").read_text(encoding="utf-8")
    influence_without_comments = re.sub(r"/\*.*?\*/|//[^\n]*", "", influence_script, flags=re.S)
    influence_forbidden = {
        "fetch calls": r"(?<![\w])fetch\s*\(",
        "XMLHttpRequest": r"new\s+XMLHttpRequest",
        "WebSocket": r"new\s+WebSocket\s*\(",
        "localStorage": r"localStorage",
        "sessionStorage": r"sessionStorage",
        "eval": r"(?<![\w])eval\s*\(",
        "Function constructor": r"new\s+Function\s*\(",
    }
    for label, pattern in influence_forbidden.items():
        if re.search(pattern, influence_without_comments):
            errors.append(f"PSYOP analysis division: forbidden {label}")

    for page_name in (
        "index.html",
        "core-literacy.html",
        "collection-workbench.html",
        "strategy-investigations.html",
        "study.html",
        "sectors.html",
    ):
        page = ROOT / "intelligence-officer" / page_name
        if "influence-analysis.html" not in page.read_text(encoding="utf-8"):
            errors.append(f"PSYOP analysis division: missing navigation link from {page_name}")
    if "intelligence-officer/influence-analysis.html" not in (
        ROOT / "full-portfolio.html"
    ).read_text(encoding="utf-8"):
        errors.append("Full portfolio: PSYOP analysis division link is missing")

    strategy = (ROOT / "intelligence-officer" / "strategy-investigations.html").read_text(encoding="utf-8")
    strategy_counts = {
        'class="level-card ': 4,
        'class="relationship-cycle"': 1,
        'class="pattern-grid"': 1,
        'role="tab"': 4,
        'id="strategy-menu-toggle"': 1,
        'class="hamburger-lines"': 1,
    }
    for marker, expected in strategy_counts.items():
        actual = strategy.count(marker)
        if actual != expected:
            errors.append(
                f"Strategy investigations lab: expected {expected} occurrences of {marker}, found {actual}"
            )
    planning_block = strategy.split('class="planning-board"', maxsplit=1)[1].split(
        'class="decision-equation"', maxsplit=1
    )[0]
    if planning_block.count("<article>") != 9:
        errors.append("Strategy investigations lab: expected exactly nine planning tests")
    pattern_block = strategy.split('class="pattern-grid"', maxsplit=1)[1].split(
        '</section>', maxsplit=1
    )[0]
    if pattern_block.count("<article>") != 8:
        errors.append("Strategy investigations lab: expected exactly eight defensive-recognition patterns")
    relationship_block = strategy.split('class="relationship-cycle"', maxsplit=1)[1].split(
        'class="relationship-comparison"', maxsplit=1
    )[0]
    if relationship_block.count("<article>") != 6:
        errors.append("Strategy investigations lab: expected exactly six ethical relationship stages")
    for marker in (
        "Tactics are not strategy",
        "The nine-test decision matrix",
        "How statecraft moves through institutions",
        "Trust is an intelligence capability—and an obligation",
        "Eight patterns to recognize without overclaiming",
        "Operation Long Ledger",
        "Operation Broken Compass",
        "Operation Civic Bridge",
        "Operation Narrow Gate",
        "Observed, assessed, unproven",
        "No supplied transcript, audio performance, or video imagery is republished here",
    ):
        if marker not in strategy:
            errors.append(f"Strategy investigations lab: missing marker {marker}")

    strategy_script = (ROOT / "intelligence-officer" / "strategy-investigations.js").read_text(
        encoding="utf-8"
    )
    for marker, expected in {
        "hypotheses: [": 4,
        "evidence: [": 4,
        "required: [": 4,
        "leading: ": 4,
        "judgment: ": 4,
        "trigger: ": 4,
    }.items():
        actual = strategy_script.count(marker)
        if actual != expected:
            errors.append(
                f"Strategy investigations lab: expected {expected} case occurrences of {marker}, found {actual}"
            )
    strategy_without_comments = re.sub(r"/\*.*?\*/|//[^\n]*", "", strategy_script, flags=re.S)
    for label, pattern in {
        "fetch calls": r"(?<![\w])fetch\s*\(",
        "XMLHttpRequest": r"new\s+XMLHttpRequest",
        "WebSocket": r"new\s+WebSocket\s*\(",
        "localStorage": r"localStorage",
        "sessionStorage": r"sessionStorage",
        "eval": r"(?<![\w])eval\s*\(",
        "Function constructor": r"new\s+Function\s*\(",
    }.items():
        if re.search(pattern, strategy_without_comments):
            errors.append(f"Strategy investigations lab: forbidden {label}")

    for page_name in (
        "index.html",
        "core-literacy.html",
        "collection-workbench.html",
        "influence-analysis.html",
        "study.html",
        "sectors.html",
    ):
        page = ROOT / "intelligence-officer" / page_name
        if "strategy-investigations.html" not in page.read_text(encoding="utf-8"):
            errors.append(f"Strategy investigations lab: missing navigation link from {page_name}")
    if "intelligence-officer/strategy-investigations.html" not in (
        ROOT / "full-portfolio.html"
    ).read_text(encoding="utf-8"):
        errors.append("Full portfolio: strategy investigations lab link is missing")


def main() -> None:
    errors: list[str] = []
    validate_html(errors)
    validate_home(errors)
    validate_full_portfolio(errors)
    validate_general_it(errors)
    validate_geology(errors)
    validate_archaeology(errors)
    validate_science(errors)
    validate_space_science(errors)
    validate_soc_management(errors)
    validate_hamburger_navigation(errors)
    validate_atlas_upgrade(errors)
    validate_glass_meridian(errors)
    validate_reconstructing_system(errors)
    validate_intelligence_fieldbook(errors)
    if errors:
        for error in errors:
            print(f"FAIL: {error}")
        raise SystemExit(1)
    print(f"PASS: validated {len(HTML_FILES)} HTML pages")
    print("PASS: local links, IDs, landing and full-portfolio navigation, and external-tab safety")
    print("PASS: General IT Field Desk navigation, responsive UI, searchable libraries, safety boundary, and static-browser boundary")
    print("PASS: Geology Field Guide navigation, 20-domain architecture, 6-system energy module, plate lab, investigations, and static-browser boundary")
    print("PASS: Archaeology reference navigation, 39 chapters, 22 regions, PDF integrity, critical-evidence method, reader, and static-browser boundary")
    print("PASS: Science reference navigation, 28 disciplines, 4 inquiry investigations, PDF integrity, reader, and static-browser boundary")
    print("PASS: Space Science mission desk has 26 divisions, all 650 eight-page subjects, 5,294-page PDF integrity, orbit lab, reader, and landing feature")
    print("PASS: SOC Management recruiter path, four-role model, decision room, command dashboard, governance, reporting, and evidence boundary")
    print("PASS: persistent three-line hamburger opens complete navigation on desktop and mobile")
    print("PASS: Glass Meridian structure, 30-report model, and no-network boundary")
    print("PASS: Reconstructing the System links, truth boundary, package, and manuscript hash")
    print("PASS: intelligence fieldbook has 22 sectors, 88 priority questions, 30 source profiles, and 66 decision gates")
    print("PASS: core literacy lab has 22 examples, 66 questions, and 22 operational data requests")
    print("PASS: collection workbench has 3 requirements, 3 hypotheses, 12 evidence records, and 12 indicators")
    print("PASS: PSYOP division has doctrine gates, 6-direction influence analysis, 6-domain coercive-control analysis, 6 roles, and 12 indicators")
    print("PASS: strategy lab has 4 levels, 9 planning tests, 8 defensive patterns, and 4 interactive investigations")


if __name__ == "__main__":
    main()
