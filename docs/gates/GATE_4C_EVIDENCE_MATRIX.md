# Gate 4C Evidence Matrix

| Capability | Arabic | Math | Shared Core | Evidence |
|---|---|---|---|---|
| EducationalObject | PROVEN | PROVEN | PROVEN | `SentenceObject` و`EquationObject` عبر العقد canonical |
| Registry | PROVEN | PROVEN | PROVEN | registry واحد يعرّف النوعين |
| Factory | PROVEN | PROVEN | PROVEN | constructors الحالية دون Math/Arabic factory ثانية |
| Lens | PROVEN | PROVEN | PARTIALLY PROVEN | `GrammarLens` و`MathVisualizationLens` مع source identity |
| Activity | PROVEN | PROVEN | PROVEN | كلاهما داخل `JourneyState` وlesson واحدة |
| Assessment | PROVEN | PROVEN | PROVEN | shared activity assessment وMath canonical extension |
| Feedback | PROVEN | PROVEN | PROVEN | feedback deterministic subject-specific فوق العقد المشترك |
| Provenance | PROVEN | PROVEN | PARTIALLY PROVEN | source-to-assessment chains واختبارات broken references |
| Teacher Override | PROVEN | PROVEN | PARTIALLY PROVEN | original/effective result وteacher event؛ لا identity infrastructure |
| Save/Restore | PROVEN | PROVEN | PROVEN | lesson round-trip مشترك مع subject isolation |
| Migration | PROVEN | PROVEN | PARTIALLY PROVEN | v1/v2 وmalformed cases؛ future schema breadth محدودة |
| Events | PROVEN | PROVEN | PROVEN | system assessment وteacher override events |
| RTL | PROVEN | PROVEN | PARTIALLY PROVEN | RTL-first workspace وvisual QA |
| Presentation | PARTIALLY PROVEN | PARTIALLY PROVEN | PARTIALLY PROVEN | المسار موجود في workspace؛ real-runner غير متاح |
| Keyboard | PARTIALLY PROVEN | PARTIALLY PROVEN | NOT VERIFIED | static semantics؛ UI automation runner غير متاح |
| Accessibility | PARTIALLY PROVEN | PARTIALLY PROVEN | NOT VERIFIED | لا screen reader ولا WCAG claim |
| Performance | PARTIALLY PROVEN | PARTIALLY PROVEN | PARTIALLY PROVEN | NODE/VITEST فقط، real browser غير متحقق |
| Golden Dataset | PROVEN within 10 cases | PROVEN within 14 bounded cases | NOT PROVEN as general corpus | fixtures الحالية فقط |
| Unsupported boundary | PROVEN within fixtures | PROVEN within bounded fixtures | PROVEN as policy | unsupported لا يتحول إلى incorrect بصمت |

## Evidence Labels

**PROVEN** تعني وجود اختبار أو دليل مباشر ضمن النطاق. **PARTIALLY PROVEN** تعني دليلًا محدودًا أو جزئيًا. **NOT PROVEN** تعني عدم وجود دليل كافٍ للتعميم. **NOT VERIFIED** تعني أن البيئة اللازمة لم تتوفر. **BLOCKED** تعني أن البند خارج النطاق المصرح به، وليس عيبًا مثبتًا.

## Final Status

التكامل يظل **B — CONDITIONAL**. لا يُستخدم هذا الجدول لإعلان اكتمال Arabic Engine أو Math Engine، ولا يمنح صلاحية للانتقال إلى Gate 4D.

## References

[1]: https://github.com/newcapital825-netizen/interactive-teaching-board/tree/feature/gate-4c-final-integration "Gate 4C final integration branch"

[2]: https://github.com/newcapital825-netizen/interactive-teaching-board/blob/feature/gate-4c-final-integration/tests/gate4c-final-integration.test.ts "Cross-subject integration tests"
