# Universal Educational Object Engine

## الغرض

يضيف Gate 3A طبقة domain عامة تجعل اللوحة الواحدة قادرة على استضافة كائنات عربية ورياضية وعلمية وعامة، من دون تحويل Core Board إلى شجرة شروط خاصة بكل مادة. الطبقة لا تنفذ محرك Arabic أو Math أو AI؛ بل توفر عقدًا ثابتًا يمكن للأدوات المستقبلية البناء عليه.

## الحدود

> **Educational Object Engine ليس subject engine.** هو عقد دورة حياة وقدرات وتسجيل وتسلسل آمن، بينما تحليل الجملة أو حل المعادلة أو إدارة نشاط حي تبقى خارج Gate 3A.

المسار المعتمد هو:

```text
Educational Object Domain
        ↓
Object Registry
        ↓
Canvas / Graph / Persistence Adapters
        ↓
Teacher-facing Core Board
```

لا يستورد domain أيًا من React أو DOM أو tldraw أو Excalidraw أو React Flow. تستخدم واجهة React الحالية `CoreObject` كجسر توافق مع Gate 2، وتستشير registry لاختيار renderer metadata وعرض الكائن.

## الطبقات

| Layer | مسؤوليتها | ما لا تفعله |
|---|---|---|
| `educationalObjects.ts` | العقد المستقل، القدرات، validation البنيوي، lifecycle metadata، envelope | لا يرسم ولا يحفظ مباشرة |
| `objectRegistry.ts` | تسجيل النوع، factory، content validation، capabilities، renderer/persistence metadata | لا يعرف React أو DOM |
| `objectMigrations.ts` | تطبيع payloads القديمة، schema migration، unknown-type retention | لا يحل محتوى المادة |
| `objectTransformations.ts` | وصف طلب تمثيل بديل للكائن نفسه | لا ينشئ نسخًا عشوائية ولا يطبق حلًا عربيًا/رياضيًا |
| `objectAdapters.ts` | تعريف تمثيل Canvas/Graph كـplain data | لا يسرّب renderer properties إلى domain |
| `genericObjects.ts` | Question/Activity factories وcross-subject proof وGeometry example | لا يبني activity engine أو subject engine |
| `coreBoard.ts` | Gate 2 board state وcompatibility bridge إلى registry | لا يملك تعريفات المواد مركزيًا |
| `CoreBoardBench.tsx` | teacher-facing rendering والتفاعل | لا يعرّف schema أو factory جديدًا لكل subject |

## Lifecycle

الدورة الموثقة هي `Create → Validate → Insert → Select → Edit → Transform → Serialize → Persist → Restore → Duplicate → Delete`. كل انتقال يمكن تمثيله في metadata عند الحاجة، مع بقاء undo/redo في Gate 2 على مستوى document snapshot. الاستعادة تحافظ على IDs؛ النسخ يولد ID جديدًا ويضع `duplicatedFrom` في metadata.

## Cross-subject proof

يوفر `createCrossSubjectProof()` خمسة كائنات من نفس registry: `SentenceObject` للعربية، `EquationObject` للرياضيات، `GraphObject` للعلوم، `QuestionObject`، و`ActivityObject`. هذا إثبات معماري محدود: **لوحة واحدة + أنواع مواد متعددة + نفس core engine**، وليس ادعاء اكتمال أي محرك تخصصي.

## قرار Gate 3A

القرار هو المحافظة على Gate 2 وإضافة engine صغير قابل للاختبار. الكائنات الجديدة لا تتطلب تعديل Core Board المركزي؛ يكفي تعريفها وتسجيلها وتوفير adapter واختبارات. إذا تطلب نوع مستقبلي تعديلًا واسعًا في Core Board، فهذا إخفاق في معيار extensibility ويجب أن يبقى Gate 3A `CONDITIONAL`.
