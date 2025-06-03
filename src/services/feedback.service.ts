import api from "./api";
import config from "../config/config";
import {
  CreateFeedbackRequest,
  CreateFeedbackResponse,
  GetFeedbacksResponse,
  FeedbacksQueryParams,
} from "../types";

export const feedbackService = {
  createFeedback: async (data: CreateFeedbackRequest): Promise<string> => {
    const response = await api.post<CreateFeedbackResponse>(
      config.endpoints.feedbacks.base,
      data
    );
    return response.data.feedback.id;
  },

  getConferenceFeedbacks: async (
    conferenceId: string,
    params: FeedbacksQueryParams
  ): Promise<GetFeedbacksResponse> => {
    const response = await api.get<GetFeedbacksResponse>(
      config.endpoints.feedbacks.byConference(conferenceId),
      { params }
    );
    return response.data;
  },

  deleteFeedback: async (feedbackId: string): Promise<void> => {
    await api.delete(config.endpoints.feedbacks.byId(feedbackId));
  },
};
