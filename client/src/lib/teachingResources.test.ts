import { describe, expect, it } from "vitest";
import { resourcesForSubject, TEACHING_RESOURCES } from "./teachingResources";

describe("teaching resources", () => {
  it("keeps Arabic and mathematics references separate", () => {
    expect(resourcesForSubject("العربية").map((resource) => resource.id)).toContain("illinois-arabic-resources");
    expect(resourcesForSubject("الرياضيات").map((resource) => resource.id)).toContain("nsf-mathematics-resources");
    expect(TEACHING_RESOURCES.every((resource) => resource.verification === "مرجع خارجي — مراجعة المعلم مطلوبة")).toBe(true);
  });

  it("does not invent a resource for an unsupported subject", () => {
    expect(resourcesForSubject("العلوم")).toEqual([]);
  });
});
