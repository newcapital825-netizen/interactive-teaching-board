# Gate 4C Golden Dataset Plan

## Purpose

لا تُدّعى الدقة التعليمية لمجرد أن parser أو Lens يعرض نتيجة. Golden Dataset هو مرجع قابل للمراجعة يربط input بالتفسير المتوقع والبدائل المقبولة والحالات الخاطئة والشرح والمصدر والإصدار.

## Record schema

| الحقل | المعنى | شرط القبول |
| --- | --- | --- |
| `id` | هوية المثال | stable and unique |
| `domain` | Arabic Grammar/I3rab/Morphology/Reading أو Math Solving/Algebra/Geometry | controlled vocabulary |
| `input` | نص أو تعبير أو مسألة | مصدر واضح |
| `expectedInterpretation` | التحليل أو الحل المتوقع | يراجعه خبير |
| `acceptableAlternatives` | طرق أو صيغ صحيحة أخرى | مع rationale |
| `incorrectCases` | أخطاء مقصودة | مع diagnostic |
| `explanation` | شرح تربوي | لغة واضحة |
| `source` | مصدر مرخص أو مؤلف | provenance required |
| `version` | إصدار dataset | migration-safe |
| `reviewStatus` | draft/reviewed/approved | لا publish قبل approved |

## Arabic dataset families

| dataset | أمثلة أولية مخططة | لا يجوز استنتاجه |
| --- | --- | --- |
| Grammar | nominal/verbal sentences، roles، case marks | full automatic I3rab |
| I3rab | word→type→role→case→mark→reason | صحة عامة دون expert labels |
| Morphology | root/pattern/derived forms | analyzer coverage |
| Reading | passage، evidence، main/supporting ideas، questions | reading ability prediction |

## Mathematics dataset families

| dataset | أمثلة أولية مخططة | لا يجوز استنتاجه |
| --- | --- | --- |
| Math Solving | bounded linear equations | general solver correctness |
| Algebra | equivalent transformations and alternatives | symbolic completeness |
| Geometry | points/angles/measurements | geometry proof engine |

## Split and review policy

يجب فصل authoring examples عن evaluation examples، وتسجيل reviewer وdate وversion عند الاعتماد. لا تُدخل بيانات عشوائية أو synthetic claims في production. عند الخلاف، تُحفظ alternatives والـuncertainty بدل إجبار إجابة واحدة.

## Gate 4C minimum

قبل أول implementation موسع، يكفي dataset صغير reviewed لمسار واحد عربي ومسار واحد رياضي، مع negative cases وalternative answers. يبقى كل ما بعد ذلك مؤجلًا حتى تثبت القيمة والدقة.

## References

1. [Arabic Teaching Model](../architecture/ARABIC_TEACHING_MODEL.md)
2. [Mathematics Teaching Model](../architecture/MATHEMATICS_TEACHING_MODEL.md)
3. [Gate 4C Test Strategy](../gates/GATE_4C_TEST_STRATEGY.md)
