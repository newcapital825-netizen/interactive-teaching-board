# Interactive Teaching Board — Gate 2 Core Board

هذا المشروع هو **Core Interactive Teaching Board** على فرع Gate 2، مبني فوق Technology Spike سابق. ما يزال نطاقًا مرحليًا قابلًا للمراجعة وليس MVP إنتاجيًا مكتملًا. يثبت سطحًا عامًا للكائنات التعليمية مع مسار عربي أولي ومسار Graph Adapter، مع الحفاظ على استقلال نموذج المجال عن مكتبات الرسم.

## Current architecture

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

المخطط يصف الحدود المعمارية لا اختيارًا نهائيًا لمحرك Canvas. يعمل React Flow فعليًا في Graph Candidate Bench، بينما tldraw وExcalidraw موصوفان كمرشحي Canvas يحتاجان تكاملًا فعليًا منفصلًا قبل اعتماد قرار الإنتاج.

## Gate 2 branch

العمل الحالي على `feature/gate-2-core-whiteboard` وليس على `main`. لا يبدأ Gate 3 تلقائيًا؛ يلزم مراجعة المالك ودمج Pull Request صريح بعد إغلاق القيود المذكورة في `docs/gates/GATE_2_REPORT.md`.

## What is demonstrated

تعرض الواجهة Text وDrawing placeholder وShape وImage placeholder وSentenceObject وEquationObject وConceptGraphObject، وتوفر مسارات تجريبية للحركة وتغيير الحجم والتكرار والحذف والتراجع والإعادة والحفظ والاستعادة ووضع العرض. كما تعرض SentenceObject العربي «قرأَ الطالبُ الكتابَ» مع اختيار كلمة وتحليل وإعراب وشجرة مرئية.

## Verification

```bash
pnpm install
pnpm check
pnpm build
pnpm dev
```

نجح `pnpm check` و`pnpm build` في آخر تحقق. يوجد تحذير Vite عن حجم chunk، وهو مسجل في `GATE_1B_REPORT.md` وليس ادعاء أداء إنتاجي.

## Documentation

يحتوي `GATE_1B_REPORT.md` على الأدلة والمصفوفات والمخاطر. يحتوي `GATE_1B_CANVAS_DECISION.md` على قرار DEFER. يحتوي `docs/ADR/` على القرار المعماري، و`todo.md` و`CHANGELOG.md` على حالة التنفيذ. توجد تعليمات المنتج الأوسع في الملف المقدم من المالك، لكنها لا تفوض Gate 2 تلقائيًا.

## GitHub continuity

المستودع الرسمي هو [newcapital825-netizen/interactive-teaching-board](https://github.com/newcapital825-netizen/interactive-teaching-board)، وهو خاص وفرعه الرئيسي `main`. العمل الحالي في الفرع `feature/gate-2-core-whiteboard`، بينما remote الداخلي محفوظ باسم `manus-internal`. يجب استخدام مسار branch → commit → pull request → review → merge، دون force push.

## Explicitly deferred

Gate 2 ما زال **CONDITIONAL**. clipboard copy/paste وgroup/ungroup وpan وfit-to-content وإعادة ترتيب/إعادة تسمية الصفحات وfullscreen API واختبارات الأجهزة والأداء والوصول الشامل ما تزال بحاجة إلى إغلاق قبل إعلان PASS.


Gate 2 وMVP وAI وPDF/OCR وBilling وCollaboration وClassroom وFull Arabic Engine وFull Math Engine وMathLive integration وproduction authentication غير مفعلة.
