// ===================================================================
// FILE: src/lib/inventoryAI.ts
// AI-Powered Inventory Intelligence System
// ===================================================================
import { InventoryItem } from './firebaseCollections';
import { addDays } from 'date-fns';

export interface UsagePrediction {
  itemId: string;
  itemName: string;
  predictedUsage: number;
  confidence: number; // 0-100
  trend: 'increasing' | 'stable' | 'decreasing';
  seasonalFactor: number;
  eventImpact?: string;
}

export interface ReorderRecommendation {
  itemId: string;
  itemName: string;
  currentQuantity: number;
  parLevel: number;
  recommendedOrder: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  estimatedRunoutDate: Date;
  suggestedSupplier: string;
  bulkPricingAvailable: boolean;
  estimatedCost: number;
}

export interface WasteOpportunity {
  itemId: string;
  itemName: string;
  wasteType: 'overstock' | 'spoilage' | 'slow_moving' | 'portion_control';
  estimatedWasteValue: number;
  recommendation: string;
  potentialSavings: number;
  // Added optional index signature to allow for additional properties if needed
  [key: string]: any;
}

export interface SupplierDeal {
  supplierId: string;
  supplierName: string;
  items: string[];
  discountPercent: number;
  minimumOrderValue: number;
  expiresAt: Date;
  category: string;
}

/**
 * AI-Powered Usage Prediction Engine
 * Analyzes historical sales, events, seasonality, and trends
 */
export class InventoryAI {
  /**
   * Predict usage for the next period based on historical data
   */
  static predictUsage(
    item: InventoryItem,
    historicalSales: number[],
    upcomingEvents: string[] = [],
    dayOfWeek: number = new Date().getDay()
  ): UsagePrediction {
    // Calculate baseline from historical average
    const avgUsage = historicalSales.reduce((a, b) => a + b, 0) / historicalSales.length;
    
    // Calculate trend
    const recentAvg = historicalSales.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const olderAvg = historicalSales.slice(0, 7).reduce((a, b) => a + b, 0) / 7;
    const trendFactor = recentAvg / olderAvg;
    
    let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
    if (trendFactor > 1.1) trend = 'increasing';
    if (trendFactor < 0.9) trend = 'decreasing';
    
    // Day of week adjustment (weekends typically 1.5x weekdays for bars)
    const dayFactor = [0, 5, 6].includes(dayOfWeek) ? 1.5 : 1.0;
    
    // Seasonal factors (summer drinks, winter cocktails, etc.)
    const month = new Date().getMonth();
    const seasonalFactor = this.getSeasonalFactor(item.category, month);
    
    // Event impact
    const eventFactor = upcomingEvents.length > 0 ? 1.3 : 1.0;
    const eventImpact = upcomingEvents.length > 0 
      ? `${upcomingEvents.length} events scheduled - expect +30% usage`
      : undefined;
    
    // Final prediction
    const predictedUsage = Math.round(
      avgUsage * trendFactor * dayFactor * seasonalFactor * eventFactor
    );
    
    // Confidence based on data consistency
    const variance = this.calculateVariance(historicalSales);
    const confidence = Math.max(50, Math.min(95, 100 - variance * 10));
    
    return {
      itemId: item.id,
      itemName: item.name,
      predictedUsage,
      confidence,
      trend,
      seasonalFactor,
      eventImpact,
    };
  }

  /**
   * Generate reorder recommendations based on predictions
   */
  static generateReorderRecommendations(
    inventory: InventoryItem[],
    predictions: UsagePrediction[],
    supplierCatalog: SupplierDeal[]
  ): ReorderRecommendation[] {
    return inventory.map(item => {
      const prediction = predictions.find(p => p.itemId === item.id);
      if (!prediction) return null;

      const daysUntilRunout = Math.floor(item.quantity / (prediction.predictedUsage / 7));
      const estimatedRunoutDate = addDays(new Date(), daysUntilRunout);
      
      // Calculate order amount
      const deficit = Math.max(0, item.parLevel - item.quantity);
      const safetyStock = Math.ceil(item.parLevel * 0.2); // 20% buffer
      const recommendedOrder = deficit + safetyStock;
      
      // Determine urgency
      let urgency: 'critical' | 'high' | 'medium' | 'low' = 'low';
      if (daysUntilRunout <= 2) urgency = 'critical';
      else if (daysUntilRunout <= 5) urgency = 'high';
      else if (daysUntilRunout <= 10) urgency = 'medium';
      
      // Find best supplier deal
      const applicableDeals = supplierCatalog.filter(deal => 
        deal.items.includes(item.id) && deal.category === item.category
      );
      const bestDeal = applicableDeals.sort((a, b) => b.discountPercent - a.discountPercent)[0];
      
      const suggestedSupplier = bestDeal?.supplierName || 'Primary Supplier';
      const bulkPricingAvailable = !!bestDeal && recommendedOrder * item.costPerUnit >= bestDeal.minimumOrderValue;
      
      const regularCost = recommendedOrder * item.costPerUnit;
      const estimatedCost = bulkPricingAvailable 
        ? regularCost * (1 - bestDeal.discountPercent / 100)
        : regularCost;
      
      return {
        itemId: item.id,
        itemName: item.name,
        currentQuantity: item.quantity,
        parLevel: item.parLevel,
        recommendedOrder,
        urgency,
        estimatedRunoutDate,
        suggestedSupplier,
        bulkPricingAvailable,
        estimatedCost,
      };
    }).filter(Boolean) as ReorderRecommendation[];
  }

  /**
   * Identify waste opportunities and cost savings
   */
  static identifyWasteOpportunities(
    inventory: InventoryItem[],
    predictions: UsagePrediction[],
    historicalWaste: Array<{ itemId: string; amount: number; reason: string }>
  ): WasteOpportunity[] {
    const opportunities: WasteOpportunity[] = [];
    
    inventory.forEach(item => {
      const prediction = predictions.find(p => p.itemId === item.id);
      if (!prediction) return;
      
      // Check for overstock
      const weeklyUsage = prediction.predictedUsage;
      const weeksOfStock = item.quantity / weeklyUsage;
      if (weeksOfStock > 4 && item.category.includes('Wine')) {
        opportunities.push({
          itemId: item.id,
          itemName: item.name,
          wasteType: 'overstock',
          estimatedWasteValue: item.costPerUnit * (item.quantity - item.parLevel),
          recommendation: `Reduce stock to ${item.parLevel} units. Current ${weeksOfStock.toFixed(1)} weeks supply exceeds optimal 2-3 weeks.`,
          potentialSavings: item.costPerUnit * (item.quantity - item.parLevel) * 0.1, // 10% carrying cost
        });
      }
      
      // Check for slow-moving items
      if (prediction.trend === 'decreasing' && weeklyUsage < item.parLevel * 0.3) {
        opportunities.push({
          itemId: item.id,
          itemName: item.name,
          wasteType: 'slow_moving',
          estimatedWasteValue: item.costPerUnit * item.quantity,
          recommendation: `Consider promotional pricing or menu feature to move inventory. Usage declining ${((1 - prediction.predictedUsage / item.parLevel) * 100).toFixed(0)}%.`,
          potentialSavings: item.costPerUnit * item.quantity * 0.15,
        });
      }
      
      // Check historical waste patterns
      const itemWaste = historicalWaste.filter(w => w.itemId === item.id);
      if (itemWaste.length > 3) {
        const avgWaste = itemWaste.reduce((sum, w) => sum + w.amount, 0) / itemWaste.length;
        opportunities.push({
          itemId: item.id,
          itemName: item.name,
          wasteType: 'spoilage',
          estimatedWasteValue: avgWaste * item.costPerUnit,
          recommendation: `Recurring waste detected. Consider smaller order quantities or improving storage. Average waste: ${avgWaste.toFixed(1)} ${item.unit}/week.`,
          potentialSavings: avgWaste * item.costPerUnit * 52, // Annual savings
        });
      }
    });
    
    return opportunities;
  }

  /**
   * Auto-generate supplier orders based on AI recommendations
   */
  static generateSupplierOrders(
    recommendations: ReorderRecommendation[],
    supplierCatalog: SupplierDeal[]
  ): Array<{
    supplierId: string;
    supplierName: string;
    items: Array<{ itemId: string; itemName: string; quantity: number; unitCost: number }>;
    subtotal: number;
    discount: number;
    total: number;
    dealApplied?: string;
  }> {
    // Group recommendations by supplier
    const ordersBySupplier = new Map<string, ReorderRecommendation[]>();
    
    recommendations.forEach(rec => {
      if (rec.urgency === 'critical' || rec.urgency === 'high') {
        const supplier = rec.suggestedSupplier;
        if (!ordersBySupplier.has(supplier)) {
          ordersBySupplier.set(supplier, []);
        }
        ordersBySupplier.get(supplier)!.push(rec);
      }
    });
    
    // Create orders with bulk pricing optimization
    const orders: Array<any> = [];
    
    ordersBySupplier.forEach((recs, supplierName) => {
      const subtotal = recs.reduce((sum, rec) => sum + rec.estimatedCost, 0);
      
      // Find applicable bulk deals
      const applicableDeal = supplierCatalog.find(deal => 
        deal.supplierName === supplierName && subtotal >= deal.minimumOrderValue
      );
      
      const discount = applicableDeal ? subtotal * (applicableDeal.discountPercent / 100) : 0;
      const total = subtotal - discount;
      
      orders.push({
        supplierId: `supplier_${supplierName.toLowerCase().replace(/\s+/g, '_')}`,
        supplierName,
        items: recs.map(rec => ({
          itemId: rec.itemId,
          itemName: rec.itemName,
          quantity: rec.recommendedOrder,
          unitCost: rec.estimatedCost / rec.recommendedOrder,
        })),
        subtotal,
        discount,
        total,
        dealApplied: applicableDeal ? `${applicableDeal.discountPercent}% bulk discount` : undefined,
      });
    });
    
    return orders;
  }

  // Helper methods
  private static getSeasonalFactor(category: string, month: number): number {
    // Summer (5-8): Higher beer, wine, light spirits
    // Winter (11-2): Higher whiskey, bourbon, dark spirits
    const isSummer = month >= 5 && month <= 8;
    const isWinter = month >= 11 || month <= 2;
    
    if (category.includes('Beer') && isSummer) return 1.3;
    if (category.includes('Wine - White') && isSummer) return 1.2;
    if (category.includes('Bourbon') && isWinter) return 1.2;
    if (category.includes('Whiskey') && isWinter) return 1.2;
    
    return 1.0;
  }

  private static calculateVariance(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const squaredDiffs = data.map(x => Math.pow(x - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / data.length;
    return Math.sqrt(variance) / mean; // Coefficient of variation
  }
}
