// sign-in
interface SignInRequest {
  id: string;
  password: string;
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

export { type SignInRequest, type SignInResponse };
