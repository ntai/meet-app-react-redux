import * as React from "react";
import NotificationPopup, {AlertSeverity} from "./NotificationPopup";
import {useAPIError} from "../../helpers/APIErrorProvider";

export default function APIErrorNotification()
{
    const { errorState, removeError } = useAPIError();
    const handleSubmit = () => {
        removeError();
    };

    const notification = (errorState !== null) ? (
        <NotificationPopup message={errorState.message} isOpen={true} duration={5000} severity={AlertSeverity.N_INFO}/>
    ) : null;

    return (<div style={{top: "100px"}}>
            {notification}
        </div>
    );
}
