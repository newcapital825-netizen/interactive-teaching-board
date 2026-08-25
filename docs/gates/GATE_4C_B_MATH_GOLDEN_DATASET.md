# GATE 4C-B — Mathematics Golden Dataset

## Purpose and scope

هذه مجموعة deterministic صغيرة لتثبيت السلوك التعليمي في Mathematics Step-by-Step slice. لا تمثل corpus رياضيًا عامًا، ولا تسمح باستنتاج دعم معادلات غير المعادلة canonical `2x + 3 = 11`. الحالات غير المدعومة موجودة لتوثيق الحدود ومنع false positives.

## Dataset summary

| Metric | Value |
|---|---:|
| Total records | 14 |
| Supported canonical/negative/feedback records | 10 |
| Explicit unsupported boundary records | 4 |
| Source version | 1 |
| Assessment mode | deterministic |
| AI / OCR | not used |

## Records

| ID | Category | Problem / case | Expected | Status | Diagnostic |
|---|---|---|---|---|---|
| `math-golden-one-step` | positive-coefficients | `2x + 3 = 11`, first transformation | `2x = 8` | supported | `correct-step` |
| `math-golden-two-step` | positive-coefficients | canonical two-step solution | `2x = 8` → `x = 4` | supported | `correct-step` |
| `math-golden-negative-sign` | negative-coefficient boundary | submitted `-2x = 8` | reject sign mutation | supported negative fixture | `sign-error` |
| `math-golden-incomplete` | incomplete-step | missing operation and justification | reject incomplete record | supported negative fixture | `incomplete-step` |
| `math-golden-arithmetic` | invalid-transformation | submitted `2x = 9` | reject arithmetic result | supported negative fixture | `arithmetic-error` |
| `math-golden-transformation` | invalid-transformation | submitted `2x = 4` | reject non-equivalent transformation | supported negative fixture | `transformation-error` |
| `math-golden-alternative` | alternative-valid-path | move 3 to the other side | `2x = 11 - 3` | supported | `correct-alternative` |
| `math-golden-invalid-intermediate` | wrong-intermediate-correct-final | invalid intermediate before final answer | intermediate remains invalid | supported negative fixture | `arithmetic-error` |
| `math-golden-malformed` | invalid-transformation | malformed/unstructured payload boundary | request review | supported safety fixture | `unsupported-reasoning` |
| `math-golden-verification` | wrong-final-correct-intermediate | final answer / substitution mismatch | `x = 4` plus valid substitution | supported negative fixture | `verification-failure` |
| `math-golden-negative-constant` | negative-constant | `2x - 3 = 11` | no solution in this slice | unsupported | `unsupported-reasoning` |
| `math-golden-fractional-coefficient` | fractional-coefficient | `1/2x + 3 = 11` | no solution in this slice | unsupported | `unsupported-reasoning` |
| `math-golden-equivalent-transformation` | equivalent-transformation | `2(x + 1) = 12` | no general equivalence claim | unsupported | `unsupported-reasoning` |
| `math-golden-wrong-final` | wrong-final-correct-intermediate | `2x = 8` then `x = 5` | no accepted final answer | unsupported boundary fixture | `unsupported-reasoning` |

## Required fields

كل سجل في runtime يحتوي `id` و`problem` و`expectedSteps` و`acceptableAlternatives` و`invalidSteps` و`expectedDiagnostic` و`expectedFeedback` و`explanation` و`source` و`sourceVersion` و`provenance`. الحالات الحدّية تضيف `category` و`scopeStatus`، وحالة verification تضيف `invalidFinalAnswers` و`expectedFinalAnswer`.

## Acceptance rules

يُقبل المسار canonical والمسار البديل المحدد فقط بعد مقارنة المعنى الرياضي المحدود للخطوة: before expression وoperation وafter expression وjustification. لا تعتمد الشريحة على string equality وحدها، لكنها لا تطبق symbolic equivalence أو fuzzy matching خارج العبارات المثبتة.

تُرفض الخطوات الناقصة، وخطأ العملية، وخطأ الحساب، وتغيير الإشارة، والتحويل غير المكافئ، والتبرير غير الكافي، والـstep غير المدعوم. ويظل final answer correctness منفصلًا عن step correctness وعن verification correctness.

## Reproducibility

الزمن الافتراضي في math contract هو `2026-01-01T00:00:00.000Z`، وIDs الخاصة بالassessment وverification مشتقة من IDs ثابتة. لذلك تعطي نفس المدخلات نفس evaluation وdiagnostic وfeedback وprovenance، ولا تعتمد على random أو network أو UI state أو current time.

## References

[1]: https://github.com/newcapital825-netizen/interactive-teaching-board/blob/feature/gate-4c-math-hardening/client/src/lib/mathStepSlice.ts "Bounded mathematics contract and dataset implementation"

[2]: https://github.com/newcapital825-netizen/interactive-teaching-board/blob/feature/gate-4c-math-hardening/tests/gate4c-math-step-slice.test.ts "Golden dataset and hardening tests"
