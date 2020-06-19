import { ThunkDispatch, ThunkAction } from "redux-thunk";
import {Action} from 'redux';
import {UsersSliceState, UserType} from './types';
import {QueryResult,} from "material-table";
import {sweetHome} from "../../appConfig";
import {IRootState} from "..";
import {
    generateQueryString,
    ApiFetchResponse,
    ApiFetchCriteria,
    FetchAllCriteria
} from '../apiHelpers';
import {createAction, RSAAAction} from "redux-api-middleware";
import {Action as FSAAction } from 'typescript-fsa';

// export const USERS_FETCH_CLEAR = "USERS_FETCH_CLEAR";
export const USERS_FETCH_START = "USERS_FETCH_START";
export const USERS_FETCH_SUCCESS = "USERS_FETCH_SUCCESS";
export const USERS_FETCH_FAILURE = "USERS_FETCH_FAILURE";

export type UsersFetchCriteria = ApiFetchCriteria<UserType>;
export const AllUsersCriteria : UsersFetchCriteria = FetchAllCriteria<UserType>();

export type UsersFetchRequestPayload = {
    criteria: UsersFetchCriteria,
    fetchPath: string,
}

export interface UsersFetchStartAction extends FSAAction<UsersFetchRequestPayload> {
    type: typeof USERS_FETCH_START;
}

export type UsersFetchSuccessPayload = {
    count: number,
    results: UserType[],
    next?: string,
    prev? : string,
    length: number,
    criteria: UsersFetchCriteria,
    fetchPath: string,
}

export interface UsersFetchSuccessAction extends FSAAction<UsersFetchSuccessPayload> {
    type: typeof USERS_FETCH_SUCCESS;
}

type UsersFetchFailurePayload = {
    reason: any;
}

export interface UsersFetchFailureAction extends FSAAction<UsersFetchFailurePayload> {
    type: typeof USERS_FETCH_FAILURE;
}

export type UsersFetchResponse = ApiFetchResponse<UserType>;

type UsersLoadExtraArgs = undefined;
type UsersThunkDispatch = ThunkDispatch<IRootState, UsersLoadExtraArgs, Action>;

export function loadUsersThunk (criteria: UsersFetchCriteria,
                                 successCB?: (users: QueryResult<UserType>) => void,
                                 rejectCB?: (reason: any) => void) {
    return async function(dispatch: UsersThunkDispatch, getState: () => IRootState) {
        const {baseUrl , backendUrl} = sweetHome();
        const fetchPath = "/users/api/" + generateQueryString<UserType>(criteria);
        const url = backendUrl + fetchPath;

        const action = createAction({
            endpoint: url,
            credentials: "same-origin",
            fetch: async (...args) => {
                const state = await getState();
                const cached : UsersSliceState = state.users.entities.keyedUsers[fetchPath];
                if (cached) {
                    console.log("Hit cached.");
                    const data : UsersFetchResponse = {
                        count: cached.totalCount,
                        results: cached.users.map((username) => { return state.users.entities.allUsers[username] }),
                        next: "",
                        previous: "",
                        lengths: cached.users.length,
                    };
                    const body = JSON.stringify(data);
                    console.log(`Body : ${body}`);
                    return new Response(body,
                        {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        }
                    );
                }
                console.log(`fetching... ${args}`);
                return fetch(...args);
            },
            method: "GET",
            body: null,
            headers: { 'Content-Type': 'application/json', },
            types: [
                {
                    type: USERS_FETCH_START,
                    payload: (action,
                              state1) : UsersFetchRequestPayload | Promise<UsersFetchRequestPayload > => {
                        return {
                            criteria: criteria,
                            fetchPath: fetchPath,
                        };
                    }
                },

                {
                    type: USERS_FETCH_SUCCESS,
                    payload: async (action, state, response) => {
                        const json = await response.json();
                        return { ...json,
                            criteria: criteria,
                            fetchPath: fetchPath,
                        };
                    }
                },

                USERS_FETCH_FAILURE,
            ],
        });

        // Annoyingly, createAction returns RSAAaction which is not subclass of Action...
        const actionResponse = await dispatch((action as unknown) as Action<any>) as unknown as FSAAction<any>;

        // here, actionResponse is a UsersActions - one of FSA actions
        console.log(actionResponse);

        if (actionResponse.error) {
            // This may throws an exception so you better catch it
            if (rejectCB)
                rejectCB(actionResponse.payload);
            return;
        }

        if (successCB && actionResponse.type === USERS_FETCH_SUCCESS) {
            // Give data to the table
            const state = getState();
            const users : QueryResult<UserType> = {
                page: criteria.page,
                data: state.users.slice.users.map(username => state.users.entities.allUsers[username]),
                totalCount: state.users.slice.totalCount ? state.users.slice.totalCount : 0,
            }
            console.log(`users ${JSON.stringify(users)}`);
            successCB(users);
        }
    }
}

export type UsersActions = UsersFetchStartAction | UsersFetchFailureAction | UsersFetchSuccessAction;

