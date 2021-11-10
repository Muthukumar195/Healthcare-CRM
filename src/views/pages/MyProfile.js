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
import { loadingButton, myProfileValidation, ToastSuccess, ToastError, auditLog } from "../../components";
import {
  updateUser,
  updateProfilePic,
} from "../../redux/actions/auth/loginActions";
import { ProfileImage } from "../../configs/ApiActionUrl";
import moment from "moment";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import _ from 'lodash';

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.formikActions = {};
    this.state = {
      user: props.authentication.login.user,
      src: null,
      croppedImageUrl:
        ProfileImage.path + props.authentication.login.user.profileImage,
      crop: {
        unit: "%",
        width: 200,
        aspect: 4 / 4,
      },
      isActive: false,
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
          auditLog("M1 Profile", `Updated Success`)
        } else {
          auditLog("M1 Profile", `Updated Failed`)
          ToastError(this.props.profilePicture.message)
        }
        this.formikActions.setSubmitting(false);
      }
      if (this.props.profilePicture !== prevProps.profilePicture) {
        this.setState({ isActive: false, src: null });
        auditLog("M1 Profile Update", `Profile Picture Updated Success`)
        ToastSuccess(this.props.profilePicture.message)

      }
    }
  }
  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
    this.setState({
      isActive: true,
    });
  };

  resetUploadPic = (e) => {
    console.log(this.props);
    this.setState({
      isActive: false,
      croppedImageUrl:
        ProfileImage.path + this.props.authentication.login.user.profileImage,
      src: null,
    });
  };
  // If you setState the crop in here you should return false.
  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "avatar.jpg"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      canvas.toBlob((blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          console.log(blob);
          this.dataURLtoFile(reader.result, "cropped.jpg");
        };

        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        // console.log(this.fileUrl);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    let croppedImage = new File([u8arr], filename, { type: mime });
    this.setState({ croppedImage: croppedImage });
  }

  uploadProfilePic = () => {
    const formData = new FormData();
    formData.append(
      "profilePic",
      this.state.croppedImage,
      this.state.croppedImage.name
    );

    this.props.updateProfilePic(formData);
  };

  render() {
    const { user, crop, croppedImageUrl, src } = this.state;
    console.log(user.mobile)
    return (
      <Row>
        <Col md="5" lg="4">
          <Card>
            <CardHeader className="mx-auto">
              <div className="avatar">
                {croppedImageUrl && (
                  <Media
                    className="rounded-circle"
                    object
                    src={croppedImageUrl}
                    alt="User"
                    height="200"
                    width="200"
                  />
                )}
              </div>
            </CardHeader>
            <CardBody className="text-center">
              {src && (
                <ReactCrop
                  src={src}
                  crop={crop}
                  className="mb-1"
                  ruleOfThirds
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                  onChange={this.onCropChange}
                />
              )}
              {!this.state.isActive ? (
                <Button
                  tag="label"
                  className="cursor-pointer btn-block"
                  color="primary"
                >
                  Change Picture
                  <Input
                    type="file"
                    name="file"
                    id="uploadImg"
                    accept="image/*"
                    onChange={this.onSelectFile}
                    hidden
                  />
                </Button>
              ) : null}

              {this.state.isActive ? (
                <Row>
                  <Col md={6}>
                    <div className="ripple d-block mb-1">
                      <Button
                        tag="label"
                        color="primary"
                        outline
                        className="cursor-pointer btn-block"
                        onClick={this.resetUploadPic}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="ripple d-block mb-1">
                      <Button
                        type="submit"
                        className="cursor-pointer btn-block"
                        color="primary"
                        onClick={this.uploadProfilePic}
                      >
                        Save
                    </Button>
                    </div>
                  </Col>
                </Row>

                /*<div className="card-btns d-flex justify-content-between">
                  <Button.Ripple
                    tag="label"
                    className="cursor-pointer"
                    color="primary"
                    onClick={this.uploadProfilePic}
                  >
                    Save
                  </Button.Ripple>
                  <Button.Ripple
                    color="primary"
                    outline
                    onClick={this.resetUploadPic}
                  >
                    Cancel
                  </Button.Ripple>
                </div>*/
              ) : null}
            </CardBody>
          </Card>
        </Col>
        <Col md="7" lg="5">
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardBody>
              <Formik
                initialValues={{
                  userId: user._id,
                  prefix: user.prefix,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  suffix: user.suffix,
                  gender: user.gender,
                  dateOfBirth: user.dateOfBirth,
                  email: user.email,
                  mobile: "1" + user.mobile,
                }}
                validationSchema={myProfileValidation}
                onSubmit={(values, actions) => {
                  this.formikActions = actions;

                  let newFormdata = Object.assign({}, values)
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
                            <Col xs="3" sm="2" md="3" className="pr-0">
                              <FormGroup className="position-relative inputpr">
                                <label htmlFor="prefix">Prefix</label>
                                <Field
                                  className={`form-control ${
                                    errors.prefix &&
                                    touched.prefix &&
                                    "is-invalid"
                                    }`}
                                  name="prefix"
                                  placeholder="Prefix"
                                  type="text"
                                  autofocus="true"
                                  onBlur={(e) => {
                                    handleBlur(e)
                                    setFieldValue("prefix", values.prefix.trim())
                                    }
                                  }
                                />
                                <ErrorMessage
                                  name="prefix"
                                  component="div"
                                  className="invalid-tooltip mt-25"
                                />
                              </FormGroup>
                            </Col>
                            <Col xs="9" sm="10" md="9">
                              <FormGroup className="position-relative">
                                <label htmlFor="firstName">First Name</label>
                                <Field
                                  className={`form-control ${
                                    errors.firstName &&
                                    touched.firstName &&
                                    "is-invalid"
                                    }`}
                                  name="firstName"
                                  placeholder="First name"
                                  type="text"
                                  onBlur={(e) => {
                                    handleBlur(e)
                                      setFieldValue("firstName", values.firstName.trim())
                                    }
                                  }

                                />
                                <ErrorMessage
                                  name="firstName"
                                  component="div"
                                  className="invalid-tooltip mt-25"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                        <Col md="12">
                          <Row>
                            <Col xs="8" sm="8" md="8" className="pr-0">
                              <FormGroup className="position-relative">
                                <label htmlFor="lastName">Last Name</label>
                                <Field
                                  className={`form-control ${
                                    errors.lastName &&
                                    touched.lastName &&
                                    "is-invalid"
                                    }`}
                                  name="lastName"
                                  placeholder="Last name"
                                  type="text"
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
                            <Col xs="4" sm="4" md="4">
                              <FormGroup className="position-relative ">
                                <label htmlFor="suffix">Suffix</label>
                                <Field
                                  className={`form-control ${
                                    errors.suffix &&
                                    touched.suffix &&
                                    "is-invalid"
                                    }`}
                                  name="suffix"
                                  placeholder="Suffix"
                                  type="text"
                                  onBlur={(e) => {
                                    handleBlur(e)
                                      setFieldValue("suffix", values.suffix.trim())
                                    }
                                  }
                                />
                                <ErrorMessage
                                  name="suffix"
                                  component="div"
                                  className="invalid-tooltip mt-25"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      {/*                     
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

                    <FormGroup>
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
                    </FormGroup> */}

                      <FormGroup className="position-relative">
                        <label htmlFor="mobile">Mobile Number</label>
                        <InputMask
                          className={`form-control ${
                            errors.mobile && touched.mobile && "is-invalid"
                            }`}
                          name="mobile"
                          placeholder="Mobile number"
                          value={values.mobile}
                          onChange={(val) => {
                            var pNumber = val.target.value.replace(/[^\d]/g, "");
                            // pNumber = pNumber.substring(1);
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
                        <Button
                          color="primary"
                          type="submit"
                          className="btn-block"
                          disabled={isSubmitting}
                        >
                          {loadingButton("Update", isSubmitting, "Updating...")}
                        </Button>
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
  // console.log("redux", state);
  const { auth } = state;
  return {
    authentication: auth.login,
    profilePicture: auth.login.profilePicture,
  };
};

export default connect(mapStateToProps, { updateUser, updateProfilePic })(
  MyProfile
);
