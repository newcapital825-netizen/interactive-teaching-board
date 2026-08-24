# TODO — Gate 1 Spike

## Completed

- [x] Initialize disposable React 19 + TypeScript spike project.
- [x] Document the selected design direction in `ideas.md`.
- [x] Build ARABIC CORE OBJECT PROTOTYPE.
- [x] Demonstrate Arabic RTL text and word selection.
- [x] Demonstrate deterministic basic analysis fixture.
- [x] Demonstrate SentenceObject independent from Canvas State.
- [x] Demonstrate visual Grammar/I3rab tree and Graph Adapter boundary.
- [x] Demonstrate pointer move/resize, edit, undo/redo, save/reload path, and JSON export.
- [x] Run TypeScript check and production build.
- [x] Capture desktop and mobile visual evidence.
- [x] Write Gate 1 report and ADR.

## Deferred before Gate 2

- [ ] Obtain owner decision to continue the additional proof pass.
- [ ] Integrate tldraw candidate with the same Educational Object.
- [ ] Integrate Excalidraw candidate with the same Educational Object.
- [ ] Integrate React Flow inside a candidate canvas object rather than only as an external adapter.
- [ ] Run reproducible performance scenario with documented object/node counts.
- [ ] Test touch on a real touch device and evaluate stylus/pointer limitations.
- [ ] Complete accessibility smoke test for canvas and graph keyboard semantics.
- [ ] Complete legal and commercial review of licenses and production cost.

## Explicitly not started

Authentication, billing implementation, AI, OCR, PDF Intelligence, real-time collaboration, classroom infrastructure, analytics, production content library, full Arabic NLP, and deployment optimization.

## New owner instruction — pending review

- [x] قراءة وتحليل تعليمات `pasted_content_4.txt` ثم تنفيذ نطاقها المصرح به فقط.

## Gate 1B — additional architectural proof

- [x] Freeze the existing SentenceObject and identical Arabic test scenario across candidates.
- [x] Evaluate tldraw and Excalidraw as Canvas Adapter candidates without selecting a winner prematurely; direct integration remains deferred and is recorded honestly.
- [x] Evaluate React Flow as a specialized Graph Adapter for Grammar/I3rab, not as a primary canvas replacement.
- [x] Record coupling, persistence, export, RTL, touch/pointer/stylus, accessibility, and performance evidence.
- [x] Produce `GATE_1B_REPORT.md` with comparison matrix, architecture diagram, risks, recommendation, and Gate 2 preconditions.
- [x] Stop after Gate 1B and wait for explicit owner approval.

## Owner architecture diagram — pending implementation

- [x] اعتماد المخطط المقدم كصيغة العرض الرسمية: SentenceObject → Canvas Adapter (tldraw / Excalidraw) وGraph Adapter (React Flow).
- [x] تحديث GATE_1B_REPORT.md وADR وواجهة Candidate Bench بالمخطط نفسه.
- [x] التحقق من البناء واللقطة البصرية ثم حفظ checkpoint والتوقف.

## Master Execution Prompt — pending scope review

- [x] قراءة بقية `pasted_content_5.txt` وتحليل المتطلبات، خصوصًا حدود Gate 2 وGitHub والإنتاج.
- [x] مقارنة متطلبات المنتج العام والمحركات العربية والرياضية بقرارات Gate 1B المعتمدة.
- [x] عدم بدء Production/MVP/Gate 2 قبل توثيق التعارض والحصول على تفويض صريح إذا لزم.

## Gate 1B general whiteboard extension — authorized scope

- [x] Extend the frozen test workspace with minimal Text, Drawing, Shape, Image placeholder, SentenceObject, EquationObject, and Concept/Graph objects.
- [x] Demonstrate move, resize, duplicate, delete, undo, redo, save, reload, and presentation mode on the shared object model.
- [x] Add a future-facing MathLive evaluation note without selecting or integrating a Math engine prematurely.
- [x] Add `GATE_1B_CANVAS_DECISION.md` with an evidence-based DEFER/SELECT outcome.
- [x] Verify GitHub repository, remote, branch, commit, push capability, and clean working tree; stop if continuity is blocked. GitHub push is blocked because the current origin is managed/internal and the correct GitHub repository was not specified.
- [x] Update Gate 1B report and changelog with the general whiteboard benchmark and exact test results.
