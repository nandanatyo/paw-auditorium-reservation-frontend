import { createContext } from "react";
import {
  CreateFeedbackRequest,
  GetFeedbacksResponse,
  FeedbacksQueryParams,
} from "../../types";

export interface FeedbackContextType {
  createFeedback: (data: CreateFeedbackRequest) => Promise<string>;
  getConferenceFeedbacks: (
    conferenceId: string,
    params: FeedbacksQueryParams
  ) => Promise<GetFeedbacksResponse>;
  deleteFeedback: (feedbackId: string) => Promise<void>;

  isCreatingFeedback: boolean;
  isFetchingFeedbacks: boolean;
  isDeletingFeedback: boolean;
}

const FeedbackContext = createContext<FeedbackContextType>({
  createFeedback: async () => "",
  getConferenceFeedbacks: async () => ({
    feedbacks: [],
    pagination: { has_more: false, first_id: "", last_id: "" },
  }),
  deleteFeedback: async () => {},
  isCreatingFeedback: false,
  isFetchingFeedbacks: false,
  isDeletingFeedback: false,
});

export default FeedbackContext;
