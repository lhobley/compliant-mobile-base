import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, Loader2, Link2, Check, RefreshCw } from 'lucide-react';

const POSIntegrationSettings = () => {
  const { user } = useAuth();
  const [integrating, setIntegrating] = useState<string | null>(null);
  const [activeIntegrations, setActiveIntegrations] = useState<string[]>([]);

  // Mock integration process
  const handleConnect = (posName: string) => {
    setIntegrating(posName);
    setTimeout(() => {
      setActiveIntegrations(prev => [...prev, posName]);
      setIntegrating(null);
    }, 2000);
  };

  const integrations = [
    {
      id: 'toast',
      name: 'Toast POS',
      logo: 'https://cdn.worldvectorlogo.com/logos/toast-3.svg',
      description: 'Sync sales data and employee clock-ins.',
      connected: activeIntegrations.includes('toast')
    },
    {
      id: 'clover',
      name: 'Clover',
      logo: 'https://cdn.worldvectorlogo.com/logos/clover-2.svg',
      description: 'Import inventory and menu items automatically.',
      connected: activeIntegrations.includes('clover')
    },
    {
      id: 'square',
      name: 'Square',
      logo: 'https://cdn.worldvectorlogo.com/logos/square-1.svg',
      description: 'Sync transaction history for audits.',
      connected: activeIntegrations.includes('square')
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">POS Integrations</h2>
        <p className="text-sm text-gray-500 mt-1">
          Connect your Point of Sale system to sync sales, inventory, and labor data.
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {integrations.map((pos) => (
          <div key={pos.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center p-2 text-gray-400 font-bold text-xs uppercase">
                 {/* Fallback image logic is tricky in pure CSS/JS without errors, so using text fallback */}
                 {pos.name.slice(0, 2)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 flex items-center">
                  {pos.name}
                  {pos.connected && (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                      <Check size={10} className="mr-1" /> Connected
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-500">{pos.description}</p>
              </div>
            </div>

            <button
              onClick={() => handleConnect(pos.id)}
              disabled={pos.connected || integrating === pos.id}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center ${
                pos.connected
                  ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {integrating === pos.id ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Connecting...
                </>
              ) : pos.connected ? (
                'Synced'
              ) : (
                <>
                  <Link2 className="mr-2" size={16} />
                  Connect
                </>
              )}
            </button>
          </div>
        ))}
      </div>
      
      {activeIntegrations.length > 0 && (
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last sync: Just now</span>
            <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              <RefreshCw size={14} className="mr-1" /> Force Sync
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSIntegrationSettings;
