# ADR-001 — Gate 1 Technology Spike

## الحالة

**Conditionally recommended — لا اعتماد نهائي لمحرك Canvas.**

## القرار

نحافظ على أربعة حدود مستقلة: `Educational Object Model` و`Canvas Adapter` و`Graph Adapter` و`Arabic Language Model`. يقارن Gate 1 بين tldraw وExcalidraw، ويختبر React Flow كمحرك رسوم متخصص. لا يُسمح للمكتبة المختارة بأن تصبح نموذج المجال أو مصدر serialization الوحيد.

## الدليل

أثبت ARABIC CORE OBJECT PROTOTYPE أن SentenceObject يستطيع حمل النص والتحليل والمصدر والعدسات، بينما تحمل CanvasState الموضع والحجم وz-index، ويعرض Graph Adapter عقدًا وعلاقات مستقلة. أظهر build وTypeScript عدم وجود أخطاء، وأظهرت لقطات desktop/mobile RTL وسطح التفاعل.

## ما لم يثبت

لم يدمج prototype tldraw أو Excalidraw فعليًا، ولم يدمج React Flow داخل custom canvas object، ولم يُنفذ benchmark واقعي أو stylus pressure أو accessibility audit كامل. لذلك لا توجد قاعدة كافية لاختيار فائز.

## العواقب

يمكن التخلص من prototype دون ترحيل domain model، لكن Gate 1 يحتاج جولة إثبات إضافية مرهونة بموافقة المالك قبل Gate 2. أي قرار بإدخال محرك كامل أو إنتاجية أو مزامنة يبقى خارج هذا ADR.
