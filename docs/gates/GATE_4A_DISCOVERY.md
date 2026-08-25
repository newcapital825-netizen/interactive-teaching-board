# Gate 4A Discovery

## الحالة والنطاق

هذه الوثيقة تخص **Gate 4A — Discovery + Architecture Only**. الهدف هو تصميم طبقة Arabic Teaching Engine وMathematics Teaching Engine فوق Universal Whiteboard وEducational Object Engine الموجودين في `main`، دون كتابة production implementation، ودون إضافة dependency أو provider أو AI/OCR/Billing/Collaboration.

> القاعدة الحاكمة: نكتشف، نحلل، نحدد، نصمم، نختبر الافتراضات المعمارية، نوثق، ثم نتوقف.

## Baseline المعتمد

يظل Universal Whiteboard هو السطح العام للإنشاء والتحرير والعرض والحفظ. ويظل `EducationalObject`، والـregistry، والـfactory، والـcapabilities، والـmigration، والـadapters، والـtransformations هي الحدود canonical الوحيدة. بعد architectural hygiene cleanup أزيل `GeneralWhiteboardBench.tsx` لأنه كان evidence component غير مستخدم ويحتوي تعريفًا محليًا مكررًا لـEducationalObject؛ لا توجد أي production references له.

## أهداف الاكتشاف

| المجال | سؤال Gate 4A |
|---|---|
| Arabic | كيف نمثل القراءة والنحو والإعراب والصرف والإملاء والبلاغة والأدب والثقافة دون نسخ domain model؟ |
| Mathematics | كيف نمثل التعبير والمعادلة والدالة والرسم والهندسة والحل متعدد الخطوات دون اختزالها إلى answer string؟ |
| Cross-subject | كيف تستخدم المواد نفس objects وcapabilities وtransformations وactivities وassessment؟ |
| Interaction | كيف تصبح click/drag/match/solve/annotate/reveal تفاعلات قابلة لإعادة الاستخدام؟ |
| Assessment | كيف نمثل attempt وevaluation وfeedback وretry وmastery evidence؟ |
| AI boundary | كيف يكون AI مساعدًا قابلًا للتحقق ولا يصبح source of truth أو publisher مستقلًا؟ |
| Technology | ما المرشح المناسب لكل boundary وفق الترخيص والصيانة والأداء والوصول، لا وفق الشعبية؟ |

## ما ليس ضمن Gate 4A

لا توجد ملفات تنفيذية لمحركات Arabic أو Math، ولا `package.json` dependency جديدة، ولا AI/OCR، ولا اتصال سحابي أو بيانات طلاب حقيقية. prototypes مسموحة فقط إن كانت architectural evidence معزولة وموسومة، لكن هذه الجولة تركز على الوثائق والاختبارات التحليلية.

## Discovery findings

المشكلة ليست إضافة أدوات subject-specific إلى toolbar، بل تعريف subject engines كـobject producers وtransformation providers وvalidators وactivity builders. يجب أن يظل Core Board أعمى عن قواعد النحو والجبر، وأن يرى فقط EducationalObjects وقدراتها وتحويلاتها.

الاختيار المعماري المقترح هو **canonical object + lenses + derived representations**. لا تنسخ Lens النص أو المعادلة؛ بل تشير إلى source object وتحفظ evidence وversion وteacher approval، وتنتج representation قابلة لإعادة البناء. كل نتيجة تحليلية غير مؤكدة تحمل validation state ولا تعرض كحقيقة تعليمية تلقائية.

## أسئلة مفتوحة

| القرار | الحالة |
|---|---|
| محرك Canvas النهائي | مفتوح؛ Gate 1B وGate 3B أبقيا الاختيار مفصولًا عن domain |
| Math editor | MathLive مرشح للتحرير، KaTeX/MathJax مرشحان للتصيير؛ لا اختيار نهائي |
| Symbolic computation | يحتاج spike مستقلًا واختبارات صحة وترخيص؛ لا dependency الآن |
| Arabic analyzer | CAMeL Tools/Stanza/PyArabic مرشحون لأدوار مختلفة؛ لا ادعاء بصحة I3rab دون golden dataset |
| PDF/OCR | boundary مؤجل؛ PDF.js للتصيير/ال parsing، OCR منفصل لاحقًا |
| Student identity/privacy | خارج Gate 4A؛ يلزم threat model قبل أي حسابات |
| Assessment scoring | deterministic core أولًا، AI اختياري كمساعد غير ناشر |

## معايير الخروج

يخرج Gate 4A فقط عندما تكون النماذج والخرائط والتحويلات والتفاعلات والتقييم والتغذية الراجعة وtechnology spike والمخاطر وMVP والقرارات المؤجلة موثقة، وتكون كل الادعاءات الخارجية مرتبطة بمصادر رسمية، وتبقى working tree والفرع قابلين للفحص، دون production code.

## قرار الاكتشاف

**READY FOR ARCHITECTURE DOCUMENTATION.** تم تثبيت النطاق: Arabic وMathematics سيصبحان subject engines فوق EducationalObject، مع عدم بدء Gate 4B أو أي تنفيذ إنتاجي.

## References

[1]: https://mathlive.io/mathfield/api/ "MathLive Mathfield API"
[2]: https://katex.org/ "KaTeX official site"
[3]: https://camel-tools.readthedocs.io/en/latest/overview.html "CAMeL Tools documentation"
[4]: https://reactflow.dev/learn/advanced-use/whiteboard "React Flow Whiteboard Features"
[5]: https://tldraw.dev/community/license "tldraw SDK License"
[6]: https://mozilla.github.io/pdf.js/ "PDF.js official site"
