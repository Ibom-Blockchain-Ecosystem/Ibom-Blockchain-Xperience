"use client";

import { useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { isEmpty, isValidEmail } from "@/lib/forms/validate";
import { launchConfetti } from "@/lib/confetti";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";

const turnstileEnabled = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type ProgrammeValue = "summit" | "tour" | "build";
const programmeOptions: { value: ProgrammeValue; label: string }[] = [
  { value: "summit", label: "IBX Summit" },
  { value: "tour", label: "IBX Tour" },
  { value: "build", label: "IBX Build" },
];

type Status = "idle" | "pending" | "success" | "error";
type Values = { orgName: string; contactName: string; email: string; partnershipType: string; programmes: ProgrammeValue[]; message: string };
type TextField = Exclude<keyof Values, "programmes">;

const initialValues: Values = { orgName: "", contactName: "", email: "", partnershipType: "", programmes: [], message: "" };
const partnershipTypes = ["Sponsorship", "Technology partner", "Media partner", "Venue / logistics", "Other"];
const textFields: TextField[] = ["orgName", "contactName", "email", "partnershipType", "message"];

function getTextFieldError(field: TextField, values: Values): string | null {
  const value = values[field];
  if (field === "email") {
    if (isEmpty(value)) return "Enter your email";
    if (!isValidEmail(value)) return "Enter a valid email address";
    return null;
  }
  if (field === "partnershipType") {
    return isEmpty(value) ? "Choose a partnership type" : null;
  }
  if (isEmpty(value)) return "This field can't be empty";
  return null;
}

export function PartnerApplicationForm() {
  const [values, setValues] = useState<Values>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const fieldRefs = useRef<Partial<Record<keyof Values, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>>>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
  };

  const toggleProgramme = (programme: ProgrammeValue) => {
    setTouched((current) => ({ ...current, programmes: true }));
    setValues((current) => ({
      ...current,
      programmes: current.programmes.includes(programme)
        ? current.programmes.filter((item) => item !== programme)
        : [...current.programmes, programme],
    }));
  };

  const allSelected = values.programmes.length === programmeOptions.length;
  const toggleAll = () => {
    setTouched((current) => ({ ...current, programmes: true }));
    setValues((current) => ({ ...current, programmes: allSelected ? [] : programmeOptions.map((option) => option.value) }));
  };

  const textErrors = Object.fromEntries(textFields.map((field) => [field, getTextFieldError(field, values)])) as Record<TextField, string | null>;
  const programmesError = values.programmes.length === 0 ? "Choose at least one campaign" : null;
  const hasErrors = textFields.some((field) => textErrors[field]) || !!programmesError;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ orgName: true, contactName: true, email: true, partnershipType: true, programmes: true, message: true });

    if (hasErrors) {
      const firstInvalidText = textFields.find((field) => textErrors[field]);
      if (firstInvalidText) {
        fieldRefs.current[firstInvalidText]?.focus();
      } else if (programmesError) {
        fieldRefs.current.programmes?.focus();
      }
      return;
    }

    if (turnstileEnabled && !turnstileToken) {
      setErrorMessage("Verification is still checking — wait a second and try again.");
      setStatus("error");
      return;
    }

    setStatus("pending");
    setErrorMessage("");

    const honeypot = new FormData(event.currentTarget).get("company");

    try {
      const response = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: honeypot, turnstileToken }),
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
        <p className="contact-form__success-title">Application received.</p>
        <p>Thanks for reaching out — the IBX partnerships team will follow up soon.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__honeypot" aria-hidden="true">
        <label htmlFor="pa-company-hp">Company website</label>
        <input id="pa-company-hp" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={`contact-form__field${touched.orgName && textErrors.orgName ? " has-error" : ""}`}>
        <label htmlFor="pa-org">Organisation name</label>
        <input
          id="pa-org"
          name="orgName"
          type="text"
          autoComplete="organization"
          value={values.orgName}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "pending"}
          ref={(el) => { fieldRefs.current.orgName = el ?? undefined; }}
          aria-required="true"
          aria-invalid={!!(touched.orgName && textErrors.orgName)}
          aria-describedby={touched.orgName && textErrors.orgName ? "pa-org-error" : undefined}
        />
        {touched.orgName && textErrors.orgName && <p id="pa-org-error" className="contact-form__field-error">{textErrors.orgName}</p>}
      </div>

      <div className={`contact-form__field${touched.contactName && textErrors.contactName ? " has-error" : ""}`}>
        <label htmlFor="pa-contact">Your name</label>
        <input
          id="pa-contact"
          name="contactName"
          type="text"
          autoComplete="name"
          value={values.contactName}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "pending"}
          ref={(el) => { fieldRefs.current.contactName = el ?? undefined; }}
          aria-required="true"
          aria-invalid={!!(touched.contactName && textErrors.contactName)}
          aria-describedby={touched.contactName && textErrors.contactName ? "pa-contact-error" : undefined}
        />
        {touched.contactName && textErrors.contactName && <p id="pa-contact-error" className="contact-form__field-error">{textErrors.contactName}</p>}
      </div>

      <div className={`contact-form__field${touched.email && textErrors.email ? " has-error" : ""}`}>
        <label htmlFor="pa-email">Email</label>
        <input
          id="pa-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "pending"}
          ref={(el) => { fieldRefs.current.email = el ?? undefined; }}
          aria-required="true"
          aria-invalid={!!(touched.email && textErrors.email)}
          aria-describedby={touched.email && textErrors.email ? "pa-email-error" : undefined}
        />
        {touched.email && textErrors.email && <p id="pa-email-error" className="contact-form__field-error">{textErrors.email}</p>}
      </div>

      <div className={`contact-form__field${touched.partnershipType && textErrors.partnershipType ? " has-error" : ""}`}>
        <label htmlFor="pa-type">Partnership type</label>
        <select
          id="pa-type"
          name="partnershipType"
          value={values.partnershipType}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "pending"}
          ref={(el) => { fieldRefs.current.partnershipType = el ?? undefined; }}
          aria-required="true"
          aria-invalid={!!(touched.partnershipType && textErrors.partnershipType)}
          aria-describedby={touched.partnershipType && textErrors.partnershipType ? "pa-type-error" : undefined}
        >
          <option value="" disabled>Choose one</option>
          {partnershipTypes.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        {touched.partnershipType && textErrors.partnershipType && <p id="pa-type-error" className="contact-form__field-error">{textErrors.partnershipType}</p>}
      </div>

      <fieldset className={`contact-form__field${touched.programmes && programmesError ? " has-error" : ""}`}>
        <legend>Which campaign(s) do you want to partner or sponsor?</legend>
        <div className="contact-form__checkbox-group" aria-describedby={touched.programmes && programmesError ? "pa-programmes-error" : undefined}>
          <label className={`contact-form__checkbox contact-form__checkbox--all${allSelected ? " is-checked" : ""}`}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              disabled={status === "pending"}
              ref={(el) => { fieldRefs.current.programmes = el ?? undefined; }}
            />
            <span className="contact-form__checkbox__mark" aria-hidden="true">✓</span>
            All campaigns
          </label>
          {programmeOptions.map((option) => {
            const checked = values.programmes.includes(option.value);
            return (
              <label key={option.value} className={`contact-form__checkbox${checked ? " is-checked" : ""}`}>
                <input
                  type="checkbox"
                  name="programmes"
                  value={option.value}
                  checked={checked}
                  onChange={() => toggleProgramme(option.value)}
                  disabled={status === "pending"}
                />
                <span className="contact-form__checkbox__mark" aria-hidden="true">✓</span>
                {option.label}
              </label>
            );
          })}
        </div>
        {touched.programmes && programmesError && <p id="pa-programmes-error" className="contact-form__field-error">{programmesError}</p>}
      </fieldset>

      <div className={`contact-form__field${touched.message && textErrors.message ? " has-error" : ""}`}>
        <label htmlFor="pa-message">Tell us about the partnership</label>
        <textarea
          id="pa-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "pending"}
          ref={(el) => { fieldRefs.current.message = el ?? undefined; }}
          aria-required="true"
          aria-invalid={!!(touched.message && textErrors.message)}
          aria-describedby={touched.message && textErrors.message ? "pa-message-error" : undefined}
        />
        {touched.message && textErrors.message && <p id="pa-message-error" className="contact-form__field-error">{textErrors.message}</p>}
      </div>

      <TurnstileWidget onToken={setTurnstileToken} />

      {status === "error" && (
        <p className="contact-form__error" role="alert">{errorMessage}</p>
      )}

      <button type="submit" className="contact-form__submit" disabled={status === "pending"}>
        {status === "pending" ? "Sending…" : "Submit application"}
      </button>
    </form>
  );
}
