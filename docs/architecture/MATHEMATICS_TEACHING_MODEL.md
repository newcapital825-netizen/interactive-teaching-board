# Mathematics Teaching Model

## المبدأ

محرك الرياضيات المقترح subject engine فوق EducationalObject canonical. يميّز بين **Expression** و**Equation** و**Inequality** و**Function** و**Graph** و**Geometric Object** و**Measurement** و**Problem، ولا يختزل المسألة إلى answer string.

## مجالات التعلم

| المجال | التمثيل المقترح | التفاعل المتوقع |
|---|---|---|
| الحساب | Number/Expression representation | ترتيب، مقارنة، تحويل، حساب |
| الجبر | Expression/Equation/Inequality | تبسيط، تحليل، موازنة، substitution |
| الدوال | FunctionObject | جدول، graph، نقاط، sliders |
| الهندسة | Geometry/Point/Line/Angle/Measurement | إنشاء، سحب نقاط، قياس، تحويل |
| الإحداثيات | Coordinate representation | plot، قراءة الإحداثيات، تحريك نقطة |
| الإحصاء | Data/Graph/Measure representation | تصنيف، حساب، تفسير graph |
| المسائل اللفظية | MathProblemObject | استخراج المعطيات، اختيار التمثيل، تبرير الحل |

## Solution model

التمثيل canonical لمسألة تعليمية هو:

`Problem → Representation → Step 1 → Step 2 → … → Final Answer → Verification`.

كل Step يحفظ input، operation، output، justification، `sourceStepId`، وfeedback state. يدعم النموذج محاولات الطالب، annotations المعلم، تحديد misconception، alternative valid methods، وstep-level feedback. لا يفترض أن هناك طريقة صحيحة واحدة إذا كانت rubric تسمح ببدائل.

## Visualization model

يمكن للمصدر نفسه أن يعرض Equation ↔ Graph وEquation ↔ Table وFunction ↔ Graph وGeometry ↔ Measurement وExpression ↔ Algebraic Structure. هذه representations تشير إلى object واحد ولا تنشئ نسخًا semantic مستقلة؛ تحفظ relation وversion وsource/evidence.

## Mathematical correctness boundary

التصيير لا يساوي الحل الرمزي. MathLive مرشح للتحرير، وKaTeX/MathJax مرشحان للتصيير، أما symbolic computation وvalidators فتحتاج spike منفصلًا وgolden datasets. كل transformation رياضي يعلن domain assumptions وrounding وunits وmethod، وكل نتيجة قابلة للمراجعة ولا تُنشر تلقائيًا.

## حدود Gate 4A

لا توجد dependency جديدة، ولا equation editor أو solver أو geometry engine في هذه المرحلة. المطلوب فقط تثبيت object map، contract boundaries، validation strategy، وقائمة spikes اللازمة قبل التنفيذ.

## References

[1]: https://mathlive.io/mathfield/api/ "MathLive Mathfield API"
[2]: https://katex.org/ "KaTeX official site"
[3]: https://docs.mathjax.org/ "MathJax documentation"
