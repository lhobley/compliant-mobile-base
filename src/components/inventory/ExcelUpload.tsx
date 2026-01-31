import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, X, Check, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { MasterItem } from '../../types/inventoryTypes';

interface ExcelUploadProps {
  items: MasterItem[];
  onUpload: (counts: Record<string, number>) => void;
  categoryName: string;
}

export const ExcelUpload: React.FC<ExcelUploadProps> = ({ items, onUpload, categoryName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<{ itemId: string; name: string; count: number }[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processExcel = (file: File) => {
    setError(null);
    setPreview(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        // Expected columns: Item ID/Name, Count/Quantity
        const counts: Record<string, number> = {};
        const previewData: { itemId: string; name: string; count: number }[] = [];
        let matchedCount = 0;

        jsonData.forEach((row: any) => {
          // Try to find matching column names
          const itemCode = row['Item ID'] || row['Item Code'] || row['Code'] || row['ID'] || row['itemId'];
          const itemName = row['Item Name'] || row['Name'] || row['Item'] || row['name'];
          const count = row['Count'] || row['Quantity'] || row['Qty'] || row['count'] || row['quantity'];

          if (itemCode && count !== undefined) {
            const countNum = parseFloat(count);
            if (!isNaN(countNum)) {
              // Find matching item in our list
              const matchingItem = items.find(item => 
                item.id === itemCode || 
                item.templateCode === itemCode ||
                item.name.toLowerCase() === (itemName || '').toLowerCase()
              );

              if (matchingItem) {
                counts[matchingItem.id] = countNum;
                previewData.push({
                  itemId: matchingItem.id,
                  name: matchingItem.name,
                  count: countNum
                });
                matchedCount++;
              }
            }
          }
        });

        if (matchedCount === 0) {
          setError('No matching items found. Please check your Excel format. Expected columns: Item ID/Code, Count/Quantity');
          return;
        }

        setPreview(previewData);
      } catch (err) {
        setError('Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.');
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
    };

    reader.readAsBinaryString(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        processExcel(file);
      } else {
        setError('Please upload an Excel file (.xlsx or .xls)');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        processExcel(file);
      } else {
        setError('Please upload an Excel file (.xlsx or .xls)');
      }
    }
  };

  const handleConfirm = () => {
    if (preview) {
      const counts: Record<string, number> = {};
      preview.forEach(p => {
        counts[p.itemId] = p.count;
      });
      onUpload(counts);
      setIsOpen(false);
      setPreview(null);
    }
  };

  const downloadTemplate = () => {
    // Create template data
    const templateData = items.map(item => ({
      'Item ID': item.id,
      'Item Name': item.name,
      'Count': 0
    }));

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
    XLSX.writeFile(wb, `${categoryName.replace(/\s+/g, '_')}_Inventory_Template.xlsx`);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md"
      >
        <FileSpreadsheet size={18} />
        <span className="hidden sm:inline">Excel Import</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Excel Import</h3>
            <p className="text-sm text-gray-500">Upload inventory counts from Excel</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Download Template */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Need a template?</h4>
              <p className="text-sm text-blue-700">Download a pre-filled template for this category</p>
            </div>
            <button
              onClick={downloadTemplate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet size={18} />
              Download
            </button>
          </div>

          {/* Upload Area */}
          {!preview && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center transition-all
                ${isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <Upload className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop Excel file here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports .xlsx and .xls files
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Select File
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <Check size={20} />
                <span className="font-medium">Found {preview.length} matching items</span>
              </div>
              
              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {preview.slice(0, 10).map((p, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 text-sm text-gray-900">{p.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono">{p.count}</td>
                      </tr>
                    ))}
                    {preview.length > 10 && (
                      <tr>
                        <td colSpan={2} className="px-4 py-2 text-sm text-gray-500 text-center">
                          ... and {preview.length - 10} more items
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setPreview(null);
                    setError(null);
                  }}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Upload Different File
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  Apply Counts
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
