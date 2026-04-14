import { useRef, useState } from "react";
import "./index.css";

const RATINGS = [
  { label: "Good", emoji: "😄" },
  { label: "Average", emoji: "😐" },
  { label: "Poor", emoji: "😞" },
];

export default function App() {
  const nameRef = useRef();
  const emailRef = useRef();
  const feedbackRef = useRef();
  const formRef = useRef();

  const [rating, setRating] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!nameRef.current.value.trim()) newErrors.name = "Name is required.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRef.current.value))
      newErrors.email = "Please enter a valid email address.";

    if (!rating) newErrors.rating = "Please select a rating.";

    if (!feedbackRef.current.value.trim())
      newErrors.feedback = "Feedback cannot be empty.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Submitted:", {
      name: nameRef.current.value,
      email: emailRef.current.value,
      rating,
      feedback: feedbackRef.current.value,
    });

    formRef.current.reset();
    setRating("");
    setErrors({});
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <div className="card">
      <header className="masthead">
        <p className="masthead-kicker">Reader correspondence</p>
        <h1 className="masthead-title">Share Your Feedback</h1>
        <div className="masthead-rule">
          <span />
          <em>Est. Today</em>
          <span />
        </div>
      </header>

      <div className="form-body">
        {submitted && (
          <div className="success-banner">
            ✓ &nbsp; Your feedback has been received. Thank you.
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div className="field">
              <label className="field-label">Full Name</label>
              <input
                ref={nameRef}
                type="text"
                placeholder="Nancy Sangani"
                className={`input ${errors.name ? "is-error" : ""}`}
              />
              {errors.name && <p className="error-msg">⚠ {errors.name}</p>}
            </div>

            <div className="field">
              <label className="field-label">Email Address</label>
              <input
                ref={emailRef}
                type="email"
                placeholder="nancy@email.com"
                className={`input ${errors.email ? "is-error" : ""}`}
              />
              {errors.email && <p className="error-msg">⚠ {errors.email}</p>}
            </div>

            <hr className="section-divider" />

            <div className="field">
              <label className="field-label">Your Rating</label>
              <div className={`radio-group ${errors.rating ? "is-error" : ""}`}>
                {RATINGS.map(({ label, emoji }) => (
                  <label key={label} className="radio-option">
                    <input
                      type="radio"
                      name="rate"
                      value={label}
                      checked={rating === label}
                      onChange={() => setRating(label)}
                    />
                    <div className="radio-tile">
                      <span className="radio-emoji">{emoji}</span>
                      <span className="radio-label-text">{label}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.rating && <p className="error-msg">⚠ {errors.rating}</p>}
            </div>

            <div className="field">
              <label className="field-label">Your Feedback</label>
              <textarea
                ref={feedbackRef}
                placeholder="Tell us what you think…"
                rows={4}
                className={`textarea ${errors.feedback ? "is-error" : ""}`}
              />
              {errors.feedback && (
                <p className="error-msg">⚠ {errors.feedback}</p>
              )}
            </div>

            <button type="submit" className="btn-submit">
              Submit Feedback
            </button>
          </div>
        </form>
      </div>

      <footer className="card-footer">
        All responses are read carefully &mdash; we appreciate your time
      </footer>
    </div>
  );
}
