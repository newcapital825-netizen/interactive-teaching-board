# ADR-004 — Arabic and Mathematics Engines

## الحالة

**Proposed — Gate 4A Discovery + Architecture only.** لا يدخل هذا القرار حيّز production implementation حتى موافقة المالك وفتح Gate 4B.

## السياق

Universal Whiteboard وEducational Object Engine موجودان في `main`. نحتاج دعمًا عميقًا للعربية والرياضيات دون تحويل Core Board إلى مجموعة special cases أو إنشاء domain model ثانٍ.

## القرار المقترح

نبني Arabic Teaching Engine وMathematics Teaching Engine كـsubject engines تنتج EducationalObjects canonical، وتسجل object recipes وcapabilities وlenses وtransformations وvalidators وactivities. تستخدم Interaction/Assessment/Feedback primitives المشتركة، وتحفظ source/evidence/version/teacher review.

## البدائل المرفوضة

رفضنا وضع قواعد العربية أو الرياضيات داخل Core Board، ورفضنا نسخ EducationalObject لكل مادة، ورفضنا جعل Canvas/Graph engine هو domain. كما رفضنا اختيار مكتبة math أو NLP دون benchmark وترخيص واضح، ورفضنا AI كمصدر حقيقة أو ناشر مستقل.

## النتائج

هذا الفصل يحافظ على extensibility لمواد Science وEnglish وSocial Studies. لكنه يتطلب contracts أكثر صراحة، golden datasets، validator versions، وteacher review. كما يضيف تكلفة تصميم adapters وmigration وprovenance قبل التنفيذ.

## قرارات مؤجلة

اختيار Canvas engine، MathLive/KaTeX/MathJax، symbolic library، Arabic NLP stack، PDF/OCR stack، student identity، storage/cloud boundary، وقواعد scoring النهائية كلها تحتاج spikes مستقلة.

## معايير مراجعة مستقبلية

لا يبدأ Gate 4B قبل إثبات object round-trip، no-duplicate model، transformation provenance، deterministic baseline، teacher approval، accessibility plan، security boundary، license compatibility، وcross-subject proof.
