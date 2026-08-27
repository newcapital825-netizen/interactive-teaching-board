# Midad (مِداد) — Product Release Validation Report

**Author:** Manus AI  
**Branch:** `feature/productization-v1`  
**Validation date:** 28 August 2026
**Status:** **PILOT CANDIDATE — HUMAN VALIDATION REQUIRED**

## Executive decision

The current productization slice is suitable for a controlled pilot candidate review, not for an unqualified release claim. The automated evidence is strong across the existing teacher workspace, classroom loop, Arabic and Mathematics bounded journeys, poetry safety, assistant grounding, persistence, import/export, responsive rendering, and fail-safe handling. No real teacher or student sessions were conducted in this environment, so **PILOT READY is not claimed**.

> The product is ready to be placed in front of the defined human acceptance group only after the owner records actual teacher and student sessions using the checklist. Hardware-specific and full accessibility claims remain unverified.

## Automated verification

| Area | Result | Evidence |
|---|---|---|
| TypeScript | **PROVEN** | `pnpm check` passed with zero TypeScript errors. |
| Vitest | **PROVEN** | 26 test files, 132 tests passed, including the conflicting-sources teacher-review hardening contract and the bounded `2x + 5 = 15` activity contract. |
| Production build | **PROVEN** | `pnpm build` completed successfully; Vite and server bundle both built. |
| Git diff check | **PROVEN** | `git diff --check` passed. |
| Playwright desktop Chromium | **PROVEN** | 18/18 passed, including unified input, Arabic, Mathematics, word map, poetry, and safe unsupported journeys. |
| Playwright mobile Chromium | **PROVEN** | 18/18 passed. |
| Visual verification | **PARTIALLY PROVEN** | Full-page screenshots captured at 1280×720 and 390×844; no obvious RTL layout collapse was observed. This is not a human design or device audit. |
| Real-device performance | **NOT VERIFIED** | Automated Chromium benchmark journeys passed, but no physical device or production network measurement was available. |

The Playwright suite covers the established canvas, save/restore, export/import, legacy document safety, accessibility pre-pilot surface, keyboard interactions, classroom loop, assistant review persistence, bounded poetry and sources, performance matrices, fail-safe persistence, the Arabic flow, and the unified-input coherence journey on desktop and mobile. The final run executed 36 test cases: 18 desktop and 18 mobile.

## Coherent educational journeys

### Arabic

The Arabic toolkit now uses the canonical `GrammarLens` and bounded `I3rab` vocabulary already present in the shared teaching contract. For supported controlled sentences, the teacher can write a sentence, request analysis, select a word, see its grammatical role, case marker, and explanation, then create a reading activity from the same teacher-owned source. The student answer is evaluated deterministically against the teacher-defined accepted answer. Unsupported sentences expose an explicit safe state and do not receive a fabricated grammatical analysis.

**Classification:** **PROVEN for the bounded controlled slice; PARTIALLY PROVEN for general Arabic.** General free-form Arabic parsing, full iʿrāb, curriculum coverage, and linguistic correctness beyond the controlled examples are not claimed.

### Mathematics

The bounded Mathematics journey supports equation entry for the two verified classroom equations (`2x + 3 = 11` and `2x + 5 = 15`), deterministic visualization, step-oriented assessment, substitution verification derived from the actual equation, alternative answer handling, teacher review, persistence, retry, and presentation through the canonical product pathways.

**Classification:** **PROVEN for the existing bounded examples; PARTIALLY PROVEN for general mathematics.** It is not a general symbolic mathematics engine.

### Poetry

The poetry toolkit remains deliberately bounded. It supports the existing literary and rhetorical prompts, provenance and teacher review boundaries, and refuses to claim meter when the current evidence is insufficient.

**Classification:** **PROVEN for bounded safety behavior; NOT PROVEN for general meter analysis.**

### Educational assistant

The assistant retains server-side structured responses, explicit intent, evidence class, verification state, provenance, uncertainty, source hierarchy, teacher review, correction, and fail-closed malformed-response handling. The product does not claim that every external educational source has been independently reconciled or that official curriculum approval has been established.

**Classification:** **PROVEN for contract and fail-closed behavior; PARTIALLY PROVEN for live-source conflict resolution and curriculum authority.**

## Product coherence evidence

The browser suite verifies the teacher-facing Arabic sequence, the unified input path, the bounded mathematics equation, the classroom lifecycle, and the final rendered DOM rather than only inspecting internal state. It asserts the canonical activity source, student attempt, deterministic assessment, teacher review, retry, context persistence, and presentation. The teacher preview now uses the ClassroomLoopPanel as the single response/feedback/retry path, while the technical Gate4B workspace is no longer exposed as a second teacher-facing board.

This closes the previously identified product gap in which the canonical Arabic teaching capability existed in the codebase but was not visible in the teacher-first toolkit surface. The current productization pass also adds a single bounded recognition path, a contextual action surface that keeps the source selected, reusable result objects for word map, I3rab, explanation, solution steps, and poetry, a teacher/student learning map that mirrors the existing classroom lifecycle, equation-aware activity feedback and retry, human-readable source labels, and a fail-closed rule that forces teacher review for conflicting or low-confidence assistant evidence.

## Implemented capabilities

The current product includes an RTL teacher workspace with lesson metadata, pages, canonical educational objects, one unified content entry point, bounded content recognition with low-confidence safe states, contextual actions, reusable educational result objects, a visible learning map, student preview, presentation mode, save/restore, export/import, legacy migration safety, a classroom activity loop, teacher review and override, bounded Arabic and Mathematics teaching slices, bounded poetry support, external resource registry metadata, and a grounded educational assistant with explicit evidence and uncertainty states.

Persistence remains context-isolated and local-first for the bounded assistant and lesson pathways. The implementation preserves one canonical object model, registry, capability system, and adapter architecture; this work did not introduce a second domain model or duplicate registry.

## Bounded capabilities and non-claims

| Capability | Current boundary |
|---|---|
| Arabic analysis | Controlled sentence examples only; unsupported text is not analyzed. |
| I3rab | Word-level bounded examples with explicit role, case, marker, and reason. |
| Mathematics | Two deterministic classroom equations with verified steps and substitution; not general symbolic algebra. |
| Poetry meter | No claim outside reliably supported cases. |
| AI sources | Source hierarchy and provenance are surfaced; live conflict resolution is not fully proven. |
| Accessibility | Automated keyboard/RTL surface checks exist; full WCAG and screen-reader audit is not verified. |
| Input hardware | Touch and stylus hardware were unavailable. |
| Human acceptance | No real teacher/student sessions occurred in this environment. |

## Remaining risks and owner acceptance journeys

The owner should run the real human protocol with three teachers and five students using anonymous, non-personal identifiers. Each teacher should create a lesson, enter an Arabic sentence, request analysis, create an activity, open student preview, review an answer, apply an override, save, reload, and present the lesson. Each student should open the activity, read the instructions, answer, submit, read feedback, and retry. The same group should exercise the Mathematics journey and at least one bounded poetry or resource-review case where relevant.

During those sessions, record completion, assistance required, confusion point, failure, effort impression, and user comment. Do not convert an automated pass into a human result. After collection, classify observed issues as BLOCKER, HIGH, MEDIUM, LOW, or COSMETIC and update `docs/pilot/HUMAN_PILOT_RESULTS.md`.

The principal remaining risks are free-form language coverage, the absence of live human evidence, official curriculum validation, physical input behavior, full screen-reader behavior, and production-device performance. These are explicit acceptance items rather than silently inferred successes.

## Final classification

**PILOT CANDIDATE — HUMAN VALIDATION REQUIRED**

No Gate 17 or later work is started by this report. `main` is not modified, no pull request is opened, and no merge or deployment is performed.
