import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Row, Col } from "reactstrap";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  FormGroup,
} from "reactstrap";
import escapeStringRegexp from 'escape-string-regexp';
import Autosuggest from "react-autosuggest";
import PerfectScrollbar from "react-perfect-scrollbar";
import InputMask from "react-input-mask";
import { loadingButton, ToastSuccess, ToastError, auditLog } from "../../components";
import { getPatient, sendInvite } from "../../redux/actions/patientActions";
import _ from "lodash";
import moment from "moment";
const getSuggestionValue = (suggestion) =>
  `${suggestion.lastName}, ${suggestion.firstName} ${moment(
    suggestion.dateOfBirth
  ).format("MM/DD/YYYY")}`;
const renderSuggestion = (suggestion) => (
  <span>
    {suggestion.lastName}, {suggestion.firstName}{" "}
    {moment(suggestion.dateOfBirth).format("MM/DD/YYYY")}
  </span>
);
const formModel = {
  mobile: "",
  email: "",
  patientId: "",
  inviteOption: 0,
};

class SendInvite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      email: "",
      errorMsg: [],
      mailSent: false,
      isSubmitting: false,
      formValid: false,
      value: "",
      patientId: "",
      inviteOption: 0,
      suggestions: [],
      inviteLink: "",
      patientList: [],
      noSuggestions: false,
    };
    props.getPatient(); 
  }

  UNSAFE_componentWillReceiveProps(nextprops) {
    if (this.props.patient.invite != nextprops.patient.invite) {
      let invite = nextprops.patient.invite;
      console.log(invite);
      if (invite.status) {
        this.setState({
          email: "",
          value: "",
          patientId: "",
          mobile: "",
          isSubmitting: false,
          mailSent: false,
          inviteLink: invite.inviteLink,
          formValid: false,
        });
        window.open(invite.inviteLink);
        //auditLog("Invite Sent")
        ToastSuccess(invite.message)
      }
    }
    if (nextprops.patient.list.status) {
      this.setState({ patientList: nextprops.patient.list.data });
    }
  }

  getSuggestions = (value) => {
    let inputValue = escapeStringRegexp(_.toLower(value.trim()));
    let inputLength = inputValue.length;
    if (inputLength > 0) {
      // console.log(this.state.patientList)	
      return _.filter(this.state.patientList, function (p) {
        let name = `${escapeStringRegexp(p.lastName)}, ${escapeStringRegexp(p.firstName)} ${moment(
          p.dateOfBirth
        ).format("MM/DD/YYYY")}`;
        console.log("Input value", inputValue)
        // console.log("match", _.toLower(name))	
        console.log("name", _.toLower(name))
        // return _.toLower(name).slice(0, inputLength) === inputValue;	
        return _.toLower(name).match(escapeStringRegexp(inputValue));
      });
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    var errorStatus = false;
    var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,5}$/;
    if (
      _.isEmpty(this.state.email) &&
      _.isEmpty(this.state.patientId) &&
      _.isEmpty(this.state.mobile)
    ) {
      ToastError("Please enter atleast one field")
      errorStatus = true;
    }
    var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,5}$/;
    if (!_.isEmpty(this.state.email) && !emailRegex.test(this.state.email)) {
      this.setState({ errorMsg: { emailErr: "Enter a vaild email ID" } });
      errorStatus = true;
    }
    else if(this.state.email.length >64){
      this.setState({ errorMsg: { emailErr: "Email ID cannot be greater than 64 characters" } });
      errorStatus = true;
    }
    var phoneRegex = /^[0-9]{11}$/;
    if (!_.isEmpty(this.state.mobile) && !phoneRegex.test(this.state.mobile)) {
      this.setState({ errorMsg: { phoneErr: "Enter a vaild mobile number" } });
      errorStatus = true;
    }
    if (!errorStatus) {
      this.setState({ errorMsg: [], isSubmitting: true });
      var formData = _.pick(this.state, _.keys(formModel));
      let newFormdata = Object.assign({},formData)
      newFormdata.mobile = newFormdata.mobile.substring(1);
      newFormdata.timeZone = moment.tz.guess();
      this.props.sendInvite(newFormdata);
    }
  }

  onChange = (event, { newValue }) => {
    if (newValue.trim() === "") {
      this.setState({ noSuggestions: false });
    }
    this.setState({
      value: newValue,
      mobile: "",
      email: "",
      patientId: "",
      errorMsg: [],
      formValid: false,
    });
  };
  onSuggestionsFetchRequested = ({ value }) => {
    let suggestions = this.getSuggestions(value);
    console.log(suggestions);
    let isInputBlank = value.trim() === "";
    let noSuggestions = !isInputBlank && suggestions.length === 0;
    this.setState({
      suggestions: this.getSuggestions(value),
      noSuggestions: noSuggestions,
    });
  };
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue }) => {
    this.setState({
      formValid: true,
      mobile: "",
      errorMsg: [],
      patientId: suggestion._id,
      email: "",
      inviteOption: 3,
    });
  };

  render() {
    const {
      value,
      suggestions,
      inviteLink,
      noSuggestions,
      isSubmitting,
    } = this.state;
    const inputProps = {
      placeholder: "Patient Name",
      value,
      onChange: this.onChange,
      autoFocus: true,

      className: "form-control",
    };
    return (
      <Row>
        <Col lg="5" md="6">
          <Card>
            <CardBody>
              <h4>Invite to connect</h4>
              <p>
                Please enter patient name, email or mobile number of patient to
                connect.
              </p>
              <form onSubmit={this.handleSubmit.bind(this)}>
                <FormGroup>
                  <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={
                      this.onSuggestionsFetchRequested
                    }
                    onSuggestionsClearRequested={
                      this.onSuggestionsClearRequested
                    }
                    onSuggestionSelected={this.onSuggestionSelected}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}

                  />
                  {noSuggestions && (
                    <div className="react-autosuggest__suggestions-container ssss">
                      <ul className="react-autosuggest__suggestions-list no-record">
                        <li className="react-autosuggest__suggestion">
                          <span className="no-cursor">No record found</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </FormGroup>
                <p className="text-center">Or</p>
                <FormGroup className="form-label-group position-relative  text-lowercase">
                  <input
                  className="text-lowercase"
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={this.state.email}
                    onBlur={ () =>{
                      var emailTrim = this.state.email.trim()
                      this.setState({
                        email: emailTrim
                      })}
                    }
                    onChange={(e) => {
                      var valid = false;
                      if (e.target.value != "") {
                        valid = true;
                      }
                      this.setState({
                        formValid: valid,
                        mobile: "",
                        patientId: "",
                        email: e.target.value,
                        value: "",
                        inviteOption: 1,
                        errorMsg: [],
                        noSuggestions: false,
                      });
                    }}
                    className={`form-control ${
                      this.state.errorMsg["emailErr"] && "is-invalid"
                      }`}
                  />
                  <div className="invalid-tooltip mt-25">
                    {this.state.errorMsg["emailErr"]}
                  </div>
                </FormGroup>
                <p className="text-center">Or</p>
                <FormGroup className="position-relative ">
                  <InputMask
                    type="number"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={this.state.mobile}
                    type="text"
                    mask="+1 999-999-9999"
                    onChange={(e) => {
                      var valid = false;
                      if (e.target.value != "") {
                        valid = true;
                      }
                      var pNumber = e.target.value.replace(/[^\d]/g, "");
                      // pNumber = pNumber.substr(1);
                      if(pNumber.length >1){
                        this.setState({
                          formValid: valid,
                          mobile: pNumber,
                          patientId: "",
                          email: "",
                          value: "",
                          inviteOption: 2,
                          errorMsg: [],
                          noSuggestions: false,
                        });
                      }
                      if (pNumber.length ==1) {
                        this.setState({
                          mobile: '',
                        });
                      }
                    }}
                    className={`form-control ${
                      this.state.errorMsg["phoneErr"] && "is-invalid"
                      }`}
                  />
                  <div className="invalid-tooltip mt-25">
                    {" "}
                    {this.state.errorMsg["phoneErr"]}
                  </div>
                </FormGroup>
                <div className="mt-2 d-block ripple btn-disabled-second">
                  <Button.Ripple
                    color="primary"
                    type="submit"
                    className="btn-block "
                    disabled={isSubmitting || !this.state.formValid}
                  >
                    {loadingButton("Send Invite", isSubmitting, "Inviting...")}
                  </Button.Ripple>
                </div>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  const { patient } = state;
  return {
    patient: patient,
  };
};

export default connect(mapStateToProps, { getPatient, sendInvite })(SendInvite);
