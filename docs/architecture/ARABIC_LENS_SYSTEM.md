# Arabic Lens System

## الهدف

الـLens هي طريقة تحليلية لعرض EducationalObject واحد. لا تملك المحتوى ولا تنسخه، بل تشير إلى source object وranges وتنتج derived representation versioned.

## العدسات

| Lens | يجيب عن | المخرجات |
|---|---|---|
| Grammar | ما الوظائف والعلاقات النحوية؟ | roles، relations، rule evidence |
| I3rab | ما الحالة الإعرابية وعلامتها؟ | word state، ending، evidence، tree |
| Morphology | كيف بُنيت الكلمة؟ | root، pattern، forms، tense |
| Spelling | ما القاعدة الإملائية؟ | error class، correction، explanation |
| Vocabulary | ما المعنى في السياق؟ | gloss، sense، distractors |
| Rhetoric | ما الأسلوب البلاغي؟ | device، span، rationale |
| Reading | كيف نفهم النص؟ | main/supporting idea، inference، structure |
| Writing | كيف ننتج نصًا؟ | prompt، constraints، rubric |
| Literature | ما سياق النص؟ | author/work/era/relations |

## Contract

```text
Lens(sourceObject, sourceVersion, sourceRange, lensVersion)
  → Representation(sourceRef, evidenceRefs, findings, reviewStatus)
```

تغيير Lens لا يغير المصدر، وفشل Lens لا يفسد المصدر. كل finding يحمل validator/version وteacher review state. لا تعرض النتائج الآلية كحقائق نهائية دون benchmark ومراجعة.

## Gate 4A

لا توجد Lens runtime أو NLP dependency في هذه المرحلة؛ هذه مواصفة للـsubject engine والعقد والاختبار.
