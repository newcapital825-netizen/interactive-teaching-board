# MIDAD_ROADMAP — P0/P1/P2/P3 (Authoritative, Concise)

Full milestone definitions (A–F) are in MIDAD-POS-V3 §31–§37. This file tracks only priority bucket and current pointer.

## P0 — Blockers (anything preventing reliable classroom use)
- [ ] Real human pilot validation (3 teachers + 5 students) — still 0 real sessions; product remains **PILOT CANDIDATE — HUMAN VALIDATION REQUIRED**, not release-ready, regardless of automated test counts.
- [ ] RTL X-axis drag-direction quirk (confirmed pre-existing, not urgent-breaking but affects "does the object move where the teacher expects" — candidate for Milestone A).

## P1 — Core product
1. **Object manipulation perfection** (Milestone A) — investigate/fix the RTL drag quirk; re-verify selection/resize/duplicate/group/ungroup/contextual actions remain correct under zoom/pan/fit/RTL. *Recommended next milestone — awaiting owner authorization.*
2. **Contextual interaction** — extend `contextualActions.ts` map coverage as new object types are added; keep it capability-gated, not a growing flat menu.
3. **Teaching media layer** (Milestone B) — video/PDF/image/camera/web resource objects integrated into the existing `CoreObject`/registry model. Not started.
4. **AI Teaching Copilot** (Milestone C) — contextual, Arabic-aware, generate→review→approve→publish. Partially present (server contract + review store exist); full contextual/board-aware copilot not started.
5. **Student interaction** — current Student View is read-only preview + ClassroomLoop attempt/feedback; richer live interaction depends on Milestone D (live classroom).

## P2 — Classroom intelligence
- Live sessions (Milestone D) — not started; no session/join/sync layer exists yet.
- Formative assessment / response analysis (Milestone E) — bounded deterministic assessment exists for the two verified equations and the bounded Arabic slice; general response analysis/adaptive assistance not started.

## P3 — Polish
- Advanced accessibility (screen reader, full WCAG) — NOT VERIFIED, not started beyond keyboard/RTL smoke.
- Performance optimization beyond current bundle-splitting (Gate 16) — baseline done; real-device/production-network profiling NOT VERIFIED.
- Advanced analytics, visual refinement, additional integrations — explicitly deferred; do not start before P0/P1 close per §46 "no premature polish."

## Current pointer
Last closed: `09ae531` pan/zoom QA gate (no regression, no new commit). Next recommended (not yet authorized): Milestone A, scoped to the RTL X-axis drag-direction investigation only — smallest coordinate-mapping fix if confirmed, no canvas rewrite, no unrelated feature additions.
