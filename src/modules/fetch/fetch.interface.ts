export interface RequestConfig {
  API_URL: string;
  headers?: Record<string, string>;
  useAuthorization?: boolean;
  token?: string;
}

export interface FetchExtraOptions {
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
}

export interface RequestOptions<TRequest> {
  path?: string;
  data?: TRequest;
  extra?: FetchExtraOptions;
}
