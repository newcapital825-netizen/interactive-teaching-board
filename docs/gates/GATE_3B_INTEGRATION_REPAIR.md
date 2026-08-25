# Gate 3B Architectural Integration Repair

## Scope and baseline

هذا التقرير يوثق إصلاح التكامل بعد دمجه في `main`. repair branch هو `feature/gate-3b-integration-repair`، وقد دُمج عبر PR #2 في merge commit `f2c0cf2be65d453c240b90278a2dde030e50e978`. رأس `main` الحالي هو `f2c0cf2be65d453c240b90278a2dde030e50e978`. أُنشئ الفرع من آخر رأس مرفوع لـGate 3B: `0299656e6f07456296659a891df18f008b51d1f5`، وكان Gate 3A عند `fb7aa15af572733075a765a824bc2c04ac3023c6`.

## 1. ما يستخدمه Gate 3B حاليًا

تستخدم تجربة Gate 3B `CoreBoardBench` و`coreBoard.ts` بعد ربطهما بعقد Gate 3A canonical. CoreObject هو typed UI projection لحقول العرض، بينما المصدر canonical هو EducationalObject/registry/capability model. تجربة UX تحافظ على pages/history/pan/zoom/presentation/save-state، والـtoolbar يشتق عناصر الإدراج من registry ولا يستخدم fallback architecture.

## 2. ما يقدمه Gate 3A

يوفر Gate 3A العقد العام `EducationalObject` المستقل عن React وDOM وCanvas، ونموذج capabilities الصريح، و`objectRegistry` الذي يربط النوع بالـschema والـfactory والقدرات والتحقق، وgeneric factories لـQuestion/Activity وcross-subject proof. كما يوفر lifecycle وserialization، وmigration للكائنات القديمة، وCanvas/Graph adapter contracts plain-data، وcontrolled transformations. يضم كذلك `SentenceObject`, `EquationObject`, `ConceptGraphObject`, `QuestionObject`, و`ActivityObject` ضمن registry canonical، ويملك contract suite مستقلًا.

## 3. فروق التوافق

| Area | Gate 3B current | Gate 3A canonical | Repair decision |
|---|---|---|---|
| Object creation | local `createObject` and hard-coded toolbar callbacks | `createRegisteredObject` via registry | route all insertions through registry |
| Capabilities | local UI assumptions and partial checks | explicit capability model | derive contextual controls from capabilities |
| Model | `CoreObject` local shape | `EducationalObject` with schema/lifecycle fields | use Gate 3A type as canonical and retain only documented UI projections |
| Persistence | Core Board local document save/restore | versioned serialization and migration | persist/restore through Gate 3A serializer/migration |
| Adapters | Gate 3B stage renders CoreObject directly | plain-data Canvas/Graph adapter contracts | keep renderer boundary and convert at boundary |
| Transformations | pure UX layout helpers | controlled representation transformations | invoke/retain Gate 3A transformation metadata; no subject engine |
| Tests | Gate 2 + Gate 3B suites | Gate 3A contract suite | run all suites together |

## 4. ما يجب تكييفه

يجب أن يصبح `CoreBoardBench` مستهلكًا للregistry لا مالكًا لقائمة الأنواع. يجب أن يطلب insertion recipe من registry، ويستخدم capabilities لتقرير إظهار edit/resize/group/layer actions. يجب أن تبقى UX layout helpers على مستوى position/size/z-order، بينما تبقى semantic data وserialization وmigration في Gate 3A. يجب أن يتعامل renderer مع canonical objects عبر Canvas Adapter plain data بدل إضافة نموذج ثالث.

## 5. ما لن نفعله

لن ننسخ ملفات Gate 3A إلى Gate 3B، ولن ننشئ `FallbackObject` أو `LegacyObject` أو `DuplicateRegistry` أو نظام capabilities ثانٍ. لن نعيد تصميم Gate 3A، ولن نبني محركات Arabic/Math أو transformations subject-specific. compatibility layer مسموح فقط كـtyped projection مؤقتة على حدود العرض، مع اختبار يثبت أنها لا تصبح model مستقلًا.

## 6. blockers الفعلية

تم حسم تعارض `coreBoard.ts` و`CoreBoardBench.tsx` باعتماد Gate 3A canonical domain وربط UX بها، ونجحت projection المطلوبة للـresize/grouping. بعد الدمج كان يوجد مكوّن evidence قديم غير مستخدم هو `GeneralWhiteboardBench.tsx` ويحتوي local `EducationalObject` type؛ تم التحقق من عدم وجود مراجع له وإزالته كـarchitectural hygiene cleanup مصرح به في Gate 4A.

## 7. معيار النجاح

النجاح يعني: object creation عبر registry، capabilities تمنع controls غير المدعومة، Gate 3A contract tests وGate 2/Gate 3B tests تمر، persistence يحفظ IDs/styles/position/dimensions/z-order/semantic data/metadata، grouping وtransformations لا تتجاوز canonical model، وCanvas adapter يبقى boundary مستقلًا. لا PR ولا merge ضمن هذه الجولة.

## 8. تنفيذ الإصلاح

أُنشئ الفرع `feature/gate-3b-integration-repair` من آخر Gate 3B المرفوع، ثم دُمج تاريخ Gate 3A داخله فقط عبر merge commit محلي دون تعديل `main`. حُسم التعارض باعتماد `coreBoard.ts` من Gate 3A باعتباره canonical bridge، مع الإبقاء على تجربة `CoreBoardBench` التحريرية من Gate 3B. لا يوجد `FallbackObject` أو registry مكرر أو نموذج domain ثالث.

أصبح toolbar الثانوي يولّد عناصره من `listObjectDefinitions()`، وتُمرر كل عمليات الإدراج عبر `createObject` الذي يستدعي `createRegisteredEducationalObject`. كما أصبح `CoreBoardBench` يقرأ capabilities من الكائن canonical لمنع edit/move/resize/rotate/duplicate/group operations غير المدعومة. حافظت الواجهة على صفحات Gate 3B، presentation، history، pan/zoom، persistence، وRTL folio UX.

تم إصلاح migration boundary ليحفظ metadata canonical الآمنة، بما فيها `renderer`، مع إسقاط مفاتيح `__proto__` و`constructor` و`prototype` لتجنب prototype pollution أثناء restore. أضيفت integration tests تثبت registry insertion، Question/Activity/Sentence/Equation/Graph، save→restore، grouping child scaling، وcontrolled transformations.

## 9. Verification snapshot

| Verification | Result |
|---|---|
| `pnpm check` | PASSED |
| Gate 2 tests | PASSED |
| Gate 3A contract tests | PASSED — 10 tests |
| Gate 3B tests | PASSED — UX and performance suites |
| Integration repair tests | PASSED — 3 tests |
| Aggregate result | PASSED — 8 files, 29 tests |
| Persistence semantic metadata | PASSED — IDs, capabilities, position, renderer |
| Grouping and child scaling | PASSED |
| Controlled transformation boundary | PASSED |

## 10. Known limitations

Touch and stylus hardware remain **NOT VERIFIED — HARDWARE UNAVAILABLE**. UI automation remains **NOT VERIFIED — RUNNER UNAVAILABLE**. Real-browser performance remains **NOT VERIFIED**. PR #2 is merged normally into `main` at merge commit `f2c0cf2be65d453c240b90278a2dde030e50e978`. The post-merge clean clone at that commit passed the required checks. No further code change is authorized in this round.

## 11. Post-repair owner review

تم إغلاق architectural hygiene finding الخاص بـ`GeneralWhiteboardBench.tsx` على فرع Gate 4A بعد التحقق من عدم وجود references. تبقى قبل أي مرحلة تنفيذية مراجعة diff المعماري، clean clone، visual smoke، وpersistence round-trip؛ Gate 4B وArabic Toolkit وMath Toolkit وAI خارج النطاق.
