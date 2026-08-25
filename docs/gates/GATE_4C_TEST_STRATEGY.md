# Gate 4C Test Strategy

## Test pyramid

كل vertical slice يمر عبر طبقات متراكمة، ولا يُقبل نجاح طبقة واحدة كدليل كافٍ.

| الطبقة | ما تثبته | الحالة المطلوبة |
| --- | --- | --- |
| Unit | factories، validators، transforms، feedback | deterministic وexplainable |
| Integration | source→lens→activity→assessment→feedback | provenance محفوظ |
| Round-trip | save→reload→restore | لا data loss |
| Migration | previous→current ورفض future/malformed | safe and versioned |
| Provenance | كل مشتق يشير إلى source/range/version | no orphan lineage |
| Assessment | الحالات الخمس وdiagnostics والبدائل | rubric واضح |
| Feedback | what/why/inspect/nextStep | teacher-reviewed wording |
| Negative | unknown type، invalid payload، wrong step، empty response | safe rejection |
| Determinism | نفس input يعطي نفس semantic result | لا random grading |
| Browser | open-to-present lifecycle | عند توفر runner |
| Hardware | touch/stylus gestures | عند توفر hardware |

## Current Gate 4B baseline

المثبت حاليًا هو 10 test files و47 tests، مع Gate 4B hardening suite تشمل canonical registry، lens regeneration، assessment states، provenance، persistence، migration، duplicate/history، وNode benchmark. browser runner وhardware غير متاحين، لذا تبقى حالتهما NOT VERIFIED.

## Gate 4C acceptance rule

لا يُقبل slice إلا إذا حقق architecture compliance، educational meaning، deterministic behavior حيث يلزم، serializable/restorable state، provenance preservation، accessibility baseline، responsive UI، documentation، وعدم وجود duplication أو hidden fallback أو unverified claims.

## Regression policy

كل تغيير subject engine يعيد تشغيل Gate 2 وGate 3A وGate 3B وGate 4B suites. أي failure في canonical contracts أو provenance أو migration يوقف التوسع ويُوثق بدل تجاوزه.

## References

1. [Gate 4C Discovery](./GATE_4C_DISCOVERY.md)
2. [Gate 4B Final Hardening](./GATE_4B_FINAL_HARDENING.md)
3. [Gate 4B hardening tests](../../tests/gate4b-validation-hardening.test.ts)
