import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import _ from 'lodash'
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  FormGroup,
  Input,
  Label,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container
} from "reactstrap";
import { Mail, Lock, Check, Facebook, Twitter, GitHub } from "react-feather";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Spinner } from "reactstrap";
import { loginValidation } from "../../../../components/FormValidation";
import { login } from "../../../../redux/actions/auth/loginActions";
import { history } from "../../../../history";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import loginImg from "../../../../assets/img/logo/logo.png";
import "../../../../assets/scss/pages/authentication.scss";
import config from '../../../../configs/index'
import { ToastError } from "../../../../components";
import { ChevronDown, Search, Eye, EyeOff } from "react-feather";
import moment from "moment";
import ReactGA from 'react-ga';
import ModalSearch from "../../ModalSearch";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.formikActions = {};
    this.state = {
      collapsed: true,
      password: false,
      modal: false,
    }
  }

  showPassword = () => {
    this.setState({
      password: !this.state.password
    })
  }
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    })
  }
  componentDidMount() {
    ReactGA.initialize('UA-178429292-2');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  componentDidUpdate(prevProps) {
    if (this.props.authentication.login != prevProps.authentication.login) {
      if (!this.props.authentication.login.status) {
        ToastError(this.props.authentication.login.message);
        if (!_.isEmpty(this.formikActions)) {
          this.formikActions.setSubmitting(false);
          this.formikActions.setFieldValue("password", "");
          this.formikActions.setFieldTouched("password", false);
        }
      }
    }



  }

  submitButton = (button, isSubmitting) => {
    if (isSubmitting) {
      return (
        <Fragment>
          <Spinner color="white" size="sm" />
          <span className="ml-50">Loading...</span>
        </Fragment>
      );
    }
    return button;
  };

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="custom-navbar-dark" data-test="headerComponent">
          <Navbar color="dark" dark expand="md" sticky="top">
            <NavbarBrand href={config.webBaseUrl}>
              <img
                src={loginImg}
                alt="loginImg"
                width="165"
                className="d-inline-block align-middle"
                data-test="logoIMG" />
            </NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} />
            <Collapse navbar isOpen={!this.state.collapsed}>
              <Nav className="ml-auto" navbar>
                <NavItem><NavLink href={config.webBaseUrl}>Home</NavLink></NavItem>
                <NavItem><NavLink href={config.webBaseUrl + '/online-doctor/'}>Online Doctor</NavLink></NavItem>
                <NavItem><NavLink href={config.webBaseUrl + '/patient-journey/'}>Patient Journey</NavLink></NavItem>
                <NavItem>
                  <NavLink href={config.webBaseUrl + '/provider-journey/'}>Provider Journey<ChevronDown size={15} className="ml-50" /></NavLink>
                  <Nav>
                    <NavItem>
                      <NavLink href={config.webBaseUrl + '/pricing/'}>Pricing</NavLink>
                    </NavItem>
                  </Nav>
                </NavItem>
                <NavItem><NavLink href={config.webBaseUrl + '/hospitals/'}>Hospitals</NavLink></NavItem>
                <NavItem><NavLink href={config.webBaseUrl + '/health-plans/'}>Health Plans</NavLink></NavItem>
                <NavItem><NavLink href="/doctor">Doctor Sign In</NavLink></NavItem>
                <NavItem><NavLink href="/patient">Patient Sign In</NavLink></NavItem>
                {this.state.modal == false ? <NavItem><NavLink onClick={this.toggle}  ><Search size={15} className="search-icon" /></NavLink></NavItem> : ''}
              </Nav>
            </Collapse>
          </Navbar>
        </div>
        {this.state.modal ? <ModalSearch modal={this.state.modal} toggle={this.toggle} /> : ''}

        <Row className="m-0 justify-content-center">
          <Col
            sm="8"
            xl="8"
            lg="10"
            md="8"
            className="d-flex justify-content-center"
          >
            <Card className="bg-authentication login-card rounded-0 w-100">
              <Row className="m-0">
                <Col
                  lg="6"
                  className="d-lg-block d-none text-center align-self-center px-1 py-0"
                >
                  <a href={config.webBaseUrl} target="_blank"><img src={loginImg} alt="loginImg" /></a>
                </Col>
                <Col lg="6" md="12" className="p-0">
                  <Card className="rounded-0 mb-0 pl-4 pr-4 pt-5 pb-0">
                    <CardBody>
                      <h4>Login</h4>
                      <p>Please login to proceed.</p>
                      <Formik
                        initialValues={{
                          username: "",
                          password: "",
                        }}
                        validationSchema={loginValidation}
                        onSubmit={(values, actions) => {
                          console.log(values);
                          this.formikActions = actions;
                          values.timeZone = moment.tz.guess();
                          this.props.login(values);
                          //actions.setSubmitting(false);
                        }}
                      >
                        {({ errors = {}, values, setFieldValue, touched, isSubmitting, getFieldProps }) => (
                          <Form data-test="loginForm">
                            <FormGroup className="form-label-group position-relative has-icon-left">
                              <Field
                                type="text"
                                placeholder="Your Username"
                                name="username"
                                id="username"
                                className={`form-control text-lowercase ${
                                  errors.username &&
                                  touched.username &&
                                  "is-invalid"
                                  }`}
                                onBlur={() => {
                                  setFieldValue("username", _.toLower(values.username.trim()))
                                }
                                }
                                onFocus={() => {
                                  this.setState({
                                    password: false,
                                  })
                                }}
                                autoFocus
                              />
                              <ErrorMessage
                                name="username"
                                component="div"
                                className="invalid-tooltip mt-25"
                              />
                              <div className="form-control-position">
                                <Mail size={15} />
                              </div>
                            </FormGroup>
                            <FormGroup className="form-label-group position-relative has-icon-left">
                              <Field
                                type={this.state.password ? 'text' : 'password'}
                                placeholder="Your Password"
                                name="password"
                                id="password"
                                className={`form-control ${
                                  errors.password &&
                                  touched.password &&
                                  "is-invalid"
                                  }`}

                              />
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="invalid-tooltip mt-25"
                              />
                              <div className="form-control-position">
                                <Lock size={15} />
                              </div>
                              {getFieldProps('password').value.length != 0 ? <div className="form-control-position positionRight" onClick={this.showPassword}>
                                {this.state.password ? <EyeOff size={15} /> : <Eye size={15} />}
                              </div> : ''}
                            </FormGroup>
                            <Row>
                              <Col md="6" sm="6" xs="6">
                                <FormGroup className="d-flex justify-content-between align-items-center remember-me">
                                  <Checkbox
                                    color="primary"
                                    icon={<Check className="vx-icon" size={14} />}
                                    label="Remember Me"
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="6" sm="6" xs="6" className="text-right">
                                <div
                                  className="cursor-pointer forget-link"
                                  onClick={() => history.push("/forgot-password")}
                                >
                                  Forgot Password?
                                </div>
                              </Col>
                            </Row>
                            <div className="d-block login-btn">
                              <Button
                                color="primary"
                                type="submit"
                                className="btn-block"
                                disabled={isSubmitting}
                              >
                                {this.submitButton("Login", isSubmitting)}
                              </Button>
                              {/* <Button.Ripple
                                color="primary"
                                outline
                                onClick={() => {
                                  this.props.history.push("/register");
                                }}
                              >
                                Register
                              </Button.Ripple> */}
                              <div className="cursor-pointer text-center help-link">
                                <a href={config.webBaseUrl + '/technical-support'} target="_blank">Need Help?</a>
                              </div>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row className="m-0 ">
                <Col
                  lg="6"
                  md="12"
                  sm="12"
                  xs="12"
                  className="text-center coprights"
                >
                  <p>&copy;Telescrubs. All rights reserved.</p>
                </Col>
                <Col
                  lg="6"
                  md="6"
                  sm="6"
                  className="d-none d-lg-block text-center bg-white"
                >
                  &nbsp;
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <div className="footer-nav">
          <Container>
            <Row>
              <Col md={4}>
                <h2 className="footer-title">Company</h2>
                <ul>
                  <li><NavLink href={config.webBaseUrl + '/about-us/'}>About Us</NavLink></li>
                  <li><NavLink href={config.webBaseUrl + '/contact-us/'}>Contact Us</NavLink></li>
                  <li><NavLink href={config.webBaseUrl + '/technical-support/'}>Technical Support</NavLink></li>
                  <li><NavLink href={config.webBaseUrl + '/pricing/'}>Pricing</NavLink></li>
                </ul>
              </Col>
              <Col md={4}>
                <h2 className="footer-title">TeleHealth Information</h2>
                <ul>
                  <li><NavLink href="https://www.cms.gov/newsroom/fact-sheets/medicare-telemedicine-health-care-provider-fact-sheet" target="_blank">Telemedicine Fact Sheet</NavLink></li>
                  <li><NavLink href="https://www.cdc.gov/coronavirus/2019-ncov/hcp/telehealth.html" target="_blank">TeleHealth during COVID</NavLink></li>
                  <li><NavLink href="https://www.medicaid.gov/medicaid/benefits/telemedicine/index.html" target="_blank">TeleHealth and Medicaid</NavLink></li>
                </ul>
              </Col>
              <Col md={4}>
                <h2 className="footer-title">Journeys / Product Information</h2>
                <ul>
                  <li><NavLink href={config.webBaseUrl + '/patient-journey/'}>Patient</NavLink></li>
                  <li><NavLink href={config.webBaseUrl + '/provider-journey/'}>Provider</NavLink></li>
                  <li><NavLink href={config.webBaseUrl + '/hospitals/'}>Hospitals</NavLink></li>
                  <li><NavLink href={config.webBaseUrl + '/health-plans/'}>Health Plans</NavLink></li>
                </ul>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="copyright-wrapper">
          <Container>
            <Row>
              <Col md={12} className="text-center">
                <p className="footerleft">© 2020 Telescrubs. All Rights Reserved</p>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth } = state;
  return {
    authentication: auth.login,
  };
};
export default connect(mapStateToProps, { login })(Login);
