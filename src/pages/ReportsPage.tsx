import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Filter, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ReportPrinter } from '../components/ReportPrinter';
import { ManualUploader } from '../components/ManualUploader';

export const ReportsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'audits' | 'checklists' | 'manuals'>('audits');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Fetch Reports
  useEffect(() => {
    if (!user) return;
    
    const fetchReports = async () => {
      setLoading(true);
      try {
        let q;
        const collectionName = activeTab === 'manuals' ? 'manuals' : activeTab === 'audits' ? 'audits' : 'checklists';
        
        // Basic query (filtering by date would be added here in prod)
        // Note: For complex queries with 'where' + 'orderBy', Firestore requires a composite index.
        // We'll fetch without orderBy first to avoid index errors in dev, or rely on client-side sort for small datasets.
        q = query(
          collection(db, collectionName),
          where('venueId', '==', user.venueId || user.id)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() as any }));
        
        // Client-side sort
        data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (data.length > 0) {
           setReports(data);
        } else {
           // Fallback to mock data if empty
           setReports([
             { id: '1', createdAt: new Date().toISOString(), user: 'Mike Manager', status: 'pass', items: [{ label: 'Clean Bar', status: 'pass' }] },
             { id: '2', createdAt: new Date(Date.now() - 86400000).toISOString(), user: 'Sarah Owner', status: 'fail', items: [{ label: 'Fire Extinguisher', status: 'fail' }] },
           ]);
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        // Fallback
        setReports([
          { id: '1', createdAt: new Date().toISOString(), user: 'Mike Manager', status: 'pass', items: [{ label: 'Clean Bar', status: 'pass' }] },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab !== 'manuals') {
      fetchReports();
    }
  }, [activeTab, user]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Documentation</h1>
          <p className="text-gray-500">Access historical audits, daily logs, and training materials.</p>
        </div>
        
        {/* Date Filter */}
        <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <Calendar size={16} className="text-gray-400" />
          <input 
            type="date" 
            className="text-sm border-none outline-none text-gray-600"
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          />
          <span className="text-gray-300">-</span>
          <input 
            type="date" 
            className="text-sm border-none outline-none text-gray-600"
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          />
          <button className="p-1 hover:bg-gray-100 rounded text-blue-600">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        {['audits', 'checklists', 'manuals'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTab === tab 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm min-h-[400px]">
        {activeTab === 'manuals' ? (
          <div className="p-8">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold">Employee Manuals & SOPs</h2>
               <span className="text-sm text-gray-500">Visible to all staff</span>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Uploader */}
               {user?.role === 'owner' || user?.role === 'manager' ? (
                 <div>
                   <h3 className="font-medium mb-3 text-gray-700">Upload New Document</h3>
                   <ManualUploader />
                 </div>
               ) : null}

               {/* File List */}
               <div>
                 <h3 className="font-medium mb-3 text-gray-700">Available Documents</h3>
                 <div className="space-y-3">
                   {/* Mock Files */}
                   {['Employee Handbook 2026.pdf', 'Opening Checklist SOP.pdf', 'Dress Code Policy.pdf'].map((file, i) => (
                     <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                       <div className="flex items-center space-x-3">
                         <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                           <FileText size={20} />
                         </div>
                         <span className="text-sm font-medium text-gray-700">{file}</span>
                       </div>
                       <button className="text-gray-400 hover:text-blue-600">
                         <Download size={18} />
                       </button>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(report.createdAt).toLocaleDateString()} <span className="text-gray-400 text-xs ml-1">{new Date(report.createdAt).toLocaleTimeString()}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.user}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        report.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                       <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                         <Eye size={18} />
                       </button>
                       <ReportPrinter data={report} type={activeTab as 'audit' | 'checklist'} />
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && !loading && (
                   <tr>
                     <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                       No reports found for this period.
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
