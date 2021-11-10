import React from "react";
import { Button, Card, CardBody, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { logout } from "../../../redux/actions/auth/loginActions";
import ThankyouImg from "../../../assets/img/logo/logo.png";
import "../../../assets/scss/pages/authentication.scss";
import { getLoggedInToken, getUserRole } from "../../../components/Auth";

class Thankyou extends React.Component {
  state = {
    activeTab: "1",
    email: "",
    password: "",
  };
  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };


  isDoctor = () => {
    if (getLoggedInToken()) {
      return (getUserRole() == "admin") ? true : false;
    } else {
      return false;
    }

  };


  componentDidMount() {
    console.log(this.props);
  }

  render() {
    const { user } = this.props;
    return (
      <Row className="m-0 justify-content-center">
        <Col
          sm="8"
          xl="8"
          lg="10"
          md="8"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication thankyou rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center px-1 py-0"
              >
                <img src={ThankyouImg} alt="loginImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 pl-2 pt-4 pb-4">
                  <CardBody>
                    <h4>Thank You</h4>
                    <p>
                      TeleVisit session ended.
                      <br />
                      Thank you for using TeleScrubs!
                    </p>

                    <Button.Ripple
                      color="primary"
                      type="submit"
                      className="mt-1"
                      onClick={(e) => {
                        if (this.isDoctor()) {
                          this.props.history.push("/doctor");
                        } else {
                          this.props.history.push("/patient");

                        }

                      }}
                    // onClick={(e) => this.props.logout()}
                    >
                      Close
                    </Button.Ripple>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}

//export default Thankyou;

const mapStateToProps = (state) => {
  const { auth } = state;
  return {
    authentication: auth.login.login,
    userRole: auth.login.userRole,
  };
};
export default connect(mapStateToProps, { logout })(Thankyou);
