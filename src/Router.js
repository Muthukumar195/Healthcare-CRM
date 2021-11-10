import React, { Suspense, lazy } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import queryString from "query-string";
import { history } from "./history";
import { connect } from "react-redux";
import Spinner from "./components/@vuexy/spinner/Loading-spinner";
import { ContextLayout } from "./utility/context/Layout";
// Get all Auth methods
import {
  setAuthendicateUser,
  setAppointmentId,
} from "./redux/actions/auth/loginActions";
import { isUserAuthenticated, getUserRole } from "./components/Auth";


// Route-based code splitting
const Home = lazy(() => import("./views/pages/Home"));
const Patients = lazy(() => import("./views/pages/Patients"));
const Scheduling = lazy(() => import("./views/pages/scheduling/Scheduling"));
const MyProfile = lazy(() => import("./views/pages/MyProfile"));
const PatientProfile = lazy(() => import("./views/pages/PatientProfile"));
const ChangePassword = lazy(() => import("./views/pages/ChangePassword"));
const ForgotPassword = lazy(() => import("./views/pages/ForgotPassword"));
const PatientForgotPassword = lazy(() => import("./views/pages/patient/PatientForgotPassword"));
const ResetPassword = lazy(() => import("./views/pages/ResetPassword"));
const SendInvite = lazy(() => import("./views/pages/SendInvite"));
const DocumentationManagement = lazy(() => import("./views/pages/DocumentationManagement"));
const videoSessionLogs = lazy(() => import("./views/pages/videoSessionLogs"));
const AuditLogs = lazy(() => import("./views/pages/AuditLogs"));
const WaitingRoom = lazy(() => import("./views/pages/WaitingRoom"));
const Settings = lazy(() => import("./views/pages/Settings"));
const verifyAccount = lazy(() => import("./views/pages/verifyAccount"));
const verifyMobile = lazy(() => import("./views/pages/verifyMobile"));
const Help = lazy(() => import("./views/pages/Help"));
const VideoChat = lazy(() => import("./views/pages/video-chat/VideoChat"));
const ThankYou = lazy(() => import("./views/pages/video-chat/Thankyou"));
const ExpiredLink = lazy(() => import("./views/pages/video-chat/ExpiredLink"));
const Expired = lazy(() => import("./views/pages/Expired"));
const calendar = lazy(() => import("./views/calendar/Calendar"));
const PatientPreview = lazy(() => import("./views/pages/patient/PatientPreview"));
const PatientNewVisit = lazy(() => import("./views/pages/patient/PatientNewVisit"));
const PatientResetPassword = lazy(() => import("./views/pages/patient/PatientResetPassword"));
const EstablishedForm = lazy(() => import("./views/pages/EstablishedForm"));

const login = lazy(() => import("./views/pages/authentication/login/Login"));
const PatientLogin = lazy(() =>
  import("./views/pages/authentication/login/PatientLogin")
);
const PatientIntake = lazy(() => import("./views/pages/PatientIntake"));
const Register = lazy(() =>
  import("./views/pages/authentication/register/Register")
);
const SetPassword = lazy(() =>
  import("./views/pages/authentication/register/SetPassword")
);
const PatientScheduling = lazy(() => import("./views/pages/patient/PatientScheduling"));

const Payment = lazy(() => import("./views/pages/Payment"));
const authorized = lazy(() => import("./views/misc/NotAuthorized"))
const RegularIntake = lazy(() => import("./views/pages/RegularIntake"));
const MyAvailability = lazy(() => import("./views/pages/MyAvailability"));
const PatientVideoChat = lazy(() => import("./views/pages/video-chat/PatientVideoChat"));
// Set Layout and Component Using App Route
const RouteConfig = ({
  component: Component,
  fullLayout,
  permission,
  user,
  ...rest
}) => (
    <Route
      {...rest}
      render={(props) => {
        return (
          <ContextLayout.Consumer>
            {(context) => {
              let LayoutTag =
                fullLayout === true
                  ? context.fullLayout
                  : context.state.activeLayout === "horizontal"
                    ? context.horizontalLayout
                    : context.VerticalLayout;
              return (
                <LayoutTag {...props} permission={props.user}>
                  <Suspense fallback={<Spinner />}>
                    {isUserAuthenticated() === true ? (
                      <Component {...props} />
                    ) : (
                        <Redirect to="/doctor" />
                      )}
                  </Suspense>
                </LayoutTag>
              );
            }}
          </ContextLayout.Consumer>
        );
      }}
    />
  );
const PublicRoute = ({
  component: Component,
  fullLayout,
  permission,
  user,
  ...rest
}) => (
    <Route
      {...rest}
      render={(props) => {
        return (
          <ContextLayout.Consumer>
            {(context) => {
              let LayoutTag =
                fullLayout === true
                  ? context.fullLayout
                  : context.state.activeLayout === "horizontal"
                    ? context.horizontalLayout
                    : context.VerticalLayout;
              return (
                <LayoutTag {...props} permission={props.user}>
                  <Suspense fallback={<Spinner />}>
                    {isUserAuthenticated() === false ? (
                      <Component {...props} />
                    ) : (

                        <Redirect to={(getUserRole() == "patient") ? "/patient-intake" : "/send-invite"} />


                      )}
                  </Suspense>
                </LayoutTag>
              );
            }}
          </ContextLayout.Consumer>
        );
      }}
    />
  );

const CommonRoute = ({
  component: Component,
  fullLayout,
  permission,
  user,
  ...rest
}) => (
    <Route
      {...rest}
      render={(props) => {
        return (
          <ContextLayout.Consumer>
            {(context) => {
              let LayoutTag =
                fullLayout === true
                  ? context.fullLayout
                  : context.state.activeLayout === "horizontal"
                    ? context.horizontalLayout
                    : context.VerticalLayout;
              return (
                <LayoutTag {...props} permission={props.user}>
                  <Suspense fallback={<Spinner />}>
                    <Component {...props} />
                  </Suspense>
                </LayoutTag>
              );
            }}
          </ContextLayout.Consumer>
        );
      }}
    />
  );

const mapStateToProps = (state) => {
  return {
    user: state.auth.login,
  };
};
const AppRoute = connect(mapStateToProps)(RouteConfig);

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.props.setAuthendicateUser();
  }

  getRedirectRoute = () => {
    if (isUserAuthenticated()) {
      if (getUserRole() == "patient") {
        return "/patient-intake";
      } else {
        return "/send-invite";
      }
    } else {
      return "/send-invite";
    }
  };
  getAppointmentRedirectRoute = () => {
    if (isUserAuthenticated()) {
      if (getUserRole() == "patient") {
        return "/telescrubs/appointments/:token";
      } else {
        return "/doctor";
      }
    } else {
      console.log("RoutesProps", window.location.pathname.split("/")[3]);
      if (window.location.pathname.split("/")[3] != undefined) {
        this.props.setAppointmentId(window.location.pathname.split("/")[3]);
      }

      return "/patient";
    }
  };

  render() {
    return (
      // Set the directory path if you are deploying in sub-folder
      <Router history={history}>
        <Switch>
          <Redirect exact from="/" to={this.getRedirectRoute()} />
          {/* <AppRoute exact path="/" component={Home} />*/}
          <AppRoute path="/patients" component={Patients} />
          <AppRoute path="/scheduling" component={Scheduling} />
          <AppRoute path="/my-profile" component={MyProfile} />
          <AppRoute path="/patient-profile" component={PatientProfile} />
          <AppRoute path="/change-password" component={ChangePassword} />
          <AppRoute path="/send-invite" component={SendInvite} />
          <AppRoute path="/documentation-management" component={DocumentationManagement} />
          <AppRoute path="/video-session-logs" component={AuditLogs} />
          <AppRoute path="/audit-logs" component={AuditLogs} />
          <AppRoute path="/waiting-room" component={WaitingRoom} />
          <AppRoute path="/settings" component={Settings} />
          <AppRoute path="/patient-intake" component={PatientIntake} />
          <AppRoute path="/calendar" component={calendar} />
          {/*<AppRoute
            path="/telescrubs/televisit/:appointmentId"
            component={PatientNewVisit}
            fullLayout
            />  */}

          <AppRoute
            path="/patient-new-visit"
            component={PatientNewVisit}
            fullLayout
          />

          <Redirect
            exact
            from="/telescrubs/appointment/:token"
            to={this.getAppointmentRedirectRoute()}
          />
          <AppRoute
            path="/telescrubs/appointments/:token"
            component={RegularIntake}
          />
          <AppRoute
            path="/misc/not-authorized"
            component={authorized}
            fullLayout
          />

          <PublicRoute
            path="/help"
            component={Help}
            fullLayout
          />

          <AppRoute path="/patient-scheduling" component={PatientScheduling} />

          <PublicRoute path="/doctor" component={login} fullLayout />
          <AppRoute path="/my-availability" component={MyAvailability} />
          <PublicRoute path="/patient" component={PatientLogin} fullLayout />
          <PublicRoute path="/register" component={Register} fullLayout />
          <PublicRoute
            path="/set-password/:token"
            component={SetPassword}
            fullLayout
          />
          <PublicRoute
            path="/forgot-password"
            component={ForgotPassword}
            fullLayout
          />
          <PublicRoute
            path="/patient-forgot-password"
            component={PatientForgotPassword}
            fullLayout
          />
          <PublicRoute
            path="/reset-password/:token"
            component={ResetPassword}
            fullLayout
          />
          <PublicRoute
            path="/patient-reset-password/:token"
            component={PatientResetPassword}
            fullLayout
          />

          <PublicRoute
            path="/verify_email/:token"
            component={verifyAccount}
            fullLayout
          />
          <PublicRoute
            path="/verify_mobile/:token"
            component={verifyMobile}
            fullLayout
          />

          <CommonRoute
            path="/video-chat/:sessionId"
            component={VideoChat}
            fullLayout
          />
          <CommonRoute path="/video/thankyou" component={ThankYou} fullLayout />
          <CommonRoute
            path="/video/expired-link"
            component={ExpiredLink}
            fullLayout
          />
          <CommonRoute
            path="/expired-link"
            component={Expired}
            fullLayout
          />

          {/* <CommonRoute
            path="/telescrubs/appointment/:token"
            component={Payment}
            fullLayout
          /> */}

          <AppRoute path="/EstablishedForm" component={EstablishedForm} fullLayout />

          <AppRoute path="/patient-preview/:id/:appointmentId" component={PatientPreview} />


          <AppRoute
            path="/telescrubs/televisit/:token"
            component={PatientNewVisit}
            fullLayout
          />

        </Switch>
      </Router>
    );
  }
}

export default connect(mapStateToProps, {
  setAuthendicateUser,
  setAppointmentId,
})(AppRouter);
