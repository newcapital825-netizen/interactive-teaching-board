# Assessment Engine

## المبدأ

Assessment primitive مستقل عن المادة، يستهلك EducationalObjects وresponse schemas وrubrics. لا يعتمد على AI حتى يعمل deterministic feedback الأساسي.

## response types

| النوع | تمثيل الإجابة |
|---|---|
| MCQ / multi-select | option IDs مع rationale اختياري |
| true/false | boolean مع evidence |
| matching / ordering | pairs أو ordered IDs |
| classification | item → category |
| fill blank / short answer | normalized text مع policy |
| constructed response | نص أو مجموعة objects |
| step-based solution | ordered SolutionStepObjects |
| drawing response | strokes/geometry references |
| equation response | canonical expression plus rendered form |
| text annotation | source range plus annotation |

## lifecycle

`draft → published → attempt → evaluated → feedback → retry → mastery evidence`.

Attempt immutable snapshot يشير إلى activity version وstudent scope أقل قدر ممكن. Evaluation تحفظ rubric version، validator version، criterion results، evidence، وteacher override. Retry لا يمحو المحاولات السابقة.

## scoring boundary

يجب الفصل بين exact match وsemantic equivalence وteacher rubric. الحل الرياضي قد يقبل طرقًا متعددة، واللغة قد تحتاج human review. لا تحول confidence إلى score دون سياسة معلنة.

## privacy

لا تجمع بيانات طالب غير لازمة. تحفظ attempts ضمن tenant/lesson boundaries مستقبلية، مع retention وexport/delete policies قبل أي حسابات أو analytics.

## Gate 4A

هذا تصميم فقط؛ لا يتم بناء evaluator أو student account أو scoring runtime في هذه المرحلة.
