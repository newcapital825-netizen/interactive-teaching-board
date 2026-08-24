# ADR-001 — Gate 1B Candidate Proof

## الحالة

**Conditional — لا اختيار نهائي لمحرك Canvas.**

## السياق

احتاج المشروع إلى اختبار نفس `SentenceObject` مع tldraw وExcalidraw، ومع React Flow بوصفه Graph Adapter متخصصًا، دون تعديل نموذج المجال لكل مكتبة.

## القرار

نحافظ على `Educational Object Model` مستقلًا، ونستخدم adapters صغيرة، ويمتلك التطبيق serialization الخاص به. يعتمد العرض المعماري الرسمي الصيغة التالية:

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

React Flow مناسب مبدئيًا للرسم البياني المتخصص، لكنه ليس بديلًا للـ primary canvas. لا يُعلن tldraw أو Excalidraw فائزًا قبل تكامل فعلي منفصل.

## الدليل

تم تجميد sentence والهوية والتحليل والمصدر، وظهر payload نفسه في Candidate Bench. React Flow عُرض فعليًا بعقد عربية وعلاقات، دون domain changes. نجح TypeScript وbuild بعد تبسيط الحزم. أظهر probe أن تحميل tldraw وExcalidraw معًا يرفع ضغط الذاكرة ويحتاج عزلًا وتجربة منفصلة.

## العواقب

تظل النتيجة مفيدة معماريًا، لكنها لا تمنح تفويض Gate 2. يجب اختبار مرشح Canvas فعليًا، ثم إجراء مراجعة قانونية وتقييم bundle وRTL وtouch/stylus وaccessibility وpersistence وexport.
