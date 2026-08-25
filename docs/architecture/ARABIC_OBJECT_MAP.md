# Arabic Object Map

## قاعدة الخريطة

كل عنصر أدناه هو specialization أو representation لـEducationalObject، وليس domain model جديدًا. يستخدم `type`, `schemaVersion`, `capabilities`, `source`, `metadata`, `transform`, `createdAt`, `updatedAt`، وserialization/migration canonical.

| Object | المحتوى الدلالي | capabilities الأساسية | التحويلات |
|---|---|---|---|
| WordObject | token، lemma، root، features، source range | select, edit, annotate, transform | Morphology, Vocabulary, Spelling |
| SentenceObject | tokens وعلاقات sentence | select, edit, annotate, transform | Grammar, I3rab, Reading |
| TextObject | paragraphs، spans، language metadata | select, edit, annotate, transform | Vocabulary, Reading, Question |
| GrammarObject | roles، relations، rule evidence | select, reveal, annotate, review | I3rab, practice |
| I3rabObject | case analysis وعلامة الإعراب والدليل | reveal, hide, annotate, assess | Sentence/I3rab tree |
| MorphologyObject | root/pattern/derived forms/tense | reveal, compare, transform | Word/Morphology view |
| VocabularyObject | gloss، context، distractors، evidence | edit, assess, transform | Text/Activity/Question |
| RhetoricObject | device، span، explanation، evidence | annotate, review, assess | Reading/Literature |
| ReadingActivityObject | prompt، passage ref، rubric | interact, assess, retry | Text → Activity |
| WritingActivityObject | prompt، constraints، rubric | interact, annotate, assess | Text → Activity |
| SpellingActivityObject | target spans، error class، hint | interact, assess, retry | Text/Word → Activity |
| LiteratureObject | author/work/era/relations/provenance | select, annotate, transform | Timeline, context |
| CulturalMapObject | place/object/person مع provenance | select, reveal, annotate | Literature, timeline |
| ArabicTimelineObject | dated events وrelations | select, sort, annotate | Literature/Culture |

## Validation وreview

تحتوي representation على schema validation، source/evidence refs، `teacherReviewStatus`، ونسخة القاعدة المستخدمة. لا يسمح renderer أو Lens بتعديل المصدر بصمت. migration تحفظ IDs والروابط وتتعامل مع unknown types بحذر.

## Example relation

`SentenceObject` مصدر واحد قد ينتج `GrammarObject` و`I3rabObject` و`ReadingActivityObject`. كل ناتج يحتفظ بـ`sourceObjectId` وrange وevidence، ويُحذف دون حذف المصدر. أي نتيجة غير مؤكدة تبقى draft أو needs-review.

## حدود التنفيذ

لا يقرر هذا الملف library أو parser، ولا ينفذ analysis. correctness لا تُدّعى إلا بعد golden datasets ومراجعة معلمين وقياس accuracy/consistency/explainability/determinism.
