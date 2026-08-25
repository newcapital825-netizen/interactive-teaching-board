# AI Boundary

## المبدأ

AI مساعد محتمل وليس source of truth. يمكن أن يقترح lesson أو activity أو تحليلًا أو سؤالًا أو differentiation أو hint أو feedback أو image/PDF transformation، لكن لا يكتب مباشرة في lesson المنشورة.

## البوابة الإلزامية

```text
Generate → Validate → Teacher Review → Approve → Publish
```

كل output يحتفظ بـprompt/context policy، model/version، timestamp، source refs، evidence، validation findings، confidence، وteacher approval. الرفض أو عدم اليقين حالة صريحة. لا autonomous publishing ولا silent provenance upgrade.

## deterministic fallback

يجب أن يعمل التقييم والتغذية الراجعة deterministic حيث يمكن. AI لا يُطلب لحساب score أو كشف قاعدة بسيطة. عند استخدام AI، تُعرض provenance وقيود النموذج للمعلم.

## security/privacy

لا تمرر بيانات طلاب أو ملفات غير لازمة. يلزم redaction، retention، tenant isolation، rate limits، audit trail، وcontent validation قبل أي integration. يمنع remote code execution وunsafe HTML/SVG وserialized executable payloads.

## Gate 4A

هذه boundary design فقط؛ لا model calls أو provider أو secrets أو AI implementation.
