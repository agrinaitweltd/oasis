"use client";

// Client-side persistence for the onboarding wizard. There is no backend yet,
// so "save progress" / "resume later" is implemented with localStorage. This
// keeps the same shape a real API call would use (SchoolApplication), so
// swapping in a real backend later is a matter of replacing these functions.

import { emptyOnboardingData, type OnboardingData, type SchoolApplication } from "./onboarding-types";

const STORAGE_KEY = "oasis_school_application";

function newId() {
  return "app_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function loadApplication(): SchoolApplication {
  if (typeof window === "undefined") {
    return { id: newId(), data: emptyOnboardingData, status: "draft", submittedAt: null, updatedAt: new Date().toISOString(), lastStep: 1 };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SchoolApplication;
      // merge with defaults so newly-added fields don't crash older saved drafts
      return {
        ...parsed,
        lastStep: parsed.lastStep ?? 1,
        data: {
          ...emptyOnboardingData,
          ...parsed.data,
          organisation: { ...emptyOnboardingData.organisation, ...parsed.data?.organisation },
          schoolType: { ...emptyOnboardingData.schoolType, ...parsed.data?.schoolType },
          location: { ...emptyOnboardingData.location, ...parsed.data?.location },
          profile: { ...emptyOnboardingData.profile, ...parsed.data?.profile },
          studentNumbers: { ...emptyOnboardingData.studentNumbers, ...parsed.data?.studentNumbers },
          staff: { ...emptyOnboardingData.staff, ...parsed.data?.staff },
          academic: { ...emptyOnboardingData.academic, ...parsed.data?.academic },
          currentSystems: { ...emptyOnboardingData.currentSystems, ...parsed.data?.currentSystems },
          modules: { ...emptyOnboardingData.modules, ...parsed.data?.modules },
        },
      };
    }
  } catch {
    // fall through to a fresh application
  }
  return { id: newId(), data: emptyOnboardingData, status: "draft", submittedAt: null, updatedAt: new Date().toISOString(), lastStep: 1 };
}

export function saveApplication(app: SchoolApplication) {
  if (typeof window === "undefined") return;
  const next: SchoolApplication = { ...app, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearApplication() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function updateOnboardingData(app: SchoolApplication, patch: Partial<OnboardingData>): SchoolApplication {
  const next: SchoolApplication = { ...app, data: { ...app.data, ...patch } };
  saveApplication(next);
  return next;
}
