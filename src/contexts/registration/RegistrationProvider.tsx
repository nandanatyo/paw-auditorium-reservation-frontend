import React, { createContext, useState, useContext } from "react";
import { registrationService } from "../../services/registration.service";
import {
  RegisterConferenceRequest,
  RegisteredUser,
  RegisteredUsersQueryParams,
  RegisteredConferencesQueryParams,
  Conference,
  Pagination,
  GetRegisteredConferencesResponse,
} from "../../types";

interface RegistrationContextType {
  registeredUsers: RegisteredUser[];
  registeredConferences: Conference[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination | null;
  registerForConference: (data: RegisterConferenceRequest) => Promise<void>;
  getRegisteredUsers: (
    conferenceId: string,
    params: RegisteredUsersQueryParams
  ) => Promise<RegisteredUser[]>;
  getRegisteredConferences: (
    userId: string,
    params: RegisteredConferencesQueryParams
  ) => Promise<GetRegisteredConferencesResponse>;
}

const defaultPagination: Pagination = {
  has_more: false,
  first_id: "",
  last_id: "",
};

const RegistrationContext = createContext<RegistrationContextType>(
  {} as RegistrationContextType
);

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [registeredConferences, setRegisteredConferences] = useState<
    Conference[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const registerForConference = async (
    data: RegisterConferenceRequest
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await registrationService.registerForConference(data);
    } catch (error: any) {
      console.error("Failed to register for conference:", error);
      setError(
        error.data?.message ||
          "Failed to register for conference. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getRegisteredUsers = async (
    conferenceId: string,
    params: RegisteredUsersQueryParams
  ): Promise<RegisteredUser[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await registrationService.getRegisteredUsers(
        conferenceId,
        params
      );
      setRegisteredUsers(result.users);
      setPagination(result.pagination);
      return result.users;
    } catch (error: any) {
      console.error("Failed to get registered users:", error);
      setError(
        error.data?.message ||
          "Failed to load registered users. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getRegisteredConferences = async (
    userId: string,
    params: RegisteredConferencesQueryParams
  ): Promise<GetRegisteredConferencesResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await registrationService.getRegisteredConferences(
        userId,
        params
      );
      setRegisteredConferences(result.conferences);
      setPagination(result.pagination);
      return result;
    } catch (error: any) {
      console.error("Failed to get registered conferences:", error);
      setError(
        error.data?.message ||
          "Failed to load registered conferences. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegistrationContext.Provider
      value={{
        registeredUsers,
        registeredConferences,
        isLoading,
        error,
        pagination: pagination || defaultPagination,
        registerForConference,
        getRegisteredUsers,
        getRegisteredConferences,
      }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => useContext(RegistrationContext);
