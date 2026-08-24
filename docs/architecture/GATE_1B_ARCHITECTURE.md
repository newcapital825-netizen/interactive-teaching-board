# Gate 1B Architecture Note

## Scope

هذا المستند يصف Spike فقط. البنية ليست monorepo إنتاجية؛ المشروع React/Vite مستقل ومقصود به إثبات حدود المعمارية قبل إنشاء apps/packages/engines production structure.

## Boundary diagram

```text
                    SentenceObject
                         │
             ┌───────────┴───────────┐
             │                       │
       Canvas Adapter          Graph Adapter
             │                       │
       ┌─────┴─────┐             React Flow
       │           │
    tldraw     Excalidraw
```

## Ownership rules

يمتلك التطبيق `EducationalObject` وdomain data وidentity وprovenance وapplication serialization. لا تمتلك المكتبة معنى الكائن التعليمي. يملك Canvas Adapter تحويلات العرض والتفاعل مع المرشح المحدد، بينما يملك Graph Adapter تحويل العلاقات إلى عقد وحواف متخصصة.

## Current implementation

سطح DOM الحالي يثبت object lifecycle العام، وReact Flow يثبت Graph Adapter فعليًا. tldraw وExcalidraw مرشحان موثقًا عبر probes ولم يُدخلا إلى bundle النهائي بعد ملاحظة كلفة التحويل والذاكرة؛ هذا قرار عزل تجريبي، وليس رفضًا نهائيًا.

## Deviation from requested repository tree

لم يُنشأ هيكل production monorepo أو مجلدات engines كاملة لأن Gate 2 غير مصرح به. جرى اختيار convention الخاص بقالب React/Vite الحالي لتقليل المخاطر، مع وضع التقرير وADR داخل `docs/`. هذا الانحراف مقصود ومؤقت حتى يُحسم Canvas Engine وتُحدد وجهة GitHub الصحيحة.

## Future math boundary

`EquationObject` موجود ككائن تعليمي تجريبي فقط. لا يوجد MathLive أو solver أو semantic math engine. أي اختيار Math input يجب أن يمر بتقويم مستقل لـ editable math وLaTeX وsemantics وtouch وaccessibility وmobile behavior.
