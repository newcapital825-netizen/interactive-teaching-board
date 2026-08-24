# Toolbar Architecture — Gate 3B

## Layers

| Layer | Purpose | Current controls |
|---|---|---|
| Primary | frequent creation and navigation | Select, Hand, Text, Pen, Highlighter, Eraser, Shape |
| Secondary | less frequent educational objects | Equation, Graph, Line, Arrow, Question, Activity, Note |
| Utility | workspace state | Undo, Redo, Presentation, Save, extra-tools affordance |
| Contextual | selected-object actions | Duplicate, Delete, Ungroup where relevant, Rotate, Lock/Unlock, Visibility |

## Rules

كل زر يملك accessible name و`title`، وكل icon-only control له `aria-label`. لا يظهر Ungroup إلا للمجموعة، ولا تعرض الواجهة أدوات خاصة بنوع غير محدد. alignment/layer operations في inspector لأن استخدامها أقل تكرارًا من الرسم والإضافة.

## Future extension

عند توفر capability registry على baseline، يمكن اشتقاق contextual actions من capabilities دون تغيير تقسيم toolbar. لا توجد subject toolbars في Gate 3B.
