import { apiClient } from '../api/api-client';
import { env } from '../config/env';
import type { AiApi, AiAssistRequest, AiAssistResult } from './ai.types';
import { devAiApi } from './ai.stub';

/**
 * Assumed backend contract (no API spec exists yet — confirm before release):
 *   POST /ai/assist  { task, purpose, subject, context } -> { text, disclaimer }
 *
 * The backend is expected to enforce the caller's existing permissions on any
 * records referenced by the request and to write an audit entry for every
 * invocation. AI output is advisory: it must never mutate records or trigger
 * workflow decisions by itself.
 */
const httpAiApi: AiApi = {
  assist: (request: AiAssistRequest, signal) =>
    apiClient.post<AiAssistResult>('/ai/assist', request, { signal }),
};

export const aiApi: AiApi = env.apiBaseUrl ? httpAiApi : devAiApi;
