import { useState, type FormEvent } from "react";
import { requestLogin } from "./api/client";

function normalizePhone(value: string): string {
  return value.trim().replace(/[().\s-]/g, "");
}

function isPlausiblePhone(value: string): boolean {
  return /^\+?[1-9]\d{7,14}$/.test(normalizePhone(value));
}

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isPlausiblePhone(phoneNumber)) {
      setError("Enter a valid phone number, including country code if needed.");
      return;
    }

    setBusy(true);
    try {
      await requestLogin({ phoneNumber: normalizePhone(phoneNumber) });
      setError("Login request accepted. Follow the verification instructions.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to start sign-in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="login-card" aria-labelledby="page-title">
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">L</div>
          <span className="brand-name">Lawncare<span>.</span></span>
        </div>
        <div className="intro">
          <p className="eyebrow">COMMUNITY LAWN SERVICES</p>
          <h1 id="page-title">A greener community<br /><em>starts here.</em></h1>
          <p className="intro-copy">Sign in to view your enrollment, keep up with service visits, and manage lawn care requests for your property.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="phoneNumber">Phone number</label>
          <div className="phone-field">
            <span aria-hidden="true">＋</span>
            <input id="phoneNumber" name="phoneNumber" type="tel" autoComplete="tel" inputMode="tel"
              placeholder="Your phone number" value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              aria-describedby="phone-help login-message" required />
          </div>
          <p className="field-help" id="phone-help">Use the number associated with your lawn care enrollment.</p>
          <button type="submit" disabled={busy}>{busy ? "Please wait…" : "Continue"} <span aria-hidden="true">↗</span></button>
          <p className="form-message" id="login-message" role="status" aria-live="polite">{error}</p>
        </form>
        <div className="security-note">
          <span className="lock-icon" aria-hidden="true">⌑</span>
          <p><strong>Private by design</strong><br />Your property and payment information should only be available after secure verification.</p>
        </div>
      </section>
      <aside className="visual-panel" aria-label="Illustration of a lawn and new growth">
        <div className="visual-copy">
          <span className="visual-kicker">BETTER CARE, TOGETHER</span>
          <h2>Healthy lawns.<br /><em>Happier</em> communities.</h2>
          <p>One simple place to stay connected with your community’s lawn care service.</p>
        </div>
        <div className="sun" /><div className="hill hill-back" /><div className="hill hill-middle" /><div className="hill hill-front" />
        <div className="sprout" aria-hidden="true"><i /><b /><span /></div>
        <span className="decor decor-one">✳</span><span className="decor decor-two">✦</span>
      </aside>
      <footer className="page-footer"><span>LAWNCARE</span><span>COMMUNITY CARE, GROWN SIMPLY</span></footer>
    </main>
  );
}
