// import * as React from "react";
// import {Query} from "material-table";

// This is for individual location.
import {getConfigParseResult} from "ts-loader/dist/config";

export type LocationType = {
    slug: string, // id
    name: string,
    address: string,
    phone: string | null,
    coordinates: string | null,
    description: string | null,
    googlemap_url: string | null,
    homepage: string | null,
};

// export const initialCriteria: Query<LocationType> = {pageSize: 10, page: 0, search: "", filters: [], orderBy: { field: 'name'}, orderDirection: "asc"};

// User's slice state
export interface LocationSliceState {
    fetchPath: string;
    page: number;
    pageSize: number;
    locations: string[]; // location slug
    totalCount: number;
}

// The store state.
export interface LocationEntityState {
    isFetching: boolean;
    fetchPath: string,
    page: number,
    keyedLocations: { [fetchPath: string]: LocationSliceState },
    allLocations: { [slug: string]: LocationType},
    errorMessage?: string;
}

// Since the list is a subset of entities, combine the state.
export interface LocationsState {
    entities: LocationEntityState;
    slice: LocationSliceState;
}

// export const initialCriteria: Query<LocationType> = {pageSize: 10, page: 0, search: "", filters: [], orderBy: { field: 'name'}, orderDirection: "asc"};

export const initLocationState : LocationsState = {
    entities: {
        isFetching: false,
        fetchPath: "",
        page: 0,
        errorMessage: undefined,
        keyedLocations: {},
        allLocations: {},
    },
    slice: {
        fetchPath: "",
        locations: [],
        page: 0,
        pageSize: 10,
        totalCount: 0,
    },
}
