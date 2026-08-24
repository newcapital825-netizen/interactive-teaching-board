# Changelog

## Gate 1B — Additional Architectural Proof — 2026-08-24

تم تجميد `SentenceObject` والسيناريو نفسه «قرأَ الطالبُ الكتابَ»، وإضافة Candidate Bench يبدّل المرشحين دون fork في نموذج المجال. تم اختبار React Flow 12.11.3 فعليًا كـ Graph Adapter لتمثيل Grammar/I3rab، مع إبقاء tldraw وExcalidraw ضمن probes خفيفة وتسجيل أن direct Canvas integration يحتاج جولة منفصلة بسبب ضغط الحزم والذاكرة في بيئة الـ Spike.

أُضيف `GATE_1B_REPORT.md` و`docs/ADR/ADR-001-gate1b-candidate-proof.md`، وسُجل تحليل coupling وRTL وtouch/stylus وaccessibility وperformance وexport وpersistence وlicense. نجح TypeScript وproduction build، مع بقاء تحذير حجم الحزمة.

**الحالة:** C — CONDITIONAL. لا يبدأ Gate 2 أو MVP أو أي ميزة مؤجلة قبل قرار المالك الصريح.
