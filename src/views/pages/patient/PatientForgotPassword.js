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
import { loadingButton, forgotPasswordValidation, ToastSuccess, ToastError } from "../../../components";
import { patientForgotPassword } from "../../../redux/actions/auth/loginActions";

import fgImg from "../../../assets/img/logo/logo.png";
import { history } from "../../../history";
import _ from "lodash";
import "../../../assets/scss/pages/authentication.scss";

class PatientForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.formikActions = {};
    console.log(props);
  }

  componentDidUpdate() {
    if (this.props.password.status) {
        ToastSuccess(this.props.password.message)
    } else {
      ToastError(this.props.password.message)
    }
    this.formikActions.resetForm();
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
                  <CardHeader className="pb-1">
                    <CardTitle>
                      <h4 className="mb-0">Forgot Password</h4>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="pt-1 pb-0">
                    <Formik
                      initialValues={{
                        email: "",
                      }}
                      validationSchema={forgotPasswordValidation}
                      onSubmit={(values, actions) => {
                        this.formikActions = actions;
                        this.props.patientForgotPassword(values);
                      }}
                      render={({ errors,setFieldValue,values, touched, isSubmitting, handleBlur }) => (
                        <Form>
                          <FormGroup className="position-relative">
                            <Field
                              name="email"
                              placeholder="Your Email"
                              type="text"
                              className={`form-control  text-lowercase ${
                                errors.email && touched.email && "is-invalid"
                              }`}
                              onBlur={(e) => {
                                handleBlur(e)
                                  setFieldValue("email", _.toLower(values.email.trim()))
                                }
                              }  
                              autoFocus
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="invalid-tooltip mt-25"
                            />
                          </FormGroup>
                          <Row>
                          <Col md="6" className="d-block mb-1 ripple">
                            <Button.Ripple
                              color="primary"
                              outline
                              className="btn-block btn-outline-blue"
                              onClick={() => history.push("/patient")}
                            >
                              Back to Login
                            </Button.Ripple>
                          </Col>
                          <Col md="6" className="d-block md-2 ripple">
                            <Button.Ripple
                              color="primary"
                              type="submit"
                              className="btn-block"
                              disabled={isSubmitting}
                            >
                              {loadingButton("Submit", isSubmitting)}
                            </Button.Ripple>
                          </Col>
                          </Row>
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
    password: auth.login.forgotPassword,
    authentication: auth.login.login,
  };
};

export default connect(mapStateToProps, { patientForgotPassword })(PatientForgotPassword);
