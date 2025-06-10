"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CareLog {
  id: string;
  date: string;
  caregiverName: string;
  activities: string[];
  status: string;
}

export default function CareLogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [logs, setLogs] = useState<CareLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const date = searchParams.get("date") || "";
  const status = searchParams.get("status") || "";

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        date,
        status,
        page: page.toString(),
      });

      const response = await fetch(`/family/care-logs?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("돌봄 일지를 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      if (data.logs.length === 0) {
        setHasMore(false);
        return;
      }

      setLogs(prev => [...prev, ...data.logs]);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 변경 시 데이터 리셋
  useEffect(() => {
    setLogs([]);
    setPage(1);
    setHasMore(true);
    fetchLogs();
  }, [date, status]);

  // 무한 스크롤
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      if (hasMore && !isLoading) {
        fetchLogs();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading]);

  const handleLogClick = (logId: string) => {
    router.push(`/family/care-logs/${logId}`);
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            onClick={() => handleLogClick(log.id)}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{log.caregiverName}</h3>
                <p className="text-sm text-gray-500">{log.date}</p>
              </div>
              <div className="text-sm text-gray-500">{log.status}</div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {log.activities.join(", ")}
            </div>
          </div>
        ))}
      </div>
      
      {isLoading && (
        <div className="text-center py-4">로딩 중...</div>
      )}
    </div>
  );
}
