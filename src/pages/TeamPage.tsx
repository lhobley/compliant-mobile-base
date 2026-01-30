import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Mail, Trash2, MoreVertical, CheckCircle, Save, Loader2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, app } from '../lib/firebase';
import { CertificationUploader } from '../components/CertificationUploader';

const TeamPage = () => {
  const { user } = useAuth();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  
  // Mock Data (replace with real fetch in production)
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Sarah Owner', email: 'sarah@venue.com', role: 'owner', status: 'active', lastActive: 'Now' },
    { id: 2, name: 'Mike Manager', email: 'mike@venue.com', role: 'manager', status: 'active', lastActive: '2h ago' },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // New Member Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('staff');

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

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail || !newMemberPassword || !newMemberName) return;
    
    setIsCreating(true);
    try {
      // Initialize a secondary Firebase app to create user without logging out the admin
      const secondaryApp = initializeApp(app.options, 'Secondary');
      const secondaryAuth = getAuth(secondaryApp);

      // Create the user in Auth
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newMemberEmail, newMemberPassword);
      const newUser = userCredential.user;

      // Create profile in Firestore (using main app's db)
      await setDoc(doc(db, 'profiles', newUser.uid), {
        name: newMemberName,
        email: newMemberEmail,
        role: newMemberRole,
        venueId: user?.id, // Link to owner's venue
        createdAt: new Date().toISOString(),
        createdBy: user?.id
      });

      // Sign out the secondary auth so it doesn't interfere
      await signOut(secondaryAuth);
      
      // Update local state (mock)
      setTeamMembers(prev => [...prev, {
        id: Date.now(),
        name: newMemberName,
        email: newMemberEmail,
        role: newMemberRole,
        status: 'active',
        lastActive: '-'
      }]);

      setShowInviteModal(false);
      
      // Reset form
      setNewMemberName('');
      setNewMemberEmail('');
      setNewMemberPassword('');
      setNewMemberRole('staff');

      alert(`User created! \nEmail: ${newMemberEmail}\nPassword: ${newMemberPassword}`);

    } catch (error: any) {
      console.error("Error creating user:", error);
      alert("Failed to create user: " + error.message);
    } finally {
      setIsCreating(false);
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
              <React.Fragment key={member.id}>
                <tr 
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedMember(selectedMember === member.id.toString() ? null : member.id.toString())}
                >
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
                    <button className="text-gray-400 group-hover:text-blue-600 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
                
                {/* Expanded Details Row */}
                {selectedMember === member.id.toString() && (
                  <tr className="bg-gray-50/50">
                    <td colSpan={5} className="px-6 py-6 animate-in fade-in slide-in-from-top-2 duration-200">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {/* Left: Cert List */}
                         <div>
                           <div className="flex items-center justify-between mb-4">
                             <h4 className="font-bold text-gray-900">Active Certifications</h4>
                             <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">
                               {user?.role === 'owner' ? 'Owner View' : 'Manager View'}
                             </span>
                           </div>
                           
                           {/* Certification List Mock */}
                           <div className="space-y-3">
                             <div className="flex items-center justify-between p-4 bg-white border border-green-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                               <div className="flex items-center">
                                 <div className="p-2 bg-green-50 rounded-lg mr-3">
                                   <Shield className="text-green-600" size={20} />
                                 </div>
                                 <div>
                                   <p className="text-sm font-bold text-gray-900">ServSafe Manager</p>
                                   <p className="text-xs text-green-600 font-medium">Valid until Dec 15, 2028</p>
                                 </div>
                               </div>
                               <button className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                 <Trash2 size={16} />
                               </button>
                             </div>

                             {/* Empty State */}
                             <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                               No other certifications on file
                             </div>
                           </div>
                         </div>
                         
                         {/* Right: Uploader */}
                         <div>
                           <CertificationUploader memberId={member.id.toString()} />
                         </div>
                       </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
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

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowInviteModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">Add Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateMember} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="staff@venue.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Password</label>
                <input
                  type="password"
                  required
                  value={newMemberPassword}
                  onChange={(e) => setNewMemberPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  You must share these credentials with the staff member.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {['manager', 'staff'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setNewMemberRole(r)}
                      className={`py-2 px-4 rounded-lg text-sm font-medium capitalize border transition-all ${
                        newMemberRole === r
                          ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center"
                >
                  {isCreating ? <Loader2 className="animate-spin" size={18} /> : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeamPage;
