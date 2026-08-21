import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import PublicHome from './pages/PublicHome';
import ConstitutionEditor from './pages/admin/ConstitutionEditor';
import FundsManager from './pages/admin/FundsManager';
import BackupRestore from './pages/admin/BackupRestore';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import { 
  Home, Users, Wallet, HeartHandshake, Receipt, Clock, 
  Bell, BookOpen, Settings, LogOut, Shield, Download, LayoutDashboard
} from 'lucide-react';

// عارضی پیجز (تاکہ ویب سائٹ کریش نہ ہو)
const MembersPlaceholder = () => <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-blue-100"><Users className="w-16 h-16 mx-auto text-blue-200 mb-4" /><h2 className="text-2xl font-bold text-gray-700">ممبران کا پورٹل</h2><p className="text-gray-500 mt-2">یہاں ممبران کی فہرست اور اندراج کا فارم آئے گا</p></div>;
const DonationsPlaceholder = () => <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-blue-100"><HeartHandshake className="w-16 h-16 mx-auto text-blue-200 mb-4" /><h2 className="text-2xl font-bold text-gray-700">عطیات (Donations)</h2></div>;
const ExpensesPlaceholder = () => <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-blue-100"><Receipt className="w-16 h-16 mx-auto text-blue-200 mb-4" /><h2 className="text-2xl font-bold text-gray-700">اخراجات (Expenses)</h2></div>;

function Navigation({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const { settings } = useTheme();

  const navBtnClass = (tabName) => 
    `px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
      activeTab === tabName 
      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
      : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-11 h-11 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
            {settings?.shortName?.[0] || 'K'}
          </div>
          <div>
            <h1 className="font-extrabold text-gray-900 text-base leading-tight">{settings?.urName || 'کوزتیراج ویلفیئر'}</h1>
            <p className="text-xs text-gray-500">{settings?.enName || 'KWO Portal'}</p>
          </div>
        </div>

        {/* تمام نیویگیشن بٹنز */}
        <nav className="hidden lg:flex items-center gap-2">
          <button onClick={() => setActiveTab('home')} className={navBtnClass('home')}>
            <Home className="w-4 h-4" /> ہوم
          </button>
          
          <button onClick={() => setActiveTab('dastoor')} className={navBtnClass('dastoor')}>
            <BookOpen className="w-4 h-4" /> دستور
          </button>

          <button onClick={() => setActiveTab('super_admin')} className={navBtnClass('super_admin')}>
            <Shield className="w-4 h-4 text-rose-600" /> سوپر ایڈمن
          </button>

          <button onClick={() => setActiveTab('members')} className={navBtnClass('members')}>
            <Users className="w-4 h-4" /> ممبران
          </button>

          <button onClick={() => setActiveTab('funds')} className={navBtnClass('funds')}>
            <Wallet className="w-4 h-4" /> فنڈز
          </button>

          <button onClick={() => setActiveTab('donations')} className={navBtnClass('donations')}>
            <HeartHandshake className="w-4 h-4" /> عطیات
          </button>

          <button onClick={() => setActiveTab('expenses')} className={navBtnClass('expenses')}>
            <Receipt className="w-4 h-4" /> اخراجات
          </button>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <button onClick={logout} className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold flex items-center gap-2 transition-all">
              <LogOut className="w-4 h-4" /> لاگ آؤٹ
            </button>
          ) : (
            <button onClick={() => setActiveTab('login')} className="px-5 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold shadow-md hover:bg-blue-800 transition-all flex items-center gap-2">
              <Shield className="w-4 h-4"/> ایڈمن لاگ ان
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
  if (activeTab === 'super_admin') return <SuperAdminDashboard />;
  if (activeTab === 'members') return <MembersPlaceholder />;
  if (activeTab === 'donations') return <DonationsPlaceholder />;
  if (activeTab === 'expenses') return <ExpensesPlaceholder />;
  if (activeTab === 'funds') return <FundsManager />;

  if (activeTab === 'login') {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl border border-gray-100 shadow-xl space-y-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
             <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-800">ایڈمن لاگ ان</h2>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); login('super_admin'); setActiveTab('super_admin'); }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">یوزر نیم</label>
            <input type="text" required value={username} onChange={e=>setUsername(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-left" dir="ltr" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">پاس ورڈ</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-left" dir="ltr" />
          </div>
          <button type="submit" className="w-full py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-md">
            لاگ ان کریں
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
        <div className="min-h-screen flex flex-col bg-slate-50 text-right" dir="rtl">
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
            <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}