import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CaregiverDashboardScheduleItem } from "./types/member";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStartOfWeek(date = new Date()) {
  const day = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
  const diff = day === 0 ? -6 : 1 - day;

  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);

  // YYYY-MM-DD 포맷으로 반환
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(monday.getDate()).padStart(2, "0");

  return `${year}-${month}-${dayOfMonth}`;
}

/**
 * 비트마스킹 정수를 받아 선택된 요일 비트값 배열로 반환
 * @param bitmask 비트마스킹 정수 (예: 21)
 * @returns 선택된 요일의 비트값 배열 (예: [1, 4, 16])
 */
export function decodeBitmaskToBitValues(bitmask: number): number[] {
  const bitValues: number[] = [];

  for (let i = 0; i < 7; i++) {
    const bit = 1 << i;
    if ((bitmask & bit) !== 0) {
      bitValues.push(bit);
    }
  }

  return bitValues;
}

export function buildDateFromTimeString(timeStr: string): Date {
  const [hourStr, minuteStr, secondStr] = timeStr.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const second = parseInt(secondStr, 10);

  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    second
  );
}

function getDashBoardForm(
  item: CaregiverDashboardScheduleItem
): CaregiverDashboardScheduleItem {
  const [hourStart, minuteStart] = item.startTime.split(":");
  const hour_s = parseInt(hourStart, 10);
  const minute_s = parseInt(minuteStart, 10);

  const [hourEnd, minuteEnd] = item.endTime.split(":");
  const hour_e = parseInt(hourEnd, 10);
  const minute_e = parseInt(minuteEnd, 10);

  return {
    ...item,
    startTime: `${hour_s}시 ${minute_s !== 0 ? minute_s + "분" : ""}`,
    endTime: `${hour_e}시 ${minute_e !== 0 ? minute_e + "분" : ""}`,
  };
}

/**
 * 현재시간과 가장 가까운, 또는 현재시간을 포함하는 시간대 반환
 */
export function findClosestOrActiveTime(
  currentTime: Date,
  items: CaregiverDashboardScheduleItem[]
): CaregiverDashboardScheduleItem | null {
  if (items.length === 0) return null;

  // 1차로 현재 시간이 포함된 구간 찾기
  const activeItem = items.find(
    (item) =>
      currentTime >= buildDateFromTimeString(item.startTime) &&
      currentTime <= buildDateFromTimeString(item.endTime)
  );

  if (activeItem) {
    return getDashBoardForm(activeItem);
  }

  // 2차로 가장 가까운 startTime 찾기
  let closestItem: CaregiverDashboardScheduleItem | null = null;
  let closestDiff = Infinity;

  for (const item of items) {
    const diff = Math.abs(
      buildDateFromTimeString(item.startTime).getTime() - currentTime.getTime()
    );
    if (diff < closestDiff) {
      closestDiff = diff;
      closestItem = item;
    }
  }

  if (closestItem) {
    return getDashBoardForm(closestItem);
  }

  return null;
}
