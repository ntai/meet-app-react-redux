import {
    MEET_FETCH_CLEAR,
    MEET_FETCH_START,
    MEET_FETCH_SUCCESS,
    MEET_FETCH_FAILURE,
    MeetActions,
    MeetFetchSuccessAction, generateQueryStringFromCriteria
} from "./actions";
import {MeetType, MeetsState, initMeetState} from "./types";
// import {act} from "react-dom/test-utils";

/* */
export default function meetReducer( state: MeetsState = initMeetState,
                                     action: MeetActions) : MeetsState
{
    switch (action.type) {
        case MEET_FETCH_CLEAR:
            return Object.assign({}, state, {
                entities: Object.assign( {}, state.entities,
                    {
                        keyedMeets: {},
                        isFetching: false,
                        fetchPath: "",
                        page: 0,
                        errorMessage: undefined},),
                slice: {
                    meets: [],
                    fetchPath: "",
                },
            });

        case MEET_FETCH_START:
            const qs = generateQueryStringFromCriteria(action.criteria);
            console.log(`action ${qs} page: ${action.criteria && action.criteria.page ? action.criteria.page : "none"}`)
            return Object.assign({}, state, {
                entities: Object.assign({}, state.entities,
                    {
                        isFetching: true,
                        fetchPath: qs,
                        page: action.criteria.page,
                        errorMessage: undefined},),
            });

        case MEET_FETCH_SUCCESS:
            const myAction : MeetFetchSuccessAction = action;
            // const meets = myAction.meets;
            const fetchPath = state.entities.fetchPath;

            const masterStorage = Object.assign( {},
                state.entities.allMeets,
                myAction.meets.map( (meet : MeetType) => { return {[meet.slug] : meet}}),
            );

            const storage = Object.assign( {}, state.entities.keyedMeets, { [fetchPath]: {
                    fetchPath: fetchPath,
                    meets: myAction.meets.map( loc => loc.slug ),
                    page: myAction.criteria.page,
                    pageSize: myAction.criteria.pageSize,
                    totalCount: myAction.totalCount,
                }});

            const totalCount = myAction.totalCount;
            return Object.assign({}, state, {
                entities: Object.assign( {}, state.entities,
                    {
                        isFetching: false,
                        fetchPath: "",
                        keyedMeets: storage,
                        page: myAction.criteria.page,
                        errorMessage: undefined,
                        allMeets: masterStorage,
                    },),
                slice: {
                    fetchPath: fetchPath,
                    meets: myAction.meets,
                    page: myAction.criteria.page,
                    pageSize: myAction.criteria.pageSize,
                    totalCount: totalCount
                },
            });

        case MEET_FETCH_FAILURE:
            return Object.assign({}, state, {
                entities: Object.assign( {}, state.entities,
                    {
                        fetchPath: "",
                        isFetching: false,
                        errorMessage: action.reason},),
                slice: {
                    fetchPath: "",
                    meets: [],
                },
            },);
    }
    return state;
}
