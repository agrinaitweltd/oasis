"use client";

export function OptionCard({
  label,
  selected,
  onClick,
  checkbox,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  checkbox?: boolean;
}) {
  return (
    <button
      type="button"
      className={`wizard-option-card${checkbox ? " checkbox-style" : ""}${selected ? " is-selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="wizard-option-check" aria-hidden="true" />
      {label}
    </button>
  );
}
