import { useState, useEffect, useRef } from "react";
import axios from "axios";
import HeroCanvas from "./components/HeroCanvas";
import ReasonForm from "./components/ReasonForm";
import PredictionCard from "./components/PredictionCard";
import SellerSummaryChart from "./components/SellerSummaryChart";
import SellerSummaryCard from "./components/SellerSummaryCard";
import "./App.css";

/* ── Custom Cursor ── */
function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let rx = 0, ry = 0;
    const onMove = (e) => {
      const { clientX: x, clientY: y } = e;
      if (dotRef.current) {
        dotRef.current.style.left = x + "px";
        dotRef.current.style.top  = y + "px";
      }
      rx += (x - rx) * 0.14;
      ry += (y - ry) * 0.14;
    };
    const rafLoop = () => {
      if (ringRef.current) {
        ringRef.current.style.left = rx + "px";
        ringRef.current.style.top  = ry + "px";
      }
      requestAnimationFrame(rafLoop);
    };
    const raf = requestAnimationFrame(rafLoop);
    window.addEventListener("mousemove", onMove);

    // hover detection
    const addHover = () => {
      dotRef.current?.classList.add("hover");
      ringRef.current?.classList.add("hover");
    };
    const removeHover = () => {
      dotRef.current?.classList.remove("hover");
      ringRef.current?.classList.remove("hover");
    };
    document.querySelectorAll("a,button,input,textarea,[data-cursor]").forEach(el => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div className="cursor"      ref={dotRef}  />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}

/* ── Scroll Reveal Hook ── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); } });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── Parallax Hook ── */
function useParallax() {
  useEffect(() => {
    const targets = document.querySelectorAll("[data-parallax]");
    const onScroll = () => {
      const sy = window.scrollY;
      targets.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translateY(${sy * speed}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

/* ── Hero Entrance Animation ── */
function useHeroEntrance() {
  useEffect(() => {
    const els = [
      { sel: ".hero-eyebrow", delay: 400 },
      { sel: ".hero-title",   delay: 650 },
      { sel: ".hero-sub",     delay: 900 },
      { sel: ".hero-cta-row", delay: 1100 },
    ];
    els.forEach(({ sel, delay }) => {
      setTimeout(() => {
        const el = document.querySelector(sel);
        if (el) { el.style.transition = "opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s cubic-bezier(.16,1,.3,1)"; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }
      }, delay);
    });
  }, []);
}

/* ── Navbar scroll effect ── */
function useNavScroll() {
  useEffect(() => {
    const nav = document.querySelector(".nav");
    const onScroll = () => {
      if (window.scrollY > 40) nav?.classList.add("scrolled");
      else nav?.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

/* ── Smooth scroll to section ── */
const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function App() {
  const [result, setResult]       = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [summaryText, setSummaryText] = useState(null);

  useScrollReveal();
  useParallax();
  useHeroEntrance();
  useNavScroll();

  const fetchSummary = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/analyze/seller/seller1/summary"
      );
      if (data.percentages) setBreakdown(data.percentages);
      if (data.summary)     setSummaryText(data.summary);
    } catch {
      alert("Failed to fetch summary.");
    }
  };

  return (
    <>
      <Cursor />
      <div className="noise" />

      <div className="app">
        {/* ── Navbar ── */}
        <nav className="nav">
          <div className="nav-logo">
            <div className="nav-logo-dot" />
            ReturnAI
          </div>
          <div className="nav-right">
            <span className="nav-pill">v1.0</span>
            <span className="nav-pill live">● Live</span>
            <button
              className="btn-outline"
              style={{ padding: "7px 18px", fontSize: 13 }}
              onClick={() => scrollTo("analyze")}
            >
              Try Now →
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="hero-section">
          <HeroCanvas />
          <div className="hero-vignette" />
          <div className="hero-fade" />

          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              <span>AI-Powered Return Intelligence</span>
            </div>

            <h1 className="hero-title">
              Understand
              <span className="hero-title-accent">Every Return.</span>
            </h1>

            <p className="hero-sub">
              Classify customer return reasons instantly with AI.
              Spot patterns, reduce losses, and improve your product experience — in seconds.
            </p>

            <div className="hero-cta-row">
              <button className="btn-cta" onClick={() => scrollTo("analyze")}>
                Start Analyzing
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="btn-outline" onClick={() => scrollTo("stats")}>
                View Insights
              </button>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="scroll-indicator">
            <div className="scroll-line" />
            <span className="scroll-text">Scroll</span>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <div className="stats-strip reveal" data-parallax="-0.03">
          <div className="stats-strip-inner">
            {[
              { num: "98", unit: "%", label: "Classification Accuracy" },
              { num: "<1", unit: "s",  label: "Avg Response Time" },
              { num: "4",  unit: "×",  label: "Return Categories" },
              { num: "∞",  unit: "",   label: "Cases Analyzed" },
            ].map(({ num, unit, label }) => (
              <div key={label} className="stat-item">
                <span className="stat-num">{num}<span>{unit}</span></span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <main className="main-content" id="analyze">
          <div className="content-inner">

            {/* Section label */}
            <div className="section-label reveal">
              <span className="section-label-line" />
              <span>Analyze Returns</span>
            </div>

            {/* Input */}
            <div className="reveal reveal-delay-1">
              <ReasonForm onResult={(r) => { setResult(r); setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }), 100); }} />
            </div>

            {/* Result */}
            {result && (
              <div id="result">
                <PredictionCard category={result.aiPrediction} />
              </div>
            )}

            {/* Trends */}
            <div id="stats">
              <div className="trends-bar reveal reveal-delay-2">
                <div className="trends-title-group">
                  <h3 className="section-heading">Historical Trends</h3>
                  {breakdown && <span className="badge badge-lime">Loaded</span>}
                </div>
                <button className="btn-ghost" onClick={fetchSummary}>
                  Load Statistics ↗
                </button>
              </div>

              <div className="divider" style={{ margin: "16px 0" }} />

              {(breakdown || summaryText) ? (
                <div className="stats-grid reveal reveal-delay-3">
                  {breakdown   && <SellerSummaryChart breakdown={breakdown} />}
                  {summaryText && <SellerSummaryCard  summary={summaryText} />}
                </div>
              ) : (
                <div className="empty-state reveal">
                  <div className="empty-icon">📊</div>
                  <p className="mono-sm" style={{ color: "var(--text-3)" }}>No statistics loaded yet</p>
                  <p className="empty-hint">Click "Load Statistics" to fetch historical data</p>
                </div>
              )}
            </div>

          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="footer">
          <span className="footer-text">Return Analyzer — AI Insights Engine</span>
          <span className="footer-text">{new Date().getFullYear()}</span>
        </footer>
      </div>
    </>
  );
}