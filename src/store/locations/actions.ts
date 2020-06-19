import { ThunkDispatch, ThunkAction } from "redux-thunk";
import {Action} from 'redux';
// import { pushState } from 'redux-router';
// import {sweetHome, checkHttpStatus, callJsonApi} from "../../appConfig";
import {LocationType} from './types';
import {Query, QueryResult, Column} from "material-table";
import {sweetHome} from "../../appConfig";
import {IRootState} from "..";
import {
    generateQueryString,
    NoPayload,
    ApiFetchResponse,
    ApiFetchCriteria,
    FetchAllCriteria
} from '../apiHelpers';
import {createAction, RSAAAction} from "redux-api-middleware";
import {Action as FSAAction } from 'typescript-fsa';

// export const LOCATION_FETCH_CLEAR = "LOCATION_FETCH_CLEAR";
export const LOCATION_FETCH_START = "LOCATION_FETCH_START";
export const LOCATION_FETCH_SUCCESS = "LOCATION_FETCH_SUCCESS";
export const LOCATION_FETCH_FAILURE = "LOCATION_FETCH_FAILURE";

export type LocationFetchCriteria = ApiFetchCriteria<LocationType>;
export const AllLocationsCriteria : LocationFetchCriteria = FetchAllCriteria<LocationType>();

export type LocationFetchRequestPayload = {
    criteria: LocationFetchCriteria,
    fetchPath: string,
}

export interface LocationFetchStartAction extends FSAAction<LocationFetchRequestPayload> {
    type: typeof LOCATION_FETCH_START;
}

export type LocationFetchSuccessPayload = {
    count: number,
    results: LocationType[],
    next?: string,
    prev? : string,
    length: number,
    criteria: LocationFetchCriteria,
    fetchPath: string,
}

export interface LocationFetchSuccessAction extends FSAAction<LocationFetchSuccessPayload> {
    type: typeof LOCATION_FETCH_SUCCESS;
}

type LocationFetchFailurePayload = {
    reason: any;
}

export interface LocationFetchFailureAction extends FSAAction<LocationFetchFailurePayload> {
    type: typeof LOCATION_FETCH_FAILURE;
}

export type LocationFetchResponse = ApiFetchResponse<LocationType>;


// FIXME:
// const locationSchema = new Schema('locations');

type LocationLoadExtraArgs = undefined;
type LocationThunkResult<R> = ThunkAction<R, IRootState, LocationLoadExtraArgs, Action>;
type LocationThunkDispatch = ThunkDispatch<IRootState, LocationLoadExtraArgs, Action>;

export function loadLocationsThunk (criteria: LocationFetchCriteria,
                                    successCB?: (locs: QueryResult<LocationType>) => void,
                                    rejectCB?: (reason: any) => void) {
    return async function(dispatch: LocationThunkDispatch, getState: () => IRootState) {
        const {baseUrl , backendUrl} = sweetHome();
        const fetchPath = "/locations/api/" + generateQueryString<LocationType>(criteria);
        const url = backendUrl + fetchPath;

        const action = createAction({
            endpoint: url,
            credentials: "same-origin",
            fetch: async (...args) => {
                const state = await getState();
                const cached = state.locations.entities.keyedLocations[fetchPath];
                if (cached) {
                    console.log("Hit cached.");
                    const data : LocationFetchResponse = {
                        count: cached.totalCount,
                        results: cached.locations.map((slug) => { return state.locations.entities.allLocations[slug] }),
                        next: "",
                        previous: "",
                        lengths: cached.locations.length,
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
                    type: LOCATION_FETCH_START,
                    payload: (action,
                              state1) : LocationFetchRequestPayload | Promise<LocationFetchRequestPayload > => {
                        return {
                            criteria: criteria,
                            fetchPath: fetchPath,
                        };
                    }
                },

                {
                    type: LOCATION_FETCH_SUCCESS,
                    payload: async (action, state, response) => {
                        const json = await response.json();
                        return { ...json,
                            criteria: criteria,
                            fetchPath: fetchPath,
                        };
                    }
                },

                LOCATION_FETCH_FAILURE,
            ],
        });

        // Annoyingly, createAction returns RSAAaction which is not subclass of Action...
        // @ts-ignore
        const actionResponse: FSAAction<any> = await dispatch(action);

        // here, actionResponse is a LocationActions - one of FSA actions
        console.log(actionResponse);

        if (actionResponse.error) {
            // This may throws an exception so you better catch it
            if (rejectCB)
                rejectCB(actionResponse.payload);
            return;
        }

        if (successCB && actionResponse.type === LOCATION_FETCH_SUCCESS) {
            // Give data to the table
            const state = getState();
            const locs : QueryResult<LocationType> = {
                page: criteria.page,
                data: state.locations.slice.locations.map(slug => state.locations.entities.allLocations[slug]),
                totalCount: state.locations.slice.totalCount ? state.locations.slice.totalCount : 0,
            }
            console.log(`locs ${JSON.stringify(locs)}`);
            successCB(locs);
        }
    }
}


export type LocationActions = LocationFetchStartAction | LocationFetchFailureAction | LocationFetchSuccessAction;

