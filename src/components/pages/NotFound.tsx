import * as React from "react";
import {
    Grid,
    Card,
    CardContent,
    CardHeader,
    Typography,
    CardActions,
    Theme, useTheme
} from "@material-ui/core";
import NavButton from "../widgets/NavButton";
import {makeStyles} from "@material-ui/core/styles";
import {appStyleClasses} from "../appStyleClasses";
const useStyles = makeStyles((theme: Theme) => appStyleClasses(theme));

export default function NotFound() {
    const theme:Theme = useTheme();
    const classes = useStyles(theme);
    return (
        <Grid container className={classes.grid1Centered} >
            <Card >
                <CardHeader title={"How did I get here?"}>
                </CardHeader>
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            If you are here because of the problem with this site, please let us know!
                        </Typography>
                    </CardContent>
                <CardActions>
                    <NavButton label={"Home"} to={"/"} />
                </CardActions>
            </Card>
        </Grid>
    );
}

