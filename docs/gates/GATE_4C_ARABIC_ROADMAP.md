# Gate 4C Arabic Roadmap

## Principle

Arabic Engine يجب أن يكون subject engine فوق Core، لا نسخة ثانية من EducationalObject. المصدر النصي يظل authoritative، وكل Grammar أو I3rab أو Morphology representation مشتق versioned وقابل للحذف دون حذف المصدر.

## Controlled sequence

| المرحلة | النطاق | دليل القبول | القرار |
| --- | --- | --- | --- |
| A1 | Sentence entry + token/range inspection | stable ranges، mixed punctuation، provenance | أول implementation slice |
| A2 | Grammar Lens: فعل/فاعل/مفعول به | labeled golden sentences + teacher review | توسعة محدودة |
| A3 | Guided I3rab: type → role → case → mark → reason | step assessment وalternative accepted answers | بعد A2 فقط |
| A4 | Morphology Lens | root/pattern dataset وترخيص واضح | deferred |
| A5 | Reading/Vocabulary Lens | passages، evidence، comprehension rubric | deferred |
| A6 | Writing/Spelling/Rhetoric | teacher-reviewed corpora | deferred |

## Minimum useful Arabic slice

المسار الأدنى المفيد للمعلم هو إدخال جملة، تحديد كلمة، فتح Grammar Lens، تعديل أو اعتماد analysis، تحويله إلى نشاط، استقبال إجابة، تقييم كل خطوة أو النتيجة، وإظهار feedback مع provenance. لا يساوي ذلك automatic I3rab عام؛ يجب أن تحمل كل نتيجة `validationState` و`reviewStatus` و`evidenceRefs`.

## Lens contract

كل Lens مستقبلية يجب أن تحافظ على `sourceObjectId` و`sourceRange` و`sourceVersion` و`lensType` و`derivedData` و`provenance`. لا يجوز أن تغيّر lens المصدر، ولا أن تجعل output غير المراجع published lesson.

## Arabic quality gates

| البوابة | السؤال |
| --- | --- |
| Technical | هل يمكن إنشاء/تحويل/حفظ/استعادة الكائن عبر canonical registry؟ |
| Educational | هل التحليل مقبول في golden dataset ومفهوم للمعلم؟ |
| UX | هل يمكن إظهار المعلومة تدريجيًا دون ازدحام؟ |
| Safety | هل uncertain analysis معلن وليس claimًا قطعيًا؟ |

## Deferred by design

يبقى full Arabic NLP، OCR، misconception detection، AI generation، ودعم كل أبواب النحو والصرف والبلاغة والقراءة خارج أول expansion. أي استخدام لاحق لأداة NLP يمر عبر Generate → Validate → Teacher Review → Approve، ولا يصبح المصدر.

## References

1. [Arabic Teaching Model](../architecture/ARABIC_TEACHING_MODEL.md)
2. [Gate 4C Discovery](../gates/GATE_4C_DISCOVERY.md)
3. [Gate 4B Final Hardening](../gates/GATE_4B_FINAL_HARDENING.md)
