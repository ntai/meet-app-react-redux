// import * as React from "react";
// import {Query} from "material-table";

// This is for individual team.
import {getConfigParseResult} from "ts-loader/dist/config";

export type TeamType = {
    slug: string, // id
    name: string,
    owner: string,
    description: string | null,
    category: string | null,
    url: string | null,
};

// export const initialCriteria: Query<TeamType> = {pageSize: 10, page: 0, search: "", filters: [], orderBy: { field: 'name'}, orderDirection: "asc"};

// User's slice state
export interface TeamSliceState {
    fetchPath: string;
    page: number;
    pageSize: number;
    teams: string[]; // team slug
    totalCount: number;
}

// The store state.
export interface TeamEntityState {
    isFetching: boolean;
    fetchPath: string,
    page: number,
    keyedTeams: { [queryString: string]: TeamSliceState },
    allTeams: { [slug: string]: TeamType},
    errorMessage?: string;
}

// Since the list is a subset of entities, combine the state.
export interface TeamsState {
    entities: TeamEntityState;
    slice: TeamSliceState;
}

// export const initialCriteria: Query<TeamType> = {pageSize: 10, page: 0, search: "", filters: [], orderBy: { field: 'name'}, orderDirection: "asc"};

export const initTeamState : TeamsState = {
    entities: {
        isFetching: false,
        fetchPath: "",
        page: 0,
        errorMessage: undefined,
        keyedTeams: {},
        allTeams: {},
    },
    slice: {
        fetchPath: "",
        teams: [],
        page: 0,
        pageSize: 10,
        totalCount: 0,
    },
}
