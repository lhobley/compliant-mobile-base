import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages will be created in the full implementation
const Dashboard = () => <div className="p-8"><h1 className="text-3xl font-bold">ComplianceDaddy Dashboard</h1><p className="mt-4">Welcome to your compliance management system!</p></div>;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
