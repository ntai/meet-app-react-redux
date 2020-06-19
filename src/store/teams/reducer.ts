import {
    TEAM_FETCH_START,
    TEAM_FETCH_SUCCESS,
    TEAM_FETCH_FAILURE,
    TeamActions,
    TeamFetchFailureAction,
} from "./actions";

import {generateQueryString} from "../apiHelpers";
import {TeamType, TeamsState, initTeamState} from "./types";

// import {act} from "react-dom/test-utils";

/* */
export default function teamReducer( state: TeamsState = initTeamState,
                                         action: TeamActions) : TeamsState
{
    switch (action.type) {

        // This is a Flux Standard Action (FSA-action) because redux-api-middleware turns the RSAA action to
        // FSA. See https://github.com/redux-utilities/flux-standard-action
        case TEAM_FETCH_START: {
            const payload = action.payload;
            const qs = generateQueryString(payload.criteria);
            console.log(`payload.${qs} page: ${payload.criteria && payload.criteria.page ? payload.criteria.page : "none"}`)
            return Object.assign({}, state, {
                entities: Object.assign({}, state.entities,
                    {
                        isFetching: true,
                        fetchPath: payload.fetchPath,
                        page: payload.criteria.page,
                        errorMessage: undefined
                    },),
            });
        }

        case TEAM_FETCH_SUCCESS: {
            // const teams = myAction.teams;
            const payload = action.payload;
            const fetchPath = state.entities.fetchPath;

            const masterStorage = Object.assign( {},
                state.entities.allTeams,
                ...payload.results.map( (team:TeamType ) => { return { [team.slug]: team } } )
            );

            const storage = Object.assign( {}, state.entities.keyedTeams, { [fetchPath]: {
                    fetchPath: fetchPath,
                    teams: payload.results.map( team => team.slug ),
                    page: payload.criteria.page,
                    pageSize: payload.criteria.pageSize,
                    totalCount: payload.count,
                }});

            const totalCount = payload.count;
            return Object.assign({}, state, {
                entities: Object.assign( {}, state.entities,
                    {
                        isFetching: false,
                        fetchPath: "",
                        keyedTeams: storage,
                        page: payload.criteria.page,
                        errorMessage: undefined,
                        allTeams: masterStorage,
                    },),
                slice: {
                    fetchPath: fetchPath,
                    teams: payload.results.map(team => team.slug),
                    page: payload.criteria.page,
                    pageSize: payload.criteria.pageSize,
                    totalCount: totalCount
                },
            })}

        case TEAM_FETCH_FAILURE: {
            const fa = action as unknown as TeamFetchFailureAction;
            const payload = fa.payload as unknown as Error; // Payload is Error object
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
                    teams: [],
                },
            });
        }
    }
    return state;
}
