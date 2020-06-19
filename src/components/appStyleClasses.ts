import {Theme, createStyles} from "@material-ui/core/styles";
// import {StyleRules} from "@material-ui/styles/withStyles";

export const drawerWidth = 240;

export const appStyleClasses = ({spacing, transitions, mixins, breakpoints}: Theme) =>
    createStyles( {
        alert: {
            width: '100%',
            '& > * + *': {
                marginTop: spacing(2),
            },
        },

        appBar: {
            transition: transitions.create(['margin', 'width'], {
                easing: transitions.easing.sharp,
                duration: transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: transitions.create(['margin', 'width'], {
                easing: transitions.easing.easeOut,
                duration: transitions.duration.enteringScreen,
            }),
        },

        content: {
            flexGrow: 1,
            padding: spacing(3),
            transition: transitions.create('margin', {
                easing: transitions.easing.sharp,
                duration: transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: transitions.create('margin', {
                easing: transitions.easing.easeOut,
                duration: transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },

        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },

        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: spacing(0, 1),
            // necessary for content to be below app bar
            ...mixins.toolbar,
            justifyContent: 'flex-end',
        },

        grid1Centered: {
            alignItems: "center",
            flexFlow: "column",
        },

        grow: {
            flexGrow: 1,
        },

        hide: {
            display: 'none',
        },

        menuButton: {
            marginRight: spacing(2),
            textAlign: "left",
        },

        navlink: {
            color: '#039be5',
            textDecoration: 'none',
        },

        root: {
            display: 'flex',
        },

        sectionDesktop: {
            display: 'none',
            [breakpoints.up('md')]: {
                display: 'flex',
            },
        },
        sectionMobile: {
            display: 'flex',
            [breakpoints.up('md')]: {
                display: 'none',
            },
        },

        table: {
            minWidth: 500,
        },

        tablePagination: {
            flexShrink: 0,
            marginLeft: spacing(2.5),
        },

        title: {
            display: 'none',
            [breakpoints.up('sm')]: {
                display: 'block',
            },
        },
    });
