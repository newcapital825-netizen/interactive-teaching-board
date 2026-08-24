# Interactive Teaching Board — Gate 1B Spike

هذا المشروع هو **Technology Spike disposable** للسبورة التعليمية التفاعلية، وليس تنفيذ MVP أو إنتاجًا نهائيًا. يثبت سطحًا عامًا للكائنات التعليمية مع مسار عربي أولي ومسار Graph Adapter، مع الحفاظ على استقلال نموذج المجال عن مكتبات الرسم.

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

المخطط يصف الحدود المعمارية لا اختيارًا نهائيًا لمحرك Canvas. يعمل React Flow فعليًا في Graph Candidate Bench، بينما tldraw وExcalidraw موصوفان كمرشحي Canvas يحتاجان تكاملًا فعليًا منفصلًا قبل Gate 2.

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

الفرع الحالي `main` مرتبط بـ managed origin داخلي وليس بمستودع GitHub. لم يتم push إلى GitHub لأن المستودع الصحيح لم يُحدد صراحة؛ لا ينبغي ربط المشروع بمستودع محتمل بالحدس. يجب تحديد المستودع المقصود ثم ضبط remote والتحقق من clone/install/check/dev قبل Gate 2.

## Explicitly deferred

Gate 2 وMVP وAI وPDF/OCR وBilling وCollaboration وClassroom وFull Arabic Engine وFull Math Engine وMathLive integration وproduction authentication غير مفعلة.
