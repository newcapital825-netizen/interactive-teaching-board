# Interaction Model — Gate 3B

## Selection

التحديد المفرد هو الحالة الافتراضية. Ctrl/Meta يضيف أو يزيل عناصر من multi-select، ويظهر contextual strip فقط عند وجود selected object. كل object مرئي هو زر دلالي قابل للتركيز، مع labels عربية تتضمن النوع والمحتوى.

## Manipulation

السحب يغير position دون تغيير ID أو style أو semantic content. corner handles تطبق minimum size، وتبقى المجموعة قابلة لفكها مع children محفوظة. rotate وlock وvisibility تمر عبر نفس history commit الموجود. alignment وdistribution pure helpers وتعيد ترتيب المواضع فقط للعناصر المحددة.

## Layers

front/back/forward/backward تعيد ترتيب array وتعيد بناء zIndex المتصل. العملية لا تنشئ أو تحذف object ولا تعدل محتواه. group/ungroup يحافظان على child relationships ضمن حدود Core Board الحالية.

## History boundary

كل mutation teacher-facing تستخدم `commit` أو history snapshot الخاص بالـresize/move. viewport pan/zoom ليسا محتوى تعليميًا ولا يدخلان history. presentation وfullscreen حالات عرض لا تعدل document.

## Failure behavior

إذا لم يوجد selected object، تظهر رسالة إرشادية عربية. إذا كان العنصر مقفلًا تمنع mutation وتظهر حالة واضحة. لا تعرض الواجهة stack traces أو IDs داخل رسائل الخطأ.
