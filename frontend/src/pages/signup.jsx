import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GrowthPanel() {
  const [drawn, setDrawn] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const panelRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 250);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e) => {
    const rect = panelRef.current.getBoundingClientRect();
    setGlowPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const steps = ["Upload resume", "Get your gap analysis", "Follow your roadmap"];

  return (
    <div ref={panelRef} onMouseMove={handleMouseMove} className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0F2E2B] p-10 text-white lg:flex">
      <div className="pointer-events-none absolute inset-0 transition-[background] duration-300 ease-out"
        style={{ background: `radial-gradient(500px circle at ${glowPos.x}% ${glowPos.y}%, rgba(232,176,75,0.16), transparent 60%)` }} />
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(700px circle at 8% 95%, rgba(232,176,75,0.22), transparent 60%), radial-gradient(500px circle at 95% 5%, rgba(255,255,255,0.06), transparent 60%)" }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />

      <div className="relative flex items-center gap-2 text-[15px] font-semibold tracking-tight">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8B04B] text-[13px] font-bold text-[#0F2E2B]">AC</span>
        AI Career Coach
      </div>

      <div className="relative">
        <span className="mb-4 inline-block rounded-full border border-[#E8B04B]/30 bg-[#E8B04B]/10 px-3 py-1 text-[11px] font-medium tracking-wide text-[#E8B04B]">
          Free to start · No card required
        </span>
        <h2 className="font-serif text-[44px] leading-[1.08] text-white">
          Start closer<br />to the role<br />you want.
        </h2>
        <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/60">
          Resume feedback, skill gaps, and interview prep — tailored to your goal.
        </p>

        <div className="mt-7 flex flex-col gap-2.5">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3 transition-all duration-500"
              style={{ opacity: drawn ? 1 : 0, transform: drawn ? "translateX(0)" : "translateX(-8px)", transitionDelay: `${i * 0.15 + 0.3}s` }}>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8B04B]/20 text-[10px] font-bold text-[#E8B04B]">{i + 1}</span>
              <span className="text-[13px] text-white/70">{s}</span>
            </div>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 320 160" className="absolute -bottom-6 -left-4 h-[220px] w-[360px]">
        <path d="M10 150 C 70 150, 60 90, 120 90 S 190 40, 250 40 S 300 15, 310 10" fill="none" stroke="#E8B04B" strokeWidth="2"
          strokeDasharray="420" strokeDashoffset={drawn ? 0 : 420} style={{ transition: "stroke-dashoffset 1.6s ease-out" }} opacity="0.55" />
        {[[10, 150], [120, 90], [250, 40], [310, 10]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i === 3 ? 6 : 4} fill={i === 3 ? "#E8B04B" : "#F5F1E8"} fillOpacity={i === 3 ? 1 : 0.85}
            style={{ transition: `opacity 0.4s ease-out ${0.4 + i * 0.3}s`, opacity: drawn ? 1 : 0 }} />
        ))}
      </svg>
    </div>
  );
}

function FloatingInput({ label, type = "text", value, onChange }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative">
      <input
        type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} required
        className="peer w-full rounded-lg border border-border bg-card px-3.5 pb-2 pt-5 text-[13.5px] outline-none transition-all focus:border-[#0F2E2B] focus:ring-4 focus:ring-[#0F2E2B]/8"
      />
      <span className={`pointer-events-none absolute left-3.5 font-medium text-ink-500 transition-all duration-150 ${
        active ? "top-2 text-[10.5px] text-[#0F2E2B]" : "top-1/2 -translate-y-1/2 text-[13.5px]"
      }`}>
        {label}
      </span>
    </div>
  );
}

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}
const STRENGTH_LABELS = ["Too weak", "Weak", "Okay", "Good", "Strong"];
const STRENGTH_COLORS = ["#E5484D", "#F5A623", "#F5A623", "#7C9C7C", "#0F2E2B"];

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const strength = getStrength(password);
  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await signup(email, password);
      navigate("/");
    } catch (err) {
      setError("Could not create account. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Google sign-in failed.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <GrowthPanel />

      <div className="relative flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-sm animate-[slideUp_0.5s_ease-out]">
          <h1 className="text-[26px] font-semibold tracking-tight text-ink-900">Create your account</h1>
          <p className="mt-1.5 text-[13.5px] text-ink-500">Free to start, no card required.</p>

          {error && (
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12.5px] text-red-600">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
            <FloatingInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <div>
              <FloatingInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-colors duration-300"
                        style={{ backgroundColor: i < strength ? STRENGTH_COLORS[strength] : "#E5E1D8" }} />
                    ))}
                  </div>
                  <span className="text-[10.5px] font-medium" style={{ color: STRENGTH_COLORS[strength] }}>
                    {STRENGTH_LABELS[strength]}
                  </span>
                </div>
              )}
            </div>

            <div>
              <FloatingInput label="Confirm password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              {!passwordsMatch && (
                <p className="mt-1.5 text-[11.5px] text-red-600">Passwords don't match yet</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-lg bg-[#0F2E2B] py-3 text-[13.5px] font-semibold text-white shadow-sm transition-all hover:shadow-lg hover:shadow-[#0F2E2B]/25 disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-2">
                {loading && (
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                {loading ? "Creating account…" : "Sign up"}
              </span>
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-wide text-ink-500">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={handleGoogle}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-white py-3 text-[13px] font-semibold text-ink-700 shadow-sm transition-all hover:-translate-y-px hover:shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H24v7.6h11.3C34 32.9 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.4-5.4C33.6 6 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.4-5.4C33.6 6 29 4 24 4c-7.4 0-13.8 4.2-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5 0 9.6-1.9 13-5.1l-6-5.1c-2 1.5-4.6 2.4-7 2.4-5.6 0-10-3.8-11.6-9l-6.6 5C9.6 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H24v7.6h11.3c-.7 3.2-2.6 5.8-5.2 7.5l6 5.1C39.6 37.4 44 31.4 44 24c0-1.2-.1-2.4-.4-3.5z"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-7 text-center text-[13px] text-ink-500">
            Already have an account? <Link to="/login" className="font-semibold text-[#0F2E2B]">Log in</Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}