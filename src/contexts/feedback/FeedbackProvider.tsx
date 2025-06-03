import React, { createContext, useState, useContext } from "react";
import { feedbackService } from "../../services/feedback.service";
import {
  Feedback,
  CreateFeedbackRequest,
  FeedbacksQueryParams,
  Pagination,
} from "../../types";

interface FeedbackContextType {
  feedbacks: Feedback[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination | null;
  createFeedback: (data: CreateFeedbackRequest) => Promise<string>;
  getConferenceFeedbacks: (
    conferenceId: string,
    params: FeedbacksQueryParams
  ) => Promise<void>;
  deleteFeedback: (feedbackId: string) => Promise<void>;
}

const defaultPagination: Pagination = {
  has_more: false,
  first_id: "",
  last_id: "",
};

const FeedbackContext = createContext<FeedbackContextType>(
  {} as FeedbackContextType
);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const createFeedback = async (
    data: CreateFeedbackRequest
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const feedbackId = await feedbackService.createFeedback(data);
      return feedbackId;
    } catch (error: any) {
      console.error("Failed to create feedback:", error);
      setError(
        error.data?.message || "Failed to submit feedback. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getConferenceFeedbacks = async (
    conferenceId: string,
    params: FeedbacksQueryParams
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await feedbackService.getConferenceFeedbacks(
        conferenceId,
        params
      );
      setFeedbacks(result.feedbacks);
      setPagination(result.pagination);
    } catch (error: any) {
      console.error("Failed to get feedbacks:", error);
      setError(
        error.data?.message || "Failed to load feedbacks. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFeedback = async (feedbackId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await feedbackService.deleteFeedback(feedbackId);
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter((feedback) => feedback.id !== feedbackId)
      );
    } catch (error: any) {
      console.error("Failed to delete feedback:", error);
      setError(
        error.data?.message || "Failed to delete feedback. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedbacks,
        isLoading,
        error,
        pagination: pagination || defaultPagination,
        createFeedback,
        getConferenceFeedbacks,
        deleteFeedback,
      }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => useContext(FeedbackContext);
