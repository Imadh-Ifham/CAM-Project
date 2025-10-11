import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Interface for Campaign Resource
interface ICampaignResource {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  description?: string;
}

// Interface for Campaign Document
export interface ICampaign extends Document {
  campaignID: string;
  name: string;
  description: string;
  type:
    | "disaster-relief"
    | "medical-aid"
    | "education"
    | "food-distribution"
    | "emergency-response";
  status: "draft" | "active" | "paused" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";

  // Location
  district: string;
  city: string;
  location: string; // Combined district, city for display

  // Resources
  resources: ICampaignResource[];
  estimatedBudget: number;
  actualBudget?: number;
  spent: number;

  // Schedule
  startDate: Date;
  endDate: Date;
  isUrgent: boolean;
  expectedDuration: number; // in days

  // Team
  requestedAgent: string[]; // Agent ID
  assignedAgents: mongoose.Types.ObjectId[]; // ✅ Added - actual assigned agents
  assignedVolunteers: mongoose.Types.ObjectId[]; // ✅ Added - actual assigned volunteers
  requiredVolunteers: number;
  volunteers: number; // Current volunteer count
  skillsRequired: string[];

  // Coordinator (will be set from assigned agents or admin)
  coordinator: {
    name: string;
    phone: string;
    email: string;
    isAssigned: boolean;
  };

  // Progress tracking
  progress: number; // 0-100

  // Audit fields
  createdAt: Date;
  updatedAt: Date;
}

// Resource Schema
const CampaignResourceSchema = new Schema<ICampaignResource>({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: [true, "Resource name is required"],
    trim: true,
    maxlength: [100, "Resource name cannot exceed 100 characters"],
  },
  category: {
    type: String,
    required: [true, "Resource category is required"],
    trim: true,
    enum: {
      values: [
        "food",
        "water",
        "medical",
        "shelter",
        "clothing",
        "equipment",
        "transport",
        "other",
      ],
      message: "Invalid resource category",
    },
  },
  quantity: {
    type: Number,
    required: [true, "Resource quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  unit: {
    type: String,
    required: [true, "Resource unit is required"],
    trim: true,
    maxlength: [20, "Unit cannot exceed 20 characters"],
  },
  estimatedCost: {
    type: Number,
    required: [true, "Estimated cost is required"],
    min: [0, "Cost cannot be negative"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
});

// Main Campaign Schema
const CampaignSchema = new Schema<ICampaign>(
  {
    campaignID: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: uuidv4, // Auto-generate UUID
    },
    name: {
      type: String,
      required: [true, "Campaign name is required"],
      trim: true,
      minlength: [3, "Campaign name must be at least 3 characters"],
      maxlength: [200, "Campaign name cannot exceed 200 characters"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Campaign description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    type: {
      type: String,
      required: [true, "Campaign type is required"],
      enum: {
        values: [
          "disaster-relief",
          "medical-aid",
          "education",
          "food-distribution",
          "emergency-response",
        ],
        message: "Invalid campaign type",
      },
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["draft", "active", "paused", "completed", "cancelled"],
        message: "Invalid campaign status",
      },
      default: "draft",
      index: true,
    },
    priority: {
      type: String,
      required: [true, "Campaign priority is required"],
      enum: {
        values: ["low", "medium", "high", "critical"],
        message: "Invalid priority level",
      },
      index: true,
    },

    // Location
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
      maxlength: [50, "District name cannot exceed 50 characters"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: [50, "City name cannot exceed 50 characters"],
    },
    location: {
      type: String,
      index: true,
    },

    // Resources
    resources: {
      type: [CampaignResourceSchema],
      default: [],
    },
    estimatedBudget: {
      type: Number,
      required: [true, "Estimated budget is required"],
      min: [0, "Budget cannot be negative"],
    },
    actualBudget: {
      type: Number,
      min: [0, "Actual budget cannot be negative"],
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, "Spent amount cannot be negative"],
    },

    // Schedule
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      index: true,
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (this: ICampaign, endDate: Date) {
          return endDate > this.startDate;
        },
        message: "End date must be after start date",
      },
      index: true,
    },
    isUrgent: {
      type: Boolean,
      default: false,
      index: true,
    },
    expectedDuration: {
      type: Number,
      required: [true, "Expected duration is required"],
      min: [1, "Duration must be at least 1 day"],
    },

    // Team
    requestedAgent: [
      {
        type: String,
        ref: "Agent", // Reference to Agent model
      },
    ],
    assignedAgents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Agent", // Reference to Agent model
      },
    ],
    assignedVolunteers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Volunteer", // Reference to Volunteer model
      },
    ],
    requiredVolunteers: {
      type: Number,
      required: [true, "Required volunteers count is required"],
      min: [1, "At least 1 volunteer is required"],
    },
    volunteers: {
      type: Number,
      default: 0,
      min: [0, "Volunteer count cannot be negative"],
    },
    skillsRequired: [
      {
        type: String,
        trim: true,
        maxlength: [50, "Skill name cannot exceed 50 characters"],
      },
    ],

    // Coordinator
    coordinator: {
      name: {
        type: String,
        trim: true,
        maxlength: [100, "Coordinator name cannot exceed 100 characters"],
      },
      phone: {
        type: String,
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"],
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Invalid email format",
        ],
      },
      isAssigned: {
        type: Boolean,
        default: false,
      },
    },

    // Progress tracking
    progress: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be negative"],
      max: [100, "Progress cannot exceed 100%"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
CampaignSchema.index({ status: 1, priority: 1 });
CampaignSchema.index({ startDate: 1, endDate: 1 });
CampaignSchema.index({ district: 1, city: 1 });
CampaignSchema.index({ type: 1, status: 1 });
CampaignSchema.index({ createdBy: 1 });
CampaignSchema.index({ "coordinator.email": 1 });

// Virtual for calculating days remaining
CampaignSchema.virtual("daysRemaining").get(function (this: ICampaign) {
  const now = new Date();
  const diffTime = this.endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Virtual for calculating budget utilization percentage
CampaignSchema.virtual("budgetUtilization").get(function (this: ICampaign) {
  if (this.estimatedBudget === 0) return 0;
  return Math.round((this.spent / this.estimatedBudget) * 100);
});

// Pre-save middleware to set location and targetVolunteers
CampaignSchema.pre("save", function (this: ICampaign, next) {
  // Set combined location
  this.location = `${this.city}, ${this.district}`;

  // Generate campaignID if not provided
  if (!this.campaignID) {
    const prefix = this.type.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().substring(-6);
    this.campaignID = `${prefix}-${timestamp}`;
  }

  next();
});

// Export the model
export const Campaign = mongoose.model<ICampaign>("Campaign", CampaignSchema);
export default Campaign;
