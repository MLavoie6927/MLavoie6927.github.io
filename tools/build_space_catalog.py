from __future__ import annotations

import argparse
import json
from pathlib import Path

from pypdf import PdfReader


def flatten_outline(reader: PdfReader) -> list[tuple[int, str, int]]:
    flattened: list[tuple[int, str, int]] = []

    def walk(items: list[object], depth: int = 0) -> None:
        index = 0
        while index < len(items):
            item = items[index]
            if isinstance(item, list):
                walk(item, depth + 1)
                index += 1
                continue

            title = getattr(item, "title", str(item))
            page = reader.get_destination_page_number(item) + 1
            flattened.append((depth, title, page))

            if index + 1 < len(items) and isinstance(items[index + 1], list):
                walk(items[index + 1], depth + 1)
                index += 2
            else:
                index += 1

    walk(reader.outline)
    return flattened


def build_catalog(source: Path) -> dict[str, object]:
    reader = PdfReader(str(source))
    outline = flatten_outline(reader)
    divisions: list[dict[str, object]] = []
    subjects: list[dict[str, object]] = []
    current_division = 0

    for depth, raw_title, page in outline:
        if depth == 0:
            if len(divisions) >= 26:
                current_division = 0
                continue
            number_text, title = raw_title.split(". ", 1)
            current_division = int(number_text)
            divisions.append(
                {
                    "id": current_division,
                    "code": f"{current_division:02d}",
                    "title": title,
                    "page": page,
                    "subjects": 25,
                }
            )
            continue

        if depth != 1 or current_division == 0:
            continue

        code, title = raw_title.split("  ", 1)
        subjects.append(
            {
                "id": code.strip(),
                "title": title.strip(),
                "page": page,
                "endPage": page + 7,
                "division": current_division,
            }
        )

    if len(divisions) != 26:
        raise ValueError(f"Expected 26 divisions, found {len(divisions)}")
    if len(subjects) != 650:
        raise ValueError(f"Expected 650 subjects, found {len(subjects)}")
    if len({item["id"] for item in subjects}) != 650:
        raise ValueError("Subject identifiers are not unique")

    return {"divisions": divisions, "subjects": subjects}


def main() -> None:
    parser = argparse.ArgumentParser(description="Build the Space Science catalog from PDF bookmarks.")
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    catalog = build_catalog(args.source)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(catalog, ensure_ascii=False, separators=(",", ":"))
    args.output.write_text(
        "window.SPACE_SCIENCE_CATALOG=" + payload + ";\n",
        encoding="utf-8",
        newline="\n",
    )
    print(
        f"Wrote {len(catalog['divisions'])} divisions and "
        f"{len(catalog['subjects'])} subjects to {args.output}"
    )


if __name__ == "__main__":
    main()
