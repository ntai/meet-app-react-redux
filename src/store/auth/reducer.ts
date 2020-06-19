import {
    AUTH_REQUEST_LOGIN,
    AUTH_GRANT_LOGIN,
    AUTH_LOGOUT,
    AUTH_DENY_LOGIN,
    TOKEN_REQUEST,
    TOKEN_RECEIVED,
    TOKEN_FAILURE,
} from "./actions";
import {AuthState, initAuthState, null_jwt} from "./types";
import {AuthActions, parseJwtToken} from "./actions";

/* */

export default function authReducer( state: AuthState = initAuthState,
                                     action: AuthActions) : AuthState
{
    switch (action.type) {
        case AUTH_REQUEST_LOGIN:
            return Object.assign({}, state, {
                inProgress: true,
                isAuthenticated: false,
                username: action.payload.username,
                access: null_jwt,
                refresh: null_jwt,
                reason: undefined
            });

        case AUTH_GRANT_LOGIN:
            return Object.assign({}, state, {
                inProgress: false,
                isAuthenticated: true,
                access: parseJwtToken(action.payload.access),
                refresh: parseJwtToken(action.payload.refresh),
                reason: undefined
            });

        case AUTH_DENY_LOGIN:
        case TOKEN_FAILURE:
            return Object.assign({}, state, {
                inProgress: false,
                isAuthenticated: false,
                access: null_jwt,
                refresh: null_jwt,
                reason: action.payload.reason,
            });

        case AUTH_LOGOUT:
            return Object.assign({}, state, {
                inProgress: false,
                isAuthenticated: false,
                access: null_jwt,
                refresh: null_jwt,
                reason: undefined
            });

        case TOKEN_REQUEST:
            return Object.assign({}, state, {
                inProgress: true,
            });

        case TOKEN_RECEIVED:
            return Object.assign({}, state, {
                inProgress: false,
                access: parseJwtToken(action.payload.access),
            });
    }
    return state;
}
