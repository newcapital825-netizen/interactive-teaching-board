# GATE 8 — Contextual Teaching Actions

## Summary

أضيف شريط إجراءات سياقية capability-driven إلى Teacher Product Shell. عند وجود عنصر محدد، تظهر فقط الإجراءات المرتبطة بنوعه وقدراته، وتظهر الحالات غير المتاحة بصيغة واضحة بدل تنفيذ fake functionality. ظل Core Board subject-agnostic، وظلت الخرائط داخل طبقة contextual actions فوق canonical Registry/Factory/Capabilities.

## Action Coverage

| Object | Actions exposed | Status |
|---|---|---|
| `TextObject` | شرح، تحليل، تدريب، تقييم، مثال، مقارنة، تمييز، إخفاء/إظهار، تحويل إلى نشاط | PROVEN as capability descriptors; assess may be unavailable by capability |
| `SentenceObject` | شرح، تحليل، تدريب، تقييم، مثال، مقارنة، تمييز، إخفاء/إظهار، تحويل إلى نشاط | PROVEN within current Arabic slice |
| `EquationObject` | شرح، تحليل، تدريب، تقييم، مثال، مقارنة، تمييز، إخفاء/إظهار، تحويل إلى نشاط، عرض بصري | PROVEN within bounded Mathematics slice |
| `GraphObject` | شرح، تحليل، تدريب، تقييم، مقارنة، تمييز، إخفاء/إظهار، تحويل إلى نشاط، عرض بصري | PARTIALLY PROVEN; graph support remains bounded |
| `ShapeObject` | شرح، تمييز، إخفاء/إظهار | PROVEN as safe limited map |

## Acceptance Evidence

| Criterion | Classification | Evidence |
|---|---|---|
| Arabic element shows appropriate actions | PROVEN | Sentence/Text action map and tests |
| Mathematics element shows appropriate actions | PROVEN | Equation action map and tests |
| Text does not expose visualization as a math action | PROVEN | Text action map excludes `visualize` |
| Equation exposes visual action | PROVEN | Equation action map includes `visualize` |
| Convert content to Activity | PROVEN | canonical `createObject("ActivityObject")` with source metadata |
| Activity → Assessment compatibility | PARTIALLY PROVEN | ActivityObject is canonical and assessable; full UI transition remains deferred |
| Assessment → Feedback | PROVEN within existing slices | existing canonical assessment/feedback contracts retained |
| Provenance preservation | PROVEN for conversion path | sourceObjectId, sourceRange, sourceVersion, derivationType |
| Save/restore | PARTIALLY PROVEN | Core Board persistence covers created activity; contextual action descriptors are stateless |
| Teacher override compatibility | PROVEN by reuse | existing Arabic/Math override path remains unchanged |
| Unsupported capability safety | PROVEN | unavailable action state or explicit teacher-review notice; no fake execution |
| Duplicate engine architecture absence | PROVEN | contextualActions imports canonical Core Board/Registry/capability helpers only |

## Validation

The targeted Gate 8 suite covers Arabic actions, Mathematics actions, canonical Activity conversion, provenance, and unsupported shape behavior. Full validation will run `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test -- --run`, `pnpm build`, `git diff --check`, and a production-code duplicate architecture scan. Existing benchmark evidence remains NODE/VITEST; Browser Performance is not inferred.

## UX and Accessibility

Desktop and mobile static QA show a compact contextual bar below lesson setup, with progressive disclosure through capability-based action availability. RTL alignment and visible focus rules are retained. Touch, stylus, screen reader, UI automation, and real browser performance remain **NOT VERIFIED**.

## Boundaries

The current actions are intentionally small: most actions are descriptors that surface the relevant pathway or status, while conversion to Activity is executable and provenance-preserving. No general Arabic NLP engine, symbolic mathematics engine, AI, OCR, collaboration, billing, cloud persistence, institutional identity, or fake unsupported behavior was added.

## Decision

Gate 8 is **PASSED FOR ROADMAP CONTINUATION** when final full validation and checkpoint complete. The next roadmap gate is Gate 9 Lesson Builder + Classroom Workflow, subject to the same branch isolation and stop rules.
