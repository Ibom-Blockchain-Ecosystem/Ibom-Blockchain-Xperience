"use client";

import { useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { isEmpty, isValidEmail } from "@/lib/forms/validate";
import { launchConfetti } from "@/lib/confetti";

type Status = "idle" | "pending" | "success" | "error";
type Values = { name: string; email: string; subject: string; message: string };
type Field = keyof Values;

const initialValues: Values = { name: "", email: "", subject: "", message: "" };
const fields: Field[] = ["name", "email", "subject", "message"];

function getFieldError(field: Field, values: Values): string | null {
  const value = values[field];
  if (field === "email") {
    if (isEmpty(value)) return "Enter your email";
    if (!isValidEmail(value)) return "Enter a valid email address";
    return null;
  }
  if (isEmpty(value)) return "This field can't be empty";
  return null;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fieldRefs = useRef<Partial<Record<Field, HTMLInputElement | HTMLTextAreaElement>>>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
  };

  const errors = Object.fromEntries(fields.map((field) => [field, getFieldError(field, values)])) as Record<Field, string | null>;
  const hasErrors = fields.some((field) => errors[field]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });

    if (hasErrors) {
      const firstInvalid = fields.find((field) => errors[field]);
      if (firstInvalid) fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setStatus("pending");
    setErrorMessage("");

    const honeypot = new FormData(event.currentTarget).get("company");

    try {
      const response = await fetch("/api/contact", {
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
        <p className="contact-form__success-title">Message sent.</p>
        <p>Thanks for reaching out — the IBX team will get back to you soon.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__honeypot" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={`contact-form__field${touched.name && errors.name ? " has-error" : ""}`}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
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
          aria-describedby={touched.name && errors.name ? "name-error" : undefined}
        />
        {touched.name && errors.name && <p id="name-error" className="contact-form__field-error">{errors.name}</p>}
      </div>

      <div className={`contact-form__field${touched.email && errors.email ? " has-error" : ""}`}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
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
          aria-describedby={touched.email && errors.email ? "email-error" : undefined}
        />
        {touched.email && errors.email && <p id="email-error" className="contact-form__field-error">{errors.email}</p>}
      </div>

      <div className={`contact-form__field${touched.subject && errors.subject ? " has-error" : ""}`}>
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={values.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "pending"}
          ref={(el) => { fieldRefs.current.subject = el ?? undefined; }}
          aria-required="true"
          aria-invalid={!!(touched.subject && errors.subject)}
          aria-describedby={touched.subject && errors.subject ? "subject-error" : undefined}
        />
        {touched.subject && errors.subject && <p id="subject-error" className="contact-form__field-error">{errors.subject}</p>}
      </div>

      <div className={`contact-form__field${touched.message && errors.message ? " has-error" : ""}`}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === "pending"}
          ref={(el) => { fieldRefs.current.message = el ?? undefined; }}
          aria-required="true"
          aria-invalid={!!(touched.message && errors.message)}
          aria-describedby={touched.message && errors.message ? "message-error" : undefined}
        />
        {touched.message && errors.message && <p id="message-error" className="contact-form__field-error">{errors.message}</p>}
      </div>

      {status === "error" && (
        <p className="contact-form__error" role="alert">{errorMessage}</p>
      )}

      <button type="submit" className="contact-form__submit" disabled={status === "pending"}>
        {status === "pending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
