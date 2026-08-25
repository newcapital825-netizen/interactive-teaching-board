# Gate 4C-B — Mathematics Step-by-Step Vertical Slice

## Phase 0 Discovery Report

**المستودع:** [interactive-teaching-board](https://github.com/newcapital825-netizen/interactive-teaching-board)  
**Baseline المعتمد:** `feature/gate-4c-arabic-i3rab-hardening`  
**Baseline HEAD:** `767feb294f959dbd1e6d81a695f10bff8afd8d07`  
**Main baseline:** `ee646db6863ef494ddfcb954ac1823413d37db1f`  
**Discovery status:** مكتملة؛ لم يُكتب production code في هذه المرحلة.

## 1. Purpose and Stop Rule

هذا التقرير يثبت نتائج الفحص قبل تنفيذ Gate 4C-B. الهدف ليس بناء Math Engine عام أو CAS، بل إثبات أن Mathematics يمكن أن تعمل كـ subject engine محدود فوق Universal Teacher Workspace الحالي، مع بقاء Core Board وEducational Object Engine وAssessment وFeedback وPersistence مشتركة بين العربية والرياضيات.

> لا يبدأ تنفيذ production code قبل اكتمال هذا التقرير. وبعد اكتمال Gate 4C-B يجب التوقف قبل Gate 4D، وأي توسعة إلى Math Engine عام أو AI أو OCR أو cloud أو collaboration أو billing أو تعديل `main` تتطلب تفويضًا مستقلًا.

## 2. Baseline Verification

تم فحص repository root والحالة المحلية والفرع والتاريخ وremote GitHub. الفرع المحلي هو `feature/gate-4c-arabic-i3rab-hardening`، وHEAD يطابق الفرع المنشور على GitHub عند `767feb294f959dbd1e6d81a695f10bff8afd8d07`. بقي `main` عند `ee646db6863ef494ddfcb954ac1823413d37db1f` ولم يُعدّل.

الحالة المحلية أصبحت تحتوي تعديلًا توثيقيًا مقصودًا في `todo.md` لإضافة قائمة عمل Gate 4C-B؛ هذا التعديل ليس production code وسيُنقل إلى فرع Gate 4C-B فقط بعد اكتمال Discovery. remote GitHub الصحيح هو `github`; أما `origin` فهو remote داخلي غير صالح لفحص GitHub المباشر، ولذلك لن يُستخدم في push أو clean-clone verification.

## 3. What Already Exists

### 3.1 EducationalObject

الملف `client/src/lib/educationalObjects.ts` يعرّف العقد framework-independent `EducationalObject<TType, TContent>`. العقد يحتوي على `id`, `type`, `version`, `schemaVersion`, `position`, `dimensions`, `transform`, `zIndex`, `visible`, `locked`, `metadata`, `content`, `capabilities`, `source`, وtimestamps. كما يوفّر validation بنيويًا، capability checks، lifecycle metadata، duplication، وserialization envelope.

هذا هو المصدر canonical للهوية والموقع والتحويلات والقدرات والحالة المرئية والمحتوى. لن يُنشأ `MathEducationalObject` أو عقد مكاني/هوية رياضي ثانٍ.

### 3.2 Registry and Factory

الملف `client/src/lib/objectRegistry.ts` هو registry الوحيد ويحتوي تعريفات `SentenceObject`, `EquationObject`, `GraphObject`, `QuestionObject`, و`ActivityObject` إلى جانب الأنواع العامة. كل تعريف يحدد renderer والقدرات والتحقق والتخزين. المسار الوحيد للإنشاء هو `createRegisteredEducationalObject`، مع safe unknown-object fallback موجود أصلًا للتعامل مع payloads غير المعروفة.

`EquationObject` موجود ككائن canonical قابل للتحرير والتحريك والتغيير في الحجم والتكرار والتجميع والتفاعل والعرض. `QuestionObject` و`ActivityObject` يقدمان عقودًا عامة يمكن استخدامها كأوعية board-level، لكن تفاصيل Mathematics step assessment ستبقى subject contract مشتقًا ومحدودًا، لا registry أو factory جديدًا.

### 3.3 Core Board, Adapters, Transformations, Pages, and Presentation

`client/src/lib/coreBoard.ts` يربط board document بالكائنات المسجلة، ويدعم الإنشاء والإدراج والصفحات والحفظ المحلي وgroup transforms وchild scaling. `EquationObject` يعامل ككائن board عادي، وليس له board infrastructure خاص بالرياضيات.

تعمل طبقة adapters وrenderers على تمثيل الكائنات دون امتلاك معنى Mathematics. `objectTransformations.ts` يصف transformations ويحافظ على `sourceObjectId` ولا يحل المعادلات. representation الحالية لـ `EquationObject` تشمل visual وactivity؛ وهذا يتيح إضافة Math Visualization Lens مشتقًا من المصدر دون إنشاء source of truth جديد.

الـworkspace الحالي في `Gate4BWorkspace.tsx` يثبت lifecycle مشتركًا: إنشاء source، إنشاء lens، نشاط، إدخال، assessment، feedback، teacher override، local save/restore، presentation mode، subject switcher، keyboard save، وRTL layout. أي Mathematics workflow جديد يجب أن يوسّع هذا المسار بدل إنشاء لوحة أو صفحات أو persistence خاصة بالرياضيات.

### 3.4 Assessment, Feedback, Provenance, Events, and Migration

`client/src/lib/gate4bTeaching.ts` يحتوي حاليًا على أنواع مشتركة لـ `Assessment`, `Feedback`, `AssessmentEvent`, `TeacherOverride`, و`Provenance`. كما يحتوي على assessment وfeedback functions مشتركة بين العربية والرياضيات، وتبقى teacher override منفصلة عن system assessment مع event وprovenance مستقلين.

التسلسل الحالي يوفّر `serializeLesson`, `deserializeLesson`, `migrateLesson`، sanitization للمفاتيح الخطرة، safe handling للـ malformed payloads، migration من lesson schema v1 إلى v2، وحفظ IDs وmetadata وprovenance. يجب أن تُوسّع هذه الحدود بأقل إضافة لازمة، مع عدم إنشاء `MathLesson`, `MathAssessment`, أو `MathPersistence` مستقل.

### 3.5 Existing Arabic Slice

Arabic I3rab hardening موجود كـ vertical slice مثبت على نفس `gate4bTeaching.ts` والـworkspace. يتضمن golden fixtures، structured response، progressive disclosure، teacher/student mode، deterministic diagnostics، override auditability، migration، وround-trip tests. هذا ليس نموذجًا ينبغي نسخه؛ بل دليل على أن subject-specific semantics يمكن تركيبها فوق البنية المشتركة.

### 3.6 Existing Mathematics Slice

يوجد حاليًا Mathematics lens محدود لـ `2x + 3 = 11` في `createMathSource` و`createMathVisualizationLens`. العدسة تحفظ `sourceObjectId`, `sourceRange`, `sourceVersion`, وprovenance، وتعرض خطوتين ثابتتين: طرح 3 ثم القسمة على 2، مع `solutionX = 4`.

يوجد أيضًا نشاط رياضي بإجابة نهائية واحدة تقريبًا، وتقييم حالي يميز incomplete وcorrect وvalid-alternative وpartially-correct وincorrect، لكنه لا يملك `SolutionStepObject` مستقلًا، ولا يقيم كل خطوة، ولا يفصل صراحة بين ANSWER وVERIFICATION، ولا يميز بصورة كافية arithmetic/sign/transformation/unsupported reasoning. هذه هي الفجوة الأساسية التي سيعالجها Gate 4C-B ضمن slice محدود.

## 4. Reuse Matrix

| المجال | الموجود canonical | قرار Gate 4C-B |
|---|---|---|
| الهوية والمحتوى المكاني | `EducationalObject` | إعادة استخدام كامل |
| التسجيل والإنشاء | `objectRegistry` و`createRegisteredEducationalObject` | عدم إنشاء registry/factory ثانٍ |
| قدرات الكائن | `EducationalCapability` و`hasCapability` | إعادة الاستخدام؛ لا قدرات Math خاصة باللوحة |
| Equation source | `EquationObject` | إعادة الاستخدام كـ source object |
| Question/Activity | `QuestionObject` و`ActivityObject` | إعادة الاستخدام عند الحاجة ككائنات board-level |
| اللوحة والصفحات والتحويلات | `coreBoard` وtransformation/adapters | لا redesign ولا Math-specific board infrastructure |
| lens provenance | `Provenance` وlens metadata | اشتقاق Math lens من المصدر مع traceability |
| assessment | `Assessment` وshared assessment path | توسيع deterministic contract لا محرك ثانٍ |
| feedback | `Feedback` وprogressive disclosure conventions | توسيع الرسائل الرياضية على نفس النموذج |
| override | `TeacherOverride` وassessment events | الإبقاء على system result وteacher decision منفصلين |
| persistence/migration | lesson migration v1/v2 وsafe sanitization | توسيع migration بأمان وبأقل schema change |
| UI workflow | `Gate4BWorkspace` | إضافة خطوة رياضية محدودة داخل نفس workspace |
| tests | Gate 2/3A/3B/4B regression suites | إضافة tests رياضية دون كسر العربية |

## 5. What Must Be Added

الإضافة المطلوبة محصورة في subject contract رياضي deterministic، وليست طبقة بنية تحتية ثانية. يلزم تمثيل problem وsolution steps stable IDs داخل المجال الرياضي مع source problem ID، step number، expression before/after، operation، mathematical justification، validity state، وprovenance.

يلزم أيضًا تمثيل مسارين صالحين على الأقل للمثال `2x + 3 = 11`، مع حالات invalid/incomplete/unsupported، وتقييم كل خطوة لا النتيجة النهائية فقط. يجب فصل final answer عن verification، بحيث لا يؤدي `x = 4` تلقائيًا إلى إثبات أن `2(4) + 3 = 11` تم التحقق منه.

يلزم إضافة diagnostics محددة، feedback levels 1–5، Math Visualization Lens مشتق من canonical object ويحافظ على `sourceObjectId`, `sourceRange`, `sourceVersion`، وteacher workflow صغير داخل workspace الحالي. يجب اختبار persistence وmigration وduplicate identity وmalformed payloads وlens regeneration.

## 6. Architectural Duplication Prohibitions

تُعد العناصر التالية blockers إذا ظهرت بلا تفسير: `MathEducationalObject` منفصل، `MathRegistry`، `MathFactory`، `MathAssessmentEngine`، `MathFeedbackEngine`، `MathPersistence`، provenance مستقل، event model مستقل، board renderer خاص ينشئ مصدرًا ثانيًا، أو symbolic solver عام.

لن يُستخدم fuzzy matching أو final-answer bypass. ولن تُضاف مكتبة CAS أو arbitrary algebra/calculus/theorem proving. ستظل truth table والقواعد محصورة في الحالات المختارة والمثبتة في Golden Dataset.

## 7. Proposed Bounded Contract Boundary

سيُبنى العقد فوق `gate4bTeaching.ts` أو ملف subject contract مجاور له، مع إعادة استخدام `EducationalObject` و`Provenance` وshared `Assessment` و`Feedback`. الأسماء المقترحة هي `MathProblemObject` و`SolutionStepObject` بوصفها domain shapes مشتقة/محتوى تعليميًا مرتبطًا بالمصدر، لا أنواع board objects جديدة إلا إذا أثبتت الحاجة لذلك عبر registry الموجود.

كل `SolutionStepObject` سيحتوي على الأقل على: `id`, `sourceProblemId`, `stepNumber`, `expressionBefore`, `operation`, `expressionAfter`, `justification`, `validityState`, و`provenance`. لا يُسمح بأن يملك الـlens أو UI نسخة مستقلة من الحل؛ العدسة تُعاد توليدها deterministic من problem/steps.

## 8. Discovery Decision

**القرار: GO إلى Phase 1 — Mathematical Pedagogical Contract، مع نطاق محدود ومشروط.** البنية الحالية كافية لإثبات Mathematics كـ subject engine فوق الـCore، لكن الادعاء يجب أن يبقى محدودًا إلى linear equation slice محدد. الفجوة ليست في Core Board، بل في modeling وstep-level assessment وverification وdiagnostics الرياضية.

لا يوجد مبرر لإنشاء بنية board أو registry أو assessment مستقلة. قبل بدء production code يجب إنشاء فرع وحيد باسم directive المختصر الموحّد `feature/gate-4c-math-step-slice` من baseline Arabic hardening، دون تعديل `main` أو force push أو rebase.

## 9. Remaining Verification Requirements

بعد التنفيذ يجب أن تتضمن الأدلة: Golden Dataset صغيرًا بعشر حالات على الأقل، alternative paths، negative cases، step-level assessment، diagnostics، progressive feedback، answer/verification separation، provenance chain، teacher override، save/restore، migration، lens regeneration، duplicate identity، malformed payload safety، static accessibility، RTL، keyboard/focus/labels، mobile layout، deterministic benchmarks، architecture hygiene scan، وclean clone من الفرع المنشور.

يجب تسجيل القيود دون تحويلها إلى نجاح زائف: `SCREEN READER = NOT VERIFIED` إذا لم يوجد اختبار قارئ شاشة، و`TOUCH = NOT VERIFIED — HARDWARE UNAVAILABLE`، و`STYLUS = NOT VERIFIED — HARDWARE UNAVAILABLE`، و`UI AUTOMATION = NOT VERIFIED — RUNNER UNAVAILABLE`، و`REAL BROWSER PERFORMANCE = NOT VERIFIED` عند غياب الأدوات الواقعية.

## 10. Phase 0 Conclusion

اكتملت Discovery. لم يُكتب production code أو Math implementation في هذه المرحلة. يمكن الانتقال إلى Phase 1 فقط ضمن branch جديد وبعد تثبيت هذا التقرير وقائمة العمل. يجب ألا يبدأ Gate 4D أو أي توسعة أخرى بعد ذلك، بل يتوقف التنفيذ عند تقرير Gate 4C-B وينتظر مراجعة المالك.
