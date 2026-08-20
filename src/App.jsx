import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import PublicHome from './pages/PublicHome';
import ConstitutionEditor from './pages/admin/ConstitutionEditor';
import FundsManager from './pages/admin/FundsManager';
import BackupRestore from './pages/admin/BackupRestore';
import { 
  Home, Users, Wallet, HeartHandshake, Receipt, Clock, 
  Bell, BookOpen, Settings, LogOut, Shield, Download 
} from 'lucide-react';

function Navigation({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const { settings } = useTheme();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl">
            {settings.shortName?.[0] || 'K'}
          </div>
          <div>
            <h1 className="font-extrabold text-gray-900 text-base leading-tight">{settings.urName}</h1>
            <p className="text-xs text-gray-500">{settings.enName}</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          <button onClick={() => setActiveTab('home')} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'home' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}>ہوم</button>
          <button onClick={() => setActiveTab('dastoor')} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'dastoor' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}>دستور</button>
          {user && (
            <>
              <button onClick={() => setActiveTab('funds')} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'funds' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}>فنڈز مینجمنٹ</button>
              <button onClick={() => setActiveTab('backup')} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'backup' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}>بیک اپ / بحالی</button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <button onClick={logout} className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold flex items-center gap-1">
              <LogOut className="w-4 h-4" /> لاگ آؤٹ
            </button>
          ) : (
            <button onClick={() => setActiveTab('login')} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700">
              ایڈمن لاگ ان
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function MainContent({ activeTab, setActiveTab }) {
  const { user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (activeTab === 'home') return <PublicHome onNavigate={setActiveTab} />;
  if (activeTab === 'dastoor') return <ConstitutionEditor />;
  if (activeTab === 'funds') return user ? <FundsManager /> : <PublicHome onNavigate={setActiveTab} />;
  if (activeTab === 'backup') return user ? <BackupRestore /> : <PublicHome onNavigate={setActiveTab} />;

  if (activeTab === 'login') {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl border border-gray-100 shadow-lg space-y-4">
        <h2 className="text-2xl font-black text-center text-gray-800">ایڈمن لاگ ان پورٹل</h2>
        <form onSubmit={(e) => { e.preventDefault(); login('super_admin'); setActiveTab('funds'); }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">یوزر نیم</label>
            <input type="text" required value={username} onChange={e=>setUsername(e.target.value)} className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">پاس ورڈ</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">
            پورٹل لاگ ان کریں
          </button>
        </form>
      </div>
    );
  }

  return <PublicHome onNavigate={setActiveTab} />;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
            <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
