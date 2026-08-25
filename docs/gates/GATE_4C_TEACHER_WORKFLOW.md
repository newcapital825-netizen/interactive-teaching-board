# Gate 4C Teacher Workflow

## Workflow definition

السبورة هي Universal Teacher Workspace وليست Canvas فقط. الرحلة المشتركة هي: Create → Select → Explain → Transform → Interact → Practice → Assess → Feedback → Edit → Save → Reuse → Present → Review → Improve.

## Proposed screen states

| الحالة | مسؤولية Core | مسؤولية Subject Engine | دليل النجاح |
| --- | --- | --- | --- |
| Create | إنشاء EducationalObject | recipe وinitial content | object مسجل وله ID |
| Explain | selection وinspect | lens وderived explanation | source لا يتغير |
| Transform | command routing | transformation recipe | provenance chain مكتملة |
| Interact | pointer/keyboard semantics | domain interaction | state قابل للحفظ |
| Assess | shared assessment contract | rubric/validator | state وdiagnostic مفسران |
| Feedback | shared feedback rendering | subject explanation | next step واضح |
| Save/Reuse | serialization/migration | subject payload validation | IDs وversions محفوظة |
| Present | presentation mode | representation visibility | لا معلومات تقنية مربكة |
| Review/Improve | event history | teacher approval/override | القرار منفصل عن نتيجة النظام |

## Arabic route

يدخل المعلم جملة، يحدد كلمة أو range، يفتح Grammar أو I3rab Lens، يراجع analysis، يعدل أو يعتمد، يحولها إلى activity، ثم يراجع إجابات الطالب وfeedback. لا يظهر التحليل كحقيقة منشورة قبل teacher review.

## Mathematics route

يدخل المعلم معادلة أو مسألة محدودة، يختار representation، ينشئ step chain، يرى operation وexpressionBefore وexpressionAfter وreason وvalidation، يضيف alternative method عند الحاجة، ثم يحول السلسلة إلى activity ويقيّم step/concept/procedure.

## Reuse and provenance

إعادة الاستخدام لا تنسخ source semantics بلا lineage. يجب أن تشير النسخة إلى origin object أو lesson template، وأن تعرف sourceVersion وtransformVersion وteacherReviewStatus. حذف lens لا يحذف source، وفشل subject engine لا يفسد Core Board.

## Teacher value questions

قبل قبول أي feature، يجب أن تجيب عن: هل توفر وقت المعلم؟ هل تسهّل الشرح؟ هل تجعل المفهوم أوضح؟ هل تسمح بالتفاعل؟ هل تسهّل التقييم؟ هل تسمح بإعادة الاستخدام؟ إذا كانت الإجابة سلبية، تؤجل feature.

## Boundaries

لا تشمل هذه الوثيقة student accounts أو classroom collaboration أو billing أو cloud publishing أو AI authoring. هذه عناصر تحتاج gates وقرارات مستقلة.

## References

1. [Gate 4C Discovery](../gates/GATE_4C_DISCOVERY.md)
2. [Subject Engine Architecture](../architecture/SUBJECT_ENGINE_ARCHITECTURE.md)
3. [Gate 4B Final Hardening](../gates/GATE_4B_FINAL_HARDENING.md)
