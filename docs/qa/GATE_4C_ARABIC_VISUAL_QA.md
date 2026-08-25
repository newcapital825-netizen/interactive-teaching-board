# Gate 4C Arabic I3rab Visual QA

## Evidence

تمت معاينة `/` على viewport مكتبي 1280×720 وviewport هاتف 390×844 بعد إضافة نموذج I3rab متعدد الحقول وتفاصيل العدسة التدريجية، ثم أُعيدت المعاينة بعد تثبيت الجملة `كتبَ الطالبُ الدرسَ.` كمصدر افتراضي.

| المجال | النتيجة | الحدود |
| --- | --- | --- |
| RTL hierarchy | PASS بصريًا | لا يساوي تدقيق screen reader |
| Arabic source card | PASS بصريًا | الجملة الأصلية `كتبَ الطالبُ الدرسَ.` ظاهرة دون تعديل |
| Grammar Lens | PASS بصريًا | التفاصيل الكاملة تظهر بعد كشف الإجابة |
| Responsive layout | PASS بصريًا في اللقطتين | لا يثبت touch أو stylus |
| Header controls | PASS بصريًا | browser automation غير متاح |
| I3rab form | غير ظاهر في الجزء العلوي من لقطة الهاتف | يحتاج اختبار تفاعل/تمرير فعلي؛ لا نستنتج منه فشلًا |
| Focus/keyboard | لم يُختبر عبر runner | static semantics فقط |

المعاينة الأخيرة تثبت وضوح التخطيط العام وRTL والاستجابة الأولية، وظهور الجملة المحددة في Gate 4C. لا تثبت UI automation أو touch/stylus أو full WCAG أو browser performance.
