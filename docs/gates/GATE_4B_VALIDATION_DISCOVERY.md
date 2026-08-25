# Gate 4B Validation Discovery

## الغرض والحدود

هذه الوثيقة تسجل اكتشاف فجوات التحقق في Controlled Vertical Slice القائم، ولا توسع المنتج. مصدر التحقق هو فرع Gate 4B المنشور، مع إبقاء Arabic وMathematics فوق الـcanonical core ودون إدخال AI أو OCR أو backend أو حسابات طلاب أو تعاون.

## baseline المعتمد

| العنصر | النتيجة |
| --- | --- |
| Repository | `newcapital825-netizen/interactive-teaching-board` |
| Base Gate 4B | `feature/gate-4b-vertical-slice` عند `ad8969170230079f066131fa624cda6512108973` |
| Validation branch | `feature/gate-4b-validation-hardening` |
| main | بقي دون تعديل؛ HEAD المرئي أثناء الاكتشاف `ee646db6863ef494ddfcb954ac1823413d37db1f` |
| Canonical model | `client/src/lib/educationalObjects.ts` |
| Canonical registry | `client/src/lib/objectRegistry.ts` |

## فجوات الاكتشاف

الفجوة الأهم ليست duplication في الكود، بل أن التحقق السابق أثبت الحالات الأساسية فقط. لم يكن هناك اختبار صريح لـ`valid-alternative` أو `incomplete`، ولا تقرير مركزي يربط متطلبات lifecycle بمواقع الأدلة. كما أن benchmark Gate 4B السابق قاس مسارًا domain واحدًا دون تفصيل كافٍ لـ100/250/500 objects وgroup/ungroup وlens regeneration في نفس السجل.

كانت هناك أيضًا فجوة تسمية في fixture قديم يستخدم اسم `EducationalObject` محليًا داخل اختبار Gate 1B، رغم أنه ليس نموذج إنتاج. أُعيدت تسميته إلى `Gate1BFrozenSentenceFixture` لمنع الالتباس مع النموذج canonical وعدم إعطاء scan معماري إشارة duplication كاذبة.

## قرارات hardening

تم توسيع عقد التقييم المشترك بإضافة `valid-alternative` و`incomplete` و`AssessmentDiagnostic`. كما أضيفت حقول اختيارية `nextStep` و`misconception` و`teacherOverride` إلى Feedback كقدرة contract، مع بقاء التقييم deterministic. لا توجد subject-specific assessment engines جديدة.

أضيف اختبار hardening مستقل يغطي source modification، إعادة توليد lenses، حالات التقييم الخمس، provenance خلال save/restore، identity في duplicate، snapshot semantics لدورات delete/undo/redo، malformed payload، والـbenchmarks المطلوبة. هذا لا يحول حدود browser أو hardware إلى نجاح مصطنع.

## قرار الاكتشاف

البنية قادرة على استيعاب دورة التحقق المطلوبة دون إعادة كتابة Core Board أو إنشاء registry/factory بديل. لكنها لا تثبت بعد كامل lifecycle في متصفح حقيقي، ولا migration بين إصدارات payload فعلية، ولا full WCAG، لذلك يجب أن يكون القرار النهائي **B — CONDITIONAL** ما لم يقدم Owner متطلبات تحقق إضافية أو بيئة browser/hardware.

## أدلة داخلية

- `client/src/lib/educationalObjects.ts`
- `client/src/lib/objectRegistry.ts`
- `client/src/lib/gate4bTeaching.ts`
- `tests/gate4b-validation-hardening.test.ts`
- `docs/gates/GATE_4B_REPORT.md`
