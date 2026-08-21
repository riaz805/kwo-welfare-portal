import React, { useState } from "react";
import {
  BookOpenText, Users, Wallet, Receipt, Bell, Settings, 
  X, CheckCircle2, ShieldCheck, FileText, AlertTriangle
} from "lucide-react";

// --- ممبران کا ڈیٹا (ایکسسل شیٹ کے مطابق) ---
const DEFAULT_MEMBERS = [
  { id: "1", name: "شیرین خان", phone: "-", status: "active", hasArrears: false, monthlyPaid: 10000, extraDonation: 13500 },
  { id: "2", name: "نصر اللہ", phone: "-", status: "active", hasArrears: false, monthlyPaid: 10000, extraDonation: 1800 },
  { id: "3", name: "ریاض", phone: "-", status: "active", hasArrears: false, monthlyPaid: 10000, extraDonation: 7500 },
  { id: "4", name: "حفیظ اللہ", phone: "-", status: "active", hasArrears: false, monthlyPaid: 10000, extraDonation: 18000 },
  { id: "5", name: "حمید اللہ", phone: "-", status: "active", hasArrears: false, monthlyPaid: 10000, extraDonation: 3500 },
  { id: "6", name: "سید اقبال شاہ", phone: "-", status: "active", hasArrears: true, monthlyPaid: 9000, extraDonation: 1000 },
  { id: "7", name: "سید انور", phone: "-", status: "active", hasArrears: true, monthlyPaid: 9000, extraDonation: 3100 },
  { id: "8", name: "سردار عالم", phone: "-", status: "active", hasArrears: true, monthlyPaid: 9000, extraDonation: 500 },
  { id: "9", name: "سید قہار", phone: "-", status: "active", hasArrears: false, monthlyPaid: 10000, extraDonation: 6200 },
  { id: "10", name: "اعجاز الحق", phone: "-", status: "active", hasArrears: false, monthlyPaid: 10000, extraDonation: 1500 },
  { id: "11", name: "نیاز اللہ", phone: "-", status: "active", hasArrears: true, monthlyPaid: 9000, extraDonation: 0 },
  { id: "12", name: "محمد وقاص", phone: "-", status: "active", hasArrears: false, monthlyPaid: 10000, extraDonation: 5900 },
  { id: "13", name: "فواد احمد", phone: "-", status: "active", hasArrears: true, monthlyPaid: 9000, extraDonation: 0 },
  { id: "14", name: "ضیاء اللہ", phone: "-", status: "active", hasArrears: true, monthlyPaid: 9000, extraDonation: 1000 },
  { id: "15", name: "محراب خان", phone: "-", status: "active", hasArrears: true, monthlyPaid: 8000, extraDonation: 0 },
  { id: "16", name: "امین اللہ", phone: "-", status: "active", hasArrears: true, monthlyPaid: 2000, extraDonation: 0 },
];

// --- دستورِ تنظیم کا ڈیٹا (پی ڈی ایف سے ماخوذ) ---
const CONSTITUTION_SECTIONS = [
  {
    title: "دیباچہ",
    content: "الحمد لله رب العالمين، والصلوة والسلام على سيد الانبياء والمرسلين، اما بعد... انسانی معاشرے کی بقا و ترقی باہمی تعاون، اخوت، ہمدردی اور احساس ذمہ داری کے اصولوں پر استوار ہوتی ہے۔ کوز تیراج ویلفیئر آرگنائزیشن کا قیام یکم نومبر 2025ء کو لاہور میں عمل میں آیا جس کا مقصد باہمی تعاون، ضرورت مندوں کی اعانت اور فلاحی منصوبوں کو منظم کرنا ہے[span_1](start_span)[span_1](end_span)."
  },
  {
    title: "دفعہ نمبر 1: نام",
    content: "تنظیم کا نام 'کوز تیراج ویلفیئر آرگنائزیشن' رکھا گیا ہے۔ یہ تنظیم باہمی تعاون اور اتفاق رائے سے قائم کی گئی ہے[span_2](start_span)[span_2](end_span)."
  },
  {
    title: "دفعہ نمبر 2: نفاذ دستور",
    content: "یہ دستور یکم نومبر 2025ء سے نافذالعمل ہوگا۔ اس کے تمام اصول و ضوابط اسی تاریخ سے مؤثر سمجھے جائیں گے[span_3](start_span)[span_3](end_span)."
  },
  {
    title: "دفعہ نمبر 3: ماہانہ فنڈ",
    content: "ہر فعال رکن پر لازم ہوگا کہ وہ ہر مہینے کی 1، 2 یا 3 تاریخ کو 1000 روپے (ایک ہزار روپے) بطورِ وقف جمع کرائے۔ فنڈ میں کمی بیشی تمام اراکین کی مشاورت سے ہو سکتی ہے[span_4](start_span)[span_4](end_span)."
  },
  {
    title: "دفعہ نمبر 4: فنڈ کے استعمال کا دائرہ",
    content: "یہ فنڈ صرف لاہور میں مقیم فعال رکن یا اس کے اہل خانہ کی وفات کی صورت میں کفن، غسل، تابوت، تدفین اور میت کو آبائی گھر تک پہنچانے کے اخراجات کے لیے استعمال ہوگا[span_5](start_span)[span_5](end_span)."
  },
  {
    title: "دفعہ نمبر 5: اراکین کی فیملی حیثیت اور احاطہ",
    content: "فیملی ممبر سے مراد قریبی خونی رشتہ دار (والدین، شریک حیات، اولاد، بہن، بھائی) ہیں جو لاہور میں مقیم ہوں۔ عارضی یا مستقل قیام پر بھی اصول لاگو ہوگا[span_6](start_span)[span_6](end_span)."
  },
  {
    title: "دفعہ نمبر 6: تنظیمی انتظام و مالیات",
    content: "تنظیم میں تین مرکزی عہدے ہوں گے: سرپرست اعلیٰ، سیکرٹری (اطلاعات و واٹس ایپ گروپ)، اور سیکرٹری مالیات (فنڈز اور حسابات کی نگرانی)[span_7](start_span)[span_7](end_span)."
  },
  {
    title: "دفعہ نمبر 7: وفات کے موقع پر مہمانوں کی ضیافت",
    content: "میت کی روانگی یا تدفین تک آنے والے تمام مہمانوں کے چائے اور کھانے کے انتظامات مرکزی فنڈ سے کمیٹی کے ذریعے کیے جائیں گے[span_8](start_span)[span_8](end_span)."
  },
  {
    title: "دفعہ نمبر 8: غیر مقیم فیملی یا لاہور سے باہر وفات",
    content: "اگر وفات لاہور سے باہر ہو تو عمومی طور پر فنڈ استعمال نہیں ہوگا، تاہم مشاورتی فیصلے کے تحت پچاس فیصد یا مساوی اخراجات میں معاونت کی جا سکتی ہے[span_9](start_span)[span_9](end_span)."
  },
  {
    title: "دفعہ نمبر 9: تنظیم کے قیام کے وقت شامل نہ ہونے والے اراکین",
    content: "قیام کے وقت شامل نہ ہونے والے یا بعد میں آنے والوں کو یکم نومبر 2025 سے تمام بقایا جات اور اضافی التزام مالی ادا کرنا ہوگا[span_10](start_span)[span_10](end_span)."
  },
  {
    title: "دفعہ نمبر 10: استعفیٰ، علیحدگی، اخراج اور متوازی تنظیم سازی",
    content: "علیحدگی یا اخراج کی صورت میں تمام فنڈز اور اثاثہ جات تنظیم کی اجتماعی ملکیت رہیں گے۔ دوبارہ شمولیت کے لیے بقایا جات اور 5000 روپے التزام مالی لازم ہوگا[span_11](start_span)[span_11](end_span)."
  },
  {
    title: "دفعہ نمبر 11: وفات کی صورت میں ہنگامی شمولیت",
    content: "میت کے وقت ہنگامی شمولیت کی درخواست پر تمام بقایا جات، 5000 روپے جرمانہ/التزام، اور کم از کم 50 فیصد اخراجات نقد ادا کرنا ہوں گے[span_12](start_span)[span_12](end_span)."
  },
  {
    title: "دفعہ نمبر 12: ترمیم اور اضافہ",
    content: "فعال اراکین باہمی مشاورت سے دستور میں ترمیم یا نئی دفعہ کا اضافہ کر سکتے ہیں[span_13](start_span)[span_13](end_span)."
  },
  {
    title: "دفعہ نمبر 13: انفرادی و فیملی اراکین کے فنڈ کی یکسانیت",
    content: "تمام فعال اراکین خواہ انفرادی ہوں یا فیملی والے، ماہانہ فنڈ کی ادائیگی میں یکساں تصور ہوں گے[span_14](start_span)[span_14](end_span)."
  },
  {
    title: "دفعہ نمبر 14: عارضی غیر موجودگی",
    content: "عارضی طور پر گاؤں جانے کی صورت میں اگر مدت ایک مہینے سے زیادہ ہو تو صرف پہلے مہینے کا فنڈ لیا جائے گا، باقی مدت میں معطل نہیں بلکہ غیر حاضر تصور ہوں گے[span_15](start_span)[span_15](end_span)."
  },
  {
    title: "دفعہ نمبر 15: بہن یا بیٹی کی وفات سے متعلق اصول",
    content: "لاہور کے علاوہ دوسرے مقام پر شادی شدہ بہن یا بیٹی کی وفات پر تنظیم کی مالی ذمہ داری نہیں ہوگی[span_16](start_span)[span_16](end_span)."
  },
  {
    title: "دفعہ نمبر 16: بچوں کی وفات کی صورت میں معاونت",
    content: "3 سال یا اس سے کم عمر بچے کی وفات پر تنظیم کی طرف سے 30,000 روپے نقد اور تدفین میں معاونت فراہم کی جائے گی[span_17](start_span)[span_17](end_span)."
  }
];

export default function App() {
  const [view, setView] = useState("home"); // "home", "members", "constitution", "admin"
  const [members] = useState(DEFAULT_MEMBERS);
  const [notices] = useState([
    { id: "n-1", title: "فوری اطلاع", text: "تمام اراکین کا ڈیٹا اور دستور کامیابی کے ساتھ اپ ڈیٹ کر دیا گیا ہے۔", date: "2026-08-21", active: true }
  ]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FBF9F4", color: "#1F2A24", fontFamily: "system-ui, sans-serif", direction: "rtl" }}>
      
      {/* ہیڈر / نیویگیشن بار */}
      <header style={{ backgroundColor: "#0B4F3F", color: "#FFFFFF", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "bold" }}>کوز تیراج ویلفیئر آرگنائزیشن</h1>
          <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", opacity: 0.9 }}>Koztiraj Welfare Organization (KWO)</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setView("home")} style={navBtnStyle(view === "home")}>ہوم پیج</button>
          <button onClick={() => setView("members")} style={navBtnStyle(view === "members")}>اراکین اور فنڈ</button>
          <button onClick={() => setView("constitution")} style={navBtnStyle(view === "constitution")}>دستورِ تنظیم</button>
          <button onClick={() => setView("admin")} style={{ ...navBtnStyle(view === "admin"), backgroundColor: "#B8862B" }}>
            <Settings size={16} style={{ display: "inline", marginLeft: "4px" }} /> ایڈمن پینل
          </button>
        </div>
      </header>

      {/* نوٹس بار */}
      {notices.map(n => (
        <div key={n.id} style={{ backgroundColor: "#F4E9D2", color: "#856404", padding: "10px 24px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #E4DFCF" }}>
          <Bell size={18} />
          <span style={{ fontWeight: "bold" }}>{n.title}:</span>
          <span>{n.text}</span>
        </div>
      ))}

      {/* مرکزی مواد */}
      <main style={{ padding: "30px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* 1. ہوم پیج ویو */}
        {view === "home" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "40px", padding: "40px", backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E4DFCF" }}>
              <h2 style={{ fontSize: "2rem", color: "#0B4F3F", marginBottom: "15px" }}>خوش آمدید</h2>
              <p style={{ fontSize: "1.1rem", color: "#5B6B62", maxWidth: "700px", margin: "0 auto 25px auto" }}>
                کوز تیراج ویلفیئر آرگنائزیشن کا باضابطہ ڈیجیٹل پورٹل۔ باہمی تعاون، اخوت اور فلاحی خدمات کا مستقل مرکز[span_18](start_span)[span_18](end_span).
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                <button onClick={() => setView("members")} style={primaryBtnStyle}>اراکین اور فنڈز کی تفصیل</button>
                <button onClick={() => setView("constitution")} style={secondaryBtnStyle}>دستورِ تنظیم کا مطالعہ کریں</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              <div style={cardStyle}>
                <Users color="#0B4F3F" size={32} />
                <h3 style={{ margin: "15px 0 10px 0" }}>کل فعال اراکین</h3>
                <p style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#0B4F3F", margin: 0 }}>16</p>
                <p style={{ fontSize: "0.9rem", color: "#5B6B62", marginTop: "5px" }}>تمام رجسٹرڈ اراکین فعال ہیں۔</p>
              </div>
              <div style={cardStyle}>
                <Wallet color="#0B4F3F" size={32} />
                <h3 style={{ margin: "15px 0 10px 0" }}>ماہانہ فنڈ اور عطیات</h3>
                <p style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#0B4F3F", margin: 0 }}>مستحکم نظام</p>
                <p style={{ fontSize: "0.9rem", color: "#5B6B62", marginTop: "5px" }}>باقاعدہ شفاف ریکارڈ برقرار ہے۔</p>
              </div>
              <div style={cardStyle}>
                <ShieldCheck color="#0B4F3F" size={32} />
                <h3 style={{ margin: "15px 0 10px 0" }}>شفافیت اور ضابطہ</h3>
                <p style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#0B4F3F", margin: 0 }}>دستور یافتہ</p>
                <p style={{ fontSize: "0.9rem", color: "#5B6B62", marginTop: "5px" }}>تمام دفعات باہمی اتفاق رائے سے منظور شدہ[span_19](start_span)[span_19](end_span).</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. اراکین اور فنڈ ویو */}
        {view === "members" && (
          <div>
            <h2 style={{ color: "#0B4F3F", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Users /> اراکین کی فہرست اور فنڈ کی تفصیل
            </h2>
            <div style={{ overflowX: "auto", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E4DFCF" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right" }}>
                <thead>
                  <tr style={{ backgroundColor: "#E7EFE9", color: "#083B2F", borderBottom: "2px solid #E4DFCF" }}>
                    <th style={thStyle}>شمار</th>
                    <th style={thStyle}>نام رکن</th>
                    <th style={thStyle}>ماہانہ فنڈ</th>
                    <th style={thStyle}>عطیات / اضافی رقم</th>
                    <th style={thStyle}>حیثیت / بقایاجات</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m, index) => (
                    <tr key={m.id} style={{ borderBottom: "1px solid #E4DFCF", backgroundColor: m.hasArrears ? "#FFF5F5" : "transparent" }}>
                      <td style={tdStyle}>{index + 1}</td>
                      <td style={{ ...tdStyle, fontWeight: "bold" }}>{m.name}</td>
                      <td style={tdStyle}>{m.monthlyPaid} روپے</td>
                      <td style={tdStyle}>{m.extraDonation} روپے</td>
                      <td style={tdStyle}>
                        {m.hasArrears ? (
                          <span style={{ color: "#D9534F", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.9rem" }}>
                            <AlertTriangle size={16} /> بقایاجات / ادائيگی باقی
                          </span>
                        ) : (
                          <span style={{ color: "#28A745", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.9rem" }}>
                            <CheckCircle2 size={16} /> مکمل ادا شدہ
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. دستورِ تنظیم ویو */}
        {view === "constitution" && (
          <div>
            <h2 style={{ color: "#0B4F3F", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <FileText /> کوز تیراج ویلفیئر آرگنائزیشن - دستورِ تنظیم
            </h2>
            <p style={{ color: "#5B6B62", marginBottom: "25px" }}>مورخہ 19 جنوری 2026 تک اپ ڈیٹ شدہ مکمل دستور[span_20](start_span)[span_20](end_span)</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {CONSTITUTION_SECTIONS.map((sec, idx) => (
                <div key={idx} style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "8px", border: "1px solid #E4DFCF" }}>
                  <h3 style={{ color: "#0B4F3F", marginTop: 0, marginBottom: "10px", borderBottom: "1px solid #E7EFE9", paddingBottom: "8px" }}>
                    {sec.title}
                  </h3>
                  <p style={{ margin: 0, lineHeight: "1.8", color: "#333333" }}>
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ایڈمن پینل ویو */}
        {view === "admin" && (
          <div style={{ backgroundColor: "#FFFFFF", padding: "30px", borderRadius: "12px", border: "1px solid #E4DFCF" }}>
            <h2 style={{ color: "#0B4F3F", marginBottom: "20px" }}>ایڈمن ڈیش بورڈ</h2>
            <p style={{ color: "#5B6B62", marginBottom: "20px" }}>یہاں سے آپ اراکین کے کوائف، فنڈز اور نوٹس کا انتظام کر سکتے ہیں۔</p>
            <button onClick={() => setView("home")} style={primaryBtnStyle}>ہوم پیج پر واپس جائیں</button>
          </div>
        )}

      </main>
    </div>
  );
}

// اسٹائلنگ کے چھوٹے فنکشنز
const navBtnStyle = (isActive) => ({
  backgroundColor: isActive ? "#083B2F" : "transparent",
  color: "#FFFFFF",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "0.9rem"
});

const primaryBtnStyle = {
  backgroundColor: "#0B4F3F",
  color: "#FFFFFF",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem"
};

const secondaryBtnStyle = {
  backgroundColor: "transparent",
  color: "#0B4F3F",
  border: "2px solid #0B4F3F",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem"
};

const cardStyle = {
  backgroundColor: "#FFFFFF",
  padding: "24px",
  borderRadius: "8px",
  border: "1px solid #E4DFCF",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
};

const thStyle = {
  padding: "12px 16px",
  fontSize: "0.95rem",
  fontWeight: "bold",
  borderBottom: "2px solid #E4DFCF"
};

const tdStyle = {
  padding: "12px 16px",
  fontSize: "0.95rem"
};