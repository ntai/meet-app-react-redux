
export interface UserType {
    username: string; // username (login name)
    id: number;
    fullname: string;
    isSuperuser: boolean;
    isStaff: boolean;
    email: string;
    avatar: string; // url
    phone: string;
    sms: string;
    address: string;
}

// User's slice state
export interface UsersSliceState {
    fetchPath: string;
    page: number;
    pageSize: number;
    users: string[]; // location username
    totalCount: number;
}

// The store state.
export interface UsersEntityState {
    isFetching: boolean;
    fetchPath: string,
    page: number,
    keyedUsers: { [fetchPath: string]: UsersSliceState },
    allUsers: { [username: string]: UserType},
    errorMessage?: string;
}

// Since the list is a subset of entities, combine the state.
export interface UsersState {
    entities: UsersEntityState;
    slice: UsersSliceState;
    currentUser: string | null;
}

// export const initialCriteria: Query<UsersType> = {pageSize: 10, page: 0, search: "", filters: [], orderBy: { field: 'name'}, orderDirection: "asc"};

export const initUsersState : UsersState = {
    entities: {
        isFetching: false,
        fetchPath: "",
        page: 0,
        errorMessage: undefined,
        keyedUsers: {},
        allUsers: {},
    },
    slice: {
        fetchPath: "",
        users: [],
        page: 0,
        pageSize: 10,
        totalCount: 0,
    },
    currentUser: null,
}
