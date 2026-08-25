# Gate 4C Mathematics Roadmap

## Principle

Math Engine يضيف representations وvalidators فوق EducationalObject canonical، ولا يختزل التعليم إلى final answer. كل خطوة تحفظ العملية والتعبير قبل وبعد والسبب والتبعيات والتحقق وprovenance.

## Controlled sequence

| المرحلة | النطاق | دليل القبول | القرار |
| --- | --- | --- | --- |
| M1 | Equation entry + typed source | source identity وsyntax state | أول implementation slice |
| M2 | Two-step linear algebra | step chain deterministic وvalidation | توسعة مباشرة بعد M1 |
| M3 | Alternative solution comparison | method/steps/complexity/correctness/reasoning | بعد golden alternatives |
| M4 | Equation ↔ Graph/Table | source-linked visual representation | بعد renderer spike |
| M5 | Functions/coordinates/data | typed objects وdatasets | deferred |
| M6 | Geometry/measurement/problems | diagram/units/word-problem rubric | deferred |

## Minimum useful mathematics slice

المسار الأدنى المفيد هو إدخال معادلة، تمثيلها، تسجيل خطوتين، التحقق من syntax والvalidity كلما أمكن، إظهار سبب الخطوة، دعم alternative valid method، تحويل الحل إلى activity، تقييم إجابة الطالب على مستوى الخطوة، ثم feedback وsave/restore مع provenance.

## Correctness separation

| الطبقة | وظيفتها | ما لا تدعيه |
| --- | --- | --- |
| Syntax | هل التعبير قابل للقراءة؟ | لا تثبت صحة الحل |
| Mathematical validation | هل التحويل يحافظ على التكافؤ ضمن assumptions؟ | لا تغطي كل algebra |
| Pedagogical explanation | لماذا هذه الخطوة مفيدة؟ | لا تستبدل validator |
| Teacher review | اعتماد الطريقة والسياق | لا يتحول إلى silent mutation |

## Alternative methods

تُخزن Solution A وSolution B كطرق مرتبطة بالمسألة أو source step، مع مقارنة method وsteps وcomplexity وcorrectness وreasoning. لا تُصنف الطريقة المختلفة خطأ إذا اجتازت rubric وvalidator أو اعتمدها المعلم مع سجل override.

## Deferred by design

يبقى general symbolic solver، equation parser واسع، MathLive/KaTeX integration، functions، geometry engine، statistics، وAI solving خارج هذا Discovery. أي dependency مستقبلية تحتاج spike مستقلًا، license review، golden fixtures، وقرارًا معماريًا.

## References

1. [Mathematics Teaching Model](../architecture/MATHEMATICS_TEACHING_MODEL.md)
2. [Gate 4C Discovery](../gates/GATE_4C_DISCOVERY.md)
3. [Gate 4B Final Hardening](../gates/GATE_4B_FINAL_HARDENING.md)
