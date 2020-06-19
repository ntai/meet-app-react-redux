import {combineReducers, applyMiddleware, compose, createStore} from "redux";
import thunkMiddleware from "redux-thunk-recursion-detect";
import { createBrowserHistory } from 'history';
// import createLogger from 'redux-logger';
// Create browser history to use in the Redux store
import { connectRouter} from "connected-react-router";
import authReducer  from "./auth/reducer";
import {AuthState, initAuthState} from "./auth/types";
import locationReducer from "./locations/reducer";
import {LocationsState, initLocationState} from "./locations/types";
import meetReducer from "./meets/reducer";
import teamReducer from "./teams/reducer";
import usersReducer from "./users/reducer";

import {MeetsState, initMeetState} from "./meets/types";
// import {apiMiddleware} from 'redux-api-middleware';
import {initTeamState, TeamsState} from "./teams/types";
import {createRefreshMiddleware} from "./apiHelpers";
import {apiMiddleware} from "redux-api-middleware";
import {initUsersState, UsersState} from "./users/types";

/* Browser History */
const baseElem = document.getElementsByTagName('base')[0];
const baseUrl = baseElem ? baseElem.getAttribute('href') as string : '';

export const history = createBrowserHistory({ basename: baseUrl });

export type IRootState = {
    router: any;
    auth: AuthState;
    locations: LocationsState;
    meets: MeetsState;
    teams: TeamsState;
    users: UsersState;
}

const rootReducer = combineReducers( {
    router: connectRouter(history),
    auth: authReducer,
    locations: locationReducer,
    meets: meetReducer,
    teams: teamReducer,
    users: usersReducer,
});

const initRootState = {
    router: undefined,
    auth: initAuthState,
    locations: initLocationState,
    meets: initMeetState,
    teams: initTeamState,
    users: initUsersState,
}

const refreshMiddleware = createRefreshMiddleware();

let composeEnhancers;
if (process.env.NODE_ENV !== "production" && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
} else {
    composeEnhancers = compose;
};

const store = createStore(
    rootReducer,
    initRootState,
    composeEnhancers(
        applyMiddleware(thunkMiddleware),
        /*
        applyMiddleware(promiseMiddleware),
        applyMiddleware(sagaMiddleware),
         */
        // applyMiddleware(refreshMiddleware),
        applyMiddleware(apiMiddleware),
    ),
);

/* sagaMiddleware.run(rootSaga); */

export default store;
