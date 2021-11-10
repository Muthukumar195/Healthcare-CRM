import React, { Fragment } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import Radio from "../../../../components/@vuexy/radio/RadioVuexy";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";
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
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import moment from "moment";
import { Mail, Lock, Check, Facebook, Twitter, GitHub } from "react-feather";
import { Formik, Field, Form, ErrorMessage } from "formik";
import InputMask from "react-input-mask";
import {
  signUpValidation,
  checkOTP,
} from "../../../../components/FormValidation";
import loginImg from "../../../../assets/img/logo/logo.png";
import "../../../../assets/scss/pages/authentication.scss";
import {
  registerPatient,
  verifyOTP,
} from "../../../../redux/actions/patientActions";
import { ToastError, ToastSuccess } from "../../../../components";
import  config  from "../../../../configs";
import { loadingButton } from "../../../../components";
import ReCAPTCHA from "react-google-recaptcha";
import _ from "lodash";

import classNames from "classnames";

// Input feedback
const InputFeedback = ({ error }) =>
  error ? <div className={classNames("invalid-tooltip mt-25")}>{error}</div> : null;

// Radio input
const RadioButton = ({
  field: { name, value, onChange, onBlur },
  id,
  label,
  className,
  ...props
}) => {
  return (
    <div className="d-inline-block mr-1">
      <Radio
        label={label}
        name={name}
        id={id}
        value={id} 
        checked={id === value}
        onChange={onChange}
        onBlur={onBlur}
        className={classNames("radio-button")}
        {...props}
      />
    </div>
  );
};

// Radio group
const RadioButtonGroup = ({
  value,
  error,
  touched,
  id,
  label,
  className,
  children
}) => {
  const classes = classNames(
    "form-group",
    {
      "is-success": value || (!error && touched),
      "is-invalid": !!error && touched
    },
    className
  );

  return (
    <div className={classes}>
        <label className="pl-0">{label}</label><br/>
        {children}
        {touched && 
        
        <InputFeedback error={error} />}
    </div>
  );
};

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.formikActions = {};
    this.captcha = {};
    this.state = {
      modalShow: true,
      hasMobileOTP: false,
      hasEmailOTP: true,
      verifyMode: "",
      pid: null,
      reCaptcha: "",
      captchaErr:false
    };
  }

  componentDidUpdate(prevProps) {
    console.log(this.props);
    console.log(prevProps);  
    if (this.props.registerData != prevProps.registerData) {
      if (this.props.registerData.status) {
        ToastSuccess(this.props.registerData.message)
        this.props.history.push("/patient")
      } else {
        ToastError(this.props.registerData.message)
      }
      if(this.props.registerData.reset){
        this.formikActions.resetForm();
      }
      this.captcha.reset();
      this.formikActions.setSubmitting(false);
    } else if (this.props.OTPData != prevProps.OTPData) {
      if (this.props.OTPData.status) {
        ToastSuccess(this.props.OTPData.message)
        this.props.history.push("/set-password/" + this.props.OTPData.pid);
      } else {
        ToastError(this.props.OTPData.message)
      }
    }
  }

  setModalShow = (modalShow) => {
    this.setState({
      modalShow: !this.state.modalShow,
    });
  };
  

  handleVerifyMode = (e) => {
    if (this.state.verifyMode != "") {
      return true;
    }
    console.log(this.state);
    return false;
  };

  reCaptchaChange = (value) => { 
    console.log("Captcha value:", value);
    this.setState({reCaptcha: value})

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
                <h3>Create an account</h3>
                <ul>
                  <li>
                    <Check size={20} /> Make Payment
                  </li>
                </ul>
                <h3>One click doctor visit</h3>
                <ul>
                  <li>
                    <Check size={20} /> one click connect
                  </li>
                  <li>
                    <Check size={20} /> virtual waiting room
                  </li>
                  <li>
                    <Check size={20} /> get connected as doctor enters room
                  </li>
                </ul>
                <h3>Crystal clear audio + video</h3>
                <ul>
                  <li>
                    <Check size={20} /> no app to install
                  </li>
                  <li>
                    <Check size={20} /> connect from any smart phone
                  </li>
                </ul>
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 pl-3 pr-3 pt-2 pb-0">
                  <CardBody>
                    <h4 className="title">Create your TeleScrubs Account</h4>
                    <Formik
                      initialValues={{
                        firstName: "",
                        lastName: "",
                        mobile: "",
                        gender: "",
                        dateOfBirth: moment().subtract(5, "years").format("MM-DD-YYYY"),
                        email: "",
                        zipcode: "",
                        password: "",
                        confirmPassword: ""
                      }}
                      validationSchema={signUpValidation}
                      onSubmit={(values, actions) => {
                        this.formikActions = actions;
                        let newFormdata = Object.assign({}, values)
                        newFormdata.mobile = newFormdata.mobile.substring(1);
                        newFormdata.reCaptcha = this.state.reCaptcha; 
                        this.props.registerPatient(newFormdata);
                        setTimeout(() => { 
                          actions.setSubmitting(false);
                        }, 1000);
                      }}
                    >
                      {({ errors, touched, values, isSubmitting, setFieldValue, handleBlur }) => (
                        <Form>
                          <Row>
                            <Col md={6}>
                              <FormGroup className="form-label-group position-relative ">
                                <Field
                                  type="text"
                                  placeholder="First Name *"
                                  name="firstName"
                                  id="firstName"
                                  className={`form-control ${
                                    errors.firstName &&
                                    touched.firstName &&
                                    "is-invalid"
                                    }`}
                                  onBlur={(e) => {
                                    handleBlur(e)
                                    setFieldValue("firstName", values.firstName.trim())
                                  }
                                  }
                                  autoFocus
                                />
                                <ErrorMessage
                                  name="firstName"
                                  component="div"
                                  className="invalid-tooltip mt-25"
                                />
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup className="form-label-group position-relative ">
                                <Field
                                  type="text"
                                  placeholder="Last Name *"
                                  name="lastName"
                                  id="lastName"
                                  className={`form-control ${
                                    errors.lastName &&
                                    touched.lastName &&
                                    "is-invalid"
                                    }`}
                                    onBlur={(e) => {
                                      handleBlur(e)
                                    setFieldValue("lastName", values.lastName.trim())
                                  }
                                  }
                                />
                                <ErrorMessage
                                  name="lastName"
                                  component="div"
                                  className="invalid-tooltip mt-25"
                                />
                              </FormGroup>
                            </Col>
                          </Row>

                          <RadioButtonGroup
                            id="radioGroup"
                            label="Gender *"
                            className="mb-1"
                            value={values.gender}
                            error={errors.gender}
                            touched={touched.gender}
                          >
                            <Field
                              component={RadioButton}
                              name="gender"
                              id="radioOption1"
                              label="Male"
                            />
                            <Field
                              component={RadioButton}
                              name="gender"
                              id="radioOption2"
                              label="Female"
                            />
                            <Field
                              component={RadioButton}
                              name="gender"
                              id="radioOption3"
                              label="Other"
                            />
                          </RadioButtonGroup>

                          <FormGroup className="form-label-group position-relative ">
                            <Flatpickr
                              className={`form-control pr-1 ${
                                errors.dateOfBirth &&
                                touched.dateOfBirth &&
                                "is-invalid"
                                }`}
                              name="dateOfBirth"
                              id="flatpickr-custom-year-select"   
                              placeholder="Date of Birth (MM/DD/YYYY) *"
                              options={{
                                //altInput: true,
                                dateFormat: "m-d-Y",
                                minDate: moment().subtract(50, "years").toDate(),
                                maxDate: moment().toDate(),
                                // defaultDate: values.dateOfBirth,
                                //allowInput:true 
                              }}
                              onReady={(selectedDates, dateStr, instance)=> {
                                const flatpickrYearElement = instance.currentYearElement;
            
                                const children = flatpickrYearElement.parentElement.children;
                                for (let i in children) {
                                    if (children.hasOwnProperty(i)) {
                                        children[i].style.display = 'none';
                                    }
                                }
            
                                const yearSelect = document.createElement('select');
                                const minYear = new Date(instance.config._minDate).getFullYear();
                                const maxYear = new Date(instance.config._maxDate).getFullYear();
                                for (let i = minYear; i <= maxYear; i++) {
                                    const option = document.createElement('option');
                                    option.value = '' + i;
                                    option.text = '' + i;
                                    yearSelect.appendChild(option);
                                }
                                yearSelect.addEventListener('change', function (event) {
                                    flatpickrYearElement.value = event.target['value'];
                                    instance.currentYear = parseInt(event.target['value']);
                                    instance.redraw();
                                });
            
                                yearSelect.className = 'flatpickr-monthDropdown-months';
                                yearSelect.id = "flatpickr-custom-year-select";
                                yearSelect.value = instance.currentYearElement.value;
            
                                flatpickrYearElement.parentElement.appendChild(yearSelect);
                            }}
                              onChange={(date) => {
                                console.log(moment(date[0]).format("MM-DD-YYYY"))
                                setFieldValue("dateOfBirth", moment(date[0]).format("MM-DD-YYYY"));
                              }}
                            />
                            <ErrorMessage
                              name="dateOfBirth"
                              component="div"
                              className="invalid-tooltip mt-25"
                            />
                          </FormGroup>

                          <FormGroup className="form-label-group position-relative ">
                            <Field
                              type="text"
                              placeholder="E-mail *"
                              name="email"
                              id="email"
                              className={`form-control text-lowercase ${
                                errors.email && touched.email && "is-invalid"
                                }`}
                              value={values.email}
                              onBlur={(e) => {
                                handleBlur(e)
                                console.log(values.email.length)
                                setFieldValue("email", _.toLower(values.email.trim()))
                              }
                              }
                              onChange={(e) => {
                                let hasEmailOTP = setFieldValue(
                                  "email",
                                  e.target.value
                                );
                                this.setState({
                                  hasEmailOTP,
                                });
                              }}
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="invalid-tooltip mt-25"
                            />
                          </FormGroup>

                          <FormGroup className="form-label-group position-relative ">
                            <InputMask
                              className={`form-control ${
                                errors.mobile && touched.mobile && "is-invalid"
                                }`}
                              name="mobile"
                              placeholder="Mobile Number"
                              value={values.mobile}
                              onChange={(val) => {
                                var pNumber = val.target.value.replace(
                                  /[^\d]/g,
                                  ""                                );
                                // pNumber = pNumber.substr(1);
                                setFieldValue("mobile", pNumber);
                                this.setState({
                                  hasMobileOTP: pNumber,
                                });
                              }}
                              type="text"
                              mask="+1 999-999-9999"
                            />
                            <ErrorMessage
                              name="mobile"
                              component="div"
                              className="invalid-tooltip mt-25"
                            />
                          </FormGroup>
                          
                          <FormGroup className="form-label-group position-relative ">
                            <Field
                              type="text"
                              placeholder="Zip Code *"
                              name="zipcode"
                              id="zipcode"
                              className={`form-control ${
                                errors.zipcode &&
                                touched.zipcode &&
                                "is-invalid"
                                }`}
                                onBlur={(e) => {
                                  handleBlur(e)
                                setFieldValue("zipcode", values.zipcode.trim())
                              }
                              }
                            />
                            <ErrorMessage
                              name="zipcode"
                              component="div"
                              className="invalid-tooltip mt-25"
                            />
                          </FormGroup>
                          
                          <FormGroup className="form-label-group position-relative ">
                            <Field
                              type="password"
                              placeholder="Password *"
                              name="password"
                              id="password"
                              className={`form-control ${
                                errors.password && touched.password && "is-invalid"
                                }`}
                              onChange={(e) => {
                                let hasEmailOTP = setFieldValue(
                                  "password",
                                  e.target.value
                                );

                              }}
                            />
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="invalid-tooltip mt-25"
                            />
                          </FormGroup>
                          <FormGroup className="form-label-group position-relative ">
                            <Field
                              type="password"
                              placeholder="ReType Password *"
                              name="confirmPassword"
                              id="confirmPassword"
                              className={`form-control ${
                                errors.confirmPassword && touched.confirmPassword && "is-invalid"
                                }`}
                              onChange={(e) => {
                                let hasEmailOTP = setFieldValue(
                                  "confirmPassword",
                                  e.target.value
                                );

                              }}
                            />
                            <ErrorMessage
                              name="confirmPassword"
                              component="div"
                              className="invalid-tooltip mt-25"
                            />
                          </FormGroup>
                          <ReCAPTCHA
                            ref={e => (this.captcha = e)}
                            sitekey={config.reCaptchaSiteKey}
                            onChange={this.reCaptchaChange}
                          /> 
                          <div className="d-block login-btn">
                            <Button.Ripple
                              color="primary"
                              type="submit"
                              className="btn-block"
                              disabled={isSubmitting}
                            >
                              {loadingButton(
                                "Register",
                                isSubmitting,
                                "Registering..."
                              )}
                            </Button.Ripple>
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
                md="12"
                sm="12"
                xs="12"
                className="d-none d-lg-block text-center bg-white"
              >
                &nbsp;
              </Col>
            </Row>
          </Card>
        </Col>
        <SweetAlert
          title={false}
          className="px-0"
          show={this.handleVerifyMode()}
          lg={12}
          onConfirm={() => { }}
          showConfirm={false}
        >
          {() => (
            <Row className="m-0 justify-content-center">
              <Col
                sm="12"
                xl="12"
                lg="12"
                md="12"
                className="d-flex justify-content-center p-0"
              >
                <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
                  <Row className="m-0">
                    <Col
                      lg="6"
                      className="d-lg-block d-none text-center align-self-center px-1 py-0"
                    >
                      <img src={loginImg} alt="loginImg" />
                    </Col>
                    <Col lg="6" md="12" className="p-0">
                      <Card className="rounded-0 mb-0 pl-3 pr-3 pt-5 pb-4">
                        <CardBody>
                          <h4 className="pb-1">
                            Please input the OTP sent to your registered{" "}
                            {this.state.hasMobileOTP != "" &&
                              this.state.hasEmailOTP != ""
                              ? " mobile number and email ID"
                              : this.state.hasEmailOTP != "" &&
                                this.state.hasMobileOTP == ""
                                ? " email ID"
                                : this.state.hasMobileOTP != "" &&
                                  this.state.hasEmailOTP == ""
                                  ? " mobile number"
                                  : ""}
                            .
                          </h4>
                          <Formik
                            initialValues={{
                              otp: "",
                              pid: this.state.pid,
                            }}
                            validationSchema={checkOTP}
                            onSubmit={(values) => {
                              this.props.verifyOTP(values);
                            }}
                          >
                            {({ errors, touched, values, setFieldValue, isSubmitting }) => (

                              < Form >
                                <FormGroup className="form-label-group position-relative ">
                                  <InputMask
                                    type="text"
                                    placeholder=" One Time Password"
                                    name="otp"
                                    id="otp"
                                    onChange={(val) => {
                                      var otp = val.target.value;
                                      setFieldValue("otp", otp);
                                    }}
                                    className={`form-control ${
                                      errors.otp && touched.otp && "is-invalid"
                                      }`}
                                  />
                                  <ErrorMessage
                                    name="otp"
                                    component="div"
                                    className="invalid-tooltip mt-25"
                                  />
                                </FormGroup>

                                <div className="d-block">
                                  <Button.Ripple
                                    color="primary"
                                    type="submit"
                                    className="btn-block"
                                    disabled={isSubmitting}
                                  >
                                    {loadingButton(
                                      "Register",
                                      isSubmitting,
                                      "Registering..."
                                    )}
                                  </Button.Ripple>
                                  <Button.Ripple
                                    color="info"
                                    type="button"
                                    className="btn-block ml-2"
                                    onClick={() =>
                                      this.setState({ verifyMode: "" })
                                    }
                                  >
                                    Cancel
                                  </Button.Ripple>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          )}
        </SweetAlert>
      </Row >
    );
  }
}
const mapStateToProps = (state) => {
  console.log(state);
  const { patient } = state;
  return {
    registerData: patient.register,
    OTPData: patient.verifyOTP,
  };
};

export default connect(mapStateToProps, { registerPatient, verifyOTP })(
  Register
);
