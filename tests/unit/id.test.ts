import { describe, it, expect } from "vitest";
import { generateReportId, isValidReportId } from "../../lib/id";

describe("Report ID Generation & Validation", () => {
  it("should generate IDs starting with JR- followed by 10 unambiguous characters", () => {
    const id = generateReportId();
    expect(id).toMatch(/^JR-[2-9A-HJ-NP-Z]{10}$/);
    expect(id.length).toBe(13);
  });

  it("should not contain ambiguous characters (0, O, 1, I, l)", () => {
    for (let i = 0; i < 200; i++) {
      const id = generateReportId();
      expect(id).not.toMatch(/[01IOl]/);
    }
  });

  it("should produce unique IDs across 1,000 generations", () => {
    const set = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      const id = generateReportId();
      expect(set.has(id)).toBe(false);
      set.add(id);
    }
    expect(set.size).toBe(1000);
  });

  it("should validate correctly formatted report IDs", () => {
    expect(isValidReportId("JR-7K9M3X8P2W")).toBe(true);
    expect(isValidReportId("JR-2222222222")).toBe(true);
    expect(isValidReportId("JR-ZZZZZZZZZZ")).toBe(true);
  });

  it("should reject malformed or ambiguous report IDs", () => {
    expect(isValidReportId("JR-1234567890")).toBe(false); // contains 1 and 0
    expect(isValidReportId("JR-7K9M3X8P2")).toBe(false); // too short
    expect(isValidReportId("JR-7K9M3X8P2W99")).toBe(false); // too long
    expect(isValidReportId("7K9M3X8P2W")).toBe(false); // missing JR- prefix
    expect(isValidReportId("")).toBe(false);
  });
});
