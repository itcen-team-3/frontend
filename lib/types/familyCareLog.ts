export interface FamilyCareLogDetail {
  id: string;
  patientId: number;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  activities: string[];
  photos: {
    id: string;
    url: string;
  }[];
} 