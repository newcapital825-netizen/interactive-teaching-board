# GATE 1B REPORT — Additional Architectural Proof

## 1. Executive Summary

أُجريت جولة إثبات إضافية ضيقة النطاق باستخدام نفس `SentenceObject` ونفس السيناريو العربي «قرأَ الطالبُ الكتابَ». جُمّد نموذج المجال، وأضيف مختبر مرشحين يسمح بتبديل tldraw وExcalidraw وReact Flow دون تغيير domain data. تم اختبار React Flow فعليًا كمحرك Graph Adapter، بينما تحولت tldraw وExcalidraw إلى probes خفيفة داخل الواجهة بعد أن أظهر تحميل حزمهما معًا أثرًا تشغيليًا كبيرًا على الذاكرة والبناء؛ لم يُسجل ذلك كتكامل فعلي أو كفوز.

النتيجة: **C — CONDITIONAL**. ثبت أن نموذج المجال يمكن عزله عن طبقة العرض، وأن React Flow مناسب مبدئيًا كطبقة Graph مستقلة، لكن لا توجد أدلة كافية لاختيار Canvas Engine أو تفويض Gate 2. يلزم اختبار مرشح Canvas واحد على الأقل بتكامل فعلي مع نفس الكائن، ثم مقارنة المرشح الآخر في بيئة قياس منفصلة.

## 2. Objective

الهدف هو تحديد ما إذا كان `Educational Object Model` يتكامل نظيفًا مع tldraw وExcalidraw، ومع React Flow كمحرك رسوم متخصص، باستخدام نفس البيانات ونفس السيناريو، وقياس مقدار الكود الخاص بالمكتبة وأثره على domain model.

## 3. Frozen Test Conditions

| البند | القيمة المجمدة |
|---|---|
| Domain object | `SentenceObject`, id=`sentence_obj_01` |
| Arabic sentence | `قرأَ الطالبُ الكتابَ` |
| Selected word | `الطالبُ` |
| Analysis | اسم، فاعل، مرفوع، الضمة الظاهرة، `HIGH_CONFIDENCE` |
| Source | نص المعلم — المثال الحتمي |
| Runtime | React 19 + TypeScript + Vite 7.1.9 + Chromium |
| Application serialization | object + canvas state، مملوك للتطبيق |
| Library role | Canvas Adapter لـ tldraw/Excalidraw، Graph Adapter لـ React Flow |

لم يُسمح بإعادة تصميم SentenceObject لكل مكتبة، ولم تُنقل language logic إلى adapter.

## 4. Existing Educational Object Model

النموذج المجمد يحتوي الهوية والنوع والجملة والكلمات والكلمة المحددة والتحليل والمصدر والحالة والعدسات. يفصل التطبيق بين `Domain Data` و`Presentation` و`Canvas State`. كل مرشح يستقبل payload عرض لا يصبح domain model بديلًا.

## 5. tldraw Results

تم التحقق من بيانات الحزمة الرسمية الحالية أثناء probe، وتبين أن tldraw 5.3.2 حزمة كبيرة نسبيًا وتستخدم ترخيص tldraw مع متطلبات ترخيص للإنتاج وفق المصدر الرسمي [1]. لم يُدمج renderer فعليًا في runtime النهائي؛ أُبقي probe الواجهية فقط حتى لا يتحول Spike إلى bundle ثقيل أو يتجاوز ضغط ذاكرة البيئة. لذلك: Arabic RTL وselection وmove وresize وserialize وrestore مع tldraw = **Needs direct integration proof**، وليس `Passed`.

## 6. Excalidraw Results

تم التحقق من حزمة Excalidraw 0.18.1 أثناء probe، مع مراجعة MIT في المصدر الرسمي [2]. لم يُدمج renderer فعليًا في runtime النهائي بسبب ضغط البناء والاعتماديات المتداخلة مع React 19؛ أُبقي probe الواجهية لتسجيل الحاجة إلى adapter دون الادعاء بعمل المكتبة. لذلك: الملاءمة العربية والدورة الكاملة للكائن = **Needs direct integration proof**. الملاحظة التشغيلية نفسها خطر يجب احتسابه.

## 7. React Flow Results

تم دمج React Flow 12.11.3 فعليًا داخل Candidate Bench كمحرك Graph Adapter. عُرضت عقد الجملة وقرأَ والطالبُ والكتابَ، والعلاقات الثلاث، مع labels عربية، zoom/pan والتحكم المرفق، ووجود نفس payload في overlay دون تغيير domain object. لا يُستخدم React Flow كبديل للـ primary canvas.

النتيجة المبدئية: React Flow مناسب للرسوم المتخصصة، لكن RTL-oriented layout وcustom nodes/edges وkeyboard semantics والتضمين داخل Canvas Object ما زالت تحتاج اختبارًا أعمق.

## 8. Integration Architecture

```text
                    SentenceObject
                         │
             ┌───────────┴───────────┐
             │                       │
       Canvas Adapter          Graph Adapter
             │                       │
       ┌─────┴─────┐             React Flow
       │           │
    tldraw     Excalidraw
```

هذا هو المخطط المعتمد للعرض المعماري في Gate 1B. يبقى `SentenceObject` مالك البيانات التعليمية، ويظل `Canvas Adapter` حدًا مستقلًا لمرشحي tldraw وExcalidraw، بينما يُستخدم React Flow داخل `Graph Adapter` لتمثيل Grammar/I3rab والعلاقات. لا يثبت المخطط وحده اختيارًا نهائيًا أو تكاملًا إنتاجيًا.

المخطط يثبت الفصل المقترح، ولا يعني أن tldraw أو Excalidraw قد اجتازا التكامل الفعلي.

## 9. Coupling Analysis

| المرشح | Adapter code | Domain changes | Serialization changes | Rendering changes | State/event changes | Graph integration | Finding |
|---|---|---:|---:|---:|---:|---:|---|
| tldraw | Probe only | 0 | 0 | Not tested | Not tested | External | لا دليل تكامل كافٍ؛ الحزمة/الترخيص خطر تشغيلي وقانوني |
| Excalidraw | Probe only | 0 | 0 | Not tested | Not tested | External | لا دليل تكامل كافٍ؛ React 19/dependency compatibility تحتاج عزلًا |
| React Flow | Small graph adapter | 0 | 0 | Custom node styles | Library graph state isolated | Demonstrated as external graph | واعد كمتخصص، لا كـ canvas |

النتيجة المعمارية المهمة هي أن domain changes بقيت صفرًا لأن الكائن المجمد لم يتبع أي مكتبة. لكن عدم دمج Canvas candidate فعليًا يمنع قياس event routing وresize وpersistence داخل المكتبة.

## 10. RTL Findings

نجح التطبيق الأساسي في عرض النص العربي المشكول والواجهة RTL واختيار الكلمات بصريًا. نجحت عقد React Flow في عرض labels عربية داخل Graph Adapter. لم يُثبت بعد mixed Arabic/Latin punctuation داخل المكتبات الثلاث، ولا اتجاه graph RTL مخصص، ولا selection جزئي داخل نص library surface. لذلك RTL compatibility = **Partial / Needs proof**.

## 11. Touch/Pointer Findings

سطح التطبيق الأساسي يستخدم Pointer Events للنقل وتغيير الحجم، وأزرارًا تعمل باللمس والماوس. React Flow يعرض graph تفاعليًا ويعتمد gesture behavior الخاص به. لم يُختبر جهاز لمس فعلي أو stylus pressure في هذه الجولة؛ لا يوجد handwriting subsystem. النتيجة: pointer = demonstrated at application surface، touch/stylus = not fully validated.

## 12. Stylus Findings

لم يُستخدم قلم فعلي في البيئة. لا يدعي prototype دعم pressure أو handwriting. القرار: stylus evaluation مؤجل لاختبار جهاز حقيقي قبل اختيار canvas، وشدته متوسطة لأن المنتج يستهدف السبورة والقلم مستقبلًا.

## 13. Accessibility Findings

أزرار التطبيق semantic، وfocus-visible واضح، والنص المحيط قابل للقراءة، وRTL usability جيدة في سطح التطبيق. React Flow controls تحتاج مراجعة keyboard وscreen-reader أعمق، بينما Canvas libraries لا يمكن اعتبارها accessible تلقائيًا. يجب الفصل بين limitation المكتبة وبين أي نقص في application wrapper؛ في هذه الجولة limitation الأساسية هي غياب audit تفاعلي كامل، وليست دعوى فشل نهائي.

## 14. Performance Findings

نجح `pnpm check` و`pnpm build` بعد تبسيط runtime إلى React Flow فقط. أظهر البناء النهائي chunk رئيسيًا بحجم 757.37KB قبل gzip و225.74KB بعد gzip، مع تحذير Vite فوق 500KB. محاولة تحميل tldraw وExcalidraw معًا تجاوزت قدرة البيئة أثناء التحويل، وانتهت العملية 143؛ عولج ذلك بإزالة الحزم الثقيلة من runtime. هذه ملاحظة تشغيلية حقيقية وليست benchmark إنتاجيًا. لا توجد دعوى حول 1,000 object؛ يلزم اختبار منفصل لكل مرشح.

## 15. Export Findings

التطبيق يصدّر application-owned JSON مع object وcanvas state. React Flow graph state يمكن عزله عن domain serialization، لكن export graph كصورة أو ملف مستقل لم يُنفذ. tldraw وExcalidraw export native لم يُختبر في runtime النهائي؛ الحالة `Needs direct proof`.

## 16. Persistence Findings

Save/reload يعملان على مستوى التطبيق باستخدام localStorage، ويحفظان identity وdomain data وposition وsize. لم تُربط persistence بــ tldraw/Excalidraw internal state، وهذا يحافظ على استقلال النموذج لكنه يترك اختبار adapter persistence لكل مرشح مؤجلًا.

## 17. License Findings

المصدر الرسمي لـ tldraw يذكر tldraw license وأن الاستخدام الإنتاجي يتطلب license key [1]. المصدر الرسمي لـ Excalidraw يذكر MIT [2]. المصدر الرسمي لـ React Flow يذكر MIT [3]. هذه ليست موافقة قانونية؛ يلزم فحص نصوص التراخيص والاعتماديات المباشرة وغير المباشرة وتكلفة الإنتاج قبل Gate 2.

## 18. Risk Matrix

| الخطر | احتمال | أثر | المعالجة |
|---|---|---|---|
| اعتماد Canvas قبل إثبات الكائن العربي | متوسط | عالٍ | تكامل فعلي بنفس SentenceObject قبل Gate 2 |
| bundle/memory من مرشح Canvas | متوسط | متوسط | build منفصل لكل candidate وقياس chunk/runtime |
| شرط ترخيص tldraw الإنتاجي | متوسط | عالٍ | مراجعة قانونية وتجارية قبل أي التزام |
| RTL غير مكتمل داخل المكتبة | عالٍ | عالٍ | mixed text/selection/graph direction tests |
| React Flow يتحول إلى domain model | منخفض | عالٍ | adapter boundary وapplication serialization |
| stylus/accessibility غير مثبتين | متوسط | متوسط | اختبار أجهزة ومراجعة keyboard/screen reader |

## 19. Comparison Matrix

| Criterion | tldraw | Excalidraw | React Flow |
|---|---|---|---|
| Primary canvas suitability | promising, unproven | promising, unproven | not primary role |
| Graph suitability | not primary role | not primary role | demonstrated promising |
| Arabic RTL | needs direct proof | needs direct proof | labels demonstrated; RTL layout partial |
| Touch | docs candidate; not directly tested | docs candidate; not directly tested | interaction surface present; device test pending |
| Stylus | not tested | not tested | not tested |
| Custom Educational Objects | adapter required; domain unchanged in probe | adapter required; domain unchanged in probe | custom node path available; domain unchanged |
| Persistence | not tested | not tested | app-owned persistence boundary |
| Undo/Redo | not tested | not tested | graph-only behavior not app history |
| Export | not tested | not tested | app JSON; graph image export pending |
| Accessibility | not audited | not audited | partial controls audit |
| Performance | build/memory risk observed | build/memory risk observed | build passed; chunk warning remains |
| Adapter complexity | unknown until integration | unknown until integration | small graph adapter demonstrated |
| Domain coupling | 0 in probe | 0 in probe | 0 demonstrated |
| License | tldraw license / paid production key risk [1] | MIT [2] | MIT [3] |
| Maintenance | active source, verify before commitment [1] | active source, verify before commitment [2] | active/current source [3] |

## 20. Recommendation

**C — CONDITIONAL.** اعتمد architectural boundary فقط: `Educational Object Model` مستقل، `Canvas Adapter` منفصل، `Graph Adapter` منفصل، وapplication-owned serialization. لا تعتمد tldraw أو Excalidraw كفائز. احتفظ بـ React Flow كمرشح Graph Engine واعد، لا كبديل للـ canvas.

## 21. Remaining Questions

هل ينجح تفاعل selection/move/resize/save/reload للكائن نفسه داخل tldraw أو Excalidraw دون تحويل domain model؟ هل يمكن تضمين React Flow داخل custom canvas object مع pointer routing واضح؟ ما نتيجة mixed RTL/Latin وkeyboard semantics؟ وما التكلفة المقبولة لترخيص tldraw إن كان أفضل وظيفيًا؟

## 22. Gate 2 Preconditions

قبل Gate 2 يجب تنفيذ تكامل فعلي منفصل لكل Canvas candidate أو تبرير استبعاد أحدهما، وإكمال مصفوفة نفس السيناريو، وقياس chunk/runtime، واختبار touch/stylus، وRTL mixed text، وaccessibility، وnative/custom export، وlicense review. يجب أن يعتمد المالك قرار canvas، قرار graph، والحدود النهائية لـ MVP. لا يبدأ Gate 2 تلقائيًا.

## OWNER DECISION REQUIRED

### Recommended decision

اعتماد **C — CONDITIONAL**، مع عدم اختيار Canvas Engine الآن، والإبقاء على React Flow كمرشح Graph Adapter فقط.

### Why

الدليل يثبت أن `SentenceObject` يبقى مستقلًا وأن React Flow يمكنه عرض Grammar/I3rab graph دون تغيير domain model. لكنه لا يثبت تكامل tldraw أو Excalidraw الفعلي، كما أن ضغط الحزم والـ build warning وغياب اختبارات stylus/accessibility/performance تمنع قرارًا نهائيًا.

### Remaining risks

- عدم وجود direct Canvas integration proof مكتمل للمرشحين.
- مخاطر bundle والذاكرة عند تحميل مكتبات canvas الثقيلة.
- ترخيص وتكلفة tldraw في الإنتاج.
- RTL المختلط، pointer routing، keyboard semantics، وstylus غير مكتملة الإثبات.

### Required before Gate 2

- اعتماد قرار مواصلة جولة تكامل Canvas فعلية أو استبعاد مرشح موثقًا.
- اختبار نفس `SentenceObject` داخل المرشح المختار مع move/resize/edit/serialize/restore/export.
- إكمال اختبار RTL وtouch/stylus/accessibility/performance.
- إغلاق المراجعة القانونية والتجارية وخطة persistence.

### Deferred

- Gate 2 Canvas Foundation.
- MVP وproduction implementation.
- AI، PDF/OCR، Billing، Collaboration، Classroom، Full Arabic NLP، وAnalytics.

Wait for explicit owner approval.

## References

[1]: https://github.com/tldraw/tldraw "tldraw repository, features, maintenance and license"
[2]: https://github.com/excalidraw/excalidraw "Excalidraw repository, features and MIT license"
[3]: https://reactflow.dev/ "React Flow official site, capabilities and MIT license"

## General Whiteboard Benchmark Extension

أضيف benchmark موحد يعرض سبعة كائنات على سطح واحد: `Text` و`Drawing` و`Shape` و`Image placeholder` و`SentenceObject` و`EquationObject` و`ConceptGraphObject`. جميعها تستخدم contract مملوكًا للتطبيق يحتوي `id` و`type` و`content` و`position` و`size` و`metadata`. أضيفت عمليات move وresize وduplicate وdelete وundo وredo وsave وreload وpresentation mode. هذا يثبت صلاحية اتجاه النموذج العام، ولا يساوي تنفيذ Core Whiteboard إنتاجي.

## General Whiteboard Evidence

| Requirement | Result | Boundary |
|---|---|---|
| Text | Demonstrated | DOM object |
| Drawing | Demonstrated as pointer-stroke placeholder | no handwriting subsystem |
| Shape | Demonstrated | generic shape placeholder |
| Image placeholder | Demonstrated | no file import |
| SentenceObject | Demonstrated | existing Arabic fixture |
| EquationObject | Demonstrated as educational object | no solver |
| Concept/Graph Object | Demonstrated | object metadata; React Flow remains separate |
| Move | Demonstrated | pointer and toolbar path |
| Resize | Demonstrated | toolbar proof path |
| Duplicate/Delete | Demonstrated | application-owned state |
| Undo/Redo | Demonstrated | snapshot history |
| Save/Reload | Demonstrated | localStorage |
| Presentation | Demonstrated | hides editing toolbar |

## Mathematics Input Evaluation

MathLive أو بديل رياضي لم يُدمج في هذه الجولة. تم تثبيت `EquationObject` كحد domain-only لإثبات أن الرياضيات يمكن أن تكون subject engine لاحقًا، مع إبقاء editable math وLaTeX وsemantics وtouch/accessibility وmobile behavior ضمن Technology Spike مستقبلي منفصل. لا يُسمى هذا اختيارًا لمكتبة Math Engine.

## GitHub Continuity Finding

المشروع لديه remote داخلي managed origin على فرع `main`، لكنه ليس رابط GitHub. جلسة GitHub للمستخدم مصادق عليها، وتظهر عدة مستودعات محتملة، لكن لا توجد قرينة كافية لاختيار المستودع الصحيح أو ربط المشروع به تلقائيًا دون مخاطرة بربط الكود بوجهة غير مقصودة. لذلك لم يتم push إلى GitHub، ولم تُختلق حالة نجاح. يلزم من المالك تحديد repository المقصود صراحة أو ربطه من Management UI قبل اعتبار GitHub Continuity مكتملة.

## Updated Gate 1B Conclusion

النتيجة العامة تظل **C — CONDITIONAL**. تم توسيع benchmark بما يكفي لتمثيل رؤية General Educational Whiteboard، لكن Gate 2 ما زال غير مصرح به. القرار المطلوب هو اختيار مستودع GitHub المقصود، ثم تفويض جولة Canvas integration فعلية منفصلة إن أراد المالك إغلاق قرار المحرك.
