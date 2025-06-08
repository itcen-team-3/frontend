// caregiver-patient schedule create
interface WorkScheduleRequest {
  patientId: number | null;
  patientName: string;
  caregiverId: number | null;
  startDate: Date | undefined;
  endDate: Date | undefined;
  startTime: string;
  endTime: string;
  paymentForHour: number;
  workDay: number;
  paymentType: string;
  isFamily: boolean;
  days?: number[];
}

// work-schedule list
interface WorkScheduleItem {
  scheduleId?: number;
  caregiverId?: number;
  patientId?: number;
  scheduleDate: Date | undefined; // TODO 점검 필요
  patientName: string;
  startTime: string;
  endTime: string;
}

interface AllWorkScheduleWeekResponse {
  schedulesWeek: WorkScheduleItem[];
}

export {
  type WorkScheduleRequest,
  type WorkScheduleItem,
  type AllWorkScheduleWeekResponse,
};
