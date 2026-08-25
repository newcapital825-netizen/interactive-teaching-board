# Gate 4B Mathematics Implementation

## السيناريو المثبت

المصدر هو `2x + 3 = 11`، ويُنشأ كـ`EquationObject` عبر `createRegisteredEducationalObject`. الهدف التعليمي المحدد هو إثبات أن representation رياضيًا يمكن ربطه بالمصدر والنشاط، لا بناء symbolic algebra engine عام.

## Math Visualization Lens

`createMathVisualizationLens` ينتج `MathVisualizationLens` يحمل `sourceObjectId` و`sourceRange` و`sourceVersion` وprovenance. التمثيل يتضمن خطوات صريحة:

1. طرح 3 من الطرفين: `2x = 8`.
2. قسمة الطرفين على 2: `x = 4`.
3. نقطة التحقق المعروضة: `(4, 0)` على تمثيل خطي مبسط.

زر كشف الخطوات يبدل `revealAnswer`، ويحافظ على إمكانية تقديم المسألة قبل إظهار الحل. لا تعتمد النتيجة على مكتبة خارجية ولا على AI.

## النشاط والتقييم

السؤال هو «حل المعادلة: 2x + 3 = 11». يقبل التقييم deterministic القيمة `4` أو `x=4` أو `x = 4`. القيمة `8` تمثل إجابة جزئية مرتبطة بالخطوة الوسطى `2x = 8`، والقيم الأخرى غير المقبولة تعطي incorrect مع تلميح يبدأ بطرح 3.

يستخدم النشاط نفس `ActivityDefinition` و`assessActivity` و`Assessment` و`Feedback` المستخدمة في العربية. الفرق الموجود في subject configuration فقط: prompt، accepted answers، وقاعدة partial المحددة مسبقًا.

## واجهة العرض والحفظ

في وضع المعلم تظهر خانة إدخال `x` وزر الإرسال والتقييم وحالة المحاولات. في presentation mode تبقى المعادلة والعدسة والخطوات والنشاط والتغذية الراجعة، بينما تختفي لوحة المعلم وأدوات الحفظ/الاستعادة غير الضرورية. الحفظ المحلي يعيد المعادلة وlens ID وprovenance والإجابة وحالة التقييم.

## حدود مستقبلية

يمكن لاحقًا إضافة Equation ↔ Table، Function ↔ Graph، Geometry ↔ Measurement، fractions، ratios، probability، statistics، وword problems عبر transformations جديدة. لم تُحسم أو تُدمج مكتبة رياضيات خارجية في Gate 4B.
