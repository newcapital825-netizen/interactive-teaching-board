# Input Model — Gate 3B

## Pointer and touch

يستخدم Core Board Pointer Events موحدة. وضع Select يتيح تحديدًا وسحبًا، ووضع Hand يحرك مساحة اللوحة، وأدوات الرسم تبدأ stroke داخل canvas فقط. `touch-action: none` على surface والعناصر يمنع scroll العرضي أثناء التفاعل؛ لا يثبت هذا وحده نجاح pinch zoom على hardware حقيقي.

## Wheel and zoom

العجلة العادية تحرك مساحة اللوحة، وCtrl/Meta + wheel يغير zoom ضمن حدود `55%–180%`. هذه المعالجة محصورة داخل canvas عبر `preventDefault`، ولا تعطل scrolling خارجها. Fit وReset يقدمان حالتين واضحتين بدل ترك المعلم في viewport غير مفهوم.

## Keyboard

تبقى اختصارات Ctrl/Meta وEscape في `keyboardCommands.ts`. عند presentation يتولى Escape الخروج وArrowLeft/ArrowRight التنقل بين الصفحات قبل command resolver. لا ينبغي اعتراض text input أو textarea أو contenteditable؛ هذا مغطى باختبارات Gate 2.

## RTL/LTR

سطح السبورة `dir="rtl"`، بينما coordinates والـcanvas geometry تبقى رقمية مستقلة عن اتجاه القراءة. النصوص المختلطة تمر كبيانات نصية؛ لا يوجد تحليل لغوي في هذا Gate.

## Hardware honesty

TOUCH = NOT VERIFIED — HARDWARE UNAVAILABLE. STYLUS = NOT VERIFIED — HARDWARE UNAVAILABLE. لا توجد ادعاءات pressure أو palm rejection فعلية، ولا handwriting recognition.
