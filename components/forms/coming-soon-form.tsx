"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { isEmpty, isValidEmail } from "@/lib/forms/validate";
import { launchConfetti } from "@/lib/confetti";

type Status = "idle" | "pending" | "success" | "error";

function getEmailError(email: string): string | null {
  if (isEmpty(email)) return "Enter your email";
  if (!isValidEmail(email)) return "Enter a valid email address";
  return null;
}

export function ComingSoonForm({ continent, continentSlug }: { continent: string; continentSlug: string }) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  const error = getEmailError(email);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const handleBlur = () => setTouched(true);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);

    if (error) {
      emailRef.current?.focus();
      return;
    }

    setStatus("pending");
    setErrorMessage("");

    const honeypot = new FormData(event.currentTarget).get("company");

    try {
      const response = await fetch("/api/coming-soon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, continent, continentSlug, company: honeypot }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setStatus("error");
        setErrorMessage(result.error ?? "Something went wrong — please try again.");
        return;
      }

      setStatus("success");
      launchConfetti();
    } catch {
      setStatus("error");
      setErrorMessage("Couldn't reach the server — try again.");
    }
  };

  if (status === "success") {
    return <p className="continent-soon__success">Almost there — check your email to confirm, and we&rsquo;ll let you know when {continent} is confirmed.</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <div className="contact-form__honeypot" aria-hidden="true">
          <label htmlFor="cs-company">Company</label>
          <input id="cs-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <label className="sr-only" htmlFor="continent-email">Email address</label>
        <input
          id="continent-email"
          name="email"
          type="email"
          placeholder="Enter your email for updates"
          autoComplete="email"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "pending"}
          ref={emailRef}
          aria-required="true"
          aria-invalid={touched && !!error}
          aria-describedby={touched && error ? "continent-email-error" : undefined}
        />
        <button type="submit" disabled={status === "pending"}>{status === "pending" ? "Sending…" : "Notify me →"}</button>
      </form>
      {touched && error && <p id="continent-email-error" className="continent-soon__error">{error}</p>}
      {status === "error" && <p className="continent-soon__error" role="alert">{errorMessage}</p>}
    </>
  );
}
