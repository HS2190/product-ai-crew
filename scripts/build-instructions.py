#!/usr/bin/env python3
"""CLAUDE.md · agents/*/CLAUDE.md · workflows/*.md 를 합쳐 product-ai-crew-instructions.md 를 만든다.

claude.ai 프로젝트의 Project Instructions에 붙여 넣는 합본이다.
원본 파일이 정본이므로, 원본을 고친 뒤 다시 실행한다.

    python3 scripts/build-instructions.py
"""
import glob, io, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "product-ai-crew-instructions.md")

SECTIONS = [
    ("0. 크루 설정 (crew.config.md)", "crew.config.md"),
    ("1. 오케스트레이터 (Orchestrator)", "CLAUDE.md"),
    ("1-1. 모든 에이전트 공통", "agents/_common.md"),
    ("2. Researcher (리서치 수집·종합자)", "agents/researcher/CLAUDE.md"),
    ("3. PM (Product Manager)", "agents/pm/CLAUDE.md"),
    ("4. 서비스 기획자 (Product Planner)", "agents/planner/CLAUDE.md"),
    ("5. UX 라이터 (UX Writer)", "agents/ux-writer/CLAUDE.md"),
    ("6. 디자이너 (Product Designer)", "agents/designer/CLAUDE.md"),
    ("7. Engineer (프론트엔드 구현자)", "agents/engineer/CLAUDE.md"),
    ("8. QA (품질 검증)", "agents/qa/CLAUDE.md"),
    ("9. Reviewer (산출물 검수자)", "agents/reviewer/CLAUDE.md"),
]
WORKFLOWS = [
    "workflows/research-process.md",
    "workflows/full-process.md",
    "workflows/plan-process.md",
    "workflows/quick-design.md",
    "workflows/build-process.md",
    "workflows/ux-writing.md",
    "workflows/custom-flow.md",
]

HEADER = """# Product AI Crew — 통합 Instructions

> Claude 프로젝트용 통합 Instructions 파일입니다.
> 오케스트레이터 · Researcher · PM · 기획자 · UX라이터 · 디자이너 · Engineer · QA · Reviewer · 워크플로우를 하나의 파일에 담았습니다.
>
> **대상**: 디자이너 한 명이 리서치부터 구현 · 검증까지 돌리는 범용 제품팀. 회사 conventions에 디자인 시스템을 붙이거나, 없으면 디자인 스킬을 골라 쓴다.
> **파이프라인 (FULL)**: Researcher → PM → 기획자 → UX라이터 → 디자이너 → (가상 사용자 점검) → Engineer → QA
> 각 생성 단계 산출물은 **존재 검증(1단계) → Reviewer 내용 비평(2단계)** 게이트를 통과한다.
> 시스템 범위는 리서치부터 **동작하는 프론트엔드 구현 · 검증**까지이며(백엔드·DB·API는 범위 밖, 데이터는 mock/정적), FULL 모드의 최종 산출물은 Engineer의 구현 코드와 QA의 테스트 케이스 · 리포트다.
>
> 이 파일은 `scripts/build-instructions.py`가 개별 정본 파일(`CLAUDE.md`, `agents/*/CLAUDE.md`, `workflows/*.md`)을 합쳐 생성한다. 직접 수정하지 말고 원본을 고친 뒤 다시 생성한다. 내용이 어긋나면 개별 파일이 우선한다.
"""


def read(rel):
    return io.open(os.path.join(ROOT, rel), encoding="utf-8").read()


def strip_title(text):
    """맨 앞의 H1 한 줄을 뗀다."""
    lines = text.lstrip("\n").split("\n")
    if lines and lines[0].startswith("# "):
        lines = lines[1:]
    return "\n".join(lines).strip("\n")


def demote(text):
    """코드 블록 밖의 제목을 한 단계씩 내린다 (# → ##)."""
    out, fence = [], False
    for line in text.split("\n"):
        if re.match(r"^\s*(```|~~~)", line):
            fence = not fence
        elif not fence and re.match(r"^#{1,5} ", line):
            line = "#" + line
        out.append(line)
    return "\n".join(out)


def main():
    parts = [HEADER.rstrip()]
    for title, rel in SECTIONS:
        parts.append(f"---\n\n# {title}\n\n{strip_title(read(rel))}")
    for rel in sorted(glob.glob(os.path.join(ROOT, "agents", "*", "SOLO.md"))):
        rel = os.path.relpath(rel, ROOT)
        parts.append(f"---\n\n# 부록 · {rel.split(os.sep)[1]} SOLO\n\n{strip_title(read(rel))}")
    wf = ["# 10. 워크플로우", "", "모드별 워크플로우 정의다. 각 워크플로우의 단계마다 존재 검증 + Reviewer 검수를 거친다."]
    for rel in WORKFLOWS:
        wf += ["", demote(read(rel).strip("\n"))]
    parts.append("---\n\n" + "\n".join(wf))
    body = "\n\n".join(parts) + "\n"
    io.open(OUT, "w", encoding="utf-8").write(body)
    print(f"생성: {os.path.relpath(OUT, ROOT)} ({body.count(chr(10))}줄)")


if __name__ == "__main__":
    main()
