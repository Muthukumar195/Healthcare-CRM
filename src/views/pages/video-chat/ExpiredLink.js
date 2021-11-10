import React from "react";
import { Button, Card, CardBody, Row, Col } from "reactstrap";

import ThankyouImg from "../../../assets/img/logo/logo.png";
import "../../../assets/scss/pages/authentication.scss";

class ExpiredLink extends React.Component {
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
  componentDidMount() {
    console.log(this.props);
  }
  render() {
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
                    <h4>Link Expired!</h4>
                    <p>
                      This TeleVisit link has expired.
                      <br />
                      To connect, request a new link from the provider.
                    </p>

                    {/* <Button.Ripple
                      color="primary"
                      type="submit"
                      className="mt-1"
                      onClick={(e) => {
                        this.props.history.push("/login");
                      }}
                    >
                      Close
                    </Button.Ripple> */}
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
export default ExpiredLink;
