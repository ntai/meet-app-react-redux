import { ThunkDispatch as Dispatch } from "redux-thunk";
import {Action} from 'redux';
// import { pushState } from 'redux-router';
import {sweetHome, checkHttpStatus} from "../../appConfig";
// import {history} from "../index";
import {jwt, null_jwt} from "./types";
import {createAction, RSAAAction} from "redux-api-middleware";
import {Action as FSAAction } from 'typescript-fsa';
import {AnyAction} from 'redux';
import JwtDecode from "jwt-decode";
import {IRootState} from "../index";
import {NoPayload} from "../apiHelpers";
import {ThunkDispatch} from "redux-thunk-recursion-detect";

let jwtTokenRefreshTimeout : NodeJS.Timeout;

/* Authorization aka login */

export const AUTH_REQUEST_LOGIN = "AUTH_REQUEST_LOGIN";
export const AUTH_GRANT_LOGIN = 'AUTH_GRANT_LOGIN';
export const AUTH_DENY_LOGIN = 'AUTH_DENY_LOGIN';
export const AUTH_LOGOUT = "AUTH_LOGOUT";


export interface AuthRequestPayload {
    username: string;
    password: string;
}

export interface AuthRequestLoginAction extends FSAAction<AuthRequestPayload> {
    type: typeof AUTH_REQUEST_LOGIN;
}

/**
 * AuthGrantPayload
 *  contains two jwt tokens - access and refresh
 */
export interface AuthGrantPayload {
    access: string;
    refresh: string;
}

export interface AuthRefreshPayload {
    access: string;
}

export type AuthFailedPayload = {
    reason: any
};

export interface AuthGrantLoginAction extends FSAAction<AuthGrantPayload> {
    type: typeof AUTH_GRANT_LOGIN;
}

export interface AuthRefreshGrantAction extends FSAAction<AuthRefreshPayload> {
    type: typeof AUTH_GRANT_LOGIN;
}

export interface AuthDenyLoginAction extends FSAAction<AuthFailedPayload> {
    type: typeof AUTH_DENY_LOGIN;
}

export interface AuthLogoutAction extends FSAAction<NoPayload> {
    type: typeof AUTH_LOGOUT;
}

export function makeLoginRequest(username: string, password: string) : AuthRequestLoginAction {
    return {
        type: AUTH_REQUEST_LOGIN,
        payload: {
            username: username,
            password: password
        }
    }
}

export function makeLoginSuccess(token: string, refresh: string) : AuthGrantLoginAction {
    return {
        type: AUTH_GRANT_LOGIN,
        payload: {
            access: token,
            refresh: refresh,
        }
    }};

export function makeRefreshGrantSuccess(token: string) : AuthRefreshGrantAction {
    return {
        type: AUTH_GRANT_LOGIN,
        payload: {
            access: token,
        }
    }};


export function makeLoginFailure(reason : any) : AuthDenyLoginAction {
    return {
        type: AUTH_DENY_LOGIN,
        payload: { reason: reason },
    }};

export function makeLogout() : AuthLogoutAction { return { type: AUTH_LOGOUT, payload: {}}};

/* ===================================================================================================
 * JWT token refresh with Django
 */

export const TOKEN_REQUEST = '@@jwt/TOKEN_REQUEST';
export const TOKEN_RECEIVED = '@@jwt/TOKEN_RECEIVED';
export const TOKEN_FAILURE = '@@jwt/TOKEN_FAILURE';

type TokenStringPayload = {
    tokenString: string,
};

export interface TokenRequestAction extends FSAAction<TokenStringPayload> {
    type: typeof TOKEN_REQUEST,
}


type AccessTokenStringPayload = {
    access: string,
};

export interface TokenReceivedAction extends FSAAction<AccessTokenStringPayload> {
    type: typeof TOKEN_RECEIVED,
}

export interface TokenFailedAction extends FSAAction<AuthFailedPayload> {
    type: typeof TOKEN_FAILURE,
}

/* ===================================================================================================
 * Cookie local storage
 */
export const cwTokenID = "cwMeetAppCred1";
export const cwRefreshID = "cwMeetAppCred2";
export const cwAuthenticated = "authenticated";

async function clearCookie()
{
    try {
        console.log("clearCookie: window.localStorage.remoteItem.");
        await window.localStorage.removeItem(cwAuthenticated);
        await window.localStorage.removeItem(cwTokenID);
        await window.localStorage.removeItem(cwRefreshID);
    }
    catch (exc) {
        console.log("clearCookie: window.localStorage.remoteItem failed.");
        console.log(exc);
    }
}

async function storeCookie(token: string, refresh: string, rememberMe: boolean) {
    try {
        if (rememberMe) {
            console.log("storeCookie: window.localStorage.setItem called.");
            await window.localStorage.setItem(cwAuthenticated, "true");
            await window.localStorage.setItem(cwTokenID, token);
            await window.localStorage.setItem(cwRefreshID, refresh);

            const verify = await window.localStorage.getItem(cwTokenID);
            console.log( `${token}/${verify}`);
        }
        else {
            await clearCookie();
        }
    }
    catch (exc) {
        console.log("storeCookie: window.localStorage.setItem/remoteItem failed.");
        console.log(exc);
    }
}

interface ICookie {
    token: string | null,
    refresh: string | null,
}

async function getCookie() : Promise<ICookie>
{
    console.log("getCookie: window.localStorage.getItem.");
    //
    const authed_value = await window.localStorage.getItem(cwAuthenticated);
    // because authed is stored as string, needs to be rehydrated.
    const authenticated = typeof authed_value === "string" ? JSON.parse(authed_value) : null;
    if (authenticated) {
        const token = await window.localStorage.getItem(cwTokenID);
        const refresh = await window.localStorage.getItem(cwRefreshID);
        console.log("getCookie: access " + token);
        return { token: token, refresh: refresh};
    }
    return {token: null, refresh: null};
}

// ===============================================================================================================

/** requestLogin
 * fetches
 * @param username
 * @param password
 * @param rememberMe
 * @param redirect
 */
export function requestLogin(username: string, password: string, rememberMe: boolean, redirect: string ="/") {
    return async function(dispatch: Dispatch<AuthRequestLoginAction, {}, any>,
                          getState: () => IRootState)
    {
        // Set the state to in progress
        dispatch(makeLoginRequest(username, password));

        //
        const backendUrl = sweetHome().backendUrl;
        const url = backendUrl + "/auth/token/obtain/";
        const payload = JSON.stringify({username: username, password: password});

        const req = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Host': backendUrl,
            },
            bodyUsed: true,
            body: payload,
        };

        return fetch(url, req)
            .then(response => checkHttpStatus(response))
            .then(response => response.json())
            .then(response => {
                console.log(`LOGIN: ${JSON.stringify(response)}`);
                const given = response as AuthGrantPayload;

                try {
                    // Set the state to granted
                    console.log("login succeeded. Before dispatch");
                    storeCookie(given.access, given.refresh, rememberMe);
                    dispatch(makeLoginSuccess(given.access, given.refresh));
                    console.log("login succeeded. After dispatch");
                    periodicRefreshJWTToken(dispatch, getState);
                }
                catch (exc) {
                    const reason = { response: { status: 403, statusText: 'Invalid access'}};
                    console.log("login failed.\n"+reason);
                    clearCookie();
                    dispatch(makeLoginFailure(reason));
                    // dispatch(pushState(null, '/login'));
                }
            })
            .catch(error => {
                // console.log("fetch failed: "  + error);
                // If you see "Type Error", suspect server side's CORS policy
                clearCookie();
                if (error.name === "TypeError") {
                    dispatch(makeLoginFailure("Failed to connect to the server. URL is " + url));
                }
                else {
                    dispatch(makeLoginFailure("Unexpected reply from server: " + error.toString()));
                }
            });
    }
}

export function doLogout() {
    return async (dispatch: Dispatch<AuthLogoutAction, {}, any>) => {
        await clearCookie();
        dispatch(makeLogout());
    };
}

export function checkAuthentication() {
    return async (dispatch: Dispatch<AuthGrantLoginAction, {}, any>,
                  getState : () => IRootState) => {
        const {token, refresh} = await getCookie();
        if (token) {
            dispatch(makeLoginSuccess(token, refresh ? refresh : ""));
            if (jwtTokenRefreshTimeout === undefined || (!jwtTokenRefreshTimeout.hasRef())) {
                periodicRefreshJWTToken(dispatch, getState)
            }
        }
        else {
            dispatch(makeLogout());
        }
    };
}

export function refreshAccessToken (refresh: string) : RSAAAction
{
    const backendUrl = sweetHome().backendUrl;
    const url = backendUrl + "/auth/token/refresh/";

    return createAction( {
        endpoint: url,
        method: 'POST',
        body: JSON.stringify({refresh: refresh}),
        headers: {'Content-Type': 'application/json'},
        types: [ TOKEN_REQUEST, TOKEN_RECEIVED, TOKEN_FAILURE ] });
}


export function refreshJwtTokenThunk<State = IRootState, Payload = any, Meta = any>(
    getState: () => IRootState
) : RSAAAction<State, Payload, Meta> | undefined{

    const state = getState();
    const refresToken = state.auth.refresh.token;
    if (refresToken)
        return refreshAccessToken(refresToken);
    return;
}

/**
 * returns the access token timeout in millisecs.
 * @param state
 */
function getAccessTokenTimeout(state: IRootState) : number | undefined {
    if (state.auth.access.token && state.auth.access.details && state.auth.access.details.exp) {
        // I think this is telling that the toke will expire in 5 seconds.
        return (1000 * state.auth.access.details.exp) - (new Date()).getTime();
    }
    return;
}


export function periodicRefreshJWTToken(dispatch: ThunkDispatch<any, any, any>, getState: () => IRootState) : void
{
    const timeout = getAccessTokenTimeout(getState());
    if (timeout) {
        const tout = Math.max(1000, timeout - 30*1000);

        const toFunc = () => {
            console.log("JWT refresh woke up.");
            const refreshThunk = refreshJwtTokenThunk(getState);
            if (refreshThunk) {
                console.log("Calling refreshJwtTokenThunk");
                dispatch(refreshThunk);
                console.log("Calling refresh on the timeout.");
                const timeout1 = getAccessTokenTimeout(getState());
                if (timeout1) {
                    const tout1 = Math.max(1000, timeout1 - 15 * 1000);
                    console.log(`Set the jwt refresh new timeout with ${tout1/1000.0}`);
                    jwtTokenRefreshTimeout = setTimeout(toFunc, tout1);
                }
            }
        }

        console.log(`Set the jwt refresh timeout with ${tout/1000.0}`);
        jwtTokenRefreshTimeout = setTimeout(toFunc, tout);
    }
}

export function parseJwtToken(token: string|null) : jwt {
    if (token) {
        return {
            token: token,
            details: JwtDecode(token),
        }
    }
    else {
        return null_jwt;
    }
}

function getJwtTokenString(j: jwt) : string {
    return j.token ? j.token : "";
}


export function getAccessTokenString(state: IRootState) : string {
    return getJwtTokenString(state.auth.access);
}

export function getRefreshTokenString(state: IRootState) : string {
    return getJwtTokenString(state.auth.refresh);
}


export type AuthActions = AuthRequestLoginAction | AuthGrantLoginAction | AuthLogoutAction | AuthDenyLoginAction | TokenRequestAction | TokenReceivedAction | TokenFailedAction;

