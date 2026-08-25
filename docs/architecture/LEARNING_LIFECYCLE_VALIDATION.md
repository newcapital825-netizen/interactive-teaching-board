# Learning Object Lifecycle Validation — Gate 4B

## المسار المرجعي

```text
Teacher Creates
  → Teacher Explains
  → Teacher Demonstrates
  → Teacher Asks
  → Student Interacts
  → System Evaluates
  → System Generates Deterministic Feedback
  → Teacher Reviews
  → Teacher Saves
  → Teacher Presents
```

| المرحلة | الدليل الحالي | الحالة | الملاحظة |
| --- | --- | --- | --- |
| Teacher Creates | canonical source factories وregistry | PROVEN | SentenceObject وEquationObject |
| Teacher Explains | source card وlens card وsteps | PARTIALLY PROVEN | لا يوجد annotation editor مستقل |
| Teacher Demonstrates | reveal answer/steps وpresentation view | PROVEN للنطاق المحدد | لا يوجد recording أو media workflow |
| Teacher Asks | ActivityDefinition prompt | PROVEN | سؤال واحد مضبوط لكل مادة |
| Student Interacts | word selection وmath input | PARTIALLY PROVEN | لا browser runner أو touch validation |
| System Evaluates | `assessActivity` deterministic | PROVEN | خمس حالات تقييم |
| System Feedback | explanation/hint/nextStep/retry/teacher note | PARTIALLY PROVEN | teacher override contract موجود دون UI تشغيلية |
| Teacher Reviews | score وassessment metadata وfeedback card | PARTIALLY PROVEN | لا يوجد review queue متعدد الأنشطة |
| Teacher Saves | `serializeLesson` وlocalStorage UI | PROVEN | local-first داخل المتصفح |
| Teacher Restores | `deserializeLesson` وrestore control | PROVEN | لا cross-device persistence |
| Teacher Presents | presentation mode | PARTIALLY PROVEN | real fullscreen/browser behavior NOT VERIFIED |

## ثوابت lifecycle

كل object/activity يحتفظ بالهوية، provenance، version، subject، capabilities، source relationship، وحالة التحويل حيثما تنطبق. التقييم لا يغير المصدر. إعادة توليد lens تنشئ representation جديدة مرتبطة بالمصدر المحدث، بينما يبقى sourceObjectId authoritative.

## قرار التحقق

المسار التعليمي مفهوم وقابل للتجربة في الواجهة، لكن الإثبات الكامل يتطلب browser automation وhardware وmigration fixtures فعلية وحوار teacher override. لذلك تصنف دورة lifecycle كـ**PARTIALLY PROVEN** ولا تُرفع إلى PASSED على أساس unit tests فقط.
