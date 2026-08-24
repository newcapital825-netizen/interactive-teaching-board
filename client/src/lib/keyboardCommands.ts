/**
 * Gate 2 keyboard command layer.
 * Shortcuts resolve to action names; CoreBoard owns the actual board mutations.
 */
export type BoardCommand =
  | "undo"
  | "redo"
  | "copy"
  | "paste"
  | "duplicate"
  | "delete"
  | "selectAll"
  | "save"
  | "presentation"
  | "zoomIn"
  | "zoomOut"
  | "fitContent"
  | "moveLeft"
  | "moveRight"
  | "moveUp"
  | "moveDown";

const isTextEditingTarget = (target: EventTarget | null) => {
  const element = target as (EventTarget & { closest?: (selectors: string) => Element | null }) | null;
  return Boolean(element?.closest?.("input, textarea, select, [contenteditable='true'], [role='textbox'], [data-text-editor='true']"));
};

export const resolveBoardCommand = (event: KeyboardEvent): BoardCommand | null => {
  if (isTextEditingTarget(event.target)) return null;
  const key = event.key.toLowerCase();
  const mod = event.metaKey || event.ctrlKey;
  if (mod && key === "z") return event.shiftKey ? "redo" : "undo";
  if (mod && key === "y") return "redo";
  if (mod && key === "c") return "copy";
  if (mod && key === "v") return "paste";
  if (mod && key === "d") return "duplicate";
  if (mod && key === "a") return "selectAll";
  if (mod && key === "s") return "save";
  if (mod && key === "p") return "presentation";
  if (mod && (key === "+" || key === "=")) return "zoomIn";
  if (mod && (key === "-" || key === "_")) return "zoomOut";
  if (mod && key === "0") return "fitContent";
  if (event.key === "Delete" || event.key === "Backspace") return "delete";
  if (event.key === "ArrowLeft") return "moveLeft";
  if (event.key === "ArrowRight") return "moveRight";
  if (event.key === "ArrowUp") return "moveUp";
  if (event.key === "ArrowDown") return "moveDown";
  return null;
};
