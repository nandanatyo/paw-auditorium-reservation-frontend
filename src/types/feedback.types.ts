import { Pagination } from "./common.types";

export interface Feedback {
  id: string;
  comment: string;
  created_at: string;
  user: {
    id: string;
    name: string;
  };
  conference_title?: string;
}

export interface CreateFeedbackRequest {
  conference_id: string;
  comment: string;
}

export interface CreateFeedbackResponse {
  feedback: {
    id: string;
  };
}

export interface FeedbacksQueryParams {
  limit: number;
  after_id?: string;
  before_id?: string;
}

export interface GetFeedbacksResponse {
  feedbacks: Feedback[];
  pagination: Pagination;
}
