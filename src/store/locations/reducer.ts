import {
    LOCATION_FETCH_START,
    LOCATION_FETCH_SUCCESS,
    LOCATION_FETCH_FAILURE,
    LocationActions,
} from "./actions";

import { generateQueryString, } from  '../apiHelpers';

import {LocationType, LocationsState, initLocationState} from "./types";

// import {act} from "react-dom/test-utils";

/* */
export default function locationReducer( state: LocationsState = initLocationState,
                                         action: LocationActions) : LocationsState
{
    switch (action.type) {
/*
        case LOCATION_FETCH_CLEAR:
            return Object.assign({}, state, {
                entities: Object.assign( {}, state.entities,
                    {
                        keyedLocations: {},
                        isFetching: false,
                        fetchPath: "",
                        page: 0,
                        errorMessage: undefined},),
                slice: {
                    locations: [],
                    fetchPath: "",
                },
            });
*/

        // This is a Flux Standard Action (FSA-action) because redux-api-middleware turns the RSAA action to
        // FSA. See https://github.com/redux-utilities/flux-standard-action
        case LOCATION_FETCH_START: {
            const payload = action.payload;
            const fetchPath = payload.fetchPath;
            console.log(`payload.${fetchPath} page: ${payload.criteria && payload.criteria.page ? payload.criteria.page : "none"}`)
            return Object.assign({}, state, {
                entities: Object.assign({}, state.entities,
                    {
                        isFetching: true,
                        fetchPath: fetchPath,
                        page: payload.criteria.page,
                        errorMessage: undefined
                    },),
            });
        }

        case LOCATION_FETCH_SUCCESS: {
            // const locations = myAction.locations;
            const payload = action.payload;
            const fetchPath = payload.fetchPath;
            const criteria = payload.criteria;

            const masterStorage = Object.assign( {},
                state.entities.allLocations,
                ...payload.results.map( (loc:LocationType ) => { return { [loc.slug]: loc } } )
            );

            const storage = Object.assign( {}, state.entities.keyedLocations, { [fetchPath]: {
                    fetchPath: fetchPath,
                    locations: payload.results.map( loc => loc.slug ),
                    page: criteria.page,
                    pageSize: criteria.pageSize,
                    totalCount: payload.count,
                }});

            const totalCount = payload.count;
            return Object.assign({}, state, {
                entities: Object.assign( {}, state.entities,
                    {
                        isFetching: false,
                        fetchPath: "",
                        keyedLocations: storage,
                        page: payload.criteria.page,
                        errorMessage: undefined,
                        allLocations: masterStorage,
                    },),
                slice: {
                    fetchPath: fetchPath,
                    locations: payload.results.map(loc => loc.slug),
                    page: payload.criteria.page,
                    pageSize: payload.criteria.pageSize,
                    totalCount: totalCount
                },
            })}

        case LOCATION_FETCH_FAILURE: {
            const payload = action.payload as unknown as Error; // Payload is Error object
            const errorMessage = payload.stack || payload.message;
            console.log(errorMessage);

            return Object.assign({}, state, {
                entities: Object.assign({}, state.entities,
                    {
                        fetchPath: "",
                        isFetching: false,
                        errorMessage: errorMessage,
                    },),
                slice: {
                    fetchPath: "",
                    locations: [],
                },
            });
        }
    }
    return state;
}
