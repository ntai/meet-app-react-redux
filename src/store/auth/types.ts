// import { UserType } from '../users/types';

import {AuthRefreshGrantAction, AuthRefreshPayload} from "./actions";

type jwt_details = {
    token_type: string,
    exp: number,
    jti: string,
    user_id: number,
}

export type jwt = {
    token: string | null,
    details?: jwt_details,
}

export const null_jwt : jwt = {token: null, details: undefined};

export interface AuthState {
    inProgress: boolean | null;
    isAuthenticated: boolean | null;
    username: string | null;
    access: jwt; // jwt access
    refresh: jwt;
    reason: any; // FIXME: deny reason.
    avatar: string | null; // avatar url
    refreshTokenPromise: Promise<AuthRefreshPayload> | null
}

export const initAuthState : AuthState = {
    inProgress: false,
    isAuthenticated: false,
    username: "",
    access: null_jwt,
    refresh: null_jwt,
    reason: undefined,
    avatar: null,
    refreshTokenPromise: null,
};

