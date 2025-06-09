import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
