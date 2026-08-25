# Gate 14 — Keyboard Acceptance Matrix

| المسار | الاختصار/المفتاح | الحالة | الملاحظة |
|---|---|---|---|
| تحديد عنصر DOM | Tab ثم Enter أو Space | **PROVEN structurally** | `TeacherCanvas` يربط `onKeyDown` بالتحديد canonical. |
| تحديد متعدد | Shift/Ctrl/Cmd + Enter أو Space | **PROVEN structurally** | يستخدم `selectObjects` نفسه دون selection engine ثانٍ. |
| إلغاء التحديد | Escape | **PROVEN** | يفرغ التحديد ويحافظ على مسار notice. |
| تحريك الاختيار | Arrow keys | **PROVEN for command contract** | يتحرك بمقدار canonical ثابت خارج حقول التحرير. |
| حذف | Delete/Backspace | **PROVEN for command contract** | يتجاهل الحقول النصية. |
| نسخ/لصق | Ctrl/Cmd+C/V | **PROVEN for command contract** | لا يلتقط الاختصار من input أو textarea. |
| تكرار | Ctrl/Cmd+D | **PROVEN for command contract** | يمر عبر `duplicateObjects`. |
| تحديد الكل | Ctrl/Cmd+A | **PROVEN for command contract** | يحدد عناصر الصفحة الحالية. |
| تراجع/إعادة | Ctrl/Cmd+Z/Y وShift+Z | **PROVEN for command contract** | يستخدم history/future الحاليين في Canvas. |
| حفظ | Ctrl/Cmd+S | **PARTIALLY PROVEN** | resolver موجود؛ browser execution يحتاج Gate 15. |
| عرض الدرس | Ctrl/Cmd+P | **PARTIALLY PROVEN** | resolver موجود؛ browser execution يحتاج Gate 15. |
| تكبير/تصغير | Ctrl/Cmd +/- | **PARTIALLY PROVEN** | resolver موجود؛ browser execution يحتاج Gate 15. |
| تحرير نص/معادلة | الكتابة داخل input | **PROVEN** | command resolver لا يمنع native editing. |
| تغيير حجم بديل | Tab إلى أزرار Inspector ثم Enter | **PROVEN structurally** | زيادة/تقليل العرض والارتفاع مسارات DOM مستقلة. |
| Contextual actions | Tab ثم Enter | **PARTIALLY PROVEN** | أزرار دلالية موجودة؛ كل التحويلات تحتاج browser E2E. |
| صفحات الدرس | Tab ثم Enter | **PARTIALLY PROVEN** | controls موجودة؛ complete traversal غير منفذ آليًا. |
| الطالب والمعلم | Tab ثم Enter | **PARTIALLY PROVEN** | semantic controls موجودة؛ رحلة كاملة ضمن Gate 15. |

## قواعد عدم كسر التحرير

عند وجود focus داخل `input` أو `textarea` أو `select` أو `[contenteditable="true"]` أو `[role="textbox"]` أو `[data-text-editor="true"]`، يعيد `resolveBoardCommand` قيمة `null`. بذلك تبقى الأسهم والحذف واختصارات الحفظ متاحة للمحرر الأصلي ولا تتحول إلى mutation للوحة بالخطأ.

## Gate 14 classification

عقود resolver ومسارات DOM الأساسية **PROVEN** أو **PROVEN structurally**. تشغيل الرحلات كاملة عبر browser automation، وقياس focus order الفعلي، ما زال **PARTIALLY PROVEN** إلى أن يُنفذ Gate 15.
