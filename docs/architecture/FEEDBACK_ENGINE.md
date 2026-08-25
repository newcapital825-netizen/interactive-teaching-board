# Feedback Engine

## الحالات

يدعم النظام `correct` و`partially-correct` و`incorrect` و`hint` و`misconception` و`missing-step` و`alternative-method` و`retry` و`explanation` و`teacher-feedback`.

## عقد التغذية الراجعة

كل Feedback يحمل `attemptId` و`criterionId` و`severity` و`messageKey` و`evidenceRefs` و`nextAction` و`createdBy` و`reviewStatus`. الرسالة ليست source truth؛ إنها تفسير مرتبط بمحاولة ونسخة rubric.

## deterministic first

تبدأ التغذية الراجعة بقواعد deterministic قابلة للتفسير والاختبار. يمكن لمساعد AI مستقبلي اقتراح hint أو explanation، لكن المسار الإلزامي هو `Generate → Validate → Teacher Review → Approve → Publish`. لا يوجد autonomous publishing.

## أمثلة

في العربية يمكن أن تكون الحالة `missing-evidence` عندما يحدد الطالب الفاعل دون شاهد. في الرياضيات يمكن أن تكون `missing-step` أو `alternative-method` بدل رفض إجابة مكافئة. يميز النظام misconception عن مجرد typo عندما يثبت validator ذلك.

## accessibility and privacy

تصل الرسائل عبر النص المرئي وARIA announcement عند الحاجة، ولا تعرض بيانات طالب لغير نطاقه. لا تحفظ analytics تفصيلية قبل تعريف purpose وretention.

## حدود Gate 4A

لا توجد implementation أو AI calls أو scoring engine في هذه المرحلة.
