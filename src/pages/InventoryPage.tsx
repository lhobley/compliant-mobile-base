import React from 'react';
import { InventoryDashboard } from '../components/inventory/InventoryDashboard';

const InventoryPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600">AI-powered tracking, predictions, and automated ordering.</p>
      </div>
      <InventoryDashboard venueId="demo-venue" />
    </div>
  );
};

export default InventoryPage;
