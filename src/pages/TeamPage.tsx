import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Mail, Trash2, MoreVertical, CheckCircle, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const TeamPage = () => {
  const { user, login } = useAuth();
  
  // Mock Data
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Sarah Owner', email: 'sarah@venue.com', role: 'owner', status: 'active', lastActive: 'Now' },
    { id: 2, name: 'Mike Manager', email: 'mike@venue.com', role: 'manager', status: 'active', lastActive: '2h ago' },
    { id: 3, name: 'Sam Staff', email: 'sam@venue.com', role: 'staff', status: 'active', lastActive: '5m ago' },
    { id: 4, name: 'Jessica Bartender', email: 'jess@venue.com', role: 'staff', status: 'invited', lastActive: '-' },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);

  // Email Settings State
  const [reportEmail, setReportEmail] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);

  // Load Settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (!db) return;
        const docRef = doc(db, 'venueSettings', 'default');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setReportEmail(docSnap.data().reportEmail || '');
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    loadSettings();
  }, []);

  const handleSaveEmail = async () => {
    setSavingEmail(true);
    setEmailSaved(false);
    try {
      if (!db) throw new Error("No DB");
      await setDoc(doc(db, 'venueSettings', 'default'), {
        reportEmail,
        updatedAt: new Date(),
        updatedBy: user?.id
      }, { merge: true });
      setEmailSaved(true);
      setTimeout(() => setEmailSaved(false), 3000);
    } catch (err) {
      console.error("Error saving email:", err);
      alert("Failed to save settings");
    } finally {
      setSavingEmail(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'manager': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'staff': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Role Switcher Demo Widget */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
           <div className="p-2 bg-slate-800 rounded-lg">
             <Shield className="text-blue-400" size={24} />
           </div>
           <div>
             <h3 className="font-bold">Role Simulator (Demo)</h3>
             <p className="text-sm text-slate-400">Current View: <span className="text-white font-mono uppercase bg-slate-800 px-2 py-0.5 rounded">{user?.role}</span></p>
           </div>
        </div>
        <div className="flex space-x-2">
          <span className="text-sm text-slate-400">Current Role:</span>
          <span className={`px-3 py-1 rounded text-sm uppercase font-bold ${user?.role === 'owner' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{user?.role}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Team Management</h1>
          <p className="text-gray-500 mt-1">Manage access permissions and staff roles.</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <UserPlus size={18} className="mr-2" /> Invite Member
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Member</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
              <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                      {member.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail size={12} className="mr-1" /> {member.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleColor(member.role)} uppercase tracking-wide`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {member.status === 'active' && <CheckCircle size={12} className="mr-1" />}
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
          <h3 className="font-bold text-purple-900 mb-2">Owner Permissions</h3>
          <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
            <li>Full system access</li>
            <li>Manage billing & subscription</li>
            <li>Delete audit history</li>
            <li>Promote/Demote managers</li>
          </ul>
        </div>
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-2">Manager Permissions</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Invite new staff members</li>
            <li>View all reports and audits</li>
            <li>Manage inventory settings</li>
            <li>Cannot delete history</li>
          </ul>
        </div>
        <div className="p-6 bg-green-50 rounded-xl border border-green-100">
          <h3 className="font-bold text-green-900 mb-2">Staff Permissions</h3>
          <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
            <li>Perform daily checklists</li>
            <li>Conduct safety audits</li>
            <li>Submit issues/tickets</li>
            <li>Read-only profile access</li>
          </ul>
        </div>
      </div>

      {/* Settings Section - Owner Only */}
      {user?.role === 'owner' && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Mail className="mr-2 text-blue-600" size={24} />
            Checklist Configuration
          </h2>
          <div className="max-w-xl">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Report Recipient Email
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Where should completed daily checklists be sent?
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                value={reportEmail}
                onChange={(e) => setReportEmail(e.target.value)}
                placeholder="manager@example.com"
                className="flex-1 rounded-lg border-gray-300 border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <button
                onClick={handleSaveEmail}
                disabled={savingEmail}
                className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {savingEmail ? (
                  <Loader2 className="animate-spin mr-2" size={18} />
                ) : (
                  <Save className="mr-2" size={18} />
                )}
                {savingEmail ? 'Saving...' : 'Save'}
              </button>
            </div>
            {emailSaved && (
              <p className="text-green-600 text-sm mt-2 flex items-center">
                <CheckCircle size={14} className="mr-1" /> Settings saved successfully
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default TeamPage;
