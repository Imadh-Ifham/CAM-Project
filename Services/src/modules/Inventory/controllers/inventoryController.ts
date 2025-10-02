import { Request, Response } from "express";
import { InventoryService } from "../services/inventoryService";
import {
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
} from "../models/inventoryModel";

const inventoryService = new InventoryService();

export class InventoryController {
  // GET /api/inventory
  getAllItems = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category, status, search } = req.query;

      let items;

      // Filter by category if provided
      if (category && typeof category === "string") {
        items = await inventoryService.getItemsByCategory(category);
      }
      // Filter by status if provided
      else if (status && typeof status === "string") {
        items = await inventoryService.getItemsByStatus(status);
      }
      // Search if query provided
      else if (search && typeof search === "string") {
        items = await inventoryService.searchItems(search);
      }
      // Get all items
      else {
        items = await inventoryService.getAllItems();
      }

      res.status(200).json({
        success: true,
        message: "Inventory items retrieved successfully",
        data: items,
        count: items.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving inventory items",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  // GET /api/inventory/:id
  getItemById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const item = await inventoryService.getItemById(id);

      if (!item) {
        res.status(404).json({
          success: false,
          message: "Inventory item not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Inventory item retrieved successfully",
        data: item,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving inventory item",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  // POST /api/inventory
  createItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const createDto: CreateInventoryItemDto = req.body;

      // Basic validation
      if (
        !createDto.name ||
        !createDto.category ||
        !createDto.quantity ||
        !createDto.unit ||
        !createDto.location
      ) {
        res.status(400).json({
          success: false,
          message:
            "Missing required fields: name, category, quantity, unit, location",
        });
        return;
      }

      const newItem = await inventoryService.createItem(createDto);

      res.status(201).json({
        success: true,
        message: "Inventory item created successfully",
        data: newItem,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating inventory item",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  // PUT /api/inventory/:id
  updateItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateDto: UpdateInventoryItemDto = req.body;

      const updatedItem = await inventoryService.updateItem(id, updateDto);

      if (!updatedItem) {
        res.status(404).json({
          success: false,
          message: "Inventory item not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Inventory item updated successfully",
        data: updatedItem,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating inventory item",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  // DELETE /api/inventory/:id
  deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await inventoryService.deleteItem(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Inventory item not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Inventory item deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting inventory item",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  // PATCH /api/inventory/:id/quantity
  updateQuantity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (typeof quantity !== "number" || quantity < 0) {
        res.status(400).json({
          success: false,
          message: "Invalid quantity. Must be a non-negative number",
        });
        return;
      }

      const updatedItem = await inventoryService.updateQuantity(id, quantity);

      if (!updatedItem) {
        res.status(404).json({
          success: false,
          message: "Inventory item not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Item quantity updated successfully",
        data: updatedItem,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating item quantity",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  // GET /api/inventory/stats
  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await inventoryService.getInventoryStats();

      res.status(200).json({
        success: true,
        message: "Inventory statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving inventory statistics",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
