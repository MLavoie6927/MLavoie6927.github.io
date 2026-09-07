from __future__ import annotations
import json
from pathlib import Path
from typing import Any

def load_json(path: str | Path) -> Any:
    with Path(path).open('r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path: str | Path, data: Any) -> None:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with p.open('w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
