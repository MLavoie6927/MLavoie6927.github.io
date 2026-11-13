"""Build the browser-side history directory from the supplied PDF outline.

The generated JavaScript contains only navigation metadata: titles, periods,
analytic lenses, and verified PDF destinations. The PDF remains the canonical
content artifact.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader


def outline_entries(reader: PdfReader):
    entries = []

    def walk(items):
        for item in items:
            if isinstance(item, list):
                walk(item)
                continue
            try:
                page = reader.get_destination_page_number(item) + 1
            except Exception:
                continue
            entries.append((getattr(item, "title", str(item)), page))

    walk(reader.outline)
    return entries


def page_lines(reader: PdfReader, page: int):
    text = reader.pages[page - 1].extract_text() or ""
    return [re.sub(r"\s+", " ", line).strip() for line in text.splitlines() if line.strip()]


def generation_record(reader: PdfReader, title: str, page: int):
    number = int(re.search(r"Generation (\d{3})", title, re.I).group(1))
    lines = page_lines(reader, page)
    marker_index = next(i for i, line in enumerate(lines) if re.search(rf"GENERATION {number:03d}\s*\|", line, re.I))
    marker = lines[marker_index]
    period = marker.split("|", 1)[1].strip()
    heading = lines[marker_index + 1] if marker_index + 1 < len(lines) else "Chronological generation"
    return {
        "kind": "generation",
        "number": number,
        "title": heading,
        "period": period,
        "page": page,
        "lens": "Nine-region chronology",
    }


def study_record(reader: PdfReader, title: str, page: int):
    match = re.match(r"(\d{2})\.\s*(.+)", title)
    number = int(match.group(1))
    clean_title = match.group(2).strip()
    lines = page_lines(reader, page)
    period = "Deep influence study"
    for line in lines:
        if " | " in line and re.search(r"\b(?:BCE|CE)\b", line):
            period = line
            break
    return {
        "kind": "study",
        "number": number,
        "title": clean_title,
        "period": period,
        "page": page,
        "lens": "Named human influence",
    }


def dossier_record(reader: PdfReader, title: str, page: int):
    number = int(re.search(r"Case (\d{3})", title, re.I).group(1))
    lines = page_lines(reader, page)
    link_index = next((i for i, line in enumerate(lines) if line == "CHRONOLOGY / DOCUMENT LINK"), -1)
    period_line_index = next((i for i, line in enumerate(lines) if "Original generation" in line and "PDF page" in line), -1)
    period = "Historical influence dossier"
    heading = re.sub(r"^Case \d{3}\s*-\s*", "", title, flags=re.I).strip()
    if period_line_index >= 0:
        period = lines[period_line_index].split("|", 1)[0].strip()
        if link_index > period_line_index + 1:
            heading = " ".join(lines[period_line_index + 1 : link_index]).strip()
    lens = "Historical influence"
    lens_line = next((line for line in lines if "Analytic lens:" in line), "")
    if lens_line:
        lens = lens_line.split("Analytic lens:", 1)[1].strip()
    return {
        "kind": "dossier",
        "number": number,
        "title": heading,
        "period": period,
        "page": page,
        "lens": lens,
    }


def main():
    if len(sys.argv) != 3:
        raise SystemExit("usage: build_history_data.py SOURCE.pdf OUTPUT.js")

    source = Path(sys.argv[1]).resolve()
    output = Path(sys.argv[2]).resolve()
    reader = PdfReader(str(source))
    entries = outline_entries(reader)

    generations = [generation_record(reader, title, page) for title, page in entries if title.startswith("Generation ")]
    studies = [study_record(reader, title, page) for title, page in entries if re.match(r"\d{2}\.\s", title)]
    dossiers = [dossier_record(reader, title, page) for title, page in entries if title.startswith("Case ")]

    coda_page = next(page for title, page in entries if title.startswith("2026 coda"))
    coda = {
        "kind": "coda",
        "number": 1,
        "title": "The year 2026: named decisions and climatic change",
        "period": "November 2026",
        "page": coda_page,
        "lens": "Current history remains provisional",
    }

    if len(generations) != 201 or len(studies) != 17 or len(dossiers) != 159:
        raise ValueError(
            f"unexpected directory counts: generations={len(generations)}, "
            f"studies={len(studies)}, dossiers={len(dossiers)}"
        )

    records = generations + [coda] + studies + dossiers
    payload = {
        "sourcePages": len(reader.pages),
        "outlineDestinations": len(entries),
        "records": records,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        "window.HISTORY_ATLAS = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    print(
        f"WROTE {output} with {len(records)} records: "
        f"{len(generations)} generations, 1 coda, {len(studies)} studies, {len(dossiers)} dossiers"
    )


if __name__ == "__main__":
    main()
