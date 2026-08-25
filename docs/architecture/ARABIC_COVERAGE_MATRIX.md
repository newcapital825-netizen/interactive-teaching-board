# Arabic Coverage Matrix — Gate 4B Validation

| المحور | ما يجب أن يستوعبه التصميم | دليل Gate 4B الحالي | الحالة |
| --- | --- | --- | --- |
| Reading | fluency، literal، inferential، critical، vocabulary in context | SentenceObject + Grammar Lens يحفظ النص والنطاق ويتيح اختيار كلمة | PARTIALLY PROVEN |
| Writing | sentence، paragraph، guided/free writing، editing، revision | canonical Text/Sentence capabilities موجودة؛ لا توجد رحلة writing في Gate 4B | NOT PROVEN |
| Grammar | syntax، relations، structure، rules، contextual application | نشاط تحديد الفاعل، word ranges، deterministic explanation | PROVEN للنطاق المحدد |
| I3rab | word، role، case ending، justification، alternatives | `GrammarLens` يعرض الدور والحركة الأساسية في scenario ثابت | PARTIALLY PROVEN |
| Morphology | root، pattern، derivation، inflection، forms | محفوظ كمجال مستقبلي في architecture؛ لا rule engine | NOT PROVEN |
| Orthography | hamza، alif، taa marbuta، spelling، punctuation | النص العربي وpunctuation محفوظان؛ لا نشاط spelling | NOT PROVEN |
| Rhetoric | التشبيه، الاستعارة، الكناية، الطباق، الأساليب | لا representation أو assessment rhetorical | NOT PROVEN |
| Literature | analysis، devices، style، context، interpretation | لا رحلة literature | NOT PROVEN |
| Vocabulary | meaning، synonym، antonym، context، collocation، relations | vocabulary in context محفوظ كقدرة مستقبلية؛ لا activity | NOT PROVEN |
| Speaking/Listening | لاحقًا دون تغيير core | media/audio capability boundary موجود خارج هذه الرحلة | NOT PROVEN |
| RTL UX | RTL layout، Arabic labels، selection، mixed Arabic/Latin/math | screenshot وواجهة RTL-first، keyboard labels، mixed strings | PARTIALLY PROVEN |

## الخلاصة

يثبت Gate 4B أن Grammar Lens يمثل تحليلًا عربيًا مشتقًا من SentenceObject دون نموذج مصدر ثانٍ. كما يثبت أن lifecycle language object يمكن أن يحمل source range وprovenance وactivity وfeedback. لا يثبت ذلك اكتمال Arabic Engine؛ فالقراءة والكتابة والصرف والإملاء والبلاغة والأدب والمفردات والمحادثة تحتاج slices مستقلة في مراحل مفوضة لاحقًا.

## مرجع التصميم

يظل `SUBJECT_ENGINE_ARCHITECTURE.md` هو الحد الفاصل: subject engine يملك representations وrules، بينما Core Board يظل subject-agnostic.
