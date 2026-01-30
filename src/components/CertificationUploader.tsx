import React, { useState } from 'react';
import { Upload, FileText, Loader2, Award, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../contexts/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface CertificationUploaderProps {
  memberId: string;
  onUploadComplete?: () => void;
}

export const CertificationUploader: React.FC<CertificationUploaderProps> = ({ memberId, onUploadComplete }) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [certType, setCertType] = useState('ServSafe Food Handler');
  const [expiryDate, setExpiryDate] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    maxFiles: 1,
    accept: {'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg']}
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !certType || !expiryDate) return;

    setUploading(true);
    try {
      // Create a reference to storage
      const storageRef = ref(storage, `certs/${memberId}/${Date.now()}_${file.name}`);
      
      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get URL
      const url = await getDownloadURL(storageRef);

      // Save record to Firestore
      await addDoc(collection(db, 'certifications'), {
        memberId,
        name: certType,
        expiryDate,
        url,
        uploadedBy: user?.id,
        createdAt: serverTimestamp(),
        venueId: user?.venueId || user?.id
      });

      // Reset form
      setFile(null);
      setCertType('ServSafe Food Handler');
      setExpiryDate('');
      
      if (onUploadComplete) onUploadComplete();
      alert('Certification uploaded successfully!');
    } catch (err: any) {
      console.error("Upload failed:", err);
      alert("Failed to upload certification: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-sm">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center">
        <Award className="mr-2 text-blue-600" size={20} />
        Add Certification
      </h3>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Certification Type</label>
          <select 
            value={certType} 
            onChange={(e) => setCertType(e.target.value)}
            className="w-full text-sm border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            required
          >
            <option value="ServSafe Food Handler">ServSafe Food Handler</option>
            <option value="ServSafe Manager">ServSafe Manager</option>
            <option value="Responsible Vendor">Responsible Vendor / Alcohol</option>
            <option value="Allergen Training">Allergen Training</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Expiration Date</label>
          <input 
            type="date" 
            value={expiryDate} 
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full text-sm border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          />
        </div>

        <div>
           <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Document Proof</label>
           <div 
             {...getRootProps()} 
             className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
               isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
             }`}
           >
             <input {...getInputProps()} />
             {file ? (
                <div className="flex items-center justify-center text-sm text-green-600 font-medium">
                  <FileText size={18} className="mr-2" />
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="ml-2 p-1 hover:bg-green-100 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
             ) : (
                <div className="space-y-1">
                  <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-xs text-gray-500 font-medium">Click to upload or drag file</p>
                  <p className="text-[10px] text-gray-400">PDF, PNG, JPG up to 5MB</p>
                </div>
             )}
           </div>
        </div>

        <button
          type="submit"
          disabled={uploading || !file || !expiryDate}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-blue-500/30"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={16} />
              Uploading...
            </>
          ) : 'Save Certification'}
        </button>
      </form>
    </div>
  );
};
