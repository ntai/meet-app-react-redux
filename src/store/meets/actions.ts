import { ThunkDispatch as Dispatch } from "redux-thunk";
import {Action} from 'redux';
// import { pushState } from 'redux-router';
import {sweetHome, checkHttpStatus} from "../../appConfig";

import {MeetType} from './types';
import {Query, QueryResult} from "material-table";

import store from '../index';

export const MEET_FETCH_CLEAR = "MEET_FETCH_CLEAR";
export const MEET_FETCH_START = "MEET_FETCH_START";
export const MEET_FETCH_SUCCESS = "MEET_FETCH_SUCCESS";
export const MEET_FETCH_FAILURE = "MEET_FETCH_FAILURE";

// export const MEET_ADD = 'MEET_ADD';
// export const MEET_DELETE = 'MEET_DELETE';

export interface MeetFetchClear extends Action {
    type: typeof MEET_FETCH_CLEAR;
}

export interface MeetFetchStart extends Action {
    type: typeof MEET_FETCH_START;
    criteria: Query<MeetType>;
    fetchPath: string;
}

export interface MeetFetchSuccessAction extends Action {
    type: typeof MEET_FETCH_SUCCESS;
    totalCount: number,
    criteria: Query<MeetType>,
    meets: MeetType[];
}

export interface MeetFetchFailureAction extends Action {
    type: typeof MEET_FETCH_FAILURE;
    reason: any;
}

/*
export interface MeetAddAction extends Action {
    type: typeof MEET_ADD;
    name: string;
    address: string;
    phone: string;
    url: string;
}

export interface MeetDeleteAction extends Action {
    type: typeof MEET_DELETE;
    slug: string;
}
*/

export function generateQueryStringFromCriteria( criteria: Query<MeetType>) : string {
    if (criteria === null) return '';
    let qu = `?offset=${criteria.page*criteria.pageSize}&limit=${criteria.pageSize}`;
    if (criteria.search)
        qu = qu + `&search=${ encodeURIComponent(criteria.search) }`;
    return qu;
}

export function makeMeetFetch(needle: Query<MeetType>, fetchPath: string) : MeetFetchStart {
    return {
        type: MEET_FETCH_START,
        criteria: needle,
        fetchPath: fetchPath,
    }
}

export function makeMeetFetchSuccess(criteria: Query<MeetType>,
                                     meets : MeetType[],
                                     totalCount: number) : MeetFetchSuccessAction {
    return {
        type: MEET_FETCH_SUCCESS,
        criteria: criteria,
        meets: meets,
        totalCount: totalCount,
    }
}


export function makeMeetFetchFailure(reason : any) : MeetFetchFailureAction {
    return {
        type: MEET_FETCH_FAILURE,
        reason: reason
    }
}
/*

export function getMeets(criteria: Query<MeetType>,
                         resolveCB: (result: QueryResult<MeetType> | PromiseLike<QueryResult<MeetType>> | undefined) => void,
                         rejectCB: (reason?: any) => void )
{
    const fetchPath = generateQueryStringFromCriteria(criteria);
    console.log( `fetchMeets called with "${fetchPath}"`)
    return async function(dispatch: Dispatch<MeetFetchStart, {}, any>)
    {
        const meetEntities = store.getState().meets.entities;
        const oldSlice = meetEntities.keyedMeets[fetchPath];
        if (oldSlice) {
            console.log( `fetchPath ${fetchPath} exists. `)
            resolveCB({
                data: oldSlice.meets.map((slug:string) : MeetType => { return meetEntities.allMeets[slug] }),
                page: oldSlice.page,
                totalCount: oldSlice.totalCount,});
            return;
        }

        const backendUrl = sweetHome().backendUrl;
        let url = backendUrl + "/meets/api/" + fetchPath;

        // Set the state to in progress
        dispatch(makeMeetFetch(criteria));
        console.log( `makeMeetFetch called with "${fetchPath}" with "${url}"`)

        // See I already have it.
        const req = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Host': backendUrl,
            },
            bodyUsed: false,
        };

        console.log(`fetching ${url}`);

        return fetch(url, req)
            .then(response => checkHttpStatus(response))
            .then(response => response.json())
            .then(response => {
                try {
                    console.log(`count = ${response.count}, length = ${response.results.length}`);
                    dispatch(makeMeetFetchSuccess(criteria, response.results, response.count));
                    resolveCB( {
                        data: response.results,
                        page: criteria.page,
                        totalCount: response.count});
                }
                catch (exc) {
                    console.log(`fetch meet failed with ${exc.errorMessage} ${exc}`);
                    dispatch(makeMeetFetchFailure(exc.errorMessage));
                    rejectCB(exc.errorMessage);
                }
            })
            .catch(error => {
                console.log(`fetch meet failed with ${error.errorMessage}`);
                // If you see "Type Error", suspect server side's CORS policy
                dispatch(makeMeetFetchFailure(error));
                rejectCB(error.errorMessage);
            });
    }
}
*/

export type MeetActions = MeetFetchClear | MeetFetchStart | MeetFetchFailureAction | MeetFetchSuccessAction;

