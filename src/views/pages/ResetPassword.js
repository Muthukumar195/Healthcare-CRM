import React from "react";
import { Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { loadingButton, resetPasswordValidation, ToastSuccess, ToastError } from "../../components";
import { resetPassword } from "../../redux/actions/auth/loginActions";

import fgImg from "../../assets/img/logo/logo.png";
import { history } from "../../history";
import "../../assets/scss/pages/authentication.scss";
import { Calendar, Eye, EyeOff } from "react-feather"
import _ from "lodash"

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.formikActions = {};
    this.state = {
      new_password: false,
      retype_password: false,
    }
  }

  showPassword = () => {
    this.setState({
      new_password: !this.state.new_password
    })
  }
  showconfirmPassword = () => {
    this.setState({
      retype_password: !this.state.retype_password
    })
  }
  componentDidUpdate() {
    if (this.props.password) {
      if (this.props.password.status) {
        ToastSuccess(this.props.password.message)
        history.push('/')
      } else {
        ToastError(this.props.password.message)
      }
    }
    if (!_.isEmpty(this.formikActions)) {
      this.formikActions.resetForm();
      this.formikActions.setSubmitting(false);
    }
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
          <Card className="bg-authentication rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center"
              >
                <img src={fgImg} alt="fgImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 px-2 py-1 pt-4 pb-4">
                  <CardHeader>
                    <CardTitle>
                      <h4 className="mb-0">Reset Password</h4>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="pt-1 pb-0">
                    <Formik
                      initialValues={{
                        new_password: "",
                        retype_password: "",
                        forgotToken: !_.isEmpty(this.props.match) ? this.props.match.params.token : null,
                      }}
                      validationSchema={resetPasswordValidation}
                      onSubmit={(values, actions) => {
                        this.formikActions = actions;
                        this.props.resetPassword(values);
                      }}
                      render={({ errors, touched, isSubmitting, getFieldProps }) => (
                        <Form>
                          <FormGroup className="form-label-group position-relative has-icon-right noError">
                            <label htmlFor="password">New Password</label>
                            <Field
                              className={`form-control ${
                                errors.new_password && touched.new_password && "is-invalid"
                                }`}
                              name="new_password"
                              placeholder="New Password"
                              onFocus={() => {
                                this.setState({
                                  retype_password: false,
                                })
                              }}
                              type={this.state.new_password ? 'text' : 'password'}
                              autoFocus
                            />
                            <ErrorMessage
                              name="new_password"
                              component="div"
                              className="invalid-tooltip mt-25"
                            />
                            {getFieldProps('new_password').value.length != 0 ? <div className="form-control-position" onClick={this.showPassword}>
                              {this.state.new_password ? <EyeOff size={15} /> : <Eye size={15} />}
                            </div> : ''}
                          </FormGroup>
                          <FormGroup className="form-label-group position-relative has-icon-right noError">
                            <label htmlFor="retype_password">
                              Retype Password
                            </label>
                            <Field
                              className={`form-control ${
                                errors.retype_password && touched.retype_password && "is-invalid"
                                }`}
                              name="retype_password"
                              placeholder="Retype Password"
                              type={this.state.retype_password ? 'text' : 'password'}
                              onFocus={() => {
                                this.setState({
                                  new_password: false,
                                })
                              }}
                            />
                            <ErrorMessage
                              name="retype_password"
                              component="div"
                              className="invalid-tooltip mt-25"
                            />
                            {getFieldProps('retype_password').value.length != 0 ? <div className="form-control-position" onClick={this.showconfirmPassword}>
                              {this.state.retype_password ? <EyeOff size={15} /> : <Eye size={15} />}
                            </div> : ''}
                          </FormGroup>

                          <div className="ripple d-block mt-2">
                            <Button
                              color="primary"
                              type="submit"
                              className="btn-block"
                              disabled={isSubmitting}
                            >
                              {loadingButton("Submit", isSubmitting)}
                            </Button>
                          </div>
                        </Form>
                      )}
                    />
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

const mapStateToProps = (state) => {
  const { auth } = state;
  return {
    password: auth.login.resetPassword,
    authentication: auth.login.login,
  };
};

export default connect(mapStateToProps, { resetPassword })(ResetPassword);
