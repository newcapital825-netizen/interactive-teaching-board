# Persistence UX — Gate 3B

## User-facing states

| State | Meaning | UI |
|---|---|---|
| Unsaved changes | document changed since last explicit save | coral dot and `تغييرات غير محفوظة` |
| Saving | save operation started | `جارٍ الحفظ` |
| Saved | localStorage write returned success | green dot and `محفوظ` |
| Save failed | storage access or quota failed | red state and `تعذر الحفظ. حاول مرة أخرى.` |

## Boundary

الحفظ محلي فقط في هذا Gate. لا cloud sync ولا collaboration. `persistDocument` يعيد `{ ok, error }`، وتتعامل الواجهة مع النتيجة بدل عرض Saved كحالة افتراضية. restore failure يعود إلى document جديد ويظل مسجلًا ضمن رسالة مفهومة.

## Data preservation

Mutation history تحفظ snapshots قبل العمليات الرئيسية. save لا يغير object IDs أو styles أو z-order. copy/paste وduplicate page ينشئان IDs جديدة للنسخ المقصودة، بينما reload يحافظ على محتوى الصفحة المخزن.

## Future work

Autosave debounce، conflict handling، cloud persistence، وtemplate library ليست ضمن Gate 3B ويمكن بحثها في Gate لاحق بعد اعتماد model الحالي.
