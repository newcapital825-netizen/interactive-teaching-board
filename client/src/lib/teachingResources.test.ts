import { describe, expect, it } from "vitest";
import { resourcesForSubject, sourceTierLabel, TEACHING_RESOURCES } from "./teachingResources";

describe("teaching resources", () => {
  it("keeps Arabic and mathematics references separate", () => {
    expect(resourcesForSubject("العربية").map((resource) => resource.id)).toContain("illinois-arabic-resources");
    expect(resourcesForSubject("الرياضيات").map((resource) => resource.id)).toContain("nsf-mathematics-resources");
    expect(TEACHING_RESOURCES.every((resource) => resource.verification === "مرجع خارجي — مراجعة المعلم مطلوبة")).toBe(true);
  });

  it("exposes an honest source hierarchy without claiming curriculum verification", () => {
    expect(TEACHING_RESOURCES.every((resource) => resource.tier === 2)).toBe(true);
    expect(TEACHING_RESOURCES.every((resource) => resource.curriculumRelationship === "مرجع أكاديمي عام")).toBe(true);
    expect(TEACHING_RESOURCES.every((resource) => resource.freshness === "تاريخ المراجعة غير متاح")).toBe(true);
    expect(sourceTierLabel(2)).toContain("جامعة أو مؤسسة أكاديمية");
  });

  it("does not invent a resource for an unsupported subject", () => {
    expect(resourcesForSubject("العلوم")).toEqual([]);
  });
});
