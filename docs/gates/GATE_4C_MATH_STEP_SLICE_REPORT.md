# Gate 4C-B — Mathematics Step-by-Step Vertical Slice

## 1. Executive Summary

تم تنفيذ شريحة رياضيات ضيقة تثبت أن Universal Teacher Workspace يستطيع دعم تعليم معادلة خطية خطوة بخطوة فوق البنية canonical الموجودة. المثال المثبت هو `2x + 3 = 11`، مع problem contract، خطوتين، مسار بديل مكافئ، تقييم deterministic لكل خطوة، تشخيص تربوي، feedback تدريجي، تحقق بالتعويض، Math Visualization Lens، provenance، save/restore، migration، وواجهة RTL داخل اللوحة المشتركة.

هذه ليست Math Engine عامة وليست symbolic mathematics engine. لا يوجد AI أو OCR أو CAS أو fuzzy matching. النتيجة النهائية **B — CONDITIONAL** لأن الشريحة صحيحة ومتماسكة داخل نطاقها المحدود، لكن لا تثبت التعميم إلى جبر حر أو corpus رياضي واسع أو full WCAG أو real-browser performance.

## 2. Baseline

تم إنشاء الفرع الوحيد `feature/gate-4c-math-step-slice` من baseline العربي المنشور `feature/gate-4c-arabic-i3rab-hardening` عند `767feb294f959dbd1e6d81a695f10bff8afd8d07`. بقي `main` دون تعديل عند `ee646db6863ef494ddfcb954ac1823413d37db1f`، ولم يُفتح Pull Request ولم يحدث merge.

تم توثيق مرحلة Discovery قبل production code في [`GATE_4C_B_MATH_DISCOVERY.md`](./GATE_4C_B_MATH_DISCOVERY.md). remote GitHub المستخدم هو `github`، بينما remote الداخلي `origin` لم يُستخدم في عمليات GitHub.

## 3. Scope

النطاق هو مسار واحد لمعادلة `2x + 3 = 11`: problem، representation، step 1، step 2، final answer، verification، assessment، feedback، teacher review، provenance، presentation، save/restore، وmigration. تمت إضافة session رياضية اختيارية داخل `JourneyState` المشترك، ولم تتم إعادة صياغة Core Board أو إنشاء Math-specific board infrastructure.

## 4. Mathematical Contract

العقد المحدود في `client/src/lib/mathStepSlice.ts` يعتمد على `EducationalObject<"EquationObject", string>` و`Provenance` المشتركين. `MathProblemObject` يصف المعادلة وهدف التعلم والإجابة المتوقعة، و`SolutionStepObject` يصف كل خطوة بمُعرّف ثابت مشتق من problem ID ورقم الخطوة، وsource problem ID، وexpression before، وoperation، وexpression after، وmathematical justification، وvalidity state، وprovenance.

## 5. Problem Model

لا تُقبل إلا المعادلة canonical المحددة في هذه الشريحة. إنشاء problem آخر أو معادلة غير `2x + 3 = 11` يفشل بأمان برسالة خارج النطاق المثبتة. هذا القيد متعمد لمنع تحول Gate 4C-B إلى solver عام.

## 6. Solution Step Model

المسار canonical هو: `2x + 3 = 11` ثم طرح 3 من الطرفين لإنتاج `2x = 8`، ثم قسمة الطرفين على 2 لإنتاج `x = 4`. كل خطوة تحفظ operation وjustification منفصلين ولا تختزل الحكم إلى expression after فقط.

## 7. Alternative Methods

المسار البديل المقبول هو استخدام عبارة نقل الحد: `2x + 3 = 11` ثم `2x = 11 - 3`، مع تبرير أن النقل اختصار لطرح 3 من الطرفين، ثم القسمة على 2. القبول مبني على عقدين بديلين محددين، لا على fuzzy similarity أو مطابقة نصية عشوائية.

## 8. Golden Dataset

أُنشئت مجموعة من 10 حالات مستقرة في `createMathGoldenDataset`: one-step boundary، canonical two-step، negative sign، incomplete، arithmetic mistake، invalid transformation، correct alternative، correct final answer بعد intermediate invalid، malformed payload، وverification failure. كل حالة تحتوي stable ID وproblem وexpected steps وalternatives/invalid steps وdiagnostic وfeedback وexplanation وsource وsourceVersion وprovenance.

## 9. Negative Cases

تُرفض الأخطاء الحسابية مثل `2x = 9`، وأخطاء الإشارة مثل `-2x = 8`، والتحويلات غير المكافئة مثل `2x = 4`، والعملية غير المناسبة، والتبرير الناقص، والـstep غير المدعوم، وverification غير الصحيح. الوصول إلى `x = 4` لا يتجاوز صلاحية intermediate step.

## 10. Assessment

`assessMathStep` يقيم كل خطوة ويُرجع امتدادًا من `Assessment` canonical، مع `activityId` و`attemptId` و`answer` و`evaluation` و`effectiveEvaluation` وscore وfeedback IDs وevents وprovenance. الحالات shared هي correct وvalid-alternative وincorrect وincomplete، بينما تحفظ `validityState` الرياضي التفصيلي مثل invalid وunsupported.

## 11. Diagnostics

التشخيصات المحددة هي `operation-error`، `arithmetic-error`، `sign-error`، `transformation-error`، `incomplete-step`، `invalid-step`، `unsupported-reasoning`، `correct-alternative`، `correct-step`، و`verification-failure`. تمت إضافتها إلى قائمة `AssessmentDiagnostic` المشتركة بدل بناء diagnostic engine منفصل.

## 12. Feedback

التغذية الراجعة الرياضية امتداد من `Feedback` canonical وتستخدم progressive disclosure من المستوى 1 إلى 5. المستوى 1 يحدد الصلاحية، والمستوى 2 يوضح نوع المشكلة، والمستوى 3 يقدم hint، والمستوى 4 يشرح المبدأ، والمستوى 5 يكشف corrected step. لا يُكشف التصحيح في student mode قبل طلب مستوى الكشف المناسب، بينما يستطيع teacher mode رؤية التصحيح.

## 13. Verification

تم فصل `MathVerification` عن final answer. التحقق canonical هو `2(4) + 3 = 11`، وتُرفض صيغة التعويض الخاطئة مثل `2(5) + 3 = 11`. حفظ الإجابة `x = 4` لا يُنشئ verification ناجحًا تلقائيًا.

## 14. Math Visualization Lens

`regenerateMathVisualizationLens` يشتق operation steps وanswer وrepresentation من `MathProblemObject`، ويحفظ `sourceObjectId` و`sourceRange` و`sourceVersion` وprovenance. تغيير source version يعيد توليد العدسة deterministic دون إنشاء مصدر حقيقة ثانٍ.

## 15. Provenance

السلسلة المثبتة هي: source EquationObject ← MathProblemObject ← SolutionStepObject ← canonical Assessment/Feedback ← Verification، مع teacher workflow الموجود في workspace الذي يحفظ teacher override كحدث منفصل عندما يُستخدم مسار التقييم العام. كل step assessment يحمل provenance مشتقًا من problem provenance، ولا تُستخدم IDs عشوائية داخل عقد الخطوة نفسها.

## 16. Teacher Workflow

تم دمج MathStepCard داخل `Gate4BWorkspace` بعد Math Visualization Lens وقبل النشاط العام. يتيح للمعلم عرض المشكلة، اختيار teacher/student mode، وإظهار step 1 أو step 2، وللطالب إدخال before/operation/after/justification، ثم رؤية assessment وdiagnostic وhint وcorrected step عند المستوى المناسب، ثم إجراء verification. حفظ الدرس واستعادته يمران عبر lesson persistence المشتركة، ووضع العرض لا ينشئ سطحًا رياضيًا بديلًا.

Teacher override العام الموجود في `FeedbackCard` ما زال يستخدم `applyTeacherOverride` canonical ويحافظ على system assessment وteacher decision وreason وnote وevents وprovenance منفصلة. لا تُستبدل نتيجة النظام.

## 17. Accessibility

تم تنفيذ static checks للـRTL، labels، semantic inputs، focus-visible، readable LTR mathematical expressions داخل سياق عربي، وmobile layout. أضيفت حقول منظمة بعناوين عربية وARIA labels. لم يُجرَ screen-reader test فعلي، لذلك: `SCREEN READER = NOT VERIFIED`. كما أن `TOUCH = NOT VERIFIED — HARDWARE UNAVAILABLE` و`STYLUS = NOT VERIFIED — HARDWARE UNAVAILABLE` و`UI AUTOMATION = NOT VERIFIED — RUNNER UNAVAILABLE`.

## 18. Performance

أضيف benchmark قابل لإعادة الإنتاج داخل Vitest/Node يغطي problem creation وstep creation وassessment وfeedback وserialization وdeserialization وlens regeneration وsave/restore. القياس benchmark هندسي محلي فقط؛ `REAL BROWSER PERFORMANCE = NOT VERIFIED`. كما استمرت تحذيرات Vite المتعلقة بحجم bundle أكبر من 500 kB دون فشل build.

## 19. Architectural Hygiene

لم يُنشأ `MathRegistry` أو `MathFactory` أو `MathAssessmentEngine` أو `MathFeedbackEngine` أو `MathPersistence` أو `MathEducationalObject`. التقييم والfeedback الرياضيان امتدادان للعقدين المشتركين. `EquationObject` يُنشأ من registry canonical، واللوحة والصفحات والتحويلات والحفظ لا تعرف قواعد الرياضيات.

تم تشغيل scan على النطاق المعدل بحثًا عن duplicate architecture أو hidden legacy math model أو second source of truth، ولم تظهر نتائج blocker.

## 20. Tests

النتيجة النهائية المحلية: **12 test files passed، 69 tests passed**. تشمل النتيجة Gate 2 regression، Educational Object Engine، Gate 3B integration repair، Gate 4B vertical slice/hardening، Arabic I3rab hardening، وGate 4C-B Math Step Slice بعدد 12 اختبارًا.

اختبارات Mathematics تغطي problem/steps، valid path، alternative path، arithmetic/sign/transformation/incomplete/unsupported، progressive feedback، answer/verification separation، lens regeneration، golden dataset، negative rejection، malformed payload، save/migration/restore، deterministic assessment، وbenchmark.

## 21. Clean Clone Verification

تم تنفيذ clean clone نهائي من `feature/gate-4c-math-step-slice` عند commit `e6df703d80b3248c4ff4463de31b98a2ecf108f9`. نجحت `pnpm install --frozen-lockfile`، و`pnpm check`، و`pnpm test -- --run`، و`pnpm build`، و`git diff --check`. النتيجة هي 12 test files و69 tests passed، مع build ناجح وتحذير bundle أكبر من 500 kB فقط. working tree في clean clone نظيف، و`main` بقي عند `ee646db6863ef494ddfcb954ac1823413d37db1f`، ونتيجة Pull Request المفتوح للفرع هي `[]`.

## 22. Evidence Matrix

| Evidence | Result | Limitation |
|---|---|---|
| Canonical EquationObject reuse | PASS | محدود إلى المثال المحدد |
| Math problem/step contract | PASS | ليس عقد جبر عام |
| Alternative path | PASS | بديلان محددان فقط |
| Step-level assessment | PASS | deterministic rules محدودة |
| Diagnostics | PASS | لا symbolic inference |
| Progressive feedback | PASS | نطاق الرسائل المحدد |
| Answer vs verification | PASS | substitution fixture محدد |
| Golden Dataset | PASS — 10 cases | ليس corpus إنتاجيًا |
| Provenance | PASS | teacher override step UI محدود بالمسار المشترك |
| Save/restore/migration | PASS | lesson schema المشترك |
| Lens regeneration | PASS | representation محددة |
| RTL/mobile/static accessibility | PASS جزئيًا | no screen reader/full WCAG |
| Browser/hardware validation | NOT VERIFIED | environment limitation |
| Architecture hygiene | PASS | scan غير بديل عن audit بشري شامل |

## 23. Risks

الخطر التعليمي الرئيسي هو تعميم النتيجة خارج المثال؛ القواعد الحالية لا تثبت التعامل مع معاملات سالبة عامة أو كسور أو أقواس أو معادلات متعددة المتغيرات. الخطر المنتجّي هو أن UI يثبت أصغر workflow فقط ولا يقدم teacher dashboard أو إدارة محتوى. الخطر التشغيلي هو استمرار bundle warning وعدم وجود real-device/browser automation evidence.

## 24. Out-of-Scope

خارج النطاق: Math Engine عام، CAS، arbitrary algebra، calculus، theorem proving، AI solver، AI assessment، AI explanations، AI solution paths، OCR، full Arabic Engine expansion، billing، collaboration، cloud، student accounts، وGate 4D. لم يُفتح PR ولم يحدث merge ولم يُعدّل `main`.

## 25. Final Decision

**B — CONDITIONAL.** الشريحة تثبت أن Mathematics يمكن أن تكون first-class subject engine فوق Core مشترك، وتحقق مسارًا تعليميًا deterministic قابلًا للتتبع بدل مجرد حساب `x = 4`. لكنها لا تستحق A لأن الدليل محصور في معادلة واحدة ومجموعة صغيرة، وبعض التحقق الواقعي للمتصفح والأجهزة وقارئ الشاشة غير متاح.

## References

[1]: https://github.com/newcapital825-netizen/interactive-teaching-board/tree/feature/gate-4c-math-step-slice "Gate 4C-B implementation branch"

[2]: https://github.com/newcapital825-netizen/interactive-teaching-board/blob/feature/gate-4c-math-step-slice/docs/gates/GATE_4C_B_MATH_DISCOVERY.md "Gate 4C-B Discovery Report"

[3]: https://github.com/newcapital825-netizen/interactive-teaching-board/blob/feature/gate-4c-math-step-slice/client/src/lib/mathStepSlice.ts "Bounded Mathematics contract"
