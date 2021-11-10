import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Row, Col } from "reactstrap";
import Radio from "../../components/@vuexy/radio/RadioVuexy";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import {
  Card,
  CardHeader,
  CardTitle,
  Media,
  CardBody,
  Button,
  Input,
  FormGroup,
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import InputMask from "react-input-mask";
import { loadingButton, myProfilePatientValidation, ToastSuccess, ToastError } from "../../components";
import {
  updateUser,
  updateProfilePic,
} from "../../redux/actions/auth/loginActions";
import { ProfileImage } from "../../configs/ApiActionUrl";
import moment from "moment";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.formikActions = {};
    this.state = {
      user: props.authentication.login.user,
      isActive: false
    };
  }

  componentDidUpdate(prevProps) { 
    if (
      this.props.authentication !== prevProps.authentication ||
      this.props.profilePicture !== prevProps.profilePicture
    ) {
      console.log(this.props.authentication)
      if (this.props.authentication.user != prevProps.authentication.user) { 
        if (this.props.authentication.user.status) {
          ToastSuccess(this.props.authentication.user.message)
        } else {
          ToastError(this.props.profilePicture.message)
        }
        this.formikActions.setSubmitting(false);
      }
      if (this.props.profilePicture !== prevProps.profilePicture) {
        this.setState({ isActive: false, src: null });
        ToastSuccess(this.props.profilePicture.message)
      }
    }
  }


  render() {
    const { user } = this.state;
    return (
      <Row>
        <Col md="7" lg="5">
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardBody>
              <Formik
                initialValues={{
                  userId: user._id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  gender: user.gender,
                  dateOfBirth: user.dateOfBirth,
                  email: user.email,
                  mobile: "1"+user.mobile,
                }}
                validationSchema={myProfilePatientValidation}
                onSubmit={(values, actions) => {
                  this.formikActions = actions;
                  let newFormdata = Object.assign({},values)
                  newFormdata.mobile = newFormdata.mobile.substring(1)
                  this.props.updateUser(newFormdata);
                }}
                render={({
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  isSubmitting,
                  handleBlur
                }) => (
                    <Form>
                      <Row>
                        <Col md="12">
                          <Row>
                            <Col xs="12" sm="12" md="6">
                            <FormGroup className="position-relative">
                                <label htmlFor="firstName">First Name</label>
                                <Field
                                  className={`form-control ${
                                    errors.firstName &&
                                    touched.firstName &&
                                    "is-invalid"
                                    }`}
                                    onBlur={(e) => {
                                      handleBlur(e)
                                        setFieldValue("firstName",values.firstName.trim())
                                      }
                                    }  
                                    autoFocus
                                  name="firstName"
                                  placeholder="First name"
                                  type="text"
                                />
                                <ErrorMessage
                                  name="firstName"
                                  component="div"
                                  className="invalid-tooltip mt-25"
                                />
                              </FormGroup>
                            </Col>
                            <Col xs="12" sm="12" md="6" className="pr-0">
                            <FormGroup className="position-relative">
                                <label htmlFor="lastName">Last Name</label>
                                <Field
                                  className={`form-control ${
                                    errors.lastName &&
                                    touched.lastName &&
                                    "is-invalid"
                                    }`}
                                    onBlur={(e) => {
                                      handleBlur(e)
                                        setFieldValue("lastName",values.lastName.trim())
                                      }
                                    }  
                                  name="lastName"
                                  placeholder="Last name"
                                  type="text"
                                />
                                <ErrorMessage
                                  name="lastName"
                                  component="div"
                                  className="invalid-tooltip mt-25"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                                         
                    <FormGroup>
                      <label htmlFor="mobile">Gender </label>
                      <br />
                      <div className="d-inline-block mr-1">
                        <Radio
                          label="Male"
                          name="gender"
                          value="Male"
                          checked={values.gender === "Male"}
                          onChange={() => setFieldValue("gender", "Male")}
                        />
                      </div>
                      <div className="d-inline-block mr-1">
                        <Radio
                          label="Female"
                          name="gender"
                          value="Female"
                          checked={values.gender === "Female"}
                          onChange={() => setFieldValue("gender", "Female")}
                        />
                      </div>
                      <div className="d-inline-block mr-1">
                        <Radio
                          label="Other"
                          name="gender"
                          value="Other"
                          checked={values.gender === "Other"}
                          onChange={() => setFieldValue("gender", "Other")}
                        />
                      </div>
                      <ErrorMessage
                        name="gender"
                        component="div"
                        className="invalid-tooltip mt-25"
                      />
                    </FormGroup>

                    <FormGroup className="position-relative">
                      <label htmlFor="dateOfBirth">
                        Date of Birth (MM/DD/YYYY)
                      </label>
                      <Flatpickr
                        className={`form-control ${
                          errors.dateOfBirth &&
                          touched.dateOfBirth &&
                          "is-invalid"
                        }`}
                        name="dateOfBirth"
                        placeholder="DOB"
                        value={values.dateOfBirth}
                        options={{
                          altInput: true,
                          altFormat: "m/d/Y",
                          maxDate: moment().subtract(1, "days").toDate(),
                        }}
                        onChange={(date) => {
                          setFieldValue("dateOfBirth", date[0]);
                        }}
                      />
                      <ErrorMessage
                        name="dateOfBirth"
                        component="div"
                        className="invalid-tooltip mt-25"
                      />
                    </FormGroup> 

                    <FormGroup className="position-relative">
                        <label htmlFor="mobile">Mobile Number</label>
                        <InputMask
                          className={`form-control ${
                            errors.mobile && touched.mobile && "is-invalid"
                            }`}
                          name="mobile"
                          placeholder="Mobile Number"
                          value={values.mobile}
                          onChange={(val) => {
                            var pNumber = val.target.value.replace(/[^\d]/g, "");
                            // pNumber = pNumber.substr(1);
                            setFieldValue("mobile", pNumber);
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

                      <FormGroup>
                        <label htmlFor="email">Email</label>
                        <Field
                          className={`form-control cursor-not-allowed ${
                            errors.email && touched.email && "is-invalid"
                            }`}
                          name="email"
                          placeholder="Email Address"
                          type="email"
                          disabled="disabled"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="invalid-tooltip mt-25"
                        />
                      </FormGroup>
                      <div className="ripple d-block mt-2">
                        <Button.Ripple
                          color="primary"
                          type="submit"
                          className="btn-block"
                          disabled={isSubmitting}
                        >
                          {loadingButton("Update", isSubmitting, "Updating...")}
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
  console.log("redux", state);
  const { auth } = state;
  return {
    authentication: auth.login,
    profilePicture: auth.login.profilePicture,
  };
};

export default connect(mapStateToProps, { updateUser, updateProfilePic })(
  MyProfile
);
