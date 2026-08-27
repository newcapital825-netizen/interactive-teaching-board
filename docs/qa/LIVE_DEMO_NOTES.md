# Live Product Demonstration Notes

**Target:** `feature/productization-v1` at `213712af46443bdbf971e0716e4d7425c948b771`  
**Mode:** observation only; no production-code changes during demo.

## Arabic sentence — first observation

The live workspace opened successfully in RTL. The unified input accepted `كتب الطالب الدرس.` and added a visible Arabic sentence object to Page 1. The contextual bar appeared in the rendered interface and showed: `جملة · كتب الطالب الدرس.` with `ثقة متوسطة` and the reason that the input has two or more Arabic words but detailed analysis is not proven for this text. The available actions visibly included شرح، تحليل، تدريب، تقييم، مثال، مقارنة، تمييز، إخفاء/إظهار، وتحويل إلى نشاط. This means recognition and contextual actions are visible, but automatic full grammatical analysis has not yet been established for this exact sentence.

## Arabic sentence — visible state after insertion

The sentence is visible as a board object and the contextual actions are visible in the page content. The live UI explicitly labels the recognition as medium confidence and says detailed analysis is not proven for this exact text. The learning loop shows the source sentence and offers conversion to an activity without leaving the lesson context. The interface did not automatically show a full analysis before the teacher selected an action.

## Arabic sentence — contextual action surface

After scrolling to the contextual section, the live DOM exposed separate buttons for شرح، تحليل، تدريب، تقييم، مثال، مقارنة، تمييز، إخفاء/إظهار، and تحويل إلى نشاط. The contextual result area was not populated automatically. The learning loop simultaneously displayed the sentence as a source and the five stages المحتوى، الفهم، النشاط، المحاولة، والمراجعة, with an option to create an activity.

## Arabic sentence — analysis and activity

When the visible `تحليل` action was clicked for `كتب الطالب الدرس.`, the UI did not show a full grammatical analysis. It showed `نتيجة تحتاج مراجعة`, `ثقة متوسطة`, and the safe message `يمكن حفظ الجملة، لكن لا يوجد تحليل لغوي مثبت لهذا النص حاليًا`, with provenance `مصدر المعلم فقط؛ لم يثبت تحليل متخصص` and a teacher-review state.

The visible `تحويل إلى نشاط` action then succeeded without leaving the lesson. Page 1 increased to three objects, and the classroom loop displayed an Arabic activity `إعراب` with `مسودة`, instructions `أعرب الكلمة المحددة.`, source reference `sentence_sbfj56`, and `تجهيز للطالب`. The newly selected activity object itself renders as generic JSON-like content in the contextual inspector, which is a visible UX limitation even though the classroom activity card is human-readable.

## Arabic word — visible recognition

After entering `المعلم` through the same unified input and adding it, the live UI created a visible text object. The contextual bar labeled it `كلمة عربية · المعلم`, showed `ثقة متوسطة` with the reason `الإدخال كلمة عربية مفردة`, and exposed a `خريطة الكلمة` action alongside شرح وتحليل وتدريب وتقييم. The earlier Arabic activity remained visible in the classroom loop, so the new word was added to the same lesson context rather than opening a separate tool.

## Arabic word — contextual action

The contextual bar for `المعلم` visibly exposed `خريطة الكلمة` as an enabled action, with the accessible hint `عرض خريطة كلمة عندما تكون البيانات مثبتة.` The same view continued to show the earlier Arabic activity as a draft in the learning loop. The word-map action is now ready to be clicked for direct observation.

## Arabic word — live word map result

Clicking `خريطة الكلمة` produced a visible result titled `خريطة الكلمة` with `ثقة متوسطة ضمن المثال`. It showed the bounded fields: root `ع ل م`, type `اسم فاعل معرّف بـ«ال»`, singular/masculine, pattern `مُفَعِّل`, meaning `من يعلّم أو يقدّم التعليم`, derivations `معلّمون، معلّمين، معلّمة`, and a lesson-context interpretation. The displayed provenance says it comes from a limited embedded educational dictionary and needs a documented lexicographic source for expansion; the teacher can edit the result. This is a visible bounded success, not evidence of a general morphology engine.

## Poetry — input staged

The unified input accepted the requested line `العلم نور والجهل ظلام` while the lesson remained Arabic. Before pressing the add action, no automatic literary or meter result was displayed; the line was only staged in the input.

## Poetry — live recognition result

After adding `العلم نور والجهل ظلام`, the board created a visible `جملة` object. The contextual label was `جملة · العلم نور والجهل ظلام` with medium confidence and the statement that detailed analysis is not proven for this text. No automatic poetry-specific action, literary analysis, or meter result appeared. The board did preserve the item in the same page alongside the prior activity and word-map objects. This is an observed product boundary, not a failure to be hidden.

## Mathematics — input staged

The unified input accepted `2x + 5 = 15` while the current lesson subject remained Arabic. The equation was staged in the same lesson input; no result was displayed before the add action. The subject must be switched to الرياضيات before claiming a mathematics-specific journey.

## Mathematics — equation insertion

After selecting `الرياضيات`, the same unified input accepted and added `2x + 5 = 15` as a visible `معادلة` object on Page 1. The UI labeled it `ثقة مرتفعة` because it contains an equality and algebraic symbol within the supported pattern. Visible actions included شرح، تحليل، تدريب، تقييم، مثال، مقارنة، تمييز، إخفاء/إظهار، تحويل إلى نشاط، and عرض بصري. The equation stayed in the same lesson alongside Arabic objects and the existing activity.

## Mathematics — visible board and contextual actions

The live board visibly contains the equation object `2x + 5 = 15` alongside the Arabic sentence, activity, word-map object, and poetry line. Its contextual inspector identifies it as `معادلة` and `ثقة مرتفعة`; the contextual action surface exposes شرح، تحليل، تدريب، تقييم، مثال، مقارنة، تمييز، إخفاء/إظهار، تحويل إلى نشاط، and عرض بصري. No math result is being claimed until the visible action is run.

## Mathematics — live analysis result

Clicking `تحليل` for `2x + 5 = 15` did not produce solution steps. The UI showed `نتيجة تحتاج مراجعة`, `يحتاج إلى تحديد`, and `لم أجد معادلة مثبتة مطابقة لهذا الإدخال؛ لم أُنشئ خطوات تخمينية.` Provenance was `مصدر المعلم فقط؛ لم يثبت تحليل متخصص · يحتاج إلى مراجعة المعلم`. This is a truthful fail-closed boundary: the recognition confidence was high, but no verified math solution was displayed for the entered form.

## Mathematics — activity conversion

Clicking `تحويل إلى نشاط` for `2x + 5 = 15` succeeded in the same lesson. Page 1 increased to eight objects and a visible activity card `تدريب من المصدر: 2x + 5 = 15` was created. The contextual inspector for the selected activity showed generic content and `يحتاج إلى تحديد · لم يثبت التعرف على نوع تعليمي محدد.` The classroom loop continued to show the source chips and the pre-existing Arabic draft activity. This proves activity conversion, not verified solution steps or math assessment quality.

## Student View — live opening

Clicking `معاينة الطالب` opened a separate student-facing view successfully. The header showed the lesson title, subject/level context, and the phrase `شرح الفكرة ثم التحقق من الفهم`. The student view rendered the page content and both generated activities, exposed answer textareas and submission actions, and explicitly stated `المحتوى والنشاط فقط` and `عرض الطالب · دون أدوات تعديل`. The first visible activity was Arabic `إعراب` in draft state with `أعرب الكلمة المحددة.`; a second activity sourced from the equation was also present lower in the page.

## Student View — answer staging

The entered response `الطالبُ فاعلٌ مرفوعٌ` was visible in the student response area. After scrolling, the visible page showed the equation activity card `تدريب من المصدر: 2x + 5 = 15` and a response textarea containing that same staged answer, followed by a visible `إرسال للمراجعة` button. This exposed a product-coherence concern: the staged response appears associated with the next activity field in the rendered order, so the demo records the state without interpreting it as a correct answer.

## Student View — submission result

Clicking `إرسال للمراجعة` succeeded. The rendered UI displayed `حُفظت إجابتك للمراجعة؛ ستظهر النتيجة بعد التقييم.` It did not display correctness, a diagnostic explanation, or retry feedback at this point. This confirms submission persistence/status messaging, but not an end-to-end automated assessment or feedback loop.

## Presentation Mode — live opening

Clicking `عرض الدرس` opened Presentation Mode successfully. The rendered view showed the lesson title, `خروج`, `السابقة`, `التالية`, `صفحة 1 من 1`, the explanatory heading, the Arabic sentence, the word, the bounded word-map card, the poetry line as a generic sentence, the equation, and both generated activities. No editing controls appeared in this mode. Presentation is therefore visibly functional as a read-only page sequence, while the content quality remains bounded by the results observed above.
