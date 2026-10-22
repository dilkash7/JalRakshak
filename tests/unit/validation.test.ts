import { describe, it, expect } from "vitest";
import { CreateReportSchema, UpdateReportStatusSchema } from "../../lib/validation";

describe("Input Validation (Zod Schemas)", () => {
  it("should accept valid report payload", () => {
    const valid = {
      category: "street_leakage",
      description: "Water has been leaking profusely from the sidewalk joint for over 2 days.",
      location: {
        address: "24 Park Avenue",
        city: "Bengaluru",
        landmark: "Next to Metro pillar 45",
      },
      severity: "medium",
      photos: [],
    };

    const res = CreateReportSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("should reject description that is too short", () => {
    const invalid = {
      category: "pipe_burst",
      description: "Leak here", // less than 10 chars
      location: {
        address: "123 Main St",
        city: "Delhi",
      },
    };

    const res = CreateReportSchema.safeParse(invalid);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toContain("at least 10 characters");
    }
  });

  it("should reject invalid category", () => {
    const invalid = {
      category: "alien_invasion",
      description: "Extremely long description of something that is not water leak.",
      location: {
        address: "123 Main St",
        city: "Delhi",
      },
    };

    const res = CreateReportSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("should validate status update payload", () => {
    const valid = {
      status: "resolved",
      publicResolutionSummary: "Repaired pipeline and restored pressure.",
      estimatedWaterSavedLitres: 3500,
    };

    const res = UpdateReportStatusSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });
});
