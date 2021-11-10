import React from "react";
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
  Button,
  Label,
} from "reactstrap";

import { Formik, Field, Form, ErrorMessage } from "formik";
import {
  updatePreferences,
  getPreferences,
} from "../../redux/actions/usersActions";
import Radio from "../../components/@vuexy/radio/RadioVuexy";
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy";
import { Check, DollarSign } from "react-feather";
import { loadingButton, ToastError, ToastSuccess, auditLog } from "../../components";
import { emrvalidation, feePerVisitvalidation } from "../../components/FormValidation";

const formValues = {
  emrPreferenceId: "",
  iframeLink: "",
  paymentPreferenceId: "",
  feePerVisit: "",
  hasIframeLink: false,
  hasSkipPayment: false,
};

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: "1",
      preferences: [],
      formikActions: {},
      urlshow: false,
      hasSkipPayment: false
    };
    this.formikActions = {};
  }

  componentDidMount() {
    this.props.getPreferences();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.preferences.status) {
      if (nextProps.preferences.data != prevState.preferences) {
        _.assignIn(formValues, nextProps.preferences.data);
        if (formValues.iframeLink != "") {
          formValues.hasIframeLink = true;
        }
        return { preferences: nextProps.preferences.data };
      }
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.settings != prevProps.settings) {
      if (this.props.settings.status) { 
        auditLog("M1 Settings", `Settings Updated successfully`)
        ToastSuccess(this.props.settings.message)
        this.props.getPreferences();
      } else {
        auditLog("M1 Settings", `Settings Updated Failed`)
        ToastError(this.props.settings.message)
      }
      this.formikActions.setSubmitting(false);
    }
  }
  render() {
    const { user, active, preferences } = this.state;
    return (
      <React.Fragment>
        <Row>
          <Col md="5" sm="6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>

              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={formValues}
                  validationSchema={emrvalidation}
                  onSubmit={(values, actions) => {
                    this.formikActions = actions;
                    this.props.updatePreferences(values);
                  }}
                  render={({ values, isSubmitting, setFieldValue, setValues, errors, touched, resetForm }) => (
                    <Form>
                      <FormGroup className="border p-1">
                        <Label for="emrPreferenceId" className="d-block mb-50">
                          <h5>EMR Preference</h5>
                        </Label>

                        <div className="d-inline-block mr-2">
                          <Radio
                            label="TeleScrubs Template"
                            color="primary"
                            name="emrPreferenceId"
                            size="md"
                            onChange={() => setFieldValue("emrPreferenceId", 1)}
                            checked={values.emrPreferenceId === 1}
                            value="1"
                          />
                        </div>
                        <div className="d-inline-block">
                          <Radio
                            label="Use OWN EMR"
                            color="primary"
                            name="emrPreferenceId"
                            size="md"
                            onChange={() => setFieldValue("emrPreferenceId", 2)}
                            checked={values.emrPreferenceId === 2}
                            value="2"
                          />
                        </div>

                        {values.emrPreferenceId === 2 ? (
                          <div className="d-block mt-1 mb-0">
                            <Checkbox
                              color="primary"
                              icon={<Check className="vx-icon" size={16} />}
                              label="Integrate with OWN EMR"
                              size="md"
                              name="hasIframeLink"
                              checked={values.hasIframeLink}
                              onChange={() => {

                                setFieldValue(
                                  "hasIframeLink",
                                  !values.hasIframeLink
                                )
                                formValues.hasIframeLink = !values.hasIframeLink
                              }
                              }
                            />
                          </div>
                        ) : null}
                        {values.hasIframeLink && values.emrPreferenceId == 2 ? (
                          <FormGroup className="mb-0 position-relative">
                            <Field
                              className="form-control"
                              type="text"
                              placeholder="Enter EMR URL"
                              name="iframeLink"
                              className={`form-control ${
                                errors.iframeLink &&
                                touched.iframeLink &&
                                "is-invalid"
                                }`}
                              onBlur={
                                () => {
                                  setFieldValue("iframeLink", values.iframeLink.trim())
                                }
                              }
                            />
                            <ErrorMessage
                              name="iframeLink"
                              component="div"
                              className="invalid-tooltip mt-25"
                            />
                          </FormGroup>
                        ) : ''}
                      </FormGroup>

                      <FormGroup className="border p-1">
                        <Label
                          for="paymentPreferenceId"
                          className="d-block mb-50"
                        >
                          <h5>Payment Preference</h5>
                        </Label>
                        <div className="d-inline-block mr-2">
                          <Radio
                            label="Insurance"
                            color="primary"
                            name="paymentPreferenceId"
                            size="md"
                            disabled
                            className="cursor-not-allowed"
                            onChange={() =>
                              setFieldValue("paymentPreferenceId", 1)
                            }
                            checked={values.paymentPreferenceId === 1}
                            value="1"
                          />
                        </div>
                        <div className="d-inline-block">
                          <Radio
                            label="Cash Payment"
                            color="primary"
                            name="paymentPreferenceId"
                            size="md"
                            onChange={() => {
                              setFieldValue("paymentPreferenceId", 2);
                            }}
                            checked={values.paymentPreferenceId === 2}
                            value="2"
                          />
                        </div>
                        {values.paymentPreferenceId === 2 ? (
                          <div className="d-block mt-1">
                            <Label for="feePerVisit">Fee per TeleVisit</Label>
                            <FormGroup className="has-icon-left position-relative mb-0">
                              <Field
                                className={`form-control ${
                                  errors.feePerVisit &&
                                  touched.feePerVisit &&
                                  "is-invalid"
                                  }`}
                                onBlur={
                                  (val) => {
                                    setFieldValue("feePerVisit", val.target.value.trim())
                                  }
                                }
                                id="teleVisitCost"
                                placeholder="Enter Fee"
                                type="text"
                                name="feePerVisit"
                                disabled={formValues.hasSkipPayment == true && values.hasSkipPayment == true ? true : false}
                              />
                              <div className="form-control-position">
                                <DollarSign size={15} />
                              </div>
                              <ErrorMessage
                                name="feePerVisit"
                                component="div"
                                className="invalid-tooltip mt-25"
                              />
                            </FormGroup>
                            <Checkbox
                              color="primary"
                              icon={<Check className="vx-icon" size={12} />}
                              label="Skip Payment"
                              size="sm"
                              name="hasSkipPayment"
                              onChange={() => {
                                setFieldValue(
                                  "hasSkipPayment",
                                  !values.hasSkipPayment
                                )
                                formValues.hasSkipPayment = !values.hasSkipPayment

                              }}
                              checked={values.hasSkipPayment}
                            />
                          </div>
                        ) : null}
                      </FormGroup>

                      <Row>
                        <Col md={6}>
                          <div className="ripple d-block  mb-1">
                            <Button
                              tag="label"
                              color="primary"
                              outline
                              className="cursor-pointer btn-block" 
                              onClick={()=>{ 
                                console.log(this.state.preferences);
                                var reset = {...this.state.preferences};
                                reset.hasIframeLink = false;
                                if (formValues.iframeLink != "") { 
                                  reset.hasIframeLink = true;
                                } 
                               setValues(reset); 
                              }}
                            >
                              Reset
                            </Button>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="ripple d-block">
                            <Button
                              type="submit"
                              className="cursor-pointer btn-block"
                              color="primary"
                              disabled={isSubmitting}
                            >
                              {loadingButton("Save", isSubmitting, "Updating...")}
                            </Button>
                          </div>
                        </Col>
                      </Row>

                      {/* <div className="card-btns d-flex justify-content-between mt-2">
                        <Button.Ripple
                          type="submit"
                          className="cursor-pointer"
                          color="primary"
                          disabled={isSubmitting}
                        >
                          {loadingButton("Save", isSubmitting, "Updating...")}
                        </Button.Ripple>

                        <Button.Ripple
                          tag="label"
                          color="primary"
                          outline
                          onClick={this.handleCancel}
                        >
                          Cancel
                        </Button.Ripple>
                      </div> */}
                    </Form>
                  )}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { users } = state;
  return {
    settings: users.settings,
    preferences: users.getPerferences,
  };
};

export default connect(mapStateToProps, { updatePreferences, getPreferences })(
  Settings
);
