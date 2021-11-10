import React from "react";
import { connect } from "react-redux";
import Select from "react-select"
import { X } from "react-feather";
import config from "../../../configs/index";
import { isWithinTime, isSlotAvailable } from "../../../components";
import {
  FormGroup,
  Label,
  Button,
  Row,
  Col
} from "reactstrap";
import { Form, ErrorMessage, withFormik } from "formik";
import Flatpickr from "react-flatpickr";
import { addPatientAppointment, cancelPatientAppointment } from "../../../redux/actions/patientActions";
import { loadingButton, ToastMessage, patientAppointmentValidation, confirmAlert } from "../../../components";
import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import moment from "moment-timezone";
import { Calendar, Clock, ChevronDown } from "react-feather"
import _ from "lodash";

const eventColors = {
  business: "chip-success",
  work: "chip-warning",
  personal: "chip-danger",
  others: "chip-primary",
};

class AddEvent extends React.Component {

  state = {
    startDate: new Date(),
    endDate: new Date(),
    title: "",
    label: null,
    allDay: false,
    selectable: true,
    duration: [
      { value: 10, label: '10 Minutes' },
      { value: 20, label: '20 Minutes' },
      { value: 30, label: '30 Minutes' },
      { value: 40, label: '40 Minutes' },
      { value: 50, label: '50 Minutes' },
      { value: 60, label: '60 Minutes' }
    ],
    selectedPatient: "",
    selectedTime: this.props.appTime,
    selectedLength: "",
    formReset: false
  };


  getTimeList = () => {
    var timeList = [];
    var clk = 0;
    var ante = "AM";
    for (var i = 0; i < 24; i++) {
      if (clk == 12) { clk = 12; ante = "PM"; }
      if (clk == 13) { clk = 1; ante = "PM"; }
      if (clk == 0) { clk = 12; ante = "AM"; }
      timeList.push({ value: `${clk}:00 ${ante}`, label: `${clk}:00 ${ante}` });
      for (var r = 1; r <= 5; r++) {
        timeList.push({ value: `${clk}:${r * 10} ${ante}`, label: `${clk}:${r * 10} ${ante}` });
      }
      if (clk == 12 && ante == "AM") { clk = 0; }
      clk++;
    }
    return timeList;
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    // this.props.setFieldValue("date", this.props.appDate); 
    if (this.props.sidebar != nextProps.sidebar) {
      console.log(this.props)
      this.props.setSubmitting(false);
      this.props.handleReset();
      this.setState({ selectedPatient: null, selectedLength: { value: 10, label: '10 Minutes' }, selectedTime: this.props.appTime })
      this.props.setFieldValue("length", 10);

      if (this.props.appDateshow === true && (this.props.appTime.value !== '' && this.props.appTime.value !== undefined)) {
        this.props.setFieldValue("date", this.props.appDate);
        this.props.setFieldValue("time", this.props.appTime.value)
        this.timeChange(this.props.appTime.value)
      }
      if (nextProps.appointmentInfo) {
        let appoint = nextProps.appointmentInfo;
        this.props.setValues({
          "appointmentId": appoint._id,
          "patientId": appoint.patientId,
          "doctorId": appoint.doctorId,
          "length": appoint.length,
          "date": moment(appoint.date).toDate(),
          "time": moment(appoint.datetime).format('hh:mm A')
        })
        let datetimechange = (appoint.datetime).split(' ')
        this.timeChange(datetimechange[1] + ' ')
        this.setState({
          selectedTime: { value: moment(appoint.datetime).format('hh:mm A'), label: moment(appoint.datetime).format('hh:mm A') },
          selectedLength: { value: appoint.length, label: appoint.length + ' Minutes' },
          selectedPatient: appoint.doctor[0]
        })
      }
    }

    if (nextProps.patient.addPatientAppointmentData != this.props.patient.addPatientAppointmentData) {
      ToastMessage(nextProps.patient.addPatientAppointmentData)
      this.props.setSubmitting(false);
      if (nextProps.patient.addPatientAppointmentData.status) {
        this.props.resetForm()
        this.setState({ selectedPatient: null, selectedLength: null, selectedTime: null, })
        this.props.closeForm(false);
      }
    }
  }

  timeChange = (value) => {

    let time = value.split(' ')[0];
    var length = [
      { value: 10, label: '10 Minutes' },
      { value: 20, label: '20 Minutes' },
      { value: 30, label: '30 Minutes' },
      { value: 40, label: '40 Minutes' },
      { value: 50, label: '50 Minutes' },
      { value: 60, label: '60 Minutes' }
    ];
    if (time == "5:10" || time == "17:10") {
      length = [{ value: 10, label: '10 Minutes' }, { value: 20, label: '20 Minutes' }, { value: 30, label: '30 Minutes' }, { value: 40, label: '40 Minutes' }, { value: 50, label: '50 Minutes' }];
    } else if (time == "5:20" || time == "17:20") {
      length = [{ value: 10, label: '10 Minutes' }, { value: 20, label: '20 Minutes' }, { value: 30, label: '30 Minutes' }, { value: 40, label: '40 Minutes' }];
    }
    else if (time == "5:30" || time == "17:30") {
      length = [{ value: 10, label: '10 Minutes' }, { value: 20, label: '20 Minutes' }, { value: 30, label: '30 Minutes' }];
    } else if (time == "5:40" || time == "17:40") {
      length = [{ value: 10, label: '10 Minutes' }, { value: 20, label: '20 Minutes' },];
    } else if (time == "5:50" || time == "17:50") {
      length = [{ value: 10, label: '10 Minutes' }];
    }
    this.setState({ duration: length });
  }



  render() {
    //let events = this.props.events.map((i) => i.id);

    //let lastId = events.pop();
    //let newEventId = lastId + 1;
    return (
      <div
        className={`add-event-sidebar ${
          this.props.sidebar ? "show" : "hidden"
          }`}
      >
        <div className="header d-flex justify-content-between">
          <h3 className="text-bold-600 mb-0">
            {this.props.appointmentInfo !== null
              ? "Reschedule/Cancel Appointment"
              : "Add Appointment"}
          </h3>
          <div
            className="close-icon cursor-pointer"
            onClick={() => this.props.closeForm(false)}
          >
            <X size={20} />
          </div>
        </div>

        <div className="add-event-body">
          <Form onSubmit={this.props.handleSubmit}>
            <div className="category-action d-flex justify-content-between my-50">
              <div className="event-category">
                {this.state.label !== null ? (
                  <div className={`chip ${eventColors[this.state.label]}`}>
                    <div className="chip-body">
                      <div className="chip-text text-capitalize">
                        {this.state.label}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="add-event-fields mt-0">

              <Label for="appointmentDate">Date</Label>
              <FormGroup className="position-relative has-icon-right">
                <Flatpickr
                  id="appointmentDate"
                  className={`form-control ${
                    this.props.errors.date &&
                    "is-invalid"
                    }`}
                  name="date"
                  value={moment(this.props.values.date).format('MM-DD-YYYY')}
                  onChange={(date) => {

                    this.props.setFieldValue("date", date[0]);
                  }}
                  options={{
                    // altInput: true,
                    // altFormat: "F j, Y",
                    dateFormat: "m-d-Y",
                    minDate: moment().format('MM-DD-YYYY'),
                  }}
                />
                <div className="form-control-position">
                  {this.props.errors.date === undefined ? <Calendar size={15} />
                    : ''}</div>
                {this.props.errors.date !== undefined ? <div className="invalid-tooltip mt-25">
                  Select Appointment Date
                </div> : ''}
                {/* <ErrorMessage name="date" component="div" className="invalid-tooltip mt-25" /> */}
              </FormGroup>
              <Row>
                <Col md={6}>
                  <Label for="appointmentTime">Time</Label>
                  <FormGroup className="position-relative has-icon-right">
                    <Select
                      name="time"
                      placeholder="Select Time"
                      className={`${
                        this.props.errors.time &&
                        this.props.touched.time &&
                        "is-invalid"
                        }`}
                      maxMenuHeight={150}
                      onChange={(e) => {

                        this.props.setFieldValue("time", e.value)
                        this.setState({ selectedTime: e })
                        this.timeChange(e.value);
                      }}
                      value={this.state.selectedTime}
                      options={this.getTimeList()}
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                    >
                    </Select>
                    <div className="form-control-position">
                      <Clock size={15} />
                    </div>
                    <ErrorMessage name="time" component="div" className="invalid-tooltip mt-25" />
                  </FormGroup>
                </Col>
                {/* {JSON.stringify(this.state)} */}
                <Col md={6}>
                  <Label for="appointmentLength">Duration</Label>
                  <FormGroup className="position-relative has-icon-right">
                    <Select
                      id="length"
                      name="length"
                      placeholder="Select Duration"
                      className={`${
                        this.props.errors.length &&
                        this.props.touched.length &&
                        "is-invalid"
                        }`}
                      maxMenuHeight={150}
                      onChange={(e) => {
                        this.props.setFieldValue("length", e.value)
                        this.setState({ selectedLength: e })
                      }}
                      value={this.state.selectedLength}
                      options={this.state.duration}
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                    >
                    </Select>
                    <div className="form-control-position">
                      <ChevronDown size={15} />
                    </div>
                    <ErrorMessage name="length" component="div" className="invalid-tooltip mt-25" />
                  </FormGroup>
                </Col>
              </Row>
            </div>

            <div className="add-event-actions ripple d-block">
              <Row>
                <Col md={6}>
                  <Button.Ripple
                    className="cursor-pointer btn-block px-1 mb-1"
                    color={this.props.appointmentInfo !== null
                      ? "danger"
                      : "outline-primary"}
                    onClick={() => {
                      if (this.props.appointmentInfo !== null) {
                        confirmAlert({
                          title: "Do you want to cancel the appointment?"
                        }, (status) => {
                          if (status) {
                            this.props.cancelPatientAppointment(this.props.appointmentInfo._id)
                          }
                        })
                      } else {
                        this.props.resetForm()
                        this.setState({ selectedPatient: null, selectedLength: null, selectedTime: null, })
                        this.props.closeForm(false);
                        if (this.props.handleSelectedEvent)
                          this.props.handleSelectedEvent(null);
                        else return null;
                      }
                    }}
                  >
                    {this.props.appointmentInfo !== null
                      ? "Cancel Appointment"
                      : "Close"}
                  </Button.Ripple>
                </Col>
                <Col md={6}>
                  <Button.Ripple
                    color="primary"
                    type="submit"
                    className="cursor-pointer btn-block mb-1"
                    disabled={this.props.isSubmitting}
                  >
                    {loadingButton(
                      this.props.appointmentInfo !== null
                        ? "Reschedule"
                        : "Add Appointment",
                      this.props.isSubmitting,
                      "Loading..."
                    )}

                  </Button.Ripple>
                </Col>
              </Row>
            </div>
          </Form>
        </div>
      </div>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    patient: state.patient
  };
};

const submitValidation = (props, values) => { 
  if (moment().format('MM-DD') == moment(values.date).format('MM-DD')) { 
    if (!isWithinTime(values.time)) {
      ToastMessage({ status: false, message: "Select Future Date and Time" })
      return false;
    }
  }
  if(!isSlotAvailable(props.availabilities, values.date, values.time)){
    ToastMessage({ status: false, message: "Slot Not Available" })
    return false;
  } 
  return true;
}

const AddEventFormik = withFormik({
  mapPropsToValues: () => ({
    date: moment().toDate(),
    time: "",
    length: "",
    status: "Scheduled"
  }),
  validationSchema: patientAppointmentValidation,
  handleSubmit: (values, { resetForm, setSubmitting, props }) => {
    if (submitValidation(props, values)) { 
      var datetime = `${moment(values.date).format('YYYY-MM-DD')} ${moment(values.time, ["hh:mm A"]).format("HH:mm")}`; 
      values.datetime = moment(datetime, "YYYY-MM-DD HH:mm").utc().format();
      values.timeZone = moment.tz.guess()
      props.addPatientAppointment(values);
    } else {
      setSubmitting(false)
    }
  },
  displayName: 'addAppointment'
})(AddEvent);

export default connect(mapStateToProps, {
  addPatientAppointment,
  cancelPatientAppointment
})(AddEventFormik);

