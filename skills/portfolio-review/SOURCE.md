# Source & attribution

- **Upstream**: https://github.com/wonjyou/portfolio-review-skill
- **Author**: Won J. You · **License**: MIT
- **Commit installed**: `904489d` (2026-04-13)

## Repair applied on install

The upstream `SKILL.md` was published in a rich-text-escaped form that does not parse
as a Claude Code skill. Fixed on install, content unchanged:

1. YAML frontmatter delimiters were `\---` → the skill had **no valid frontmatter**,
   so it would never load or auto-trigger. Rebuilt as a clean `name` / `description` block.
2. Un-escaped 1,150+ backslash-escaped markdown characters (`\*` ×706, `\-` ×268,
   `\[` ×87, `\#` ×45, `` \` `` ×26) — all 45 headings, every list, and all bold spans
   were inert text.
3. Removed `&#x20;` HTML entities left in the frontmatter.
4. Removed blank lines between table rows — the level-calibration and rubric tables
   were broken into unrelated paragraphs.
5. Rejoined hard-wrapped prose paragraphs split mid-sentence by blank lines.
6. Collapsed triple-blank runs and de-double-spaced the HTML export template.

Net: 2,093 lines → 1,045 lines, identical content, valid skill.

## What it does

5-step review workflow: context gathering → ingestion (WebFetch for URLs, Read for PDFs)
→ level calibration (junior→director rubric) → 10-dimension evaluation (3A–3J) with
🔴/🟡/🟢 severity codes → fixed-format report + optional self-contained HTML export.

`example/` holds the author's sample output for calibration.
