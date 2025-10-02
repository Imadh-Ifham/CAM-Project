import {
  InventoryItem,
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  InventoryModel,
  InventoryDocument,
} from "../models/inventoryModel";

export class InventoryService {
  // Get all inventory items
  async getAllItems(): Promise<InventoryDocument[]> {
    try {
      return await InventoryModel.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching inventory items: ${error}`);
    }
  }

  // Get inventory item by ID
  async getItemById(id: string): Promise<InventoryDocument | null> {
    try {
      return await InventoryModel.findById(id);
    } catch (error) {
      throw new Error(`Error fetching inventory item: ${error}`);
    }
  }

  // Get items by category
  async getItemsByCategory(category: string): Promise<InventoryDocument[]> {
    try {
      return await InventoryModel.find({ category }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching items by category: ${error}`);
    }
  }

  // Get items by status
  async getItemsByStatus(status: string): Promise<InventoryDocument[]> {
    try {
      return await InventoryModel.find({ status }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching items by status: ${error}`);
    }
  }

  // Create new inventory item
  async createItem(
    createDto: CreateInventoryItemDto
  ): Promise<InventoryDocument> {
    try {
      const newItem = new InventoryModel({
        ...createDto,
        status: "available",
      });

      return await newItem.save();
    } catch (error) {
      throw new Error(`Error creating inventory item: ${error}`);
    }
  }

  // Update inventory item
  async updateItem(
    id: string,
    updateDto: UpdateInventoryItemDto
  ): Promise<InventoryDocument | null> {
    try {
      return await InventoryModel.findByIdAndUpdate(id, updateDto, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error(`Error updating inventory item: ${error}`);
    }
  }

  // Delete inventory item
  async deleteItem(id: string): Promise<boolean> {
    try {
      const result = await InventoryModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new Error(`Error deleting inventory item: ${error}`);
    }
  }

  // Update item quantity (for distribution)
  async updateQuantity(
    id: string,
    newQuantity: number
  ): Promise<InventoryDocument | null> {
    try {
      const item = await InventoryModel.findById(id);

      if (!item) {
        return null;
      }

      item.quantity = newQuantity;

      // Auto-update status based on quantity
      if (newQuantity === 0) {
        item.status = "distributed";
      } else if (item.status === "distributed" && newQuantity > 0) {
        item.status = "available";
      }

      return await item.save();
    } catch (error) {
      throw new Error(`Error updating item quantity: ${error}`);
    }
  }

  // Get inventory statistics
  async getInventoryStats() {
    try {
      const totalItems = await InventoryModel.countDocuments();
      const availableItems = await InventoryModel.countDocuments({
        status: "available",
      });
      const distributedItems = await InventoryModel.countDocuments({
        status: "distributed",
      });
      const expiredItems = await InventoryModel.countDocuments({
        status: "expired",
      });

      const categoryStats = await InventoryModel.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
      ]);

      const categoryStatsObj = categoryStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalItems,
        availableItems,
        distributedItems,
        expiredItems,
        categoryStats: categoryStatsObj,
      };
    } catch (error) {
      throw new Error(`Error fetching inventory statistics: ${error}`);
    }
  }

  // Search items by name or description
  async searchItems(query: string): Promise<InventoryDocument[]> {
    try {
      return await InventoryModel.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { tags: { $in: [new RegExp(query, "i")] } },
        ],
      }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error searching inventory items: ${error}`);
    }
  }

  // Initialize dummy data (call this once to populate the database)
  async initializeDummyData(): Promise<void> {
    try {
      const count = await InventoryModel.countDocuments();
      if (count === 0) {
        const dummyItems = [
          {
            name: "Rice Bags",
            category: "food",
            quantity: 50,
            unit: "kg",
            location: "Colombo Warehouse",
            donatedBy: "ABC Foundation",
            donationDate: new Date("2024-01-15"),
            expiryDate: new Date("2024-06-15"),
            status: "available",
            description: "High quality rice for families in need",
            tags: ["staple", "family-pack"],
          },
          {
            name: "Winter Jackets",
            category: "clothing",
            quantity: 25,
            unit: "pieces",
            location: "Kandy Distribution Center",
            donatedBy: "Fashion for Good",
            donationDate: new Date("2024-02-01"),
            status: "available",
            description: "Warm winter jackets for children and adults",
            tags: ["winter", "outerwear"],
          },
          {
            name: "First Aid Kits",
            category: "medical",
            quantity: 15,
            unit: "boxes",
            location: "Galle Medical Center",
            donatedBy: "Healthcare Heroes",
            donationDate: new Date("2024-01-20"),
            expiryDate: new Date("2025-01-20"),
            status: "available",
            description: "Complete first aid kits for emergency situations",
            tags: ["emergency", "medical"],
          },
        ];

        await InventoryModel.insertMany(dummyItems);
        console.log("Dummy inventory data initialized");
      }
    } catch (error) {
      console.error("Error initializing dummy data:", error);
    }
  }
}
