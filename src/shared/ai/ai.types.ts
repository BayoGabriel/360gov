/** Kinds of assistance the platform AI provides. */
export type AiTask =
  | 'summarize'
  | 'draft'
  | 'describe'
  | 'reply'
  | 'improve';

export interface AiAssistRequest {
  task: AiTask;
  /**
   * Where/why the AI is invoked, e.g. 'document-summary' or
   * 'contract-description'. Logged server-side for the AI audit trail.
   */
  purpose: string;
  /** Short human-readable label of the thing being worked on. */
  subject: string;
  /**
   * Source material the request may draw on. The backend must only include
   * records the requesting officer is permitted to see — the AI operates
   * inside existing access controls and never widens them.
   */
  context?: string;
}

export interface AiAssistResult {
  text: string;
  /** Shown under the output so officers remember to review AI content. */
  disclaimer: string;
}

export interface AiApi {
  assist(request: AiAssistRequest, signal?: AbortSignal): Promise<AiAssistResult>;
}
