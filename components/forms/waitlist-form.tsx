"use client";

import { useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { isEmpty, isValidEmail } from "@/lib/forms/validate";
import { launchConfetti } from "@/lib/confetti";
import { worldCountries } from "@/data/countries";

type Status = "idle" | "pending" | "success" | "error";
type Values = { name: string; email: string; role: string; country: string; motivation: string };
type Field = keyof Values;

const initialValues: Values = { name: "", email: "", role: "", country: "", motivation: "" };
const roles = ["Student", "Founder", "Developer", "Community builder", "Other"];
// The Ambassador Programme is a global movement, not limited to the
// countries the physical Tour currently visits — every country is a
// valid answer here.
const countries = worldCountries;
const requiredFields: Field[] = ["name", "email", "role", "country"];
const fields: Field[] = ["name", "email", "role", "country", "motivation"];

function getFieldError(field: Field, values: Values): string | null {
  const value = values[field];
  if (field === "email") {
    if (isEmpty(value)) return "Enter your email";
    if (!isValidEmail(value)) return "Enter a valid email address";
    return null;
  }
  if (field === "role") {
    return isEmpty(value) ? "Choose the option closest to you" : null;
  }
  if (field === "country") {
    return isEmpty(value) ? "Tell us which country you're applying from" : null;
  }
  if (field === "motivation") return null; // optional
  if (isEmpty(value)) return "This field can't be empty";
  return null;
}

export function WaitlistForm() {
  const [values, setValues] = useState<Values>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fieldRefs = useRef<Partial<Record<Field, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>>>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
  };

  const errors = Object.fromEntries(fields.map((field) => [field, getFieldError(field, values)])) as Record<Field, string | null>;
  const hasErrors = requiredFields.some((field) => errors[field]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ name: true, email: true, role: true, country: true, motivation: true });

    if (hasErrors) {
      const firstInvalid = requiredFields.find((field) => errors[field]);
      if (firstInvalid) fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setStatus("pending");
    setErrorMessage("");

    const honeypot = new FormData(event.currentTarget).get("company");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: honeypot }),
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
      setErrorMessage("Couldn't reach the server — check your connection and try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="contact-form__success" role="status">
        <p className="contact-form__success-title">Almost there.</p>
        <p>Check your email to confirm your address — then we’ll be in touch as the Ambassador Programme opens up in your region.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__honeypot" aria-hidden="true">
        <label htmlFor="wl-company">Company</label>
        <input id="wl-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={`contact-form__field${touched.name && errors.name ? " has-error" : ""}`}>
        <label htmlFor="wl-name">Name</label>
        <input
          id="wl-name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "pending"}
          ref={(el) => { fieldRefs.current.name = el ?? undefined; }}
          aria-required="true"
          aria-invalid={!!(touched.name && errors.name)}
          aria-describedby={touched.name && errors.name ? "wl-name-error" : undefined}
        />
        {touched.name && errors.name && <p id="wl-name-error" className="contact-form__field-error">{errors.name}</p>}
      </div>

      <div className={`contact-form__field${touched.email && errors.email ? " has-error" : ""}`}>
        <label htmlFor="wl-email">Email</label>
        <input
          id="wl-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "pending"}
          ref={(el) => { fieldRefs.current.email = el ?? undefined; }}
          aria-required="true"
          aria-invalid={!!(touched.email && errors.email)}
          aria-describedby={touched.email && errors.email ? "wl-email-error" : undefined}
        />
        {touched.email && errors.email && <p id="wl-email-error" className="contact-form__field-error">{errors.email}</p>}
      </div>

      <div className={`contact-form__field${touched.country && errors.country ? " has-error" : ""}`}>
        <label htmlFor="wl-country">Which country are you applying from?</label>
        <select
          id="wl-country"
          name="country"
          value={values.country}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "pending"}
          ref={(el) => { fieldRefs.current.country = el ?? undefined; }}
          aria-required="true"
          aria-invalid={!!(touched.country && errors.country)}
          aria-describedby={touched.country && errors.country ? "wl-country-error" : undefined}
        >
          <option value="" disabled>Choose one</option>
          {countries.map((country) => <option key={country} value={country}>{country}</option>)}
        </select>
        {touched.country && errors.country && <p id="wl-country-error" className="contact-form__field-error">{errors.country}</p>}
      </div>

      <div className={`contact-form__field${touched.role && errors.role ? " has-error" : ""}`}>
        <label htmlFor="wl-role">Which best describes you?</label>
        <select
          id="wl-role"
          name="role"
          value={values.role}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "pending"}
          ref={(el) => { fieldRefs.current.role = el ?? undefined; }}
          aria-required="true"
          aria-invalid={!!(touched.role && errors.role)}
          aria-describedby={touched.role && errors.role ? "wl-role-error" : undefined}
        >
          <option value="" disabled>Choose one</option>
          {roles.map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
        {touched.role && errors.role && <p id="wl-role-error" className="contact-form__field-error">{errors.role}</p>}
      </div>

      <div className="contact-form__field">
        <label htmlFor="wl-motivation">Why do you want to be an IBX Ambassador? (optional)</label>
        <textarea
          id="wl-motivation"
          name="motivation"
          rows={4}
          value={values.motivation}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "pending"}
          ref={(el) => { fieldRefs.current.motivation = el ?? undefined; }}
          placeholder="Tell us about your community, experience or what you'd want to do locally."
        />
      </div>

      {status === "error" && (
        <p className="contact-form__error" role="alert">{errorMessage}</p>
      )}

      <button type="submit" className="contact-form__submit" disabled={status === "pending"}>
        {status === "pending" ? "Joining…" : "Join the waitlist"}
      </button>
    </form>
  );
}
