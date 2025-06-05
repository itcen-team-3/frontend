// lib/http.ts
type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface HttpOptions<TBody = unknown> {
  /** 쿼리 스트링 객체 → ?a=1&b=2 */
  query?: Record<string, string | number | boolean>;
  /** fetch 옵션 추가 (cache, next.revalidate 등) */
  config?: RequestInit & { next?: NextFetchRequestConfig };
  /** POST·PATCH·PUT·DELETE 본문 */
  body?: TBody;
}

// TODO : api url 확정되면 수정
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://api.example.com";

function buildUrl(path: string, query?: HttpOptions["query"]) {
  const url = new URL(path, API_BASE);
  if (query) {
    Object.entries(query).forEach(([k, v]) =>
      url.searchParams.append(k, String(v))
    );
  }
  return url.toString();
}

export async function http<TResponse = unknown, TBody = unknown>(
  method: HttpMethod,
  path: string,
  { query, body, config }: HttpOptions<TBody> = {}
): Promise<TResponse> {
  const res = await fetch(buildUrl(path, query), {
    method,
    headers: { "Content-Type": "application/json" },
    // Next.js 전용 캐시 옵션도 그대로 전달 가능
    ...config,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    // 에러 응답 JSON을 그대로 throw 하면 페이지·토스트에서 처리하기 편함
    const error = await res.json().catch(() => ({}));
    throw { status: res.status, ...error };
  }

  // 204 No Content 대비
  if (res.status === 204) return {} as TResponse;
  return res.json() as Promise<TResponse>;
}

/* 편의 메소드 */
export const api = {
  get: <T>(p: string, o?: HttpOptions) => http<T>("GET", p, o),
  post: <T, B>(p: string, o?: HttpOptions<B>) => http<T, B>("POST", p, o),
  patch: <T, B>(p: string, o?: HttpOptions<B>) => http<T, B>("PATCH", p, o),
  put: <T, B>(p: string, o?: HttpOptions<B>) => http<T, B>("PUT", p, o),
  del: <T>(p: string, o?: HttpOptions) => http<T>("DELETE", p, o),
};
