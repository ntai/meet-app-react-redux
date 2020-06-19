import * as React from "react";
import {connect, useStore} from "react-redux";
import { NavLink } from "react-router-dom";

import {AuthState} from "../store/auth/types";

import {useTheme, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from "@material-ui/core/Drawer";
import {appStyleClasses, drawerWidth} from "./appStyleClasses";
import HomeIcon from '@material-ui/icons/Home';
import EventIcon from '@material-ui/icons/Event';
import TeamIcon from '@material-ui/icons/Group';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockCloseIcon from '@material-ui/icons/Lock';
import PlaceIcon from '@material-ui/icons/Place';
import InfoIcon from '@material-ui/icons/Info';
import MessageIcon from '@material-ui/icons/Message';
import NotesIcon from '@material-ui/icons/Notes';
import ListItemLink from "./widgets/ListItemLink";
import MeetAppBar from "./MeetAppBar";
import {IRootState} from "../store";
const useStyles = makeStyles((theme: Theme) => appStyleClasses(theme));


interface NavStateProps {
    inProgress: boolean;
    isAuthenticated: boolean;
    username: string | null;
}

interface IProps {
    inProgress: boolean;
    isAuthenticated: boolean;
    username: string | null;

    drawerIsOpen: boolean;
    handleDrawerOpen: () => void;
    handleDrawerClose: () => void;
}

function mapStateToProps (state: IRootState ) : NavStateProps {
    return {
        inProgress: state.auth && state.auth.inProgress === true,
        username: state.auth && state.auth.username || "",
        isAuthenticated: state.auth && state.auth.isAuthenticated === true,
    }
};


function LogInMenuLinks( {isAuthenticated, }: NavStateProps )
{
    if (isAuthenticated) {
        return (<ListItemLink to={"/logout"} itemKey={"logout"} icon={<LockCloseIcon />} text={"Log out"}/>);
    }
    return (<ListItemLink to={"/login"} itemKey={"login"} icon={<LockOpenIcon />} text={"Log in"} />);
}

// const LogInOutMenu = connect(mapStateToProps, )(LogInMenuLinks);

function MainMenuLinks ( {isAuthenticated, }: NavStateProps )
{
    if (isAuthenticated) {
        return (
            <>
                <ListItemLink to={"/home"} itemKey={"home"} icon={<HomeIcon/>} text={"Home"}/>
                <ListItemLink to={"/meets"} itemKey={"meets"} icon={<EventIcon/>} text={"Meets"}/>
                <ListItemLink to={"/teams"} itemKey={"teams"} icon={<TeamIcon/>} text={"Teams"}/>
                <ListItemLink to={"/locations"} itemKey={"locations"} icon={<PlaceIcon/>} text={"Locations"}/>
            </>
            );
    }
    return (
        <>
            <ListItemLink to={"/"} itemKey={"landing"} icon={<MessageIcon/>} text={"Landing"}/>
            <ListItemLink to={"/about"} itemKey={"about"} icon={<InfoIcon/>} text={"About Meet App"}/>
        </>
    );
}

// const MainMenu = connect(mapStateToProps, )(MainMenuLinks);

function Navi ({ drawerIsOpen, handleDrawerOpen, handleDrawerClose, inProgress, isAuthenticated, username}: IProps) {
    const theme = useTheme();
    const classes = useStyles(theme);

    console.log( "Navi: isAuth " + isAuthenticated ) ;

    return (
        <>
            <MeetAppBar openNav={handleDrawerOpen} open={drawerIsOpen}/>

            <Drawer className={classes.drawer} variant="persistent" anchor="left" open={drawerIsOpen} classes={{ paper: classes.drawerPaper, }} >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <MainMenuLinks username={username} inProgress={inProgress} isAuthenticated={isAuthenticated} />
                    <Divider />
                    <ListItemLink to={"/terms"} itemKey={"terms"} icon={<NotesIcon/>} text={"Terms"}/>
                    <LogInMenuLinks username={username} inProgress={inProgress} isAuthenticated={isAuthenticated} />
                </List>
            </Drawer>
        </>
    );
};

const Nav = connect(mapStateToProps, )(Navi);
export default Nav;
