import React, { useState } from 'react';
import { exportFullBackup, restoreFullBackup } from '../../services/backupService';
import { Download, Upload, ShieldAlert, CheckCircle } from 'lucide-react';

export default function BackupRestore() {
  const [fileContent, setFileContent] = useState(null);
  const [status, setStatus] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setFileContent(event.target.result);
      reader.readAsText(file);
    }
  };

  const handleRestore = async () => {
    if (!fileContent) return;
    if (!window.confirm('کیا آپ واقعی تمام موجودہ ڈیٹا پریکٹیکلی ری سٹور کرنا چاہتے ہیں؟')) return;

    const res = await restoreFullBackup(fileContent);
    if (res.success) {
      setStatus({ type: 'success', message: res.message });
    } else {
      setStatus({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">ڈیٹا بیک اپ اور بحالی (Backup & Restore)</h1>
        <p className="text-sm text-gray-500">اپنے تمام ڈیٹا بیس کا آف لائن JSON بیک اپ لیں اور ضرورت پڑنے پر ری سٹور کریں</p>
      </div>

      {status && (
        <div className={`p-4 rounded-xl flex items-center gap-2 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
          <CheckCircle className="w-5 h-5" /> {status.message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Download className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">ڈیٹا بیک اپ ایکسپورٹ کریں</h2>
          <p className="text-xs text-gray-600">تمام ممبران، فنڈز، اخراجات اور دستور کا مکمل ڈیٹا محفوظ JSON فائل میں ڈاؤن لوڈ کریں۔</p>
          <button
            onClick={exportFullBackup}
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition"
          >
            بیک اپ ڈاؤن لوڈ کریں
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">ڈیٹا بحال (Restore) کریں</h2>
          <p className="text-xs text-gray-600">پہلے سے محفوظ شدہ JSON بیک اپ فائل سلیکٹ کریں اور سسٹم بحال کریں۔</p>
          
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />

          <button
            onClick={handleRestore}
            disabled={!fileContent}
            className="w-full py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition disabled:opacity-50"
          >
            ڈیٹا بیس بحال کریں
          </button>
        </div>
      </div>
    </div>
  );
}
