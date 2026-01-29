// ===================================================================
// FILE: src/components/inventory/InventoryDashboard.tsx
// AI-Powered Inventory Dashboard Component
// ===================================================================
import React, { useState, useEffect } from 'react';
import { InventoryAI, UsagePrediction, ReorderRecommendation, WasteOpportunity } from '@/lib/inventoryAI';
import { InventoryItem, inventoryCollection } from '@/lib/firebaseCollections';
import { getDocs, query, where } from 'firebase/firestore';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Package, ShoppingCart } from 'lucide-react';

export const InventoryDashboard: React.FC<{ venueId: string }> = ({ venueId }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [predictions, setPredictions] = useState<UsagePrediction[]>([]);
  const [reorderRecs, setReorderRecs] = useState<ReorderRecommendation[]>([]);
  const [wasteOps, setWasteOps] = useState<WasteOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventoryData();
  }, [venueId]);

  const loadInventoryData = async () => {
    try {
      // Fetch from Firestore
      const q = query(inventoryCollection, where('venueId', '==', venueId));
      const snapshot = await getDocs(q);
      
      let fetchedInventory: InventoryItem[] = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        // Convert timestamp to Date if needed, Firestore returns Timestamp objects
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date(), 
      } as InventoryItem));

      // Fallback to mock if empty (for demo purposes so the app isn't empty on first run)
      if (fetchedInventory.length === 0) {
        fetchedInventory = [
          {
            id: 'inv1',
            venueId,
            category: 'Vodka',
            name: 'Premium Vodka',
            brand: 'Grey Goose',
            quantity: 8,
            unit: 'liter',
            parLevel: 15,
            costPerUnit: 42.00,
            lastUpdated: new Date(),
          },
          {
            id: 'inv2',
            venueId,
            category: 'Whiskey',
            name: 'Bourbon',
            brand: 'Makers Mark',
            quantity: 12,
            unit: 'liter',
            parLevel: 10,
            costPerUnit: 35.00,
            lastUpdated: new Date(),
          }
        ];
      }

      const mockSales = [45, 48, 52, 47, 50, 55, 53, 58, 60, 57, 62, 65, 63, 68];
      
      const predictions = fetchedInventory.map(item => 
        InventoryAI.predictUsage(item, mockSales, ['Live Music Friday'], new Date().getDay())
      );

      const mockSuppliers = [
        {
          supplierId: 'sup1',
          supplierName: 'Premium Spirits Co',
          items: ['inv1', 'inv2'],
          discountPercent: 15,
          minimumOrderValue: 500,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          category: 'Vodka',
        },
      ];

      const recommendations = InventoryAI.generateReorderRecommendations(
        fetchedInventory,
        predictions,
        mockSuppliers
      );

      const wasteOpportunities = InventoryAI.identifyWasteOpportunities(
        fetchedInventory,
        predictions,
        []
      );

      setInventory(fetchedInventory);
      setPredictions(predictions);
      setReorderRecs(recommendations);
      setWasteOps(wasteOpportunities);
    } catch (error) {
      console.error("Error loading inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-12">Loading AI analysis...</div>;
  }

  const totalPotentialSavings = wasteOps.reduce((sum, w) => sum + w.potentialSavings, 0);
  const criticalItems = reorderRecs.filter(r => r.urgency === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Items</p>
              <p className="text-2xl font-bold text-red-600">{criticalItems}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Potential Savings</p>
              <p className="text-2xl font-bold text-green-600">${totalPotentialSavings.toFixed(0)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Items Tracked</p>
              <p className="text-2xl font-bold text-blue-600">{inventory.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reorder Items</p>
              <p className="text-2xl font-bold text-orange-600">{reorderRecs.length}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* AI Predictions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">AI Usage Predictions</h3>
        <div className="space-y-3">
          {predictions.slice(0, 5).map(pred => (
            <div key={pred.itemId} className="flex items-center justify-between border-b pb-3">
              <div className="flex-1">
                <p className="font-medium">{pred.itemName}</p>
                <p className="text-sm text-gray-600">
                  Predicted: {pred.predictedUsage} units/week · {pred.confidence}% confidence
                </p>
                {pred.eventImpact && (
                  <p className="text-xs text-orange-600 mt-1">{pred.eventImpact}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {pred.trend === 'increasing' && <TrendingUp className="w-5 h-5 text-green-600" />}
                {pred.trend === 'decreasing' && <TrendingDown className="w-5 h-5 text-red-600" />}
                <span className={`text-sm font-medium ${
                  pred.trend === 'increasing' ? 'text-green-600' : 
                  pred.trend === 'decreasing' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {pred.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reorder Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Smart Reorder Recommendations</h3>
        <div className="space-y-3">
          {reorderRecs.map(rec => (
            <div key={rec.itemId} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{rec.itemName}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rec.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                      rec.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                      rec.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {rec.urgency.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <p>Current: {rec.currentQuantity} | Par: {rec.parLevel} | Order: <strong>{rec.recommendedOrder} units</strong></p>
                    <p>Estimated runout: {rec.estimatedRunoutDate.toLocaleDateString()}</p>
                    <p>Supplier: {rec.suggestedSupplier} · Cost: ${rec.estimatedCost.toFixed(2)}</p>
                    {rec.bulkPricingAvailable && (
                      <p className="text-green-600 font-medium">✓ Bulk pricing available!</p>
                    )}
                  </div>
                </div>
                <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Waste Opportunities */}
      {wasteOps.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Cost Savings Opportunities</h3>
          <div className="space-y-3">
            {wasteOps.map((opp, idx) => (
              <div key={idx} className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{opp.itemName}</p>
                    <p className="text-sm text-gray-700 mt-1">{opp.recommendation}</p>
                    <p className="text-sm text-green-700 font-medium mt-2">
                      Potential annual savings: ${opp.potentialSavings.toFixed(2)}
                    </p>
                  </div>
                  <span className="ml-4 px-3 py-1 bg-green-600 text-white rounded text-sm">
                    {opp.wasteType.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDashboard;
