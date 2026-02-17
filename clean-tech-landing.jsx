import { useState, useEffect } from "react";
import {
  Car,
  Zap,
  Sun,
  Flame,
  Bike,
  PlugZap,
  Thermometer,
  Shield,
  ChevronRight,
  ArrowRight,
  Snowflake,
  Battery,
  Activity,
  Check,
  Globe,
  Cpu,
  BarChart3,
  Users,
  BadgeCheck,
} from "lucide-react";

// ─── Design Tokens ──────────────────────────────────────────
const colors = {
  primary: "#2563eb",      // Blue-600
  primaryLight: "#dbeafe", // Blue-100
  primaryDark: "#1e40af",  // Blue-800
  success: "#22c55e",      // Green-500
  successLight: "#dcfce7", // Green-100
  slate50: "#f8fafc",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate300: "#cbd5e1",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1e293b",
  slate900: "#0f172a",
};

// ─── Navigation ─────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${colors.slate200}` : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.success})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={18} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: colors.slate900, letterSpacing: "-0.02em" }}>
            Clean<span style={{ color: colors.primary }}>Tech</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {["Products", "Methodology", "About"].map((item) => (
            <span key={item} style={{ fontSize: 14, fontWeight: 500, color: colors.slate600, cursor: "pointer" }}>
              {item}
            </span>
          ))}
          <button style={{
            padding: "8px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
            background: colors.slate900, color: "white", border: "none", cursor: "pointer",
          }}>
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      background: `linear-gradient(180deg, ${colors.slate50} 0%, white 60%)`,
      position: "relative", overflow: "hidden",
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.3,
        backgroundImage: `radial-gradient(${colors.slate300} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600,
            background: colors.primaryLight, color: colors.primary, marginBottom: 24,
          }}>
            <Activity size={14} /> Engineering data, not marketing
          </div>
          <h1 style={{
            fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 800, lineHeight: 1.08,
            color: colors.slate900, letterSpacing: "-0.03em", margin: "0 0 24px",
          }}>
            Everything you need<br />
            for a carbon&#8209;free home.
          </h1>
          <p style={{
            fontSize: 20, lineHeight: 1.6, color: colors.slate500, maxWidth: 540, margin: "0 0 40px",
          }}>
            We research, test, and compare clean-tech products — EVs, solar, heat pumps, and more — so you can make decisions based on real-world data, not brochures.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button style={{
              padding: "14px 28px", borderRadius: 10, fontSize: 16, fontWeight: 600,
              background: colors.primary, color: "white", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
            }}>
              Explore EVs <ArrowRight size={18} />
            </button>
            <button style={{
              padding: "14px 28px", borderRadius: 10, fontSize: 16, fontWeight: 600,
              background: "white", color: colors.slate700, border: `1.5px solid ${colors.slate200}`,
              cursor: "pointer",
            }}>
              How We Calculate
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          display: "flex", gap: 48, marginTop: 80, paddingTop: 40,
          borderTop: `1px solid ${colors.slate200}`,
        }}>
          {[
            { value: "331", label: "EV variants analyzed" },
            { value: "39", label: "Brands compared" },
            { value: "6", label: "Product categories" },
            { value: "0", label: "Marketing claims" },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: 32, fontWeight: 800, color: colors.slate900, fontFamily: "'Geist Mono', ui-monospace, monospace", letterSpacing: "-0.02em" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 14, color: colors.slate500, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Product Verticals ──────────────────────────────────────
const verticals = [
  { icon: Car, name: "EV Selector", desc: "Find the electric car that fits your reality — winter range, charging speed, real-world data.", status: "live", count: "331 variants" },
  { icon: PlugZap, name: "Wallbox", desc: "Compare home chargers by power, smart features, and compatibility with your grid.", status: "soon", count: null },
  { icon: Sun, name: "Solar & PV", desc: "Size your rooftop system correctly. Real yield data for DACH climate zones.", status: "soon", count: null },
  { icon: Flame, name: "Heat Pump", desc: "Find the right heat pump for your home. COP ratings, noise levels, winter efficiency.", status: "soon", count: null },
  { icon: Bike, name: "E-Bike", desc: "Motor types, real range, build quality. The specs that matter for your commute.", status: "soon", count: null },
  { icon: Zap, name: "Energy Provider", desc: "Compare tariffs, green energy share, and dynamic pricing options in your region.", status: "soon", count: null },
];

function Verticals() {
  return (
    <section style={{ padding: "100px 24px", background: "white" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ maxWidth: 540, marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: colors.slate900, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
            One platform.<br />Every clean-tech decision.
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: colors.slate500, margin: 0 }}>
            Running a carbon-free household means getting a lot of things right. We're building the tools to help you research each one.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {verticals.map((v) => {
            const isLive = v.status === "live";
            return (
              <div
                key={v.name}
                style={{
                  padding: 28,
                  borderRadius: 16,
                  border: isLive ? `2px solid ${colors.primary}` : `1px solid ${colors.slate200}`,
                  background: isLive ? colors.primaryLight + "40" : "white",
                  cursor: isLive ? "pointer" : "default",
                  transition: "all 0.2s ease",
                  position: "relative",
                  opacity: isLive ? 1 : 0.75,
                }}
              >
                {isLive && (
                  <div style={{
                    position: "absolute", top: 16, right: 16,
                    padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                    background: colors.success, color: "white", textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>
                    Live
                  </div>
                )}
                {!isLive && (
                  <div style={{
                    position: "absolute", top: 16, right: 16,
                    padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                    background: colors.slate100, color: colors.slate500, letterSpacing: "0.02em",
                  }}>
                    Coming soon
                  </div>
                )}
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: isLive ? colors.primary : colors.slate100,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16,
                }}>
                  <v.icon size={22} color={isLive ? "white" : colors.slate500} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.slate900, margin: "0 0 8px" }}>
                  {v.name}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: colors.slate500, margin: 0 }}>
                  {v.desc}
                </p>
                {v.count && (
                  <div style={{
                    marginTop: 16, paddingTop: 16,
                    borderTop: `1px solid ${colors.slate200}`,
                    fontSize: 13, fontWeight: 600, color: colors.primary,
                    fontFamily: "'Geist Mono', ui-monospace, monospace",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <BarChart3 size={14} /> {v.count}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Context is Everything (EV Feature) ─────────────────────
function ContextSection() {
  const [temp, setTemp] = useState(20);
  const baseRange = 500;
  const factor = temp >= 20 ? 0.88 : temp >= 10 ? 0.82 : temp >= 0 ? 0.74 : temp >= -10 ? 0.65 : 0.58;
  const realRange = Math.round(baseRange * factor);
  const barWidth = (realRange / baseRange) * 100;

  const getMessage = () => {
    if (realRange >= 400) return { text: "Comfortable for long weekend trips.", color: colors.success };
    if (realRange >= 340) return { text: "Still great for your daily commute + errands.", color: colors.success };
    if (realRange >= 280) return { text: "Enough for most weekly driving patterns.", color: "#eab308" };
    return { text: "Plan charging stops on longer trips.", color: "#f97316" };
  };
  const msg = getMessage();

  return (
    <section style={{ padding: "100px 24px", background: colors.slate50 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600,
            background: colors.primaryLight, color: colors.primary, marginBottom: 20,
          }}>
            <Car size={13} /> EV Selector — Featured
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: colors.slate900, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
            Context is everything.
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: colors.slate500, margin: "0 0 32px" }}>
            A lab rating of 500 km means nothing if you drive in -10°C. We show you what to actually expect — and whether it's still enough for your life.
          </p>

          {/* Feature list */}
          {[
            { icon: Thermometer, title: "Winter-Proof Ratings", copy: "See which cars have Heat Pumps and Battery Preconditioning to keep you moving efficiently in January." },
            { icon: Zap, title: "True Charging Time", copy: "We measure how fast you add 200 km of highway driving, not just the peak number." },
            { icon: Shield, title: "Battery Health Check", copy: "Understand the chemistry (LFP vs. NMC) to maximize your car's lifespan." },
          ].map((f) => (
            <div key={f.title} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: "white", border: `1px solid ${colors.slate200}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <f.icon size={20} color={colors.primary} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: colors.slate900, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.5, color: colors.slate500 }}>{f.copy}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive demo */}
        <div style={{
          background: "white", borderRadius: 20, padding: 36,
          border: `1px solid ${colors.slate200}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.slate400, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 24 }}>
            Interactive Demo
          </div>

          {/* Temperature slider */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: colors.slate700 }}>Outside Temperature</span>
              <span style={{
                fontSize: 24, fontWeight: 800, color: colors.slate900,
                fontFamily: "'Geist Mono', ui-monospace, monospace",
              }}>
                {temp}°C
              </span>
            </div>
            <input
              type="range" min={-15} max={35} value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              style={{ width: "100%", accentColor: colors.primary, cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: colors.slate400, marginTop: 4 }}>
              <span>-15°C Alpine</span>
              <span>35°C Summer</span>
            </div>
          </div>

          {/* Range visualization */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: colors.slate500 }}>Lab Rating (WLTP)</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.slate400, fontFamily: "'Geist Mono', ui-monospace, monospace" }}>{baseRange} km</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: colors.slate100, position: "relative" }}>
              <div style={{
                height: "100%", borderRadius: 4, width: "100%",
                background: colors.slate300,
              }} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: colors.slate700, fontWeight: 600 }}>Your Real Range</span>
              <span style={{
                fontSize: 20, fontWeight: 800, color: colors.primary,
                fontFamily: "'Geist Mono', ui-monospace, monospace",
              }}>
                {realRange} km
              </span>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: colors.slate100, position: "relative" }}>
              <div style={{
                height: "100%", borderRadius: 5,
                width: `${barWidth}%`,
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.success})`,
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>

          {/* Message badge */}
          <div style={{
            marginTop: 20, padding: "12px 16px", borderRadius: 10,
            background: msg.color + "18",
            border: `1px solid ${msg.color}30`,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Check size={16} color={msg.color} strokeWidth={2.5} />
            <span style={{ fontSize: 14, fontWeight: 600, color: colors.slate700 }}>{msg.text}</span>
          </div>

          {/* Diff */}
          <div style={{
            marginTop: 20, padding: 16, borderRadius: 10, background: colors.slate50,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 13, color: colors.slate500 }}>Difference from lab</span>
            <span style={{
              fontSize: 15, fontWeight: 700,
              color: realRange < baseRange * 0.75 ? "#f97316" : colors.slate600,
              fontFamily: "'Geist Mono', ui-monospace, monospace",
            }}>
              -{baseRange - realRange} km ({Math.round((1 - factor) * 100)}%)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Methodology / Trust ────────────────────────────────────
function Methodology() {
  const principles = [
    { icon: Cpu, title: "Engineering First", desc: "Every data point is sourced from manufacturer specs, independent tests, and physics-based models — never press releases alone." },
    { icon: Globe, title: "DACH-Optimized", desc: "Our calculations account for Central European climate, Autobahn speeds, and Alpine conditions by default." },
    { icon: BadgeCheck, title: "Transparent Method", desc: "We publish how we calculate. Real range = 70-75% of WLTP under moderate conditions. No black boxes." },
    { icon: Users, title: "Built by Engineers", desc: "Founded by ex-Rimac and Porsche engineers who know what actually matters in an electric drivetrain." },
  ];

  return (
    <section style={{ padding: "100px 24px", background: "white" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: colors.slate900, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
          No marketing. Just physics.
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: colors.slate500, margin: "0 auto 56px", maxWidth: 560 }}>
          We believe the best purchase decisions come from understanding the product, not from glossy ads. Here's how we work.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {principles.map((p) => (
            <div key={p.title} style={{ padding: 28, borderRadius: 16, background: colors.slate50, textAlign: "left" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "white", border: `1px solid ${colors.slate200}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16,
              }}>
                <p.icon size={22} color={colors.primary} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.slate900, margin: "0 0 8px" }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: colors.slate500, margin: 0 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Footer ─────────────────────────────────────────────
function CTAFooter() {
  return (
    <section style={{
      padding: "80px 24px", margin: "0 24px 24px", borderRadius: 24,
      background: `linear-gradient(135deg, ${colors.slate900} 0%, ${colors.slate800} 100%)`,
      textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: `radial-gradient(${colors.primary} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600,
          background: "rgba(255,255,255,0.1)", color: colors.slate300, marginBottom: 24,
        }}>
          <Snowflake size={13} /> Winter-tested and ready
        </div>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "white",
          letterSpacing: "-0.02em", margin: "0 0 16px",
        }}>
          Find the EV that fits your reality.
        </h2>
        <p style={{ fontSize: 17, color: colors.slate400, margin: "0 auto 36px", maxWidth: 480 }}>
          331 variants. 39 brands. Real-world data for DACH conditions. Your match is in there.
        </p>
        <button style={{
          padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700,
          background: colors.primary, color: "white", border: "none", cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 8,
          boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
        }}>
          Start Your Match <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      padding: "40px 24px", borderTop: `1px solid ${colors.slate200}`,
      background: "white",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.success})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={13} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: colors.slate900 }}>
            Clean<span style={{ color: colors.primary }}>Tech</span>
          </span>
        </div>
        <span style={{ fontSize: 13, color: colors.slate400 }}>
          Engineering data for clean-tech decisions. Built in DACH.
        </span>
      </div>
    </footer>
  );
}

// ─── App ────────────────────────────────────────────────────
export default function CleanTechLanding() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "white", color: colors.slate900 }}>
      <Nav />
      <Hero />
      <Verticals />
      <ContextSection />
      <Methodology />
      <CTAFooter />
      <Footer />
    </div>
  );
}
