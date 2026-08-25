# Educational Object Contract

## تعريف

العقد هو `EducationalObject<TType, TContent>` في `client/src/lib/educationalObjects.ts`. تم تصميمه كـplain TypeScript data؛ لذلك يمكن استخدامه من Core Board أو adapter أو اختبار دون تحميل مكتبة رسم أو واجهة.

## الحقول

| Field | الغرض | قاعدة التحقق |
|---|---|---|
| `id` | هوية ثابتة للربط والحفظ | non-empty string |
| `type` | مفتاح registry النوعي | non-empty string؛ الأنواع المجهولة لا تُسقط |
| `version` | نسخة الكائن المنطقية | positive number |
| `schemaVersion` | نسخة شكل البيانات | positive number؛ migration صريح عند التغيير |
| `position` | موضع الكائن على اللوحة | numeric `x`, `y` |
| `dimensions` | العرض والارتفاع | non-negative numeric values |
| `transform` | التحويل الحالي؛ حاليًا rotation | numeric rotation |
| `zIndex` | ترتيب العرض | number |
| `visible` | هل يظهر الكائن | boolean |
| `locked` | منع التحرير أو التحويل | boolean |
| `metadata` | بيانات وصفية غير خاصة بالرسم | record لا ينفذ ككود |
| `content` | محتوى النوع typed payload | يُفحص بواسطة registry definition |
| `capabilities` | العمليات المسموح بها | array of declared capability names |
| `source` | provenance اختياري | kind محدود إلى teacher/import/generated/system |
| `createdAt` / `updatedAt` | تتبع lifecycle زمني | ISO-like strings |

لا توجد حقول renderer أو DOM أو canvas في العقد. `style` و`stroke` هما جزء من compatibility bridge في `CoreObject` الحالي، ولا يغيران استقلال العقد العام.

## Validation

`validateEducationalObject` يفحص الشكل البنيوي. `validateRegisteredObject` يضيف content validation من تعريف registry. الفشل ينتج issues مع path؛ لا يوجد تنفيذ للمحتوى ولا HTML injection ولا dynamic code evaluation.

## الهوية

الاستعادة لا تغير `id`. duplication تستقبل ID جديدًا صريحًا وتضيف `duplicatedFrom`. عند غياب ID في payload قديم، ينشئ migration ID حتميًا من مسار الكائن بدل إعادة استخدام ID عشوائي قد يصطدم بكائن آخر.

## Unknown objects

الكائن ذي النوع غير المسجل يُحوّل إلى safe retained object: يحافظ على `type` و`content`/`data`، يصبح locked، ويملك فقط `selectable`, `movable`, `presentable`. يظهر diagnostic في metadata. هذا يمنع إسقاط محتوى تعليمي مستورد بصمت، مع عدم السماح بتشغيله ككود.

## Compatibility bridge

يحوّل `coreBoard.createObject` الكائن المسجل إلى `CoreObject` الذي تتوقعه واجهة Gate 2. يمكن لاحقًا استبدال هذا الجسر بadapter آخر دون تعديل العقد العام أو registry definitions.
