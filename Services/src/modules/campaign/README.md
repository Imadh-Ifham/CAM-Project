# Campaign Service API Documentation

This document describes the Campaign service implementation for creating campaigns in the MongoDB database using the CampaignFormData type.

## Overview

The Campaign service provides a complete CRUD API for managing campaigns with the following components:

- **Model**: MongoDB schema with validation
- **Service**: Business logic layer
- **Controller**: HTTP request/response handling
- **Routes**: Express route definitions
- **Validation**: Request validation middleware

## API Endpoints

### Base URL: `/api/campaigns`

### 1. Create Campaign

**POST** `/api/campaigns`

Creates a new campaign with the provided data.

**Request Body:**

```json
{
  "name": "Flood Relief - Colombo",
  "description": "Emergency flood relief operation providing immediate assistance to affected families in Colombo district.",
  "type": "disaster-relief",
  "priority": "critical",
  "district": "Colombo",
  "city": "Colombo",
  "resources": [
    {
      "id": "res-001",
      "name": "Food Packets",
      "category": "food",
      "quantity": 1000,
      "unit": "packets",
      "estimatedCost": 50000,
      "description": "Emergency food packets for affected families"
    }
  ],
  "estimatedBudget": 150000,
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-02-15T00:00:00.000Z",
  "isUrgent": true,
  "expectedDuration": 31,
  "assignedAgents": ["agent-001", "agent-002"],
  "requiredVolunteers": 50,
  "skillsRequired": ["Emergency Response", "Medical Aid"],
  "coordinator": {
    "name": "Dr. Saman Perera",
    "phone": "+94 77 123 4567",
    "email": "saman.perera@cam.lk"
  }
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Campaign created successfully",
  "data": {
    "campaign": {
      /* Campaign object */
    },
    "campaignID": "DIS-123456"
  }
}
```

### 2. Get Campaign by ID

**GET** `/api/campaigns/:campaignId`

Retrieves a specific campaign by its ID.

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Campaign retrieved successfully",
  "data": {
    /* Campaign object */
  }
}
```

### 3. Get Campaigns (with filtering and pagination)

**GET** `/api/campaigns`

Retrieves campaigns with optional filters and pagination.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `sortBy` (string): Field to sort by (default: 'createdAt')
- `sortOrder` (string): 'asc' or 'desc' (default: 'desc')
- `status` (string): Filter by status
- `type` (string): Filter by campaign type
- `priority` (string): Filter by priority
- `district` (string): Filter by district
- `city` (string): Filter by city
- `isUrgent` (boolean): Filter by urgency
- `startFrom` (ISO date): Filter campaigns starting from this date
- `endTo` (ISO date): Filter campaigns ending before this date
- `myOnly` (boolean): Show only campaigns created by current user

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Campaigns retrieved successfully",
  "data": [
    /* Array of campaign objects */
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 47,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 4. Update Campaign Status

**PATCH** `/api/campaigns/:campaignId/status`

Updates the status of a specific campaign.

**Request Body:**

```json
{
  "status": "active"
}
```

Valid statuses: `draft`, `active`, `paused`, `completed`, `cancelled`

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Campaign status updated successfully",
  "data": {
    /* Updated campaign object */
  }
}
```

### 5. Delete Campaign (Soft Delete)

**DELETE** `/api/campaigns/:campaignId`

Soft deletes a campaign by setting its status to 'cancelled'.

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Campaign deleted successfully"
}
```

### 6. Get Campaign Statistics

**GET** `/api/campaigns/stats`

Retrieves campaign statistics.

**Query Parameters:**

- `myOnly` (boolean): Show statistics for current user's campaigns only

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Campaign statistics retrieved successfully",
  "data": {
    "totalCampaigns": 47,
    "activeCampaigns": 23,
    "completedCampaigns": 18,
    "urgentCampaigns": 5,
    "totalBudget": 2500000,
    "totalSpent": 1800000,
    "totalVolunteersNeeded": 750,
    "totalVolunteersAssigned": 580
  }
}
```

## Data Models

### Campaign Schema

The MongoDB schema includes the following fields:

- `campaignID`: Unique identifier (auto-generated)
- `name`: Campaign name (3-200 characters)
- `description`: Campaign description (10-2000 characters)
- `type`: Campaign type (enum)
- `status`: Campaign status (default: 'draft')
- `priority`: Priority level (enum)
- `district`, `city`: Location information
- `resources`: Array of resource objects
- `estimatedBudget`, `spent`: Budget information
- `startDate`, `endDate`: Campaign timeline
- `isUrgent`: Urgency flag
- `expectedDuration`: Duration in days
- `assignedAgents`: Array of agent IDs
- `requiredVolunteers`, `volunteers`: Volunteer counts
- `skillsRequired`: Array of required skills
- `coordinator`: Coordinator information
- `progress`: Progress percentage (0-100)
- `createdBy`, `updatedBy`: Audit fields
- `createdAt`, `updatedAt`: Timestamps

### Validation Rules

- All required fields must be provided
- Dates must be valid ISO format
- End date must be after start date
- Email addresses must be valid format
- Phone numbers must be valid international format
- Budget values cannot be negative
- Resource quantities must be positive numbers

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)",
  "errors": ["Array of validation errors (if applicable)"]
}
```

## Setup Instructions

1. Install dependencies: `npm install mongoose express`
2. Connect to MongoDB database
3. Import and register the campaign routes in your main app
4. Add authentication middleware (commented out in routes)
5. Configure role-based authorization if needed

## Usage Example

```typescript
import express from "express";
import campaignRoutes from "./modules/campaign/routes/campaign.routes";

const app = express();

// Register campaign routes
app.use("/api/campaigns", campaignRoutes);
```

## Security Considerations

- Authentication middleware should be implemented and uncommented
- Role-based authorization should be configured
- Input validation is implemented for all endpoints
- MongoDB injection protection through Mongoose
- Sensitive data should be handled according to privacy requirements
