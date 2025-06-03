import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { conferenceService } from "../../services/conference.service";
import {
  Conference,
  CreateConferenceRequest,
  UpdateConferenceRequest,
  UpdateConferenceStatusRequest,
  ConferenceStatus,
  Pagination,
  ConferenceQueryParams,
} from "../../types";

interface ConferenceContextType {
  conferences: Conference[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination | null;
  createConference: (data: CreateConferenceRequest) => Promise<string>;
  getConference: (id: string) => Promise<Conference>;
  updateConference: (
    id: string,
    data: UpdateConferenceRequest
  ) => Promise<void>;
  deleteConference: (id: string) => Promise<void>;
  updateConferenceStatus: (
    id: string,
    data: UpdateConferenceStatusRequest
  ) => Promise<void>;
  loadConferences: (params?: Partial<ConferenceQueryParams>) => Promise<void>;
}

const defaultPagination: Pagination = {
  has_more: false,
  first_id: "",
  last_id: "",
};

const ConferenceContext = createContext<ConferenceContextType>(
  {} as ConferenceContextType
);

export const ConferenceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const loadConferences = useCallback(
    async (params?: Partial<ConferenceQueryParams>) => {
      setIsLoading(true);
      setError(null);
      try {
        const defaultParams: ConferenceQueryParams = {
          limit: 10,
          status: "approved",
          order_by: "starts_at",
          order: "asc",
        };

        const queryParams = { ...defaultParams, ...params };
        const result = await conferenceService.getConferences(queryParams);

        setConferences(result.conferences);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Failed to load conferences:", error);
        setError("Failed to load conferences. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadConferences();
  }, [loadConferences]);

  const createConference = async (
    data: CreateConferenceRequest
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const conferenceId = await conferenceService.createConference(data);
      await loadConferences();
      return conferenceId;
    } catch (error: any) {
      console.error("Failed to create conference:", error);
      setError(
        error.data?.message || "Failed to create conference. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getConference = async (id: string): Promise<Conference> => {
    setIsLoading(true);
    setError(null);
    try {
      return await conferenceService.getConference(id);
    } catch (error: any) {
      console.error("Failed to get conference:", error);
      setError(
        error.data?.message ||
          "Failed to get conference details. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConference = async (
    id: string,
    data: UpdateConferenceRequest
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await conferenceService.updateConference(id, data);
      await loadConferences();
    } catch (error: any) {
      console.error("Failed to update conference:", error);
      setError(
        error.data?.message || "Failed to update conference. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConference = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await conferenceService.deleteConference(id);
      setConferences((prevConferences) =>
        prevConferences.filter((conf) => conf.id !== id)
      );
    } catch (error: any) {
      console.error("Failed to delete conference:", error);
      setError(
        error.data?.message || "Failed to delete conference. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConferenceStatus = async (
    id: string,
    data: UpdateConferenceStatusRequest
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await conferenceService.updateConferenceStatus(id, data);
      await loadConferences();
    } catch (error: any) {
      console.error("Failed to update conference status:", error);
      setError(
        error.data?.message ||
          "Failed to update conference status. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConferenceContext.Provider
      value={{
        conferences,
        isLoading,
        error,
        pagination: pagination || defaultPagination,
        createConference,
        getConference,
        updateConference,
        deleteConference,
        updateConferenceStatus,
        loadConferences,
      }}>
      {children}
    </ConferenceContext.Provider>
  );
};

export const useConference = () => useContext(ConferenceContext);
