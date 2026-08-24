# Input Device Verification

## Current status

| Input path | Status | Reason |
|---|---|---|
| Touch | **NOT VERIFIED — HARDWARE UNAVAILABLE** | No physical touchscreen device was available in this environment |
| Stylus | **NOT VERIFIED — HARDWARE UNAVAILABLE** | No physical stylus and pressure-capable device were available |
| Desktop pointer simulation | **TESTED** | Responsive pointer events and visual evidence were checked in the browser preview |

## Required devices

Verification should be repeated on a large touch display or tablet with a current Chromium- or WebKit-based browser, plus a pressure-capable stylus for the stylus path. The exact device model, OS, browser version, viewport, and input type must be recorded at test time.

## Required scenarios

The tester should verify tap selection, drag movement, multi-select, pan, pinch or wheel zoom where supported, corner resize from all four handles, freehand drawing, erasing, selection after drawing, stylus stroke, stylus erase, and prevention of accidental gestures. The group sequence must also be checked as `Group → resize → save → reload → ungroup`.

## Expected results

Core actions should respond without requiring hover, selected objects should expose visible handles and focusable controls, minimum dimensions should prevent inversion, group children should retain IDs/styles/z-order after ungroup, and the saved document should restore the same page/object structure.

## Evidence template

| Field | Value |
|---|---|
| Device | Not run |
| OS | Not run |
| Browser | Not run |
| Input type | Not run |
| Result | Pending physical verification |

لا يجوز استخدام desktop simulation وحده كدليل على نجاح touch أو stylus. هذه الوثيقة تحفظ الحد الفاصل بين implementation support وhardware verification.
