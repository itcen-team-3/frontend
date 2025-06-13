interface AdminAttendanceListItem {
  approveStatus: string;
  attendanceExplationId: number;
  caregiverName: string;
  explation: string;
  submitDateTime: string;
}

interface AdminAttendanceListResponse {
  attendanceList: AdminAttendanceListItem[];
}

export { type AdminAttendanceListItem, type AdminAttendanceListResponse };
