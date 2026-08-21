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
} from "lucide-react";

/* ============================================================
   ICON REGISTRY
   ------------------------------------------------------------
   Icons are referenced by a plain string key (not a component
   reference) so that a Card's "icon" field is DB/JSON-safe —
   a future Supabase row can only store a string, never a React
   component. ICON_MAP resolves that string to the actual icon
   both on the Home Page and inside the Admin Panel's picker.
   ============================================================ */
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
const ICON_LABELS_UR = {
  book: "کتاب",
  users: "افراد",
  wallet: "بٹوہ",
  heart: "دل",
  receipt: "رسید",
  alert: "انتباہ",
  bell: "گھنٹی",
  activity: "سرگرمی",
  award: "ایوارڈ",
  report: "رپورٹ",
  info: "معلومات",
  phone: "فون",
  star: "ستارہ",
  shield: "شیلڈ",
  list: "فہرست",
};
const ICON_KEYS = Object.keys(ICON_MAP);

/* ============================================================
   DEFAULT / FUTURE-DB-BACKED CONFIGURATION
   ------------------------------------------------------------
   These three objects (SITE_CONFIG, CARD_REGISTRY, FUND_CONFIG)
   still have exactly the same shape as Phase 1A. The only change
   in Phase 1B Part A is WHERE they live: instead of being static
   module-level constants read directly by the page, they are now
   the *initial* values of React state in <App>, and the Admin
   Panel edits that same state. When a database is added later,
   these DEFAULT_* objects are simply replaced by a fetch call —
   nothing in the render logic below has to change.
   ============================================================ */

const DEFAULT_SITE_CONFIG = {
  orgName: "کوزتیراج ویلفیئر آرگنائزیشن", // legacy field, kept for compatibility
  orgNameUrdu: "کوزتیراج ویلفیئر آرگنائزیشن",
  orgNameEnglish: "Koztiraj Welfare Organization",
  shortName: "KWO",
  headerHeading: "کوزتیراج ویلفیئر آرگنائزیشن", // legacy field, unused since header now reads orgNameUrdu
  homeHeading: "خوش آمدید",
  homeSubheading:
    "ایک فلاحی برادری، جو مل کر بہتری کے لیے کام کرتی ہے۔ نیچے دیے گئے کسی بھی سیکشن پر جائیں۔",
  logoInitial: "ک", // legacy field, unused since header now uses shortName as monogram
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

// Members are still a growable/shrinkable list, never a fixed number.
// Not editable from the Admin Panel yet — Members Management is a later
// part of Phase 1B, explicitly out of scope for this step.
const DEFAULT_MEMBERS = Array.from({ length: 16 }, (_, i) => ({
  id: `member-${i + 1}`,
  status: "active",
}));

const DEFAULT_FUND_CONFIG = {
  monthlyFundAmount: 1000,
  currency: "روپے",
};

/* ============================================================
   APP ROOT — holds the "database" as React state for now.
   Switches between the public Home Page and the Admin Panel.
   ============================================================ */
export default function App() {
  const [view, setView] = useState("home"); // 'home' | 'admin'
  const [siteConfig, setSiteConfig] = useState(DEFAULT_SITE_CONFIG);
  const [cardRegistry, setCardRegistry] = useState(DEFAULT_CARD_REGISTRY);
  const [fundConfig, setFundConfig] = useState(DEFAULT_FUND_CONFIG);

  function applyChanges(next) {
    setSiteConfig(next.siteConfig);
    setCardRegistry(next.cardRegistry);
    setFundConfig(next.fundConfig);
  }

  if (view === "admin") {
    return (
      <AdminPanel
        siteConfig={siteConfig}
        cardRegistry={cardRegistry}
        fundConfig={fundConfig}
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
      members={DEFAULT_MEMBERS}
      onOpenAdmin={() => setView("admin")}
    />
  );
}

/* ============================================================
   PUBLIC HOME PAGE (Phase 1A design, unchanged — now reads its
   data from props instead of module-level constants)
   ============================================================ */
function HomePage({ siteConfig, cardRegistry, fundConfig, members, onOpenAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);
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

        .kw-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(50px);
          pointer-events: none;
          z-index: 0;
        }

        .kw-diamond-row {
          background-image: repeating-linear-gradient(
            135deg,
            ${theme.accent} 0px,
            ${theme.accent} 2px,
            transparent 2px,
            transparent 14px
          );
          height: 4px;
          opacity: 0.55;
        }

        .kw-card-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 640px) {
          .kw-card-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; }
        }
        @media (min-width: 1024px) {
          .kw-card-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; }
        }

        .kw-card {
          transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease, background 0.16s ease;
          box-shadow: 0 1px 2px rgba(31, 42, 36, 0.06);
          position: relative;
          overflow: hidden;
        }
        .kw-card::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 3px;
          background: linear-gradient(90deg, ${theme.primary}, ${theme.accent});
          opacity: 0.5;
        }
        .kw-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 22px rgba(11, 79, 63, 0.16);
          border-color: ${theme.accent};
        }
        .kw-card:active {
          transform: translateY(-1px) scale(0.99);
          box-shadow: 0 6px 14px rgba(11, 79, 63, 0.14);
        }
        .kw-card:focus-visible {
          outline: 3px solid ${theme.accent};
          outline-offset: 2px;
        }
        .kw-card:hover .kw-card-badge {
          background: ${theme.primary};
          color: #FBF9F4;
        }

        .kw-navlink { position: relative; }
        .kw-navlink::after {
          content: "";
          position: absolute;
          right: 0;
          bottom: -4px;
          width: 0%;
          height: 2px;
          background: ${theme.accent};
          transition: width 0.2s ease;
        }
        .kw-navlink:hover::after { width: 100%; }

        .kw-admin-fab {
          transition: transform 0.16s ease, box-shadow 0.16s ease;
        }
        .kw-admin-fab:hover { transform: translateY(-2px); }

        @media (prefers-reduced-motion: reduce) {
          .kw-card, .kw-navlink::after, .kw-admin-fab { transition: none !important; }
        }
      `}</style>

      {/* ---------------- HEADER ---------------- */}
      <header
        style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
          color: "#FBF9F4",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 18px",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div
              aria-hidden="true"
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `linear-gradient(155deg, ${theme.accent} 0%, #9C6E1F 100%)`,
                color: theme.primaryDark,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Noto Naskh Arabic', serif",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.5px",
                flexShrink: 0,
                boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              {siteConfig.shortName}
            </div>
            <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
              <h1
                className="kw-heading"
                style={{ fontSize: "1.08rem", fontWeight: 700, lineHeight: 1.35, margin: 0, whiteSpace: "normal" }}
              >
                {siteConfig.orgNameUrdu}
              </h1>
              <span
                style={{
                  fontFamily: "'Noto Naskh Arabic', serif",
                  fontSize: "0.66rem",
                  color: "rgba(251,249,244,0.78)",
                  letterSpacing: "0.4px",
                  lineHeight: 1.3,
                }}
              >
                {siteConfig.orgNameEnglish}
              </span>
            </div>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "مینو بند کریں" : "مینو کھولیں"}
            aria-expanded={menuOpen}
            style={{ background: "transparent", border: "none", color: "#FBF9F4", padding: 8, cursor: "pointer", display: "block", flexShrink: 0 }}
            className="md-hide"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          <nav aria-label="بنیادی مینو" className="kw-desktop-nav" style={{ display: "none", flexShrink: 0 }}>
            <ul style={{ display: "flex", gap: 22, listStyle: "none", margin: 0, padding: 0 }}>
              {navItems.slice(0, 6).map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="kw-navlink" style={{ color: "#FBF9F4", textDecoration: "none", fontSize: "0.95rem" }}>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {menuOpen && (
          <nav aria-label="موبائل مینو" style={{ background: theme.primaryDark, padding: "10px 18px 18px" }}>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      color: "#FBF9F4",
                      textDecoration: "none",
                      display: "block",
                      padding: "8px 4px",
                      fontSize: "0.98rem",
                      borderBottom: "1px solid rgba(251,249,244,0.12)",
                    }}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="kw-diamond-row" />
      </header>

      {/* ---------------- HOME / HERO ---------------- */}
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "36px 18px 90px", position: "relative" }}>
        <div aria-hidden="true" className="kw-shape" style={{ width: 260, height: 260, top: -40, insetInlineEnd: -60, background: theme.accentSoft, opacity: 0.55 }} />
        <div aria-hidden="true" className="kw-shape" style={{ width: 220, height: 220, top: 60, insetInlineStart: -70, background: theme.primarySoft, opacity: 0.6 }} />

        <section style={{ textAlign: "center", marginBottom: 34, position: "relative", zIndex: 1 }}>
          <h2 className="kw-heading" style={{ fontSize: "2rem", color: theme.primary, margin: "0 0 12px", lineHeight: 1.4 }}>
            {siteConfig.homeHeading}
          </h2>
          <div
            aria-hidden="true"
            style={{ width: 64, height: 3, margin: "0 auto 16px", borderRadius: 999, background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})` }}
          />
          <p style={{ color: theme.textMuted, maxWidth: 560, margin: "0 auto", fontSize: "1rem", lineHeight: 2 }}>
            {siteConfig.homeSubheading}
          </p>
        </section>

        {/* ---------------- CARD GRID ---------------- */}
        <section aria-label="اہم سیکشنز" style={{ position: "relative", zIndex: 1 }}>
          <div className="kw-card-grid">
            {visibleCards.map((card) => {
              const Icon = ICON_MAP[card.icon] || Info;
              return (
                <a
                  key={card.id}
                  href={`#${card.id}`}
                  id={card.id}
                  className="kw-card"
                  style={{
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 16,
                    padding: "14px",
                    textDecoration: "none",
                    color: theme.textStrong,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    minHeight: 108,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      aria-hidden="true"
                      className="kw-card-badge"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: "rgba(11,79,63,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: theme.primary,
                        flexShrink: 0,
                        transition: "background 0.16s ease, color 0.16s ease",
                      }}
                    >
                      <Icon size={19} strokeWidth={1.9} />
                    </div>
                    <h3 className="kw-heading" style={{ fontSize: "1.02rem", margin: 0, color: theme.primary, lineHeight: 1.3 }}>
                      {card.title}
                    </h3>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: theme.textMuted, lineHeight: 1.7 }}>{card.text}</p>

                  {card.id === "members" && (
                    <div style={{ marginTop: 2, paddingTop: 8, borderTop: `1px dashed ${theme.border}`, fontSize: "0.78rem", color: theme.textStrong, display: "flex", flexDirection: "column", gap: 3 }}>
                      <span>کل ممبران: <strong style={{ color: theme.primary }}>{memberStats.total}</strong></span>
                      <span style={{ color: theme.textMuted }}>
                        فعال: <strong style={{ color: theme.primary }}>{memberStats.active}</strong>
                        {" | "}
                        غیر فعال: <strong style={{ color: theme.primary }}>{memberStats.inactive}</strong>
                      </span>
                    </div>
                  )}

                  {card.id === "funds" && (
                    <div style={{ marginTop: 2, paddingTop: 8, borderTop: `1px dashed ${theme.border}`, fontSize: "0.78rem", color: theme.textStrong }}>
                      <span>
                        ماہانہ فنڈ:{" "}
                        <strong style={{ color: theme.primary }}>
                          {fundConfig.monthlyFundAmount} {fundConfig.currency}
                        </strong>
                      </span>
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        </section>
      </main>

      {/* ---------------- FOOTER ---------------- */}
      <footer style={{ background: theme.primaryDark, color: "#EFEBDD" }}>
        <div className="kw-diamond-row" />
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "26px 18px", display: "grid", gap: 14, textAlign: "center" }}>
          <h4 className="kw-heading" style={{ margin: 0, fontSize: "1.1rem" }}>{siteConfig.orgNameUrdu}</h4>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#C9C6B6" }}>{siteConfig.footer.aboutLine}</p>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "#C9C6B6" }}>
            {siteConfig.footer.contactLabel}: {siteConfig.footer.contactPlaceholder}
          </p>
          <p style={{ margin: "6px 0 0", fontSize: "0.78rem", color: "#8FA69B" }}>
            © {new Date().getFullYear()} {siteConfig.orgNameUrdu} — {siteConfig.footer.copyrightLine}
          </p>
        </div>
      </footer>

      {/* Discreet entry point into the Super Admin Panel — no auth yet */}
      <button
        onClick={onOpenAdmin}
        className="kw-admin-fab"
        aria-label="سپر ایڈمن پینل کھولیں"
        style={{
          position: "fixed",
          bottom: 18,
          insetInlineStart: 18,
          zIndex: 40,
          background: theme.primary,
          color: "#FBF9F4",
          border: "none",
          borderRadius: 999,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: "0.85rem",
          fontFamily: "'Noto Naskh Arabic', serif",
          cursor: "pointer",
          boxShadow: "0 8px 18px rgba(11,79,63,0.3)",
        }}
      >
        <Settings size={16} />
        ایڈمن پینل
      </button>

      <style>{`
        @media (min-width: 768px) {
          .md-hide { display: none !important; }
          .kw-desktop-nav { display: block !important; }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   SUPER ADMIN PANEL (Phase 1B — Part A)
   ------------------------------------------------------------
   No login, no database. Edits happen in local "draft" state;
   nothing on the live Home Page changes until "تبدیلیاں محفوظ
   کریں" (Save) is pressed, at which point the draft is lifted
   up to <App>'s state via onApply. That is the entirety of what
   "persistence" means in this phase — it resets on page reload,
   exactly as expected before a database is connected.
   ============================================================ */
function AdminPanel({ siteConfig, cardRegistry, fundConfig, onApply, onBack }) {
  const [draftSite, setDraftSite] = useState(siteConfig);
  const [draftCards, setDraftCards] = useState(cardRegistry);
  const [draftFund, setDraftFund] = useState(fundConfig);
  const [savedFlash, setSavedFlash] = useState(false);

  const theme = draftSite.theme;
  const sortedCards = [...draftCards].sort((a, b) => a.order - b.order);

  function patchSite(patch) {
    setDraftSite((prev) => ({ ...prev, ...patch }));
  }
  function patchTheme(patch) {
    setDraftSite((prev) => ({ ...prev, theme: { ...prev.theme, ...patch } }));
  }
  function patchFooter(patch) {
    setDraftSite((prev) => ({ ...prev, footer: { ...prev.footer, ...patch } }));
  }
  function patchCard(id, patch) {
    setDraftCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function moveCard(id, direction) {
    setDraftCards((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((c) => c.id === id);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const a = sorted[idx];
      const b = sorted[swapIdx];
      return prev.map((c) => {
        if (c.id === a.id) return { ...c, order: b.order };
        if (c.id === b.id) return { ...c, order: a.order };
        return c;
      });
    });
  }

  function handleSave() {
    onApply({ siteConfig: draftSite, cardRegistry: draftCards, fundConfig: draftFund });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  }

  const sectionStyle = {
    background: "#FFFFFF",
    border: `1px solid ${theme.border}`,
    borderRadius: 16,
    padding: "16px",
    marginBottom: 16,
    boxShadow: "0 1px 2px rgba(31,42,36,0.06)",
  };
  const labelStyle = { display: "block", fontSize: "0.82rem", color: theme.textMuted, marginBottom: 4 };
  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 10px",
    borderRadius: 9,
    border: `1px solid ${theme.border}`,
    fontFamily: "'Noto Naskh Arabic', serif",
    fontSize: "0.9rem",
    color: theme.textStrong,
    background: "#FDFCF9",
    marginBottom: 12,
  };
  const sectionTitleStyle = {
    fontFamily: "'Noto Nastaliq Urdu', serif",
    fontSize: "1.1rem",
    color: theme.primary,
    margin: "0 0 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  return (
    <div
      dir="rtl"
      lang="ur"
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${theme.background} 0%, ${theme.backgroundAlt} 100%)`,
        fontFamily: "'Noto Naskh Arabic', serif",
        color: theme.textStrong,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400..700&family=Noto+Naskh+Arabic:wght@400..700&display=swap');
        input[type="color"] { -webkit-appearance: none; border: none; padding: 0; width: 40px; height: 34px; border-radius: 8px; cursor: pointer; }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border-radius: 8px; border: 1px solid ${theme.border}; }
      `}</style>

      {/* Admin header */}
      <header
        style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
          color: "#FBF9F4",
          position: "sticky",
          top: 0,
          zIndex: 20,
          padding: "14px 18px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Settings size={20} />
            <h1 style={{ fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: "1.15rem", margin: 0 }}>سپر ایڈمن پینل</h1>
          </div>
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(251,249,244,0.14)",
              border: "1px solid rgba(251,249,244,0.35)",
              color: "#FBF9F4",
              borderRadius: 999,
              padding: "7px 14px",
              fontSize: "0.85rem",
              cursor: "pointer",
              fontFamily: "'Noto Naskh Arabic', serif",
            }}
          >
            <ArrowRight size={15} />
            ویب سائٹ دیکھیں
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px 120px" }}>
        {/* 1. Organization Branding */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>تنظیم کی برانڈنگ</h2>
          <label style={labelStyle}>اردو تنظیم کا نام</label>
          <input style={inputStyle} value={draftSite.orgNameUrdu} onChange={(e) => patchSite({ orgNameUrdu: e.target.value })} />
          <label style={labelStyle}>English Organization Name</label>
          <input style={{ ...inputStyle, fontFamily: "inherit", direction: "ltr", textAlign: "left" }} value={draftSite.orgNameEnglish} onChange={(e) => patchSite({ orgNameEnglish: e.target.value })} />
          <label style={labelStyle}>Short Name</label>
          <input style={{ ...inputStyle, direction: "ltr", textAlign: "left", maxWidth: 140 }} value={draftSite.shortName} onChange={(e) => patchSite({ shortName: e.target.value.slice(0, 6) })} />
          <label style={labelStyle}>Logo / Monogram (پہلے سے Short Name سے خودکار بنتا ہے)</label>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div
              aria-hidden="true"
              style={{
                width: 44, height: 44, borderRadius: 12,
                background: `linear-gradient(155deg, ${theme.accent} 0%, #9C6E1F 100%)`,
                color: theme.primaryDark, display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 15, border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              {draftSite.shortName}
            </div>
            <span style={{ fontSize: "0.78rem", color: theme.textMuted }}>
              فائل اپلوڈ کے ذریعے Logo image لگانا اسٹوریج/ڈیٹابیس کے ساتھ Phase 1B کے اگلے حصے میں شامل ہوگا۔
            </span>
          </div>
        </section>

        {/* 2. Theme */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>تھیم کے رنگ</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            <ColorField label="Primary" value={theme.primary} onChange={(v) => patchTheme({ primary: v })} />
            <ColorField label="Primary Dark" value={theme.primaryDark} onChange={(v) => patchTheme({ primaryDark: v })} />
            <ColorField label="Accent" value={theme.accent} onChange={(v) => patchTheme({ accent: v })} />
            <ColorField label="Background" value={theme.background} onChange={(v) => patchTheme({ background: v })} />
          </div>
        </section>

        {/* 3. Home Page Headings */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>ہوم پیج کی Headings</h2>
          <label style={labelStyle}>Main Heading</label>
          <input style={inputStyle} value={draftSite.homeHeading} onChange={(e) => patchSite({ homeHeading: e.target.value })} />
          <label style={labelStyle}>Subheading</label>
          <textarea
            style={{ ...inputStyle, minHeight: 64, resize: "vertical", marginBottom: 0 }}
            value={draftSite.homeSubheading}
            onChange={(e) => patchSite({ homeSubheading: e.target.value })}
          />
        </section>

        {/* 4. Cards Management */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>کارڈز کا انتظام</h2>
          <p style={{ fontSize: "0.78rem", color: theme.textMuted, margin: "0 0 12px" }}>
            ترتیب ہمیشہ نیچے دی گئی فہرست کے مطابق Home Page پر ظاہر ہوگی۔ اوپر/نیچے تیر سے ترتیب بدلیں۔
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {sortedCards.map((card, idx) => {
              const Icon = ICON_MAP[card.icon] || Info;
              return (
                <div key={card.id} style={{ border: `1px solid ${theme.border}`, borderRadius: 12, padding: 12, background: "#FDFCF9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <button
                        aria-label="اوپر منتقل کریں"
                        disabled={idx === 0}
                        onClick={() => moveCard(card.id, "up")}
                        style={{ ...iconBtnStyle(theme), opacity: idx === 0 ? 0.35 : 1 }}
                      >
                        <ChevronUp size={15} />
                      </button>
                      <button
                        aria-label="نیچے منتقل کریں"
                        disabled={idx === sortedCards.length - 1}
                        onClick={() => moveCard(card.id, "down")}
                        style={{ ...iconBtnStyle(theme), opacity: idx === sortedCards.length - 1 ? 0.35 : 1 }}
                      >
                        <ChevronDown size={15} />
                      </button>
                    </div>

                    <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(11,79,63,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: theme.primary, flexShrink: 0 }}>
                      <Icon size={17} strokeWidth={1.9} />
                    </div>

                    <span style={{ fontSize: "0.72rem", color: theme.textMuted, flexShrink: 0 }}>ترتیب: {idx + 1}</span>

                    <div style={{ flex: 1 }} />

                    <button
                      onClick={() => patchCard(card.id, { visible: !card.visible })}
                      style={{
                        display: "flex", alignItems: "center", gap: 5,
                        background: card.visible ? "rgba(11,79,63,0.08)" : "rgba(184,134,43,0.12)",
                        color: card.visible ? theme.primary : theme.accent,
                        border: "none", borderRadius: 999, padding: "5px 10px", fontSize: "0.74rem", cursor: "pointer",
                      }}
                    >
                      {card.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                      {card.visible ? "نظر آ رہا ہے" : "چھپا ہوا"}
                    </button>
                  </div>

                  <label style={{ ...labelStyle, marginBottom: 3 }}>Home Page Card Heading (عنوان)</label>
                  <input style={{ ...inputStyle, marginBottom: 0 }} value={card.title} onChange={(e) => patchCard(card.id, { title: e.target.value })} />
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Monthly Fund Amount */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>ماہانہ فنڈ</h2>
          <label style={labelStyle}>مقررہ ماہانہ فنڈ (Monthly Fund Amount)</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="number"
              min="0"
              style={{ ...inputStyle, marginBottom: 0, maxWidth: 160 }}
              value={draftFund.monthlyFundAmount}
              onChange={(e) => setDraftFund((prev) => ({ ...prev, monthlyFundAmount: Number(e.target.value) || 0 }))}
            />
            <span style={{ color: theme.textMuted, fontSize: "0.9rem" }}>{draftFund.currency}</span>
          </div>
          <p style={{ fontSize: "0.78rem", color: theme.textMuted, marginTop: 8, marginBottom: 0 }}>
            یہ قدر Home Page پر "فنڈز" Card میں خودکار طور پر ظاہر ہوگی۔
          </p>
        </section>
      </main>

      {/* Sticky Save bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          background: "#FFFFFF",
          borderTop: `1px solid ${theme.border}`,
          padding: "12px 16px",
          display: "flex",
          justifyContent: "center",
          gap: 12,
          boxShadow: "0 -6px 16px rgba(31,42,36,0.08)",
          zIndex: 25,
        }}
      >
        {savedFlash && (
          <span style={{ display: "flex", alignItems: "center", gap: 6, color: theme.primary, fontSize: "0.85rem", alignSelf: "center" }}>
            <CheckCircle2 size={16} /> تبدیلیاں کامیابی سے لاگو ہوگئیں
          </span>
        )}
        <button
          onClick={handleSave}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
            color: "#FBF9F4", border: "none", borderRadius: 12, padding: "12px 28px",
            fontSize: "0.95rem", fontFamily: "'Noto Naskh Arabic', serif", cursor: "pointer",
            boxShadow: "0 6px 16px rgba(11,79,63,0.28)",
          }}
        >
          <Save size={17} />
          تبدیلیاں محفوظ کریں
        </button>
      </div>
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.78rem", color: "#5B6B62", marginBottom: 4 }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
        <span style={{ fontSize: "0.78rem", direction: "ltr", color: "#5B6B62" }}>{value}</span>
      </div>
    </div>
  );
}

function iconBtnStyle(theme) {
  return {
    width: 24,
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${theme.border}`,
    borderRadius: 5,
    background: "#FFFFFF",
    color: theme.primary,
    cursor: "pointer",
    padding: 0,
  };
}