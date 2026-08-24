# Gate 1B Canvas Decision

## Decision

**DEFER — لا يتم اختيار tldraw أو Excalidraw في هذه المرحلة.** React Flow يُحتفظ به بوصفه Graph Adapter متخصصًا فقط، وليس Primary Canvas.

## Evidence

نموذج `SentenceObject` ظل مستقلًا عن المكتبات، ونجح React Flow في عرض عقد Grammar/I3rab عربية داخل Graph Adapter. تم بناء benchmark للوحة العامة يعرض Text وDrawing وShape وImage placeholder وSentenceObject وEquationObject وConceptGraphObject، مع عمليات move وresize وduplicate وdelete وundo وredo وsave وreload وpresentation على كائنات مملوكة للتطبيق.

أما tldraw وExcalidraw فتم تقييمهما من خلال probes ومراجعة تقنية، لكن لم يُنجز تكامل Canvas فعلي قابل للمقارنة مع نفس دورة الكائن. كما أظهر تحميل المرشحين الثقيلين أثرًا على ذاكرة البيئة، لذلك لا يصح إعلان SELECT أو REJECT نهائي من هذه الأدلة وحدها.

## Decision Matrix

| Candidate | Role | Current evidence | Decision |
|---|---|---|---|
| tldraw | Canvas Adapter candidate | official capability/license review + isolated probe; direct object lifecycle not proven | Defer |
| Excalidraw | Canvas Adapter candidate | official capability/license review + isolated probe; direct object lifecycle not proven | Defer |
| React Flow | Graph Adapter | actual Arabic graph nodes/edges and application-owned boundary | Retain as specialized graph candidate |

## Preconditions for a future SELECT

يجب تشغيل كل Canvas candidate في بيئة اختبار معزولة، واستخدام نفس `SentenceObject`، وقياس lifecycle كاملًا: create، select، edit، move، resize، serialize، restore، zoom، pan، undo، redo، save، reload، export، RTL، touch، accessibility، performance، وdomain coupling. يجب كذلك تحديد توافق React 19، حجم الحزمة، والتكلفة والترخيص قبل أي التزام إنتاجي.

## Explicit non-decisions

هذا الملف لا يصرّح ببدء Gate 2، ولا يفعّل MVP أو AI أو PDF/OCR أو Billing أو Collaboration أو Classroom أو Full Arabic Engine أو Full Math Engine.
