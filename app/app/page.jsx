"use client";
import { useState } from "react";

const getFlagColor = (score) => {
  if (score <= 3) return { bg: "#0d2b1a", accent: "#2ecc71", label: "GREEN FLAG", emoji: "✓" };
  if (score <= 6) return { bg: "#2b2200", accent: "#f39c12", label: "YELLOW FLAG", emoji: "⚠" };
  return { bg: "#2b0a0a", accent: "#e74c3c", label: "RED FLAG", emoji: "⛔" };
};

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [charCount, setCharCount] = useState(0);

  const analyze = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const flag = result ? getFlagColor(result.redFlagScore) : null;
  const examples = [
    "He texts me every day but cancels plans last minute every time",
    "She said she loves me after 2 weeks of dating",
    "He never posts me on social media but says I'm his girlfriend",
    "She reads my messages but takes 3 days to reply",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0ece4", fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ marginBottom: "52px", textAlign: "center" }}>
          <div style={{ display: "inline-block", border: "1px solid #e74c3c", color: "#e74c3c", fontSize: "10px", letterSpacing: "4px", padding: "6px 14px", marginBottom: "20px", fontFamily: "'Courier New', monospace" }}>
            BRUTAL HONESTY MODE: ON
          </div>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 54px)", fontWeight: "400", lineHeight: "1.1", margin: "0 0 16px", letterSpacing: "-1px" }}>
            Ick<br /><em style={{ fontStyle: "italic", color: "#c0bab0" }}>Detector</em>
          </h1>
          <p style={{ color: "#7a756e", fontSize: "15px", margin: 0, fontFamily: "'Courier New', monospace" }}>
            Describe the behavior. Get the truth.
          </p>
        </div>

        <div style={{ marginBottom: "12px", position: "relative" }}>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setCharCount(e.target.value.length); }}
            placeholder="Describe what's happening... (e.g. 'He tells me he loves me but still talks to his ex every day')"
            rows={5}
            style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: "2px", color: "#f0ece4", fontSize: "16px", padding: "20px", fontFamily: "'Georgia', serif", resize: "vertical", outline: "none", lineHeight: "1.6", boxSizing: "border-box" }}
          />
          <div style={{ position: "absolute", bottom: "12px", right: "16px", color: "#3a3a3a", fontSize: "11px", fontFamily: "monospace" }}>{charCount}</div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <p style={{ color: "#3a3a3a", fontSize: "11px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>TRY AN EXAMPLE</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {examples.map((ex, i) => (
              <button key={i} onClick={() => { setInput(ex); setCharCount(ex.length); }} style={{ background: "transparent", border: "1px solid #222", color: "#5a5550", fontSize: "12px", padding: "6px 12px", cursor: "pointer", borderRadius: "1px", fontFamily: "Georgia, serif", textAlign: "left" }}>
                "{ex.length > 45 ? ex.slice(0, 45) + "…" : ex}"
              </button>
            ))}
          </div>
        </div>

        <button onClick={analyze} disabled={!input.trim() || loading} style={{ width: "100%", padding: "18px", background: loading || !input.trim() ? "#1a1a1a" : "#e74c3c", color: loading || !input.trim() ? "#444" : "#fff", border: "none", borderRadius: "2px", fontSize: "13px", letterSpacing: "3px", fontFamily: "'Courier New', monospace", cursor: loading ? "not-allowed" : "pointer", fontWeight: "600", marginBottom: "48px" }}>
          {loading ? "DETECTING THE ICK..." : "DETECT THE ICK"}
        </button>

        {error && <div style={{ color: "#e74c3c", fontFamily: "monospace", fontSize: "13px", textAlign: "center", marginTop: "-32px", marginBottom: "32px" }}>{error}</div>}

        {result && flag && (
          <div style={{ background: flag.bg, border: `1px solid ${flag.accent}22`, borderLeft: `3px solid ${flag.accent}`, borderRadius: "2px", padding: "36px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "10px", letterSpacing: "3px", color: flag.accent, fontFamily: "monospace", marginBottom: "8px" }}>{flag.emoji} {flag.label} — {result.label}</div>
                <p style={{ fontSize: "clamp(20px, 4vw, 26px)", fontWeight: "400", margin: 0, lineHeight: "1.3", color: "#f0ece4" }}>"{result.verdict}"</p>
              </div>
              <div style={{ textAlign: "center", minWidth: "64px", background: "#0a0a0a", border: `1px solid ${flag.accent}33`, padding: "12px 16px", borderRadius: "2px" }}>
                <div style={{ fontSize: "28px", fontWeight: "400", color: flag.accent, lineHeight: 1 }}>{result.redFlagScore}</div>
                <div style={{ fontSize: "9px", color: "#3a3a3a", fontFamily: "monospace", marginTop: "4px" }}>/10</div>
              </div>
            </div>

            <div style={{ marginBottom: "36px" }}>
              <div style={{ height: "3px", background: "#1a1a1a", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${result.redFlagScore * 10}%`, background: flag.accent, borderRadius: "2px" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                <span style={{ fontSize: "9px", color: "#2ecc71", fontFamily: "monospace" }}>CLEAN</span>
                <span style={{ fontSize: "9px", color: "#f39c12", fontFamily: "monospace" }}>SUSPICIOUS</span>
                <span style={{ fontSize: "9px", color: "#e74c3c", fontFamily: "monospace" }}>MAJOR ICK</span>
              </div>
            </div>

            {[{ label: "WHAT THIS REALLY MEANS", content: result.whatThisReallyMeans }, { label: "WHAT YOU SHOULD DO", content: result.whatYouShouldDo }].map(({ label, content }) => (
              <div key={label} style={{ marginBottom: "28px" }}>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#3a3a3a", fontFamily: "monospace", marginBottom: "10px" }}>{label}</div>
                <p style={{ color: "#c0bab0", fontSize: "15px", lineHeight: "1.7", margin: 0 }}>{content}</p>
              </div>
            ))}

            <div style={{ borderTop: `1px solid ${flag.accent}22`, paddingTop: "24px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", color: flag.accent, fontFamily: "monospace", marginBottom: "10px" }}>THE HARD TRUTH</div>
              <p style={{ color: flag.accent, fontSize: "16px", lineHeight: "1.5", margin: 0, fontStyle: "italic" }}>{result.hardTruth}</p>
            </div>

            <button onClick={() => { setResult(null); setInput(""); setCharCount(0); }} style={{ marginTop: "32px", background: "transparent", border: "1px solid #2a2a2a", color: "#5a5550", padding: "10px 20px", fontSize: "10px", letterSpacing: "2px", fontFamily: "monospace", cursor: "pointer" }}>
              CHECK ANOTHER SITUATION
            </button>
          </div>
        )}

        <p style={{ textAlign: "center", color: "#2a2a2a", fontSize: "11px", fontFamily: "monospace", marginTop: "60px", letterSpacing: "1px" }}>
          NO SUGARCOATING. NO EXCEPTIONS.
        </p>
      </div>
    </div>
  );
        }
