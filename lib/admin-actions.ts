// Stubbed admin review actions for school applications.
//
// No admin dashboard UI exists yet - this file only defines the shape that
// future admin tooling will call into, so the applicant-facing flow (status
// badges, the "pending review" copy, the approval-gated document stage) has
// something real to point at. Wire these up to real endpoints / an admin UI
// when that work is scoped.

import type { ApplicationStatus, SchoolApplication } from "./onboarding-types";

export type AdminActionType = "approve" | "reject" | "request_more_info" | "suspend";

export interface AdminActionInput {
  applicationId: string;
  action: AdminActionType;
  note?: string;
}

export interface AdminActionResult {
  applicationId: string;
  status: ApplicationStatus;
  performedAt: string;
}

const actionToStatus: Record<AdminActionType, ApplicationStatus> = {
  approve: "approved",
  reject: "rejected",
  request_more_info: "more_info_requested",
  suspend: "suspended",
};

/**
 * TODO(backend): replace with a real API call once an admin review service
 * exists. Today this only computes the resulting status - it does not
 * persist anything or notify anyone.
 */
export function applyAdminAction(input: AdminActionInput): AdminActionResult {
  return {
    applicationId: input.applicationId,
    status: actionToStatus[input.action],
    performedAt: new Date().toISOString(),
  };
}

/**
 * TODO(backend): replace with a real transactional email send (e.g. via an
 * email provider's API) once one is configured. Approving an application
 * should trigger this with a secure, single-use continuation link to the
 * document-upload stage.
 */
export async function sendApprovalEmail(app: SchoolApplication, continueUrl: string): Promise<void> {
  // eslint-disable-next-line no-console
  console.info(
    `[stub] Would send approval email to ${app.data.organisation.schoolEmail} ` +
      `for application ${app.id} with continuation link: ${continueUrl}`
  );
}
