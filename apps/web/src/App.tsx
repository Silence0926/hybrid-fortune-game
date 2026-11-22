const systems = [
  ["BaZi", "Four Pillars", "Ruleset pending validation"],
  ["Zi Wei Dou Shu", "Purple Star Astrology", "School and placement rules pending"],
  ["I Ching", "Book of Changes", "Independent user-initiated casting"],
  ["Chinese Almanac", "Traditional calendar", "Regional edition pending"],
  ["Western Astrology", "Natal chart", "Zodiac and ephemeris policy pending"]
];

export default function App() {
  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand-mark">HF</div>
        <div>
          <p className="eyebrow">CULTURAL COMPUTING PLATFORM</p>
          <h1>Hybrid Fortune <span>&</span> Destiny</h1>
        </div>
        <span className="version">PREVIEW 0.1.0</span>
      </header>

      <section className="hero">
        <p className="eyebrow">FIVE SYSTEMS · ONE MODULAR EXPERIENCE</p>
        <h2>Explore traditions.<br /><em>Understand the framework.</em></h2>
        <p className="intro">A structured space for cultural learning and personal reflection. Each system keeps its own rules, sources, and calculation history.</p>
        <div className="notice">This project is for cultural, educational, and entertainment purposes. It does not provide scientifically validated predictions.</div>
      </section>

      <section className="section-heading">
        <div><p className="eyebrow">SYSTEM DIRECTORY</p><h3>Explore the five systems</h3></div>
        <span>ENGINE STATUS</span>
      </section>
      <section className="system-grid">
        {systems.map(([name, subtitle, status], index) => (
          <article className="system-card" key={name}>
            <div className="card-top"><span className="number">0{index + 1}</span><span className="status">IN DEVELOPMENT</span></div>
            <h4>{name}</h4><p className="subtitle">{subtitle}</p><p className="card-status">{status}</p>
          </article>
        ))}
      </section>
      <footer>HYBRID FORTUNE & DESTINY SIMULATION GAME <span>·</span> FOUNDATION RELEASE</footer>
    </main>
  );
}
