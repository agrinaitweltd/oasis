"use client";

import { onboardingSteps } from "@/lib/onboarding-steps";
import { AuthLogo } from "@/components/auth/AuthLogo";

export function WizardTopBar({ currentStep }: { currentStep: number }) {
  const percent = Math.round((currentStep / onboardingSteps.length) * 100);
  return (
    <div className="wizard-topbar-wrap">
      <div className="wizard-topbar">
        <AuthLogo width={110} height={38} />
        <span style={{ fontSize: 13, color: "#635f56", fontWeight: 600 }}>
          Step {currentStep} of {onboardingSteps.length}
        </span>
      </div>
      <div style={{ padding: "0 24px 12px" }}>
        <div className="wizard-progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="wizard-progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
      <nav className="wizard-steps-nav" aria-label="Onboarding steps">
        {onboardingSteps.map((step) => {
          const isActive = step.id === currentStep;
          const isDone = step.id < currentStep;
          return (
            <div key={step.id} className={`wizard-step-pill${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`}>
              <span className="wizard-step-dot">{isDone ? "✓" : step.id}</span>
              {step.shortLabel}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export function WizardStepHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="wizard-step-header">
      <p className="wizard-step-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

export function WizardFooter({
  onBack,
  onNext,
  backLabel = "Previous",
  nextLabel = "Continue",
  nextDisabled,
  saving,
  hideBack,
}: {
  onBack?: () => void;
  onNext: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  saving?: boolean;
  hideBack?: boolean;
}) {
  return (
    <div className="wizard-footer">
      <div className="wizard-footer-inner">
        {!hideBack && onBack ? (
          <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onBack}>
            &larr; {backLabel}
          </button>
        ) : (
          <span />
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span className="wizard-save-note" aria-live="polite">
            {saving ? (
              <>
                <span className="skeleton" style={{ width: 12, height: 12, borderRadius: "50%" }} /> Saving&hellip;
              </>
            ) : (
              <>&#10003; Progress saved</>
            )}
          </span>
          <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
            {!saving && !nextDisabled && <span aria-hidden="true">&rarr;</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
