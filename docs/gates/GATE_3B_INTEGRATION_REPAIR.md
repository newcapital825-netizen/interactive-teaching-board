# Gate 3B Architectural Integration Repair

## Scope and baseline

هذا التقرير يسبق إصلاح التكامل ولا يغيّر `main`. repair branch هو `feature/gate-3b-integration-repair`، وقد أُنشئ من آخر رأس مرفوع لـGate 3B: `0299656e6f07456296659a891df18f008b51d1f5`. Gate 3A موجود على `feature/gate-3a-educational-object-engine` عند `fb7aa15af572733075a765a824bc2c04ac3023c6`.

## 1. ما يستخدمه Gate 3B حاليًا

تستخدم تجربة Gate 3B `CoreBoardBench` و`coreBoard.ts` من baseline Gate 3B، مع CoreObject محلي يملك `type`, `content`, `data`, `position`, `size`, `zIndex`, `style`, `metadata`, وحقولًا متخصصة لبعض الأنواع. تجربة UX تحافظ على pages/history/pan/zoom/presentation/save-state، لكنها تنشئ الأنواع عبر `createObject` وتعرض قائمة insertion ثابتة داخل toolbar. لذلك يصف التقرير الحالي البنية بأنها fallback آمنة عندما لا يكون Gate 3A مدمجًا في `main`.

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

هناك تداخل متوقع في `coreBoard.ts` و`CoreBoardBench.tsx` لأن كلا الفرعين عدّل هذين الملفين. هذا **merge/integration conflict قابل للإدارة** وليس blocker معماريًا؛ سيُحسم باختيار Gate 3A canonical domain وربط UX بها. إذا اتضح أن Canvas Adapter أو registry لا يوفران projection تكفي لاحتياجات resize/grouping الحالية، فسنتوقف ونصنف الحالة `ARCHITECTURAL BLOCKER` بدل اختراع workaround.

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

Touch and stylus hardware remain **NOT VERIFIED — HARDWARE UNAVAILABLE**. UI automation remains **NOT VERIFIED — RUNNER UNAVAILABLE**. Real-browser performance remains **NOT VERIFIED**. The current repair branch has not been pushed yet, and no Pull Request or merge to `main` is authorized in this repair round.

## 11. Post-repair owner review

يلزم قبل أي PR لاحق مراجعة diff المعماري والتأكد من أن `main` يضم Gate 3A بالطريقة المقصودة، ثم تشغيل clean clone كامل، وvisual smoke للـregistry-driven toolbar، وpersistence round-trip للكائنات العامة. بعد ذلك فقط يقرر المالك إن كان الإصلاح جاهزًا لجولة مراجعة مستقلة. Gate 4 وArabic Toolkit وMath Toolkit وAI خارج النطاق.
