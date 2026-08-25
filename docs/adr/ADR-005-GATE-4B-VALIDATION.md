# ADR-005 — Gate 4B Validation & Hardening

## الحالة

**Accepted for Owner Review — Decision B: CONDITIONAL.**

## السياق

يحتاج Controlled Vertical Slice للعربية والرياضيات إلى دليل يتجاوز نجاح unit tests المنفردة. المطلوب هو إثبات بقاء نموذج `EducationalObject` وregistry وfactory وcapabilities وassessment وfeedback وmigration/serialization canonical، مع provenance كامل من المصدر إلى النشاط والتقييم والتغذية الراجعة.

## القرار

نُبقي Gate 4B على الفرع المستقل `feature/gate-4b-validation-hardening` فوق commit Gate 4B المعتمد. نضيف hardening محدودًا إلى عقد التقييم المشترك بإضافة `valid-alternative` و`incomplete` و`AssessmentDiagnostic`، وندعم feedback بـ`nextStep` وحقول contract اختيارية لـmisconception وteacherOverride. نضيف اختبارات validation ومصفوفات تغطية وbenchmarks deterministic، ولا نضيف محركًا موضوعيًا ثانيًا أو خدمة AI أو backend.

## لماذا ليس A — PASSED؟

يشترط القرار A أن تكون migration workflow وteacher lifecycle وassessment وfeedback وprovenance مثبتة بالمستوى المطلوب، مع check/test/build نظيفة. في الحالة الحالية، core provenance والرحلتان والتقييم الأساسي مثبتة، لكن migration بين إصدارات lesson workflow، teacher override التشغيلي، browser automation، touch/stylus، real browser performance، وfull WCAG audit ليست مثبتة بالكامل. لذلك لا يجوز تحويلها إلى passed.

## النتائج المتوقعة

يبقى Core Board subject-agnostic، وتبقى Arabic وMathematics subject engines فوقه. كل representation مشتق يعلن `sourceObjectId` و`sourceVersion` وderivation type، وكل Assessment يحمل provenance وdiagnostic. الحفظ والاستعادة لا ينفذان payload ككود ولا يغيران source of truth.

## البدائل المرفوضة

رُفض إنشاء ArabicAssessmentEngine أو MathAssessmentEngine مستقلين، ورُفض إدخال AI grading أو probabilistic feedback، ورُفض تعديل CoreBoard لمعرفة قواعد المادة. كما رُفض اعتبار قياس Node benchmark دليلًا على real-browser performance أو اعتبار smoke review دليل WCAG compliance.

## العواقب

يزداد وضوح حالات التقييم ومسار الخطوة التالية، وتصبح فجوات التحقق قابلة للقراءة في matrix واحدة. في المقابل، يظل المنتج محدودًا بسيناريوهين deterministic، ويحتاج مالك المشروع إلى مراجعة CONDITIONAL قبل أي توسعة. لا يُفتح Gate 4C ضمن هذا القرار.

## الأدلة

- `docs/architecture/GATE_4B_VALIDATION_MATRIX.md`
- `docs/architecture/LEARNING_LIFECYCLE_VALIDATION.md`
- `tests/gate4b-validation-hardening.test.ts`
- `client/src/lib/gate4bTeaching.ts`
