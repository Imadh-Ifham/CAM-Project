import StockModel, { IStockLot } from "../models/Stock.model";

export class StockService {
  async addLot(params: {
    campaignId: string;
    resourceId: string;
    quantity: number;
    collectionJobId?: string;
    resourceSnapshot?: { name?: string; unit?: string; category?: string };
  }): Promise<IStockLot> {
    const {
      campaignId,
      resourceId,
      quantity,
      collectionJobId,
      resourceSnapshot,
    } = params;
    const lot = await StockModel.create({
      campaignId,
      resourceId,
      quantity,
      consumedQty: 0,
      collectionJobId,
      resourceSnapshot,
      status: quantity > 0 ? "available" : "depleted",
    });
    return lot.toObject() as any;
  }

  async consumeFIFO(params: {
    campaignId: string;
    resourceId: string;
    qty: number;
    distributionJobId?: string;
  }): Promise<{
    consumed: number;
    remainingToConsume: number;
    lots: IStockLot[];
  }> {
    let remaining = Math.max(0, params.qty);
    const lots = await StockModel.find({
      campaignId: params.campaignId,
      resourceId: params.resourceId,
      status: { $ne: "depleted" },
    })
      .sort({ createdAt: 1 }) // FIFO: oldest first
      .exec();

    const updatedLots: IStockLot[] = [] as any;

    for (const lot of lots) {
      if (remaining <= 0) break;
      const free = Math.max(0, lot.quantity - lot.consumedQty);
      if (free <= 0) {
        if (lot.status !== "depleted") {
          lot.status = "depleted";
          await lot.save();
        }
        continue;
      }
      const consume = Math.min(free, remaining);
      lot.consumedQty += consume;
      if (params.distributionJobId)
        (lot as any).distributionJobIds = Array.isArray(
          (lot as any).distributionJobIds
        )
          ? ([
              ...(lot as any).distributionJobIds,
              params.distributionJobId,
            ] as any)
          : ([params.distributionJobId] as any);
      lot.status = lot.consumedQty >= lot.quantity ? "depleted" : "partial";
      await lot.save();
      updatedLots.push(lot.toObject() as any);
      remaining -= consume;
    }

    return {
      consumed: params.qty - remaining,
      remainingToConsume: remaining,
      lots: updatedLots,
    };
  }

  async getTotals(campaignId: string): Promise<
    Array<{
      resourceId: string;
      totalQuantity: number;
      totalConsumed: number;
      totalAvailable: number;
    }>
  > {
    const agg = await StockModel.aggregate([
      { $match: { campaignId } },
      {
        $group: {
          _id: "$resourceId",
          totalQuantity: { $sum: "$quantity" },
          totalConsumed: { $sum: "$consumedQty" },
        },
      },
      {
        $project: {
          resourceId: "$_id",
          totalQuantity: 1,
          totalConsumed: 1,
          totalAvailable: { $subtract: ["$totalQuantity", "$totalConsumed"] },
          _id: 0,
        },
      },
    ]);
    return agg as any;
  }
}

export default new StockService();
