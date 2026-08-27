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

## GitHub Continuity Setup — pending verification

- [ ] فحص remote والفرع والحالة وسجل commits دون تعديل.
- [ ] التحقق من وجود مستودع GitHub هدف مصرح به؛ لا تخمين لاسم الحساب أو المستودع.
- [ ] التحقق من ملفات README وCHANGELOG و.env.example و.gitignore ومجلدات docs ومتطلبات الأمن.
- [ ] تنفيذ clean-clone verification فقط بعد توفر مستودع GitHub هدف مصرح به.
- [ ] إنشاء تقرير `docs/gates/GATE_1B_GITHUB_CONTINUITY.md` وإصدار الحالة VERIFIED أو BLOCKED.

## Owner-authorized GitHub connection — pending matching

- [ ] فحص المستودعات المرشحة في حساب GitHub المصادق عليه ومطابقة الاسم والوصف والتاريخ.
- [ ] اختيار المستودع فقط إذا كانت المطابقة موثوقة؛ وإلا طلب الرابط المحدد من المالك.
- [ ] التحقق من visibility وdefault branch والصلاحيات ووجود تاريخ متعارض.
- [ ] تنفيذ clean clone ثم install/typecheck/tests/build قبل push غير قسري.
- [ ] تحديث تقرير GitHub Continuity وإغلاق الحالة VERIFIED أو إبقاء BLOCKED بدقة.

## New GitHub repository setup — authorized

- [x] إنشاء مستودع GitHub خاص جديد باسم `interactive-teaching-board` تحت الحساب الموثّق.
- [x] التحقق من الملكية والخصوصية والفرع الافتراضي والصلاحيات.
- [x] حفظ remote الداخلي الحالي باسم `manus-internal` دون دفع إليه، ثم ضبط GitHub كـ `origin`.
- [x] دفع التاريخ المحلي دون force push.
- [x] تنفيذ clean clone ثم install وcheck وtests وbuild.
- [x] تحديث تقرير GitHub Continuity بالحالة النهائية والرابط وSHA والتوقف.

## Pasted content 7 — pending review

- [ ] قراءة وتحليل `pasted_content_7.txt` وتحديد التعليمات الجديدة مقابل حالة GitHub وGate 1B.
- [ ] تنفيذ النطاق المصرح به فقط، مع عدم بدء Gate 2 أو أي توسعة غير معتمدة.
- [ ] اختبار التغييرات وتحديث التقرير والـ checkpoint عند الإتمام.

## Gate 2 — Core Interactive Teaching Board — authorized

- [ ] إنشاء فرع `feature/gate-2-core-whiteboard` وعدم العمل على `main`.
- [ ] تصميم Core Board عام مستقل عن Arabic وMath مع Educational Object contract موسع.
- [ ] تنفيذ Text وDrawing وShape وImage placeholder وMedia/PDF/Table/Sticky/Connector/Group placeholders ضمن حدود Gate 2.
- [ ] تنفيذ select وmulti-select وmove وresize وrotate وduplicate وdelete وcopy/paste وgroup وlock وvisibility وundo/redo وzoom/pan وfit-to-content.
- [ ] تنفيذ رسم vector حقيقي قابل للحفظ والاستعادة: pen وhighlighter وeraser وstroke width وfreehand وline وarrow وbasic shapes.
- [ ] تنفيذ mixed RTL/LTR text editing واختباره مع Arabic + English + numbers + x² + symbols.
- [ ] تنفيذ Board Pages/Frames مع create وduplicate وreorder وrename وdelete.
- [ ] تنفيذ Presentation Mode وfullscreen-safe experience دون بيانات تقنية.
- [ ] تنفيذ local-first persistence abstraction مع save/close/reload/restore لكل الكائنات والصفحات.
- [ ] إضافة Arabic وMath toolkit contracts مع SentenceObject وWordObject وGrammarObject وI3rabObject وEquationObject prototypes دون محركات كاملة.
- [ ] إضافة benchmark قابل لإعادة التشغيل وقياس فعلي للتحميل والتفاعل والتحريك وzoom/pan وsave/restore.
- [ ] إضافة اختبارات domain وintegration وUI smoke وpersistence وRTL/mixed-direction وdrawing وequation وpages.
- [ ] تنفيذ visual QA لسطح فارغ وممتلئ والعربية والمختلط والرسم والتحديد وتغيير الحجم والصفحات ووضع العرض والشاشة الكبيرة.
- [ ] تحديث docs/gates/GATE_2_REPORT.md وتسجيل Canvas decision دون اختيار مبكر.
- [ ] تشغيل check وtest وbuild، ثم حفظ checkpoint وفتح PR/طلب مراجعة دون بدء Gate 3.

## Gate 2 continuation from pasted_content_8 — pending review

- [ ] مراجعة بقية تعليمات Gate 2 في الملف الثامن مقابل التنفيذ الحالي.
- [ ] إغلاق أعلى الفجوات المصرح بها: copy/paste وgroup/ungroup وpan/fit وإدارة الصفحات ووضع العرض.
- [ ] إضافة اختبارات ودليل benchmark/accessibility واقعي دون اختلاق أرقام.
- [ ] تحديث GATE_2_REPORT وPull Request، ثم التوقف قبل Gate 3.

## Pasted content 9 — pending review

- [ ] قراءة وتحليل `pasted_content_9.txt` مقابل فجوات Gate 2 الحالية.
- [ ] تنفيذ التحسينات المصرح بها على فرع `feature/gate-2-core-whiteboard` فقط.
- [ ] تشغيل الفحوص وتحديث التقرير وPull Request ثم التوقف قبل Gate 3.

## Gate 2 Conditional Repair Round — pending

- [x] استبدال Group container بنموذج children IDs وتحويلات ومواقع قابلة لإعادة البناء.
- [x] تنفيذ group move/resize/save/restore/ungroup مع Undo/Redo على مستوى الوثيقة؛ child scaling أثناء group resize مؤجل للتحصين.
- [x] تنفيذ corner resize handles للأجسام القابلة لتغيير الحجم مع minimum size ومنع الانقلاب.
- [x] إضافة UI/integration test journey فعلية أو توثيق حدود البيئة بوضوح؛ runner الفعلي غير متوفر وسُجلت الحالة NOT VERIFIED.
- [x] إنشاء benchmark رقمي قابل لإعادة التشغيل وتسجيل البيئة والنتائج الفعلية.
- [x] إجراء accessibility smoke test موثق، وتسجيل touch/stylus كـ NOT VERIFIED إن لم تتوفر hardware.
- [x] تنفيذ clean clone من فرع الإصلاح، تحديث GATE_2_REPORT وGATE_2_REPAIR_ROUND، وترك PR #1 مفتوحًا دون دمج.

## Gate 2 Final Verification Round — pending

- [x] إكمال group resize بحيث تُحوّل المجموعة مواضع وأحجام children نسبيًا وتحافظ على z-order/styles/IDs بعد save/reload/ungroup.
- [x] إضافة regression tests لدورة group resize وungroup وundo/redo.
- [x] تشغيل UI automation قابل لإعادة الإنتاج أو تثبيت NOT VERIFIED إذا لم يتوفر runner؛ runner غير متوفر وسُجلت الحالة.
- [x] إعادة تشغيل benchmark 91-object ومقارنة القياسات السابقة بالحالية.
- [x] تشغيل accessibility smoke review وتسجيل النتائج دون ادعاء WCAG.
- [x] تثبيت touch/stylus كـ NOT VERIFIED — HARDWARE UNAVAILABLE.
- [x] تنفيذ install/check/test/build/diff/status وكتابة `GATE_2_FINAL_VERIFICATION.md`.
- [x] رفع focused commit إلى PR #1 دون merge أو بدء Gate 3.

## Gate 2 Owner Review / Merge Preparation — pending

- [x] مراجعة diff الكامل لـ PR #1 والكود ونموذج المجال والحدود المعمارية والأمن.
- [x] فحص state corruption وID collisions وstale references وgroup transforms وstyles/z-order وpersistence وRTL وevent leaks وkeyboard behavior.
- [x] إنشاء `docs/qa/INPUT_DEVICE_VERIFICATION.md` بحالة TOUCH/STYLUS غير متحققين.
- [x] تصنيف browser performance كـ NOT VERIFIED والإبقاء على benchmark الهندسي 91-object.
- [x] تحديث GATE_2_REPORT وGATE_2_FINAL_VERIFICATION بحالة VERIFIED/NOT VERIFIED/BLOCKED/DEFERRED وقرار PR دون merge.
- [x] حفظ checkpoint نهائي والتوقف بانتظار تفويض الدمج الصريح.
- [x] إصلاح مسار keyboard shortcuts وإعادة المراجعة قبل أن يصبح PR #1 READY TO MERGE.

## Owner-authorized PR #1 merge verification — completed

- [x] Verify PR #1 checks and merge readiness on GitHub.
- [x] Merge PR #1 naturally into `main` without force push or history rewrite.
- [x] Verify merged commit SHA on `main`.
- [x] Run clean checkout verification from `main` with frozen install, check, test, build, and diff check.
- [x] Update Gate 2 status to PASSED and write `docs/gates/GATE_2_MERGE_REPORT.md`.
- [x] Stop; do not create a Gate 3 branch or write Gate 3 code.

## Pasted content 12 — pending review

- [ ] قراءة وتحليل `pasted_content_12.txt` وتحديد علاقته بـ blocker اختصارات لوحة المفاتيح.
- [ ] تنفيذ الإصلاح أو التوثيق المطلوب على فرع Gate 2 فقط.
- [ ] تشغيل الفحوص وتحديث PR #1 وcheckpoint ثم التوقف.

## Gate 4B — Controlled Vertical Slice — authorized

- [x] Verify main, Gate 4A approval, branch baseline, and clean working tree.
- [x] Create `feature/gate-4b-vertical-slice` without modifying main.
- [x] Implement one deterministic Arabic sentence → Grammar Lens → activity → assessment → feedback → save/restore journey.
- [x] Implement one deterministic equation → Math Visualization Lens → activity → assessment → feedback → save/restore journey.
- [x] Reuse canonical EducationalObject, registry, factory, capabilities, migration, adapters, transformations, interaction, assessment, feedback, and provenance infrastructure.
- [x] Add presentation-mode journeys and preserve IDs, source references, provenance, styles, z-order, activity state, and assessment state.
- [x] Add automated vertical-slice, round-trip, provenance, regression, and repeatable performance tests.
- [x] Document accessibility and hardware limitations honestly; do not implement AI, OCR, PDF intelligence, billing, collaboration, or student accounts.
- [x] Run clean verification, update Gate 4B reports, push branch only, and stop without PR or merge.

## Gate 4B Validation & Hardening — authorized

- [x] Verify the approved Gate 4B branch, commit, remote, main baseline, and clean working tree.
- [x] Create `feature/gate-4b-validation-hardening` based only on the approved Gate 4B branch/commit.
- [x] Audit canonical EducationalObject, registry, factory, capabilities, assessment, feedback, migration, and serialization for duplication.
- [x] Validate Arabic and Mathematics coverage against future lifecycle requirements without implementing full engines.
- [x] Strengthen provenance, source modification, lens regeneration, activity, assessment, feedback, save/restore, duplicate, delete, undo, redo, and migration tests.
- [x] Strengthen deterministic assessment states and document unsupported states honestly where not implemented.
- [x] Add repeatable benchmarks for 100/250/500 objects, save, restore, duplicate, group, ungroup, serialization, deserialization, and lens regeneration.
- [x] Validate RTL, accessibility semantics, presentation mode, keyboard behavior, and record unavailable hardware/browser runner limits without downgrading them.
- [x] Create the required validation reports, coverage matrices, lifecycle validation, and ADR-005.
- [x] Run clean-clone install/check/test/build/diff-check, push branch only, do not open a PR, do not merge, and stop for Owner Review.

## Gate 4B Final Hardening — authorized

- [x] Verify current hardening baseline, branch, commit, main, remote, and clean working tree.
- [x] Create `feature/gate-4b-final-hardening` from the approved hardening tip only.
- [x] Define deterministic lesson workflow migration from previous to current version with safe handling of unknown and malformed fields.
- [x] Define auditable teacher override preserving system assessment and teacher decision as distinct events.
- [x] Add regression tests for migration round-trip, teacher override persistence, assessment alternatives, incomplete responses, provenance, save/restore, lens regeneration, identity, and error safety.
- [x] Perform feasible static/accessibility/browser/performance validation without claiming unavailable hardware or browser runner results.
- [x] Create `docs/gates/GATE_4B_FINAL_HARDENING.md` with the required evidence matrix and closure classification.
- [x] Run clean-clone install/check/test/build/diff-check, push branch only, do not open PR, do not merge, and stop for Owner Review.

## Gate 4C Preparation / Controlled Expansion — authorized pending full directive

- [ ] Verify Gate 4B Final Hardening branch `feature/gate-4b-final-hardening`, HEAD, main, remote, clean working tree, and required evidence states.
- [ ] Read the complete Gate 4C directive and extract proven, partially proven, not proven, not verified, blocked, and stop-rule items.
- [ ] Create one precise `feature/gate-4c-...` branch only after baseline verification; never modify main or rewrite shared history.
- [ ] Define controlled Arabic and Mathematics expansion over canonical EducationalObject, Registry, Factory, Capabilities, Migration, Adapters, Transformations, Assessment, Feedback, Provenance, Events, and Persistence.
- [ ] Add only bounded Arabic/Mathematics vertical slices with golden fixtures; do not claim full Arabic NLP or a general symbolic engine.
- [ ] Add golden-dataset, provenance, lifecycle, save/restore, interaction, assessment, feedback, regression, and repeatable performance tests.
- [ ] Validate UI, RTL, keyboard semantics, accessibility, responsive behavior, presentation mode, and honestly record unavailable browser/hardware validation.
- [ ] Create Gate 4C architecture, coverage, validation, and owner-review reports.
- [ ] Run clean-clone install/check/test/build/diff-check, push branch only, do not open PR, do not merge, and stop before Gate 4D.

## Gate 4C Arabic Grammar / I3rab Vertical Slice — authorized

- [x] Verify Gate 4C Discovery branch, Gate 4B Final Hardening baseline, main, remote, and working tree.
- [x] Create exactly one implementation branch `feature/gate-4c-arabic-i3rab-slice` from approved Discovery baseline.
- [x] Search and reuse canonical EducationalObject, Registry, Factory, Capabilities, Migration, Adapters, Transformations, Assessment, Feedback, Provenance, Events, and Persistence.
- [x] Implement only the bounded Arabic sentence/word/I3rab/activity workflow; do not build full Arabic NLP, OCR, AI, morphology, rhetoric, literature, or unrestricted parsing.
- [x] Preserve sourceObjectId, sourceRange, sourceVersion, IDs, styles, z-order, metadata, lens/activity/assessment/feedback/events, and teacher override through save/reload/restore.
- [x] Add structured student interaction with deterministic role/case/marker/reasoning assessment and the five shared assessment states.
- [x] Add Arabic golden fixtures, positive/negative/alternative/determinism/provenance/migration/round-trip tests.
- [x] Validate RTL, progressive reveal, keyboard/focus/ARIA, responsive layout, presentation mode, and honestly record unavailable browser/hardware validation.
- [x] Run regression and clean-clone verification, update Gate 4C Arabic slice report, push one branch only, do not open PR, do not merge, and stop before Gate 4D.

## Gate 4C-A Arabic I3rab Hardening & Pedagogical Validation — authorized

- [x] Read the complete Gate 4C-A directive and record the proven-versus-assumed gap report.
- [x] Verify current Arabic I3rab branch, HEAD, Gate 4C baseline, main, remote, and working tree.
- [x] Create exactly one `feature/gate-4c-a-arabic-i3rab-hardening` branch from the approved Arabic slice.
- [x] Expand the bounded golden dataset to the required ten representative cases with stable IDs, provenance, and explicit alternatives/invalid cases.
- [x] Strengthen diagnostics for role/case/marker/reasoning/incomplete/unsupported/ambiguous responses without fuzzy acceptance.
- [x] Add progressive disclosure levels and distinguish teacher mode from student guided mode.
- [x] Preserve canonical provenance, teacher override auditability, migration, save/restore, and deterministic behavior.
- [x] Add pedagogical, negative, malformed, alternative, provenance, round-trip, migration, and assessment-to-feedback tests.
- [x] Run RTL/Arabic UX/accessibility/performance validation and record unavailable browser/hardware limits honestly.
- [x] Create the Gate 4C-A hardening report, run clean verification, push one branch only, do not open PR, do not merge, and stop for Owner Review.

## Gate 4C-B Mathematics Step-by-Step Vertical Slice — completed; Owner Review required

- [x] Read the complete Gate 4C-B directive and extract its scope, stop rules, evidence requirements, and limitations.
- [x] Verify the approved Arabic hardening baseline, repository, branch, HEAD, main, remote, and clean working tree.
- [x] Create exactly one `feature/gate-4c-math-step-slice` branch only after baseline verification; never modify main or rewrite shared history.
- [x] Complete Phase 0 Discovery and write `docs/gates/GATE_4C_B_MATH_DISCOVERY.md` before production code.
- [x] Reuse canonical EducationalObject, Registry, Factory, Capabilities, Migration, Adapters, Transformations, Assessment, Feedback, Provenance, Events, and Persistence; document architectural non-duplication.
- [x] Implement one bounded mathematics step-by-step slice for `2x + 3 = 11`, not a general Math Engine or symbolic mathematics engine.
- [x] Add MathProblemObject/SolutionStepObject contracts, multiple valid paths, step-level deterministic assessment, diagnostics, progressive feedback, answer/verification separation, and teacher override provenance.
- [x] Add a small deterministic Golden Dataset covering positive, alternative, negative, incomplete, malformed, invalid, unsupported, and verification cases.
- [x] Add one canonical Math Visualization Lens derived from the mathematical object and preserving sourceObjectId/sourceRange/sourceVersion.
- [x] Integrate the smallest teacher/student workflow into the existing board with save/restore and presentation mode.
- [x] Add regression, negative, malformed, migration, persistence, round-trip, provenance, UI/RTL/responsive, and deterministic tests.
- [x] Run check/test/build/diff-check and clean-clone verification; document unavailable hardware/browser/accessibility validation honestly.
- [x] Write the Gate 4C-B report, push one branch only, do not open PR, do not merge, do not start Gate 4D, and stop for Owner Review.

## Gate 4C-B Mathematics Validation & Hardening — completed; Owner Review required

- [x] Read the complete hardening directive and record all additional acceptance criteria and stop rules.
- [x] Verify baseline from a clean clone of `feature/gate-4c-math-step-slice` before edits.
- [x] Create exactly `feature/gate-4c-math-hardening`; never modify main, force-push, rebase destructively, open PR, or merge.
- [x] Add direct step-level teacher override with original system assessment, teacher decision, timestamp, reason, actor/context, and independent events.
- [x] Expand the bounded Golden Dataset to the required 10 categories without creating a general corpus or Math Engine.
- [x] Add normalized mathematical-meaning handling for bounded valid alternatives; avoid raw string equality as the sole acceptance rule.
- [x] Add deterministic repeated-run, unknown-step, duplicate-ID, broken-provenance, malformed/missing/unknown-field, and migration tests.
- [x] Add final-answer, step, transformation, reasoning, and verification correctness distinctions.
- [x] Add save/restore coverage for teacher override and full provenance chain.
- [x] Verify teacher/student visibility, RTL, keyboard/focus/labels/contrast/text scaling; record unavailable validation honestly.
- [x] Add 100/250/500 objects/steps NODE/VITEST benchmark coverage for creation, serialization, restore, assessment, feedback, and verification.
- [x] Run full Arabic regression, duplicate architecture scan, clean-clone verification, update hardening report, push one branch only, and stop for Owner Review.

## Gate 4C Mathematics Final Validation & Hardening — completed; Owner Review required

- [x] Verify clean-clone baseline from `feature/gate-4c-math-hardening` and record its HEAD, main, checks, and PR state.
- [x] Create exactly `feature/gate-4c-math-final-hardening`; do not modify main, force-push, rebase, open PR, or merge.
- [x] Validate all required pedagogical distinctions, alternative methods, Golden Dataset categories, unsupported boundaries, and deterministic normalization.
- [x] Validate direct teacher override, original/effective results, teacher reference, provenance, events, and save/restore.
- [x] Validate migration v1→v2, malformed/unsupported schema rejection, broken provenance, orphan data, duplicate IDs, and unknown fields.
- [x] Validate Arabic-first student/teacher UX, RTL, progressive disclosure, keyboard/focus/labels/contrast, and record unavailable browser/hardware evidence honestly.
- [x] Run NODE/VITEST benchmarks at 100/250/500 objects/steps without claiming Browser Performance; confirm Gate 3A/3B/4A/4B/Arabic regressions.
- [x] Create `docs/gates/GATE_4C_MATH_FINAL_HARDENING.md` and required test matrix; run final clean clone; push only the final branch; stop for Owner Review.


## Gate 4C Final Integration & Validation — completed; Owner Review required

- [x] Read the complete integration directive and record its scope, evidence labels, and stop rules.
- [x] Verify current branch, main HEAD, existing Gate 4C branches, commits, remotes, docs, tests, and actual integration base.
- [x] Create exactly `feature/gate-4c-final-integration` only from a documented checkpoint containing Arabic I3rab hardening plus Mathematics final hardening.
- [x] Validate cross-subject reuse of EducationalObject, Registry, Factory, Capabilities, Migration, Adapters, Transformations, Assessment, Feedback, Provenance, Events, and Persistence.
- [x] Validate Arabic and Mathematics journeys together in the Universal Teacher Workspace without adding a second engine or architecture.
- [x] Validate existing Golden Datasets, alternatives, unsupported boundaries, diagnostics, feedback, override, provenance, save/restore, migration, RTL, accessibility, and performance without expanding datasets.
- [x] Add only integration regression tests and required final integration documentation; stop on any real regression or ambiguous merge point.
- [x] Run clean-clone install/check/test/build/diff-check, record NOT VERIFIED limits honestly, push only the integration branch, and stop for Owner Review.


## New Autonomous Product Execution Directive — pending owner scope confirmation

- [ ] Confirm whether the new directive supersedes the explicit Gate 4C Final Integration Stop Rule and authorizes transition to Gate 5 Teacher Productization.
- [ ] Do not inspect/modify product scope for Gate 5 until the owner confirms the intended boundary: Gate 4C completion only, or Gate 5 Teacher MVP work on a new branch.
- [ ] If authorized, perform a fresh baseline check and create a separately named Gate 5 feature branch; never modify main, merge, force-push, or rewrite history.


## Productization Roadmap — Gate 5 completed; Owner checkpoint pending

- [x] Verify the documented Gate 4C integration checkpoint, current branch, main, remotes, status, and existing product workflow.
- [x] Create exactly `feature/gate-5-teacher-productization` without modifying main, rewriting history, or opening/merging a PR automatically.
- [x] Discover existing Teacher Workspace capabilities and identify only the highest-value missing workflow pieces.
- [x] Implement the smallest complete teacher flow: create lesson, choose subject, add/edit content, create activity, preview student, assess, feedback, save/restore, and present.
- [x] Preserve canonical architecture, Arabic-first RTL, deterministic assessment, provenance, teacher override, and safe persistence.
- [x] Add tests, run required checks, document Proven/Ready/Partial/Not Verified/Deferred/Blocked, and save a checkpoint.
- [x] Continue only to the next roadmap gate if the current gate has no true critical blocker; do not implement billing, collaboration, cloud production, institutional identity, AI, or OCR.

## Gate 6 Arabic Teaching Toolkit — authorized by roadmap; pending Gate 5 checkpoint

- [ ] Start from the Gate 5 checkpoint and create exactly `feature/gate-6-arabic-teaching-toolkit`.
- [ ] Inspect the existing Arabic slice and select the highest-value bounded teacher capability without claiming general Arabic NLP.
- [ ] Implement only the smallest safe Arabic teaching extension with deterministic Golden Dataset growth and explicit unsupported boundaries.
- [ ] Add tests, evidence report, readiness matrix, checkpoint, and stop/continue decision based on true critical blockers.


## Gate 6 Arabic Teaching Toolkit — completed; roadmap continuation authorized

- [x] Verify Gate 5 checkpoint `ec5a61756e023b24c610eae56c929d957bbb792c`, main, remotes, status, and existing Arabic evidence.
- [x] Create exactly `feature/gate-6-arabic-toolkit` without modifying main, force-pushing, rebasing, or opening/merging a PR.
- [x] Implement the smallest high-value bounded Arabic tool extension using canonical objects, lenses, activities, assessment, feedback, provenance, persistence, and migration.
- [x] Cover teacher sentence/text interaction, constrained grammar/I3rab, and one bounded reading/comprehension or annotation workflow without inventing source content.
- [x] Expand Arabic Golden Dataset toward 50 validated cases only with explicit valid/invalid/alternative/incomplete/boundary/unsupported categories.
- [x] Add unit, integration, round-trip, provenance, assessment, feedback, migration, negative, and regression tests.
- [x] Run required checks, document readiness and RED/YELLOW/GREEN honestly, save Gate 6 checkpoint, and continue to Gate 7 only if no critical blocker exists.

## Gate 7 Mathematics Toolkit — authorized by roadmap; pending Gate 6 checkpoint

- [ ] Create exactly `feature/gate-7-mathematics-toolkit` from the Gate 6 checkpoint.
- [ ] Inspect the existing bounded Mathematics slice and select the highest-value teacher workflow without creating a general Math Engine.
- [ ] Implement deterministic, explainable, source-preserving Math teaching tools only within proven boundaries.
- [ ] Add tests, evidence report, readiness matrix, checkpoint, and stop/continue decision based on critical blockers.


## Gate 7 Mathematics Teaching Toolkit — completed; roadmap continuation authorized

- [x] Read the complete Gate 7–14 directive and record scope, evidence labels, and stop rules.
- [x] Verify Gate 6 checkpoint `f2b27b9632aa6faa6e73f7939b9c013609926b62`, main, remotes, status, and existing Math slice.
- [x] Create exactly `feature/gate-7-mathematics-toolkit` without modifying main, force-pushing, rebasing, or opening/merging a PR.
- [x] Implement bounded expression/equation creation, transformations, step solving, alternatives, substitution, graph/grid representation, annotations, practice, assessment, feedback, override, provenance, and local save/restore using canonical contracts.
- [x] Classify unsupported mathematics honestly; no symbolic algebra engine claim.
- [x] Add unit, integration, negative, malformed, migration, round-trip, provenance, assessment, feedback, regression, and performance tests.
- [x] Run required checks, write Gate 7 report and evidence matrix, save checkpoint, then continue to Gate 8 only if no critical blocker exists.

## Gate 8 Contextual Teaching Actions — authorized by roadmap; pending Gate 7 checkpoint

- [ ] Create exactly `feature/gate-8-contextual-actions` from the Gate 7 checkpoint.
- [ ] Implement capability-driven actions شرح/تحليل/تدريب/تقييم/مثال/مقارنة/تمييز/إخفاء/إظهار/تحويل إلى نشاط without subject logic in Core Board.
- [ ] Add Arabic and Mathematics action maps over canonical object types, preserve provenance, and test unsupported actions honestly.
- [ ] Add integration/regression/accessibility tests, evidence report, checkpoint, and continue only if no critical blocker exists.


## Gate 8 Contextual Teaching Actions — completed; roadmap continuation authorized

- [x] Verify Gate 7 checkpoint `39c3db5d` and actual remote HEAD, main, status, remotes, and existing branch state.
- [x] Create exactly `feature/gate-8-contextual-actions` without modifying main, force-pushing, rebasing, or opening/merging a PR.
- [x] Reuse canonical capability definitions and create one subject-agnostic contextual action contract; no duplicate Registry/Factory/Assessment/Feedback/Persistence engines.
- [x] Map Arabic and Mathematics object types to شرح/تحليل/تدريب/تقييم/مثال/مقارنة/تمييز/إخفاء-إظهار/تحويل إلى نشاط/عرض بصري with progressive disclosure.
- [x] Prove Arabic selection actions, Mathematics actions, object mismatch handling, activity→assessment→feedback, provenance, persistence, override compatibility, and unsupported safety.
- [x] Add integration/regression/accessibility tests and report PROVEN/PARTIALLY PROVEN/NOT PROVEN/NOT VERIFIED/BLOCKED honestly.
- [x] Run full checks and clean clone, save Gate 8 checkpoint, then continue to Gate 9 only if no critical blocker exists.

## Gate 9 Lesson Builder + Classroom Workflow — authorized by roadmap; pending Gate 8 checkpoint

- [ ] Create exactly `feature/gate-9-lesson-classroom-workflow` from the Gate 8 checkpoint.
- [ ] Add bounded lesson builder flows for objectives, activities, assessment/feedback sequencing, teacher preview, and classroom presentation without collaboration or cloud services.
- [ ] Preserve canonical objects, action maps, provenance, deterministic assessment, local persistence, and recovery behavior.
- [ ] Add tests, evidence report, checkpoint, and continue only if no critical blocker exists.


## Gate 9 Lesson Builder + Complete Classroom Workflow — completed; checkpoint saved

- [x] Read the complete Gate 9 directive and record exit criteria, evidence labels, and stop rules.
- [x] Verify Gate 8 checkpoint `aca832ea`, actual branch/HEAD, main, remotes, status, and PR state.
- [x] Create exactly `feature/gate-9-lesson-classroom-workflow` without modifying main, force-pushing, rebasing, or opening/merging a PR.
- [x] Complete practical lesson builder: subject, grade, objectives, page add/reorder/duplicate/delete/rename/navigation, object copy, undo/redo, save/restore, teacher/student preview, and presentation mode.
- [x] Replace last-added-object fallback with direct product-shell selection, deselection, keyboard-reachable controls, contextual action resolution, and capability-safe actions; renderer-level pointer selection remains documented as partial.
- [x] Prove the available Arabic and Mathematics workflows through the existing bounded content/activity/assessment/feedback/review paths with provenance.
- [x] Add student mode, presentation mode, autosave states, lesson duplication with ID isolation, malformed/migration/broken-provenance safety, performance measurements, and accessibility evidence.
- [x] Add complete regression suite and report, run clean clone, save checkpoint, and stop or continue only according to Gate 9 exit criteria.

## Gate 10 Save / Export / Import / Recovery — authorized by roadmap; pending Gate 9 checkpoint

- [ ] Create exactly `feature/gate-10-save-export-import-recovery` from the Gate 9 checkpoint.
- [ ] Implement safe local export/import/recovery over canonical document persistence without cloud or collaboration.
- [ ] Add malformed, duplicate-ID, broken-provenance, migration, round-trip, and recovery tests plus evidence report.

## Gate 10 Save / Export / Import / Recovery — authorized by roadmap; pending Gate 9 checkpoint

- [ ] Create exactly `feature/gate-10-save-export-import-recovery` from the Gate 9 checkpoint.
- [ ] Implement safe local export/import/recovery over canonical document persistence without cloud or collaboration.
- [ ] Add malformed, duplicate-ID, broken-provenance, migration, round-trip, and recovery tests plus evidence report.


## Release Acceleration — Gate 10 through Release Candidate authorized

- [ ] Read the complete release acceleration directive and record the critical path, exit criteria, and stop rules.
- [ ] Verify Gate 9 checkpoint `44888d19`, actual branch/HEAD, main, remotes, status, and PR state.
- [ ] Create exactly `feature/gate-10-save-export-import-recovery` without modifying main, force-pushing, rebasing, or opening/merging a PR.
- [ ] Implement safe local export/import/recovery preserving metadata, IDs, relationships, pages, styles, z-order, provenance, assessment, feedback, override, versions, and supported migrations.
- [ ] Add corruption, unsafe payload, duplicate-ID, malformed, missing metadata, provenance, and round-trip tests; stop on data-loss or destructive migration risks.
- [ ] Continue through Gate 11 canvas interaction, Gate 12 classroom loop, Gate 13 accessibility/device resilience, Gate 14 production hardening, and Gate 15 RC polish only when each has no critical blocker.
- [ ] Add bounded Arabic and Mathematics demo lessons with known source content, complete final report, save RC checkpoint, and stop at RELEASE CANDIDATE — OWNER REVIEW.


## Gate 10 Explicit Authorization — completed; STOP — OWNER REVIEW
- [x] Confirm current Gate 10 branch/base/HEAD and working tree after the explicit authorization.
- [x] Run the exact required commands in the Gate 10 branch and clean clone: frozen install, check, full test run, build, and diff check.
- [x] Review export/import/recovery/autosave/security/data-integrity evidence and update the Gate 10 report with exact statuses.
- [x] Save one Gate 10 checkpoint only, do not start Gate 11, and stop at Owner Review.


## Gate 11 Direct Canvas Interaction — completed; STOP — OWNER REVIEW

- [x] Read the complete Gate 11 directive and record its selection, manipulation, history, security, evidence, and stop requirements.
- [x] Verify Gate 10 checkpoint `667e390`, actual branch/HEAD, main, remotes, status, and PR state.
- [x] Create exactly `feature/gate-11-direct-canvas-interaction` from the Gate 10 checkpoint without modifying main, merging, opening PR, force-pushing, or rewriting history.
- [x] Implement one canonical interaction layer with pointer selection, deselection, multi-select, keyboard selection, direct manipulation, and contextual action resolution.
- [x] Preserve IDs, styles, metadata, z-order, provenance, capabilities, and source references through operations.
- [x] Add deterministic tests for selection, manipulation, grouping, reorder, context actions, undo/redo, persistence, stale references, and malformed interaction payloads.
- [x] Run responsive/accessibility checks and NODE/VITEST performance benchmarks; record touch/stylus/UI automation/browser performance as NOT VERIFIED when unavailable.
- [x] Write the Gate 11 report, run clean clone, save checkpoint, and stop at Owner Review; do not start Gate 12.


## Gate 12 Complete Classroom Learning Loop — completed; STOP — OWNER REVIEW

- [x] Read the complete Gate 12 directive and record lifecycle, attempt, provenance, override, retry, evidence, and stop requirements.
- [x] Verify Gate 11 checkpoint `ee2b9468`, actual branch/HEAD, main, remotes, status, and PR state.
- [x] Create exactly `feature/gate-12-complete-classroom-loop` from the approved Gate 11 checkpoint without modifying main, merging, opening PR, force-pushing, or rewriting history.
- [x] Add one canonical activity lifecycle with guarded transitions and identity-isolated local Attempt records.
- [x] Complete Arabic and Mathematics teacher→student→assessment→diagnostic→feedback→review journeys using existing canonical engines and provenance.
- [x] Preserve system result, teacher decision, effective result, reason, timestamp, teacher reference, prior attempts, and source links through retry and save/restore.
- [x] Add deterministic lifecycle, attempt, alternative-answer, diagnostic, feedback, override, retry, provenance, persistence, malformed-payload, and security tests.
- [x] Run regression, architecture, accessibility, responsive, and NODE/VITEST performance checks; record unavailable hardware/browser/UI automation honestly.
- [x] Write `docs/gates/GATE_12_REPORT.md`, run clean clone, save checkpoint, and stop at Owner Review; do not start Gate 13.


## Post-Gate-12 → Release Candidate → Pilot — authorized by directive; not yet executed

- [ ] Read the complete post-Gate-12 directive and record all Gate 13–21 evidence and stop requirements.
- [ ] Verify Gate 12 checkpoint `ac29062b`, current branch/HEAD, main, remotes, PR state, and working tree.
- [ ] Create a controlled feature branch from the Gate 12 checkpoint; never modify main, merge, force-push, rewrite history, or start a later gate before the previous gate is evidenced.
- [ ] Gate 13: build runnable browser QA/smoke matrix covering teacher and student workflows; record unavailable runner honestly.
- [ ] Gate 14: build accessibility acceptance matrix and executable keyboard/RTL assertions; do not claim WCAG compliance without audit.
- [ ] Gate 15: implement touch/stylus abstraction and automated contracts/device matrix; do not claim hardware verification.
- [ ] Gate 16: establish browser performance budgets for 100/250/500/1000 objects and safely address bundle warning only if justified.
- [ ] Gate 17: create Teacher Acceptance Test scenarios and a realistic controlled pilot plan.
- [ ] Gate 18: expand Arabic and Mathematics golden datasets with provenance, alternatives, misconceptions, and unsupported cases without generalizing beyond evidence.
- [ ] Gate 19: audit security, privacy, recovery, unsafe payloads, student data minimization, and provenance integrity.
- [ ] Gate 20: assemble Release Candidate evidence and classify readiness honestly.
- [ ] Gate 21: prepare Controlled Pilot scope, participant safeguards, success criteria, rollback, and owner review stop.
- [ ] Write gate reports, run clean clone and final regressions, save one checkpoint, and stop for Owner Review; do not publish or merge.


## Gate 13 Browser QA — completed; CONDITIONAL; proceed to Gate 14 after checkpoint

- [x] Verified Gate 12 baseline and created/pushed `feature/gate-13-browser-qa` without modifying main.
- [x] Created browser test matrix and evidence notes distinguishing browser-proven, contract-only, and NOT VERIFIED paths.
- [x] Ran dev-browser smoke for load, SentenceObject/EquationObject insertion, selection/move mutation, save, student preview, and presentation.
- [x] Ran production build/server smoke in a real browser.
- [x] Passed frozen install, check, 21 test files/110 tests, build, diff-check, and architecture scan.
- [ ] Contextual conversion, active Activity browser lifecycle, file picker export/import, real pointer drag/resize, multi-select/group, UI automation, accessibility, touch, stylus, and browser performance remain unverified.
- [x] Wrote `docs/gates/GATE_13_REPORT.md`; checkpoint and clean clone remain required before moving to Gate 14.


## RELEASE PATH v1.0 — Gate 14 Accessibility/Input QA authorized

- [ ] Read the complete release directive and record Gates 14–17 evidence and stop requirements.
- [ ] Verify Gate 13 checkpoint `656e1954`, actual branch/HEAD, main, remotes, PR state, and working tree.
- [ ] Create exactly `feature/gate-14-accessibility-input-qa` from Gate 13 without modifying main, merging, force-pushing, or rewriting history.
- [ ] Gate 14: verify/fix keyboard, focus, focus restoration, Escape, editing, selection, contextual actions, page/presentation/student controls, RTL, semantics, reduced motion, and contrast.
- [ ] Deliver `docs/gates/GATE_14_REPORT.md`, `docs/qa/ACCESSIBILITY_MATRIX.md`, `docs/qa/KEYBOARD_MATRIX.md`, and `docs/qa/RTL_MATRIX.md`.
- [ ] Classify real screen-reader, touch, stylus, and unavailable hardware evidence honestly; run check/test/build/diff-check and clean clone.
- [ ] Gate 15: create the required Playwright E2E branch and deterministic Chromium journeys only after Gate 14 checkpoint.
- [ ] Gate 16: measure real-browser performance/resilience and apply only objectively required optimizations.
- [ ] Gate 17: assemble Release Candidate evidence and controlled human-pilot boundaries; do not claim MVP production readiness without human validation.
- [ ] Save checkpoints at gate boundaries, never publish/merge automatically, and stop at Owner Review after Gate 17.


## Gate 14 Accessibility & Input QA — completed; CONDITIONAL

تمت إضافة keyboard selection، multi-select keyboard path، Escape semantics، accessible resize controls، focus-visible، status announcements، reduced-motion safeguards، ومصفوفات accessibility/keyboard/RTL. نجحت الفحوص المحلية: 22 ملف اختبارًا و113 اختبارًا، check، build، diff-check، architecture scan، وvisual smoke على desktop/mobile. Screen reader وtouch وstylus وfull browser keyboard journey وhuman validation بقيت NOT VERIFIED. Gate 15 هو التالي، ولا يُدّعى امتثال WCAG رسمي.


## Gate 15 Playwright End-to-End Classroom QA — authorized; not yet executed

- [ ] Read the complete Gate 15 directive and record all Journey A–K evidence and failure-artifact requirements.
- [ ] Verify Gate 14 checkpoint `2645c285`, branch/HEAD, main, remotes, PR state, and working tree.
- [ ] Create exactly `feature/gate-15-playwright-classroom-qa` from Gate 14 without modifying main, rebasing, force-pushing, opening PR, or merging.
- [ ] Add only the minimum Playwright dependency/configuration and deterministic fixtures with stable roles/labels/test IDs.
- [ ] Run Chromium E2E against development and production build/server for teacher, Canvas, Arabic, Mathematics, student, review, save/restore, export/import, recovery/security, keyboard, presentation, and mobile journeys.
- [ ] Capture screenshot/trace/console/network evidence on failures and never classify DOM inspection or unit tests as browser E2E.
- [ ] Fix only proven existing workflow regressions; do not add new product features or duplicate canonical engines.
- [ ] Write `docs/gates/GATE_15_REPORT.md` and `docs/qa/PLAYWRIGHT_MATRIX.md`, run full regression and clean clone, save checkpoint, and stop; do not start Gate 16.


## Gate 15 Execution Update — implementation and E2E passed; final clone pending

أثبت Playwright Chromium خمس Journeys على development وproduction، بإجمالي 10/10 اختبارات ناجحة عبر Desktop Chrome وPixel 5 emulation. أُصلحت فقط regressions مثبتة: تداخل Inspector مع Canvas، غياب عرض Teacher Decision بعد حفظه، وفصل runner الخاص بـPlaywright عن Vitest. بقي `pnpm test` عند 22 ملفًا و113 اختبارًا ناجحًا، مع build warning موثق. لم يُثبت Touch hardware أو Stylus أو Screen Reader أو human classroom validation أو formal browser-performance budgets. التقرير والمصفوفة مكتملان؛ يلزم الآن commit/push ثم Clean Clone وcheckpoint، وبعدهما STOP دون Gate 16.


## Gate 15 Final — completed; A — PASS; STOP

- [x] Playwright Chromium setup, stable selectors, deterministic fixtures, and `pnpm e2e` script.
- [x] 10/10 E2E tests passed on development and production targets across Desktop Chrome and Pixel 5 emulation.
- [x] Full regression: 22 Vitest files / 113 tests, check, build, diff-check, and architecture scan passed.
- [x] Clean Clone from GitHub branch passed install/check/test/build/e2e/diff-check with clean working tree.
- [x] Gate 15 report and Playwright matrix updated with final SHA `aa79ef5acaeed3acd116c9dcc0c9eb2c7e9e625e`.
- [x] Stop now; Gate 16, PR, merge, main modification, and production claims are not authorized in this checkpoint.


## Gate 16 Performance & Resilience — validation in progress

- [x] Verify Gate 15 checkpoint `691ace48`, branch/HEAD, main, remotes, PR state, and working tree.
- [x] Create exactly `feature/gate-16-performance-resilience` from Gate 15 without modifying main, merging, opening PR, force-pushing, or rewriting history.
- [x] Read the current Playwright config and canonical board/transfer contracts before designing browser metrics and realistic 10/100/250/500-object fixtures.
- [x] Measure bounded real Chromium initial load, creation, selection, drag, group/ungroup, save/restore, and export paths; lens/student/assessment/override timings remain explicitly unverified.
- [x] Separate NODE benchmark, browser benchmark, E2E timing, and human performance; never promote Node timings to browser evidence.
- [x] Exercise large documents and malformed/partial/unsupported/duplicate/unsafe/empty payloads with safe failure; crash/quota injection remains unverified.
- [x] Analyze bundle chunks and apply conservative vendor code-splitting; document results.
- [x] Run full regression and performance suite; write `docs/gates/GATE_16_REPORT.md`, `docs/gates/PERFORMANCE_MATRIX.md`, and `docs/gates/RESILIENCE_MATRIX.md`.
- [ ] Commit and push the feature branch, save one checkpoint, and stop. Do not start Gate 17, open PR, merge, or modify main.


## Release Path v1.0 — owner authorization required before execution

- [ ] تثبيت Source of Truth: فحص Git state، main HEAD، آخر Gate معتمد، architecture، الاختبارات، وتصنيفات الأدلة.
- [ ] Gate 17: إنشاء وتجميد `RELEASE_SCOPE.md` مع INCLUDED/LIMITED/NOT INCLUDED/KNOWN LIMITATIONS والرحلات الحرجة.
- [ ] Gate 18: تنفيذ `TEACHER_ACCEPTANCE_MATRIX.md` للرحلة الكاملة وتصنيف PASS/PARTIAL/FAIL/NOT VERIFIED.
- [ ] Gate 19: تنفيذ `STUDENT_ACCEPTANCE_MATRIX.md` مع student isolation وattempt isolation وretry وprovenance، وتصنيف HUMAN VALIDATION بدقة.
- [ ] Gate 20: تنفيذ `CONTENT_QA_REPORT.md` على Golden Dataset فقط، مع مبدأ ABSTAIN > WRONG ANSWER.
- [ ] Gate 21: تنفيذ `SECURITY_PRIVACY_RELEASE_AUDIT.md` ومراجعة local-first data safety وXSS/file/migration/provenance isolation.
- [ ] Gate 22: التحقق من production deployment فقط إذا كانت منصة جاهزة؛ وإلا تسجيل DEPLOYMENT NOT VERIFIED دون اختلاق URL أو نجاح.
- [ ] Gate 23: إنشاء `RELEASE_CANDIDATE_REPORT.md` وإصدار GO أو CONDITIONAL GO أو NO-GO وفق Critical Journey وsecurity وproduction smoke.
- [ ] لا إنشاء Gate 24، ولا AI/OCR/Collaboration/Billing/Cloud/general Arabic NLP/general symbolic algebra/mobile native app.
- [ ] التوقف عند كل stop condition وانتظار مراجعة/تفويض المالك قبل البوابة التالية.


## FINAL MVP PILOT ACTIVATION — closed human pilot preparation

- [ ] التحقق من baseline `671a337...`، فرع productization، main، والـworking tree قبل أي تعديل.
- [ ] فحص الرحلة الكاملة من إنشاء الدرس حتى العرض والحفظ والنقل دون إعادة كتابة ما ينجح.
- [ ] تطبيق blocker-only UX أو data-safety fixes فقط إذا ثبتت ضرورتها.
- [ ] إنشاء `REAL_HUMAN_PILOT_PROTOCOL.md` و`TEACHER_OBSERVATION_FORM.md` و`STUDENT_OBSERVATION_FORM.md`.
- [ ] تشغيل check/test/build/diff-check وPlaywright المتاح فقط.
- [ ] إنشاء `docs/gates/FINAL_MVP_PILOT_STATUS.md`، مع إبقاء Human Validation = NOT VERIFIED عند غياب المشاركين.
- [ ] التوقف: لا Gates ولا features ولا PR ولا merge ولا deploy ولا RELEASE READY.


## REAL HUMAN PILOT — execution only

- [ ] التحقق من توفر 3 معلمين و5 طلاب حقيقيين وجلسات فعلية مجهولة الهوية.
- [ ] تنفيذ بروتوكول المعلم والطالب فقط عند توفر المشاركين، دون قيادة غير لازمة.
- [ ] تسجيل النتائج والمشكلات المتكررة ودرجات الخطورة دون اختلاق أو تعميم من automation.
- [ ] إنشاء `docs/pilot/HUMAN_PILOT_RESULTS.md` مع Unverified Areas.
- [ ] إبقاء `STATUS = PILOT CANDIDATE` عند غياب الجلسات أو وجود مشاكل حرجة، والتوقف دون Gate أو feature أو إصلاح تلقائي.


## HUMAN PILOT PACKAGE — docs-only execution

- [ ] التحقق من الفرع والـHEAD والـbaseline وmain وGitHub backup والـworking tree.
- [ ] مراجعة أو تحسين الملفات الأربعة المحددة فقط: protocol وteacher form وstudent form وresults template.
- [ ] إبقاء Human Validation = NOT VERIFIED وعدم إنشاء نتائج بشرية افتراضية.
- [ ] تشغيل `pnpm check` و`pnpm test -- --run` و`pnpm build` و`git diff --check`.
- [ ] إنشاء checkpoint واضح وتقرير نهائي مختصر، ثم التوقف دون Gate أو feature أو PR أو merge أو deploy.


## Workspace visibility bug

- [ ] فحص سجل الخادم والمتصفح والـDOM لتحديد سبب عدم ظهور مساحة العمل.
- [ ] تطبيق أقل إصلاح ممكن فقط إذا ثبت السبب.
- [ ] تشغيل الفحوص ولقطة desktop/mobile وتوثيق النتيجة.


## MVP UX Refinement — context-first workspace

- [ ] تثبيت baseline وbranch وHEAD وmain والـworking tree قبل التعديل.
- [ ] تحسين هوية الدرس: عنوان مرن، مادة وفئة ومستوى واضحون ومحفوظون دون كسر metadata الحالية.
- [ ] إعادة تنظيم الرأس ومساحة العمل حول Canvas مع Inspector سياقي وحالات فارغة مفهومة.
- [ ] تحسين Teacher/Student/Presentation separation وRTL وkeyboard وresponsive behavior.
- [ ] تشغيل الفحوص والـbrowser evidence وتوثيق الفجوات، دون Gate أو engine أو architecture جديدة.


## Strict Visual Acceptance Review — bounded UX only

- [ ] فحص العرض الفعلي قبل التغيير على 1280×720 و390×844.
- [ ] مطابقة hierarchy العنوان ← المادة ← الفئة ← المستوى ← workspace، وتحديد الفجوات فقط.
- [ ] تطبيق أقل إصلاح مرئي لازم، دون تغيير canonical semantics أو Gate أو architecture.
- [ ] إعادة تشغيل check/test/build/diff-check وPlaywright.
- [ ] توثيق before/after ومتطلبات Desktop/Mobile والقيود ثم التوقف.


## Lesson Context Persistence Fix — bounded only

- [ ] مراجعة BoardDocument وlessonTransfer وsafe parser وTeacherProductShell metadata.
- [ ] تحديد أقل تعديل canonical لحفظ العنوان والمادة والفئة والمستوى.
- [ ] إضافة اختبارات save/restore وexport/import وbackward compatibility وmalformed metadata.
- [ ] تشغيل check/test/build/diff-check وPlaywright والتحقق البصري Desktop/Mobile.
- [ ] كتابة التقرير النهائي والتوقف دون Gate أو PR أو merge أو deploy.


## FINAL PRE-PILOT VERIFICATION — no new gate

- [ ] إضافة context-after-import assertions مرئية عبر Playwright.
- [ ] إضافة legacy document browser fixture واختبار render آمن بلا قيم مخترعة.
- [ ] تنفيذ accessibility pre-pilot audit الآلي وتصنيف screen-reader/WCAG غير المتاح كـNOT VERIFIED.
- [ ] تشغيل check/test/build/diff-check وPlaywright والتحقق البصري Desktop/Mobile.
- [ ] كتابة `FINAL PRE-PILOT VERIFICATION REPORT` وإصدار PILOT READY أو PILOT CANDIDATE، ثم التوقف.


## Save and upload current state

- [ ] فحص branch/HEAD/remotes/status والملفات المعدلة.
- [ ] إنشاء commit محلي واضح لكل تغييرات Final Pre-Pilot Verification الحالية.
- [ ] رفع الفرع الحالي فقط إلى مستودع GitHub المعتمد والتحقق من SHA والرابط.
- [ ] عدم تعديل main أو force push أو rebase أو reset أو PR أو merge.


## New Productization Mandate — authorized by owner

- [x] تثبيت أحدث baseline مستقر وفحص المستودع والفرع وmain.
- [x] تحليل فجوات تجربة المعلم والطالب والطبقات التعليمية والمصادر والذكاء.
- [x] تنفيذ productization على فرع Feature جديد فقط، دون لمس main أو حذف baseline.
- [x] إضافة قدرات عربية ورياضيات وشعر ومصادر وAI ضمن حدود موثوقة وقابلة للإثبات ضمن النطاق bounded المنفذ؛ المحركات العامة والمناهج الرسمية ما تزال خارج النطاق.
- [x] تنفيذ اختبارات آلية ومتصفح وأمان واستجابة، ثم كتابة Product Release Report مرحلي موثق؛ الاعتماد البشري والاختبارات الميدانية ما زالا غير متحققين.
- [x] إنشاء commits واضحة وحفظ checkpoints متعددة مع الحفاظ على rollback capability.


## Productization bounded capabilities completed

- [x] إضافة مساعد تعليمي server-side بعقد JSON صارم ومسار فشل آمن.
- [x] إضافة حالة provenance وuncertainty ومراجعة المعلم دون ادعاء تحقق خارجي.
- [x] إضافة قبول ورفض وتصحيح المعلم داخل لوحة المساعد.
- [x] إضافة سجل روابط مرجعية للعربية والرياضيات مع وسم مراجعة المعلم المطلوبة.
- [x] إضافة مصدر اختياري يقدمه المعلم ويمرر كسياق غير متحقق.
- [x] إضافة أداة شعر bounded للقياسات الشكلية فقط مع منع ادعاء الوزن.
- [x] إضافة اختبارات المساعد والشعر وسجل المراجع، ونجاح check/test/build/diff-check.
- [x] تنفيذ تحقق بصري Desktop 1280×720 وMobile 390×844 للواجهة الحالية.

- [x] إنشاء `docs/release/PRODUCTIZATION_RELEASE_REPORT.md` كمسودة مرحلية تفصل PROVEN عن NOT VERIFIED.
- [ ] استكمال productization والتحقق النهائي قبل إصدار التقرير النهائي.

- [x] رفع `feature/productization-v1` إلى مستودع GitHub المعتمد دون force push.
- [x] التحقق من تطابق SHA المحلي وGitHub: `025f242502ced2472d172ba79e5808e4a42266f4`.
- [x] التحقق من بقاء GitHub `main` عند `ee646db6863ef494ddfcb954ac1823413d37db1f` ونظافة working tree.
- [x] إضافة رحلة Playwright للشعر والمراجع وقرار المعلم، وتصحيح محدد الاختبار بعد فشل مثبت، ثم نجاح المجموعة الكاملة 14/14.
- [x] رفع أحدث checkpoint `0bf26b2354dc2ef61d1d6d36f423a601826f8a90` إلى `github/feature/productization-v1` والتحقق من التطابق ونظافة working tree.
- [x] تحصين provenance ضد ادعاءات السياق والمصادر غير الموجودة، وإضافة اختبار regression للسلوك.
- [x] إعادة تشغيل check وVitest 6/6 وbuild وdiff-check وPlaywright 14/14 بعد التحصين.
- [x] تشغيل Playwright الكامل على `mobile-chromium` بنتيجة 14/14 وتوثيق حدود المحاكاة.
- [x] إنشاء `docs/release/PRODUCTIZATION_SCOPE.md` لتثبيت Included/Limited/Not Included وقواعد اعتماد المساعد.
- [x] التحقق من بقاء GitHub `main` عند `ee646db6863ef494ddfcb954ac1823413d37db1f` بعد رفع productization-v1.


## Master Productization Prompt 59 — current authorized scope

- [x] فحص baseline `588da835` والفرع والـremote وmain والـworking tree قبل المتابعة.
- [x] إغلاق فجوات رحلة المعلم والطالب والتحويلات والعرض والحفظ ضمن السبورة الحالية ضمن المسارات bounded المتاحة.
- [x] توسيع قدرات العربية والرياضيات والشعر والمصادر فقط عندما تكون bounded وقابلة للإثبات؛ الوزن والتحليل الأدبي العام والمناهج الرسمية بقيت غير متحققة.
- [x] تقوية AI grounding وsource hierarchy وuncertainty وmalformed response safety ضمن عقد bounded؛ conflict handling بين مصادر خارجية حية بقي محدودًا ويحتاج مراجعة بشرية.
- [x] إضافة اختبارات E2E متماسكة للعربية والرياضيات والشعر والمراجع وواجهات المساعد والـproduct coherence.
- [x] تشغيل check/test/build/diff-check وChromium/mobile والتحقق الأمني والاستجابي المتاح آليًا.
- [x] تحديث `PRODUCTIZATION_RELEASE_REPORT.md` وإعداد حزمة human acceptance دون إعلان Pilot Ready قبل التحقق البشري.
- [x] حفظ checkpoints ورفع آخر commit إلى `feature/productization-v1` دون PR أو merge أو تعديل main.
- [x] تقوية source hierarchy بمستويات السلطة والعلاقة بالمناهج وfreshness المعلن، وإضافة اختبار يمنع ادعاء التحقق المنهجي.
- [x] تحديث source hierarchy والتقرير ثم نجاح check وVitest 6/6 وbuild وdiff-check وPlaywright 14/14 على Chromium و14/14 على mobile-chromium.
- [x] إضافة نوايا تعليمية صريحة للمساعد: شرح، تحليل، سؤال، نشاط، وتبسيط، بدل chatbot عام.
- [x] تشغيل check وVitest 7/7 وbuild وdiff-check وPlaywright 14/14 على Chromium و14/14 على mobile-chromium بعد إضافة النوايا.
- [x] إضافة تصنيف نوع الدليل وحالة التحقق إلى عقد المساعد وواجهة المعلم، مع fallback آمن واختبار deterministic.
- [x] التحقق بعد الإضافة: check وVitest 7/7 وbuild وdiff-check وPlaywright 14/14 على Chromium و14/14 على mobile-chromium.
- [x] إضافة evidence class وverification state إلى عقد المساعد والواجهة، مع اختبار malformed/unsupported safety.
- [x] إضافة نوايا تعليمية محددة: شرح، تحليل، سؤال، نشاط، وتبسيط.
- [x] تحديث تقرير productization بنتائج 7/7 Vitest و14/14 Chromium و14/14 mobile-chromium.
- [x] إضافة رحلة E2E لنوايا المساعد وطبقات الدليل وقرار المعلم؛ نجحت 1/1 على Chromium و1/1 على mobile-chromium.
- [x] إضافة local persistence محدودة لرسائل المساعد وقرار المعلم والتصحيح والمصدر والنية، مع رفض malformed values.
- [x] إضافة اختبار round-trip واختبار حدود للقيم غير الصالحة؛ نجحت Vitest 9/9 وPlaywright 15/15 على Chromium وmobile-chromium.
- [x] إضافة E2E لاستعادة نية المساعد والمصدر المقدم بعد reload؛ نجحت 1/1 على Chromium و1/1 على mobile-chromium.
- [x] تحصين استعادة evidence من التخزين المحلي بالتحقق البنيوي والتصنيفات المسموحة، مع اختبار رفض evidence الناقص.
- [x] نجاح check وVitest 10/10 وbuild وdiff-check وPlaywright 16/16 على Chromium و16/16 على mobile-chromium.
- [x] عزل حالة مراجعة المساعد محليًا بحسب المادة والمستوى وسياق الدرس لمنع التسرب بين الدروس.
- [x] إعادة التحقق بعد العزل: check وVitest 10/10 وbuild وdiff-check وPlaywright 16/16 على Chromium و16/16 على mobile-chromium.
- [x] إنشاء `docs/pilot/HUMAN_ACCEPTANCE_CHECKLIST.md` لربط الأدلة الآلية بما يجب إثباته مع المعلمين والطلاب، دون اختلاق نتائج بشرية.
- [x] تنفيذ الفحص الساكن للأسرار وتسجيلات المحتوى الحساس دون نتائج مخالفة.
- [x] إعادة الجولة النهائية: check وVitest 10/10 وbuild وdiff-check وPlaywright 16/16 على Chromium و16/16 على mobile-chromium.
- [ ] تنفيذ جلسات human acceptance الفعلية مع المعلمين والطلاب؛ لا تُسجل نتائج قبل حدوثها.


## Owner request — save all current work to GitHub

- [x] فحص الفرع والـremote والـHEAD وحالة working tree قبل الحفظ.
- [x] إنشاء commit محلي لكل التغييرات الحالية فقط.
- [x] رفع `feature/productization-v1` بالطريقة العادية والتحقق من SHA البعيد.
- [x] التحقق من بقاء `main` دون تغيير ونظافة working tree.

## Recovery after sandbox reset — current execution

- [x] استعادة `feature/productization-v1` من GitHub بعد عودة sandbox إلى `main` والـremote الداخلي.
- [x] التحقق من تطابق الفرع المستعاد مع المرجع البعيد الفعلي، مع حفظ baseline دون reset أو force push.
- [x] مواصلة التحقق المتكامل على الفرع المستعاد، مع إبقاء `main` دون تعديل.
- [x] ربط ArabicToolkitPanel بالـcanonical Grammar Lens وI3rab الموجودين، مع عرض التحليل والشرح فقط للحالات المثبتة وعدم اختلاق نتائج للنصوص غير المدعومة.
- [x] إضافة اختبارات unit وE2E لرحلة العربية: كتابة → تحليل/إعراب → شرح → نشاط، مع توثيق unsupported boundaries.
- [x] إعداد `docs/pilot/HUMAN_PILOT_RESULTS.md` بحالة Human Validation = NOT VERIFIED وبنموذج تسجيل الجلسات دون اختلاق نتائج.
- [x] ربط تقرير الإصدار النهائي بحزمة القبول البشري ومراجعة الحالة النهائية قبل التسليم.

## Master Product Transformation Directive — product coherence scope

- [x] توثيق مسارات الكائنات canonical ونقاط الانفصال الحالية بين اللوحة وأدوات المواد.
- [x] إضافة طبقة bounded للتعرف على المحتوى من النص، مع حالة توضيح آمنة عند انخفاض الثقة.
- [x] توحيد شريط الإجراءات السياقي داخل اللوحة للكائنات العربية والرياضيات والشعر دون كشف المصطلحات التقنية.
- [x] ربط نتائج التحليل والشرح والنشاط بالسياق الحالي وبالكائنات القابلة لإعادة الاستخدام، دون إنشاء engines أو registries مكررة.
- [x] تحسين تجربة الطالب والعرض وخارطة الدرس بما يثبت المسار التعليمي المتدرج.
- [x] تقوية اختبارات product coherence والتعرف bounded والفشل الآمن والرحلات العربية والرياضيات والشعر والمساعد.
- [x] تحديث PRODUCT_RELEASE_REPORT.md وإنشاء FINAL_HUMAN_VALIDATION.md وحفظ النسخة على فرع productization-v1 فقط.
- [x] إجبار حالات conflicting_sources وlow-confidence وAI inference على مراجعة المعلم، مع اختبار عقدي deterministic وفشل آمن.

## Live Product Demonstration — owner requested, no-new-development

- [x] تثبيت نسخة العرض على `feature/productization-v1` وcommit `213712af46443bdbf971e0716e4d7425c948b771` والتحقق من الحالة النظيفة.
- [x] عرض رحلة العربية والعبارة المحددة وخريطة الكلمة والنتائج الظاهرة فعليًا.
- [x] عرض البيت الشعري وتسجيل ما يظهر تلقائيًا وما يبقى bounded أو غير متحقق.
- [x] عرض رحلة الرياضيات `2x + 5 = 15` والتحويل إلى نشاط كما يظهر في الواجهة.
- [x] عرض Student View وPresentation Mode وتسجيل الفهم المرئي وتسلسل الشرح.
- [x] إعداد نتيجة العرض الحي فقط: ما عمل، ما لم يعمل، ما كان يدويًا، وما يحتاج محركًا/AI/UX، دون تعديل كود أو إعلان Pilot Ready.

## Product Coherence V2 — educational loop completion

- [x] تحويل Inspector إلى لغة تعليمية بشرية بالكامل وإخفاء JSON/مصطلحات البنية الداخلية عن المعلم والطالب.
- [x] ربط النشاط بمصدره الموضوعي مع حالة تقييم صريحة: صحيح/غير صحيح/يحتاج مراجعة/لم يُقيّم بعد.
- [x] إظهار feedback تعليمي وإتاحة retry حقيقي وحفظ lineage بين الإجابة والتقييم والمراجعة.
- [x] توسيع math bounded فقط إلى الصيغتين المدعومتين `2x + 3 = 11` و`2x + 5 = 15` مع خطوات تحقق ظاهرة، وإبقاء الصيغ الأخرى في حالة آمنة.
- [x] إضافة اختبارات unit وPlaywright للحلقة الكاملة والنشاط المرتبط بالمصدر وfeedback/retry وStudent View دون ادعاءات غير مثبتة.
- [x] تحديث PRODUCT_RELEASE_REPORT.md وFINAL_HUMAN_VALIDATION.md بالنتائج الفعلية وحفظ checkpoint دون تعديل main أو فتح PR/merge.
- [x] إصلاح تلميح الخطأ الحسابي بعد توسيع math bounded بحيث يبقى تلميح 11 للمعادلة القديمة وتظهر قيمة الطرف الصحيحة للحالة الجديدة.
- [x] إزالة نموذج الإجابة المكرر من TeacherProductShell Student View وجعل ClassroomLoopPanel هو مسار الإجابة والتقييم والـfeedback والـretry الوحيد.
- [x] إصلاح توافق createMathVisualizationLens مع fixture الرياضي القديم في اختبارات Gate 4B مع إبقاء دعم 2x + 5 = 15 مثبتًا.
- [x] جعل verification في ClassroomLoop مشتقًا من المشكلة الرياضية الفعلية بدل التعبير hard-coded القديم.
- [x] إزالة كشف Gate4BWorkspace المكرر من مساحة المعلم، والإبقاء على TeacherProductShell + ClassroomLoop كلوحة واحدة للمستخدم.
- [x] إزالة بقايا `studentFeedback` من Student View بعد توحيد مسار الإجابة مع ClassroomLoopPanel وإغلاق فحص TypeScript.
- [x] تحديث assertion الوصول في Journey N لتثبت وجود مناطق aria-live المطلوبة بدل الاعتماد على عدد قديم هش بعد توحيد Student View.
- [x] تهيئة محاولات الرياضيات بخطوات فارغة مرتبطة بالمشكلة canonical حتى تُقيّم كـincomplete لا unsupported عند عدم إدخال خطوات.
- [x] استكمال provenance الخاص بمحاولات ClassroomLoop بـsourceRange صالح حتى يمر تقييم mathStepSlice ولا يُصنّف الإدخال غير المعبأ unsupported.
- [x] مواءمة assertion الرياضي في Journey D مع feedback المبسط الظاهر عند disclosureLevel 1، مع استمرار إثبات تشخيص incomplete-step.
- [x] جعل مثال الإجابة الرياضية في Student View مشتقًا من المعادلة الحالية بدل placeholder ثابت `x = 4`.

## Executive Visual Refactoring — UI-only

- [ ] مراجعة أنماط tldraw وExcalidraw وتوثيق القرارات البصرية القابلة للتطبيق دون نسخ معماريتهما.
- [ ] تحويل مساحة المعلم إلى hero canvas أكثر اتساعًا وتقليل الحاويات الثقيلة والضوضاء البصرية.
- [ ] تحسين ContextualActionBar إلى floating action pill مرتبط بالكائن المحدد مع الحفاظ على testids والسلوك الحالي.
- [ ] توحيد الألوان والطباعة والمسافات RTL للوحة والمعلم والطالب والعرض دون تعديل backend أو domain contracts.
- [ ] تنفيذ تحقق بصري Desktop/Mobile واختبارات check وVitest وPlaywright وbuild وdiff-check.
- [ ] تحديث ملاحظات التصميم وحفظ checkpoint ورفع feature/productization-v1 فقط، مع إبقاء main دون تغيير.


## Executive Visual Refactor — feature/productization-v1

- [x] Refactor TeacherCanvas into a hero-canvas presentation with lighter surface, floating tool controls, contextual object strip, and non-blocking inspector sheet.
- [x] Redesign ContextualActionBar as a floating contextual pill with compact RTL actions and bounded result surface.
- [x] Remove visible developer-facing canvas labels and raw object IDs from the teacher-facing UI while preserving accessible behavior and evidence semantics.
- [x] Refine TeacherProductShell identity, Arabic typography, calm olive/terracotta/paper palette, responsive setup controls, and teacher/student/presentation shell styling.
- [x] Fix desktop canvas hit-testing regression caused by an inspector overlay covering selectable objects.
- [x] Fix mobile header hit-testing regression by making teacher actions a responsive two-column grid with an in-viewport save action.
- [x] Run pnpm check, Vitest 132/132, production build, git diff --check, and Playwright 36/36 across Chromium and mobile-chromium.
- [x] Capture final visual verification at 1280×720 and 390×844 and record evidence in docs/qa/UI_REFACTOR_VISUAL_FINDINGS.md.
