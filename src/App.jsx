import React, { useState } from "react";
import {
  BookOpenText,
  Users,
  Wallet,
  HeartHandshake,
  Receipt,
  AlertCircle,
  Bell,
  Activity,
  Award,
  FileBarChart,
  Info,
  Phone,
  ShieldCheck,
  ClipboardList,
  Menu,
  X,
  Settings,
  ArrowRight,
  Save,
  UserPlus,
  Trash2,
  UserCheck,
  UserX,
  CheckCircle2,
  PlusCircle,
  AlertTriangle,
  Megaphone
} from "lucide-react";

const ICON_MAP = {
  book: BookOpenText,
  users: Users,
  wallet: Wallet,
  heart: HeartHandshake,
  receipt: Receipt,
  alert: AlertCircle,
  bell: Bell,
  activity: Activity,
  award: Award,
  report: FileBarChart,
  info: Info,
  phone: Phone,
  shield: ShieldCheck,
  list: ClipboardList,
};

const DEFAULT_SITE_CONFIG = {
  orgNameUrdu: "کوزتیراج ویلفیئر آرگنائزیشن",
  orgNameEnglish: "Koztiraj Welfare Organization",
  shortName: "KWO",
  homeHeading: "خوش آمدید",
  homeSubheading: "فلاحی برادری کا باضابطہ ڈیجیٹل پورٹل - شفاف مالیات، عطیات اور اعلانات کا نظام۔",
  theme: {
    primary: "#0B4F3F",
    primaryDark: "#083B2F",
    primarySoft: "#E7EFE9",
    accent: "#B8862B",
    accentSoft: "#F4E9D2",
    background: "#FBF9F4",
    backgroundAlt: "#F5F0E3",
    surface: "#FFFFFF",
    textStrong: "#1F2A24",
    textMuted: "#5B6B62",
    border: "#E4DFCF",
  },
};

const DEFAULT_CARD_REGISTRY = [
  { id: "constitution", order: 1, visible: true, title: "دستور", text: "تنظیم کا آئین اور اصول", icon: "book" },
  { id: "members", order: 2, visible: true, title: "ممبران", text: "فعال اور غیر فعال ممبران", icon: "users" },
  { id: "funds", order: 3, visible: true, title: "فنڈز اور لیجر", text: "کل فنڈ اور بقایا جات کا حساب", icon: "wallet" },
  { id: "donations", order: 4, visible: true, title: "عطیات کی تفصیل", text: "ماہانہ فنڈ سے زائد اور اضافی عطیات", icon: "heart" },
  { id: "expenses", order: 5, visible: true, title: "اخراجات", text: "کیٹیگری وائز خرچوں کی تفصیل", icon: "receipt" },
  { id: "arrears", order: 6, visible: true, title: "بقایاجات", text: "واجب الادا فنڈز اور سرخ نشان", icon: "alert" },
  { id: "notices", order: 7, visible: true, title: "نوٹس بورڈ", text: "اہم اعلانات اور نوٹیفیکیشنز", icon: "bell" },
  { id: "volunteers", order: 8, visible: true, title: "رضاکار حضرات", text: "خدمات انجام دینے والے ساتھی", icon: "shield" },
];

const DEFAULT_MEMBERS = [
  { id: "m-1", name: "عمران خان", phone: "0300-1234567", status: "active", hasArrears: false, monthlyPaid: 1500, extraDonation: 500 },
  { id: "m-2", name: "علی احمد", phone: "0300-9876543", status: "active", hasArrears: true, monthlyPaid: 1000, extraDonation: 0 },
  { id: "m-3", name: "محمد بلال", phone: "0333-5554433", status: "inactive", hasArrears: false, monthlyPaid: 1000, extraDonation: 1000 },
];

const DEFAULT_EXTERNAL_DONATIONS = [
  { id: "ed-1", donorName: "حاجی عبدالرحمن (خیر خواہ)", amount: 10000, note: "مستحقین کے راشن کے لیے عطیہ", date: "2026-05-12" },
  { id: "ed-2", donorName: "محمد فاروق (باہر مقیم)", amount: 5000, note: "تنظیم کے فلاحی کاموں میں معاونت", date: "2026-05-18" },
];

const DEFAULT_EXPENSES = [
  { id: "e-1", category: "مستحقین کی امداد", amount: 15000, date: "2026-05-10", note: "بیوہ خاندان کو راشن" },
];

const DEFAULT_EXPENSE_CATEGORIES = ["مستحقین کی امداد", "دفتری اخراجات", "مرمت و مرمتی کام", "دیگر فلاحی مد"];

const DEFAULT_VOLUNTEERS = [
  { id: "v-1", name: "احمد علی", role: "نگرانِ مالیات و فنڈز", phone: "0300-1112233" },
  { id: "v-2", name: "قاسم رضا", role: "رضاکار و رابطہ کار", phone: "0321-4445566" },
];

const DEFAULT_NOTICES = [
  { id: "n-1", title: "موجودہ ماہ کا فنڈ", text: "تمام اراکین سے گزارش ہے کہ وہ رواں ماہ کا فنڈ بروقت جمع کروائیں۔", date: "2026-05-20", active: true },
  { id: "n-2", title: "نیا نوٹس / اعلان", text: "تنظیم کے نئے اجلاس کی تاریخ جلد مطلع کی جائے گی۔", date: "2026-05-21", active: true },
];

const DEFAULT_CONSTITUTION = `1. تنظیم کا نام: کوزتیراج ویلفیئر آرگنائزیشن ہوگا۔
2. مقاصد: غریب اور مستحق افراد کی مدد، تعلیم اور صحت کے شعبے میں فلاحی کام کرنا۔
3. ماہانہ فنڈ: ہر ممبر پر لازم ہوگا کہ وہ طے شدہ ماہانہ فنڈ بروقت جمع کروائے بصورتِ دیگر بقایاجات میں نام آئے گا۔`;

export default function App() {
  const [view, setView] = useState("home");
  const [siteConfig, setSiteConfig] = useState(DEFAULT_SITE_CONFIG);
  const [cardRegistry, setCardRegistry] = useState(DEFAULT_CARD_REGISTRY);
  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [externalDonations, setExternalDonations] = useState(DEFAULT_EXTERNAL_DONATIONS);
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
  const [expenseCategories, setExpenseCategories] = useState(DEFAULT_EXPENSE_CATEGORIES);
  const [volunteers, setVolunteers] = useState(DEFAULT_VOLUNTEERS);
  const [notices, setNotices] = useState(DEFAULT_NOTICES);
  const [constitutionText, setConstitutionText] = useState(DEFAULT_CONSTITUTION);
  const [monthlyFundAmount, setMonthlyFundAmount] = useState(1000);

  function applyChanges(next) {
    setSiteConfig(next.siteConfig);
    setCardRegistry(next.cardRegistry);
    setMembers(next.members);
    setExternalDonations(next.externalDonations);
    setExpenses(next.expenses);
    setExpenseCategories(next.expenseCategories);
    setVolunteers(next.volunteers);
    setNotices(next.notices);
    setConstitutionText(next.constitutionText);
    setMonthlyFundAmount(next.monthlyFundAmount);
  }

  return (
    <HomePage
      siteConfig={siteConfig}
      cardRegistry={cardRegistry}
      members={members}
      externalDonations={externalDonations}
      expenses={expenses}
      expenseCategories={expenseCategories}
      volunteers={volunteers}
      notices={notices}
      constitutionText={constitutionText}
      monthlyFundAmount={monthlyFundAmount}
      onOpenAdmin={() => setView("admin")}
      isAdminMode={view === "admin"}
      onCloseAdmin={() => setView("home")}
      onApplyChanges={applyChanges}
    />
  );
}

function HomePage({
  siteConfig,
  cardRegistry,
  members,
  externalDonations,
  expenses,
  expenseCategories,
  volunteers,
  notices,
  constitutionText,
  monthlyFundAmount,
  onOpenAdmin,
  isAdminMode,
  onCloseAdmin,
  onApplyChanges,
}) {
  const [activeModal, setActiveModal] = useState(null); 
  
  // Admin Draft States
  const [draftMembers, setDraftMembers] = useState(members);
  const [draftExtDonations, setDraftExtDonations] = useState(externalDonations);
  const [draftExpenses, setDraftExpenses] = useState(expenses);
  const [draftCategories, setDraftCategories] = useState(expenseCategories);
  const [draftVolunteers, setDraftVolunteers] = useState(volunteers);
  const [draftNotices, setDraftNotices] = useState(notices);
  const [draftConstitution, setDraftConstitution] = useState(constitutionText);
  const [draftFundAmount, setDraftFundAmount] = useState(monthlyFundAmount);
  const [savedFlash, setSavedFlash] = useState(false);

  // New Form states inside Admin
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newMonthlyPaid, setNewMonthlyPaid] = useState(monthlyFundAmount);
  const [newExtraDonation, setNewExtraDonation] = useState("");

  const [extDonorName, setExtDonorName] = useState("");
  const [extAmount, setExtAmount] = useState("");
  const [extNote, setExtNote] = useState("");

  const [expCategory, setExpCategory] = useState(expenseCategories[0]);
  const [expAmount, setExpAmount] = useState("");
  const [expNote, setExpNote] = useState("");
  const [newCatName, setNewCatName] = useState("");

  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeText, setNoticeText] = useState("");

  const theme = siteConfig.theme;
  const visibleCards = [...cardRegistry].filter((c) => c.visible).sort((a, b) => a.order - b.order);

  // Financial calculations from inception
  const totalMemberFunds = members.reduce((sum, m) => sum + (Number(m.monthlyPaid) || 0), 0);
  const totalMemberExtraDonations = members.reduce((sum, m) => sum + (Number(m.extraDonation) || 0), 0);
  const totalExternalDonations = externalDonations.reduce((sum, ed) => sum + (Number(ed.amount) || 0), 0);
  const totalFundCollected = totalMemberFunds + totalMemberExtraDonations + totalExternalDonations;

  const totalExpensesAmount = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const netRemainingFund = totalFundCollected - totalExpensesAmount;
  const arrearsMembers = members.filter((m) => m.hasArrears);
  const activeNotices = notices.filter((n) => n.active);

  function handleSaveAll() {
    onApplyChanges({
      siteConfig,
      cardRegistry,
      members: draftMembers,
      externalDonations: draftExtDonations,
      expenses: draftExpenses,
      expenseCategories: draftCategories,
      volunteers: draftVolunteers,
      notices: draftNotices,
      constitutionText: draftConstitution,
      monthlyFundAmount: draftFundAmount,
    });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  }

  if (isAdminMode) {
    return (
      <div dir="rtl" lang="ur" style={{ minHeight: "100vh", background: theme.background, color: theme.textStrong, paddingBottom: 100, fontFamily: "'Noto Nastaliq Urdu', 'Noto Naskh Arabic', serif" }}>
        <header style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, color: "#FBF9F4", padding: "14px 18px", position: "sticky", top: 0, zIndex: 20 }}>
          <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ margin: 0, fontSize: "1.15rem" }}>ایڈمن پینل - مکمل اختیارات اور انٹری سسٹم</h1>
            <button onClick={onCloseAdmin} style={{ background: "rgba(251,249,244,0.14)", border: "1px solid rgba(251,249,244,0.35)", color: "#FBF9F4", borderRadius: 999, padding: "7px 14px", cursor: "pointer" }}>
              ویب سائٹ دیکھیں <ArrowRight size={15} />
            </button>
          </div>
        </header>

        <main style={{ maxWidth: 960, margin: "20px auto", padding: "0 16px", display: "grid", gap: 20 }}>
          
          {/* MEMBERS & ARREARS ADMIN */}
          <section style={{ background: "#FFFFFF", border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
            <h2 style={{ color: theme.primary, fontSize: "1.1rem", margin: "0 0 12px" }}>ممبران، ماہانہ فنڈ اور اضافی عطیات کی انٹری</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 8, marginBottom: 16, alignItems: "end" }}>
              <div>
                <label style={{ fontSize: "0.78rem", display: "block", marginBottom: 4 }}>نام</label>
                <input placeholder="مثلاً: عمران" style={{ width: "100%", padding: 8, borderRadius: 8, border: `1px solid ${theme.border}` }} value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", display: "block", marginBottom: 4 }}>فون نمبر</label>
                <input placeholder="0300-XXXXXXX" style={{ width: "100%", padding: 8, borderRadius: 8, border: `1px solid ${theme.border}` }} value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", display: "block", marginBottom: 4 }}>ماہانہ فنڈ</label>
                <input type="number" style={{ width: "100%", padding: 8, borderRadius: 8, border: `1px solid ${theme.border}` }} value={newMonthlyPaid} onChange={(e) => setNewMonthlyPaid(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", display: "block", marginBottom: 4 }}>اضافی عطیہ</label>
                <input type="number" placeholder="0" style={{ width: "100%", padding: 8, borderRadius: 8, border: `1px solid ${theme.border}` }} value={newExtraDonation} onChange={(e) => setNewExtraDonation(e.target.value)} />
              </div>
              <button onClick={() => {
                if (!newName.trim()) return;
                setDraftMembers([...draftMembers, { id: `m-${Date.now()}`, name: newName, phone: newPhone || "-", status: "active", hasArrears: false, monthlyPaid: Number(newMonthlyPaid) || draftFundAmount, extraDonation: Number(newExtraDonation) || 0 }]);
                setNewName(""); setNewPhone(""); setNewExtraDonation("");
              }} style={{ background: theme.primary, color: "#fff", border: "none", borderRadius: 8, padding: "9px 14px", cursor: "pointer", display: "flex", gap: 4, alignItems: "center", height: 38 }}>
                <UserPlus size={15} /> ممبر شامل کریں
              </button>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {draftMembers.map((m) => (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, background: "#FDFCF9", border: `1px solid ${theme.border}`, borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {m.hasArrears && <span title="فنڈ بقایا ہے" style={{ width: 10, height: 10, borderRadius: "50%", background: "red", display: "inline-block" }}></span>}
                    <div>
                      <strong>{m.name}</strong> <span style={{ fontSize: "0.8rem", color: theme.textMuted }}>({m.phone})</span>
                      <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>فنڈ: {m.monthlyPaid} روپیہ {m.extraDonation > 0 ? `| اضافی عطیہ: ${m.extraDonation} روپیہ` : ""}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={() => setDraftMembers(draftMembers.map(item => item.id === m.id ? { ...item, hasArrears: !item.hasArrears } : item))} style={{ background: m.hasArrears ? "#FFD2D2" : "#E7EFE9", color: m.hasArrears ? "darkred" : theme.primary, border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: "0.75rem" }}>
                      {m.hasArrears ? "بقایا ہے (سرخ نشان)" : "کلیئر ہے"}
                    </button>
                    <button onClick={() => setDraftMembers(draftMembers.map(item => item.id === m.id ? { ...item, status: item.status === "active" ? "inactive" : "active" } : item))} style={{ background: m.status === "active" ? "#E7EFE9" : "#F4E9D2", color: m.status === "active" ? theme.primary : theme.accent, border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: "0.75rem" }}>
                      {m.status === "active" ? "فعال" : "غیر فعال"}
                    </button>
                    <button onClick={() => setDraftMembers(draftMembers.filter(item => item.id !== m.id))} style={{ background: "rgba(200,0,0,0.1)", color: "darkred", border: "none", borderRadius: 6, padding: 6, cursor: "pointer" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* EXTERNAL DONATIONS ADMIN */}
          <section style={{ background: "#FFFFFF", border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
            <h2 style={{ color: theme.primary, fontSize: "1.1rem", margin: "0 0 12px" }}>کارکنان کے علاوہ دیگر افراد کے عطیات کی انٹری</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr auto", gap: 8, marginBottom: 14, alignItems: "end" }}>
              <div>
                <label style={{ fontSize: "0.78rem", display: "block", marginBottom: 4 }}>عطیہ دہندہ کا نام</label>
                <input placeholder="نام یا مخیر حضرات" style={{ width: "100%", padding: 8, borderRadius: 8, border: `1px solid ${theme.border}` }} value={extDonorName} onChange={(e) => setExtDonorName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", display: "block", marginBottom: 4 }}>رقم</label>
                <input type="number" placeholder="رقم" style={{ width: "100%", padding: 8, borderRadius: 8, border: `1px solid ${theme.border}` }} value={extAmount} onChange={(e) => setExtAmount(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", display: "block", marginBottom: 4 }}>تفصیل / وضاحت</label>
                <input placeholder="مد یا پیغام" style={{ width: "100%", padding: 8, borderRadius: 8, border: `1px solid ${theme.border}` }} value={extNote} onChange={(e) => setExtNote(e.target.value)} />
              </div>
              <button onClick={() => {
                if (!extDonorName || !extAmount) return;
                setDraftExtDonations([...draftExtDonations, { id: `ed-${Date.now()}`, donorName: extDonorName, amount: Number(extAmount), note: extNote, date: new Date().toISOString().split("T")[0] }]);
                setExtDonorName(""); setExtAmount(""); setExtNote("");
              }} style={{ background: theme.primary, color: "#fff", border: "none", borderRadius: 8, padding: "9px 14px", cursor: "pointer", height: 38 }}>عطیہ درج کریں</button>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {draftExtDonations.map((ed) => (
                <div key={ed.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, background: "#FDFCF9", border: `1px solid ${theme.border}`, borderRadius: 10 }}>
                  <div>
                    <strong>{ed.donorName}</strong> <span style={{ fontSize: "0.8rem", color: theme.textMuted }}>({ed.note})</span>
                    <div style={{ fontSize: "0.75rem", color: theme.primary }}>رقم: {ed.amount} روپیہ | تاریخ: {ed.date}</div>
                  </div>
                  <button onClick={() => setDraftExtDonations(draftExtDonations.filter(item => item.id !== ed.id))} style={{ background: "rgba(200,0,0,0.1)", color: "darkred", border: "none", borderRadius: 6, padding: 6, cursor: "pointer" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* NOTICES ADMIN */}
          <section style={{ background: "#FFFFFF", border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
            <h2 style={{ color: theme.primary, fontSize: "1.1rem", margin: "0 0 12px" }}>نوٹس بورڈ اور اعلانات جاری کریں</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 8, marginBottom: 14, alignItems: "end" }}>
              <div>
                <label style={{ fontSize: "0.78rem", display: "block", marginBottom: 4 }}>نوٹس کا عنوان</label>
                <input placeholder="عنوان" style={{ width: "100%", padding: 8, borderRadius: 8, border: `1px solid ${theme.border}` }} value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", display: "block", marginBottom: 4 }}>تفصیل / متن</label>
                <input placeholder="نوٹس کا تفصیلی متن" style={{ width: "100%", padding: 8, borderRadius: 8, border: `1px solid ${theme.border}` }} value={noticeText} onChange={(e) => setNoticeText(e.target.value)} />
              </div>
              <button onClick={() => {
                if (!noticeTitle.trim()) return;
                setDraftNotices([...draftNotices, { id: `n-${Date.now()}`, title: noticeTitle, text: noticeText, date: new Date().toISOString().split("T")[0], active: true }]);
                setNoticeTitle(""); setNoticeText("");
              }} style={{ background: theme.accent, color: "#fff", border: "none", borderRadius: 8, padding: "9px 14px", cursor: "pointer", height: 38 }}>نوٹس جاری کریں</button>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {draftNotices.map((n) => (
                <div key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, background: "#FDFCF9", border: `1px solid ${theme.border}`, borderRadius: 10 }}>
                  <div>
                    <strong>{n.title}</strong>: {n.text}
                  </div>
                  <button onClick={() => setDraftNotices(draftNotices.filter(item => item.id !== n.id))} style={{ background: "rgba(200,0,0,0.1)", color: "darkred", border: "none", borderRadius: 6, padding: 6, cursor: "pointer" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* CONSTITUTION EDIT */}
          <section style={{ background: "#FFFFFF", border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
            <h2 style={{ color: theme.primary, fontSize: "1.1rem", margin: "0 0 12px" }}>دستور میں ترمیم</h2>
            <textarea rows={4} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${theme.border}`, fontFamily: "inherit" }} value={draftConstitution} onChange={(e) => setDraftConstitution(e.target.value)} />
          </section>
        </main>

        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: `1px solid ${theme.border}`, padding: "12px", display: "flex", justifyContent: "center", gap: 12, zIndex: 25 }}>
          {savedFlash && <span style={{ color: theme.primary, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={16} /> محفوظ ہو گیا!</span>}
          <button onClick={handleSaveAll} style={{ background: theme.primary, color: "#fff", border: "none", borderRadius: 12, padding: "10px 24px", cursor: "pointer", display: "flex", gap: 8, alignItems: "center", fontSize: "0.95rem" }}>
            <Save size={16} /> تمام تبدیلیاں محفوظ کریں
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      lang="ur"
      style={{
        background: `linear-gradient(180deg, ${theme.background} 0%, ${theme.backgroundAlt} 100%)`,
        color: theme.textStrong,
        fontFamily: "'Noto Nastaliq Urdu', 'Noto Naskh Arabic', serif",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400..700&family=Noto+Naskh+Arabic:wght@400..700&display=swap');
        .kw-heading { font-family: 'Noto Nastaliq Urdu', serif; }
        .kw-card-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 640px) { .kw-card-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; } }
        @media (min-width: 1024px) { .kw-card-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; } }
        .kw-card {
          transition: transform 0.16s ease, box-shadow 0.16s ease;
          cursor: pointer;
        }
        .kw-card:hover { transform: translateY(-3px); box-shadow: 0 12px 22px rgba(11, 79, 63, 0.16); }
        .blink-badge { animation: blink 1.2s infinite; }
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.2; } 100% { opacity: 1; } }
        .blink-bar { animation: blinkBar 1.5s infinite; }
        @keyframes blinkBar { 0% { background-color: #B8862B; } 50% { background-color: #0B4F3F; } 100% { background-color: #B8862B; } }
      `}</style>

      {/* HEADER */}
      <header style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, color: "#FBF9F4", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(155deg, ${theme.accent} 0%, #9C6E1F 100%)`, color: theme.primaryDark, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
              {siteConfig.shortName}
            </div>
            <div>
              <h1 className="kw-heading" style={{ fontSize: "1.08rem", margin: 0 }}>{siteConfig.orgNameUrdu}</h1>
              <span style={{ fontSize: "0.66rem", color: "rgba(251,249,244,0.78)" }}>{siteConfig.orgNameEnglish}</span>
            </div>
          </div>
          {arrearsMembers.length > 0 && (
            <div className="blink-badge" style={{ background: "#FF4D4D", color: "#fff", padding: "4px 10px", borderRadius: 99, fontSize: "0.75rem", display: "flex", gap: 4, alignItems: "center" }}>
              <AlertTriangle size={14} /> بقایاجات موجود!
            </div>
          )}
        </div>
      </header>

      {/* BLINKING NOTIFICATION BAR */}
      {activeNotices.length > 0 && (
        <div className="blink-bar" onClick={() => setActiveModal("notices")} style={{ color: "#fff", padding: "8px 16px", textAlign: "center", fontSize: "0.85rem", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
          <Megaphone size={16} /> <strong>نیا اعلان:</strong> {activeNotices[0].title} — تفصیل دیکھنے کے لیے یہاں کلک کریں!
        </div>
      )}

      {/* MAIN */}
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "36px 18px 90px" }}>
        <section style={{ textAlign: "center", marginBottom: 34 }}>
          <h2 className="kw-heading" style={{ fontSize: "2rem", color: theme.primary, margin: "0 0 12px" }}>{siteConfig.homeHeading}</h2>
          <p style={{ color: theme.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 2 }}>{siteConfig.homeSubheading}</p>
        </section>

        {/* FINANCIAL OVERVIEW BANNER */}
        <section style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 20, marginBottom: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, textAlign: "center" }}>
          <div style={{ padding: 10, background: theme.backgroundAlt, borderRadius: 12 }}>
            <span style={{ fontSize: "0.8rem", color: theme.textMuted, display: "block" }}>ابتدا سے کل فنڈ + عطیات</span>
            <strong style={{ fontSize: "1.25rem", color: theme.primary }}>{totalFundCollected} روپیہ</strong>
          </div>
          <div style={{ padding: 10, background: theme.backgroundAlt, borderRadius: 12 }}>
            <span style={{ fontSize: "0.8rem", color: theme.textMuted, display: "block" }}>کل اخراجات</span>
            <strong style={{ fontSize: "1.25rem", color: "darkred" }}>{totalExpensesAmount} روپیہ</strong>
          </div>
          <div style={{ padding: 10, background: theme.primarySoft, borderRadius: 12 }}>
            <span style={{ fontSize: "0.8rem", color: theme.primary, display: "block" }}>خالص بقایا فنڈ</span>
            <strong style={{ fontSize: "1.25rem", color: theme.primary }}>{netRemainingFund} روپیہ</strong>
          </div>
        </section>

        {/* CARD GRID */}
        <section className="kw-card-grid">
          {visibleCards.map((card) => {
            const Icon = ICON_MAP[card.icon] || Info;
            return (
              <div
                key={card.id}
                onClick={() => setActiveModal(card.id)}
                className="kw-card"
                style={{
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 16,
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  minHeight: 110,
                  position: "relative"
                }}
              >
                {card.id === "arrears" && arrearsMembers.length > 0 && (
                  <span className="blink-badge" style={{ position: "absolute", top: 12, left: 12, width: 10, height: 10, borderRadius: "50%", background: "red" }}></span>
                )}
                {card.id === "notices" && activeNotices.length > 0 && (
                  <span className="blink-badge" style={{ position: "absolute", top: 12, left: 12, width: 10, height: 10, borderRadius: "50%", background: theme.accent }}></span>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(11,79,63,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: theme.primary }}>
                    <Icon size={19} />
                  </div>
                  <h3 className="kw-heading" style={{ fontSize: "1.02rem", margin: 0, color: theme.primary }}>{card.title}</h3>
                </div>
                <p style={{ margin: 0, fontSize: "0.8rem", color: theme.textMuted }}>{card.text}</p>
              </div>
            );
          })}
        </section>
      </main>

      {/* MODALS */}
      {activeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: theme.surface, borderRadius: 16, width: "100%", maxWidth: 640, maxHeight: "85vh", overflowY: "auto", padding: 22, border: `1px solid ${theme.border}` }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 className="kw-heading" style={{ color: theme.primary, margin: 0, fontSize: "1.2rem" }}>
                {activeModal === "constitution" && "تنظیم کا دستور"}
                {activeModal === "members" && "ممبران کی فہرست"}
                {activeModal === "funds" && "فنڈز اور مالیاتی لیجر"}
                {activeModal === "donations" && "عطیات کا تفصیلی صفحہ"}
                {activeModal === "expenses" && "کیٹیگری وائز اخراجات"}
                {activeModal === "arrears" && "بقایاجات کی فہرست"}
                {activeModal === "volunteers" && "رضاکار حضرات"}
                {activeModal === "notices" && "نوٹس بورڈ اور اعلانات"}
              </h3>
              <button onClick={() => setActiveModal(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: theme.textStrong }}><X size={22} /></button>
            </div>

            {activeModal === "constitution" && (
              <div style={{ whiteSpace: "pre-line", lineHeight: 2, background: theme.backgroundAlt, padding: 16, borderRadius: 10, fontSize: "0.95rem" }}>
                {constitutionText}
              </div>
            )}

            {activeModal === "members" && (
              <div style={{ display: "grid", gap: 10 }}>
                {members.map((m) => (
                  <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: theme.backgroundAlt, borderRadius: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {m.hasArrears && <span title="بقیہ فنڈ موجود ہے" style={{ width: 10, height: 10, borderRadius: "50%", background: "red" }}></span>}
                      <div>
                        <h4 style={{ margin: "0 0 4px", fontSize: "1rem" }}>{m.name}</h4>
                        <span style={{ fontSize: "0.8rem", color: theme.textMuted }}>فون: {m.phone} | فنڈ: {m.monthlyPaid} روپیہ {m.extraDonation > 0 ? `| اضافی عطیہ: ${m.extraDonation} روپیہ` : ""}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: 999, background: m.status === "active" ? "#E7EFE9" : "#F4E9D2", color: m.status === "active" ? theme.primary : theme.accent }}>
                      {m.status === "active" ? "فعال" : "غیر فعال"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeModal === "funds" && (
              <div>
                <p style={{ color: theme.textMuted, fontSize: "0.9rem" }}>ابتدا سے لے کر اب تک کا مکمل شفاف مالیاتی حساب:</p>
                <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                  <div style={{ padding: 12, background: theme.backgroundAlt, borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
                    <span>کل فنڈ کلیکشن (ممبران + عطیات):</span>
                    <strong>{totalFundCollected} روپیہ</strong>
                  </div>
                  <div style={{ padding: 12, background: theme.backgroundAlt, borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
                    <span>کل اخراجات:</span>
                    <strong style={{ color: "darkred" }}>{totalExpensesAmount} روپیہ</strong>
                  </div>
                  <div style={{ padding: 12, background: theme.primarySoft, borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: theme.primary }}>موجودہ بقایا فنڈ:</span>
                    <strong style={{ color: theme.primary }}>{netRemainingFund} روپیہ</strong>
                  </div>
                </div>
              </div>
            )}

            {activeModal === "donations" && (
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <h4 style={{ color: theme.primary, margin: "0 0 8px", fontSize: "1.05rem" }}>ارکان کی طرف سے دی جانے والی اضافی رقوم (عطیات):</h4>
                  <div style={{ display: "grid", gap: 8 }}>
                    {members.filter(m => m.extraDonation > 0).length === 0 ? (
                      <p style={{ fontSize: "0.85rem", color: theme.textMuted }}>کوئی اضافی عطیہ درج نہیں ہے۔</p>
                    ) : (
                      members.filter(m => m.extraDonation > 0).map(m => (
                        <div key={m.id} style={{ padding: 10, background: theme.backgroundAlt, borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
                          <span>{m.name} (ماہانہ فنڈ سے زائد)</span>
                          <strong style={{ color: theme.primary }}>{m.extraDonation} روپیہ</strong>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h4 style={{ color: theme.primary, margin: "0 0 8px", fontSize: "1.05rem" }}>کارکنان کے علاوہ مخیر حضرات و رضاکاروں کے عطیات:</h4>
                  <div style={{ display: "grid", gap: 8 }}>
                    {externalDonations.map(ed => (
                      <div key={ed.id} style={{ padding: 10, background: theme.backgroundAlt, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <strong>{ed.donorName}</strong> <span style={{ fontSize: "0.8rem", color: theme.textMuted }}>({ed.note})</span>
                        </div>
                        <strong style={{ color: theme.primary }}>{ed.amount} روپیہ</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeModal === "expenses" && (
              <div style={{ display: "grid", gap: 10 }}>
                {expenses.map((ex) => (
                  <div key={ex.id} style={{ padding: 12, background: theme.backgroundAlt, borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontWeight: 700, color: theme.primary }}>[{ex.category}]</span> {ex.note}
                      <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>تاریخ: {ex.date}</div>
                    </div>
                    <strong style={{ color: "darkred" }}>{ex.amount} روپیہ</strong>
                  </div>
                ))}
              </div>
            )}

            {activeModal === "arrears" && (
              <div style={{ display: "grid", gap: 10 }}>
                {arrearsMembers.length === 0 ? (
                  <p style={{ textAlign: "center", color: theme.textMuted, padding: 20 }}>موجودہ وقت میں کسی بھی ممبر کا فنڈ بقایا نہیں ہے!</p>
                ) : (
                  arrearsMembers.map((m) => (
                    <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: "#FFF2F2", border: "1px solid #FFCCCC", borderRadius: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "red" }}></span>
                        <div>
                          <strong>{m.name}</strong> <span style={{ fontSize: "0.8rem", color: theme.textMuted }}>({m.phone})</span>
                        </div>
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "darkred", fontWeight: 700 }}>ماہانہ فنڈ واجب الادا ہے</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeModal === "volunteers" && (
              <div style={{ display: "grid", gap: 10 }}>
                {volunteers.map((v) => (
                  <div key={v.id} style={{ padding: 12, background: theme.backgroundAlt, borderRadius: 10 }}>
                    <h4 style={{ margin: "0 0 4px", color: theme.primary }}>{v.name}</h4>
                    <span style={{ fontSize: "0.85rem", color: theme.textMuted }}>{v.role} | فون: {v.phone}</span>
                  </div>
                ))}
              </div>
            )}

            {activeModal === "notices" && (
              <div style={{ display: "grid", gap: 10 }}>
                {notices.map((n) => (
                  <div key={n.id} style={{ padding: 12, background: theme.backgroundAlt, borderRadius: 10, borderRight: `4px solid ${theme.accent}` }}>
                    <h4 style={{ margin: "0 0 4px", color: theme.primary }}>{n.title} <span style={{ fontSize: "0.7rem", color: theme.textMuted, fontWeight: 400 }}>({n.date})</span></h4>
                    <p style={{ fontSize: "0.9rem", margin: 0 }}>{n.text}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ADMIN PANEL BUTTON */}
      <button onClick={onOpenAdmin} style={{ position: "fixed", bottom: 18, insetInlineStart: 18, zIndex: 40, background: theme.primary, color: "#FBF9F4", border: "none", borderRadius: 999, padding: "10px 18px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", boxShadow: "0 8px 18px rgba(11,79,63,0.3)" }}>
        <Settings size={16} /> ایڈمن پینل
      </button>
    </div>
  );
}