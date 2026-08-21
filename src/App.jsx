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
  Star,
  ShieldCheck,
  ClipboardList,
  Menu,
  X,
  Settings,
  ArrowRight,
  Save,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  CheckCircle2,
  UserPlus,
  Trash2,
  UserCheck,
  UserX,
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
  star: Star,
  shield: ShieldCheck,
  list: ClipboardList,
};

const DEFAULT_SITE_CONFIG = {
  orgNameUrdu: "کوزتیراج ویلفیئر آرگنائزیشن",
  orgNameEnglish: "Koztiraj Welfare Organization",
  shortName: "KWO",
  homeHeading: "خوش آمدید",
  homeSubheading: "ایک فلاحی برادری، جو مل کر بہتری کے لیے کام کرتی ہے۔ نیچے دیے گئے کسی بھی سیکشن پر جائیں۔",
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
  footer: {
    aboutLine: "ایک شفاف اور فلاحی جذبے سے چلنے والی تنظیم۔",
    contactLabel: "رابطہ",
    contactPlaceholder: "فون / ای میل یہاں شامل ہوگا",
    copyrightLine: "تمام حقوق محفوظ ہیں۔",
  },
};

const DEFAULT_CARD_REGISTRY = [
  { id: "constitution", order: 1, visible: true, title: "دستور", text: "تنظیم کا آئین اور بنیادی اصول", icon: "book" },
  { id: "members", order: 2, visible: true, title: "ممبران", text: "فعال اور سابقہ ممبران کی تفصیل", icon: "users" },
  { id: "funds", order: 3, visible: true, title: "فنڈز", text: "ماہانہ فنڈ اور مالی ڈھانچہ", icon: "wallet" },
  { id: "donations", order: 4, visible: true, title: "عطیات", text: "اضافی عطیات کی تفصیل", icon: "heart" },
  { id: "expenses", order: 5, visible: true, title: "اخراجات", text: "تنظیم کے اخراجات کا ریکارڈ", icon: "receipt" },
  { id: "arrears", order: 6, visible: true, title: "بقایاجات", text: "زیرِ التوا واجبات کی فہرست", icon: "alert" },
  { id: "notices", order: 7, visible: true, title: "نوٹس", text: "اہم اعلانات اور اطلاعات", icon: "bell" },
  { id: "activities", order: 8, visible: true, title: "سرگرمیاں", text: "حالیہ اور آئندہ سرگرمیاں", icon: "activity" },
  { id: "appreciation", order: 9, visible: true, title: "حوصلہ افزائی", text: "نمایاں خدمات کا اعتراف", icon: "award" },
  { id: "reports", order: 10, visible: true, title: "رپورٹس", text: "مالی و انتظامی رپورٹس", icon: "report" },
  { id: "about", order: 11, visible: true, title: "تنظیم کا تعارف", text: "مقاصد اور پس منظر", icon: "info" },
  { id: "contact", order: 12, visible: true, title: "رابطہ", text: "ہم سے رابطہ کریں", icon: "phone" },
];

const DEFAULT_MEMBERS = [
  { id: "m-1", name: "عمران خان", phone: "0300-1234567", status: "active", fundPaid: 1000, donation: 5000 },
  { id: "m-2", name: "علی احمد", phone: "0300-9876543", status: "active", fundPaid: 1000, donation: 0 },
  { id: "m-3", name: "محمد بلال", phone: "0333-5554433", status: "inactive", fundPaid: 0, donation: 2000 },
];

const DEFAULT_FUND_CONFIG = {
  monthlyFundAmount: 1000,
  currency: "روپے",
};

export default function App() {
  const [view, setView] = useState("home"); // 'home' | 'admin'
  const [siteConfig, setSiteConfig] = useState(DEFAULT_SITE_CONFIG);
  const [cardRegistry, setCardRegistry] = useState(DEFAULT_CARD_REGISTRY);
  const [fundConfig, setFundConfig] = useState(DEFAULT_FUND_CONFIG);
  const [members, setMembers] = useState(DEFAULT_MEMBERS);

  function applyChanges(next) {
    setSiteConfig(next.siteConfig);
    setCardRegistry(next.cardRegistry);
    setFundConfig(next.fundConfig);
    setMembers(next.members);
  }

  if (view === "admin") {
    return (
      <AdminPanel
        siteConfig={siteConfig}
        cardRegistry={cardRegistry}
        fundConfig={fundConfig}
        members={members}
        onApply={applyChanges}
        onBack={() => setView("home")}
      />
    );
  }

  return (
    <HomePage
      siteConfig={siteConfig}
      cardRegistry={cardRegistry}
      fundConfig={fundConfig}
      members={members}
      onOpenAdmin={() => setView("admin")}
    />
  );
}

function HomePage({ siteConfig, cardRegistry, fundConfig, members, onOpenAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const { theme } = siteConfig;

  const visibleCards = [...cardRegistry].filter((c) => c.visible).sort((a, b) => a.order - b.order);
  const navItems = [...cardRegistry].filter((c) => c.visible).sort((a, b) => a.order - b.order);

  const memberStats = {
    total: members.length,
    active: members.filter((m) => m.status === "active").length,
    inactive: members.filter((m) => m.status === "inactive").length,
  };

  return (
    <div
      dir="rtl"
      lang="ur"
      style={{
        background: `linear-gradient(180deg, ${theme.background} 0%, ${theme.backgroundAlt} 100%)`,
        color: theme.textStrong,
        fontFamily: "'Noto Naskh Arabic', serif",
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
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "transparent", border: "none", color: "#FBF9F4", cursor: "pointer" }}>
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "36px 18px 90px" }}>
        <section style={{ textAlign: "center", marginBottom: 34 }}>
          <h2 className="kw-heading" style={{ fontSize: "2rem", color: theme.primary, margin: "0 0 12px" }}>{siteConfig.homeHeading}</h2>
          <p style={{ color: theme.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 2 }}>{siteConfig.homeSubheading}</p>
        </section>

        {/* CARD GRID */}
        <section className="kw-card-grid">
          {visibleCards.map((card) => {
            const Icon = ICON_MAP[card.icon] || Info;
            const isMembersCard = card.id === "members";

            return (
              <div
                key={card.id}
                onClick={() => {
                  if (isMembersCard) setShowMemberModal(true);
                }}
                className="kw-card"
                style={{
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 16,
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  minHeight: 108,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(11,79,63,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: theme.primary }}>
                    <Icon size={19} />
                  </div>
                  <h3 className="kw-heading" style={{ fontSize: "1.02rem", margin: 0, color: theme.primary }}>{card.title}</h3>
                </div>
                <p style={{ margin: 0, fontSize: "0.8rem", color: theme.textMuted }}>{card.text}</p>

                {isMembersCard && (
                  <div style={{ marginTop: "auto", paddingTop: 8, borderTop: `1px dashed ${theme.border}`, fontSize: "0.78rem" }}>
                    <span>کل ممبران: <strong style={{ color: theme.primary }}>{memberStats.total}</strong> (فعال: {memberStats.active})</span>
                  </div>
                )}
                {card.id === "funds" && (
                  <div style={{ marginTop: "auto", paddingTop: 8, borderTop: `1px dashed ${theme.border}`, fontSize: "0.78rem" }}>
                    <span>ماہانہ فنڈ: <strong style={{ color: theme.primary }}>{fundConfig.monthlyFundAmount} {fundConfig.currency}</strong></span>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>

      {/* MEMBER DIRECTORY MODAL */}
      {showMemberModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: theme.surface, borderRadius: 16, width: "100%", maxWidth: 600, maxHeight: "80vh", overflowY: "auto", padding: 20, border: `1px solid ${theme.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 className="kw-heading" style={{ color: theme.primary, margin: 0, fontSize: "1.2rem" }}>ممبران کی فہرست اور تفصیلات</h3>
              <button onClick={() => setShowMemberModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: theme.textStrong }}><X size={22} /></button>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {members.map((m) => (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: theme.backgroundAlt, borderRadius: 10, border: `1px solid ${theme.border}` }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "1rem", color: theme.textStrong }}>{m.name}</h4>
                    <span style={{ fontSize: "0.8rem", color: theme.textMuted }}>فون: {m.phone} | فنڈ: {m.fundPaid} روپیہ | عطیہ: {m.donation} روپیہ</span>
                  </div>
                  <span style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: 999, background: m.status === "active" ? "#E7EFE9" : "#F4E9D2", color: m.status === "active" ? theme.primary : theme.accent }}>
                    {m.status === "active" ? "فعال" : "غیر فعال"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN FAB */}
      <button onClick={onOpenAdmin} style={{ position: "fixed", bottom: 18, insetInlineStart: 18, zIndex: 40, background: theme.primary, color: "#FBF9F4", border: "none", borderRadius: 999, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", boxShadow: "0 8px 18px rgba(11,79,63,0.3)" }}>
        <Settings size={16} /> ایڈمن پینل
      </button>
    </div>
  );
}

function AdminPanel({ siteConfig, cardRegistry, fundConfig, members, onApply, onBack }) {
  const [draftSite, setDraftSite] = useState(siteConfig);
  const [draftCards, setDraftCards] = useState(cardRegistry);
  const [draftFund, setDraftFund] = useState(fundConfig);
  const [draftMembers, setDraftMembers] = useState(members);
  const [savedFlash, setSavedFlash] = useState(false);

  // New member form state
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newDonation, setNewDonation] = useState("");

  const theme = draftSite.theme;

  function handleAddMember(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    const newMemberObj = {
      id: `m-${Date.now()}`,
      name: newName,
      phone: newPhone || "نامعلوم",
      status: "active",
      fundPaid: draftFund.monthlyFundAmount,
      donation: Number(newDonation) || 0,
    };
    setDraftMembers([...draftMembers, newMemberObj]);
    setNewName("");
    setNewPhone("");
    setNewDonation("");
  }

  function toggleMemberStatus(id) {
    setDraftMembers(draftMembers.map(m => m.id === id ? { ...m, status: m.status === "active" ? "inactive" : "active" } : m));
  }

  function deleteMember(id) {
    setDraftMembers(draftMembers.filter(m => m.id !== id));
  }

  function handleSave() {
    onApply({
      siteConfig: draftSite,
      cardRegistry: draftCards,
      fundConfig: draftFund,
      members: draftMembers,
    });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  }

  const sectionStyle = { background: "#FFFFFF", border: `1px solid ${theme.border}`, borderRadius: 16, padding: "16px", marginBottom: 16 };
  const inputStyle = { width: "100%", padding: "9px 10px", borderRadius: 9, border: `1px solid ${theme.border}`, fontSize: "0.9rem", background: "#FDFCF9", marginBottom: 12, boxSizing: "border-box" };

  return (
    <div dir="rtl" lang="ur" style={{ minHeight: "100vh", background: theme.background, color: theme.textStrong, paddingBottom: 100 }}>
      <header style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, color: "#FBF9F4", padding: "14px 18px", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ margin: 0, fontSize: "1.15rem" }}>سپر ایڈمن پینل - ممبران اور ترتیبات</h1>
          <button onClick={onBack} style={{ background: "rgba(251,249,244,0.14)", border: "1px solid rgba(251,249,244,0.35)", color: "#FBF9F4", borderRadius: 999, padding: "7px 14px", cursor: "pointer" }}>
            ویب سائٹ دیکھیں <ArrowRight size={15} />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "20px auto", padding: "0 16px" }}>
        
        {/* MEMBERS MANAGEMENT SECTION */}
        <section style={sectionStyle}>
          <h2 style={{ color: theme.primary, fontSize: "1.1rem", margin: "0 0 12px" }}>ممبران کا انتظام (نیا ممبر شامل کریں اور ریکارڈ دیکھیں)</h2>
          
          <form onSubmit={handleAddMember} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8, marginBottom: 16, alignItems: "end" }}>
            <div>
              <label style={{ fontSize: "0.78rem", display: "block", marginBottom: 4 }}>ممبر کا نام</label>
              <input placeholder="مثلاً: عمران" style={inputStyle} value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: "0.78rem", display: "block", marginBottom: 4 }}>فون نمبر</label>
              <input placeholder="0300-XXXXXXX" style={inputStyle} value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: "0.78rem", display: "block", marginBottom: 4 }}>عطیہ (اگر ہو)</label>
              <input type="number" placeholder="0" style={inputStyle} value={newDonation} onChange={(e) => setNewDonation(e.target.value)} />
            </div>
            <button type="submit" style={{ background: theme.primary, color: "#fff", border: "none", borderRadius: 9, padding: "10px 16px", cursor: "pointer", display: "flex", gap: 6, alignItems: "center", height: 38, marginBottom: 12 }}>
              <UserPlus size={16} /> شامل کریں
            </button>
          </form>

          {/* Members List */}
          <div style={{ display: "grid", gap: 8 }}>
            {draftMembers.map((m) => (
              <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, background: "#FDFCF9", border: `1px solid ${theme.border}`, borderRadius: 10 }}>
                <div>
                  <strong>{m.name}</strong> <span style={{ fontSize: "0.8rem", color: theme.textMuted }}>({m.phone})</span>
                  <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>فنڈ: {m.fundPaid} | عطیہ: {m.donation}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={() => toggleMemberStatus(m.id)} style={{ background: m.status === "active" ? "#E7EFE9" : "#F4E9D2", color: m.status === "active" ? theme.primary : theme.accent, border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: "0.75rem", display: "flex", gap: 4, alignItems: "center" }}>
                    {m.status === "active" ? <UserCheck size={13} /> : <UserX size={13} />}
                    {m.status === "active" ? "فعال ہے (غیر فعال کریں)" : "غیر فعال ہے (فعال کریں)"}
                  </button>
                  <button onClick={() => deleteMember(m.id)} style={{ background: "rgba(200,0,0,0.1)", color: "darkred", border: "none", borderRadius: 6, padding: 6, cursor: "pointer" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GENERAL SETTINGS */}
        <section style={sectionStyle}>
          <h2 style={{ color: theme.primary, fontSize: "1.1rem", margin: "0 0 12px" }}>تنظیم کی بنیادی ترتیبات</h2>
          <label style={{ fontSize: "0.82rem", display: "block", marginBottom: 4 }}>تنظیم کا اردو نام</label>
          <input style={inputStyle} value={draftSite.orgNameUrdu} onChange={(e) => setDraftSite({ ...draftSite, orgNameUrdu: e.target.value })} />
          
          <label style={{ fontSize: "0.82rem", display: "block", marginBottom: 4 }}>ماہانہ فنڈ کی رقم ({draftFund.currency})</label>
          <input type="number" style={inputStyle} value={draftFund.monthlyFundAmount} onChange={(e) => setDraftFund({ ...draftFund, monthlyFundAmount: Number(e.target.value) || 0 })} />
        </section>
      </main>

      {/* SAVE BAR */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: `1px solid ${theme.border}`, padding: "12px", display: "flex", justifyContent: "center", gap: 12, zIndex: 25 }}>
        {savedFlash && <span style={{ color: theme.primary, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={16} /> محفوظ ہو گیا!</span>}
        <button onClick={handleSave} style={{ background: theme.primary, color: "#fff", border: "none", borderRadius: 12, padding: "10px 24px", cursor: "pointer", display: "flex", gap: 8, alignItems: "center", fontSize: "0.95rem" }}>
          <Save size={16} /> تبدیلیاں محفوظ کریں
        </button>
      </div>
    </div>
  );
}