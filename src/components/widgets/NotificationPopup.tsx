import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {appStyleClasses} from "../appStyleClasses";

const useStyles = makeStyles((theme: Theme) => appStyleClasses(theme));


function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export enum AlertSeverity {
    N_SUCCESS = "success",
    N_ERROR = "error",
    N_WARNING = "warning",
    N_INFO = "info",
}

interface INotificationPopup {
    message: string;
    isOpen: boolean;
    duration: number;
    severity: AlertSeverity;
}

export default function NotificationPopup({ message, isOpen, duration, severity } : INotificationPopup) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(isOpen);

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <div className={classes.alert}>
            <Snackbar open={open} autoHideDuration={duration} onClose={handleClose} anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}>
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
