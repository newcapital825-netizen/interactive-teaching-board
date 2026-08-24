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
