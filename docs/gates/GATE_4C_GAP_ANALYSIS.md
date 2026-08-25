# Gate 4C Gap Analysis

## Scope

هذه الوثيقة تحليل فجوات فقط. لا تضيف implementation ولا dependency ولا subject engine runtime. درجات الحالة مقيدة بـ`PROVEN` و`PARTIALLY PROVEN` و`NOT PROVEN` و`NOT VERIFIED` و`BLOCKED`.

## Evidence matrix

| المجال | Gate 4B evidence | Gap to useful product | Required evidence | Status |
| --- | --- | --- | --- | --- |
| Canonical core | EducationalObject/registry/factory/capabilities موجودة ومختبرة | Contract coverage أكبر للأنواع الجديدة | contract tests لكل recipe | PROVEN |
| Arabic source | SentenceObject deterministic واحد | نصوص متعددة، ranges، punctuation، variants | golden grammar/reading corpus | PARTIALLY PROVEN |
| Arabic analysis | Grammar Lens محدود بثلاثة أدوار | I3rab/morphology/reading وغيرها | expert-labeled dataset + validator | NOT PROVEN |
| Math source | EquationObject واحد | expressions/functions/geometry/data/problems | typed object maps + fixtures | PARTIALLY PROVEN |
| Math steps | خطوتان تمثيليتان ثابتتان | parse/transform/verify لكل خطوة | step golden dataset + validator | PARTIALLY PROVEN |
| Assessment | الحالات الخمس وdiagnostics الأساسية | rubric أوسع وstep/concept/reasoning policies | unit/integration/teacher review | PARTIALLY PROVEN |
| Feedback | explanation/hint/nextStep وoverride | misconception models وlanguage variants | outcome review + feedback corpus | PARTIALLY PROVEN |
| Provenance | source→lens→activity→assessment→feedback→override | multi-transform lineage وexternal audit | lineage snapshots | PARTIALLY PROVEN |
| Persistence | local serialization وv1→v2 migration | version chains، conflict policy، cloud boundary | migration matrix | PARTIALLY PROVEN |
| Browser flow | screenshots وsemantic markup | open-to-present replay | browser runner | NOT VERIFIED |
| Accessibility | static/visual smoke | AT, contrast automation، canvas alternatives | keyboard/AT audit | PARTIALLY PROVEN |
| Touch/stylus | لا أجهزة | physical interaction confidence | hardware test matrix | NOT VERIFIED |
| Performance | Node 100/250/500 | browser 1000/2500 وload latency | browser/device benchmarks | NOT VERIFIED |
| Security | sanitized migration وno executable payload path | threat model وcontent validation | security review | PARTIALLY PROVEN |
| Licensing | لا dependency جديدة في Gate 4B | future NLP/math renderer review | license inventory | NOT PROVEN |
| Teacher value | workflow prototype | classroom usefulness and authoring speed | teacher validation | NOT PROVEN |

## Root causes

الفجوة الأساسية ليست نقص مكوّن واجهة، بل أن Gate 4B أثبت plumbing تعليميًا محدودًا لا knowledge coverage. أي توسعة مباشرة من دون datasets وvalidators ستخلط بين قابلية العرض وصحة المحتوى. كما أن browser and hardware evidence غير متاحة، لذلك لا يمكن تحويل screenshots إلى قبول تشغيلي.

## Risks and mitigation

| الخطر | الإشارة | المعالجة قبل التوسع |
| --- | --- | --- |
| Duplicate domain model | إنشاء Arabic/Math core موازٍ | إلزام كل object بـregistry canonical contract |
| Unproven correctness | parser output يعرض كحقيقة | `validationState` و`reviewStatus` وgolden fixtures |
| Provenance loss | lens أو activity تنسخ المصدر | lineage assertions عند كل transformation |
| Unsafe migration | قبول unknown schema أو fields | version allow-list وsafe rejection |
| Big-bang scope | بناء كل المجالات دفعة واحدة | vertical slice واحد لكل قرار review |
| Teacher overload | screen density وfeedback طويل | progressive disclosure وteacher usability tests |
| Browser blind spot | نجاح Node فقط | فصل Node/browser/device status |
| Privacy expansion | responses أو notes سحابية مبكرًا | local-first، no accounts، no sharing |

## Minimum decision threshold

لا ينبغي أن يُعتمد أي engine expansion لمجرد ظهور Lens جديدة. الحد الأدنى هو: source object canonical، transformation deterministic أو معلنة الحدود، provenance كامل، validator قابل للتفسير، activity قابلة للحفظ والاستعادة، negative tests، teacher-review state، وقرار واضح لما لم يُثبت.

## Recommendation

القرار الموصى به هو **CONDITIONAL DISCOVERY**: اعتماد الفجوات والـroadmaps، ثم فتح implementation صغير فقط بعد تحديد Golden Dataset وcontract test للمسار المختار. لا يوصى ببناء Arabic Engine أو Math Engine شامل في دفعة واحدة.

## References

1. [Gate 4C Discovery](./GATE_4C_DISCOVERY.md)
2. [Gate 4B Final Hardening](./GATE_4B_FINAL_HARDENING.md)
3. [Subject Engine Architecture](../architecture/SUBJECT_ENGINE_ARCHITECTURE.md)
