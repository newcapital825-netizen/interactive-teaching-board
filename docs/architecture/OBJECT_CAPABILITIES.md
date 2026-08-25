# Object Capabilities

## المبدأ

لا يدعم كل Educational Object كل عملية. يعلن كل registry definition قائمة capabilities، وتستخدم طبقة الواجهة هذه القائمة قبل إتاحة الحركة أو تغيير الحجم أو التحرير أو التكرار أو التجميع.

## القدرات المتاحة

| Capability | المعنى |
|---|---|
| `selectable` | يمكن تحديد الكائن |
| `movable` | يمكن تغيير موضعه |
| `resizable` | يمكن تغيير أبعاده |
| `rotatable` | يمكن تغيير دورانه |
| `editable` | يمكن تعديل محتواه |
| `duplicable` | يمكن إنشاء نسخة جديدة منه |
| `groupable` | يمكن إدخاله في مجموعة |
| `exportable` | يمكن تمرير تمثيله إلى export adapter |
| `interactive` | يملك تفاعلًا يتجاوز العرض السلبي |
| `assessable` | يمكن أن يرتبط بتقييم أو حالة إجابة |
| `presentable` | يمكن عرضه في Presentation Mode |

## أمثلة

`TextObject` يدعم select/move/resize/edit/duplicate/group/export/present. `QuestionObject` يضيف interactive وassessable ولا يفترض وجود solver أو validator كامل. الكائن المجهول يحتفظ بـselectable/movable/presentable فقط ويصبح locked حفاظًا على السلامة.

## Enforcement

توفر `hasCapability` فحصًا بسيطًا، وتوفر `assertCapability` guard صريحًا يرفع خطأً إذا طلب domain operation غير مدعوم. في `CoreBoardBench` تُعطّل أزرار العمليات غير المدعومة وتُرفض pointer actions المقابلة. هذا يمنع أن يتحول renderer إلى مصدر صلاحيات ضمني.

## قاعدة امتداد

عند إضافة نوع جديد، يجب تحديد capabilities من البداية، واختبار أن Core Board لا يعرض عمليات غير مدعومة. لا يجوز استخدام `type` كبديل عن capability؛ النوع يحدد تعريف registry، بينما capability تحدد ما يمكن فعله.
