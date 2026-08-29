const MESSAGES: Record<string, { tone: "success" | "error"; text: string }> = {
  success: { tone: "success", text: "✓ Your email is confirmed." },
  invalid: { tone: "error", text: "That confirmation link has already been used or is invalid." },
  error: { tone: "error", text: "Something went wrong confirming your email — please try again or contact us." },
};

export function ConfirmationBanner({ status }: { status?: string }) {
  const info = status ? MESSAGES[status] : undefined;
  if (!info) return null;

  return (
    <div className={`confirmation-banner confirmation-banner--${info.tone}`} role="status">
      {info.text}
    </div>
  );
}
