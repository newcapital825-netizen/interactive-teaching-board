# Core Board Keyboard Shortcuts

## Command architecture

اختصارات لوحة المفاتيح تمر عبر المسار التالي: `Keyboard Shortcut → resolveBoardCommand → Board Action`. الدوال نفسها تُستخدم من شريط الأدوات؛ لا يحتوي مستمع لوحة المفاتيح على منطق domain مستقل. هذا يمنع اختلاف السلوك بين لوحة المفاتيح والأزرار.

## Matrix

| Action | Windows/Linux | macOS | Text editing | Expected result | Actual result / evidence |
|---|---|---|---|---|---|
| Undo | Ctrl+Z | Cmd+Z | Native editor behavior | Revert latest board operation | Resolver test passed; action calls `undo` |
| Redo | Ctrl+Y or Ctrl+Shift+Z | Cmd+Y or Cmd+Shift+Z | Native editor behavior | Restore reverted operation | Resolver test passed; action calls `redo` |
| Copy | Ctrl+C | Cmd+C | Native editor clipboard | Copy selected board objects only | Resolver test passed; text targets return null |
| Paste | Ctrl+V | Cmd+V | Native editor clipboard | Paste with new IDs and offset | Resolver test passed; action calls `pasteSelected` |
| Duplicate | Ctrl+D | Cmd+D | Native editor behavior | Duplicate selected object | Resolver test passed; action calls `duplicate` |
| Delete | Delete / Backspace | Delete / Backspace | Native editor deletion | Delete selected object | Resolver test passed; text targets return null |
| Select all | Ctrl+A | Cmd+A | Native editor select-all | Select all objects on active page | Resolver test passed; action selects active-page IDs |
| Save | Ctrl+S | Cmd+S | Native editor behavior | Persist board locally | Resolver test passed; action calls `save` |
| Presentation | Ctrl+P | Cmd+P | Native editor print behavior is not intercepted in text targets | Enter presentation mode | Resolver test passed; action sets presentation |
| Zoom in | Ctrl+= / Ctrl++ | Cmd+= / Cmd++ | Native editor behavior | Increase board zoom | Resolver test passed; action clamps to 1.5 |
| Zoom out | Ctrl+- | Cmd+- | Native editor behavior | Decrease board zoom | Resolver test passed; action clamps to 0.7 |
| Fit content | Ctrl+0 | Cmd+0 | Native editor behavior | Fit board content | Resolver test passed; action calls `fitContent` |
| Move | Arrow keys | Arrow keys | Native caret movement | Move selected object by 12px | Resolver maps arrows; text targets return null |

## Text-input safety

The resolver ignores targets matching `input`, `textarea`, `select`, `[contenteditable="true"]`, `[role="textbox"]`, or `[data-text-editor="true"]`. Therefore Ctrl/Cmd+A, Ctrl/Cmd+C/V, Delete/Backspace, arrows, and other shortcuts remain with the active editor when typing. The Core Board does not claim ownership of the browser clipboard while a text editor is active.

## Test evidence

`tests/keyboard-commands.test.ts` covers Ctrl and Meta parity, undo/redo, copy/paste, duplicate, select all, save, presentation, zoom, fit, Delete, arrows, and text-input safety. These are command resolver regression tests, not browser UI automation. Full teacher-workflow UI automation remains **NOT VERIFIED — RUNNER UNAVAILABLE**.
