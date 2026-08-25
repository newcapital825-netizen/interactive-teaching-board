# GATE 14 — Accessibility & Input QA Report

**Project:** مِداد — Universal Teacher Workspace  
**Branch:** `feature/gate-14-accessibility-input-qa`  
**Base:** Gate 13 checkpoint `656e1954`  
**Scope:** تحسين قابلية الاستخدام الدلالية ومسارات keyboard وRTL فقط، دون إنشاء architecture أو engine جديد.

## Decision

> **B — CONDITIONAL**

تم تحسين المسارات الموجودة بدل إعادة بنائها: عناصر Canvas تُحدد عبر Tab ثم Enter/Space، يدعم الاختيار المتعدد عبر Shift/Ctrl/Cmd، ويعمل Escape للإلغاء. أضيفت أزرار Inspector قابلة للوصول لتغيير العرض والارتفاع، مع بقاء مقابض resize pointer مسارًا بصريًا لا يُعامل كبديل screen-reader. أضيفت `focus-visible` و`aria-live` لحالات notice/feedback، وحماية `prefers-reduced-motion`، مع الحفاظ على command resolver الذي يتجاهل حقول التحرير.

## Evidence

| المجال | التصنيف | الدليل |
|---|---|---|
| Keyboard command contract | **PROVEN** | 3 اختبارات Gate 14 جديدة، إضافة إلى `keyboard-commands.test.ts`. |
| Canvas keyboard selection | **PROVEN structurally** | `onKeyDown` و`aria-pressed` على عناصر Canvas. |
| Accessible resize alternative | **PROVEN structurally** | أربعة أزرار Inspector مستقلة للعرض/الارتفاع. |
| Text editing protection | **PROVEN** | resolver لا يعترض input/textarea/select/contenteditable. |
| Status/feedback announcements | **PROVEN structurally** | `role=status` و`aria-live=polite`. |
| Focus visibility | **PROVEN structurally** | `:focus-visible` موحد. |
| Reduced motion | **PROVEN structurally** | media query صريحة. |
| RTL visual layout | **PARTIALLY PROVEN** | desktop/mobile visual QA وRTL matrices. |
| Contrast | **PARTIALLY PROVEN** | فحص بصري؛ لا contrast scanner. |
| Screen reader | **NOT VERIFIED** | قارئة شاشة فعلية غير متوفرة. |
| Touch/Stylus | **NOT VERIFIED** | hardware غير متوفر. |
| Full browser keyboard journey | **NOT VERIFIED** | Playwright مؤجل إلى Gate 15. |
| Modal/focus restoration | **NOT VERIFIED** | لا modal workflow حرج في هذه الشريحة. |

## Validation

| Command | Result |
|---|---|
| `pnpm install --frozen-lockfile` | **PASS** |
| `pnpm check` | **PASS** |
| `pnpm test -- --run` | **PASS — 22 files, 113 tests** |
| `pnpm build` | **PASS**; existing >500 kB warning remains |
| `git diff --check` | **PASS** |
| Architecture scan | **PASS**; no forbidden duplicate markers |
| Visual QA 1280×720 | **PASS for visual smoke** |
| Visual QA 390×844 | **PASS for visual smoke** |
| Clean clone | **PENDING after final commit** |

## Delivered artifacts

تم تسليم `docs/qa/ACCESSIBILITY_MATRIX.md` و`docs/qa/KEYBOARD_MATRIX.md` و`docs/qa/RTL_MATRIX.md`، إضافة إلى `docs/gates/GATE_14_VISUAL_QA_NOTES.md`. تُفصل هذه الوثائق بوضوح بين PROVEN، PARTIALLY PROVEN، NOT VERIFIED، وBLOCKED، ولا تدعي WCAG compliance أو screen-reader success.

## Limitations and stop rule

لم يحدث تعديل لـ`main` أو merge أو نشر. لا تُعد هذه البوابة بديلًا عن Playwright أو screen reader أو touch/stylus أو human classroom validation. Gate 15 هو البوابة التالية المسموح بها بعد وجود هذا التقرير وcheckpoint وclean clone.
