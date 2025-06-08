// work-schedule list
interface WorkScheduleItem {
  scheduleId?: number;
  caregiverId?: number;
  patientId?: number;
  scheduleDate: Date | undefined;
  patientName: string;
  startTime: string;
  endTime: string;
}

interface AllWorkScheduleWeekResponse {
  schedulesWeek: WorkScheduleItem[];
}

export { type WorkScheduleItem, type AllWorkScheduleWeekResponse };
