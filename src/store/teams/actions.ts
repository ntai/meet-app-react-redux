import { ThunkDispatch, ThunkAction } from "redux-thunk";
import {Action} from 'redux';
// import { pushState } from 'redux-router';
// import {sweetHome, checkHttpStatus, callJsonApi} from "../../appConfig";
import {TeamType} from './types';
import {Query, QueryResult, Column} from "material-table";
import {sweetHome} from "../../appConfig";
import {IRootState,} from "..";
import {
    ApiFetchCriteria,
    ApiFetchResponse,
    createApiAction,
    FetchAllCriteria,
    generateQueryString,
    NoPayload
} from '../apiHelpers';
import {createAction, RSAAAction, RSAAFailureAction, RSAARequestAction, RSAASuccessAction} from "redux-api-middleware";
import {Action as FSAAction } from 'typescript-fsa';
import {STATUS_CODES} from "http";
import {LocationType} from "../locations/types";
import {LOCATION_FETCH_SUCCESS} from "../locations/actions";

export const TEAM_FETCH_START = "TEAM_FETCH_START";
export const TEAM_FETCH_SUCCESS = "TEAM_FETCH_SUCCESS";
export const TEAM_FETCH_FAILURE = "TEAM_FETCH_FAILURE";

export type TeamFetchCriteria = ApiFetchCriteria<TeamType>;
export const AllTeamsCriteria : TeamFetchCriteria = FetchAllCriteria<TeamType>();

type TeamFetchRequestPayload = {
    criteria: TeamFetchCriteria,
    fetchPath : string,
}

export interface TeamFetchStartAction extends FSAAction<TeamFetchRequestPayload> {
    type: typeof TEAM_FETCH_START;
}

type TeamFetchSuccessPayload = {
    count: number,
    results: TeamType[],
    next?: string,
    prev? : string,
    length: number,
    criteria: TeamFetchCriteria,
    fetchPath : string,
}

export interface TeamFetchSuccessAction extends FSAAction<TeamFetchSuccessPayload> {
    type: typeof TEAM_FETCH_SUCCESS;
}

type TeamFetchFailurePayload = {
    reason: any;
}

export interface TeamFetchFailureAction extends FSAAction<TeamFetchFailurePayload> {
    type: typeof TEAM_FETCH_FAILURE;
}

/**
 * Team fetch response is the reply from API
 */

export type TeamFetchResponse = ApiFetchResponse<TeamType>;

// FIXME:
// const teamSchema = new Schema('teams');

type TeamExtraArg = undefined;
type TeamThunkDispatch = ThunkDispatch<IRootState, TeamExtraArg, Action>;

export function loadTeamsThunk1 (criteria: TeamFetchCriteria,
                                 successCB?: (locs: QueryResult<TeamType>) => void,
                                 rejectCB?: (reason: any) => void) {
    return async function(dispatch: TeamThunkDispatch, getState: () => IRootState) {
        const apipath = "/teams/api/" + generateQueryString<TeamType>(criteria);

        const action : RSAAAction = createApiAction(getState,
            apipath,
            (state: IRootState, apipath: string) : object|undefined => {
                return undefined;
            },
            [
                {
                    type: TEAM_FETCH_START,
                    payload: (action, state1) : TeamFetchRequestPayload | Promise<TeamFetchRequestPayload > => {
                        return { criteria: criteria, fetchPath: apipath };
                    }
                },

                {
                    type: TEAM_FETCH_SUCCESS,
                    payload: async (action, state, response) => {
                        const json = await response.json();
                        return { ...json,
                            criteria: criteria,
                            fetchPath: apipath,
                        };
                    }
                },

                TEAM_FETCH_FAILURE,
            ]
        );

        // Annoyingly, createAction returns RSAAaction which is not subclass of Action...
        // @ts-ignore
        const actionResponse : FSAAction<any> = await dispatch(action);
        // FIXME - Middleware may return nothing and I blow up.

        // here, actionResponse is a TeamActions - one of FSA actions
        console.log(actionResponse);

        if (actionResponse.error) {
            // This may throws an exception so you better catch it
            if (rejectCB) {
                console.log("Calling team fetch reject CB");
                try {
                    rejectCB(actionResponse.payload);
                    console.log("Finishied reject CB");
                } catch (error) {
                    console.log("Why on earth calling reject CB does exception? " + error.errorMessage);
                }
            }
            return;
        }

        if (successCB && actionResponse.type === TEAM_FETCH_SUCCESS) {
            // Give data to the table
            const state = getState();
            const teams : QueryResult<TeamType> = {
                page: criteria.page,
                data: state.teams.slice.teams.map(slug => state.teams.entities.allTeams[slug]),
                totalCount: state.teams.slice.totalCount ? state.teams.slice.totalCount : 0,
            }
            console.log(`teams ${JSON.stringify(teams)}`);
            successCB(teams);
        }
    }
}


export type TeamActions = TeamFetchStartAction | TeamFetchFailureAction | TeamFetchSuccessAction;

