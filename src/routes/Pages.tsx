import * as React from "react";
// import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";

import About from "../components/pages/About";
import Home from "../components/pages/Home";
import Landing from "../components/pages/Landing";
import LogIn from "../components/pages/LogIn";
import LogOut from "../components/pages/LogOut";
import NotFound from "../components/pages/NotFound";
import Terms from "../components/pages/Terms";

import LoggedInRoute from "../routes/LoggedInRoute";
import LoggedOutRoute from "../routes/LoggedOutRoute";
import Locations from "../components/pages/locations/Locations";
import Teams from "../components/pages/teams/Teams";

import PlainRoute from "./PlainRoute";

import Meet from "../components/pages/meets/Meet";

export default function Pages() {
    return (
        <Switch>
            <LoggedOutRoute path="/" exact={true} component={Landing} />
            <LoggedOutRoute path="/about" exact={true} component={About} />
            <LoggedOutRoute path="/login" exact={true} component={LogIn} />

            <LoggedInRoute path="/logout" exact={true} component={LogOut} />
            <LoggedInRoute path="/home" exact={true} component={Home} />
            <LoggedInRoute path="/meet" exact={false} component={Meet} />
            <LoggedInRoute path="/locations" exact={true} component={Locations} />
            <LoggedInRoute path="/teams" exact={true} component={Teams} />
            <PlainRoute path="/terms" exact={true} component={Terms} />

            <Route component={NotFound} />
    </Switch>
  );
};
