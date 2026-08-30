# MIDAD_ARCHITECTURE — Core Architecture (Authoritative, Concise)

This file states only the durable architectural facts needed to avoid re-discovery. Detailed historical rationale lives in `docs/architecture/*` and `docs/gates/*`; do not duplicate it here.

## Major architecture
Full-stack: React 19 + Vite 7 + TypeScript client, Express + tRPC server, Drizzle ORM, Wouter router, Tailwind v4, lucide-react. Client-heavy: the canonical teaching-board domain model lives entirely in `client/src/lib/*` as framework-independent modules; React components are thin adapters over it.

## Core state model
- **`BoardDocument`** (`client/src/lib/coreBoard.ts`) — the single canonical document: `id`, `title`, `version`, `schemaVersion`, `pages[]` (each with `objects: CoreObject[]` and its own `viewport`), `activePageId`, `context` (subject/category/level), `classroom` (`ClassroomLessonState`).
- **`CoreObject`** — the one object shape for every teaching object type (`TextObject`, `SentenceObject`, `EquationObject`, `ShapeObject`, `GraphObject`, `QuestionObject`, `ActivityObject`, `GroupObject`, `DrawingObject`, plus reusable result types `WordObject`/`I3rabObject`/`ExplanationObject`/`SolutionStepsObject`/`PoetryObject`). Fields: `id, type, position, size, rotation, zIndex, content, data?, style, metadata (incl. locked/visible/version/source), capabilities[], schemaVersion, transform, source?, createdAt, updatedAt, stroke?, childIds?, children?`.
- **Object registry** (`client/src/lib/objectRegistry.ts`) — owns per-type schema, factory, capability list, validation, and render-metadata. This is the **only** factory/registry; never create a second one for a new object type.
- **Educational contract** (`client/src/lib/educationalObjects.ts`) — framework-independent capability vocabulary (`movable`, `resizable`, `editable`, `duplicable`, `groupable`, `interactive`, `assessable`, `presentable`, etc.) and `hasCapability()` gate used everywhere instead of ad-hoc type checks.

## Interaction model
- **`client/src/lib/canvasInteraction.ts`** — pure functions over `CoreObject[]`: select/hit-test/move/resize/duplicate/group/ungroup/reorder/patch/delete. No React, no DOM — fully unit-testable.
- **`client/src/components/TeacherCanvas.tsx`** — the only direct-manipulation surface. Owns local UI state (`tool`, `zoom`, `pan`, `drag`, `history`/`future` for undo-redo, `clipboard`) and wires pointer/keyboard events to `canvasInteraction.ts`.
- **Pan/zoom/fit (added in `09ae531`)**: `.core-stage` (outer, holds `stageRef`, untransformed) wraps `.canvas-viewport` (inner, `transform: translate(pan.x, pan.y) scale(zoom)`, `transform-origin: top right` for RTL). **Critical invariant**: `pointerPosition()` computes coordinates relative to the untransformed `stageRef`, never the transformed inner viewport — this is what keeps select/drag/resize mathematically correct at any zoom/pan level. Any future canvas change must preserve this separation; do not move `stageRef` onto the transformed element.
- **Contextual actions** (`client/src/lib/contextualActions.ts`) — declarative `type → ContextualActionId[]` map with capability-gated availability; UI-facing labels only (تحليل/إعراب/شرح/تدريب/تقييم/…). This is the extension point for new subject-aware actions — add a map entry, not a new UI subsystem.
- **Known pre-existing quirk**: an RTL X-axis drag-direction inversion (mouse `+80px` → object bounding-box `-80px` on the same axis) exists at `zoom=1` with no pan/zoom involved, confirmed present before the pan/zoom milestone (`12b09b5`). Likely in the RTL positioning model (`position.x` semantics vs. `right:` CSS placement in `TeacherCanvas.tsx`'s object render — `style={{ right: item.position.x, ... }}`). Flagged for Milestone A, not yet fixed.

## AI integration boundaries
- Server-side only: `server/educationalAssistant.ts` exposes a structured tRPC contract (explicit `intent`, `evidenceClass`, `verificationState`, `provenance`, fail-closed on malformed output) — never a raw passthrough chatbot.
- Client renders it via `EducationalAssistantPanel.tsx` / `AIChatBox.tsx`. Generated content requires teacher review before becoming board content — enforced by `assistantReviewStore.ts`/`teacherReview.ts` (`GENERATE → REVIEW → APPROVE → PUBLISH`).
- No AI-generated content bypasses this path into `BoardDocument` today. Any future AI feature must route through the same reviewed-object pattern, not a new bypass.

## Real-time / classroom architecture
Not yet implemented. Current "classroom" is single-device: `client/src/lib/classroomLoop.ts` models source→activity→attempt→assessment→feedback→teacher-review→retry entirely in local `BoardDocument.classroom` state. There is no live session/socket/multi-device sync layer yet (Milestone D, not started).

## Persistence
Local-first only. `coreBoard.ts` + `objectMigrations.ts` (`safeParseBoardDocument`) handle save/restore/export/import with fail-closed handling of malformed/duplicate/unsupported/legacy payloads. No cloud storage, no multi-user accounts, no auth beyond the existing `server/_core` scaffold. Do not add cloud sync before Milestone D/E preconditions are met (§23 "one-device principle", §5 roadmap gating).

## Provenance
`CoreObject.source`, `metadata.version`, and per-result-type `provenanceLabel`/`sourceObjectId`/`sourceVersion` fields trace teacher-entered vs. AI-generated vs. derived content end-to-end. `contextualActions.ts`'s `ContextualActionResult.provenance` is the canonical shape for any new derived-object action.

## Security boundaries
Teacher View vs. Student View vs. Presentation View are three separate render branches in `TeacherProductShell.tsx` (`viewMode: "teacher" | "student" | "presentation"`), each a distinct JSX return — not a CSS-hidden overlay. Student/Presentation views never render `TeacherCanvas` (confirmed zero `canvas-viewport`/`.core-toolbar` elements leak into them, verified in the `09ae531` QA gate). No teacher-only object metadata, AI prompts, or internal IDs are exposed to students today. No multi-tenant/auth boundary exists yet — do not claim one.
