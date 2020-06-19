import * as React from "react";
import {NavLink} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {makeStyles} from "@material-ui/core/styles";
import {Theme, useTheme} from "@material-ui/core";
import {appStyleClasses} from "../appStyleClasses";
const useStyles = makeStyles((theme: Theme) => appStyleClasses(theme));

interface ILILProps{
    to: string;
    itemKey: string;
    icon: React.ComponentElement<any, any> | null;
    text: string;
}

export default function ListItemLink( {to, itemKey, icon, text} : ILILProps) {
    const theme = useTheme();
    const classes = useStyles(theme);

    if (icon === null) {
        return <NavLink to={to} className={classes.navlink}>
            <ListItem button key={itemKey}>
                <ListItemText>{text}</ListItemText>
            </ListItem>
        </NavLink>
    }
    return <NavLink to={to}  className={classes.navlink}>
        <ListItem key={itemKey}>
            <Button className={classes.menuButton}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText>{text}</ListItemText>
            </Button>
        </ListItem></NavLink> ;
}
