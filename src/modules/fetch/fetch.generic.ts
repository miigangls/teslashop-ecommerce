import { RequestConfig, RequestOptions } from "./fetch.interface";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class GenericRepository {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor({ API_URL, headers, token }: RequestConfig) {
    this.baseUrl = API_URL;
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    };

    if (token) {
      this.headers.Authorization = `Bearer ${token}`;
    }
  }

  private async request<TRequest, TResponse>(
    method: HttpMethod,
    options?: RequestOptions<TRequest>,
  ): Promise<TResponse> {
    const url = this.baseUrl + (options?.path ?? "");

    const response = await fetch(url, {
      method,
      headers: this.headers,
      body: options?.data ? JSON.stringify(options.data) : undefined,
      cache: options?.extra?.cache,
      next: {
        revalidate: options?.extra?.revalidate,
        tags: options?.extra?.tags,
      },
    });

    if (!response.ok) {
      const fallbackMessage = `Request failed with status ${response.status}`;
      const errorPayload = await response
        .json()
        .catch(() => ({ message: fallbackMessage }));
      throw new Error(errorPayload?.message ?? fallbackMessage);
    }

    return response.json() as Promise<TResponse>;
  }

  GET<TRequest, TResponse>(options?: RequestOptions<TRequest>) {
    return this.request<TRequest, TResponse>("GET", options);
  }

  POST<TRequest, TResponse>(options: RequestOptions<TRequest>) {
    return this.request<TRequest, TResponse>("POST", options);
  }

  PUT<TRequest, TResponse>(options: RequestOptions<TRequest>) {
    return this.request<TRequest, TResponse>("PUT", options);
  }

  PATCH<TRequest, TResponse>(options: RequestOptions<TRequest>) {
    return this.request<TRequest, TResponse>("PATCH", options);
  }

  DELETE<TRequest, TResponse>(options?: RequestOptions<TRequest>) {
    return this.request<TRequest, TResponse>("DELETE", options);
  }
}
