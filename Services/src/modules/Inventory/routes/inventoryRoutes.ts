import { Router } from "express";
import { InventoryController } from "../controllers/inventoryController";

const router = Router();
const inventoryController = new InventoryController();

// GET /api/inventory/stats - Get inventory statistics
router.get("/stats", inventoryController.getStats);

// GET /api/inventory - Get all inventory items (with optional filters)
router.get("/", inventoryController.getAllItems);

// GET /api/inventory/:id - Get specific inventory item
router.get("/:id", inventoryController.getItemById);

// POST /api/inventory - Create new inventory item
router.post("/", inventoryController.createItem);

// PUT /api/inventory/:id - Update inventory item
router.put("/:id", inventoryController.updateItem);

// PATCH /api/inventory/:id/quantity - Update item quantity
router.patch("/:id/quantity", inventoryController.updateQuantity);

// DELETE /api/inventory/:id - Delete inventory item
router.delete("/:id", inventoryController.deleteItem);

export default router;
