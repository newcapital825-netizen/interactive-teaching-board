# Gate 4C-A — Arabic I3rab Hardening Report

**Author:** Manus AI  
**Branch:** `feature/gate-4c-arabic-i3rab-hardening`  
**Base:** `feature/gate-4c-arabic-i3rab-slice` at `9284db52a1d198bec9fb98aef2bf70f4f16d1608`

## 1. Executive Summary

تم تنفيذ hardening محدود لمسار Arabic Grammar/I3rab دون بناء Arabic Engine عام. توسعت الشريحة من حالتين ذهبيتين إلى عشر حالات عربية explicit، وأصبح التقييم يميز بين الإجابة المدعومة، البديل المقبول، الإجابة خارج النطاق، والإجابة التي تحتاج مراجعة. أضيف progressive disclosure بمستويات من 1 إلى 5 ووضعان للطالب والمعلم، مع إبقاء teacher override منفصلًا وقابلًا للتتبع.

هذا التقرير لا يدعي صحة عربية عامة. الدليل يثبت مسارًا تربويًا deterministic لمجموعة صغيرة راجعها المشروع، ويترك التعميم اللغوي، corpus الخارجي، والمراجعة البشرية الموسعة خارج هذه الجولة.

## 2. Baseline

| الحقل | القيمة |
|---|---|
| Source branch | `feature/gate-4c-arabic-i3rab-slice` |
| Source HEAD | `9284db52a1d198bec9fb98aef2bf70f4f16d1608` |
| Hardening branch | `feature/gate-4c-arabic-i3rab-hardening` |
| Main | `ee646db6863ef494ddfcb954ac1823413d37db1f` — لم يُعدّل |
| Canonical source | `SentenceObject` عبر Educational Object Registry الحالي |
| Existing test baseline | 11 files، 54 tests قبل توسيع هذه الجولة |
| New Arabic cases | 10 explicit reviewed-scope cases |

## 3. Scope

شملت الجولة توسيع `ArabicWord` و`I3rabChallenge` فوق `gate4bTeaching.ts`، dataset ذهبيًا صغيرًا، structured diagnostics، acceptable alternatives، unsupported/needs-review states، progressive disclosure، teacher/student mode، feedback metadata، واختبارات negative وround-trip وmigration. لم تشمل الجولة NLP عامًا، OCR، AI، morphology engine، rhetoric، literature، Math implementation، accounts، collaboration، billing، أو cloud infrastructure.

## 4. Arabic Pedagogical Contract

العقد المدعوم هو أن يختار المتعلم كلمة في جملة محددة، ثم يملأ الدور النحوي والحالة والعلامة والسبب. لا تُقبل الإجابة كصحيحة إلا إذا طابقت expected result أو alternative صريحًا داخل challenge. لكل حالة شرح قصير وسبب قابل للعرض، بينما تبقى الصيغ غير المدعومة خارج القبول التلقائي.

| الحقل | الدلالة |
|---|---|
| `grammaticalRole` | فاعل، مفعول به، مبتدأ، خبر، اسم مجرور، فعل ماضٍ، فعل مضارع، فعل أمر، نعت، مضاف إليه |
| `case` | مرفوع، منصوب، مجرور، مبني |
| `caseMarker` | الضمة، الفتحة، الكسرة، السكون، الفتح وصيغها المختصرة المحددة |
| `reason` | سبب صريح مرتبط بالحالة المحددة، لا تفسير عام غير موثق |
| `reviewState` | `supported` أو `unsupported` أو `needs-review` |

## 5. Golden Dataset

يتكون dataset من عشر حالات ثابتة ومحدودة: فاعل، مفعول به، مبتدأ، خبر، اسم مجرور، فعل ماضٍ، فعل مضارع، فعل أمر، نعت، ومضاف إليه. لكل حالة `id` ثابت، جملة مصدر، كلمة مستهدفة، expected result، بدائل مقبولة، قيم خاطئة، شرح، provenance، و`sourceVersion = 1`.

هذه الحالات ليست corpus إنتاجيًا ولا حكمًا لغويًا شاملاً. مصدرها `controlled-teacher-fixture` وأمثلة محلية محددة، ولذلك يجب أن تبقى كل إضافة لاحقة explicit ومراجعة قبل إدخالها إلى golden set.

## 6. Negative Cases

تغطي الاختبارات الحقول الناقصة، JSON malformed، role أو case أو marker أو reason غير المعروف، والبدائل غير الموجودة في options. malformed payload يُرفض بأمان، والصيغة غير المدعومة لا تتحول إلى correct؛ بل تُصنف `unsupported` أو `needs-review` مع تشخيص `unsupported-answer`.

## 7. Acceptable Alternatives

البديل المقبول ليس fuzzy matching. هو قيمة محددة في `acceptableAlternatives`، مثل `ضمة` مقابل `الضمة` أو `فتحة` مقابل `الفتحة`. عند اكتمال بقية الحقول يستخدم التقييم حالة `valid-alternative` وdiagnostic `alternative-solution`، مع بقاء نتيجة النظام والقرار الفعال قابلين للفصل.

## 8. Assessment Diagnostics

تحدد الشريحة موضع الخلل الأولوي: `role-error` ثم `case-error` ثم `marker-error` ثم `reasoning-error`، مع `answer-error` و`incomplete` و`unsupported-answer` للحالات الأخرى. النتيجة الجزئية لا تعني أن النظام استنتج صحة عامة؛ إنها قياس لعدد الحقول المطابقة داخل المثال الموثق فقط.

## 9. Feedback Model

ينتج feedback من Assessment المشترك، ويحمل العنوان والشرح والتلميح والخطوة التالية و`reviewState`. الإجابات الصحيحة تعرض دليلًا واضحًا، والإجابات الجزئية تعرض نقطة التصحيح التالية، بينما الصيغ خارج dataset تعرض رسالة مراجعة المعلم بدل ادعاء correctness.

## 10. Provenance

تحافظ العدسة والنشاط والتقييم وteacher override على `sourceObjectId` و`sourceRange` و`sourceVersion` و`derivationType` و`teacherApproved`. اختبارات round-trip تتحقق من بقاء IDs وprovenance وassessment وfeedback وevents، بينما migration ترفض المراجع أو الحقول malformed بدل اختراع حالة تعليمية.

## 11. Teacher Override

teacher override إضافة audit event مستقلة ولا تمحو `system-assessment`. يحتفظ Assessment بـ`evaluation` و`effectiveEvaluation` وبقائمة events، ويحمل override سببه وملاحظته وprovenance الخاص به. الحقول الفارغة تُرفض، ويمكن حفظ القرار واستعادته دون فقدان النتيجة الأصلية.

## 12. UX Verification

تمت معاينة الواجهة على desktop 1280×720 وعلى mobile 390×844. ظهر النص العربي RTL، والجملة `كتبَ الطالبُ الدرسَ.`، ومستوى الكشف `guided 1/5`، وزر وضع المعلم، وبطاقة provenance. بقيت واجهة I3rab منظمة وقابلة للتمرير على mobile ضمن المعاينة الحالية.

## 13. Accessibility

أجري static inspection للـlabels وARIA roles وsemantic controls وfocus-visible semantics، وتستخدم الحقول عناصر `label` و`select` أصلية. لم يتم تشغيل screen reader أو UI automation runner أو full WCAG audit، لذلك تبقى: `SCREEN READER = NOT VERIFIED` و`UI AUTOMATION = NOT VERIFIED — RUNNER UNAVAILABLE` و`FULL WCAG AUDIT = NOT VERIFIED`.

## 14. Performance

سجل الاختبار المحلي لمسار 100 رحلة domain benchmark مقدارًا قدره `22.993 ms` في clean clone النهائي، وهو قياس Vitest/Node sandbox وليس browser performance. لا توجد نتيجة real-device أو real-browser قابلة للإعلان. تظل تحذيرات Vite المتعلقة بحجم bundle فوق 500 kB قائمة دون أن تمنع build.

## 15. Architectural Hygiene

المسح النصي للنطاق المعدل لم يجد EducationalObject أو Registry أو Factory أو Assessment/Feedback/Persistence engine مكررًا. التعديلات امتدت إلى canonical `gate4bTeaching.ts` والواجهة والاختبارات والـfixtures والوثائق. لا يوجد fallback model أو legacy duplicate داخل نطاق الشريحة.

## 16. Tests

| المجموعة | النتيجة |
|---|---|
| `pnpm check` | PASS |
| Full regression قبل آخر التقرير | PASS — 11 test files، 57 tests |
| Arabic I3rab suite | PASS — 10 tests |
| Golden Dataset | PASS — 10 cases و10 أدوار محددة |
| Negative/malformed/unsupported | PASS |
| Provenance/round-trip/migration | PASS |
| Progressive disclosure | PASS — مستويات 1 إلى 5 ووضع المعلم |
| `pnpm build` | PASS، مع bundle warning موثق |
| `git diff --check` | PASS |

## 17. Clean Clone Verification

تم التحقق من clean clone على آخر commit المنشور `3f3e68c5570aa53bf4e824287c0bf48793f44538`. نجح من clone نظيف: `pnpm install --frozen-lockfile`، `pnpm check`، `pnpm test -- --run`، `pnpm build`، و`git diff --check`. كانت حالة working tree نظيفة، وكان `main` عند `ee646db6863ef494ddfcb954ac1823413d37db1f`، وكانت نتيجة Pull Request المفتوح للفرع `[]`. لا توجد ادعاءات browser performance أو hardware validation.

## 18. Evidence Matrix

| الدليل | التصنيف | الملاحظة |
|---|---|---|
| Canonical model reuse | PROVEN | امتداد لنفس EducationalObject وregistry |
| Ten explicit Arabic roles | PROVEN | golden fixtures محلية محددة |
| General Arabic correctness | NOT PROVEN | لا يوجد parser عام أو corpus خارجي |
| Deterministic assessment | PROVEN | positive/negative/alternative tests |
| Unsupported/needs-review separation | PROVEN | review state وتشخيص صريح |
| Teacher/student disclosure | PARTIALLY PROVEN | محفوظ ومرئي، لا يثبت workflow مؤسسي كامل |
| Provenance and round-trip | PROVEN | IDs وreferences وevents محفوظة |
| Migration safety | PROVEN | malformed/future/legacy paths مختبرة |
| RTL and responsive UI | PROVEN | static and visual sandbox inspection |
| Keyboard semantics | PARTIALLY PROVEN | controls دلالية، لا runner كامل |
| Screen reader | NOT VERIFIED | البيئة غير متاحة |
| Touch/stylus | NOT VERIFIED | hardware غير متاح |
| Real browser performance | NOT VERIFIED | لا تُستبدل بقياس Node |
| Full WCAG | NOT VERIFIED | لا يوجد audit مناسب |

## 19. Remaining Risks

الخطر الرئيسي هو تفسير عشر حالات موثقة على أنها قدرة لغوية عامة. كما أن tokenization الحالية محدودة بالجمل المضبوطة، والشرح ليس knowledge graph، ولا توجد بعد مراجعة بشرية متعددة المعلمين أو سياسة versioning لـgolden data تتجاوز الإصدار الأول. كما أن browser interaction وscreen reader وhardware validation لم تثبت.

## 20. Explicit Out-of-Scope Items

تبقى Arabic Engine الكامل، Arabic NLP العام، OCR، AI، morphology، rhetoric، literature، Math، Gate 4D، collaboration، billing، accounts، cloud infrastructure، وفتح PR أو merge خارج النطاق الصريح لهذه الجولة.

## 21. Final Gate Decision

**B — CONDITIONAL**.

نجاح الاختبارات لا يكفي للتصنيف A؛ الأدلة البرمجية جيدة ضمن النطاق، لكن educational correctness لا تزال محصورة في golden fixtures محلية، ولم تثبت قابلية التعميم أو lifecycle المتصفح الكامل أو accessibility الكامل. القرار التالي متوقف على Owner Review لهذا التقرير وعلى عدم تفسيره كترخيص للتوسع الأفقي.

## Stop Rule

بعد clean-clone verification والرفع إلى GitHub، تتوقف الجولة. لا Math، لا Gate 4D، لا full Arabic Engine، لا AI، لا OCR، لا collaboration، لا billing، لا cloud، لا PR، ولا merge إلا بتفويض صريح لاحق.
