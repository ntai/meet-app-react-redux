import * as React from "react";
import {connect, useStore} from "react-redux";
import { Route, Router } from "react-router-dom";
import Nav from "./components/Nav";
import Pages from "./routes/Pages";
// import { checkAuthentication } from "./actions/current";
import clsx from 'clsx';
import {useTheme, Theme, Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import { history } from './store';
import {appStyleClasses, drawerWidth} from "./components/appStyleClasses";
import {checkAuthentication} from "./store/auth/actions";

import APIErrorProvider from "./helpers/APIErrorProvider";
import APIErrorNotification from "./components/widgets/APIErrorNotification";
import {ReactNode} from "react";

const useStyles = makeStyles((theme: Theme) => appStyleClasses(theme));

function AppFrame()
{
    const [drawerIsOpen, setDrawerIsOpen] = React.useState(true);

    //
    const handleDrawerOpen = () => { setDrawerIsOpen(true); };
    const handleDrawerClose = () => { setDrawerIsOpen(false); };

    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <React.Fragment>
            <Nav drawerIsOpen={drawerIsOpen} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose}/>
            <main className={clsx(classes.content, {[classes.contentShift]: drawerIsOpen, })} >
                <div className={classes.drawerHeader} />
                <Route component={Pages} />
                <APIErrorNotification/>
            </main>
        </React.Fragment>
    );
}

function RoutedApp()
{
    return (
        <React.Fragment>
            <Router history={history}>
                <AppFrame />
            </Router>
        </React.Fragment>
    );
}

interface IApp {
    checkAuth: () => void;
}

function App( {checkAuth} : IApp )
{
    React.useEffect(() => {checkAuth();}, []);

    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <>
            <CssBaseline/>
            <div className={classes.root}>
                <APIErrorProvider children={<RoutedApp/>} />
            </div>
        </>
    );
}

const mapDispatchToProps = { checkAuth: checkAuthentication };

export default connect(
    null,
    mapDispatchToProps,
)(App);
