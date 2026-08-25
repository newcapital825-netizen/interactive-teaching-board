# Subject Engine Architecture

## الطبقات

```text
Universal Whiteboard
  → Interaction / Assessment / Feedback primitives
  → EducationalObject + Registry + Factory + Capabilities
  → Subject Engine plugins
  → Lens / Transformation / Validator / Activity providers
  → Canvas Adapter / Graph Adapter / Math Renderer boundaries
```

## Subject engine contract

| مسؤولية | ما يقدمه المحرك |
|---|---|
| object recipes | schemas وfactories مسجلة في registry |
| lenses | representation مشتقة تشير إلى source object |
| transformations | source → derived object مع provenance |
| validators | deterministic checks وexplainable findings |
| activities | prompt/response schema/rubric |
| evidence | source ranges وreferences وreview state |
| capabilities | explicit operations، لا assumptions UI |

Core Board لا يستورد Arabic أو Math rules. يطلب recipe أو transformation عبر contract، ويعرض object وفق capabilities. مستقبلًا يمكن إضافة Science أو English بنفس contract.

## provenance chain

كل derived object يشير إلى `sourceObjectId` و`sourceVersion` و`evidenceRefs` و`transformId` و`transformVersion` و`teacherReviewStatus`. لا تصبح نتيجة AI أو parser مصدرًا أصليًا بلا approval.

## failure isolation

تعطل subject engine لا يفسد Core Board أو objects أخرى. unknown types تحفظ كبيانات آمنة وتظهر كـunsupported representation، ولا تمرر HTML أو executable payload.

## Gate 4A boundary

لا توجد plugin runtime أو dynamic loading أو dependency جديدة. هذا contract design، ويحتاج spikes واختبارات contract قبل Gate 4B.
