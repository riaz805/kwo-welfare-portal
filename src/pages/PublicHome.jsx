import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  BookOpen, Users, Wallet, HeartHandshake, Receipt, Clock, 
  Bell, Calendar, Award, FileText, Info, Phone, Search, ShieldCheck 
} from 'lucide-react';
import { dbService } from '../services/dbService';

const ICON_MAP = {
  BookOpen, Users, Wallet, HeartHandshake, Receipt, Clock,
  Bell, Calendar, Award, FileText, Info, Phone
};

export default function PublicHome({ onNavigate }) {
  const { settings } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [notices, setNotices] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadPublicData = async () => {
      const allNotices = await dbService.getAll('notices');
      const allActivities = await dbService.getAll('activities');
      setNotices(allNotices.filter(n => n.status === 'Active').slice(0, 3));
      setActivities(allActivities.slice(0, 3));
    };
    loadPublicData();
  }, []);

  const visibleCards = (settings.cards || [])
    .filter(c => c.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
          {settings.logoUrl && (
            <img src={settings.logoUrl} alt="Logo" className="w-24 h-24 mx-auto rounded-full bg-white p-2 shadow-md" />
          )}
          <h1 className="text-3xl md:text-5xl font-black tracking-wide">{settings.urName}</h1>
          <p className="text-emerald-100 text-lg font-medium tracking-wider">{settings.enName} ({settings.shortName})</p>
          
          {/* Universal Search */}
          <div className="pt-4 max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="ویب سائٹ میں تلاش کریں (دستور، نوٹس، سرگرمیاں...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3.5 px-12 rounded-2xl bg-white/95 text-gray-800 placeholder-gray-500 shadow-inner focus:outline-none focus:ring-4 focus:ring-emerald-300 text-sm md:text-base"
            />
            <Search className="absolute right-4 top-4 text-emerald-600 w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Main Grid Navigation (Cards) */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {visibleCards.map((card) => {
          const IconComp = ICON_MAP[card.icon] || Info;
          return (
            <button
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all group text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <IconComp className="w-7 h-7" />
              </div>
              <span className="font-bold text-gray-800 text-base md:text-lg group-hover:text-emerald-700">{card.title}</span>
            </button>
          );
        })}
      </section>

      {/* Latest Announcements */}
      {notices.length > 0 && (
        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="text-emerald-600 w-5 h-5" /> اہم اعلانات و نوٹسز
            </h2>
            <button onClick={() => onNavigate('notices')} className="text-sm font-semibold text-emerald-600 hover:underline">
              تمام دیکھیں
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {notices.map((notice) => (
              <div key={notice.id} className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-2">
                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-200 text-amber-900 rounded-md">
                  {notice.type || 'عام نوٹس'}
                </span>
                <h3 className="font-bold text-gray-900 text-base">{notice.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{notice.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
