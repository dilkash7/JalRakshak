import { describe, it, expect } from "vitest";
import { toPublicReport } from "../../lib/serializer";

describe("Public Serializer Privacy Guarantees", () => {
  const fullInternalReport = {
    _id: "507f1f77bcf86cd799439011",
    __v: 0,
    reportId: "JR-8K3N9P2Q1V",
    category: "pipe_burst",
    description: "Major water line ruptured near subway station entrance.",
    location: {
      address: "123 Confidential Residence St",
      landmark: "Metro Station Exit 3",
      city: "New Delhi",
      postalCode: "110001",
      coordinates: { lat: 28.6139, lng: 77.209 },
    },
    severity: "high",
    status: "in_progress",
    reporter: {
      name: "Private Citizen Name",
      email: "citizen@private.com",
      phone: "+91 99999 88888",
      notifyByEmail: true,
    },
    photos: [
      {
        publicId: "photos/leak-1",
        url: "https://res.cloudinary.com/demo/image/upload/leak1.jpg",
        secureUrl: "https://res.cloudinary.com/demo/image/upload/leak1.jpg",
      },
    ],
    assignedTo: {
      userId: "staff_user_123",
      name: "Field Officer John",
      assignedAt: new Date(),
    },
    publicResolutionSummary: "Pipe clamped and pressurized.",
    internalNotes: [
      {
        author: "Supervisor",
        authorEmail: "supervisor@jalrakshak.org",
        note: "Classified internal note: contractor bill pending review.",
        createdAt: new Date(),
      },
    ],
    statusHistory: [
      {
        from: "none",
        to: "submitted",
        at: new Date(),
        by: "citizen",
        note: "Public submission note",
        isPublic: true,
      },
      {
        from: "submitted",
        to: "in_progress",
        at: new Date(),
        by: "staff_user_123",
        note: "Internal dispatch note that should stay hidden",
        isPublic: false,
      },
    ],
    idempotencyKey: "b8b8098e-4a6c-4e89-a2e6-7640f1a4e150",
    estimatedWaterSavedLitres: 5000,
    createdAt: new Date("2026-10-15T10:00:00Z"),
    updatedAt: new Date("2026-10-16T12:00:00Z"),
  };

  it("should never leak reporter personal details (name, email, phone)", () => {
    const publicData: any = toPublicReport(fullInternalReport);

    expect(publicData.reporter).toBeUndefined();
    expect(publicData.name).toBeUndefined();
    expect(publicData.email).toBeUndefined();
    expect(publicData.phone).toBeUndefined();
    expect(JSON.stringify(publicData)).not.toContain("Private Citizen Name");
    expect(JSON.stringify(publicData)).not.toContain("citizen@private.com");
    expect(JSON.stringify(publicData)).not.toContain("+91 99999 88888");
  });

  it("should never leak internal staff notes or staff assignments", () => {
    const publicData: any = toPublicReport(fullInternalReport);

    expect(publicData.internalNotes).toBeUndefined();
    expect(publicData.assignedTo).toBeUndefined();
    expect(JSON.stringify(publicData)).not.toContain("Classified internal note");
    expect(JSON.stringify(publicData)).not.toContain("Field Officer John");
    expect(JSON.stringify(publicData)).not.toContain("staff_user_123");
  });

  it("should never leak exact residential address or coordinates", () => {
    const publicData: any = toPublicReport(fullInternalReport);

    expect(publicData.address).toBeUndefined();
    expect(publicData.coordinates).toBeUndefined();
    expect(JSON.stringify(publicData)).not.toContain("123 Confidential Residence St");
    // Should show generalized area
    expect(publicData.generalArea).toBe("Metro Station Exit 3, New Delhi");
    expect(publicData.city).toBe("New Delhi");
  });

  it("should never leak database internals or idempotency keys", () => {
    const publicData: any = toPublicReport(fullInternalReport);

    expect(publicData._id).toBeUndefined();
    expect(publicData.__v).toBeUndefined();
    expect(publicData.idempotencyKey).toBeUndefined();
  });

  it("should retain public status information and resolution summary", () => {
    const publicData = toPublicReport(fullInternalReport);

    expect(publicData.reportId).toBe("JR-8K3N9P2Q1V");
    expect(publicData.category).toBe("pipe_burst");
    expect(publicData.status).toBe("in_progress");
    expect(publicData.publicResolutionSummary).toBe("Pipe clamped and pressurized.");
    expect(publicData.photos.length).toBe(1);
    expect(publicData.photos[0].url).toContain("res.cloudinary.com");
  });

  it("should serialize resolution proof photos and elapsed turnaround days", () => {
    const resolvedReport = {
      ...fullInternalReport,
      status: "resolved",
      resolvedAt: new Date("2026-10-17T10:00:00Z"), // 2 days after 2026-10-15
      resolutionPhotos: [
        {
          publicId: "proof/repaired-1",
          url: "https://example.com/proof1.jpg",
          secureUrl: "https://example.com/proof1.jpg",
        },
      ],
    };

    const publicData = toPublicReport(resolvedReport);
    expect(publicData.status).toBe("resolved");
    expect(publicData.resolvedAt).toBeDefined();
    expect(publicData.resolutionPhotos).toBeDefined();
    expect(publicData.resolutionPhotos?.length).toBe(1);
    expect(publicData.resolutionPhotos?.[0].url).toBe("https://example.com/proof1.jpg");
    expect(publicData.elapsedDays).toBe(2);
  });
});
