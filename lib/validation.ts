import { z } from "zod";

export const LeakCategoryEnum = z.enum([
  "pipe_burst",
  "street_leakage",
  "sewage_overflow",
  "meter_damage",
  "water_contamination",
  "valve_leak",
  "other",
]);

export const SeverityEnum = z.enum(["low", "medium", "high", "critical"]);

export const ReportStatusEnum = z.enum([
  "submitted",
  "under_review",
  "investigating",
  "repair_scheduled",
  "in_progress",
  "resolved",
  "rejected",
]);

export const RoleEnum = z.enum(["admin", "staff"]);

// Schema for public report submission
export const CreateReportSchema = z.object({
  category: LeakCategoryEnum,
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be under 2000 characters"),
  location: z.object({
    address: z.string().min(3, "Address is required").max(300),
    landmark: z.string().max(200).optional(),
    city: z.string().min(2, "City is required").max(100),
    state: z.string().max(100).optional(),
    district: z.string().max(100).optional(),
    taluk: z.string().max(100).optional(),
    postalCode: z.string().max(20).optional(),
    coordinates: z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      })
      .optional(),
  }),
  severity: SeverityEnum.default("medium"),
  reporter: z
    .object({
      name: z.string().max(100).optional(),
      email: z.string().email("Invalid email address").optional().or(z.literal("")),
      phone: z.string().max(20).optional().or(z.literal("")),
      notifyByEmail: z.boolean().default(false),
    })
    .optional(),
  photos: z
    .array(
      z.object({
        publicId: z.string(),
        url: z.string().url(),
        secureUrl: z.string().url(),
      })
    )
    .max(5, "Maximum 5 photos allowed")
    .default([]),
  idempotencyKey: z.string().uuid("Invalid idempotency key").optional(),
});

export type CreateReportInput = z.infer<typeof CreateReportSchema>;

// Schema for updating report status by admin
export const UpdateReportStatusSchema = z.object({
  status: ReportStatusEnum,
  note: z.string().max(500).optional(),
  publicResolutionSummary: z.string().max(1000).optional(),
  assignedTo: z
    .object({
      userId: z.string(),
      name: z.string(),
    })
    .optional(),
  resolutionPhotos: z
    .array(
      z.object({
        publicId: z.string(),
        url: z.string(),
        secureUrl: z.string(),
      })
    )
    .max(5)
    .optional(),
  resolvedAt: z.string().or(z.date()).optional(),
  estimatedWaterSavedLitres: z.number().min(0).optional(),
});

export type UpdateReportStatusInput = z.infer<typeof UpdateReportStatusSchema>;

// Schema for adding internal note by admin
export const AddInternalNoteSchema = z.object({
  note: z.string().min(2, "Note cannot be empty").max(1000),
});

// Schema for admin & staff authentication
export const AdminLoginSchema = z.object({
  email: z.string().min(1, "Email or Staff Badge ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;

// Schema for staff creation / management
export const CreateStaffSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .default("JalRakshak@2026Staff!"),
  staffId: z.string().min(2, "Staff ID is required").max(50),
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),
  taluk: z.string().min(2, "Taluk is required"),
});

export type CreateStaffInput = z.infer<typeof CreateStaffSchema>;
