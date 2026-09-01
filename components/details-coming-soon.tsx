// A live countdown implies a confirmed date — showing one against a
// placeholder target (see the old summit-countdown.tsx / rogues target)
// reads as a real deadline when it isn't one. This is the honest
// stand-in until a real date exists: say plainly that details are on
// the way, nothing more specific.
export function DetailsComingSoon({ label = "More details coming soon" }: { label?: string }) {
  return (
    <p className="ibx-coming-soon-pill" role="status">
      <span aria-hidden="true">▣</span> {label}
    </p>
  );
}
