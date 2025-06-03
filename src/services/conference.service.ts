import api from "./api";
import config from "../config/config";
import {
  Conference,
  ConferenceQueryParams,
  GetConferenceResponse,
  GetConferencesResponse,
  CreateConferenceRequest,
  CreateConferenceResponse,
  UpdateConferenceRequest,
  UpdateConferenceStatusRequest,
} from "../types";

export const conferenceService = {

  createConference: async (data: CreateConferenceRequest): Promise<string> => {
    const response = await api.post<CreateConferenceResponse>(
      config.endpoints.conferences.base,
      data
    );
    return response.data.conference.id;
  },


  getConferences: async (
    params: ConferenceQueryParams
  ): Promise<GetConferencesResponse> => {
    const response = await api.get<GetConferencesResponse>(
      config.endpoints.conferences.base,
      { params }
    );
    return response.data;
  },


  getConference: async (id: string): Promise<Conference> => {
    const response = await api.get<GetConferenceResponse>(
      config.endpoints.conferences.byId(id)
    );
    return response.data.conference;
  },


  updateConference: async (
    id: string,
    data: UpdateConferenceRequest
  ): Promise<void> => {
    await api.patch(config.endpoints.conferences.byId(id), data);
  },


  deleteConference: async (id: string): Promise<void> => {
    await api.delete(config.endpoints.conferences.byId(id));
  },


  updateConferenceStatus: async (
    id: string,
    data: UpdateConferenceStatusRequest
  ): Promise<void> => {
    await api.patch(config.endpoints.conferences.status(id), data);
  },
};
