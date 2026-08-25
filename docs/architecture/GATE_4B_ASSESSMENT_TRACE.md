# Gate 4B Assessment and Feedback Trace

## العقد المشترك

المحرك العام `assessActivity(activity, answer, provenance)` لا يعرف قواعد مادة بعينها. يتلقى ActivityDefinition، يمرر الإجابة إلى `evaluateAnswer`، ثم ينشئ Assessment وFeedback مرتبطين بالـactivity والـprovenance.

| الحقل | الغرض |
| --- | --- |
| `activityId` | ربط المحاولة بالنشاط |
| `attemptId` | تمييز محاولة التفاعل |
| `answer` | الاحتفاظ بالإجابة كما أرسلها المستخدم |
| `evaluation` | `correct` أو `partially-correct` أو `incorrect` |
| `score` / `maxScore` | قياس deterministic في نطاق 0–1 |
| `feedbackId` | ربط الشرح بنتيجة التقييم |
| `provenance` | إعادة ربط التقييم بالمصدر المشتق |

## العربية

الإجابة المقبولة `word_2` أو `الطالبُ` تعطي `correct / 1`. اختيار الفعل أو المفعول به يعطي `partially-correct / 0.5` مع توضيح الدور النحوي. أي إدخال آخر يعطي `incorrect / 0` مع سؤال «من قام بالفعل؟» وتلميح يوجه إلى الكلمة الثانية.

## الرياضيات

الإجابة `4` أو صيغة `x = 4` تعطي `correct / 1`. الإجابة `8` تمثل الوصول إلى `2x = 8` وتعطي `partially-correct / 0.5`. غير ذلك يعطي `incorrect / 0` مع تلميح يذكر طرح 3 من الطرفين أولًا.

## دورة الواجهة

```text
ActivityDefinition
  → answer entry / word selection
  → assessActivity
  → Assessment + Feedback
  → completion state
  → retry when not correct
```

الـfeedback ليس رسالة عامة: يشرح سبب النتيجة، يعرض تلميحًا عند الحاجة، يحدد قابلية الإعادة، ويحمل teacher note. بعد correct تصبح `completionState = complete`، وبعد partial أو incorrect تبقى incomplete.

## التحقق

اختبارات Gate 4B تتحقق من أن الدالتين الموضوعيتين تستخدمان نفس `assessActivity`، وأنهما تنتجان الحالات الثلاث، وتحافظان على activityId وattemptId وfeedbackId وprovenance. لم يُستخدم AI في التقييم أو feedback.
