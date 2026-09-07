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
    path for path in ROOT.rglob("index.html")
    if ".git" not in path.parts and "work" not in path.parts
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
    if not nav or nav.group(1).count("<li>") > 8:
        errors.append("index.html: primary navigation must contain no more than eight choices")
    for marker in (
        'id="featured-projects"',
        'id="project-library"',
        'id="skills"',
        'rel="canonical" href="https://mlavoie6927.github.io/"',
        'projects/operation-glass-meridian/',
        'projects/k12-network-operations/',
    ):
        if marker not in text:
            errors.append(f"index.html: missing required recruiter-first marker {marker}")


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


def main() -> None:
    errors: list[str] = []
    validate_html(errors)
    validate_home(errors)
    validate_glass_meridian(errors)
    if errors:
        for error in errors:
            print(f"FAIL: {error}")
        raise SystemExit(1)
    print(f"PASS: validated {len(HTML_FILES)} HTML pages")
    print("PASS: local links, IDs, recruiter navigation, and external-tab safety")
    print("PASS: Glass Meridian structure, 30-report model, and no-network boundary")


if __name__ == "__main__":
    main()
