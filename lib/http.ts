// lib/http.ts
import { ApiResponse } from "@/lib/types/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface HttpOptions<TBody = unknown> {
  query?: Record<string, string | number | boolean | any[]>;
  config?: RequestInit & { next?: NextFetchRequestConfig };
  body?: TBody;
}

interface HttpFormOptions {
  query?: Record<string, string | number | boolean>;
  config?: RequestInit & { next?: NextFetchRequestConfig };
  body?: FormData;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api/v1/";

function buildUrl(path: string, query?: HttpOptions["query"]) {
  const cleanPath = path.replace(/^\/+/, "");
  const url = new URL(cleanPath, API_BASE);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (typeof item === "object" && item !== null) {
            // 객체 안의 key-value를 펼쳐서 각각 개별 param으로 추가
            Object.entries(item).forEach(([k, v]) => {
              url.searchParams.append(k, String(v));
            });
          } else {
            // 배열 요소가 원시 타입인 경우
            url.searchParams.append(key, String(item));
          }
        });
      } else if (typeof value === "object" && value !== null) {
        // 단일 객체 → key1=val1&key2=val2 형태로 변환
        Object.entries(value).forEach(([k, v]) => {
          url.searchParams.append(k, String(v));
        });
      } else {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function http<T = unknown, B = unknown>(
  method: HttpMethod,
  path: string,
  { query, body, config }: HttpOptions<B> = {},
): Promise<ApiResponse<T>> {
  const accessToken = localStorage.getItem("access-token");

  const res = await fetch(buildUrl(path, query), {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
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

export async function http_form<T = unknown>(
  method: HttpMethod,
  path: string,
  { query, body, config }: HttpFormOptions = {},
): Promise<ApiResponse<T>> {
  const accessToken = localStorage.getItem("access-token");

  const res = await fetch(buildUrl(path, query), {
    method,
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
    ...config,
    body,
  });

  const json = await res.json().catch(() => ({}));

  if (json.code >= 400) {
    throw new Error(json.message);
  }

  return json as ApiResponse<T>;
}

/* 편의 메소드 */
export const api = {
  get: <T>(p: string, o?: HttpOptions) => http<T>("GET", p, o),
  post: <T, B>(p: string, o?: HttpOptions<B>) => http<T, B>("POST", p, o),
  patch: <T, B>(p: string, o?: HttpOptions<B>) => http<T, B>("PATCH", p, o),
  put: <T, B>(p: string, o?: HttpOptions<B>) => http<T, B>("PUT", p, o),
  del: <T>(p: string, o?: HttpOptions) => http<T>("DELETE", p, o),
  post_form: <T>(p: string, o?: HttpFormOptions) => http_form<T>("POST", p, o),
  patch_form: <T>(p: string, o?: HttpFormOptions) =>
    http_form<T>("PATCH", p, o),
  put_form: <T>(p: string, o?: HttpFormOptions) => http_form<T>("PUT", p, o),
};
