import * as React from "react";
import { connect } from "react-redux";

import { doLogout, makeLogout } from "../../store/auth/actions";

interface IProps {
  logOutConnect: () => void;
}

const LogOut = ({ logOutConnect }: IProps) => (
  <>
    <p>Logout page</p>
    <button onClick={logOutConnect}>log me out</button>
  </>
);

const mapDispatchToProps = {
  logOutConnect: makeLogout
};

export default connect(
  null,
  mapDispatchToProps,
)(LogOut);
