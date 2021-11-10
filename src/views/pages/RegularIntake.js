import React, { Fragment, createRef } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Input,
  Media,
  Button,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Spinner,
  Progress,
  Container,
} from "reactstrap";
import {
  saveIntakeForm,
  getIntakeData,
} from "../../redux/actions/patientActions";
import { access } from "../../redux/actions/usersActions";
import { Formik, Field, Form, ErrorMessage } from "formik";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy";
import classnames from "classnames";
import logoImg from "../../assets/img/logo/logo.png";
import PaymentImg from "../../assets/img/pages/online-payment.jpg";
import PaymentCheck from "../../assets/img/pages/check-mark.png";

import { paymentValidation } from "../../components/FormValidation";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Check, Search, CreditCard } from "react-feather";
import { useDropzone } from "react-dropzone";
import { EditorState } from "draft-js";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../assets/scss/plugins/extensions/editor.scss";
import "../../assets/scss/plugins/extensions/dropzone.scss";
import loginImg from "../../assets/img/logo/logo.png";
import {
  MultiFileUploder,
  patientIntakeValidation,
  GeoCurrentPosition,
  ToastError,
  ToastSuccess,
} from "../../components";
import { IntakeFormImage } from "../../configs/ApiActionUrl";
import * as Icon from "react-feather";
import "@opentok/client";
import {
  getAppointmentToken,
  disconnectSession,
} from "../../redux/actions/videoActions";
import { getLoggedInToken, getUserRole } from "../../components/Auth";
import {
  OTSession,
  OTPublisher,
  OTStreams,
  OTSubscriber,
  createSession,
} from "opentok-react";
import "./video-chat/polyfills";
import {
  createPaymentIntent,
  saveAppointmentPayments,
  getTeleVisitFee,
} from "../../redux/actions/paymentActions";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  Elements,
  ElementsConsumer,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const google = window.google;

class RegularIntake extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.authentication.login.user,
      editorState: EditorState.createEmpty(),
      value: "",
      intakeFormData: [],
      formikActions: {},
      defaultPharmacy: false,
      thumbs: [],
      deletedFiles: [],
      address: "",
      searchErr: false,
      latitude: 0,
      longitude: 0,
      pharmacySearchErr: false,
      active: "Step-1",
      error: null,
      connection: "Connecting",
      publishVideo: true,
      publishAudio: true,
      subscriberVideo: true,
      forceDisconnet: false,
      streams: [],
      sessionId: null,
      token: null,
      sessionHelper: "",
      publisherName: "",
      subscriberName: "",
      hasVideoClosed: false,
      destroyed: false,
      waitingMsg: "",
      fullScreen: false,
      teleSrubsEmr: false,
      iFrameEmr: false,
      payment: [],
      appointment_payment_data: [],
      televisitFee: [],
      televisitFeeAmount: 0,
      paymentProcessing: false,
      skipPaymentPayment: false,

    };
    this.childRef = createRef();
  }



  isDoctor = () => {
    return getUserRole() == "doctor" ? true : false;
  };



  componentDidUpdate(prevProps) {
    // After Intake Form Saved
    if (this.props.intakeForm != prevProps.intakeForm) {
      console.log("Intake", this.props)
      if (this.props.intakeForm.status) {
        ToastSuccess(this.props.intakeForm.message)

        if (!this.props.televisitFee.hasSkipPayment) {
          this.props.getIntakeData();
          this.childRef.current.resetFiles();
          this.props.createPaymentIntent({
            appointmentId: this.props.match.params.token,
          });
          this.setState({ active: "Step-2" });
        } else {
          this.props.history.push("/telescrubs/televisit/" + this.props.intakeForm.authToken);
        }

      } else {
        ToastError(this.props.intakeForm.message)
      }
      this.state.formikActions.setSubmitting(false);
    }

    // After Payment Saved
    if (
      this.props.appointment_payment_data != prevProps.appointment_payment_data
    ) {
      console.log("payment updated");
      console.log("Payment Data", this.props.appointment_payment_data);
      if (this.props.appointment_payment_data.status) {
        console.log(this.props.appointment_payment_data);

        // toast.success(this.props.appointment_payment_data.message);
        this.setState({ paymentProcessing: false });
        this.props.history.push("/telescrubs/televisit/" + this.props.appointment_payment_data.redirect_id);
      }
    }

    // After Getting Televisit fee and validating isPaymentAuthorized
    if (this.props.televisitFee != prevProps.televisitFee) {

      if (this.props.televisitFee.status) {
        if (this.props.televisitFee.isPaymentAuthorized) {
          this.props.history.push("/telescrubs/televisit/" + this.props.match.params.token);
        } else {

          this.setState({ televisitFeeAmount: this.props.televisitFee.fee });
        }

        if (this.props.televisitFee.hasSkipPayment) {
          this.setState({ skipPaymentPayment: true });
        }

      } else {
        // this.props.history.push("/video/expired-link");
      }
    }

    if (prevProps.userAccess !== this.props.userAccess) {
      if (this.props.userAccess.status) {
        this.props.getIntakeData();
        this.props.getTeleVisitFee({ appointmentId: this.props.match.params.token });
        GeoCurrentPosition((position) => {
          this.setState({ latitude: position.lat, longitude: position.lng });
        });
      } else {
        this.props.history.push("/");
      }
    }
  }

  componentDidMount() {
    this.props.access({ module: "Appointment", id: this.props.match.params.token });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("NP", nextProps)
    if (nextProps.intakeFormData.status) {
      if (nextProps.intakeFormData.data != prevState.intakeFormData) {
        if (nextProps.intakeFormData.data == null) {
          console.log(nextProps);
          return { intakeFormData: { hasDefaultPharmacy: true } };
        }
        //  _.assignIn("hasDefaultPharmacy", true);
        return {
          intakeFormData: nextProps.intakeFormData.data,
          address: nextProps.intakeFormData.data.pharmacy,
        };
      }
    }
    if (nextProps.payment.status) {
      if (nextProps.payment.data != prevState.payment) {
        return { payment: nextProps.payment.data };
      }
    }

    if (nextProps.appointment_payment_data.status) {
      if (
        nextProps.appointment_payment_data.data !=
        prevState.appointment_payment_data
      ) {
        return { active: "Step-3" };
      }
    }
    return null;
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  onDeleteFile = (val) => {
    let deleted = [];
    deleted = this.state.deletedFiles;
    deleted.push(val);
    this.setState({ deletedFiles: deleted });
  };

  onChange = (event) => {
    let searchText = event.target.value.toLowerCase();
    this.setState({
      value: searchText,
    });
  };

  handleChange = (address, addressReset) => {

    var address1 = address.replace(/\s\s+/g, '')
    this.setState({ address: address1, addressReset: addressReset });
  };

  handleSelect = (address) => {
    console.log('palce' + address)

    this.setState({ address: address });

    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => console.log("Success", latLng))
      .catch((error) => console.error("Error", error));
  };

  toggle = (tab) => {
    if (this.state.active !== tab) {
      this.setState({ active: tab });
    }
  };

  submitButton = (button, isSubmitting) => {
    if (isSubmitting) {
      return (
        <Fragment>
          <Spinner color="white" size="sm" />
          <span className="ml-50">Authorizing payment...</span>
        </Fragment>
      );
    }
    return button;
  };

  render() {
    const {
      user,
      editorState,
      intakeFormData,
      thumbs,
      deletedFiles,
      latitude,
      longitude,
      error,

    } = this.state;
    const stripePromise = loadStripe(
      "pk_test_51HEoMTAWkhcS9lGWGKEhYX6FPtMKHdxagn2skEe6lG86s9gmicgBIVleJpt3Y9Cp5a2lOFQt9XcPZCGINezmz5JD00XVw2murX"
    );

    return (
      <React.Fragment>
        {this.props.televisitFee != "" ? (
          <div>
            <Nav pills className="nav-justified nav-pill-success">
              <NavItem>
                <NavLink
                  className={classnames("p-1 shadow", {
                    active: this.state.active === "Step-1",
                  })}
                // onClick={() => {
                //   this.toggle("Step-1");
                // }}
                >
                  <h3 className="mb-0">Step 1: Fill Intake Form</h3>
                </NavLink>
              </NavItem>
              {!this.state.skipPaymentPayment ? (
                <NavItem>
                  <NavLink
                    className={classnames("p-1 shadow", {
                      active: this.state.active === "Step-2",
                    })}
                  // onClick={() => {
                  //   this.toggle("Step-2");
                  // }}
                  >
                    <h3 className="mb-0">Step 2: Make Payment</h3>
                  </NavLink>
                </NavItem>
              ) : null}
              <NavItem>
                <NavLink
                  className={classnames("p-1 shadow", {
                    active: this.state.active === "Step-3",
                  })}
                // onClick={() => {
                //   this.toggle("Step-3");
                // }}
                >


                  <h3 className="mb-0">{!this.state.skipPaymentPayment ? "Step 3" : "Step 2"}: Join TeleVisit Call</h3>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.active}>
              <TabPane tabId="Step-1">
                <Row>
                  <Col md="12">
                    <Card>
                      <CardHeader>
                        <CardTitle className="w-100">
                          <Row>
                            <Col md="4">Patient Intake Form</Col>
                            <Col md="8" className="pl-0 text-right">
                              <ul className="patient-detail">
                                <li>
                                  {_.toUpper(user.lastName + ", " + user.firstName)}
                                </li>
                                <li>Mobile: {user.mobile}</li>
                                <li>Email: {user.email}</li>
                              </ul>
                            </Col>
                          </Row>
                        </CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col mx="1">
                            <Formik
                              enableReinitialize={true}
                              initialValues={intakeFormData}
                              onSubmit={(values, actions) => {
                                this.state.formikActions = actions;
                                values.deletedFiles = deletedFiles;
                                values.appointmentId = this.props.match.params.token;

                                if (!values.hasDefaultPharmacy) {
                                  values.pharmacy = this.state.address;
                                  if (_.isEmpty(this.state.address) || this.state.address === " ") {
                                    this.setState({ pharmacySearchErr: true });
                                  }
                                } else {
                                  this.setState({ pharmacySearchErr: false });
                                  values.pharmacy = "";
                                }
                                if (!this.state.pharmacySearchErr) {
                                  this.props.saveIntakeForm(values);
                                }
                                this.setState({ deletedFiles: [] });
                              }}
                              render={({
                                values,
                                errors,
                                touched,
                                setFieldValue,
                                isSubmitting,
                                handleReset,
                                setErrors,
                              }) => (
                                  <Form>
                                    <div className="search-bar">
                                      <h5>Pharmacy</h5>
                                      <div className="d-block">
                                        <Checkbox
                                          color="primary"
                                          icon={
                                            <Check className="vx-icon" size={12} />
                                          }
                                          checked={
                                            values.hasDefaultPharmacy ? true : false
                                          }
                                          onChange={() =>
                                            setFieldValue(
                                              "hasDefaultPharmacy",
                                              !values.hasDefaultPharmacy
                                            )
                                          }
                                          label="Default Pharmacy"
                                          size="sm"
                                        />
                                      </div>
                                      {!values.hasDefaultPharmacy ? (
                                        <PlacesAutocomplete
                                          value={this.state.address}
                                          onChange={(val) => {
                                            this.handleChange(val, intakeFormData.pharmacy);
                                            setFieldValue("pharmacySearch", val);
                                            if (_.isEmpty(val)) {
                                              alert(val)
                                              this.setState({
                                                pharmacySearchErr: true,
                                              });
                                            } else {
                                              this.setState({
                                                pharmacySearchErr: false,
                                              });
                                            }
                                          }}
                                          onSelect={this.handleSelect}
                                          searchOptions={{
                                            location: new google.maps.LatLng(
                                              latitude,
                                              longitude
                                            ),
                                            radius: 2000,
                                            types: ["address"],
                                          }}
                                        >
                                          {({
                                            getInputProps,
                                            suggestions,
                                            getSuggestionItemProps,
                                            loading,
                                            results
                                          }) => (
                                              <Fragment>
                                                <FormGroup className="position-relative has-icon-right">
                                                  <Input
                                                    type="text"
                                                    className="form-control"
                                                    name="pharmacySearch"
                                                    placeholder="Search"
                                                    {...getInputProps({
                                                      placeholder: "Search Pharmacy",
                                                      className: this.state
                                                        .pharmacySearchErr
                                                        ? "is-invalid"
                                                        : "",
                                                    })}
                                                    autoFocus
                                                  />
                                                  {!this.state.pharmacySearchErr ? <div className="form-control-position icon_1  ">
                                                    <Search size={15} />
                                                  </div> : ''}
                                                  {this.state.pharmacySearchErr ? (
                                                    <div className="invalid-tooltip mt-25 display-block">
                                                      Enter pharmacy keywords
                                            </div>
                                                  ) : null}
                                                </FormGroup>
                                                <div className="autocomplete-dropdown-container">
                                                  {loading && <div>Loading...</div>}
                                                  {suggestions.map((suggestion, i) => {
                                                    console.log(suggestion);
                                                    const className = suggestion.active
                                                      ? "suggestion-item--active"
                                                      : "suggestion-item";
                                                    // inline style for demonstration purpose
                                                    const style = suggestion.active
                                                      ? {
                                                        backgroundColor: "#fafafa",
                                                        cursor: "pointer",
                                                      }
                                                      : {
                                                        backgroundColor: "#ffffff",
                                                        cursor: "pointer",
                                                      };
                                                    return (
                                                      <Media
                                                        className="border p-1 mb-2"
                                                        key={i}
                                                      >
                                                        <Media className="w-100" body {...getSuggestionItemProps(
                                                          suggestion,
                                                        )}>
                                                          <h3 className="text-bold-400 mb-0">
                                                            <a
                                                              href=""
                                                              target="_blank"
                                                              rel="noopener noreferrer"
                                                            >
                                                              {suggestion.description}
                                                            </a>
                                                          </h3>
                                                          {/* <p className="mb-0">
                                                        {suggestion.PlaceId}
                                                      </p>
                                                      <p className="mb-0">
                                                        <span>Closed</span> - Open
                                                        tommorow 8 AM
                                                  </p>
                                                      <p className="mb-0">
                                                        Phone Number: 979-543-5565
                                                  </p> */}
                                                        </Media>
                                                      </Media>
                                                    );
                                                  })}
                                                </div>
                                              </Fragment>
                                            )}
                                        </PlacesAutocomplete>
                                      ) : null}

                                      <Card className="mb-0">
                                        <CardBody className="p-0">
                                          {values.hasDefaultPharmacy &&
                                            intakeFormData.defaultPharmacy ? (
                                              <Media className="border p-1 mb-2">
                                                <Media className="w-100" body>
                                                  <h3 className="text-bold-400 mb-0">
                                                    <a
                                                      href=""
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                    >
                                                      {
                                                        intakeFormData.defaultPharmacy
                                                          .name
                                                      }
                                                    </a>
                                                  </h3>
                                                  {/* <p className="mb-0">
                                                {
                                                  intakeFormData.defaultPharmacy
                                                    .address
                                                }
                                              </p>
                                              <p className="mb-0">
                                                {
                                                  intakeFormData.defaultPharmacy
                                                    .status
                                                }
                                              </p>
                                              <p className="mb-0">
                                                Phone Number:{" "}
                                                {
                                                  intakeFormData.defaultPharmacy
                                                    .phone
                                                }
                                              </p> */}
                                                </Media>
                                              </Media>
                                            ) : null}
                                          <Row>
                                            <Col md="6">
                                              <FormGroup>
                                                <label htmlFor="reason-for-visit">
                                                  <h5>Reason for Visit</h5>
                                                </label>
                                                <Field
                                                  name="visitReason"
                                                  className="form-control"
                                                  component="textarea"
                                                  placeholder=""
                                                  rows={2}
                                                  autoFocus
                                                  onBlur={
                                                    (val) => {
                                                      setFieldValue("visitReason", val.target.value.replace(/\s\s+/g, ' ').trim())
                                                    }
                                                  }

                                                />
                                              </FormGroup>
                                            </Col>

                                            <Col md="6">
                                              <FormGroup>
                                                <label htmlFor="past-medical-history">
                                                  <h5>
                                                    Past Medical / Surgical History
                                            </h5>
                                                </label>
                                                <Field
                                                  name="pastHistory"
                                                  className="form-control"
                                                  component="textarea"
                                                  placeholder=""
                                                  rows={2}
                                                  onBlur={
                                                    (val) => {
                                                      setFieldValue("pastHistory", val.target.value.replace(/\s\s+/g, ' ').trim())
                                                    }
                                                  }
                                                />
                                              </FormGroup>
                                            </Col>

                                            <Col md="6">
                                              <FormGroup>
                                                <label htmlFor="medications">
                                                  <h5>Medications</h5>
                                                </label>
                                                <Field
                                                  name="medications"
                                                  className="form-control"
                                                  component="textarea"
                                                  placeholder=""
                                                  rows={2}
                                                  onBlur={
                                                    (val) => {
                                                      setFieldValue("medications", val.target.value.replace(/\s\s+/g, ' ').trim())
                                                    }
                                                  }
                                                />
                                              </FormGroup>
                                            </Col>

                                            <Col md="6">
                                              <FormGroup>
                                                <label htmlFor="allergies">
                                                  <h5>Allergies</h5>
                                                </label>
                                                <Field
                                                  name="allergies"
                                                  className="form-control"
                                                  component="textarea"
                                                  placeholder=""
                                                  rows={2}
                                                  onBlur={
                                                    (val) => {
                                                      setFieldValue("allergies", val.target.value.replace(/\s\s+/g, ' ').trim())
                                                    }
                                                  }
                                                />
                                              </FormGroup>
                                            </Col>
                                          </Row>

                                          <FormGroup>
                                            <label htmlFor="attachments">
                                              <h5>Attachments</h5>
                                            </label>
                                            <MultiFileUploder
                                              deleteFile={this.onDeleteFile}
                                              setFieldValue={setFieldValue}
                                              initFiles={intakeFormData.images}
                                              ref={this.childRef}
                                            />
                                          </FormGroup>
                                        </CardBody>
                                      </Card>
                                    </div>

                                    <Row>
                                      <Col md={6}>
                                        <div className="ripple d-block mt-2">
                                          <Button.Ripple
                                            className="cursor-pointer btn-block "
                                            color="primary"
                                            outline
                                            onClick={() => {
                                              this.childRef.current.resetFiles();
                                              handleReset();
                                              this.setState({
                                                address: this.state.addressReset,
                                                pharmacySearchErr: intakeFormData.pharmacySearchErr

                                              })
                                            }}
                                            tag="label"
                                          >
                                            Reset
                                    </Button.Ripple>
                                        </div>
                                      </Col>
                                      {!this.state.skipPaymentPayment ? (
                                        <Col md={6}>
                                          <div className="ripple d-block mt-2">
                                            <Button.Ripple
                                              className="cursor-pointer btn-block"
                                              color="primary"
                                              type="submit"
                                            >
                                              Save &amp; Proceed to Pay
                                    </Button.Ripple>
                                          </div>
                                        </Col>
                                      ) : (
                                          <Col md={6}>
                                            <div className="ripple d-block mt-2">
                                              <Button.Ripple
                                                className="cursor-pointer btn-block"
                                                color="primary"
                                                type="submit"

                                              >
                                                Save &amp; Proceed
                                    </Button.Ripple>
                                            </div>
                                          </Col>
                                        )}
                                    </Row>
                                  </Form>
                                )}
                            />
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              <TabPane className="tab-two" tabId="Step-2">
                <Elements stripe={stripePromise}>
                  <ElementsConsumer>
                    {({ elements, stripe }) => (
                      <Card>
                        <CardBody>
                          <Row className="m-0 justify-content-center">
                            <Col
                              md="9"
                              className="d-flex justify-content-center p-0"
                            >
                              <Card className="border mb-0 p-1">
                                <CardHeader>
                                  <CardTitle className="w-100">
                                    <Row>
                                      <Col md="8" className="pr-0">
                                        <h4 className="mb-0">
                                          Payment Information
                                    </h4>
                                      </Col>
                                      <Col md="4" className="pl-0">
                                        <h3 className="mb-0 text-danger text-right">
                                          ${this.state.televisitFeeAmount}
                                        </h3>
                                      </Col>
                                    </Row>
                                  </CardTitle>
                                </CardHeader>
                                <CardBody>
                                  <Formik
                                    enableReinitialize={true}
                                    validationSchema={paymentValidation}
                                    initialValues={{
                                      nameOnCard: "",
                                      city: "",
                                      address: "",
                                      postal_code: "",
                                      state: "",
                                      cardnumber: "",
                                      'exp-date': "",
                                      cvc: ''
                                    }}
                                    onSubmit={async (values, actions) => {
                                      this.setState({ active: "Step-3" });
                                      this.setState({ paymentProcessing: true });

                                      console.log(values);
                                      // this.props.updatePreferences(values);
                                      const payload = await stripe.confirmCardPayment(
                                        this.state.payment.client_secret,
                                        {
                                          payment_method: {
                                            card: elements.getElement(
                                              CardNumberElement
                                            ),
                                            card: elements.getElement(
                                              CardExpiryElement
                                            ),
                                            card: elements.getElement(
                                              CardCvcElement
                                            ),
                                            billing_details: {
                                              name: values.nameOnCard,
                                              address: {
                                                city: values.city,
                                                line1: values.address,
                                                postal_code: values.postal_code,
                                                state: values.state,
                                              },
                                            },
                                          },
                                        }
                                      );

                                      if (payload.error) {
                                        console.log("[error]", payload.error);
                                      } else {
                                        console.log(
                                          "[PaymentIntent]",
                                          payload.paymentIntent
                                        );
                                        const data = {
                                          intentData: payload.paymentIntent,
                                          appointmentId:
                                            this.props.match.params.token,
                                        };
                                        this.props.saveAppointmentPayments(data);
                                      }
                                    }}
                                    render={({
                                      values,
                                      errors,
                                      touched,
                                      isSubmitting,
                                      setFieldValue,
                                    }) => (
                                        <Form>
                                          <FormGroup className="form-label-group">
                                            <Field
                                              type="text"
                                              placeholder="Name on Card"
                                              name="nameOnCard"
                                              id="name-on-card"
                                              className={`form-control ${
                                                errors.nameOnCard &&
                                                touched.nameOnCard &&
                                                "is-invalid"
                                                }`}
                                              onBlur={
                                                (val) => {
                                                  setFieldValue("nameOnCard", val.target.value.replace(/\s\s+/g, ' ').trim())
                                                }
                                              }
                                              size="lg"
                                              autoFocus
                                            />
                                            <ErrorMessage
                                              name="nameOnCard"
                                              component="div"
                                              className="invalid-tooltip mt-25"
                                            />
                                          </FormGroup>

                                          <FormGroup className="position-relative has-icon-right  ">

                                            <CardNumberElement
                                              onChange={(val) => {
                                                console.log(val)
                                                if (val.complete === true) {
                                                  setFieldValue('cardnumber', val.complete)
                                                }
                                                else if (val.complete === false) {
                                                  setFieldValue('cardnumber', '')
                                                }
                                              }}

                                              options={{
                                                classes: {
                                                  base: `form-control pl-1 ${
                                                    errors.cardnumber &&
                                                    touched.cardnumber &&
                                                    "is-invalid"
                                                    }`,
                                                },
                                                placeholder: "Card Number",
                                                style: {
                                                  base: {
                                                    "::placeholder": {
                                                      color: "#d9d9d9",
                                                    },
                                                  },
                                                  invalid: {
                                                    color: "#9e2146",
                                                  },
                                                },
                                              }}
                                            />
                                            <ErrorMessage
                                              name="cardnumber"
                                              component="div"
                                              className="invalid-tooltip mt-25 pr-5"
                                            />
                                            {(!errors.cardnumber && touched.cardnumber) || !errors.cardnumber ? <div className="form-control-position pr-1 ">
                                              <CreditCard size={22} />
                                            </div> : ''}
                                          </FormGroup>
                                          <Row>
                                            <Col md="8">
                                              <FormGroup className="position-relative ">
                                                <CardExpiryElement

                                                  id="Asdas"
                                                  onChange={(val) => {
                                                    if (val.complete === true) {
                                                      setFieldValue('exp-date', val.complete)
                                                    }
                                                    else if (val.complete === false) {
                                                      setFieldValue('exp-date', '')
                                                    }
                                                  }}

                                                  options={{
                                                    classes: {
                                                      base: `form-control ${
                                                        errors['exp-date'] &&
                                                        touched['exp-date'] &&
                                                        "is-invalid"
                                                        }`,
                                                    },
                                                    placeholder:
                                                      "Card Expiry (MM/YY)",
                                                    style: {
                                                      base: {
                                                        "::placeholder": {
                                                          color: "#d9d9d9",
                                                        },
                                                      },
                                                      invalid: {
                                                        color: "#9e2146",
                                                      },
                                                    },
                                                  }}
                                                />
                                                <ErrorMessage
                                                  name="exp-date"
                                                  component="div"
                                                  className="invalid-tooltip mt-25"
                                                />
                                              </FormGroup>
                                            </Col>
                                            <Col md="4">
                                              <FormGroup className="position-relative ">
                                                <CardCvcElement
                                                  onChange={(val) => {
                                                    if (val.complete === true) {
                                                      setFieldValue('cvc', val.complete)
                                                    }
                                                    else if (val.complete === false) {
                                                      setFieldValue('cvc', '')
                                                    }
                                                  }}

                                                  options={{
                                                    classes: {
                                                      base: `form-control ${
                                                        errors.cvc &&
                                                        touched.cvc &&
                                                        "is-invalid"
                                                        }`,
                                                    },
                                                    placeholder: "CVV",
                                                    style: {
                                                      base: {
                                                        fontWeight: 400,
                                                        "::placeholder": {
                                                          color: "#d9d9d9",
                                                        },
                                                      },
                                                      invalid: {
                                                        color: "#9e2146",
                                                      },
                                                    },
                                                  }}
                                                />
                                                <ErrorMessage
                                                  name="cvc"
                                                  component="div"
                                                  className="invalid-tooltip mt-25"
                                                />
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                          <FormGroup className="form-label-group position-relative">
                                            <Field
                                              type="text"
                                              placeholder="Address"
                                              name="address"
                                              id="address"
                                              className={`form-control ${
                                                errors.address &&
                                                touched.address &&
                                                "is-invalid"
                                                }`}
                                              onBlur={
                                                (val) => {
                                                  setFieldValue("address", val.target.value.replace(/\s\s+/g, ' ').trim())
                                                }
                                              }
                                              size="lg"
                                            />
                                            <ErrorMessage
                                              name="address"
                                              component="div"
                                              className="invalid-tooltip mt-25"
                                            />
                                          </FormGroup>
                                          <FormGroup className="position-relative" >
                                            <Field
                                              type="text"
                                              placeholder="City"
                                              name="city"
                                              id="city"
                                              className={`form-control ${
                                                errors.city &&
                                                touched.city &&
                                                "is-invalid"
                                                }`}
                                              onBlur={
                                                (val) => {
                                                  setFieldValue("city", val.target.value.replace(/\s\s+/g, ' ').trim())
                                                }
                                              }
                                              size="lg"
                                            />
                                            <ErrorMessage
                                              name="city"
                                              component="div"
                                              className="invalid-tooltip mt-25"
                                            />
                                          </FormGroup>
                                          <Row>
                                            <Col md="6">
                                              <FormGroup className="position-relative ">
                                                <Field
                                                  type="text"
                                                  placeholder="State"
                                                  name="state"
                                                  id="state"
                                                  className={`form-control ${
                                                    errors.state &&
                                                    touched.state &&
                                                    "is-invalid"
                                                    }`}
                                                  onBlur={
                                                    (val) => {
                                                      setFieldValue("state", val.target.value.replace(/\s\s+/g, ' ').trim())
                                                    }
                                                  }
                                                  size="lg"
                                                />
                                                <ErrorMessage
                                                  name="state"
                                                  component="div"
                                                  className="invalid-tooltip mt-25"
                                                />
                                              </FormGroup>
                                            </Col>

                                            <Col md="6">
                                              <FormGroup className="position-relative ">
                                                <Field
                                                  type="number"
                                                  onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()}

                                                  step="1"

                                                  placeholder="ZIP"
                                                  name="postal_code"
                                                  id="zip"
                                                  className={`form-control ${
                                                    errors.postal_code &&
                                                    touched.postal_code &&
                                                    "is-invalid"
                                                    }`}
                                                  onBlur={
                                                    (val) => {
                                                      setFieldValue("postal_code", val.target.value.replace(/\s\s+/g, ' ').trim())
                                                    }
                                                  }
                                                  size="lg"
                                                />
                                                <ErrorMessage
                                                  name="postal_code"
                                                  component="div"
                                                  className="invalid-tooltip mt-25"
                                                />
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                          <div className="d-block ripple pay-btn">
                                            <Button.Ripple
                                              color="primary"
                                              type="submit"
                                              className="btn-block"
                                              size="lg"
                                              disabled={isSubmitting}
                                            >
                                              {this.submitButton(
                                                "Pay & Join TeleVisit",
                                                isSubmitting
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
                        </CardBody>
                      </Card>
                    )}
                  </ElementsConsumer>
                </Elements>
              </TabPane>

              <TabPane tabId="Step-3">
                <Row className="d-flex py-5 align-items-center justify-content-center m-0">
                  <Col md="6" className="px-md-0 px-2">
                    {this.state.paymentProcessing ? (<Card className="mb-0">
                      <CardHeader className="justify-content-center">
                        <img src={PaymentImg} alt="Payment" className="img-fluid width-350 mt-1" />
                      </CardHeader>
                      <CardBody className="text-center">
                        {/* <Progress className="progress-xl" animated color="warning" value={75} /> */}
                        <Spinner color="primary" size="lg" className="mb-2" />
                        <h2>Payment being processed. Please wait</h2>
                      </CardBody>
                    </Card>) :

                      (<Card className="mb-0">
                        <CardHeader className="justify-content-center">
                          <img src={PaymentCheck} alt="Payment Complete" className="img-fluid width-350 mt-1" />
                          <h2>Payment Authorization Successful</h2>
                        </CardHeader>
                        <CardBody className="text-center">
                          {/* <Progress className="progress-xl" animated color="success" value={100} /> */}
                        </CardBody>
                      </Card>)}


                  </Col>
                </Row>

                {/*
            {this.state.sessionHelper != "" ? (
              <Card className="televisit-call">
                <CardBody className="p-1">
                  <Container
                    fluid={true}
                    className={`video-chat-wrap ${
                      this.state.fullScreen ? "" : "max-scale"
                    }`}
                  >*/}
                {/* <OTSession
                      apiKey={apiKey}
                      sessionId={sessionId}
                      token={token}
                      onError={this.onSessionError}
                      eventHandlers={this.sessionEventHandlers}
                    > */}
                {/*<Row>
                      <Col md="12" lg="4" xl="4">
                        <Row>
                          <Col
                            md="6"
                            lg="12"
                            xl="12"
                            className="doc-full-scale"
                            id="publisher"
                          >
                            <Card>
                              <CardBody className="bg-black user-bg">
                                <div className="watermark"></div>
                                <div className="payment-info">
                                  <h3>Payment Authorization Successfull</h3>
                                  <h4>Please Wait for the doctor to join</h4>
                                </div>
                                <div className="pos-rt">
                                  <div
                                    className="fonticon-wrap cursor-pointer maximize-icon"
                                    onClick={(e) => {
                                      this.setState({ fullScreen: true });
                                    }}
                                  >
                                    <Icon.Maximize
                                      size={18}
                                      className="fonticon-wrap"
                                    />
                                  </div>
                                  <div
                                    className="fonticon-wrap cursor-pointer minimize-icon"
                                    onClick={(e) => {
                                      this.setState({ fullScreen: false });
                                    }}
                                  >
                                    <Icon.Minimize
                                      size={18}
                                      className="fonticon-wrap"
                                    />
                                  </div>
                                </div>
                                <div className="subscriber-name">
                                  {this.state.waitingMsg != ""
                                    ? this.state.waitingMsg
                                    : this.state.subscriberName}
                                </div>

                                {this.state.streams.map((stream) => {
                                  return (
                                    <OTSubscriber
                                      properties={{
                                        width: "100%",
                                        height: "100%",
                                        style: { buttonDisplayMode: "off" },
                                        // name: this.state.subscriberName,
                                      }}
                                      key={stream.id}
                                      session={this.state.sessionHelper.session}
                                      onSubscribe={this.onSubscribe}
                                      onError={this.onSubscribeError}
                                      eventHandlers={
                                        this.subscriberEventHandlers
                                      }
                                      stream={stream}
                                    ></OTSubscriber>
                                  );
                                })}
                                <div className="cancel-televisit">
                                  <Button.Ripple
                                    color="primary"
                                    className="square"
                                  >
                                    Cancel TeleVisit
                                  </Button.Ripple>
                                </div>
                              </CardBody>
                            </Card>
                          </Col>

                          <Col
                            md="6"
                            lg="12"
                            xl="12"
                            className={`doc-mini-scale ${
                              this.state.hasVideoClosed ? "add-video" : ""
                              }`}
                            id="subscribers"
                          >
                            <Card>
                              <CardBody className="bg-black">
                                <div className="video-controls">
                                  <Button
                                    color="primary"
                                    className="btn-icon rounded-circle mr-1"
                                    onClick={this.toggleAudio}
                                  >
                                    {publishAudio ? (
                                      <div className="fonticon-wrap">
                                        <Icon.Mic
                                          size={14}
                                          className="fonticon-wrap"
                                        />
                                      </div>
                                    ) : (
                                        <div className="fonticon-wrap">
                                          <Icon.MicOff
                                            size={14}
                                            className="fonticon-wrap"
                                          />
                                        </div>
                                      )}
                                  </Button>
                                  <Button
                                    color="primary"
                                    className="btn-icon rounded-circle mr-1 eye-btn"
                                    onClick={() => {
                                      this.setState({ hasVideoClosed: false });
                                    }}
                                  >
                                    <div className="fonticon-wrap">
                                      <Icon.Eye
                                        size={14}
                                        className="fonticon-wrap"
                                      />
                                    </div>
                                  </Button>
                                  <Button
                                    color="primary"
                                    className="btn-icon rounded-circle mr-1"
                                    onClick={this.toggleVideo}
                                  >
                                    {publishVideo ? (
                                      <div className="fonticon-wrap">
                                        <Icon.Video
                                          size={14}
                                          className="fonticon-wrap"
                                        />
                                      </div>
                                    ) : (
                                        <div className="fonticon-wrap">
                                          <Icon.VideoOff
                                            size={14}
                                            className="fonticon-wrap"
                                          />
                                        </div>
                                      )}
                                  </Button>

                                  <Button
                                    color="danger"
                                    className="btn-icon rounded-circle mr-1"
                                    onClick={this.disconnect}
                                  >
                                    <div className="fonticon-wrap">
                                      <Icon.Phone
                                        size={14}
                                        className="fonticon-wrap"
                                      />
                                    </div>
                                  </Button>
                                </div>

                                <div className="fonticon-wrap cursor-pointer pos-rt">
                                  <Icon.X
                                    size={18}
                                    className="fonticon-wrap"
                                    onClick={() => {
                                      this.setState({ hasVideoClosed: true });
                                    }}
                                  />
                                </div>
                                {!this.state.hasVideoClosed ? (
                                  <div className="publisher-name">
                                    {this.state.publisherName}
                                  </div>
                                ) : null}
                                <OTPublisher
                                  properties={{
                                    width: "100%",
                                    height: "100%",
                                    style: { buttonDisplayMode: "off" },
                                    publishVideo,
                                    publishAudio,
                                    // name: this.state.publisherName,
                                  }}
                                  session={this.state.sessionHelper.session}
                                  onPublish={this.onPublish}
                                  onError={this.onPublishError}
                                  eventHandlers={this.publisherEventHandlers}
                                ></OTPublisher>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      </Col>
                    </Row>*/}
                {/* </OTSession> */}
                {/*</Container>
                </CardBody>
              </Card>
            ) : null}
          */}
              </TabPane>
            </TabContent>
          </div>
        ) : null}

        {this.state.paymentProcessing ? (
          <Row className="d-flex align-items-center justify-content-center m-0 paymentload vc-loader opacity-0">

          </Row>
        ) : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, patient, payment, video, users } = state;
  console.log(users);
  return {
    authentication: auth.login,
    intakeForm: patient.intakeForm,
    intakeFormData: patient.intakeFormData,
    payment: payment.intent,
    appointment_payment_data: payment.appointment_payment_status,
    sessionDetails: video.sessionDetails,
    televisitFee: payment.televisit_fee,
    userAccess: users.userAccess
  };
};

export default connect(mapStateToProps, {
  saveIntakeForm,
  getIntakeData,
  access,
  createPaymentIntent,
  saveAppointmentPayments,
  getAppointmentToken,
  disconnectSession,
  getTeleVisitFee,
})(RegularIntake);
