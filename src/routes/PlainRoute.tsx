import * as React from "react";
import {connect} from "react-redux";
import {Route} from "react-router-dom";

// import {AuthState} from "../auth/types";
import {history, IRootState} from "../store";
import NotificationPopup, {AlertSeverity} from '../components/widgets/NotificationPopup';

interface IProps {
    exact?: boolean;
    isAuthenticated: boolean | null;
    path: string;
    component: React.ComponentType<any>;
}

const PlainRoute = ({ component: Component,
                        isAuthenticated,
                        ...otherProps
                    }: IProps) => {
    return (
        <>
            <Route render={otherProps => (<Component {...otherProps} />)} />
        </>
    );
};

function mapStateToProps(state: IRootState)  {
    return { isAuthenticated: state.auth.isAuthenticated === true};
}

export default connect(
    mapStateToProps
)(PlainRoute);
