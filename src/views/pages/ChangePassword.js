import React from "react";
import { Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import _ from "lodash";
import {
  Card,
  CardHeader,
  CardTitle,
  Input,
  Label,
  CardBody,
  Button,
  FormGroup,
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { loadingButton, changePasswordValidation, ToastSuccess, ToastError, auditLog } from "../../components";
import { changePassword } from "../../redux/actions/auth/loginActions";
import { Calendar, Eye, EyeOff } from "react-feather"

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.formikActions = {};
    console.log(props);
    this.state = {
      password: false,
      confirmPassword: false,
      oldPassword: false
    }
  }

  showoldPassword = () => {
    this.setState({
      oldPassword: !this.state.oldPassword
    })
  }
  showconfirmPassword = () => {
    this.setState({
      confirmPassword: !this.state.confirmPassword
    })
  }
  showPassword = () => {
    this.setState({
      password: !this.state.password
    })
  }
  componentDidUpdate(prevProps) {
    if (this.props.password != prevProps.password) {
      if (this.props.password.status) {
        auditLog("M1 Password Update", "Updated Success")
        ToastSuccess(this.props.password.message)
      } else {
        auditLog("M1 Password Update", "Updated Failed")
        ToastError(this.props.password.message)
      }
      if (!_.isEmpty(this.formikActions)) {
        this.formikActions.resetForm();
        this.formikActions.setSubmitting(false);
      }

    }
  }

  render() {
    return (
      <Row>
        <Col lg="6" md="6" className="change-password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardBody>
              <Formik
                initialValues={{
                  userId: this.props.authentication.user._id,
                  oldPassword: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={changePasswordValidation}
                onSubmit={(values, actions) => {
                  this.formikActions = actions;
                  this.props.changePassword(values);
                }}
                render={({ errors, touched, isSubmitting, getFieldProps }) => (
                  <Form>
                    <FormGroup className="form-label-group position-relative has-icon-right noError">
                      <Field
                        type={this.state.oldPassword ? 'text' : 'password'}
                        name="oldPassword"
                        id="oldPassword"
                        autoFocus
                        onFocus={() => {
                          this.setState({
                            password: false,
                            confirmPassword: false
                          })
                        }} placeholder="Current Password"
                        className={`form-control  ${
                          errors.oldPassword &&
                          touched.oldPassword &&
                          "is-invalid"
                          }`}

                      />
                      <ErrorMessage
                        name="oldPassword"
                        component="div"
                        className="invalid-tooltip mt-25"
                      />
                      {getFieldProps('oldPassword').value.length != 0 ? <div className="form-control-position" onClick={this.showoldPassword}>
                        {this.state.oldPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </div> : ''}
                      <Label for="oldPassword">Current Password</Label>
                    </FormGroup>

                    <FormGroup className="form-label-group position-relative has-icon-right noError">
                      <Field
                        type={this.state.password ? 'text' : 'password'}
                        name="password"
                        id="password"
                        onFocus={() => {
                          this.setState({
                            oldPassword: false,
                            confirmPassword: false
                          })
                        }}
                        placeholder="New Password"
                        className={`form-control  ${
                          errors.password && touched.password && "is-invalid"
                          }`}
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
                        type={this.state.confirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        id="confirmPassword"
                        onFocus={() => {
                          this.setState({
                            oldPassword: false,
                            password: false
                          })
                        }}
                        placeholder="Retype Password"
                        className={`form-control  ${
                          errors.confirmPassword && touched.confirmPassword && "is-invalid"
                          }`}
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="invalid-tooltip mt-25"
                      />
                      {getFieldProps('confirmPassword').value.length != 0 ? <div className="form-control-position" onClick={this.showconfirmPassword}>
                        {this.state.confirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </div> : ''}
                      <Label for="confirmPassword">Retype Password</Label>
                    </FormGroup>

                    <div className="ripple d-block mt-2">
                      <Button.Ripple
                        color="primary"
                        type="submit"
                        className="btn-block"
                        disabled={isSubmitting}
                      >
                        {loadingButton(
                          "Submit",
                          isSubmitting,
                          "Password Changing..."
                        )}
                      </Button.Ripple>
                    </div>
                  </Form>
                )}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth } = state;
  return {
    password: auth.login.changePassword,
    authentication: auth.login.login,
  };
};

export default connect(mapStateToProps, { changePassword })(ChangePassword);
