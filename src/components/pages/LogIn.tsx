import * as React from "react";
import {useState} from "react";
import {connect} from "react-redux";

import {requestLogin} from "../../store/auth/actions";
// import FormControl from "@material-ui/core/FormControl";
import {Button, Card, Checkbox, FormControlLabel, Grid, TextField, Theme, useTheme} from '@material-ui/core';
import {Face, Fingerprint} from '@material-ui/icons'
import {makeStyles} from "@material-ui/core/styles";
import {appStyleClasses} from "../appStyleClasses";
import NotificationPopup, {AlertSeverity} from "../widgets/NotificationPopup";
import {IRootState} from "../../store";

interface IProps {
    logInConnect: ( username: string, password: string, remeberMe: boolean ) => void;
    errorMessage?: string | null;
}

const useStyles = makeStyles((theme: Theme) => appStyleClasses(theme));

function LogIn({ logInConnect, errorMessage }: IProps) {
    const [cred, setCred] = useState( {username: "", password: "", rememberMe: false} );
    const theme:Theme = useTheme();
    const classes = useStyles(theme);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.id === "rememberMe") {
            const newValue = cred.rememberMe ? false : true;
            setCred({...cred, rememberMe: newValue });
        }
        else {
            setCred({...cred, [event.target.id]: event.target.value});
        }
    }

    function doLogin() {
        logInConnect(cred.username, cred.password, cred.rememberMe);
    }

    const notification = errorMessage !== null && errorMessage ?
        (<NotificationPopup message={errorMessage} isOpen={true} duration={3000} severity={AlertSeverity.N_ERROR}/>)
        :
        null;

    return (
        <Grid container className={classes.grid1Centered} >
        <Card style={{ width: "700px"}}>
            <Grid container spacing={2} alignItems="flex-end">
                <Grid item><Face /> </Grid>
                <Grid item md={true} sm={true} xs={true}>
                    <TextField id="username" label="Username" type="email" fullWidth autoFocus required onChange={handleChange} />
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="flex-end">
                <Grid item> <Fingerprint /> </Grid>
                <Grid item md={true} sm={true} xs={true}>
                    <TextField id="password" label="Password" type="password" fullWidth required onChange={handleChange}/>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justify="space-between">
                <Grid item>
                    <FormControlLabel control={<Checkbox color="primary" id={"rememberMe"} onChange={handleChange} disabled={cred.password.length < 8 || cred.username === ""} />} label="Remember me" id={"rememberMe"} />
                </Grid>
                <Grid item>
                    <Button disableFocusRipple disableRipple style={{ textTransform: "none" }} variant="text" color="primary">Forgot password ?</Button>
                </Grid>
            </Grid>
            <Grid container justify="center" style={{ marginTop : '10px', marginBottom: '10px' }}>
                <Grid item style={{ margin: '10px'}}>
                    <Button disabled={cred.password.length < 8 || cred.username === ""} variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={doLogin}>Login</Button>
                </Grid>
                <Grid item style={{ margin: '10px'}}>
                    <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={doLogin}>Account Sign Up</Button>
                </Grid>
            </Grid>
        </Card>
            {notification}
        </Grid>
    );
}

function mapStateToProps (state:IRootState)
{
    return { errorMessage: state.auth.reason };
}

const mapDispatchToProps = {
  logInConnect: requestLogin
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LogIn);
