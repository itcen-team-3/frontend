import { LoadingOverlay } from "./loading-overlay";

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({
  message = "페이지를 불러오는 중...",
}: LoadingPageProps) {
  return <LoadingOverlay message={message} size="xl" />;
}

// Next.js의 loading.tsx 파일에서 사용할 수 있는 기본 로딩 페이지
export default function Loading() {
  return <LoadingPage />;
}
