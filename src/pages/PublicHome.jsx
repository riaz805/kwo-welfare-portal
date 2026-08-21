import React from 'react';
import { 
  Users, Wallet, HeartHandshake, Receipt, BookOpen, 
  Shield, Globe, ArrowLeft, Sparkles, Building2 
} from 'lucide-react';

export default function PublicHome({ onNavigate }) {
  // مین پیج کے رنگین کارڈز کی فہرست
  const cards = [
    {
      title: 'فنڈز مینجمنٹ',
      desc: 'عطیات، جمع شدہ رقم اور مکمل مالیاتی لیجر',
      icon: <Wallet className="w-8 h-8 text-white mb-2" />,
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-700',
      tab: 'funds'
    },
    {
      title: 'ممبران کا پورٹل',
      desc: 'تنظیم کے تمام فعال ممبران کی تفصیلات',
      icon: <Users className="w-8 h-8 text-white mb-2" />,
      gradient: 'bg-gradient-to-br from-purple-500 to-indigo-700',
      tab: 'members'
    },
    {
      title: 'دستورِ تنظیم',
      desc: 'آئین، قوانین اور تنظیم کے اصول و ضوابط',
      icon: <BookOpen className="w-8 h-8 text-white mb-2" />,
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-700',
      tab: 'dastoor'
    },
    {
      title: 'عطیات (Donations)',
      desc: 'نئے عطیات کی انٹری اور امدادی ریکارڈ',
      icon: <HeartHandshake className="w-8 h-8 text-white mb-2" />,
      gradient: 'bg-gradient-to-br from-pink-500 to-rose-700',
      tab: 'donations'
    },
    {
      title: 'اخراجات (Expenses)',
      desc: 'فلاحی کاموں کے اخراجات اور بلز کا حساب',
      icon: <Receipt className="w-8 h-8 text-white mb-2" />,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-700',
      tab: 'expenses'
    },
    {
      title: 'سوپر ایڈمن پینل',
      desc: 'ویب سائٹ کا نام، مونوگرام اور مکمل کنٹرول',
      icon: <Shield className="w-8 h-8 text-white mb-2" />,
      gradient: 'bg-gradient-to-br from-slate-700 to-slate-900',
      tab: 'super_admin'
    }
  ];

  return (
    <div className="space-y-8 text-right py-4" dir="rtl">
      {/* ویلکم ہیرو سیکشن */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute -left-10 -top-10 opacity-10">
          <Building2 className="w-64 h-64" />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold mb-4 border border-white/20">
          <Sparkles className="w-4 h-4 text-yellow-300" /> کوزتیراج ویلفیئر پورٹل
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
          خوش آمدید! تنظیم کا مرکزی فلاحی نظام
        </h1>
        <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
          یہاں سے آپ فنڈز، ممبران، اخراجات اور تنظیم کے تمام امور کا تفصیلی جائزہ لے سکتے ہیں۔ نیچے دیے گئے کسی بھی کارڈ پر کلک کر کے متعلقہ سیکشن کھولیں۔
        </p>
      </div>

      {/* ریسپانسیو کلرفل کارڈز گریڈ (موبائل پر 2، لیپ ٹاپ پر 4 کالمز) */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-gray-800 px-2 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          فوری رسائی کے لیے مین سیکشنز
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => onNavigate(card.tab)}
              className={`${card.gradient} text-white p-5 md:p-6 rounded-2xl shadow-lg cursor-pointer transform hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
            >
              <div className="absolute -left-3 -bottom-3 opacity-10 group-hover:opacity-20 transition-all">
                {card.icon}
              </div>
              <div>
                {card.icon}
                <h3 className="text-base md:text-lg font-black mb-1 group-hover:underline">{card.title}</h3>
                <p className="text-[11px] md:text-xs text-white/80 leading-relaxed">{card.desc}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-bold">
                <span>تفصیل دیکھیں</span>
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}