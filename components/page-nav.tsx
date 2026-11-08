import { Button } from "@/components/ui/button";

export function PageNav({
  onBack,
  onNext,
  nextDisabled = false,
}: {
  onBack: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="quiet" onClick={onBack}>
        Back
      </Button>
      <Button variant="secondary" onClick={onNext} disabled={nextDisabled || !onNext}>
        Next
      </Button>
    </div>
  );
}
