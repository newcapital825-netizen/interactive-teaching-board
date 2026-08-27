# Unified Smart Teaching Board Architecture

## Decision

Midad keeps one `BoardDocument` as the teacher's workspace and one lesson context attached to that document. `CoreObject` remains the board-facing representation, while the registered educational object contract remains the canonical source for capabilities, identity, provenance, and persistence. Subject intelligence is composed around the selected object; it is not a second board and not a second assessment path.

## Unified flow

```text
Teacher input
  → bounded recognition
  → canonical CoreObject / registered object
  → contextual actions
  → subject result or safe uncertainty
  → reusable explanation/activity object
  → classroom assessment and feedback
  → save / restore / presentation
```

Recognition is deliberately bounded. A controlled Arabic sentence, a simple supported equation, and a poetry-shaped input may be classified when the evidence is sufficient. When confidence is insufficient, the interface asks how the teacher wants to use the content rather than guessing. Recognition never silently changes teacher content.

## Canonical paths

| Concern | Canonical path | Current role |
|---|---|---|
| Board and pages | `client/src/lib/coreBoard.ts` | Owns `BoardDocument`, pages, objects, save/restore bridge, and generic manipulation. |
| Object definitions | `client/src/lib/objectRegistry.ts` | Owns registered types, capabilities, validation, render metadata, and object creation. |
| Educational contract | `client/src/lib/educationalObjects.ts` | Owns the framework-independent object shape and capability vocabulary. |
| Contextual actions | `client/src/lib/contextualActions.ts` | Owns teacher-facing action descriptors and activity conversion. |
| Canvas manipulation | `client/src/components/TeacherCanvas.tsx` | Owns direct selection, movement, resize, history, pages, and keyboard interaction. |
| Classroom lifecycle | `client/src/lib/classroomLoop.ts` | Owns object-to-activity orchestration, attempts, assessment, feedback, review, and retry. |
| Subject teaching slice | `client/src/lib/gate4bTeaching.ts` and subject toolkits | Owns bounded Arabic/Math teaching contracts and safe evidence boundaries. |
| Assistant | `server/educationalAssistant.ts` and `EducationalAssistantPanel.tsx` | Owns structured, provenance-aware, teacher-reviewed assistant output. |

## Product gap identified

The board already has a contextual strip, but most actions are descriptors that only emit a notice. Arabic, Mathematics, and Poetry panels also remain secondary collapsible panels. The transformation work therefore prioritizes a single contextual capability surface for selected content, while preserving those panels as detailed views rather than competing products.

The first bounded vertical slice will connect recognition and contextual actions to the existing canonical paths. It will not create a second registry, a second object factory, a second assessment model, or a general NLP/symbolic engine.

## Teacher-facing language

Internal names such as registry, lens, provenance, migration, and engine remain implementation concepts. The teacher sees labels such as `تحليل`, `إعراب`, `شرح`, `خريطة`, `تدريب`, `مصدر التحليل`, and `يحتاج إلى مراجعة المعلم`. Source and confidence information are shown progressively and in plain language.

## Safety boundaries

Deterministic results are preferred wherever the current bounded contracts can establish correctness. Generated or uncertain content is never presented as verified. Teacher edits and overrides remain distinguishable from system output. Student mode excludes teacher notes, hidden answers, internal source metadata, and implementation details.
