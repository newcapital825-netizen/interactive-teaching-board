# Lesson Context Persistence — Bounded Fix Report

## A. Exact files/contracts changed

| File | Change |
|---|---|
| `client/src/lib/coreBoard.ts` | Added optional canonical `BoardDocument.context` with `subject`, `category`, and `level`; `title` remains the existing canonical field. |
| `client/src/lib/objectMigrations.ts` | Added a safe optional-context sanitizer in the existing migration path. Only non-empty string values for the three supported keys survive; malformed values are omitted and no defaults are invented for older documents. |
| `client/src/components/TeacherProductShell.tsx` | Connected current lesson metadata to the canonical document used by autosave, explicit save, recovery snapshot, export, import, and recovery. Existing local-first storage remains the same path. |
| `tests/gate5-teacher-productization.test.ts` | Added save/restore assertions for title, subject, category, and level. |
| `tests/gate10-save-export-import-recovery.test.ts` | Added export/import round-trip assertions, legacy-document absence semantics, and malformed-context sanitization assertions. |

No second BoardDocument model, persistence system, envelope format, serializer, migration engine, registry, factory, or evaluator was introduced.

## B. Save/restore proof

`persistDocument` and `restoreDocument` continue to use the existing `STORAGE_KEY` and `safeParseBoardDocument` path. The product shell now supplies the canonical document with `title` and `context` to autosave, explicit save, and recovery snapshot. The Gate 5 contract test proves that the exact context `{ subject: "العربية", category: "إعدادي", level: "الصف الثاني الإعدادي" }` survives local save/restore together with the title and existing page/object data.

## C. Export/import proof

`exportLesson` and `importLesson` remain the same canonical envelope and codec. A Gate 10 test exports a document with `{ subject: "الرياضيات", category: "ثانوي", level: "الصف الأول الثانوي" }`, imports it through the existing migration path, and asserts exact equality of title and context. The product shell export path now calls the same canonical document builder used by save, so the UI metadata is included in the envelope.

## D. Backward compatibility

A legacy document without `context` remains readable through `safeParseBoardDocument` and yields `context === undefined`. No subject, category, or level is invented for that document. If a context object contains non-string, empty, or unsupported keys, the sanitizer retains only valid non-empty strings among `subject`, `category`, and `level`; the malformed test proves `{ subject: 42, category: { nested: true }, level: "  ثانوي  " }` becomes `{ level: "ثانوي" }`.

## E. Test results

| Check | Result |
|---|---|
| `pnpm check` | PASS |
| `pnpm test -- --run` | PASS — 22 files / 114 tests |
| `pnpm build` | PASS |
| `git diff --check` | PASS |
| Existing Playwright suite | PASS — 20/20 Desktop and Mobile Chromium |
| Visual verification | PASS observed — Desktop 1280×720 and Mobile 390×844; no RTL/layout regression observed |

## F. Remaining limitations

The context fields are optional and remain bounded to the current local-first product. This fix does not add cloud synchronization, authentication, collaboration, multi-user identity, or a broader lesson schema. Real touch, stylus, screen-reader, full WCAG, and real-device performance remain NOT VERIFIED. Browser tests prove the existing automated journeys, while the deterministic unit tests prove the context serialization and migration behavior.

## Final status

The bounded persistence gap is addressed through the existing canonical document and transfer paths. No Gate, PR, merge, deployment, or production expansion was started.
