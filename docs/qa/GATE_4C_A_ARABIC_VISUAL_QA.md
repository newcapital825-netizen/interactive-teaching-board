# Gate 4C-A Arabic I3rab — Visual QA

## Desktop

تمت معاينة المسار الجذري على viewport بحجم 1280×720. ظهرت الجملة العربية من اليمين إلى اليسار بوضوح، وبقيت عناصر المصدر والعدسة والنشاط ضمن سطح Universal Board غير متمركز بصورة مفرطة. يظهر مستوى الكشف `guided 1/5` وزر وضع المعلم، وتبقى provenance ظاهرة في مساحة العمل.

## Mobile

تمت معاينة المسار الجذري على viewport بحجم 390×844. الترتيب RTL قابل للقراءة، وأزرار الحفظ والاستعادة والتقديم انتقلت إلى صفوف قابلة للعرض، كما بقيت تبويبات العربية/الرياضيات ومسار الرحلة والبطاقة المصدرية قابلة للوصول. النموذج المنظم أسفل مساحة العرض يحتاج استمرار اختبار التمرير اليدوي في جهاز حقيقي قبل اعتبار mobile UX مكتملًا.

## Accessibility status

تمت مراجعة static labels وARIA roles وfocus-visible semantics في الضوابط المعدلة. لم يُجر اختبار screen reader أو keyboard runner آلي كامل، لذلك: `SCREEN READER = NOT VERIFIED` و`UI AUTOMATION = NOT VERIFIED — RUNNER UNAVAILABLE`. لم يتم إعلان WCAG compliance.

## Boundary

المعاينة البصرية لا تثبت أداء متصفح حقيقي أو touch/stylus behavior. القيود تبقى `TOUCH = NOT VERIFIED — HARDWARE UNAVAILABLE` و`STYLUS = NOT VERIFIED — HARDWARE UNAVAILABLE` و`REAL BROWSER PERFORMANCE = NOT VERIFIED`.
