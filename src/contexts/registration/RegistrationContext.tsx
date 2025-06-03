import { createContext } from 'react';
import {
    RegisterConferenceRequest,
    GetRegisteredUsersResponse,
    GetRegisteredConferencesResponse,
    RegisteredUsersQueryParams,
    RegisteredConferencesQueryParams
} from '../../types';

export interface RegistrationContextType {

    registerForConference: (data: RegisterConferenceRequest) => Promise<void>;
    getRegisteredUsers: (
        conferenceId: string,
        params: RegisteredUsersQueryParams
    ) => Promise<GetRegisteredUsersResponse>;
    getRegisteredConferences: (
        userId: string,
        params: RegisteredConferencesQueryParams
    ) => Promise<GetRegisteredConferencesResponse>;


    isRegistering: boolean;
    isFetchingRegisteredUsers: boolean;
    isFetchingRegisteredConferences: boolean;
}

const RegistrationContext = createContext<RegistrationContextType>({
    registerForConference: async () => {},
    getRegisteredUsers: async () => ({
        users: [],
        pagination: { has_more: false, first_id: '', last_id: '' }
    }),
    getRegisteredConferences: async () => ({
        conferences: [],
        pagination: { has_more: false, first_id: '', last_id: '' }
    }),
    isRegistering: false,
    isFetchingRegisteredUsers: false,
    isFetchingRegisteredConferences: false
});

export default RegistrationContext;
