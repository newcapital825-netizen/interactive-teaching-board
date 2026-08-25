import { describe, expect, it } from "vitest";
import { resolveBoardCommand } from "@/lib/keyboardCommands";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const canvasSource = readFileSync(resolve(process.cwd(), "client/src/components/TeacherCanvas.tsx"), "utf8");
const productSource = readFileSync(resolve(process.cwd(), "client/src/components/TeacherProductShell.tsx"), "utf8");
const classroomSource = readFileSync(resolve(process.cwd(), "client/src/components/ClassroomLoopPanel.tsx"), "utf8");
const cssSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("Gate 14 accessibility and input contracts", () => {
  it("preserves text-editor keyboard behavior while resolving board shortcuts elsewhere", () => {
    const input = { tagName: "INPUT", closest: (selector: string) => selector.includes("input") ? {} as Element : null } as unknown as EventTarget;
    expect(resolveBoardCommand({ key: "ArrowLeft", target: input } as KeyboardEvent)).toBeNull();
    expect(resolveBoardCommand({ key: "s", ctrlKey: true, target: input } as KeyboardEvent)).toBeNull();
    const canvas = { closest: () => null } as unknown as EventTarget;
    expect(resolveBoardCommand({ key: "ArrowLeft", target: canvas } as KeyboardEvent)).toBe("moveLeft");
    expect(resolveBoardCommand({ key: "Delete", target: canvas } as KeyboardEvent)).toBe("delete");
  });

  it("exposes a DOM keyboard path for canvas selection and resizing", () => {
    expect(canvasSource).toContain("onKeyDown={(event) => selectKeyboard(event, item.id)}");
    expect(canvasSource).toContain("aria-pressed={safeSelection.ids.includes(item.id)}");
    expect(canvasSource).toContain("زيادة عرض العنصر");
    expect(canvasSource).toContain("تقليل ارتفاع العنصر");
  });

  it("exposes live status and reduced-motion safeguards", () => {
    expect(productSource).toContain('role="status" aria-live="polite"');
    expect(classroomSource).toContain('role="status" aria-live="polite"');
    expect(cssSource).toContain("button:focus-visible");
    expect(cssSource).toContain("prefers-reduced-motion: reduce");
  });
});
