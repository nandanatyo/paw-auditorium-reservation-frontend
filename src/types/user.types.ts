import { User, UserRole } from "./auth.types";

export interface UserMinimal {
  id: string | null;
  name: string | null;
  role: UserRole | null;
  bio: string | null;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: "event_coordinator" | "user";
}

export interface UpdateUserProfileRequest {
  name?: string;
  bio?: string;
}

export interface CreateUserResponse {
  user: {
    id: string;
  };
}

export interface GetUserResponse {
  user: User;
}

export interface GetUserMinimalResponse {
  user: UserMinimal;
}
