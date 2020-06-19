import * as React from "react";
import {
    Grid,
    Card,
    CardContent,
    CardActionArea,
    CardHeader,
    Typography,
    CardActions,
    CardMedia,
    Theme, useTheme
} from "@material-ui/core";
import NavButton from "../widgets/NavButton";
import {makeStyles} from "@material-ui/core/styles";
import {appStyleClasses} from "../appStyleClasses";
const useStyles = makeStyles((theme: Theme) => appStyleClasses(theme));

export default function Landing() {
    const theme:Theme = useTheme();
    const classes = useStyles(theme);
    return (
        <Grid container className={classes.grid1Centered} >
            <Card style={ {maxWidth: "800px"}}>
                <CardHeader title={"Meet App"}>

                </CardHeader>
                <CardMedia
                    component="img"
                    alt="Tennis court"
                    height="140"
                    image="/static/images/siteimage1.jpg"
                    title="Site Image"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Welcome!
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        The Meet App is for organizing the team meets and practice sessions. Tai created the site
                        to help my teams. If you find the app helpful, send me kudos on my way!
                    </Typography>
                </CardContent>
                <CardActions>
                    <NavButton label={"Go To Login"} to={"/login"} />
                    <NavButton label={"Account Sign Up"} to={"/signup"} />
                </CardActions>
            </Card>
        </Grid>
    );
}

