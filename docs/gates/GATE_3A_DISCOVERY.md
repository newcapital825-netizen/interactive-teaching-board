# Gate 3A Discovery — Universal Educational Object Engine

## Baseline and scope

يعتمد Gate 3A على `main` عند `d24e3fcf925bc61b51e34b7aa42552fd062d1bf6`، وهو baseline الذي يتضمن دمج Gate 2 وتوثيق merge verification. تم إنشاء فرع العمل `feature/gate-3a-educational-object-engine` من هذا الـSHA. لا يغير Gate 3A `main`، ولا يختار محرك Canvas، ولا يبدأ Arabic Toolkit أو Math Toolkit أو AI.

الهدف هو إضافة أصغر طبقة عامة تثبت أن لوحة واحدة تستطيع استضافة أنواع تعليمية متعددة مع عقد مستقل، قدرات صريحة، registry، lifecycle، versioning، serialization، وقواعد امتداد قابلة للاختبار.

## Current architecture

| Area | Current implementation | Gate 3A implication |
|---|---|---|
| Board state | `BoardDocument` → `BoardPage` → `CoreObject[]` in `client/src/lib/coreBoard.ts` | Preserve document/page state and introduce an additive engine boundary |
| Core object | `CoreObject` has id, type, position, size, rotation, zIndex, content, style, metadata, optional stroke/group children | Refactor into a stable framework-independent contract without renderer dependencies |
| Object creation | `createObject(type, content, x, y)` with a central union and conditional defaults | Move type-specific defaults and validation behind registry definitions |
| Rendering | `CoreBoardBench.tsx` renders objects with React DOM and pointer handlers | Keep React as a renderer adapter; domain must not import React or DOM |
| Canvas adapter | No selected third-party Canvas engine; Gate 2 uses a DOM proof surface | Preserve vendor-neutral adapter seam; do not introduce tldraw/Excalidraw |
| Graph adapter | Gate 1B established React Flow as a future Graph Adapter boundary; current Gate 2 object is `GraphObject` | Keep graph data and rendering separate |
| Persistence | JSON to `localStorage` through `persistDocument`/`restoreDocument` | Add versioned envelopes, safe parsing, migration, and unknown-type retention |
| Selection and grouping | UI-owned selected IDs, local clipboard, GroupObject with child IDs and child snapshots | Keep UI interaction behavior while capability-gating operations |
| Undo/redo | UI snapshot history in `CoreBoardBench.tsx` | Contract operations must remain compatible with document snapshots |
| Pages | Create, duplicate, delete, rename, reorder, switch | No page redesign required; registry operates within page objects |
| Commands | `resolveBoardCommand` maps keyboard events to commands and protects text editing | New actions must respect existing command and accessibility boundaries |

## Reusable components and evidence

`coreBoard.ts` is the principal reusable domain location. `CoreBoardBench.tsx` is reusable as the existing teacher-facing proof surface, but its type-specific rendering and action assumptions are extension points rather than the new domain contract. Existing tests provide regression evidence for identity, serialization, group child scaling, vector strokes, performance, and keyboard command parity. Existing Gate 2 reports define the accepted limitations: touch, stylus, browser UI automation, and real browser performance are not verified.

The following object families already have proof coverage and must be refactored rather than duplicated:

| Existing object | Current proof | Planned Gate 3A treatment |
|---|---|---|
| `TextObject` | Mixed RTL/LTR content in Core Board | Generic registered text definition |
| `ShapeObject` | Shape insertion and resize | Generic registered shape definition |
| `ImageObject` | Image placeholder | Registered placeholder definition |
| `SentenceObject` | Arabic sentence content and Gate 1B contract | Cross-subject registered definition; no Arabic engine |
| `EquationObject` | Mathematical expression content | Cross-subject registered definition; no solver |
| `GraphObject` | Graph/Concept proof boundary | Registered graph definition with adapter metadata only |

## Current limitations

The current model uses one broad `CoreObject` shape for every type, stores content as a string, uses metadata versioning rather than a document-level schema migration mechanism, and has no centralized validation or registry. UI code assumes operations based on object type and selected state instead of declared capabilities. Unknown serialized types are not modeled as retained safe objects. Question and Activity foundations are absent. Transformations are implicit in group copying rather than represented as controlled domain relationships.

Gate 2 remains behaviorally valuable and must not be replaced wholesale. The implementation must preserve local-first persistence, stable IDs through restore, new IDs for duplication, group resize behavior, pages, keyboard safety, and the existing teacher-facing surface.

## Architectural risks

| Risk | Why it matters | Mitigation in Gate 3A |
|---|---|---|
| Central conditional tree | New subject types could force Core Board edits | Registry owns schema, factory, capabilities, validation, and adapters |
| Renderer leakage | Domain becomes coupled to React or a canvas vendor | Keep adapters typed by plain domain representations |
| Silent data loss | Future versions or unknown types could discard teacher content | Versioned envelope plus `UnknownEducationalObject` retention and explicit diagnostics |
| Capability overreach | UI may show unsupported actions | Every operation checks declared capabilities |
| ID instability | Restore or duplicate can break references | Preserve IDs on restore; generate IDs only for duplication |
| Migration corruption | Schema changes can alter semantics silently | Pure migration functions with fixture tests and safe failure |
| Overengineering | Framework obscures the milestone | Use plain TypeScript maps, narrow interfaces, and no new dependency |
| Gate 2 regression | Refactor could break board interactions | Keep existing tests and add Gate 2 regression suite against the refactored contract |

## Recommended extension points

1. `client/src/lib/educationalObjects.ts`: framework-independent contract, capabilities, lifecycle helpers, schema envelope, validation, and safe unknown-object representation.
2. `client/src/lib/objectRegistry.ts`: registry definitions and resolution by object type; no React or DOM imports.
3. `client/src/lib/objectMigrations.ts`: explicit schema migration functions and migration diagnostics.
4. `client/src/lib/objectTransformations.ts`: controlled transformation requests and representation descriptors, not uncontrolled cloning.
5. `client/src/lib/objectAdapters.ts`: plain renderer/persistence adapter contracts; concrete React rendering remains outside the domain.
6. `client/src/lib/genericObjects.ts`: QuestionObject and ActivityObject definitions plus cross-subject proof factories.
7. `tests/educational-object-engine.test.ts`: reusable contract tests covering lifecycle, capabilities, registry, migration, serialization, unknown types, and transformations.
8. `docs/architecture/`: explain the contract and extension recipe, while `CoreBoardBench.tsx` consumes the registry through a small compatibility layer.

## Discovery decision

لا يوجد blocking architectural issue يمنع الاستمرار. القرار هو **CONTINUE** مع refactor additive ومحافظ على Gate 2، باستخدام registry بسيط وعقود plain TypeScript، وتوثيق حدود ما لا يتم بناؤه في Gate 3A. أي criterion لا يثبت بالفحوص سيبقى `CONDITIONAL` في التقرير النهائي.
