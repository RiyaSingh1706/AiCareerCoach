import "../styles/auth.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-side">
        <div className="trajectory-wrap">
          <svg width="100%" height="100%" viewBox="0 0 520 720" preserveAspectRatio="xMidYMid slice">
            <path
              className="trajectory-path"
              d="M 40 560 C 140 560, 150 460, 210 430 C 270 400, 260 300, 330 260 C 400 220, 400 120, 470 90"
              fill="none"
              stroke="#F5A623"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle className="trajectory-node n1" cx="40" cy="560" r="6" fill="#F5A623" />
            <text className="trajectory-label n1" x="54" y="565" fill="rgba(255,255,255,0.75)" fontFamily="IBM Plex Mono, monospace" fontSize="12">RESUME</text>

            <circle className="trajectory-node n2" cx="210" cy="430" r="6" fill="#F5A623" />
            <text className="trajectory-label n2" x="224" y="435" fill="rgba(255,255,255,0.75)" fontFamily="IBM Plex Mono, monospace" fontSize="12">INTERVIEW</text>

            <circle className="trajectory-node n3" cx="330" cy="260" r="6" fill="#F5A623" />
            <text className="trajectory-label n3" x="344" y="265" fill="rgba(255,255,255,0.75)" fontFamily="IBM Plex Mono, monospace" fontSize="12">OFFER</text>

            <circle className="trajectory-node n4" cx="470" cy="90" r="7" fill="#5B6EF5" />
            <text className="trajectory-label n4" x="410" y="72" fill="#fff" fontFamily="IBM Plex Mono, monospace" fontSize="12">GROWTH</text>
          </svg>
        </div>

        <div className="auth-brand">Career Coach</div>

        <div className="auth-side-copy">
          <h1>Every strong career has a plotted path.</h1>
          <p>
            Track the moves that matter — resumes tightened, interviews rehearsed,
            offers negotiated — and see exactly where you're headed next.
          </p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">{children}</div>
      </div>
    </div>
  );
}