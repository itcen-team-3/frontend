/* 성공 케이스 (2xx) */
interface ApiSuccess<T = unknown> {
  code: 200 | 201 | 204;
  message: string;
  data: T;
}

/* 실패 케이스 (4xx · 5xx) */
interface ApiFailure<E = string> {
  code: 400 | 401 | 403 | 404 | 500;
  message: string;
  data: E;
}

type ApiResponse<T = unknown, E = string> = ApiSuccess<T> | ApiFailure<E>;

export { type ApiResponse };
