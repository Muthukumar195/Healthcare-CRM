import React from "react";
import { X, Tag, ChevronDown, Calendar, Clock } from "react-feather";
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  Button,
  Row,
  Col,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import { addAppointment } from "../../redux/actions/patientActions";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import { connect } from "react-redux";
import NumericInput from "react-numeric-input"

const defaultStyle = {
  arrowUp: {
    borderBottomColor: "#fff"
  },

  arrowDown: {
    borderTopColor: "#fff"
  },
  btnUp: {
    backgroundColor: "#00A4EF",
    background: "#00A4EF",
    border: "none",
  },
  btnDown: {
    backgroundColor: "#00A4EF",
    background: "#00A4EF",
    border: "none"
  },
  "btn:hover": {
    background: "#00A4EF",
    color: "ffffff"
  },
  "btn:active": {
    background: "#00A4EF",
    color: "ffffff"
  },
  input: {
    color: "5f5f5f",
    padding: "0.7rem 0.7rem",
    border: "1px solid #D9D9D9",
    display: "block",
    borderRadius: "5px",
    fontWeight: 400,
    backgroundColor: "#fff",
    height: "calc(1.25em + 1.4rem + 1px)",
    width: "100%",
    fontSize: "0.96rem",
    lineHeight: "1.25"
  }
}

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
    allDay: true,
    selectable: true,
  };
  handleDateChange = (date) => {
    this.setState({
      startDate: date,
    });
  };

  handleEndDateChange = (date) => {
    this.setState({
      endDate: date,
    });
  };

  handleLabelChange = (label) => {
    this.setState({
      label,
    });
  };

  getTimeList = () => {
    var timeList = ["12:00 AM"];
    for (var i = 0; i < 11; i++) {
      timeList.push(`${i + 1}:00 AM`);
    }
    timeList.push("12:00 PM");
    for (var i = 0; i < 11; i++) {
      timeList.push(`${i + 1}:00 PM`);
    }
    return timeList;
  };

  handleAddEvent = (id) => {
    this.props.handleSidebar(false);
    this.props.addEvent({
      id: id,
      title: this.state.title,
      start: this.state.startDate,
      end: this.state.endDate,
      label: this.state.label === null ? "others" : this.state.label,
      allDay: this.state.allDay,
      selectable: this.state.selectable,
    });
    this.setState({
      startDate: new Date(),
      endDate: new Date(),
      title: "",
      label: null,
      allDay: true,
      selectable: true,
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.setState({
      title: nextProps.eventInfo === null ? "" : nextProps.eventInfo.title,
      url: nextProps.eventInfo === null ? "" : nextProps.eventInfo.url,
      startDate:
        nextProps.eventInfo === null
          ? new Date()
          : new Date(nextProps.eventInfo.start),
      endDate:
        nextProps.eventInfo === null
          ? new Date()
          : new Date(nextProps.eventInfo.end),
      label: nextProps.eventInfo === null ? null : nextProps.eventInfo.label,
      allDay: nextProps.eventInfo === null ? true : nextProps.eventInfo.allDay,
      selectable:
        nextProps.eventInfo === null ? true : nextProps.eventInfo.selectable,
    });
  }

  myFormat = num => {
    return `${num} Mins`
  }

  render() {
    let events = this.props.events.map((i) => i.id);
    let lastId = events.pop();
    let newEventId = lastId + 1;
    return (
      <div
        className={`add-event-sidebar ${
          this.props.sidebar ? "show" : "hidden"
        }`}
      >
        <div className="header d-flex justify-content-between">
          <h3 className="text-bold-600 mb-0">
            {this.props.eventInfo !== null &&
            this.props.eventInfo.title.length > 0
              ? "Update Appointment"
              : "Add Appointment"}
          </h3>
          <div
            className="close-icon cursor-pointer"
            onClick={() => this.props.handleSidebar(false)}
          >
            <X size={20} />
          </div>
        </div>
        <div className="add-event-body">
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
          <div className="add-event-fields mt-2">
            <Label for="patientName">Patient Name</Label>
            <FormGroup className="form-label-group position-relative ">
              <Input
                type="select"
                id="patientName"
                name="select"
              >
                {this.props.patients.map((patient, index) => {
                  return (
                    <option key={index}>
                      {patient.lastName + " " + patient.firstName}
                    </option>
                  );
                })}
              </Input>
              <div className="form-control-position">
                <ChevronDown size={15} />
              </div>
            </FormGroup>

            <Label for="doctorName">Doctor Name</Label>
            <FormGroup>
              <Input
                type="select"
                id="doctorName"
                name="select"
                id="doctorName"
              >
                <option>
                  {"Dr. " +
                    this.props.user.lastName +
                    " " +
                    this.props.user.firstName}
                </option>
              </Input>
            </FormGroup>

            <Label for="appointmentDate">Date</Label>
            <FormGroup className="form-label-group position-relative ">
              <Flatpickr
                id="appointmentDate"
                className="form-control"
                value={this.state.startDate}
                onChange={(date) => this.handleDateChange(date)}
                options={{
                  altInput: true,
                  altFormat: "F j, Y",
                  dateFormat: "Y-m-d",
                }}
              />
              
              <div className="form-control-position">
                <Calendar size={15} />
              </div>
            </FormGroup>

            <Row>
              <Col md="6">
                <Label for="appointmentTime">Time</Label>
                <FormGroup className="form-label-group position-relative mb-0">
                  <select
                    id="appointmentTime"
                    name="select"
                    className="form-control"
                  >
                    {this.getTimeList().map((time, index) => {
                      return <option key={index}>{time}</option>;
                    })}
                  </select>
                  <div className="form-control-position">
                    <Clock size={15} />
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <Label for="appointmentLength">Duration</Label>
                <NumericInput className="form-control" format={this.myFormat} min={15} max={60} step={15} value={15} style={defaultStyle} />
              </Col>
            </Row>
          </div>
          <hr className="my-1" />
          <Row>
            <Col md={6}>
              <div className="ripple d-block">
                <Button.Ripple
                  tag="label"
                  color="primary"
                  outline
                  className="cursor-pointer btn-block"
                  onClick={() => {
                    this.props.handleSidebar(false);
                    if (this.props.handleSelectedEvent)
                      this.props.handleSelectedEvent(null);
                    else return null;
                  }}
                >
                  Cancel
                </Button.Ripple>
              </div>
            </Col>
            <Col md={6}>
              <div className="ripple d-block">
                <Button.Ripple
                  type="submit"
                  className="cursor-pointer btn-block"
                  color="primary"
                  onClick={() => {
                    this.props.handleSidebar(false);
                    if (
                      this.props.eventInfo === null ||
                      this.props.eventInfo.title.length <= 0
                    )
                      this.handleAddEvent(newEventId);
                    else
                      this.props.updateEvent({
                        id: this.props.eventInfo.id,
                        title: this.state.title,
                        label: this.state.label,
                        start: this.state.startDate,
                        end: this.state.endDate,
                        allDay: true,
                        selectable: true,
                      });
                  }}
                >
                  {this.props.eventInfo !== null &&
                  this.props.eventInfo.title.length > 0
                    ? "Update Appointment"
                    : "Add Appointment"}
                </Button.Ripple>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);

  return { state };
};

export default connect(mapStateToProps, {
  addAppointment,
})(AddEvent);
