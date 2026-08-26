# Gate 16 — مصفوفة المرونة

> **قاعدة التصنيف:** النجاح يثبت السلوك المحدد في payload bounded؛ ولا يثبت أمانًا شاملًا أو حماية من كل مدخلات مستقبلية.

| الحالة | السلوك المتوقع | الدليل الحالي | التصنيف |
|---|---|---|---|
| malformed storage payload | رفض آمن دون crash أو استبدال وثيقة صالحة | Playwright resilience test على dev server | **PROVEN** |
| duplicate IDs | رفض هوية مكررة عبر document/page/object/children | Playwright + اختبارات codec السابقة | **PROVEN** |
| unsafe object keys | رفض prototype-pollution style keys recursively | Playwright + Gate 10 unit coverage | **PROVEN** |
| unsupported version/type | رفض fail-closed وعدم إنشاء fallback object | Playwright resilience test | **PROVEN** |
| partial document | رفض metadata أو البنية الناقصة | Playwright + safe parser tests | **PROVEN** |
| empty storage | إنشاء/إبقاء حالة آمنة دون exception | Playwright resilience test | **PROVEN** |
| migration v1 | تمرير migration عبر canonical safe parser | Gate 10 unit/integration coverage | **PROVEN** ضمن الإصدار المدعوم |
| save/restore after large fixture | حفظ ثم reload مع بقاء الوثيقة قابلة للقراءة | Playwright matrix، 10/100/250/500 | **PROVEN** ضمن المتصفح المختبر |
| browser crash/reload أثناء كتابة storage | سيناريو interruption فعلي | لا يوجد اختبار crash injection | **NOT VERIFIED** |
| quota exhaustion | تعامل مع localStorage quota exceeded | لا يوجد جهاز/حصة اصطناعية في suite | **NOT VERIFIED** |
| hostile external file | تحليل ملف من مصدر غير موثوق خارج payload tests | خارج النطاق الحالي | **NOT VERIFIED** |
| touch/stylus input | تفاعل hardware فعلي | البيئة لا توفر hardware | **NOT VERIFIED** |

## النتيجة

اختبار المرونة النهائي جزء من `gate16-performance.spec.ts` ونجح على Desktop Chromium وMobile Chromium: **20/20** إجمالًا للمصفوفة المشتركة، دون أخطاء page/console/request مسجلة. تبقى سيناريوهات الأعطال الفيزيائية وحصة التخزين والأجهزة الحقيقية غير مثبتة، ولا يجوز تحويل نجاح parser tests إلى ادعاء أمان شامل.
