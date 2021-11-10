import React, { Fragment } from "react";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  FormGroup,
  Input,
  Label,
  Button,
} from "reactstrap";

import registerImg from "../../../../assets/img/logo/logo.png";
import "../../../../assets/scss/pages/authentication.scss";
import Radio from "../../../../components/@vuexy/radio/RadioVuexy";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Spinner } from "reactstrap";
import { history } from "../../../../history";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { Check } from "react-feather";
import { registerPatient } from "../../../../redux/actions/patientActions";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.formikActions = {};
    this.state = {
      verifyMode: "",
    };
  }
  // componentDidUpdate() {
  //   this.formikActions.setSubmitting(false);
  //   this.formikActions.setFieldValue("password", "");
  //   this.formikActions.setFieldTouched("password", false);
  // }

  componentDidUpdate(prevProps) {
    console.log(this.props);
    console.log(prevProps);
    if (this.props.registerData != prevProps.registerData) {
      if (this.props.registerData.status) {
        // toast.success(this.props.registerData.message);
        this.setState({ verifyMode: this.props.registerData.verifiedMode });
      } else {
        toast.error(this.props.registerData.message);
      }
      this.formikActions.setSubmitting(false);
    }
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  render() {
    return (
      <React.Fragment>
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
                  className="d-lg-block d-none text-center align-self-center px-1 py-0"
                >
                  <img className="mr-1" src={registerImg} alt="registerImg" />
                </Col>
                <Col lg="6" md="12" className="p-0">
                  <Card className="rounded-0 mb-0 p-2">
                    <CardHeader className="pb-1 pt-50">
                      <CardTitle>
                        <h4 className="mb-0">Create Your TeleScrubs Account</h4>
                      </CardTitle>
                    </CardHeader>
                    <p className="px-2 auth-title mb-0"></p>
                    <CardBody>
                      <Formik
                        initialValues={{
                          firstName: "",
                          lastName: "",
                          dateOfBirth: "",
                          email: "",
                          mobile: "",
                        }}
                        onSubmit={(values, actions) => {
                          console.log(values);
                          this.formikActions = actions;
                          this.props.registerPatient(values);
                        }}
                        render={({ values, touched, isSubmitting }) => (
                          <Form>
                            <FormGroup className="form-label-group">
                              <Field
                                type="text"
                                placeholder="First name"
                                name="firstName"
                                className="form-control"
                              />
                            </FormGroup>
                            <FormGroup className="form-label-group">
                              <Field
                                type="text"
                                placeholder="Last name"
                                name="lastName"
                                className="form-control"
                              />
                            </FormGroup>
                            <FormGroup className="form-label-group">
                              <Field
                                type="text"
                                placeholder="Date of Birth"
                                name="dateOfBirth"
                                className="form-control"
                              />
                            </FormGroup>
                            <FormGroup className="form-label-group">
                              <Field
                                type="text"
                                placeholder="Email ID"
                                name="email"
                                className="form-control"
                              />
                            </FormGroup>

                            <FormGroup className="form-label-group">
                              <Field
                                type="text"
                                placeholder="Mobile number"
                                name="mobile"
                                className="form-control"
                              />
                            </FormGroup>
                            <FormGroup>
                              <Checkbox
                                color="primary"
                                icon={<Check className="vx-icon" size={16} />}
                                label=" I accept the terms & conditions."
                                defaultChecked={false}
                              />
                            </FormGroup>
                            <div className="d-flex justify-content-between">
                              <Button.Ripple
                                color="primary"
                                type="submit"
                                disabled={isSubmitting}
                              >
                                Register
                              </Button.Ripple>
                              <Button.Ripple
                                color="primary"
                                outline
                                onClick={() => {
                                  history.push("/login");
                                }}
                              >
                                Login
                              </Button.Ripple>
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
          <Modal
            isOpen={this.state.verifyMode == 1}
            className={this.props.className}
          >
            <ModalHeader>
              How would you like to verify your account?
            </ModalHeader>
            <ModalBody>
              <Formik
                initialValues={{
                  verifyMode: 1,
                }}
                onSubmit={(values, actions) => {
                  alert();
                }}
                render={({
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  isSubmitting,
                }) => (
                  <Form>
                    <FormGroup className="form-label-group position-relative has-icon-left">
                      <Radio
                        label="Email"
                        name="verifyMode"
                        value="1"
                        checked={values.verifyMode === 1}
                        onChange={() => setFieldValue("verifyMode", 1)}
                      />
                      <Radio
                        label="Mobile number"
                        name="verifyMode"
                        value="2"
                        checked={values.verifyMode === 2}
                        onChange={() => setFieldValue("verifyMode", 2)}
                      />
                    </FormGroup>
                  </Form>
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Verify
              </Button>
            </ModalFooter>
          </Modal>
        </Row>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  console.log(state);
  const { patient } = state;
  return {
    registerData: patient.register,
  };
};

export default connect(mapStateToProps, { registerPatient })(Register);
