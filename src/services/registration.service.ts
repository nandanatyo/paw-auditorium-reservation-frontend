import api from "./api";
import config from "../config/config";
import {
  RegisterConferenceRequest,
  GetRegisteredUsersResponse,
  GetRegisteredConferencesResponse,
  RegisteredUsersQueryParams,
  RegisteredConferencesQueryParams,
} from "../types";

export const registrationService = {
  registerForConference: async (
    data: RegisterConferenceRequest
  ): Promise<void> => {
    await api.post(config.endpoints.registrations.base, data);
  },

  getRegisteredUsers: async (
    conferenceId: string,
    params: RegisteredUsersQueryParams
  ): Promise<GetRegisteredUsersResponse> => {
    const response = await api.get<GetRegisteredUsersResponse>(
      config.endpoints.registrations.byConference(conferenceId),
      { params }
    );
    return response.data;
  },

  getRegisteredConferences: async (
    userId: string,
    params: RegisteredConferencesQueryParams
  ): Promise<GetRegisteredConferencesResponse> => {
    const response = await api.get<GetRegisteredConferencesResponse>(
      config.endpoints.registrations.byUser(userId),
      { params }
    );
    return response.data;
  },
};
