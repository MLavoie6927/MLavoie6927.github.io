from __future__ import annotations
from dataclasses import dataclass
from typing import Any

@dataclass(frozen=True)
class ValidationFinding:
    level: str
    code: str
    message: str

@dataclass(frozen=True)
class TriageResult:
    scenario_id: str
    severity: str
    fault_domain: str
    next_actions: list[str]
    evidence: list[str]
    escalation: str

@dataclass(frozen=True)
class HealthSummary:
    districts: int
    sites: int
    devices: int
    open_tickets: int
    score: int
    warnings: list[str]
