# Object Transformations

## الغرض

قد يحتاج Educational Object واحد إلى أكثر من تمثيل: عرض بصري، تمثيل graph، أو activity representation. Gate 3A لا ينفذ تحويلًا عربيًا أو رياضيًا؛ بل يثبت آلية طلب controlled representation.

## العقد

`TransformationRequest` يحمل `sourceObjectId`, `sourceType`, `representation`, و`reason`. `describeTransformation` يتحقق من تطابق المصدر ويعيد descriptor plain data بالحالة `described`. لا يُنشئ نسخة مستقلة ولا يغير المصدر.

```text
SentenceObject ── request visual ──> visual descriptor
              └─ request activity ─> activity descriptor

EquationObject ── request visual ──> visual descriptor
              └─ request activity ─> activity descriptor

GraphObject   ── request graph ────> graph descriptor
```

## Supported representations

| Source type | Supported representations |
|---|---|
| SentenceObject | visual, activity |
| EquationObject | visual, activity |
| GraphObject | visual, graph, activity |
| Other registered objects | visual |

الجدول لا يعني وجود محرك أو solver؛ إنه boundary قابل للتوسعة.

## Safety rules

يُرفض request إذا لم يطابق object ID/type. لا يتم cloning تلقائي، ولا يتم تنفيذ نص أو expression كبرنامج، ولا تُفترض علاقة بين graph representation وReact Flow. الـGraph Adapter يستقبل plain `nodes` و`edges` فقط.

## Future extension

عند بناء toolkit مستقبلية يمكنها إضافة transformation handler خاص بها، بشرط أن يظل المصدر هو domain object، وأن يكون الناتج versioned descriptor قابلًا للاختبار، وألا تتسرب تفاصيل المحرك إلى Core Board.
