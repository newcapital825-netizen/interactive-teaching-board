# GATE 1 REPORT — Technology Spike + ARABIC CORE OBJECT PROTOTYPE

## 1. Executive Summary

تم بناء Spike تجريبي قابل للتشغيل يثبت المسار المعماري الأساسي: نص عربي RTL → اختيار كلمة → تحليل لغوي حتمي مبسط → تمثيل Grammar/I3rab → شجرة بصرية → Educational Object → سطح Canvas Adapter → نقل/تغيير حجم/تحرير → حفظ واستعادة → تصدير.

النتيجة لا تثبت اختيار Canvas Engine نهائيًا، ولا تدّعي بناء Arabic Engine كامل. الدليل يثبت أن الفصل بين Domain Data وPresentation وCanvas State وGraph Presentation قابل للتطبيق داخل واجهة React/TypeScript. لذلك التوصية هي **OPTION B — CONDITIONALLY RECOMMENDED**: النموذج المعماري واعد، لكن اختيار tldraw أو Excalidraw يحتاج اختبارًا إضافيًا حقيقيًا داخل نفس prototype قبل Gate 2.

## 2. Objective

السؤال المركزي هو: هل يستطيع Arabic Educational Object أن يعيش طبيعيًا داخل معمارية canvas دون coupling خطير بين اللوحة والكائنات التعليمية ومنطق العربية والرسم البياني؟

## 3. Scope

يشمل هذا Spike واجهة تجريبية disposable، مثالًا عربيًا ثابتًا هو «قرأَ الطالبُ الكتابَ»، اختيار الكلمات، تحليلًا توضيحيًا ثابتًا، تمثيلًا شجريًا SVG، كائن SentenceObject، Canvas State مستقلًا، pointer drag/resize، undo/redo، localStorage save/reload، JSON export، وفحصًا بصريًا مكتبيًا وهاتفيًا.

لا يشمل MVP أو الإنتاج أو Arabic NLP كاملًا أو AI أو Billing أو PDF/OCR أو real-time collaboration أو classroom infrastructure أو authentication أو analytics أو library إنتاجية.

## 4. Technology Candidates

يقارن Spike على الأقل tldraw وExcalidraw وReact Flow. يظل React Flow محرك رسوم متخصصًا ولا يُعامل كبديل مباشر للـ canvas.

## 5. Evaluation Method

استخدمت الأدلة التالية: فحص TypeScript، build إنتاجي، تشغيل dev server، لقطات شاشة 1280×720 و390×844، مراجعة كود المسار التفاعلي، مراجعة package resolution لـ `@xyflow/react`، ومراجعة المصادر الرسمية للمزايا والتراخيص. لم تُمنح نقاط لمجرد ادعاء مكتبي؛ وكل خانة غير مختبرة سُجلت كـ `Not tested` أو `Needs proof`.

## 6. Prototype Architecture

```text
SentenceObject (domain data)
  ├─ source / analysis / views / identity
  ├─ Text View / Grammar View / I3rab View
  └─ CanvasState (position / size / z-index)

Canvas Adapter (prototype DOM surface)
  └─ renders and manipulates the object without owning language logic

Graph Adapter (prototype SVG surface)
  └─ renders nodes/relations from the object analysis
```

التطبيق لا يضع منطق اللغة داخل renderer؛ اختيار كلمة يغير domain analysis، ثم تعكس اللوحة والشجرة الحالة الجديدة. تمثيل التطبيق الذي يُحفظ يحتوي object وcanvas معًا، وليس حالة مكتبة خارجية فقط.

## 7. ARABIC CORE OBJECT PROTOTYPE

| خطوة | الدليل في Spike | النتيجة |
|---|---|---|
| Arabic text | السطر «قرأَ الطالبُ الكتابَ» مع اتجاه RTL | يعمل بصريًا |
| Word selection | أزرار مستقلة لكل كلمة | يعمل عبر pointer/keyboard button |
| Basic analysis | token/category/role/state/ending/confidence/method | ثابت توضيحي، وليس parser كاملًا |
| Grammar/I3rab representation | عقد الجملة والكلمات والعلاقات | موجود كـ graph data بصري مبسط |
| Educational Object | SentenceObject مستقل عن DOM | موجود |
| Embed inside canvas | الكائن يظهر داخل Canvas Adapter | موجود |
| Move / Resize / Edit | pointer handlers على header ومقبض الحجم، والاختيار يحرر token | موجود على مستوى Spike |
| Save / Reload | localStorage باسم application snapshot | موجود |
| Export | JSON download للتمثيل المملوك للتطبيق | موجود |

## 8. Results

أثبت المسار أن SentenceObject يمكن أن يحتفظ بالهوية والمصدر والتحليل والعدسات، بينما يحتفظ CanvasState بالإحداثيات والحجم وz-index. أثبتت الواجهة أن Graph Adapter يستطيع عرض تمثيل إعرابي دون أن يفرض graph internals على نموذج المجال. كما أن `undo` و`redo` يعيدان Snapshot كاملًا للكائن وحالة اللوحة، لا إحداثيات عشوائية فقط.

التحليل اللغوي في prototype deterministic ومحدود إلى المثال، وتظهر صراحة عبارة أنه ليس محللًا عربيًا كاملًا. هذا قيد مقصود وليس نقصًا مخفيًا.

## 9. Technology Spike Matrix

| Criterion | tldraw | Excalidraw | React Flow | Evidence | Risk | Notes | Recommendation |
|---|---|---|---|---|---|---|---|
| Infinite canvas | موثق كميزة أساسية [1] | موثق كلوحة لا نهائية [2] | ليس دوره الأساسي | وثائق رسمية؛ لا integration في Spike | متوسط | يبقى canvas candidate | Spike إضافي |
| Arabic RTL / text | يحتاج اختبارًا داخل prototype | يحتاج اختبارًا داخل prototype | graph labels تحتاج اختبارًا | واجهة Spike نفسها RTL؛ لا يثبت المكتبات | عالٍ | RTL ليس CSS فقط | لا قرار |
| Custom educational objects | custom shapes/tools/bindings موثقة [1] | قابل للتخصيص [2] | custom React nodes موثقة [3] | SentenceObject مستقل في Spike، دون ربط بمكتبة canvas | متوسط | نحتاج mapping فعلي | اختبار Gate 1.1 |
| Graph / I3rab | ليس المرشح الأساسي | ليس المرشح الأساسي | مناسب لعقد وروابط React [3] | Graph Adapter الحالي SVG؛ React Flow مثبت كمرشح ولم يُفرض على المجال | متوسط | React Flow لا يحل canvas تلقائيًا | مرشح متخصص |
| Persistence / export | APIs موثقة؛ تحتاج test | JSON/PNG/SVG موثقة [2] | تعتمد على التطبيق | localStorage/JSON يعملان في prototype | متوسط | يجب اختبار format مستقل | صالح كدليل pattern |
| Undo / redo | موثق ضمن canvas [1] | موثق [2] | ليس canvas history | Snapshot history في التطبيق | منخفض | قد يُستبدل بمكتبة لاحقًا | pattern validated |
| Touch / stylus | معلن دعم browser/touch/tablet [1] | pointer/drawing موجود [2] | يحتاج composition | pointer events wired؛ touch visual smoke only | متوسط | stylus pressure غير مختبر | اختبار إضافي |
| Accessibility | يحتاج custom audit | دعم المحيط يعتمد التطبيق | nodes تحتاج audit | أزرار semantic وfocus visible؛ canvas graph محدود | عالٍ | canvas semantics تحدٍ | لا قرار |
| License / cost | tldraw license ومفتاح إنتاج [1] | MIT [2] | MIT [3] | مراجعة رسمية | عالٍ لـ tldraw | يحتاج قانوني/تجاري | لا قرار |
| Maintenance | مستودع نشط وفق GitHub [1] | مستودع نشط وفق GitHub [2] | إصدارات حديثة موثقة [3] | مصادر رسمية | متوسط | cadence ليس بديلًا عن fit | قياس مستمر |

## 10. Performance Findings

تم تنفيذ build بنجاح مع TypeScript دون أخطاء. أظهر Vite تحذيرًا بأن chunk الرئيسي أكبر من 500KB بعد minification؛ هذا Spike وليس claim إنتاجي، لكنه خطر يجب قياسه عند إدخال محرك canvas حقيقي. لم يُنفذ benchmark 1,000 object؛ لذلك لا توجد دعوى أداء إنتاجي. سيناريو القياس اللاحق: 100 SentenceObject و400 graph node، ثم تحديد ونقل وتغيير حجم وحفظ، على Chromium desktop وmobile.

## 11. Accessibility Findings

الواجهة تستخدم أزرارًا فعلية للكلمات والحفظ والتصدير والتراجع، وتضيف `aria-label` لعناصر التحكم، و`focus-visible` واضحًا، وعنوانًا بديلًا للشجرة. لكن الكائن نفسه يعتمد على pointer interactions ولا يملك بعد keyboard move/resize أو تمثيلًا دلاليًا كاملًا للعقد داخل SVG. النتيجة: smoke test جزئي، وليس اجتياز وصول كامل.

## 12. RTL Findings

تظهر الصفحة واللوحة والعينة العربية باتجاه RTL في desktop وmobile، مع نصوص عربية مشكلة. تم اختبار العرض البصري في لقطتي شاشة. لم يُختبر بعد النص العربي/اللاتيني المختلط، علامات الترقيم المعقدة، تحديد جزء داخل كلمة، أو RTL layout في React Flow نفسه. لذلك RTL library compatibility ما زال `Needs proof`.

## 13. Licensing Findings

tldraw يستخدم tldraw license ويذكر أن الاستخدام الإنتاجي يتطلب license key [1]. Excalidraw يذكر MIT [2]. React Flow يذكر MIT [3]. لا يُتخذ قرار تجاري أو قانوني نهائي هنا، ويجب أن تراجع الشروط نسخة قانونية قبل Gate 2.

## 14. Risks

الخطر الأكبر هو اختيار canvas لا يسمح بعيش Educational Object طبيعيًا، ثم اضطرار الفريق إلى ربط domain model داخليًا بالمكتبة. يليه خطر RTL، ودلالات الوصول، وتكلفة tldraw الإنتاجية، وفجوة stylus/local-first، وتحول prototype إلى منتج قبل إغلاق قرارات النطاق. يُعالج ذلك بـ adapter boundary وapplication-owned serialization وARABIC CORE OBJECT PROTOTYPE إضافي داخل المرشحين الفعليين.

## 15. Open Questions

هل يمكن تضمين graph تفاعلي داخل custom canvas shape دون كسر selection أو pointer routing؟ ما استراتيجية keyboard accessibility للكائن والشجرة؟ هل يحتاج النظام canvas DOM أم scene graph؟ ما تكلفة وترخيص tldraw في نموذج تجاري؟ وما الحد الأدنى من Arabic Core Tools الذي يجب تثبيته قبل Gate 2؟

## 16. Recommendation

**OPTION B — CONDITIONALLY RECOMMENDED.** يُوصى باعتماد الفصل المعماري: Educational Object Model مستقل، Canvas Adapter، Graph Adapter، وapplication-owned persistence. لا يُوصى بعد باختيار tldraw أو Excalidraw كفائز. React Flow واعد كمحرك رسوم متخصص، لكن يجب دمجه فعليًا في تجربة candidate canvas في جولة إثبات إضافية.

## 17. Gate 1 Exit Criteria

| المعيار | الحالة |
|---|---|
| Arabic RTL text | Demonstrated |
| Word selection | Demonstrated |
| Basic linguistic representation | Demonstrated as deterministic fixture |
| Educational Object | Demonstrated |
| Object independent of canvas internals | Demonstrated by application snapshot model |
| Grammar/I3rab graph | Demonstrated as SVG Graph Adapter |
| Graph embedded in workspace | Demonstrated visually in side-by-side workspace؛ embedded-in-canvas candidate proof مؤجل |
| Canvas/graph separation | Demonstrated by adapters and code boundary |
| Move/resize/edit | Demonstrated by pointer handlers in Spike |
| Undo/redo | Demonstrated in state model and controls |
| Save/reload | Demonstrated by localStorage path in code |
| Export | Demonstrated by JSON export path in code |
| Touch/pointer | Pointer path present؛ touch smoke needs device validation |
| Accessibility smoke test | Partial; limitations recorded |
| Performance smoke test | Build smoke only; benchmark deferred |
| Technology comparison | Documented with evidence boundaries |
| License review | Documented; legal approval deferred |
| Risks/deferred decisions | Documented |

**Gate 1 status:** Evidence package complete for architectural learning, but **not sufficient for unconditional Gate 2 authorization** because candidate canvas integration, true embedded graph behavior, touch/stylus, accessibility, and performance require one additional proof pass.

## 18. Evidence Index

| ID | Evidence |
|---|---|
| E-01 | `client/src/pages/Home.tsx` — SentenceObject, CanvasState, pointer handlers, history, localStorage, JSON export |
| E-02 | `client/src/index.css` — RTL-aware responsive prototype surface and focus treatment |
| E-03 | `pnpm check` — TypeScript passed |
| E-04 | `pnpm build` — production build passed with chunk-size warning |
| E-05 | Desktop screenshot 1280×720 — full workspace, tree, object, inspector |
| E-06 | Mobile screenshot 390×844 — responsive RTL workspace |
| E-07 | `package.json` — `@xyflow/react` 12.11.3 resolved as graph candidate |
| E-08 | Official candidate sources [1], [2], [3] |

## 19. Deferred Decisions

لا يبدأ Gate 2 تلقائيًا. تؤجل إلى قرار المالك: اختيار canvas النهائي، دمج React Flow فعليًا داخل custom canvas object، benchmark واقعي، stylus/accessibility audit، مراجعة قانونية، وأي تحويل للـ prototype إلى MVP.

## References

[1]: https://github.com/tldraw/tldraw "tldraw repository, features, maintenance and license"
[2]: https://github.com/excalidraw/excalidraw "Excalidraw repository, features and MIT license"
[3]: https://reactflow.dev/ "React Flow official site, capabilities and MIT license"
