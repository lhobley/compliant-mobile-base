import React, { useState, useEffect } from 'react';
import { 
  FileText, AlertCircle, CheckCircle, ChevronRight, ShieldCheck, Flame, 
  X, Check, ArrowLeft, Calendar, Save, Loader2, Camera, Upload, ScanEye 
} from 'lucide-react';
import { auditTemplates, AuditTemplate } from '../data/auditTemplates';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { analyzeCompliancePhoto, VisionAnalysisResult } from '../lib/visionAI';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { VoiceAuditAssistant } from '../components/audit/VoiceAuditAssistant';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

// Types
interface AuditHistoryItem {
  id: string;
  templateId: string;
  name: string;
  date: any; // Firestore Timestamp
  score: number;
  status: 'passed' | 'warning' | 'failed';
  totalPoints: number;
  earnedPoints: number;
}

const AuditPage = () => {
  const [selectedAudit, setSelectedAudit] = useState<AuditTemplate | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [history, setHistory] = useState<AuditHistoryItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  
  // AI Vision State
  const [analyzing, setAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisionAnalysisResult | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Flatten items for Voice Assistant
  const allItems = selectedAudit ? selectedAudit.sections.flatMap(s => s.items) : [];

  // Load History
  useEffect(() => {
    if (!db || Object.keys(db).length === 0) return;

    try {
      const q = query(
        collection(db, 'audits'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items: AuditHistoryItem[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as AuditHistoryItem));
        setHistory(items);
      }, (err) => {
        console.error("Audit history load error:", err);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Error loading audit history:", e);
    }
  }, []);

  // Reset answers when template changes
  useEffect(() => {
    if (selectedAudit) {
      const initialAnswers: Record<string, boolean | null> = {};
      selectedAudit.sections.forEach(section => {
        section.items.forEach(item => {
          initialAnswers[item.id] = null;
        });
      });
      setAnswers(initialAnswers);
      setAnalysisResult(null);
      setPreviewImage(null);
    }
  }, [selectedAudit]);

  const handleAnswer = (itemId: string, status: boolean) => {
    setAnswers(prev => ({ ...prev, [itemId]: status }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewImage(base64);
        runAIAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAIAnalysis = async (imageData: string) => {
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeCompliancePhoto(imageData);
      setAnalysisResult(result);
    } catch (e) {
      console.error("AI Analysis failed", e);
      alert("AI Analysis failed to run.");
    } finally {
      setAnalyzing(false);
    }
  };

  const calculateScore = () => {
    if (!selectedAudit) return { score: 0, status: 'failed', total: 0, earned: 0 };

    let totalPoints = 0;
    let earnedPoints = 0;
    let criticalFail = false;

    selectedAudit.sections.forEach(section => {
      section.items.forEach(item => {
        totalPoints += item.points;
        const result = answers[item.id];
        
        if (result === true) {
          earnedPoints += item.points;
        } else if (result === false && item.critical) {
          criticalFail = true;
        }
      });
    });

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    
    let status: 'passed' | 'warning' | 'failed' = 'passed';
    if (criticalFail || score < 80) status = 'failed';
    else if (score < 90) status = 'warning';

    return { score, status, total: totalPoints, earned: earnedPoints };
  };

  const submitAudit = async () => {
    if (!selectedAudit) return;
    if (!db || Object.keys(db).length === 0) {
      alert("Firebase not connected. Cannot submit.");
      return;
    }

    setSubmitting(true);

    const { score, status, total, earned } = calculateScore();

    try {
      await addDoc(collection(db, 'audits'), {
        templateId: selectedAudit.id,
        name: selectedAudit.name,
        category: selectedAudit.category,
        createdAt: new Date(),
        score,
        status,
        totalPoints: total,
        earnedPoints: earned,
        answers, // Store the raw data
        aiAnalysis: analysisResult || null, // Save AI results if any
        auditorId: user?.id || 'anonymous' 
      });
      
      setSelectedAudit(null); // Go back to list
      setAnswers({});
      setAnalysisResult(null);
      setPreviewImage(null);
    } catch (error) {
      console.error("Error saving audit:", error);
      alert("Failed to save audit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const stats = calculateScore();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {!selectedAudit ? (
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Compliance Audits</h1>
            <p className="text-gray-500 mt-1">Start a new inspection or review history.</p>
          </div>

          {/* Audit Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {auditTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedAudit(template)}
                className="group relative flex items-start p-6 bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 text-left overflow-hidden"
              >
                <div className={cn(
                  "p-4 rounded-xl mr-5 transition-colors duration-300",
                  template.category === 'health' ? "bg-green-50 text-green-600 group-hover:bg-green-100" :
                  template.category === 'fire' ? "bg-orange-50 text-orange-600 group-hover:bg-orange-100" :
                  "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                )}>
                  {template.category === 'health' && <ShieldCheck size={32} />}
                  {template.category === 'fire' && <Flame size={32} />}
                </div>
                <div className="flex-1 z-10">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm font-medium">
                    {template.sections.length} Sections · {template.sections.reduce((acc, s) => acc + s.items.length, 0)} Checkpoints
                  </p>
                  <div className="mt-5 flex items-center text-blue-600 text-sm font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Start Audit <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* History Table */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Recent Audit History</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Audit Name</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {history.length > 0 ? history.map((audit) => (
                  <tr key={audit.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="text-gray-400 mr-3" size={20} />
                        <div className="text-sm font-medium text-gray-900">{audit.name}</div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">
                      {audit.date?.seconds ? new Date(audit.date.seconds * 1000).toLocaleDateString() : 'Just now'}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">{audit.score}%</span>
                    </td>

                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {/* Traffic Light Indicators */}
                        <div className={cn(
                          "w-4 h-4 rounded-full shadow-sm border border-black/10 transition-all duration-300",
                          audit.status === 'failed' ? "bg-red-500 shadow-red-200 scale-110" : "bg-red-200 opacity-30"
                        )} />
                        <div className={cn(
                          "w-4 h-4 rounded-full shadow-sm border border-black/10 transition-all duration-300",
                          audit.status === 'warning' ? "bg-yellow-400 shadow-yellow-200 scale-110" : "bg-yellow-100 opacity-30"
                        )} />
                        <div className={cn(
                          "w-4 h-4 rounded-full shadow-sm border border-black/10 transition-all duration-300",
                          audit.status === 'passed' ? "bg-green-500 shadow-green-200 scale-110" : "bg-green-200 opacity-30"
                        )} />
                        
                        <span className={cn(
                          "ml-3 px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wide",
                          audit.status === 'passed' ? 'bg-green-100 text-green-700' : 
                          audit.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        )}>
                          {audit.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-gray-400">
                      No audits completed yet. Start one above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Active Audit View
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center">
              <button 
                onClick={() => setSelectedAudit(null)}
                className="mr-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedAudit.name}</h2>
                <div className="mt-1">
                   <VoiceAuditAssistant 
                     checklistId={selectedAudit.id}
                     sessionId={`voice_session_${Date.now()}`}
                     locationId="main_location"
                     items={allItems}
                     onComplete={() => alert("Voice Audit Finished!")}
                   />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
               <div className="text-right hidden sm:block">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Score</p>
                 <p className={cn(
                   "text-2xl font-black",
                   stats.score >= 90 ? "text-green-600" : 
                   stats.score >= 80 ? "text-yellow-600" : "text-red-600"
                 )}>{stats.score}%</p>
               </div>
               <button 
                 onClick={submitAudit}
                 disabled={submitting}
                 className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
               >
                 {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                 {submitting ? 'Saving...' : 'Submit Report'}
               </button>
            </div>
          </div>

          <div className="p-8 max-w-4xl mx-auto">
            {/* AI Vision Section */}
            <div className="mb-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
               <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                 <div>
                   <h3 className="text-xl font-bold flex items-center mb-2">
                     <ScanEye className="mr-3" /> AI Visual Inspection
                   </h3>
                   <p className="text-blue-100 max-w-xl text-sm">
                     Upload a photo of the kitchen, bar, or storage area. Our AI will scan for health code violations (FDA Food Code) and fire safety risks instantly.
                   </p>
                 </div>
                 
                 <div className="flex space-x-3">
                   <label className="cursor-pointer bg-white/20 hover:bg-white/30 transition-colors px-4 py-3 rounded-lg flex items-center font-semibold text-sm backdrop-blur-sm border border-white/30">
                     <Upload size={18} className="mr-2" /> Upload Photo
                     <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                   </label>
                 </div>
               </div>
               
               {/* Analysis Results */}
               {(analyzing || analysisResult || previewImage) && (
                 <div className="mt-6 bg-white/10 rounded-xl p-4 backdrop-blur-md border border-white/20">
                   {previewImage && (
                     <div className="mb-4">
                       <img src={previewImage} alt="Preview" className="h-48 rounded-lg object-cover border-2 border-white/30" />
                     </div>
                   )}
                   
                   {analyzing && (
                     <div className="flex items-center text-blue-100 py-4">
                       <Loader2 className="animate-spin mr-3" /> Analyzing visual compliance patterns...
                     </div>
                   )}
                   
                   {analysisResult && (
                     <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <div className="flex items-center justify-between mb-4 border-b border-white/20 pb-2">
                         <span className="font-bold text-lg">Analysis Results</span>
                         <span className={cn(
                           "px-3 py-1 rounded-full text-sm font-bold",
                           analysisResult.complianceScore >= 80 ? "bg-green-500 text-white" : "bg-red-500 text-white"
                         )}>
                           Safety Score: {analysisResult.complianceScore}%
                         </span>
                       </div>
                       <p className="text-sm mb-4 text-blue-50 font-medium">{analysisResult.summary}</p>
                       
                       <div className="space-y-2">
                         {analysisResult.detectedIssues.map((issue, idx) => (
                           <div key={idx} className="bg-white/90 text-slate-900 p-3 rounded-lg text-sm flex items-start">
                             <AlertCircle className={cn(
                               "flex-shrink-0 mr-2 mt-0.5",
                               issue.severity === 'critical' || issue.severity === 'high' ? "text-red-600" : "text-yellow-600"
                             )} size={16} />
                             <div>
                               <p className="font-bold text-gray-900">{issue.description}</p>
                               <p className="text-gray-600 text-xs mt-1">Recommendation: {issue.recommendation}</p>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               )}
            </div>

            {selectedAudit.sections.map((section, sIdx) => (
              <div key={sIdx} className="mb-12 last:mb-0">
                <h3 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b-2 border-slate-100 flex items-center">
                  <span className="bg-slate-100 text-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 font-black">
                    {sIdx + 1}
                  </span>
                  {section.title}
                </h3>
                
                <div className="space-y-4">
                  {section.items.map((item) => {
                    const value = answers[item.id];
                    return (
                      <div key={item.id} className={cn(
                        "flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border transition-all duration-200",
                        value === true ? "bg-green-50/50 border-green-200" :
                        value === false ? "bg-red-50/50 border-red-200" :
                        "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                      )}>
                        <div className="flex-1 pr-4 mb-4 sm:mb-0">
                          <p className="font-medium text-gray-900 text-lg leading-snug">{item.question}</p>
                          <div className="flex items-center mt-2 space-x-3">
                            {item.critical && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-red-100 text-red-700">
                                Critical Issue
                              </span>
                            )}
                            <span className="text-xs font-semibold text-gray-400">
                              {item.points} Points
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleAnswer(item.id, true)}
                            className={cn(
                              "flex items-center px-4 py-2.5 rounded-lg font-semibold transition-all duration-200",
                              value === true 
                                ? "bg-green-600 text-white shadow-md shadow-green-200 scale-105" 
                                : "bg-white border border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                            )}
                          >
                            <CheckCircle size={18} className="mr-2" />
                            Pass
                          </button>
                          <button 
                            onClick={() => handleAnswer(item.id, false)}
                            className={cn(
                              "flex items-center px-4 py-2.5 rounded-lg font-semibold transition-all duration-200",
                              value === false
                                ? "bg-red-600 text-white shadow-md shadow-red-200 scale-105" 
                                : "bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                            )}
                          >
                            <AlertCircle size={18} className="mr-2" />
                            Fail
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditPage;
