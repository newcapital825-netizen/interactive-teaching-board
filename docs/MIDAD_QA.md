# MIDAD_QA — Latest QA Gate (Authoritative, Concise)

Detailed historical QA notes live in `docs/qa/*` and `docs/gates/*`. This file reflects only the latest gate result.

## Latest QA gate: Post-Milestone Visual QA Gate for `09ae531` (2026-08-30)

### Test counts
- `pnpm check`: PASS, 0 errors.
- `pnpm test` (Vitest): PASS, 132/132, 26 files.
- `pnpm build`: PASS.
- `pnpm exec playwright test`: PASS, 36/36 (18 desktop Chromium + 18 mobile Chromium).

### Visual QA results
| Area | Result |
|---|---|
| Visual Zoom In / Out | PASS |
| Keyboard Zoom (Ctrl+/Ctrl-/Ctrl+0) | PASS |
| Wheel Zoom (Ctrl+wheel) | PASS |
| Fit Content | PASS |
| REAL PAN (plain wheel, distinct from zoom) | PASS |
| Selection / Drag / Resize after zoom | PASS (no pointer-offset from transform) |
| RTL (direction, transform-origin, contextual-action positioning) | PASS |
| Student View (no canvas-viewport leak) | PASS |
| Presentation Mode (no canvas-viewport / toolbar leak) | PASS |
| Console (zero genuine defects) | PASS, with one investigated-and-cleared caveat (see Known defects) |

Evidence: 12 screenshots captured under a local scratch `qa-artifacts/` directory (not committed — see Known non-verified/tooling note below), covering normal/zoomed-in/zoomed-out/fit-content/object-interaction-after-zoom/mobile viewport states.

### Known defects
None caused by `09ae531`. Two anomalies were investigated via git-worktree A/B testing against pre-milestone commit `12b09b5` and both were conclusively ruled **pre-existing, not a regression**:
1. **RTL X-axis drag-direction quirk** — identical at `zoom=1` with no pan/zoom interaction, and identical in `12b09b5`. Carried forward as a Milestone A candidate (see `MIDAD_STATUS.md`), not fixed in this gate per the "QA gate, not development milestone" rule.
2. **"Unable to preventDefault inside passive event listener invocation"** console message — reproducible only via synthetic `dispatchEvent(WheelEvent)` in test scripts, never via real `page.mouse.wheel()` input; identical in `12b09b5`. Test-harness artifact, not a product defect.

### NOT VERIFIED items
- Native macOS Cmd+wheel / real trackpad pinch (Linux sandbox; the `event.metaKey` code path is shared with the verified `event.ctrlKey` path but was not independently exercised).
- Real touch/stylus/pen hardware input (Playwright touch emulation is not hardware evidence).
- Low-level CDP wheel-modifier simulation (`Input.dispatchMouseEvent` with Ctrl bitmask) was attempted and found inconclusive in this sandbox; abandoned in favor of the already-validated synthetic-dispatch method, which does correctly exercise the underlying `event.ctrlKey` branch.
- Duplicate / Group / Ungroup specifically re-tested *after* zoom (only Select/Drag/Resize were exercised post-zoom in this gate); these share the same `canvasInteraction.ts` functions already covered by the general Vitest/Playwright suite.

### Git disposition
No genuine regression found → **no code change, no new commit**. `09ae531` remains the verified milestone. `origin/main` unchanged at `ee646db`. The QA-gate's own scratch tooling (`qa-artifacts/` — Playwright driver scripts + screenshots) is intentionally left untracked in git, consistent with "no fix required → no commit."
