import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStatusHistoryItem {
  from: string;
  to: string;
  at: Date;
  by: string;
  note?: string;
  isPublic?: boolean;
}

export interface IInternalNote {
  author: string;
  authorEmail?: string;
  note: string;
  createdAt: Date;
}

export interface IReport extends Document {
  reportId: string;
  category: string;
  description: string;
  location: {
    address: string;
    landmark?: string;
    city: string;
    state?: string;
    district?: string;
    taluk?: string;
    postalCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  severity: "low" | "medium" | "high" | "critical";
  status:
    | "submitted"
    | "under_review"
    | "investigating"
    | "repair_scheduled"
    | "in_progress"
    | "resolved"
    | "rejected";
  reporter?: {
    name?: string;
    email?: string;
    phone?: string;
    notifyByEmail?: boolean;
  };
  photos: Array<{
    publicId: string;
    url: string;
    secureUrl: string;
  }>;
  resolutionPhotos?: Array<{
    publicId: string;
    url: string;
    secureUrl: string;
  }>;
  assignedTo?: {
    userId: string;
    name: string;
    assignedAt: Date;
  };
  publicResolutionSummary?: string;
  resolvedAt?: Date;
  internalNotes: IInternalNote[];
  statusHistory: IStatusHistoryItem[];
  idempotencyKey?: string;
  estimatedWaterSavedLitres?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "pipe_burst",
        "street_leakage",
        "sewage_overflow",
        "meter_damage",
        "water_contamination",
        "valve_leak",
        "other",
      ],
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    location: {
      address: { type: String, required: true },
      landmark: { type: String },
      city: { type: String, required: true, index: true },
      state: { type: String },
      district: { type: String },
      taluk: { type: String, index: true },
      postalCode: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    severity: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "submitted",
        "under_review",
        "investigating",
        "repair_scheduled",
        "in_progress",
        "resolved",
        "rejected",
      ],
      default: "submitted",
      index: true,
    },
    reporter: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      notifyByEmail: { type: Boolean, default: false },
    },
    photos: [
      {
        publicId: { type: String, required: true },
        url: { type: String, required: true },
        secureUrl: { type: String, required: true },
      },
    ],
    resolutionPhotos: [
      {
        publicId: { type: String, required: true },
        url: { type: String, required: true },
        secureUrl: { type: String, required: true },
      },
    ],
    assignedTo: {
      userId: { type: String },
      name: { type: String },
      assignedAt: { type: Date },
    },
    publicResolutionSummary: { type: String },
    resolvedAt: { type: Date },
    internalNotes: [
      {
        author: { type: String, required: true },
        authorEmail: { type: String },
        note: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    statusHistory: [
      {
        from: { type: String, required: true },
        to: { type: String, required: true },
        at: { type: Date, default: Date.now },
        by: { type: String, required: true },
        note: { type: String },
        isPublic: { type: Boolean, default: true },
      },
    ],
    idempotencyKey: {
      type: String,
      sparse: true,
      index: true,
    },
    estimatedWaterSavedLitres: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient public sorting and filters
ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ "location.city": 1, status: 1 });

export const ReportModel: Model<IReport> =
  mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);
