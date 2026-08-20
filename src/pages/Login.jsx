import React, { useState } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onSuccess }) {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('براہ کرم یوزر نیم اور پاس ورڈ درج کریں۔');
      return;
    }

    // عارضی طور پر Super Admin login
    // اصل Firebase Authentication بعد کے مرحلے میں لگائیں گے۔
    login('super_admin');

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="max-w-md mx-auto my-10">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 space-y-6">

        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black text-gray-900">
            ایڈمن لاگ اِن
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            کوزتیراج ویلفیئر آرگنائزیشن (KWO)
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              یوزر نیم
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="یوزر نیم"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              پاس ورڈ
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="پاس ورڈ"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            لاگ اِن کریں
          </button>

        </form>

        <p className="text-xs text-gray-400 text-center leading-6">
          نوٹ: اصل محفوظ Firebase Authentication ہم اگلے مرحلے میں فعال کریں گے۔
        </p>

      </div>
    </div>
  );
}
