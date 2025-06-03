import { isDateInPast } from "./date";

export const hasConferenceEnded = (endsAt: string): boolean => {
  return isDateInPast(endsAt);
};

export const isValidFeedbackComment = (comment: string): boolean => {
  return comment.length >= 3 && comment.length <= 1000;
};
