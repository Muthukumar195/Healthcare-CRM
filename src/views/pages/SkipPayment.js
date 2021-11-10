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
} from "reactstrap";
import {
  saveIntakeForm,
  getIntakeData,
} from "../../redux/actions/patientActions";
import { Formik, Field, Form, ErrorMessage } from "formik";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy";
import classnames from "classnames";

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

import WaitingImg from "../../assets/img/pages/waiting-for-doctor.jpg";

const google = window.google;

class SkipPayment extends React.Component {
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
      paymentProcessing: false
    };
    this.childRef = createRef();

    this.onSessionError = this.onSessionError.bind(this);

    this.sessionEventHandlers = {
      sessionConnected: () => {
        console.log(this.state);
        this.setState({ connection: "Connected" });
      },
      // sessionDisconnected: () => {
      //   console.log("session disconnected");
      //   this.setState({ connection: "Disconnected" });
      // },
      sessionReconnected: () => {
        console.log("session re connected");
        this.setState({ connection: "Reconnected" });
      },
      sessionReconnecting: () => {
        console.log("session re connecting");
        this.setState({ connection: "Reconnecting" });
      },
    };

    this.publisherEventHandlers = {
      accessDenied: () => {
        console.log("User denied access to media source");
      },
      streamCreated: () => {
        console.log("Publisher stream created");
      },
      streamDestroyed: ({ reason }) => {
        // alert();
        console.log(`Publisher stream destroyed because: ${reason}`);
      },
    };
    var _this = this;
    this.subscriberEventHandlers = {
      videoEnabled: () => {
        console.log("Subscriber video enabled");
      },
      videoDisabled: () => {
        console.log("Subscriber video disabled");
      },
      disconnected: function () {
        // Display a user interface notification.
        console.log("Subscriber disconnected");
      },
      connected: function () {
        // Adjust user interface.
        console.log("Subscriber connected");
        _this.setState({
          waitingMsg: "",
        });
      },

      destroyed: function (event) {
        // event.preventDefault();
        console.log("Subscriber destroyed", event);
        _this.setWaitingMsg();
      },
    };
  }

  onSessionError = (error) => {
    console.log("onSessionError");
    this.setState({ error: `Failed to connect: ${error.message}` });
  };

  onPublish = () => {
    console.log("Publish Success");
  };

  onPublishError = (error) => {
    console.log("onPublishError");
    this.setState({ error: `Failed to connect: ${error.message}` });
  };

  onSubscribe = () => {
    console.log("Subscribe Success");
  };

  onSubscribeError = (error) => {
    console.log("onSubscribeError");
    this.setState({ error: `Failed to connect: ${error.message}` });
  };

  toggleVideo = () => {
    this.setState((state) => ({
      publishVideo: !state.publishVideo,
    }));
  };

  toggleAudio = () => {
    this.setState((state) => ({
      publishAudio: !state.publishAudio,
    }));

    this.setState((state) => ({
      sessionDisconnect: !state.sessionDisconnect,
    }));
  };

  reSizeScreen = (value) => {
    this.state.fullScreen = value;
  };
  validateCardNumber = (value) => {
    // alert();
  };

  disconnect = () => {
    if (window.confirm("Do you want to disconnect the session?")) {
      this.props.disconnectSession({
        sessionId: this.props.sessionDetails.data.sessionId,
      });
      if (this.state.sessionHelper.session.connection != null) {
        this.state.sessionHelper.session.signal(
          {
            data: "disconnect",
          },
          function (error) {
            if (error) {
              console.log(
                "signal error (" + error.name + "): " + error.message
              );
            } else {
              console.log("signal sent.");
            }
          }
        );
      }

      // this.props.history.push(
      //   "/video/thankyou/" + this.props.sessionDetails.data.sessionId
      // );
    }
  };

  setWaitingMsg = () => {
    if (this.isDoctor()) {
      this.setState({
        waitingMsg: "Please wait until Patient connects the session",
      });
    } else {
      this.setState({
        waitingMsg: "Please wait until Doctor connects the session",
      });
    }
  };

  isDoctor = () => {
    return getUserRole() == "doctor" ? true : false;
  };

  componentDidUpdate(prevProps) {
    console.log("prevProps", prevProps);
    if (this.props.sessionDetails !== prevProps.sessionDetails) {
      if (
        this.props.sessionDetails.key != undefined &&
        this.props.sessionDetails.key == "disconnect"
      ) {
        console.log("disconnect");
      } else {
        if (this.props.sessionDetails.status) {
          console.log(this.props.sessionDetails);
          var sessionHelper = createSession({
            apiKey: "46761672",
            sessionId: this.props.sessionDetails.data.sessionId,
            token: this.props.sessionDetails.data.token,
            onStreamsUpdated: (streams) => {
              this.setState({ streams });
            },
            onStreamDestroyed: (streams) => {
              // alert();
            },
          });
          // this.props.sendWaitingNotificaiton(this.props.sessionDetails.data);
        } else {
          this.props.history.push("/video/expired-link");
          return false;
        }

        if (this.isDoctor()) {
          this.setState({
            publisherName: this.props.sessionDetails.data.doctorName,
          });
          if (this.props.sessionDetails.data.patientName != "") {
            this.setState({
              subscriberName: this.props.sessionDetails.data.patientName,
            });
          } else {
            this.setState({
              subscriberName: "Member",
            });
          }
          this.setWaitingMsg();
        } else {
          this.setState({
            subscriberName: this.props.sessionDetails.data.doctorName,
          });
          if (this.props.sessionDetails.data.patientName != "") {
            this.setState({
              publisherName: this.props.sessionDetails.data.patientName,
            });
          } else {
            this.setState({
              publisherName: "Member",
            });
          }
          this.setWaitingMsg();
        }

        if (this.props.sessionDetails.data.preferences != undefined) {
          if (this.props.sessionDetails.data.preferences.emrPreferenceId == 1) {
            this.setState({
              teleSrubsEmr: true,
            });
          } else if (
            this.props.sessionDetails.data.preferences.emrPreferenceId == 2
          ) {
            this.setState({
              teleSrubsEmr: false,
            });

            if (this.props.sessionDetails.data.preferences.iframeLink != "") {
              this.setState({
                iFrameEmr: true,
              });
            }
          }
        }

        this.setState({
          sessionHelper: sessionHelper,
        });
        console.log(sessionHelper);
        var _this = this;
        if (sessionHelper != "") {
          sessionHelper.session.on("connectionCreated", (event) => {
            if (this.isDoctor()) {
              console.log("*****Doctor connected*****");
            } else {
            }
          });
        }

        if (sessionHelper != "") {
          sessionHelper.session.on("streamDestroyed", function (event) {
            event.preventDefault();

            console.log("stream destroyed---->>", event);
          });

          var _props = this.props;
          sessionHelper.session.on("signal", function (event) {
            _props.history.push(
              "/video/thankyou/" + _props.sessionDetails.data.sessionId
            );
          });
        }
      }
    }

    // After Intake Form Saved
    if (this.props.intakeForm != prevProps.intakeForm) {
      if (this.props.intakeForm.status) {
        ToastSuccess(this.props.intakeForm.message)
        // this.props.getIntakeData();
        this.childRef.current.resetFiles();
        this.props.createPaymentIntent({
          appointmentId: this.props.match.params.token,
        });
        this.setState({ active: "Step-2" });
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
        this.props.history.push("/telescrubs/televisit/" + this.props.match.params.token);
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

      } else {
        this.props.history.push("/video/expired-link");
      }
    }
  }

  componentDidMount() {
    this.props.getIntakeData();
    this.props.getTeleVisitFee({ appointmentId: this.props.match.params.token });
    GeoCurrentPosition((position) => {
      this.setState({ latitude: position.lat, longitude: position.lng });
    });
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

  handleChange = (address) => {
    this.setState({ address });
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
      intakeFormData,
      deletedFiles,
      latitude,
      longitude,
    } = this.state;

    return (
      <React.Fragment>
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
          <NavItem>
            <NavLink
              className={classnames("p-1 shadow", {
                active: this.state.active === "Step-2",
              })}
            // onClick={() => {
            //   this.toggle("Step-3");
            // }}
            >
              <h3 className="mb-0">Step 2: Join TeleVisit Call</h3>
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
                            if (!values.hasDefaultPharmacy) {
                              values.pharmacy = this.state.address;
                              if (_.isEmpty(this.state.address)) {
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
                                        this.handleChange(val);
                                        setFieldValue("pharmacySearch", val);
                                        if (_.isEmpty(val)) {
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
                                              />
                                              <div className="form-c