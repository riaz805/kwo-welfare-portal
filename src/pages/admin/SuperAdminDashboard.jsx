import React, { useState } from 'react';
import { 
  Shield, Palette, Image, UserPlus, Settings, CheckCircle2, 
  Trash2, Save, Globe, Sliders, Lock, Circle, Eye 
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('branding');

  // 1. برانڈنگ سٹیٹ
  const [siteInfo, setSiteInfo] = useState({
    urName: 'کوزتیراج ویلفیئر آرگنائزیشن',
    enName: 'Koztiraj Welfare Organization (KWO)',
    shortName: 'KWO',
    logoUrl: ''
  });

  // 2. تھیم سٹیٹ
  const [theme, setTheme] = useState({
    primaryColor: 'blue',
    darkMode: false,
  });

  // 3. یوزرز کی لسٹ
  const [users, setUsers] = useState([
    { id: 1, name: 'ریاض (سوپر ایڈمن)', email: 'admin@kwo.com', role: 'Super Admin', permissions: { funds: true, expenses: true, members: true, dastoor: true } },
    { id: 2, name: 'خزانچی (Cashier)', email: 'cashier@kwo.com', role: 'Manager', permissions: { funds: true, expenses: true, members: false, dastoor: false } }
  ]);

  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [newPerms, setNewPerms] = useState({ funds: true, expenses: false, members: false, dastoor: false });

  const togglePermission = (type) => {
    setNewPerms({ ...newPerms, [type]: !newPerms[type] });
  };

  const colors = [
    { name: 'رائل بلیو', value: 'blue', bg: 'bg-blue-600' },
    { name: 'ایمرلڈ سبز', value: 'emerald', bg: 'bg-emerald-600' },
    { name: 'ڈیپ ارغوانی', value: 'purple', bg: 'bg-purple-600' },
    { name: 'روز ریڈ', value: 'rose', bg: 'bg-rose-600' },
    { name: 'ڈارک سلیٹ', value: 'slate', bg: 'bg-slate-800' },
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* ٹاپ ہیڈر */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Shield className="w-8 h-8 text-rose-600" />
            مکمل ماسٹر ڈیش بورڈ (Super Admin)
          </h2>
          <p className="text-gray-500 text-xs mt-1">ویب سائٹ کے نام، کلر، مونوگرام اور تمام یوزرز کے اختیارات کا مکمل کنٹرول</p>
        </div>
        
        {/* نیویگیشن ٹیبز */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl gap-1">
          <button onClick={() => setActiveTab('branding')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'branding' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>
            <Globe className="w-4 h-4" /> نام و مونوگرام
          </button>
          <button onClick={() => setActiveTab('theme')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'theme' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>
            <Palette className="w-4 h-4" /> کلر و تھیم
          </button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>
            <UserPlus className="w-4 h-4" /> اختیارات و یوزرز
          </button>
        </div>
      </div>

      {/* 1. نام اور مونوگرام کی تبدیلی */}
      {activeTab === 'branding' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" /> تنظیم کی معلومات اور مونوگرام
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">تنظیم کا اردو نام</label>
              <input type="text" value={siteInfo.urName} onChange={(e) => setSiteInfo({...siteInfo, urName: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">تنظیم کا انگریزی نام</label>
              <input type="text" value={siteInfo.enName} onChange={(e) => setSiteInfo({...siteInfo, enName: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-left font-sans" dir="ltr" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">مختصر نام / شارٹ کوڈ (Short Name)</label>
              <input type="text" value={siteInfo.shortName} onChange={(e) => setSiteInfo({...siteInfo, shortName: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">لوگو / مونوگرام کا تصویری لنک (Image URL)</label>
              <input type="text" placeholder="https://example.com/logo.png" value={siteInfo.logoUrl} onChange={(e) => setSiteInfo({...siteInfo, logoUrl: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-left" dir="ltr" />
            </div>
          </div>
          <button className="px-6 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all flex items-center gap-2 shadow-md">
            <Save className="w-4 h-4" /> برانڈنگ اپڈیٹ کریں
          </button>
        </div>
      )}

      {/* 2. کلر تھیم اور ڈیزائن */}
      {activeTab === 'theme' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-600" /> ویب سائٹ کا بنیادی رنگ (Theme Color)
          </h3>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-3">اپنی پسند کا تھیم کلر منتخب کریں:</label>
            <div className="flex flex-wrap gap-4">
              {colors.map((c) => (
                <button key={c.value} onClick={() => setTheme({...theme, primaryColor: c.value})} className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all ${theme.primaryColor === c.value ? 'border-gray-900 bg-gray-50 shadow-md scale-105' : 'border-gray-100'}`}>
                  <span className={`w-6 h-6 rounded-full ${c.bg}`}></span>
                  <span className="font-bold text-sm text-gray-700">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
          <button className="px-6 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all flex items-center gap-2 shadow-md">
            <Save className="w-4 h-4" /> نیا کلر تھیم لاگو کریں
          </button>
        </div>
      )}

      {/* 3. یوزرز اور اختیارات */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 h-fit">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" /> نیا ایڈمن / یوزر بنائیں
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">نام</label>
                <input type="text" placeholder="نام درج کریں" className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">ای میل</label>
                <input type="email" placeholder="email@example.com" className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-left" dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">پاس ورڈ</label>
                <input type="password" placeholder="پاس ورڈ بنائیں" className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-left" dir="ltr" />
              </div>

              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-800 mb-2">کام کے اختیارات (Permissions):</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg text-xs" onClick={() => togglePermission('funds')}>
                    {newPerms.funds ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4 text-gray-300" />}
                    <span>فنڈز اور عطیات کا اندراج</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg text-xs" onClick={() => togglePermission('expenses')}>
                    {newPerms.expenses ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4 text-gray-300" />}
                    <span>اخراجات کا حساب کتاب</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg text-xs" onClick={() => togglePermission('members')}>
                    {newPerms.members ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4 text-gray-300" />}
                    <span>نیا ممبر شامل کرنا / ترمیم</span>
                  </label>
                </div>
              </div>

              <button className="w-full py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-md">
                <Save className="w-4 h-4" /> یوزر کو محفوظ کریں
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-gray-600" /> تمام فعال منتظمین (Admins List)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-gray-50 text-gray-600 font-bold">
                  <tr>
                    <th className="p-3 rounded-r-xl">یوزر</th>
                    <th className="p-3">عہدہ</th>
                    <th className="p-3">دیے گئے اختیارات</th>
                    <th className="p-3 rounded-l-xl text-center">ایکشن</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-blue-50/50 transition-all">
                      <td className="p-3 py-4">
                        <div className="font-bold text-gray-800 text-sm">{u.name}</div>
                        <div className="text-gray-400" dir="ltr">{u.email}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${u.role === 'Super Admin' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1 flex-wrap">
                          {u.permissions.funds && <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold border border-emerald-100">فنڈز</span>}
                          {u.permissions.expenses && <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-bold border border-orange-100">اخراجات</span>}
                          {u.permissions.members && <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded font-bold border border-purple-100">ممبران</span>}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        {u.role !== 'Super Admin' && (
                          <button className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="حذف کریں">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}