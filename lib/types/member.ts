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

export {
  type SignInRequest,
  type SignInResponse,
  type SignUpRequest,
  type RefreshTokenRequest,
  type RefreshTokenResponse,
};
