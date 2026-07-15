import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TESTIMONIALS = [
  { quote: "Landed 3 interviews in two weeks after fixing my resume gaps."},
  { quote: "The roadmap made 'what do I learn next' actually simple."},
  { quote: "Interview prep felt like practicing with someone who knew the role."},
];

function GrowthPanel() {
  const [drawn, setDrawn] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [quoteIdx, setQuoteIdx] = useState(0);
  const panelRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 250);
    const interval = setInterval(() => setQuoteIdx((i) => (i + 1) % TESTIMONIALS.length), 4200);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  const handleMouseMove = (e) => {
    const rect = panelRef.current.getBoundingClientRect();
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const q = TESTIMONIALS[quoteIdx];

  return (
    <div
      ref={panelRef}
      onMouseMove={handleMouseMove}
      className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0F2E2B] p-10 text-white lg:flex"
    >
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-300 ease-out"
        style={{
          background: `radial-gradient(500px circle at ${glowPos.x}% ${glowPos.y}%, rgba(232,176,75,0.16), transparent 60%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px circle at 8% 95%, rgba(232,176,75,0.22), transparent 60%), radial-gradient(500px circle at 95% 5%, rgba(255,255,255,0.06), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />

      <div className="relative flex items-center gap-2 text-[15px] font-semibold tracking-tight">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8B04B] text-[13px] font-bold text-[#0F2E2B]">
          AC
        </span>
        AI Career Coach
      </div>

      <div className="relative">
        <span className="mb-4 inline-block rounded-full border border-[#E8B04B]/30 bg-[#E8B04B]/10 px-3 py-1 text-[11px] font-medium tracking-wide text-[#E8B04B]">
          Trusted by job seekers worldwide
        </span>
        <h2 className="font-serif text-[44px] leading-[1.08] text-white">
          Your career,<br />mapped step<br />by step.
        </h2>
        <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/60">
          Track your progress, close skill gaps, and walk into every interview prepared.
        </p>

        <div className="mt-7 flex items-center gap-4">
          <div className="flex items-center -space-x-2">
            {["#E8B04B", "#7C9C7C", "#C9846B", "#6B8FA3"].map((c, i) => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-[#0F2E2B]" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
            <div className="font-serif text-[20px] font-semibold text-[#E8B04B]">2.3×</div>
            <div className="text-[11px] leading-tight text-white/60">more interview<br />callbacks</div>
          </div>
        </div>

        <div key={quoteIdx} className="mt-6 max-w-xs animate-[fadeIn_0.5s_ease-out]">
          <p className="text-[13px] italic leading-relaxed text-white/70">"{q.quote}"</p>
          <p className="mt-2 text-[11.5px] font-medium text-white/50">{q.name} · {q.role}</p>
          <div className="mt-3 flex gap-1.5">
            {TESTIMONIALS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === quoteIdx ? "w-5 bg-[#E8B04B]" : "w-1.5 bg-white/20"}`} />
            ))}
          </div>
        </div>
      </div>

      <svg viewBox="0 0 320 160" className="absolute -bottom-6 -left-4 h-[220px] w-[360px]">
        <path
          d="M10 150 C 70 150, 60 90, 120 90 S 190 40, 250 40 S 300 15, 310 10"
          fill="none" stroke="#E8B04B" strokeWidth="2" strokeDasharray="420"
          strokeDashoffset={drawn ? 0 : 420}
          style={{ transition: "stroke-dashoffset 1.6s ease-out" }} opacity="0.55"
        />
        {[[10, 150], [120, 90], [250, 40], [310, 10]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i === 3 ? 6 : 4}
            fill={i === 3 ? "#E8B04B" : "#F5F1E8"} fillOpacity={i === 3 ? 1 : 0.85}
            style={{ transition: `opacity 0.4s ease-out ${0.4 + i * 0.3}s`, opacity: drawn ? 1 : 0 }} />
        ))}
      </svg>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

function FloatingInput({ label, type = "text", value, onChange, extra }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
        className="peer w-full rounded-lg border border-border bg-card px-3.5 pb-2 pt-5 text-[13.5px] outline-none transition-all focus:border-[#0F2E2B] focus:ring-4 focus:ring-[#0F2E2B]/8"
      />
      <span
        className={`pointer-events-none absolute left-3.5 font-medium text-ink-500 transition-all duration-150 ${
          active ? "top-2 text-[10.5px] text-[#0F2E2B]" : "top-1/2 -translate-y-1/2 text-[13.5px]"
        }`}
      >
        {label}
      </span>
      {extra}
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password.");
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
          <h1 className="text-[26px] font-semibold tracking-tight text-ink-900">Welcome back</h1>
          <p className="mt-1.5 text-[13.5px] text-ink-500">Log in to continue your progress.</p>

          {error && (
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12.5px] text-red-600">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
            <FloatingInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div>
              <FloatingInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="mt-1.5 text-right">
                <span className="cursor-pointer text-[11.5px] font-medium text-[#0F2E2B]/70 hover:text-[#0F2E2B]">Forgot password?</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-1 overflow-hidden rounded-lg bg-[#0F2E2B] py-3 text-[13.5px] font-semibold text-white shadow-sm transition-all hover:shadow-lg hover:shadow-[#0F2E2B]/25 disabled:opacity-60"
            >
              <span className="relative flex items-center justify-center gap-2">
                {loading && (
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                {loading ? "Logging in…" : "Log in"}
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
            Don't have an account? <Link to="/signup" className="font-semibold text-[#0F2E2B]">Sign up</Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}