import type { AiApi, AiAssistRequest, AiAssistResult } from './ai.types';

const SIMULATED_LATENCY_MS = 800;

const DISCLAIMER =
  'AI-generated content is advisory only. Review it before use — requests are logged and AI never acts outside your permissions.';

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

/** Picks between phrasing variants so "Regenerate" feels non-deterministic. */
function pick<T>(variants: T[]): T {
  return variants[Math.floor(Math.random() * variants.length)];
}

function clip(context: string | undefined, max = 240): string {
  const text = (context ?? '').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function summarize(request: AiAssistRequest): string {
  const { subject, context } = request;
  const detail = clip(context);
  return pick([
    `Summary — ${subject}\n\n${detail ? `Based on the records visible to you, ${detail}` : 'Based on the records visible to you.'}\n\nKey points: the file is progressing through the standard workflow with no exceptions flagged. Recommended next step: review the outstanding items and either action or forward the file within the current processing window.`,
    `${subject} — at a glance\n\n${detail || 'The record contains routine correspondence and supporting documents.'}\n\nStatus is consistent with expectations for this document type. Two items warrant attention: pending approvals and the approaching processing deadline. No irregularities were detected in the material you can access.`,
  ]);
}

function draftFor(purpose: string, subject: string, context: string): string {
  const detail = clip(context, 400);
  if (purpose.includes('contract') || purpose.includes('tender')) {
    return (
      `The Ministry invites bids for ${subject}. ` +
      `${detail ? `Scope: ${detail}. ` : ''}` +
      'Bidders must demonstrate relevant experience, provide valid registration and tax clearance documents, and submit both technical and financial proposals before the stated deadline. Evaluation will follow the approved procurement guidelines.'
    );
  }
  if (purpose.includes('item') || purpose.includes('deliverable')) {
    return pick([
      `Supply and delivery of ${subject.toLowerCase()}, conforming to approved specifications, with installation, testing and a minimum 12-month warranty included.`,
      `${subject} — delivered, installed and commissioned at the designated site, including all accessories, documentation and post-delivery support for the warranty period.`,
    ]);
  }
  if (purpose.includes('task')) {
    return `Action required on ${subject}. ${detail ? `Context: ${detail}. ` : ''}Please review the referenced material, complete the assigned steps, and update the task status once done. Flag any blockers to the supervising officer.`;
  }
  if (purpose.includes('note')) {
    return `Reviewed ${subject}. ${detail ? `Noted: ${detail}. ` : ''}No exceptions observed at this stage. Recommend the file proceed to the next step in the workflow.`;
  }
  if (purpose.includes('memo') || purpose.includes('reply')) {
    return pick([
      `Thank you for your submission regarding ${subject}. We have reviewed your proposal and will revert with our evaluation outcome shortly. In the meantime, please ensure all supporting documents remain current.`,
      `Following our review of ${subject}, could you kindly clarify the items highlighted in our earlier correspondence? Your prompt response will help us conclude the evaluation on schedule.`,
    ]);
  }
  if (purpose.includes('bio')) {
    return `${subject} is a dedicated public servant supporting the Ministry's records and administrative operations, with a focus on timely document processing, inter-departmental coordination and service delivery.`;
  }
  if (purpose.includes('adjustment')) {
    return `Following our review of your submission on ${subject}, we request the following adjustment: ${detail || 'please provide an itemised breakdown of your pricing and confirm the delivery timeline'}. Kindly resubmit the revised proposal within the stated window.`;
  }
  if (purpose.includes('deactivation')) {
    return `Account access for ${subject} is being deactivated following a change in deployment/role. Access to official records and workflows will be revoked in line with the Ministry's security policy.`;
  }
  if (purpose.includes('insight') || purpose.includes('digest')) {
    return (
      `Activity digest\n\n${detail || 'Recent records show steady processing volumes.'}\n\n` +
      'Observation: turnaround is within target for most queues; a small cluster of files is approaching their deadline and would benefit from early review. Consider rebalancing assignments to the least-loaded officers this week.'
    );
  }
  return `Draft for ${subject}: ${detail || 'please refine this text to suit your needs.'}`;
}

function improve(request: AiAssistRequest): string {
  const detail = clip(request.context, 500);
  if (!detail) return draftFor(request.purpose, request.subject, request.context ?? '');
  return pick([
    `${detail} — reviewed for clarity and official tone.`,
    `${detail.charAt(0).toUpperCase()}${detail.slice(1)} Kindly treat this as priority correspondence.`,
  ]);
}

/**
 * Development-only AI stub used when no VITE_API_BASE_URL is configured.
 * Returns plausible generated text so the AI affordances can be exercised end
 * to end. The real backend is responsible for grounding, permission checks and
 * audit logging of every AI request.
 */
export const devAiApi: AiApi = {
  async assist(request: AiAssistRequest): Promise<AiAssistResult> {
    await delay();
    const context = request.context ?? '';
    const text =
      request.task === 'summarize'
        ? summarize(request)
        : request.task === 'improve'
          ? improve(request)
          : draftFor(request.purpose, request.subject, context);
    return { text, disclaimer: DISCLAIMER };
  },
};
