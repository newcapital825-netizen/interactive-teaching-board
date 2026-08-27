# UI Reference Notes — tldraw and Excalidraw

## Reviewed sources

- [tldraw repository](https://github.com/tldraw/tldraw)
- [Excalidraw repository](https://github.com/excalidraw/excalidraw)

## Applicable visual principles

| Reference | Observed principle | Midad adaptation | Explicitly not copied |
|---|---|---|---|
| tldraw | Infinite-canvas framing, extensible UI components, custom tools and shapes, broad touch/mobile support | Give the board the visual priority, keep controls compact and contextual, preserve existing canonical object model | No tldraw dependency, engine, licensing model, or architecture change |
| Excalidraw | Minimal canvas editor, focused tool set, customizable UI, export/local-first affordances, clear separation between canvas and controls | Reduce surrounding chrome, use calm floating controls, keep export/save actions compact and discoverable | No Excalidraw dependency, data format, or editor replacement |

## Design decisions for this refactor

The product should open with the board as the visual hero rather than a dense dashboard. Teacher metadata and persistence actions remain available but visually recede into a slim top rail. Contextual actions remain the existing canonical actions and test IDs; only their presentation changes into a floating pill attached to the selected object region. Arabic typography uses readable line-height, strong hierarchy, warm paper background, deep ink text, and restrained olive/terracotta accents. Student and presentation modes reuse the same visual language instead of introducing a second shell.

The refactor is UI-only. Existing backend contracts, domain objects, recognition, ClassroomLoop, assistant logic, test selectors, and data flow remain unchanged unless a selector-preserving presentation wrapper is required.

## References

[1]: https://github.com/tldraw/tldraw "tldraw repository"
[2]: https://github.com/excalidraw/excalidraw "Excalidraw repository"
