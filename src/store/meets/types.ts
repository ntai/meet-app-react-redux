// import * as React from "react";
// import {Query} from "material-table";

// This is for individual meet.
export type MeetType = {
    slug: string, // id
    /* season = models.ForeignKey(Season, related_name="season", on_delete=models.SET_NULL, null=True, blank=True) */
    name: string,
    team: string, // team slug
    description: string | null,
    startTime: number,
    duration: number,
    manager: string, // manager (username)
    min_attendees: number,
    max_attendees: number,
    comments: string,
    meet_reminder: number,
};

// export const initialCriteria: Query<MeetType> = {pageSize: 10, page: 0, search: "", filters: [], orderBy: { field: 'name'}, orderDirection: "asc"};

// User's slice state
export interface MeetSliceState {
    fetchPath: string;
    page: number;
    pageSize: number;
    meets: string[];
    totalCount: number;
}

// The store state.
export interface MeetEntityState {
    isFetching: boolean;
    fetchPath: string,
    page: number,
    keyedMeets: { [fetchPath: string]: MeetSliceState },
    allMeets: { [slug : string]: MeetType },
    errorMessage?: string;
}

// Since the list is a subset of entities, combine the state.
export interface MeetsState {
    entities: MeetEntityState;
    slice: MeetSliceState;
}

// export const initialCriteria: Query<MeetType> = {pageSize: 10, page: 0, search: "", filters: [], orderBy: { field: 'name'}, orderDirection: "asc"};

export const initMeetState : MeetsState = {
    entities: {
        isFetching: false,
        fetchPath: "",
        page: 0,
        errorMessage: undefined,
        allMeets: {},
        keyedMeets: {},
    },
    slice: {
        fetchPath: "",
        meets: [],
        page: 0,
        pageSize: 10,
        totalCount: 0,
    },
}
