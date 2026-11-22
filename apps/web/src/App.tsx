import { useState, type FormEvent } from "react";
import { BirthInputSchema, type BirthInput } from "@hybrid-fortune/domain";

const systems = [
  ["BaZi", "Four Pillars", "Ruleset encoded; calculation awaits validated calendar data"],
  ["Zi Wei Dou Shu", "Purple Star Astrology", "School and placement rules pending"],
  ["I Ching", "Book of Changes", "Independent user-initiated casting"],
  ["Chinese Almanac", "Traditional calendar", "Regional edition and source data pending"],
  ["Western Astrology", "Natal chart", "Zodiac and ephemeris policy pending"]
];

const STORAGE_KEY = "hybrid-fortune.birth-profile.v1";

function loadSavedProfile(): BirthInput | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = BirthInputSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [savedProfile, setSavedProfile] = useState<BirthInput | null>(() => loadSavedProfile());
  const [calendar, setCalendar] = useState<"gregorian" | "chinese_lunisolar">(() => savedProfile?.calendar ?? "gregorian");
  const [timePrecision, setTimePrecision] = useState<"minute" | "hour" | "date_only" | "unknown">(() => savedProfile?.timePrecision ?? "minute");
  const [solarPolicy, setSolarPolicy] = useState<"disabled" | "optional" | "required">(() => savedProfile?.trueSolarTimePolicy ?? "disabled");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const form = new FormData(event.currentTarget);
    const rawTime = String(form.get("localTime") ?? "");
    const rawLatitude = String(form.get("latitude") ?? "").trim();
    const rawLongitude = String(form.get("longitude") ?? "").trim();
    const payload = {
      localDate: String(form.get("localDate") ?? ""),
      ...(timePrecision === "minute" || timePrecision === "hour" ? { localTime: rawTime } : {}),
      timeZone: String(form.get("timeZone") ?? ""),
      calendar,
      ...(calendar === "chinese_lunisolar" ? { leapMonth: form.get("leapMonth") === "true" } : {}),
      timePrecision,
      confidence: String(form.get("confidence") ?? "exact"),
      ...(rawLatitude ? { latitude: Number(rawLatitude) } : {}),
      ...(rawLongitude ? { longitude: Number(rawLongitude) } : {}),
      trueSolarTimePolicy: solarPolicy
    };

    const result = BirthInputSchema.safeParse(payload);
    if (!result.success) {
      setError(result.error.issues.map((issue) => issue.message).join(" "));
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
      setSavedProfile(result.data);
      setMessage("Birth profile saved on this device. No calculation has been performed.");
    } catch {
      setError("The browser could not save this profile. Check local storage permissions.");
    }
  }

  function clearProfile() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setSavedProfile(null);
      setMessage("The locally saved profile has been cleared.");
      setError("");
    } catch {
      setError("The browser could not clear local storage.");
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand-mark">HF</div>
        <div>
          <p className="eyebrow">CULTURAL COMPUTING PLATFORM</p>
          <h1>Hybrid Fortune <span>&</span> Destiny</h1>
        </div>
        <span className="version">PREVIEW 0.2.0</span>
      </header>

      <section className="hero">
        <p className="eyebrow">FIVE SYSTEMS · ONE MODULAR EXPERIENCE</p>
        <h2>Explore traditions.<br /><em>Understand the framework.</em></h2>
        <p className="intro">A structured space for cultural learning and personal reflection. Each system keeps its own rules, sources, and calculation history.</p>
        <div className="notice">For cultural, educational, and entertainment purposes only. This platform does not provide scientifically validated predictions.</div>
      </section>

      <section className="profile-section" id="birth-profile">
        <div className="section-heading">
          <div><p className="eyebrow">FOUNDATION · USER DATA</p><h3>Birth profile</h3></div>
          <span>LOCAL DEVICE STORAGE</span>
        </div>
        <p className="section-intro">Enter the original birth details. The application validates and stores the input locally; it does not generate a chart at this stage.</p>

        <form className="profile-form" onSubmit={handleSave}>
          <div className="form-grid">
            <label>Calendar system
              <select value={calendar} onChange={(event) => setCalendar(event.target.value as typeof calendar)}>
                <option value="gregorian">Gregorian calendar</option>
                <option value="chinese_lunisolar">Chinese lunisolar calendar</option>
              </select>
            </label>
            <label>Birth date
              <input name="localDate" type="date" defaultValue={savedProfile?.localDate ?? ""} required />
            </label>
            {calendar === "chinese_lunisolar" && (
              <label>Leap month
                <select name="leapMonth" defaultValue={String(savedProfile?.leapMonth ?? false)}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </label>
            )}
            <label>Birth time precision
              <select value={timePrecision} onChange={(event) => setTimePrecision(event.target.value as typeof timePrecision)}>
                <option value="minute">Exact to minute</option>
                <option value="hour">Known hour</option>
                <option value="date_only">Date only</option>
                <option value="unknown">Unknown</option>
              </select>
            </label>
            {(timePrecision === "minute" || timePrecision === "hour") && (
              <label>Local birth time
                <input name="localTime" type="time" step={timePrecision === "hour" ? 3600 : 60} defaultValue={savedProfile?.localTime ?? ""} required />
              </label>
            )}
            <label>Birth time confidence
              <select name="confidence" defaultValue={savedProfile?.confidence ?? "exact"}>
                <option value="exact">Exact</option>
                <option value="approximate">Approximate</option>
                <option value="unknown">Unknown</option>
              </select>
            </label>
            <label>IANA time zone
              <input name="timeZone" type="text" defaultValue={savedProfile?.timeZone ?? "Asia/Kuala_Lumpur"} placeholder="e.g. Asia/Kuala_Lumpur" required />
            </label>
            <label>Latitude (optional)
              <input name="latitude" type="number" min="-90" max="90" step="any" defaultValue={savedProfile?.latitude ?? ""} placeholder="e.g. 3.1390" required={solarPolicy === "required"} />
            </label>
            <label>Longitude (optional)
              <input name="longitude" type="number" min="-180" max="180" step="any" defaultValue={savedProfile?.longitude ?? ""} placeholder="e.g. 101.6869" required={solarPolicy === "required"} />
            </label>
            <label className="wide-field">Apparent Solar Time policy
              <select value={solarPolicy} onChange={(event) => setSolarPolicy(event.target.value as typeof solarPolicy)}>
                <option value="disabled">Disabled — use civil-time branch only</option>
                <option value="optional">Optional — calculate only when validated data is available</option>
                <option value="required">Required — coordinates must be provided</option>
              </select>
              <span className="field-help">Civil time and apparent solar time are separate branches. Selecting a policy does not itself perform the conversion.</span>
            </label>
          </div>

          {error && <p className="form-message error" role="alert">{error}</p>}
          {message && <p className="form-message success" role="status">{message}</p>}
          <div className="form-actions">
            <button className="primary-button" type="submit">Validate & save profile</button>
            {savedProfile && <button className="secondary-button" type="button" onClick={clearProfile}>Clear local profile</button>}
          </div>
        </form>

        {savedProfile && (
          <aside className="saved-profile">
            <div><p className="eyebrow">SAVED INPUT</p><h4>Profile stored on this device</h4></div>
            <dl>
              <div><dt>Date</dt><dd>{savedProfile.localDate}</dd></div>
              <div><dt>Time</dt><dd>{savedProfile.localTime ?? "Not supplied"}</dd></div>
              <div><dt>Calendar</dt><dd>{savedProfile.calendar === "gregorian" ? "Gregorian" : "Chinese lunisolar"}</dd></div>
              <div><dt>Time zone</dt><dd>{savedProfile.timeZone}</dd></div>
              <div><dt>Solar-time policy</dt><dd>{savedProfile.trueSolarTimePolicy}</dd></div>
            </dl>
            <p className="field-help">This is input storage only. No BaZi, Zi Wei Dou Shu, or astrology result has been calculated.</p>
          </aside>
        )}
      </section>

      <section className="systems-section">
        <div className="section-heading">
          <div><p className="eyebrow">SYSTEM DIRECTORY</p><h3>Explore the five systems</h3></div>
          <span>ENGINE STATUS</span>
        </div>
        <section className="system-grid">
          {systems.map(([name, subtitle, status], index) => (
            <article className="system-card" key={name}>
              <div className="card-top"><span className="number">0{index + 1}</span><span className="status">IN DEVELOPMENT</span></div>
              <h4>{name}</h4><p className="subtitle">{subtitle}</p><p className="card-status">{status}</p>
            </article>
          ))}
        </section>
      </section>
      <footer>HYBRID FORTUNE & DESTINY SIMULATION GAME <span>·</span> FOUNDATION RELEASE</footer>
    </main>
  );
}
