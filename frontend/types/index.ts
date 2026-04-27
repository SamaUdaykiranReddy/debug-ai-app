export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface DebugLog {
  _id: string;
  title: string;
  codeSnippet: string;
  errorMessage: string;
  solution: string;
  fixedCode: string;
  status: "pending" | "solved" | "fixed";
  createdAt: string;
}