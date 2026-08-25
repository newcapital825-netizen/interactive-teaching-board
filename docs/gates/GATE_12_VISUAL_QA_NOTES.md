# Gate 12 Visual QA Notes

تم فحص `/` على viewport سطح المكتب 1280×720 وعلى الهاتف 390×844 باستخدام RTL. ظهرت لوحة Classroom Loop في مسار المعلم والطالب، وبقيت حالات lifecycle وحقول Math steps وأزرار الحفظ والـfeedback مقروءة ضمن تصميم paper-and-olive. على الهاتف تحولت قائمة الأنشطة إلى عمود واحد وتحولت حقول الخطوات إلى صفوف رأسية، مع بقاء الأزرار والحقول ضمن عرض الشاشة.

التحذير الظاهر في سجل Vite هو `HMR invalidate ... createClassroomActivityFromObject export is incompatible` أثناء Fast Refresh لأن الملف يصدّر helper بجانب component؛ لا يظهر كخطأ TypeScript أو build failure، وسيُسجل كـNOT VERIFIED بالنسبة إلى Fast Refresh فقط. يلزم إعادة تحميل كاملة أو فصل helper إلى ملف lib إن تطلبت QA لاحقة إزالة هذا التحذير.
