import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, X, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../contexts/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const ManualUploader = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!user) return;
    setUploading(true);
    setSuccess(false);

    try {
      const file = acceptedFiles[0];
      const storageRef = ref(storage, `manuals/${user.id}/${file.name}`);
      
      // Upload
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Save metadata
      await addDoc(collection(db, 'manuals'), {
        name: file.name,
        url,
        uploadedBy: user.id,
        createdAt: serverTimestamp(),
        venueId: user.venueId || user.id, // Fallback
      });

      setSuccess(true);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload manual.");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" {...getRootProps()}>
      <input {...getInputProps()} />
      {uploading ? (
        <div className="flex flex-col items-center text-blue-600">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p className="font-medium">Uploading manual...</p>
        </div>
      ) : success ? (
        <div className="flex flex-col items-center text-green-600">
          <CheckCircle className="mb-2" size={32} />
          <p className="font-medium">File uploaded successfully!</p>
          <p className="text-sm text-gray-500 mt-1">Click to upload another.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-500">
          <Upload className="mb-2" size={32} />
          <p className="font-medium text-gray-700">
            {isDragActive ? "Drop the file here..." : "Drag & drop employee manual PDF"}
          </p>
          <p className="text-sm mt-1">or click to select file</p>
        </div>
      )}
    </div>
  );
};
