import * as React from "react";
import {Button, Theme, Typography, useTheme} from "@material-ui/core";
import { NavLink } from 'react-router-dom'
import {makeStyles} from "@material-ui/core/styles";
import {appStyleClasses} from "../appStyleClasses";

const useStyles = makeStyles((theme: Theme) => appStyleClasses(theme));

interface INavButton {
    to: string;
    label: string;
}

export default function NavButton({to, label, ...otherProps} : INavButton) {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <NavLink to={to} className={classes.navlink}>
            <Button {...otherProps}>
                {label}
            </Button>
        </NavLink>
    )
}
