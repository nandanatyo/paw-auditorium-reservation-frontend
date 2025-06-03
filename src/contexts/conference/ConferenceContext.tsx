import { createContext } from "react";
import {
  Conference,
  CreateConferenceRequest,
  UpdateConferenceRequest,
  UpdateConferenceStatusRequest,
  ConferenceQueryParams,
  GetConferencesResponse,
} from "../../types";

export interface ConferenceContextType {
  createConference: (data: CreateConferenceRequest) => Promise<string>;
  getConferences: (
    params: ConferenceQueryParams
  ) => Promise<GetConferencesResponse>;
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

  isCreatingConference: boolean;
  isFetchingConferences: boolean;
  isFetchingConference: boolean;
  isUpdatingConference: boolean;
  isDeletingConference: boolean;
  isUpdatingConferenceStatus: boolean;
}

const ConferenceContext = createContext<ConferenceContextType>({
  createConference: async () => "",
  getConferences: async () => ({
    conferences: [],
    pagination: { has_more: false, first_id: "", last_id: "" },
  }),
  getConference: async () => ({} as Conference),
  updateConference: async () => {},
  deleteConference: async () => {},
  updateConferenceStatus: async () => {},

  isCreatingConference: false,
  isFetchingConferences: false,
  isFetchingConference: false,
  isUpdatingConference: false,
  isDeletingConference: false,
  isUpdatingConferenceStatus: false,
});

export default ConferenceContext;
