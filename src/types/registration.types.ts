import { Pagination } from "./common.types";
import { Conference } from "./conference.types";

export interface RegisteredUser {
  id: string;
  name: string;
}

export interface RegisterConferenceRequest {
  conference_id: string;
}

export interface RegisteredUsersQueryParams {
  limit: number;
  after_id?: string;
  before_id?: string;
}

export interface RegisteredConferencesQueryParams {
  limit: number;
  include_past?: boolean;
  after_id?: string;
  before_id?: string;
}

export interface GetRegisteredUsersResponse {
  users: RegisteredUser[];
  pagination: Pagination;
}

export interface GetRegisteredConferencesResponse {
  conferences: Conference[];
  pagination: Pagination;
}
