# ADR-003 — Gate 3A Educational Object Engine

## Status

Accepted for Gate 3A review on `feature/gate-3a-educational-object-engine`; not merged.

## Context

Gate 2 أثبت Core Board vendor-neutral مع Text, Shape, Drawing, Image, Sentence, Equation, وGraph proof objects. لكن النوع والـfactory والقدرات لم تكن registry مركزية، ولم يكن هناك schema migration أو Question/Activity foundation أو controlled transformations.

## Decision

نضيف engine صغيرًا مستقلًا عن framework في plain TypeScript، مكوّنًا من contract، explicit capabilities، registry، migration، adapter boundaries، transformation descriptors، وgeneric proof factories. يبقى `CoreObject` جسر توافق للوحة Gate 2، ولا يُربط domain بـReact أو DOM أو tldraw أو Excalidraw أو React Flow.

يُحتفظ بالكائن المجهول بدل إسقاطه، ويُقفل ويُوسم safe handling. تعتمد الواجهة على capabilities وregistry metadata، لا على افتراض أن كل object يدعم كل عملية.

## Alternatives rejected

| Alternative | سبب الرفض |
|---|---|
| Subject-specific conditionals in Core Board | يضاعف coupling ويجعل إضافة المادة invasive |
| اختيار tldraw/Excalidraw الآن | Gate 3A architecture milestone وليس Canvas integration decision |
| database أو service جديد | overengineering خارج scope؛ local-first يكفي |
| full Arabic/Math engines | مخالفة absolute scope rule |
| silent discard للأنواع الجديدة | يعرّض المحتوى التعليمي للفقدان |

## Consequences

الإيجابي هو إضافة نوع جديد عبر definition + registration + adapter + tests دون تعديل Core Board المركزي. المقابل هو ضرورة الحفاظ على migration fixtures واختبار capabilities والـunknown policy، وبقاء بعض object renderers في UI كـproof adapters لا كإنتاج نهائي.

## Verification

يغطي `tests/educational-object-engine.test.ts` lifecycle، capability enforcement، registry، Geometry extensibility proof، migration، unknown safety، adapters، transformations، وcross-subject proof. تبقى UI automation وtouch/stylus وreal browser performance فجوات تحقق، لا ادعاءات نجاح.
