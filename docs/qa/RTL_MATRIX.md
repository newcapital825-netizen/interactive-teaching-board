# Gate 14 — RTL and Mixed Arabic/Mathematics Matrix

| المجال | الحالة | الدليل |
|---|---|---|
| اتجاه الصفحة الرئيسية | **PROVEN** | الجذر يستخدم `dir="rtl"` في TeacherProductShell. |
| وضع الطالب | **PROVEN structurally** | student preview وClassroom Loop داخل `main dir="rtl"`. |
| وضع التقديم | **PROVEN structurally** | presentation mode داخل `main dir="rtl"`. |
| عناوين وأوصاف عربية | **PROVEN** | labels وheadings وnotices عربية في المسارات الحالية. |
| أسماء الأزرار | **PROVEN structurally** | أزرار بكتابات عربية أو `aria-label` عربية. |
| الأرقام والـIDs | **PARTIALLY PROVEN** | IDs وpercentages تُعرض ضمن النص العربي؛ لم يُختبر كل mixed bidi edge case. |
| المعادلات داخل واجهة عربية | **PARTIALLY PROVEN** | EquationObject وMath step fields موجودة؛ يحتاج browser matrix كامل. |
| select العربية | **PROVEN in browser smoke** | ظهرت select labels العربية وقُبل اختيار قيمة أثناء smoke. |
| feedback العربية | **PROVEN structurally** | feedback وdiagnostic داخل status regions. |
| محاذاة الأدوات | **PARTIALLY PROVEN** | desktop/mobile screenshots سابقة وCSS responsive؛ لا يغطي كل viewport. |
| focus order RTL | **NOT VERIFIED** | لا يوجد keyboard runner كامل حتى الآن. |
| Screen reader Arabic | **NOT VERIFIED** | لم تتوفر قارئة شاشة فعلية. |
| Touch/stylus RTL | **NOT VERIFIED** | hardware غير متوفر. |

## حدود المنتج

المسار الحالي يدعم شريحة عربية وإطارًا رياضيًا محددًا، ولا يدعي تغطية كل النحو العربي أو كل الجبر الرمزي. أي نص مختلط بين العربية والرموز الرياضية يحتاج اختبارًا منفصلًا في Gate 15، مع إبقاء التقييم deterministic وعدم إدخال AI كمصدر للحقيقة.
