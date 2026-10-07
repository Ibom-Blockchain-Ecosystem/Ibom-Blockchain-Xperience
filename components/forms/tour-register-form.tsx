"use client";

import { useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { isEmpty, isValidEmail } from "@/lib/forms/validate";
import { launchConfetti } from "@/lib/confetti";
import { getCitiesForCountry, tourCountryOptions } from "@/data/stops";

type Status = "idle" | "pending" | "success" | "error";
type Values = { name: string; email: string; country: string; city: string };
type Field = keyof Values;

const initialValues: Values = { name: "", email: "", country: "", city: "" };
const fields: Field[] = ["name", "email", "country", "city"];

function getFieldError(field: Field, values: Values): string | null {
  const value = values[field];
  if (field === "email") {
    if (isEmpty(value)) return "Enter your email";
    if (!isValidEmail(value)) return "Enter a valid email address";
    return null;
  }
  if (field === "country") return isEmpty(value) ? "Choose a country" : null;
  if (field === "city") return isEmpty(value) ? "Choose a city" : null;
  if (isEmpty(value)) return "This field can't be empty";
  return null;
}

export function TourRegisterForm({ initialCountry }: { initialCountry?: string }) {
  const [values, setValues] = useState<Values>({ ...initialValues, country: initialCountry ?? "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fieldRefs = useRef<Partial<Record<Field, HTMLInputElement | HTMLSelectElement>>>({});

  const cities = values.country ? getCitiesForCountry(values.country) : [];

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: value,
      // Changing country invalidates whatever city was picked for the
      // old one — a stale Cotonou pick sitting under a Ghana selection
      // would silently submit the wrong country/city pair.
      ...(name === "country" ? { city: "" } : {}),
    }));
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
  };

  const errors = Object.fromEntries(fields.map((field) => [field, getFieldError(field, values)])) as Record<Field, string | null>;
  const hasErrors = fields.some((field) => errors[field]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ name: true, email: true, country: true, city: true });

    if (hasErrors) {
      const firstInvalid = fields.find((field) => errors[field]);
      if (firstInvalid) fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setStatus("pending");
    setErrorMessage("");

    const honeypot = new FormData(event.currentTarget).get("company");

    try {
      const response = await fetch("/api/tour-register", {
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
        <p>Check your email to confirm your address — you&apos;ll get Tour updates for your stop, plus a link to join our Telegram channel.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__honeypot" aria-hidden="true">
        <label htmlFor="tr-company">Company</label>
        <input id="tr-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={`contact-form__field${touched.name && errors.name ? " has-error" : ""}`}>
        <label htmlFor="tr-name">Name</label>
        <input
          id="tr-name"
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
          aria-describedby={touched.name && errors.name ? "tr-name-error" : undefined}
        />
        {touched.name && errors.name && <p id="tr-name-error" className="contact-form__field-error">{errors.name}</p>}
      </div>

      <div className={`contact-form__field${touched.email && errors.email ? " has-error" : ""}`}>
        <label htmlFor="tr-email">Email</label>
        <input
          id="tr-email"
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
          aria-describedby={touched.email && errors.email ? "tr-email-error" : undefined}
        />
        {touched.email && errors.email && <p id="tr-email-error" className="contact-form__field-error">{errors.email}</p>}
      </div>

      <div className={`contact-form__field${touched.country && errors.country ? " has-error" : ""}`}>
        <label htmlFor="tr-country">Which country&apos;s tour stop?</label>
        <select
          id="tr-country"
          name="country"
          value={values.country}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "pending"}
          ref={(el) => { fieldRefs.current.country = el ?? undefined; }}
          aria-required="true"
          aria-invalid={!!(touched.country && errors.country)}
          aria-describedby={touched.country && errors.country ? "tr-country-error" : undefined}
        >
          <option value="" disabled>Choose one</option>
          {tourCountryOptions.map((option) => <option key={option.slug} value={option.country}>{option.country}</option>)}
        </select>
        {touched.country && errors.country && <p id="tr-country-error" className="contact-form__field-error">{errors.country}</p>}
      </div>

      <div className={`contact-form__field${touched.city && errors.city ? " has-error" : ""}`}>
        <label htmlFor="tr-city">Which city?</label>
        <select
          id="tr-city"
          name="city"
          value={values.city}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "pending" || !values.country}
          ref={(el) => { fieldRefs.current.city = el ?? undefined; }}
          aria-required="true"
          aria-invalid={!!(touched.city && errors.city)}
          aria-describedby={touched.city && errors.city ? "tr-city-error" : undefined}
        >
          <option value="" disabled>{values.country ? "Choose one" : "Choose a country first"}</option>
          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>
        {touched.city && errors.city && <p id="tr-city-error" className="contact-form__field-error">{errors.city}</p>}
      </div>

      {status === "error" && (
        <p className="contact-form__error" role="alert">{errorMessage}</p>
      )}

      <button type="submit" className="contact-form__submit" disabled={status === "pending"}>
        {status === "pending" ? "Registering…" : "Register for the Tour"}
      </button>
    </form>
  );
}
