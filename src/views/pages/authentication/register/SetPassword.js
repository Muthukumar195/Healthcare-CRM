import React, { Fragment } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { changePasswordValidation } from "../../../../components/FormValidation";
import loginImg from "../../../../assets/img/logo/logo.png";
import "../../../../assets/scss/pages/authentication.scss";
import { setPassword } from "../../../../redux/actions/patientActions";
import { loadingButton, ToastSuccess, ToastError } from "../../../../components";
import { Calendar, Eye, EyeOff } from "react-feather"
class SetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.formikActions = {};
    this.state = {
      pid: this.props.match.params.token,
        password: false,
        retypePassword: false,
      
    };
  }

  showPassword = () => {
    this.setState({
      password: !this.state.password
    })
  }
  showconfirmPassword = () => {
    this.setState({
      retypePassword: !this.state.retypePassword
    })
  }
  componentDidUpdate(prevProps) {
    console.log(this.props);
    console.log(prevProps);
    if (this.props.setPasswordData != prevProps.setPasswordData) {
      if (this.props.setPasswordData.status) {
        ToastSuccess(this.props.setPasswordData.message)
        this.props.history.push("/plogin");
      } else {
        ToastError(this.props.setPasswordData.message)
      }
    }
    this.formikActions.setSubmitting(false);
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
          <Card className="bg-authentication login-card signup-sec  rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none  signup-sec align-self-center px-3 py-0"
              >
                <img src={loginImg} alt="SetPassword" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 pl-2 pr-2 pt-2 pb-0">
                  <CardBody>
                    <h4 className="title">Set Password</h4>
                    <Formik
                      initialValues={{
                        password: "",
                        retypePassword: "",
                        pid: this.state.pid,
                      }}
                      onSubmit={(values, actions) => {
                        this.formikActions = actions;
                        console.log(values);
                        this.props.setPassword(values);
                      }}
                      render={({ errors, touched, isSubmitting, getFieldProps }) => (
                        <Form>
                    <FormGroup className="form-label-group position-relative has-icon-right noError">
                            <Field
                             type={this.state.password ? 'text' : 'password'}
                              name="password"
                              id="password"
                              placeholder="New Password"
                              autoFocus
                              className={`form-control  ${
                                errors.password &&
                                touched.password &&
                                "is-invalid"
                              }`}
                              onFocus={() => {
                                this.setState({
                                  retypePassword: false,
                                })
                              }}
                            />
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="invalid-tooltip mt-25"
                            />
                             {getFieldProps('password').value.length != 0 ? <div className="form-control-position" onClick={this.showPassword}>
                        {this.state.password ? <EyeOff size={15} /> : <Eye size={15} />}
                      </div> : ''}
                            <Label for="password">New Password</Label>
                          </FormGroup>
                          <FormGroup className="form-label-group position-relative has-icon-right noError">
                            <Field
                              type={this.state.retypePassword ? 'text' : 'password'}
                              name="retypePassword"
                              id="confirmPassword"
                              placeholder="Retype Password"
                              className={`form-control  ${
                                errors.password &&
                                touched.password &&
                                "is-invalid"
                              }`}
                              onFocus={() => {
                                this.setState({
                                  password: false,
                                })
                              }}
                            />
                            <ErrorMessage
                              name="retypePassword"
                              component="div"
                              className="invalid-tooltip mt-25"
                            />
                              {getFieldProps('retypePassword').value.length != 0 ? <div className="form-control-position" onClick={this.showconfirmPassword}>
                        {this.state.retypePassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </div> : ''}
                            <Label for="retypePassword">Retype Password</Label>
                          </FormGroup>
                          <Row>
                          <Col md="6" className="d-block mb-1 ripple">
                            <Button.Ripple
                              color="primary"
                              type="submit"
                              className="btn-block"
                              disabled={isSubmitting}
                            >
                              {loadingButton(
                                "Submit",
                                isSubmitting,
                                "Updating..."
                              )}
                            </Button.Ripple>
                            </Col>
                             <Col md="6" className="d-block mb-1 ripple">
                            <Button.Ripple
                              color="info"
                              type="button"
                              className="btn-block "
                            >
                              Cancel
                            </Button.Ripple></Col></Row>
                        
                        </Form>
                      )}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="m-0 ">
              <Col
                lg="6"
                md="6"
                sm="6"
                xs="12"
                className="text-center coprights"
              >
                <p>&copy;Telescrubs. All rights reserved.</p>
              </Col>
              <Col
                lg="6"
                md="6"
                sm="6"
                className="d-none d-sm-block text-center bg-white"
              >
                &nbsp;
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, patient } = state;
  return {
    authentication: auth.login,
    setPasswordData: patient.setPasswordData,
  };
};

export default connect(mapStateToProps, { setPassword })(SetPassword);
