import { env } from '../config/env';
import { ApiError } from './api-error';
import type { ApiClient, ApiRequestOptions } from './api-types';

async function parseErrorBody(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (
      body &&
      typeof body === 'object' &&
      'message' in body &&
      typeof (body as { message: unknown }).message === 'string'
    ) {
      return (body as { message: string }).message;
    }
  } catch {
    // fall through to status text
  }
  return response.statusText || 'Request failed';
}

async function request<T>(
  method: string,
  path: string,
  body: unknown,
  options?: ApiRequestOptions,
): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'include',
    signal: options?.signal,
  });

  if (!response.ok) {
    const message = await parseErrorBody(response);
    throw new ApiError({ status: response.status, message });
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

async function requestForm<T>(
  method: string,
  path: string,
  form: FormData,
  options?: ApiRequestOptions,
): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method,
    body: form,
    credentials: 'include',
    signal: options?.signal,
  });

  if (!response.ok) {
    const message = await parseErrorBody(response);
    throw new ApiError({ status: response.status, message });
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const apiClient: ApiClient = {
  get: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>('GET', path, undefined, options),
  post: <T>(path: string, body: unknown, options?: ApiRequestOptions) =>
    request<T>('POST', path, body, options),
  put: <T>(path: string, body: unknown, options?: ApiRequestOptions) =>
    request<T>('PUT', path, body, options),
  delete: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>('DELETE', path, undefined, options),
  postForm: <T>(path: string, form: FormData, options?: ApiRequestOptions) =>
    requestForm<T>('POST', path, form, options),
};
