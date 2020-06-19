import * as React from "react";
import {connect} from "react-redux";
import {Route} from "react-router-dom";

import {history, IRootState} from "../store";
import NotificationPopup, {AlertSeverity} from "../components/widgets/NotificationPopup";


interface IProps {
  exact?: boolean;
  isAuthenticated: boolean | null;
  path: string;
  component: React.ComponentType<any>;
}

function LoggedOutRoute ({component: Component,
                           isAuthenticated,
                           ...otherProps}: IProps)
{
  if (isAuthenticated === true) {
    history.push("/home");
    // alert("this is a logged out route, you are logged in, redirected to home page");
  }

  const notification = (isAuthenticated === true) ? (
      <NotificationPopup message={"You have logged out."} isOpen={true} duration={2500} severity={AlertSeverity.N_INFO}/>
  ) : null;

  return (
      <>
        {notification}
        <Route render={otherProps => ( <Component {...otherProps} /> )} />
      </>
  );
}

function mapStateToProps(state: IRootState)  {
  return { isAuthenticated: state.auth && state.auth.isAuthenticated === true};
}



export default connect(
  mapStateToProps
)(LoggedOutRoute);
