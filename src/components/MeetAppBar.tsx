import React from 'react';
import {makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import clsx from "clsx";
import {appStyleClasses} from "./appStyleClasses";
import {AuthState} from "../store/auth/types";
import {connect} from "react-redux";
import {IRootState} from "../store";
// import {constants} from "crypto";
// import ENGINE_METHOD_NONE = module;

interface MeetAppBarInterface {
    openNav: (event: React.MouseEvent<HTMLElement>) => void;
    open: boolean;
    isAuthenticated: boolean;
}

const useStyles = makeStyles((theme: Theme) => appStyleClasses(theme));

function MeetAppBar( {isAuthenticated, ...other} : MeetAppBarInterface) {
    const n_notifications = 0;
    const theme = useTheme();
    const classes = useStyles(theme);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';

    const accountMenuItems = (isAuthenticated ? (
        [
            <MenuItem onClick={handleMenuClose} key={"profile"}>Profile</MenuItem>,
            <MenuItem onClick={handleMenuClose} key={"account"}>My account</MenuItem>
        ]
        ) : (
        [
            <MenuItem onClick={handleMenuClose} key={"login"}>Log In</MenuItem>,
            <MenuItem onClick={handleMenuClose} key={"signup"}>Account Sign Up</MenuItem>
        ]
    ));

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {accountMenuItems}
        </Menu>
    );

    const notifIconButton = (isAuthenticated) ?
        <IconButton aria-label="show {n_notifications} new notifications" color="inherit">
            <Badge badgeContent={n_notifications} color="secondary">
                <NotificationsIcon />
            </Badge>
        </IconButton>
        : null;

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const mobileAccountMenu = isAuthenticated ? ( [
            <MenuItem key={"notifications"}>
                {notifIconButton}
                <p>Notifications</p>
            </MenuItem>,
            <MenuItem onClick={handleProfileMenuOpen} key={"profilemenu"}>
                <IconButton   aria-label="account of current user"
                              aria-controls="primary-search-account-menu"
                              aria-haspopup="true"
                              color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        ]
    ):(
        [
            <MenuItem key={"login2"}>
                <IconButton   aria-label="account of current user"
                              aria-controls="primary-search-account-menu"
                              aria-haspopup="true"
                              color="inherit"
                >
                <AccountCircle />
                </IconButton>
                <p>Login</p>
            </MenuItem>,

            <MenuItem key={"signup2"}>
                <IconButton   aria-label="account of current user"
                              aria-controls="primary-search-account-menu"
                              aria-haspopup="true"
                              color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Account Sign Up</p>
            </MenuItem>
        ]);

    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {mobileAccountMenu}
        </Menu>
    );

/*
    const messages =  (
        <IconButton aria-label="show 0 new mails" color="inherit">
            <Badge badgeContent={0} color="secondary">
                <MailIcon />
            </Badge>
        </IconButton>
    );
*/

    const accountMenu =
            <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>;

    return (
        <React.Fragment>
            <AppBar position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: other.open,
                    })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={other.openNav}
                        edge="start"
                        className={clsx(classes.menuButton, other.open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography className={classes.title} variant="h6" noWrap>
                        Meet App
                    </Typography>

                    <div className={classes.grow} />

                    <div className={classes.sectionDesktop}>
                        {notifIconButton}
                        {accountMenu}
                    </div>

                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </React.Fragment>
    );
}

function mapStateToProps (state: IRootState ) : {isAuthenticated: boolean} {
    return {
        isAuthenticated: state.auth && state.auth.isAuthenticated === true,
    }
}

export default connect(mapStateToProps,)(MeetAppBar);
