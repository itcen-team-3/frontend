// sign-in
interface SignInRequest {
  loginId: string;
  loginPw: string;
}

interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  member: {
    id: number;
    name: string;
    role: string;
  };
}

// sign-up
interface SignUpRequest {
  loginId: string;
  loginPw: string;
  loginPwConfirm: string;
  representativeName: string;
  birthDate: string; // LocalDate → ISO string (e.g., '2024-05-05')
  companyName: string;
  companyAddress: string;
  email: string;
  businessRegistrationFile: File | null; // MultipartFile → File 타입 사용
  businessRegistrationNumber: string;
  openingDate: string;
  phoneNumber: string;
}

// refresh-token
interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// caregiver create
interface CaregiverInfoRequest {
  caregiverId?: number;
  name: string;
  birthDate: Date | undefined | string;
  phoneNumber: string;
  address: string;
  certificateNumber: string;
  career: string;
  description: string;
  profileImage: string | null;
  profileImageFile?: File | null;
}

// caregiver list
interface CaregiverListItem {
  caregiverId: number;
  name: string;
  phoneNumber: string;
}

interface CaregiverListResponse {
  content: CaregiverListItem[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// caregiver detail
interface CaregiverScheduleItem {
  workDays: number;
  patientName: string;
  startTime: string;
  endTime: string;
}

interface CaregiverDetailResponse {
  caregiverId: number;
  name: string;
  birthDate: Date | undefined | string;
  age: number;
  phoneNumber: string;
  address: string;
  description: string;
  profileImage?: string;
  schedules: CaregiverScheduleItem[];
}

// patient create
interface PatientInfoRequest {
  patientId?: number;
  name: string;
  birthDate: Date | undefined | string;
  address: string;
  phoneNumber: string;
  patientLevel: string;
  guardianPhoneNumber: string;
  guardianName: string;
  relationship: string;
  description: string;
  profileImage: string | null;
  profileImageFile?: File | null;
}

// patient list
interface PatientListItem {
  patientId: number;
  name: string;
  age: number;
}

interface PatientListResponse {
  content: PatientListItem[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// patient detail
interface PatientScheduleItem {
  workDays: number;
  caregiverName: string; // TODO : check 해볼 것
  startTime: string;
  endTime: string;
}

interface PatientDetailResponse {
  patientId: number;
  name: string;
  birthDate: Date | undefined | string;
  age: number;
  address: string;
  phoneNumber: string;
  patientLevel: string;
  guardianPhoneNumber: string;
  guardianName: string;
  relationship: string;
  description: string;
  profileImage?: string;
  schedules: PatientScheduleItem[];
}

// caregiver name list
interface CaregiverNameListItem {
  caregiverId: number;
  caregiverName: string;
  caregiverProfileUrl?: string;
}

interface CaregiverNameListResponse {
  caregivers: CaregiverNameListItem[];
}

// patient name list
interface PatientNameListItem {
  patientId: number;
  patientName: string;
}

interface PatientNameListResponse {
  patients: PatientNameListItem[];
}

// account list
interface AccountItem {
  memberId: string;
  loginId: string;
  name: string;
  role: string;
  patientName: string | null;
  lastLoginAt: string | null;
}

interface AccountResponse {
  content: AccountItem[];
}

interface RoleItem {
  name: string;
  displayName: string;
}

interface RoleRequest {
  id: string;
  password: string;
  memberId?: string;
  role?: string;
}

interface RoleNameItem {
  memberId: string;
  name: string;
}

interface PasswordRequest {
  loginNewPw: string;
  loginNewPwConfirm: string;
}

interface IdRequest {
  memberId?: string;
  loginNewId: string;
}

interface CaregiverDashboardScheduleItem {
  patientId: string;
  patientName: string;
  startTime: string;
  endTime: string;
  attendanceStatus: string;
}

interface CaregiverDashboardInfoResponse {
  caregiverName: string;
  schedules: CaregiverDashboardScheduleItem[];
}

export {
  type SignInRequest,
  type SignInResponse,
  type SignUpRequest,
  type RefreshTokenRequest,
  type RefreshTokenResponse,
  type CaregiverInfoRequest,
  type CaregiverListItem,
  type CaregiverListResponse,
  type CaregiverScheduleItem,
  type CaregiverDetailResponse,
  type PatientInfoRequest,
  type PatientListItem,
  type PatientListResponse,
  type PatientScheduleItem,
  type PatientDetailResponse,
  type CaregiverNameListItem,
  type CaregiverNameListResponse,
  type PatientNameListItem,
  type PatientNameListResponse,
  type AccountItem,
  type AccountResponse,
  type RoleItem,
  type RoleRequest,
  type RoleNameItem,
  type PasswordRequest,
  type IdRequest,
  type CaregiverDashboardScheduleItem,
  type CaregiverDashboardInfoResponse,
};
