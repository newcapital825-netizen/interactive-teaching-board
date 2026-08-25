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

## Gate 4C-B Mathematics Step-by-Step Vertical Slice — authorized

- [ ] Read the complete Gate 4C-B directive and extract its scope, stop rules, evidence requirements, and limitations.
- [ ] Verify the approved Arabic hardening baseline, repository, branch, HEAD, main, remote, and clean working tree.
- [ ] Create exactly one `feature/gate-4c-b-math-step-slice` branch only after baseline verification; never modify main or rewrite shared history.
- [ ] Complete Phase 0 Discovery and write `docs/gates/GATE_4C_B_MATH_DISCOVERY.md` before production code.
- [ ] Reuse canonical EducationalObject, Registry, Factory, Capabilities, Migration, Adapters, Transformations, Assessment, Feedback, Provenance, Events, and Persistence; document architectural non-duplication.
- [ ] Implement one bounded mathematics step-by-step slice for `2x + 3 = 11`, not a general Math Engine or symbolic mathematics engine.
- [ ] Add MathProblemObject/SolutionStepObject contracts, multiple valid paths, step-level deterministic assessment, diagnostics, progressive feedback, answer/verification separation, and teacher override provenance.
- [ ] Add a small deterministic Golden Dataset covering positive, alternative, negative, incomplete, malformed, invalid, unsupported, and verification cases.
- [ ] Add one canonical Math Visualization Lens derived from the mathematical object and preserving sourceObjectId/sourceRange/sourceVersion.
- [ ] Integrate the smallest teacher/student workflow into the existing board with save/restore and presentation mode.
- [ ] Add regression, negative, malformed, migration, persistence, round-trip, provenance, UI/RTL/responsive, and deterministic tests.
- [ ] Run check/test/build/diff-check and clean-clone verification; document unavailable hardware/browser/accessibility validation honestly.
- [ ] Write the Gate 4C-B report, push one branch only, do not open PR, do not merge, do not start Gate 4D, and stop for Owner Review.
