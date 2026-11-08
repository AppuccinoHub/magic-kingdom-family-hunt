export function DeviceNotice() {
  return (
    <div className="rounded-3xl border-4 border-ink bg-lilac p-4" role="note" data-testid="device-notice">
      <h2 className="text-xl font-bold leading-tight">Saved in this browser</h2>
      <p className="mt-2 text-base font-bold leading-snug">
        Progress and photos stay in this browser on this device. Clearing this browser’s saved data can erase them. Another phone does not share this progress. Pass this phone around your family.
      </p>
    </div>
  );
}

export function ParkNotice() {
  return (
    <p className="rounded-2xl border-2 border-gold bg-gold-soft p-4 text-lg font-bold leading-snug text-ink">
      Times and treats printed on the card can change. Check at the park on the day you go. This app has no timer.
    </p>
  );
}

export function UnofficialNotice() {
  return (
    <p className="text-base leading-snug text-ink">
      An independent fan activity for families. Not an official Disney app. Not affiliated with The Walt Disney Company or Walt Disney World.
    </p>
  );
}

export function AdvisorLine({ name }: { name: string }) {
  const trimmed = name.trim();
  return <p className="text-lg font-bold text-ink">{trimmed ? `Shared by ${trimmed}.` : "Shared by your travel advisor."}</p>;
}
