# Object Registry

## الغرض

`client/src/lib/objectRegistry.ts` هو نقطة تسجيل الأنواع التعليمية. كل تعريف يضم `type`, `label`, `renderer`, `capabilities`, `createContent`, `validateContent`, و`persistence`. يسأل Core Board registry عن تعريف النوع بدل بناء شجرة `if type === ...` للمادة.

## التدفق

```text
register definition
        ↓
getObjectDefinition(type)
        ↓
validate content
        ↓
createRegisteredEducationalObject
        ↓
Core Board compatibility bridge / adapter
```

يحتوي registry الافتراضي على Text, Shape, Image, Drawing, Group, Sentence, Equation, Graph, Question, وActivity. Question وActivity generic foundations؛ لا تنفذان engine تفاعل أو تقييم كاملًا.

## تعريف النوع

```ts
registerObjectDefinition({
  type: "GeometryObject",
  label: "Geometry",
  renderer: "shape",
  capabilities: ["selectable", "movable", "resizable", "editable", "duplicable", "exportable", "presentable"],
  createContent: (content) => typeof content === "string" ? content : "triangle",
  validateContent: (content) => typeof content === "string"
    ? { valid: true, issues: [] }
    : { valid: false, issues: [{ path: "content", message: "..." }] },
  persistence: "json",
});
```

يُرفض التسجيل المكرر حتى لا يتغير معنى النوع بصمت. `getObjectDefinition` و`listObjectDefinitions` يوفران introspection للاختبارات والأدوات المستقبلية.

## Unknown type policy

إذا لم يوجد تعريف، لا يفشل parsing بإسقاط object ولا ينفذ payload. يُنشأ safe unknown object يحتفظ بالمحتوى، يُقفل، ويحصر capabilities. عند الاستعادة يظهر النوع والبيانات ضمن object metadata/data ليتمكن migration أو toolkit لاحق من التعامل معه.

## إضافة GeometryObject

يبرهن `registerGeometryProof()` في `genericObjects.ts` أن إضافة `GeometryObject` تحتاج تعريفًا وتسجيلًا واختبارًا فقط. لا تحتاج تعديل `CoreObject` المركزي أو شرطًا جديدًا في `CoreBoardBench`؛ renderer metadata يُحل من registry. هذا هو extensibility proof المطلوب في Gate 3A.

## Persistence adapter

تحدد `persistence` ما إذا كان content JSON أو opaque-safe، لكن registry لا يكتب localStorage بنفسه. هذه مسؤولية persistence layer، ما يحافظ على فصل lifecycle عن التخزين.
