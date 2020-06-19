import {
    USERS_FETCH_START,
    USERS_FETCH_SUCCESS,
    USERS_FETCH_FAILURE,
    UsersActions,
} from "./actions";

import { generateQueryString, } from  '../apiHelpers';

import {UserType, UsersState, initUsersState} from "./types";

/* */
export default function usersReducer( state: UsersState = initUsersState,
                                      action: UsersActions) : UsersState
{
    switch (action.type) {
        // This is a Flux Standard Action (FSA-action) because redux-api-middleware turns the RSAA action to
        // FSA. See https://github.com/redux-utilities/flux-standard-action
        case USERS_FETCH_START: {
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

        case USERS_FETCH_SUCCESS: {
            // const users = myAction.users;
            const payload = action.payload;
            const fetchPath = payload.fetchPath;
            const criteria = payload.criteria;

            const masterStorage = Object.assign( {},
                state.entities.allUsers,
                ...payload.results.map( (user:UserType ) => { return { [user.username]: user } } )
            );

            const storage = Object.assign( {}, state.entities.keyedUsers, { [fetchPath]: {
                    fetchPath: fetchPath,
                    users: payload.results.map( user => user.username ),
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
                        keyedUsers: storage,
                        page: payload.criteria.page,
                        errorMessage: undefined,
                        allUsers: masterStorage,
                    },),
                slice: {
                    fetchPath: fetchPath,
                    users: payload.results.map(loc => loc.username),
                    page: payload.criteria.page,
                    pageSize: payload.criteria.pageSize,
                    totalCount: totalCount
                },
            })}

        case USERS_FETCH_FAILURE: {
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
                    users: [],
                },
            });
        }
    }
    return state;
}
