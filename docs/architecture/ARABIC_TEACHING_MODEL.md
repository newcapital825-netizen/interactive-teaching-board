# Arabic Teaching Model

## المبدأ

محرك العربية المقترح هو **subject engine** ينتج ويحلل EducationalObjects ولا يملك نموذجًا موازيًا. يحتفظ النص أو الكلمة بهويته ومصدره وإصداره، بينما التحليل النحوي أو الصرفي أو البلاغي هو representation مشتق قابل للمراجعة وإعادة البناء.

## مجالات التعلم

| المجال | تمثيل تعليمي مقترح | دليل القبول لاحقًا |
|---|---|---|
| القراءة | TextObject مع فقرات ومواضع ومفردات وأسئلة وأفكار رئيسية/داعمة | golden passages وتعليقات معلم |
| النحو | SentenceObject مع roles وعلاقات وأدلة | labeled sentences ومراجعة خبير |
| الإعراب | I3rab representation: كلمة ← دور ← حالة ← علامة ← دليل | tree/dependency snapshots قابلة للتحقق |
| الصرف | WordObject مع root/pattern/derived forms/tense/transitivity | lemma/root benchmark متوازن |
| الإملاء | Spelling representation لقواعد الهمزات والألف والتاء والترقيم | error corpus مع expected explanation |
| البلاغة | RhetoricObject لعلاقات التشبيه والاستعارة والكناية والطباق وغيرها | examples annotated by teachers |
| الأدب | LiteratureObject مع أعمال وأزمنة وكتّاب وروابط نصية | provenance واضح، لا claims ثقافية بلا مصدر |
| الهوية العربية | CulturalMap/Timeline representations | مصادر ثقافية مرخصة ومراجعة بشرية |

## Arabic correctness boundary

لا يساوي وجود tokenization أو POS tagging صحة تعليمية للإعراب. كل نتيجة آلية يجب أن تحمل `validationState` و`confidence` و`evidenceRefs` و`reviewStatus`. لا تنتقل النتيجة إلى published lesson إلا بعد Teacher Review وApprove.

## Arabic Lens System

العدسات Grammar وI3rab وMorphology وSpelling وVocabulary وRhetoric وReading وWriting وLiterature لا تنسخ المحتوى؛ كل Lens تشير إلى `sourceObjectId` و`sourceRange` وتنتج representation versioned. تغيير العدسة لا يغيّر source object، وحذف representation لا يحذف المصدر.

## دورة المعلم

ينشئ المعلم نصًا أو كلمة، يحدد المقطع، يختار Lens، يراجع التحليل، يضيف annotation/evidence، ثم يحول المصدر إلى activity أو question. يمكن للطالب التفاعل مع representation، لكن صلاحية الإجابة وتفسيرها لا تُفترض دون validator وrubric.

## حدود Gate 4A

هذه وثيقة تصميم. لا تحدد grammar engine أو morphological analyzer نهائيًا، ولا تدعي automatic I3rab correctness، ولا تضيف مكتبة NLP. الاختيار يحتاج Arabic golden dataset، مقارنة دقة/اتساق/تفسير، ومراجعة ترخيص وأداء.

## References

[1]: https://camel-tools.readthedocs.io/en/latest/overview.html "CAMeL Tools documentation"
[2]: https://aclanthology.org/2020.lrec-1.868/ "CAMeL Tools: An Open Source Python Toolkit for Arabic NLP"
