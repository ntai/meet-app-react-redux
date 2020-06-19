
import {Query, Column} from "material-table";
import {
    createAction,
    RSAAAction,
    RSAAFailureType,
    RSAARequestType,
    RSAASuccessType,
    isRSAA,
    RSAA,
    apiMiddleware,
} from "redux-api-middleware";

import {IRootState} from "./index";
import {sweetHome} from "../appConfig";

import {
    AUTH_GRANT_LOGIN,
    getAccessTokenString,
    getRefreshTokenString,
    refreshAccessToken,
    TOKEN_FAILURE,
    TOKEN_RECEIVED,
    TOKEN_REQUEST
} from './auth/actions';
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {Action, Dispatch, AnyAction, Middleware, MiddlewareAPI } from "redux";

// export interface ApiFetchCriteria<T extends Query<T>> {}
export type ApiFetchCriteria<T extends object> = Query<T>;

export type NoPayload = any;

export function generateQueryString<E extends object>( criteria: Query<E>) : string {
    if (criteria === undefined) {
        console.log("generateQueryStringFromCriteria received undefined. You should investigate where it came from.");
        return '';
    }
    if (criteria === null) return '';
    let qu = `?offset=${criteria.page*criteria.pageSize}&limit=${criteria.pageSize}`;
    if (criteria.search)
        qu = qu + `&search=${ encodeURIComponent(criteria.search) }`;
    return qu;
}

/**
 * This is the standard reply json from Django restful API.
 */
export type ApiFetchResponse<T> = {
    count: number,
    next: string|null,
    previous: string|null,
    results: T[], // results
    lengths: number|null,
}


export function FetchAllCriteria<T extends object>() : Query<T>
{
    return {
        search: "",
        page: 0,
        pageSize: 50,
        filters: [],
        orderBy: "name" as Column<T>,
        orderDirection: "asc",
    }
}

function isAccessTokenExpired(state: IRootState) : boolean {
    if (state.auth.access.token && state.auth.access.details && state.auth.access.details.exp) {
        // I think this is telling that the toke will expire in 5 seconds.
        return 1000 * state.auth.access.details.exp - (new Date()).getTime() < 5000
    }
    return true
}

function accessTokenNeedsRefresh(state: IRootState) : boolean {
    return state.auth.refresh.token !== null && isAccessTokenExpired(state);
}

interface DispatchExt {

}

/*
https://github.com/stevengoldberg/threadcount/blob/master/app/actions/auth.js#L117-L145
function attemptTokenRefresh(refreshToken : string) {
    const body = qs.stringify({
        client_id: GOOGLE_CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    });
    return {
        [RSAA]: {
            endpoint: GOOGLE_TOKEN_URL,
            method: 'POST',
            types: [
                getRequestType(refreshActions),
                getSuccessType(refreshActions),
                {
                    type: getFailureType(refreshActions),
                    payload: (action, state, res) =>
                        res.json().then(json => {
                            ipcRenderer.send('error', SESSION_EXPIRED);
                            return json;
                        })
                }
            ],
            body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    };
}
 */


function attemptTokenRefresh(refreshToken : string) {
    const body = JSON.stringify({
        client_id: /* GOOGLE_CLIENT_ID */ "CleanWinner",
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
    });
    const {baseUrl , backendUrl} = sweetHome();
    const url = backendUrl + "/auth/token/refresh/";

    return createAction(
        {
            endpoint: url,
            method: "POST",
            types: [
                TOKEN_REQUEST,
                TOKEN_RECEIVED,
                TOKEN_FAILURE,
            ],
            body: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
}


export function createRefreshMiddleware() {
    let postponedRSAAs : RSAAAction[] = [];
    // @ts-ignore
    return ({ dispatch, getState }) => {
        const rsaaMiddleware = apiMiddleware({ dispatch, getState });
        // @ts-ignore
        return (next) => (action : AnyAction) => {

            // @ts-ignore
            const nextCheckPostponed = (nextAction) => {
                // run postponed actions
                if (nextAction.type === TOKEN_RECEIVED) {
                    next(nextAction);
                    postponedRSAAs.forEach ((postponed) => {
                        console.log(`Running action ${action.type}`);
                        rsaaMiddleware(next)(postponed);
                    });
                    postponedRSAAs = [];
                }
                else {
                    next(nextAction);
                }
            }

            if (isRSAA(action)) {
                try {
                    const state : IRootState = getState();
                    if (accessTokenNeedsRefresh(state)) {
                        const refreshToken = getRefreshTokenString(state);
                        postponedRSAAs.push(action as unknown as RSAAAction);
                        if (postponedRSAAs.length === 1) {
                            return rsaaMiddleware(next)(refreshAccessToken(refreshToken));
                        }
                        else {
                            return;
                        }
                    }
                } catch (e) {
                    console.log(e);
                    return next(action);
                }

                return rsaaMiddleware(next)(action);
            }
            return next(action);
        };
    };
}

function generateAuthHeader(state: IRootState) : object | undefined
{
    return state.auth.isAuthenticated ? {
        "Authorization": `Bearer ${getAccessTokenString(state)}`
    } : undefined;
}

export function createApiAction<State = any, Payload = any, Meta = any>(
    getState: () => IRootState,
    apipath: string,
    getCachedData: (state: IRootState, apipath: string) => object|undefined,
    actionTypes : [
        RSAARequestType<State, Payload, Meta>,
        RSAASuccessType<State, Payload, Meta>,
        RSAAFailureType<State, Payload, Meta>
    ]) : RSAAAction<State, Payload, Meta> {

    const {baseUrl , backendUrl} = sweetHome();
    const url = backendUrl + apipath;
    const state = getState();
    const authHeader = generateAuthHeader(state);

    return createAction({
        endpoint: url,
        credentials: "same-origin",
        fetch: async (...args) => {
            const state = await getState();
            const cachedData = getCachedData(state, apipath);

            if (cachedData) {
                const body = JSON.stringify(cachedData);
                return new Response(body,
                    {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }

            const response = await fetch(...args);
            if (response.redirected) {
                console.log( "Fetching teams redirected. : " + response.url);
                /* If the request is redirected, the clinet is not logged in. */
                const redirectedResponse = new Response( response.body,
                    {
                        status: 401,
                        headers: response.headers,
                    })
                return redirectedResponse;
            }
            const cloned = response.clone();
            const json = await cloned.json();
            if (json.error) {
                /* If JSON parsing fails, return error here */
                console.log( "JSON parse error. : " + json.errorMessage);
                const jsonError = new Response( response.body,
                    {
                        status: 500,
                        headers: response.headers,
                    }
                );
                return jsonError;
            }
            console.log( `Returning successful response. ${JSON.stringify(json)}`);
            return response;
        },
        method: "GET",
        body: null,
        headers: { 'Content-Type': 'application/json',
            ...authHeader,
        },
        types: actionTypes,
    });
}

/*
function attemptTokenRefresh(refreshToken : string) {
    const body = JSON.stringify({
        client_id: GOOGLE_CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
    });
    const {baseUrl , backendUrl} = sweetHome();
    const url = backendUrl + "/auth/token/refresh/";

    return createAction(
        {
            endpoint: url,
            method: "POST",
            types: [
                TOKEN_REQUEST,
                TOKEN_RECEIVED,
                TOKEN_FAILURE,
            ],
            body: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
}
*/
