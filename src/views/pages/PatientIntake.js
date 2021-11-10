import React, { Fragment, createRef } from "react";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

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
} from "reactstrap";
import {
  saveIntakeForm,
  getIntakeData,
} from "../../redux/actions/patientActions";
import { Formik, Field, Form, ErrorMessage } from "formik";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy";
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from "react-places-autocomplete";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "../../components/react-places-autocomplete";
import { Check, Search } from "react-feather";
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
  ToastSuccess,
  ToastError,
} from "../../components";
import { IntakeFormImage } from "../../configs/ApiActionUrl";
const google = window.google;

class PatientIntake extends React.Component {
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
      address1: "",
      searchErr: false,
      latitude: 0,
      longitude: 0,
      pharmacySearchErr: false,
    };
    this.childRef = createRef();
  }

  componentDidMount() {
    this.props.getIntakeData();
    GeoCurrentPosition((position) => {
      this.setState({ latitude: position.lat, longitude: position.lng });
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("NP", nextProps);
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
    return null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.intakeForm != prevProps.intakeForm) {
      if (this.props.intakeForm.status) {
        ToastSuccess(this.props.intakeForm.message)
        this.props.getIntakeData();
        this.childRef.current.resetFiles();
      } else {
        ToastError(this.props.intakeForm.message)
      }
      this.state.formikActions.setSubmitting(false);
    }
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
    this.setState({ address: address, addressReset: addressReset });
  };

  handleSelect = (address) => {
    this.setState({ address: address });
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => console.log("Success", latLng))
      .catch((error) => console.error("Error", error));
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
    } = this.state;

    console.log(intakeFormData)
    return (
      <React.Fragment>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle className="w-100">
                  <Row>
                    <Col md="12" lg="4">Patient Intake Form</Col>
                    <Col md="12" lg="8" className="pl-0 text-right">
                      <ul className="patient-detail">
                        <li>{_.toUpper(user.lastName + ", " + user.firstName)}</li>
                        <li>Mobile: {user.mobile}</li>
                        <li>Email: {user.email}</li>
                      </ul>
                    </Col>
                  </Row>
                </CardTitle>
              </CardHeader>
              <CardBody>
                {/* <Row>
                  <Col mx="1">
                    <h4>
                      <strong>
                        {_.toUpper(user.lastName + ", " + user.firstName)}
                      </strong>
                    </h4>
                  </Col>
                </Row>
                <Row>
                  <Col md="3">
                    <h5 className="mb-0">DOB: 05/22/2001</h5>
                  </Col>
                  <Col md="4">
                    <h5 className="mb-0">Mobile Number: {user.mobile}</h5>
                  </Col>
                  <Col md="4">
                    <h5 className="mb-0">Email: {user.email}</h5>
                  </Col>
                </Row>
                <hr /> */}
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
                                  icon={<Check className="vx-icon" size={12} />}
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
                                      this.setState({ pharmacySearchErr: true });
                                    } else {
                                      this.setState({ pharmacySearchErr: false });
                                    }
                                  }}

                                  onSelect={this.handleSelect}
                                  searchOptions={{
                                    location: new google.maps.LatLng(
                                      latitude,
                                      longitude
                                    ),
                                    radius: 2000,
                                    //types: ["pharmacy"],
                                  }}
                                >
                                  {({
                                    getInputProps,
                                    suggestions,
                                    getSuggestionItemProps,
                                    loading,
                                  }) => (
                                      <Fragment>
                                        <FormGroup className="position-relative has-icon-right">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            name="pharmacySearch"
                                            placeholder="Search"
                                            autoFocus
                                            {...getInputProps({
                                              placeholder: "Search Pharmacy",
                                              className: this.state
                                                .pharmacySearchErr
                                                ? "is-invalid"
                                                : "",
                                            })}
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
                                            console.log(suggestions);
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
                                              <Media className="border p-1 mb-2"   {...getSuggestionItemProps(
                                                suggestion,
                                              )} key={i}>
                                                <Media className="w-100" body>
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
                                                3902 Main St, Kansas City - (816) 931-5452
                                              </p>
                                              <p className="mb-0">
                                                <span>Closed</span> - Open tommorow 8 AM
                                              </p>
                                              <p className="mb-0">Phone Number: 979-543-5565</p> */}
                                                </Media>
                                              </Media>
                                              /*<div
                                                {...getSuggestionItemProps(
                                                  suggestion,
                                                  {
                                                    className,
                                                    style,
                                                  }
                                                )}
                                                key={i}
                                              >
                                                <span>
                                                  {suggestion.description}
                                                </span>
                                              </div>*/
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
                                              {intakeFormData.defaultPharmacy.name}
                                            </a>
                                          </h3>
                                          {/* <p className="mb-0">
                                        {intakeFormData.defaultPharmacy.address}
                                      </p>
                                      <p className="mb-0">
                                        {intakeFormData.defaultPharmacy.status}
                                      </p>
                                      <p className="mb-0">
                                        Phone Number:{" "}
                                        {intakeFormData.defaultPharmacy.phone}
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
                                          <h5>Past Medical / Surgical History</h5>
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
                              <Col xs={6} sm={6} md={6}>
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
                              <Col xs={6} sm={6} md={6}>
                                <div className="ripple d-block mt-2">
                                  <Button.Ripple
                                    className="cursor-pointer btn-block"
                                    color="primary"
                                    type="submit"
                                  >
                                    Submit
                                </Button.Ripple>
                                </div>
                              </Col>
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, patient } = state;
  return {
    authentication: auth.login,
    intakeForm: patient.intakeForm,
    intakeFormData: patient.intakeFormData,
  };
};

export default connect(mapStateToProps, { saveIntakeForm, getIntakeData })(
  PatientIntake
);
