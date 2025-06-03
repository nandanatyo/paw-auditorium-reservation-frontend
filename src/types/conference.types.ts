import { Pagination } from "./common.types";

export type ConferenceStatus = "pending" | "approved" | "rejected";

export interface Conference {
  id: string;
  title: string;
  description: string;
  speaker_name: string;
  speaker_title: string;
  target_audience: string;
  prerequisites: string | null;
  seats: number;
  starts_at: string;
  ends_at: string;
  host: {
    id: string;
    name: string;
  };
  status: ConferenceStatus;
  created_at: string;
  updated_at: string;
  seats_taken: number | null;
}

export interface CreateConferenceRequest {
  title: string;
  description: string;
  speaker_name: string;
  speaker_title: string;
  target_audience: string;
  prerequisites: string | null;
  seats: number;
  starts_at: string;
  ends_at: string;
}

export interface UpdateConferenceRequest {
  title?: string;
  description?: string;
  speaker_name?: string;
  speaker_title?: string;
  target_audience?: string;
  prerequisites?: string | null;
  seats?: number;
  starts_at?: string;
  ends_at?: string;
}

export interface UpdateConferenceStatusRequest {
  status: ConferenceStatus;
}

export interface ConferenceQueryParams {
  after_id?: string;
  before_id?: string;
  limit: number;
  host_id?: string;
  status: ConferenceStatus;
  starts_before?: string;
  starts_after?: string;
  include_past?: boolean;
  order_by: "created_at" | "starts_at";
  order: "asc" | "desc";
  title?: string;
}

export interface CreateConferenceResponse {
  conference: {
    id: string;
  };
}

export interface GetConferenceResponse {
  conference: Conference;
}

export interface GetConferencesResponse {
  conferences: Conference[];
  pagination: Pagination;
}
