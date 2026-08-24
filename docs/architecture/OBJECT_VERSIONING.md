# Object Versioning and Migration

## نسختان مختلفتان

`version` هي النسخة المنطقية للكائن وتزداد عند lifecycle changes مثل duplication. `schemaVersion` هي نسخة شكل payload الذي يقرأه engine. لا يجوز استخدامهما كبديلين.

الحالية هي `EDUCATIONAL_OBJECT_SCHEMA_VERSION = 2`. تمثل `CoreObject` القديمة صيغة Gate 2، بينما يضيف Gate 3A الحقول `schemaVersion`, `capabilities`, `transform`, `source`, `createdAt`, و`updatedAt`.

## Migration path

المسار الحالي:

```text
raw JSON
  → parse
  → migrateCoreObject / migrateBoardPage / migrateBoardDocument
  → structural normalization
  → unknown-type safety policy
  → typed BoardDocument
```

`safeParseBoardDocument` يعيد `null` للـJSON غير الصالح أو المستند الخالي من الصفحات، ولا يرمي exception إلى UI. أما object type غير المعروف فيُحتفظ به locked safe object بدل إسقاطه.

## قواعد الترحيل

| Rule | السلوك |
|---|---|
| Missing ID | deterministic migrated ID based on payload path |
| Missing position/size/style | safe defaults مع عدم تغيير الحقول الموجودة |
| Legacy `rotation` | تُنسخ إلى `transform.rotation` |
| Missing capabilities | تؤخذ من registry، أو safe minimal set للنوع المجهول |
| Unknown type | retain type/content/data، lock object، mark metadata |
| Invalid JSON | return null؛ لا يوجد تنفيذ أو partial restore |
| Existing ID | يُحفظ كما هو أثناء restore |

## اختبار migration

تغطي `tests/educational-object-engine.test.ts` migration من كائن Gate 2 قديم، وunknown type مع content object، ومستندًا بلا `schemaVersion`، وJSON malformed. تثبت الاختبارات أن IDs والمحتوى لا يضيعان وأن unknown content لا يتحول إلى كود.

## استراتيجية الإصدارات المستقبلية

عند رفع schema version، يضاف migration pure function من النسخة السابقة إلى الجديدة، ويُختبر fixture حقيقي قبل تغيير current version. لا يجوز أن يسقط migration field غير معروف بصمت؛ إما يحفظه في metadata/data أو يرفض payload مع diagnostic واضح.
