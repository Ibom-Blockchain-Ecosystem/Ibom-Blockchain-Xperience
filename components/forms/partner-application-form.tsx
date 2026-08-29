"use client";

import { useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { isEmpty, isValidEmail } from "@/lib/forms/validate";
import { launchConfetti } from "@/lib/confetti";

type Status = "idle" | "pending" | "success" | "error";
type Values = { orgName: string; contactName: string; email: string; partnershipType: string; message: string };
type Field = keyof Values;

const initialValues: Values = { orgName: "", contactName: "", email: "", partnershipType: "", message: "" };
const partnershipTypes = ["Sponsorship", "Technology partner", "Media partner", "Venue / logistics", "Other"];
const fields: Field[] = ["orgName", "contactName", "email", "partnershipType", "message"];

function getFieldError(field: Field, values: Values): string | null {
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
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fieldRefs = useRef<Partial<Record<Field, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>>>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
  };

  const errors = Object.fromEntries(fields.map((field) => [field, getFieldError(field, values)])) as Record<Field, string | null>;
  const hasErrors = fields.some((field) => errors[field]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ orgName: true, contactName: true, email: true, partnershipType: true, message: true });

    if (hasErrors) {
      const firstInvalid = fields.find((field) => errors[field]);
      if (firstInvalid) fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setStatus("pending");
    setErrorMessage("");

    const honeypot = new FormData(event.currentTarget).get("company");

    try {
      const response = await fetch("/api/partners", {
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

      <div className={`contact-form__field${touched.orgName && errors.orgName ? " has-error" : ""}`}>
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
          aria-invalid={!!(touched.orgName && errors.orgName)}
          aria-describedby={touched.orgName && errors.orgName ? "pa-org-error" : undefined}
        />
        {touched.orgName && errors.orgName && <p id="pa-org-error" className="contact-form__field-error">{errors.orgName}</p>}
      </div>

      <div className={`contact-form__field${touched.contactName && errors.contactName ? " has-error" : ""}`}>
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
          aria-invalid={!!(touched.contactName && errors.contactName)}
          aria-describedby={touched.contactName && errors.contactName ? "pa-contact-error" : undefined}
        />
        {touched.contactName && errors.contactName && <p id="pa-contact-error" className="contact-form__field-error">{errors.contactName}</p>}
      </div>

      <div className={`contact-form__field${touched.email && errors.email ? " has-error" : ""}`}>
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
          aria-invalid={!!(touched.email && errors.email)}
          aria-describedby={touched.email && errors.email ? "pa-email-error" : undefined}
        />
        {touched.email && errors.email && <p id="pa-email-error" className="contact-form__field-error">{errors.email}</p>}
      </div>

      <div className={`contact-form__field${touched.partnershipType && errors.partnershipType ? " has-error" : ""}`}>
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
          aria-invalid={!!(touched.partnershipType && errors.partnershipType)}
          aria-describedby={touched.partnershipType && errors.partnershipType ? "pa-type-error" : undefined}
        >
          <option value="" disabled>Choose one</option>
          {partnershipTypes.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        {touched.partnershipType && errors.partnershipType && <p id="pa-type-error" className="contact-form__field-error">{errors.partnershipType}</p>}
      </div>

      <div className={`contact-form__field${touched.message && errors.message ? " has-error" : ""}`}>
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
          aria-invalid={!!(touched.message && errors.message)}
          aria-describedby={touched.message && errors.message ? "pa-message-error" : undefined}
        />
        {touched.message && errors.message && <p id="pa-message-error" className="contact-form__field-error">{errors.message}</p>}
      </div>

      {status === "error" && (
        <p className="contact-form__error" role="alert">{errorMessage}</p>
      )}

      <button type="submit" className="contact-form__submit" disabled={status === "pending"}>
        {status === "pending" ? "Sending…" : "Submit application"}
      </button>
    </form>
  );
}
