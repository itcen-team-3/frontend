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
  name: string;
  birthDate: Date | undefined;
  phoneNumber: string;
  address: string;
  certificateNumber: string;
  career: string;
  description: string;
  profileImageUrl: string | null;
  profileImage?: File | null;
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
  birthDate: Date | undefined;
  age: number;
  phoneNumber: string;
  address: string;
  description: string;
  profileImage?: string;
  schedules: CaregiverScheduleItem[];
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
};
