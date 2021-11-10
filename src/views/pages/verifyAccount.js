import React from "react";
import { Button, Card, CardBody, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import ThankyouImg from "../../assets/img/logo/logo.png";
import _ from "lodash";
import "../../assets/scss/pages/authentication.scss";
import { verifyToken } from "../../redux/actions/auth/loginActions";

class verifyAccount extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      verify_token: []

    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("NP", nextProps.verify_token)
    console.log("PS", prevState.verify_token)
    if (nextProps.verify_token != "") {
      if (nextProps.verify_token != prevState.verify_token) {
        if (!nextProps.verify_token.status) {
          // alert("Expired");
          nextProps.history.push("/expired-link");
        }
      }
    }
    // else {
    //   alert("Expired 1234");
    // }

    return null;
  }

  componentDidMount() {
    var verify_token = this.props.match.params.token;

    this.props.verifyToken(verify_token);
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
                      Your Account has been verified successfully!
                    </p>

                    <Button.Ripple
                      color="primary"
                      type="button"
                      className="mt-1"
                      onClick={(e) => {

                        this.props.history.push("/patient");


                      }}
                    // onClick={(e) => this.props.logout()}
                    >
                      Click here to Login
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
  console.log(state)
  const { auth } = state;
  return {
    authentication: auth.login.login,
    verify_token: auth.login.verify_token,

  };
};
export default connect(mapStateToProps, { verifyToken })(verifyAccount);
