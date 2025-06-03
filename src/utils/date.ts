export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString();
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString();
};

export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString();
};

export const toISOString = (date: Date): string => {
  return date.toISOString();
};

export const isDateInPast = (isoString: string): boolean => {
  const date = new Date(isoString);
  return date < new Date();
};

export const hasConferenceEnded = (endsAt: string): boolean => {
  return isDateInPast(endsAt);
};
