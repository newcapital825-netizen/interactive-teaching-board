# MIDAD_PRODUCT_SPEC — مِداد Product Spec (Authoritative, Concise)

This file is the persistent, cross-session product memory required by MIDAD-POS-V3 §3–§4. It does not duplicate the narrative history in root-level Gate reports or `docs/gates/*` — those remain the detailed historical record. This file states only what governs future decisions.

## Vision
مِداد is the teacher's **one intelligent teaching environment** — not another whiteboard. One screen, one teacher, one lesson. Every feature must connect to an actual classroom workflow (prepare → teach → assess → continue); features that are decorative, redundant, or educationally disconnected are rejected regardless of how impressive they look.

## Target users
- **Primary:** the classroom teacher (Arabic-first, RTL-native), preparing and running a live lesson on one device/display.
- **Secondary:** students, in a deliberately simplified Student View — never a copy of the teacher's full interface.

## Core workflows (must remain coherent across all future milestones)
1. **Prepare** — import/organize/research/ask AI/create activities/arrange lesson.
2. **Teach** — write/draw/explain/show/annotate/ask/interact, live on the canvas.
3. **Assess** — question/collect responses/identify mistakes/explain misconceptions.
4. **Continue** — save/review/reuse/improve across sessions.

## Design principles
- Canvas is the teaching environment, not a drawing surface with tools bolted around it.
- Progressive disclosure over tool density: a few primary tools always visible; the rest appear contextually based on selection.
- Teacher-first, student-useful, Arabic-first, RTL-native, visually calm ("paper-and-olive" identity established in prior checkpoints) — not decorative for its own sake.

## AI principles
- AI is a **contextual teaching copilot**, aware of board/selection/lesson context — never a generic bolted-on chatbot.
- Output flow is `GENERATE → REVIEW → APPROVE → PUBLISH`, never raw AI output silently becoming student-facing content.
- No fabricated citations. Uncertain generated content is never presented as verified fact. Provenance (source → transformation → AI generation → teacher approval → student publication) must stay traceable without cluttering the UI.

## Classroom principles
- Design for real classroom conditions: large displays, weak Wi-Fi, interruptions, accidental refresh, touch/mouse/keyboard, Arabic input, quick teacher decisions.
- Local-first autosave and graceful degradation for anything network-dependent; never pretend a network feature is offline-capable.
- Strict separation of Teacher View / Student View / Presentation View — no teacher-control leakage into either.

## Technical principles
- One canonical domain model (`BoardDocument` / `CoreObject` / object registry). Never fork a second object model, registry, or assessment path for a new capability.
- Deterministic, bounded behavior preferred over speculative generative behavior wherever correctness can be established (see current bounded Arabic/Mathematics/poetry slices).
- Architecture changes only when a current limitation is documented, alternatives evaluated, and the smallest safe migration is chosen with regression tests — never a rewrite for aesthetic reasons.
- Credit-conscious development loop (INSPECT → ONE GAP → ACCEPTANCE CRITERIA → MINIMUM CHANGE → IMPLEMENT → TEST → VISUAL QA → DOCUMENT → COMMIT → PUSH → STOP). Never analyze/build everything at once.

## Non-goals (explicitly out of scope until a real demonstrated need)
General NLP/symbolic-math engines, custom video-conferencing platform, speculative competitor-parity features, premature visual redesign/polish while core interaction gaps remain open.
