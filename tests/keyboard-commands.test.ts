import { describe, expect, it } from "vitest";
import { resolveBoardCommand } from "../client/src/lib/keyboardCommands";

const key = (value: string, options: Partial<KeyboardEventInit> = {}) => ({ key: value, ...options } as KeyboardEvent);

describe("Gate 2 keyboard commands", () => {
  it("maps Ctrl and Meta shortcuts to the same commands", () => {
    expect(resolveBoardCommand(key("z", { ctrlKey: true }))).toBe("undo");
    expect(resolveBoardCommand(key("z", { metaKey: true, shiftKey: true }))).toBe("redo");
    expect(resolveBoardCommand(key("c", { ctrlKey: true }))).toBe("copy");
    expect(resolveBoardCommand(key("v", { metaKey: true }))).toBe("paste");
    expect(resolveBoardCommand(key("d", { ctrlKey: true }))).toBe("duplicate");
    expect(resolveBoardCommand(key("a", { metaKey: true }))).toBe("selectAll");
    expect(resolveBoardCommand(key("s", { ctrlKey: true }))).toBe("save");
    expect(resolveBoardCommand(key("p", { metaKey: true }))).toBe("presentation");
    expect(resolveBoardCommand(key("0", { ctrlKey: true }))).toBe("fitContent");
  });

  it("supports navigation and zoom commands", () => {
    expect(resolveBoardCommand(key("Delete"))).toBe("delete");
    expect(resolveBoardCommand(key("ArrowLeft"))).toBe("moveLeft");
    expect(resolveBoardCommand(key("ArrowDown"))).toBe("moveDown");
    expect(resolveBoardCommand(key("+", { ctrlKey: true }))).toBe("zoomIn");
    expect(resolveBoardCommand(key("-", { metaKey: true }))).toBe("zoomOut");
  });

  it("leaves text editing shortcuts to the native editor", () => {
    const textInputTarget = { closest: () => ({}) } as unknown as EventTarget;
    expect(resolveBoardCommand(key("a", { ctrlKey: true, target: textInputTarget }))).toBeNull();
    expect(resolveBoardCommand(key("c", { metaKey: true, target: textInputTarget }))).toBeNull();
    expect(resolveBoardCommand(key("Delete", { target: textInputTarget }))).toBeNull();
  });
});
