export interface ApiRequestOptions {
  signal?: AbortSignal;
}

export interface ApiClient {
  get<T>(path: string, options?: ApiRequestOptions): Promise<T>;
  post<T>(path: string, body: unknown, options?: ApiRequestOptions): Promise<T>;
  put<T>(path: string, body: unknown, options?: ApiRequestOptions): Promise<T>;
  delete<T>(path: string, options?: ApiRequestOptions): Promise<T>;
  /**
   * Multipart upload. The browser sets the Content-Type boundary; do not
   * send a JSON body here.
   */
  postForm<T>(
    path: string,
    form: FormData,
    options?: ApiRequestOptions,
  ): Promise<T>;
}
