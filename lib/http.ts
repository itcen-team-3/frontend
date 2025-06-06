// lib/http.ts
import { ApiResponse } from "@/lib/types/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface HttpOptions<TBody = unknown> {
  query?: Record<string, string | number | boolean>;
  config?: RequestInit & { next?: NextFetchRequestConfig };
  body?: TBody;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api/v1/";

function buildUrl(path: string, query?: HttpOptions["query"]) {
  const cleanPath = path.replace(/^\/+/, "");

  const url = new URL(cleanPath, API_BASE);

  if (query) {
    Object.entries(query).forEach(([k, v]) =>
      url.searchParams.append(k, String(v))
    );
  }
  return url.toString();
}

export async function http<T = unknown, B = unknown>(
  method: HttpMethod,
  path: string,
  { query, body, config }: HttpOptions<B> = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(buildUrl(path, query), {
    method,
    headers: { "Content-Type": "application/json" },
    ...config,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (json.code >= 400) {
    throw new Error(json.message);
  }

  // API 자체가 code/message/data 구조를 항상 보장한다는 전제 하
  return json as ApiResponse<T>;
}

/* 편의 메소드 */
export const api = {
  get: <T>(p: string, o?: HttpOptions) => http<T>("GET", p, o),
  post: <T, B>(p: string, o?: HttpOptions<B>) => http<T, B>("POST", p, o),
  patch: <T, B>(p: string, o?: HttpOptions<B>) => http<T, B>("PATCH", p, o),
  put: <T, B>(p: string, o?: HttpOptions<B>) => http<T, B>("PUT", p, o),
  del: <T>(p: string, o?: HttpOptions) => http<T>("DELETE", p, o),
};
