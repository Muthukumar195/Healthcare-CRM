import React from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Button,
  Form
} from "reactstrap";
import Select from "react-select"
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check } from "react-feather"
import { loadingButton, ToastSuccess, ToastError, auditLog } from "../../components";
import { getDoctorAvailability, updateDoctorAvailability } from "../../redux/actions/doctorActions";
import moment from "moment-timezone"; 
import _ from 'lodash';

const slotTime = {
  from: moment(),
  to: moment().add(1, 'hours')
}

class MyAvailability extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      doctorAvail: {},
      updateAvailability: false
    };
    props.getDoctorAvailability();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.availability.data != state.availability) {
      if (state.updateAvailability) {
        if (props.availability.status) {
          auditLog("M3 Availability", "Availablity updated success")
          ToastSuccess("Availability Updated Successfully!")
        }
      }
      return {
        doctorAvail: (!_.isEmpty(props.availability.data)) ? props.availability.data : [],
        updateAvailability: false
      };
    }
    return null;
  }

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

  startTimeOption = () => {
    var TO = [];
    this.getTimeList().map((time, i) => {
      return (
        TO.push({ value: time.value + ':00' + time.index, label: time.value + ':00' + time.index })
      )
    })
    return TO;
  }

  addSlot = (day) => {
    var doctorAvail = { ...this.state.doctorAvail }
    doctorAvail.availablity[day].timeSlot.push({
      from: moment(),
      to: moment().add(1, 'hours')
    });
    this.setState({ doctorAvail })
  }

  removeSlot = (day, index) => {
    console.log(index)
    var doctorAvail = { ...this.state.doctorAvail }
    var removedSlot = _.remove(doctorAvail.availablity[day].timeSlot, function (n, k) {
      return k != index;
    });
    console.log(removedSlot)
    doctorAvail.availablity[day].timeSlot = removedSlot;
    this.setState({ doctorAvail })
  }

  checkOverlap = (timeSegments) => {
    if (timeSegments.length === 1) return false;
    timeSegments.sort((timeSegment1, timeSegment2) =>
      moment(timeSegment1[0]).format("HH:mm").localeCompare(moment(timeSegment2[0]).format("HH:mm"))
    );
    for (let i = 0; i < timeSegments.length - 1; i++) {
      const currentEndTime = timeSegments[i][1];
      const nextStartTime = timeSegments[i + 1][0];
      if (moment(currentEndTime).format("HH:mm") > moment(nextStartTime).format("HH:mm")) {
        return true;
      }
    }
    return false;
  };

  validation = () => {
    var doctorAvail = { ...this.state.doctorAvail };
    var isvalid = true;
    _.keys(doctorAvail.availablity).map((weekDays, k) => {
      var timeSegments = [];
      doctorAvail.availablity[weekDays].timeSlot.map((slot, slotId) => {
        var duration = moment.duration(moment(slot.to).diff(slot.from));
        var mins = duration.asMinutes();  
        if (moment(slot.from).format("HH:MM") >= moment(slot.to).format("HH:MM") && isvalid) {
          ToastError(`${weekDays} : End Time cannot be less than or equal to Start Time`);
          isvalid = false;
        }
        timeSegments.push([slot.from, slot.to]);
      });
      if (this.checkOverlap(timeSegments) && isvalid) {
        ToastError(`${weekDays} : Provider time slots should not over lap with each other`);
        isvalid = false;
      }
    });
    return isvalid;
  }

  updateAvailability = (e) => {
    e.preventDefault()
    if (this.validation()) {
      this.setState({ updateAvailability: true })
      this.props.updateDoctorAvailability(this.state.doctorAvail)
    }
  }

  timeValid = (start, end) => {
    var duration = moment.duration(moment(end).diff(start));
    var mins = duration.asMinutes(); 
    if (moment(start).format("HH:MM") >= moment(end).format("HH:MM")) {
      return 'is-invalid';
    }
    return null;
  }

  render() {
    const { doctorAvail } = this.state; 
    return (
      <React.Fragment>
        <Form method="post" onSubmit={this.updateAvailability}>
          <Col lg="12">
            {!_.isEmpty(doctorAvail) ? (
              _.keys(doctorAvail.availablity).map((weekDays, k) => {
                return (
                  <Row className="provider-wrap" key={k}>
                    <Col lg="2" className="providers_lg_3 px-50 d-flex w-100">
                      <div className="day-column d-flex align-items-stretch w-100">
                        <Row className="no-gutters align-items-center d-flex w-100">
                          <Col md="12" className="mx-auto text-center">
                            <h5 className="mb-0">{weekDays}</h5>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col md="10" className="pl-0 pr-50">
                      {
                        doctorAvail.availablity[weekDays].timeSlot.map((slots, slotId) => {
                          var fromDate = moment(slots.from).format("hh:mm A");
                          var toDate = moment(slots.to).format("hh:mm A");
                          return (
                            <div className="time-column" key={slotId}>
                              <Row className="mx-0">
                                <Col md="10" className="p-75">
                                  <label className="text-bold-600 mr-1 font-medium-1">Start Time</label>
                                  <Select
                                    className={`React d-inline-block mr-1 w-25 ${this.timeValid(slots.from, slots.to)}`}
                                    classNamePrefix="select"
                                    name="from"
                                    maxMenuHeight={105}
                                    onChange={(e) => {
                                      var doctorAvail = { ...this.state.doctorAvail }
                                      doctorAvail.availablity[weekDays].timeSlot.map((slot, key) => {
                                        if (key == slotId) {
                                          slot.from = moment(e.value, ["hh:mm A"])
                                        }
                                      })
                                      this.setState({ doctorAvail })
                                    }}
                                    defaultValue={{ label: fromDate, value: fromDate }}
                                    value={{ label: fromDate, value: fromDate }}
                                    options={this.getTimeList()}
                                    components={{
                                      DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                  >
                                  </Select>
                                  <label className="text-bold-600 mr-1 font-medium-1">End Time</label>
                                  <Select
                                    className={`React d-inline-block mr-1 w-25 ${this.timeValid(slots.from, slots.to)}`}
                                    classNamePrefix="select"
                                    name="to"
                                    maxMenuHeight={105}
                                    onChange={(e) => {
                                      var doctorAvail = { ...this.state.doctorAvail }
                                      doctorAvail.availablity[weekDays].timeSlot[slotId].to = moment(e.value, ["hh:mm A"]);

                                      this.setState({ doctorAvail })
                                    }}
                                    defaultValue={{ label: toDate, value: toDate }}
                                    value={{ label: toDate, value: toDate }}
                                    options={this.getTimeList()}
                                    components={{
                                      DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                  />
                                  {slotId === 0 &&
                                    <Button.Ripple
                                      color="primary"
                                      type="button"
                                      onClick={() => this.addSlot(weekDays)}
                                    >
                                      Split
                                  </Button.Ripple>
                                  }

                                  {slotId !== 0 && slotId >= 1 &&
                                    <Button.Ripple
                                      color="light"
                                      type="button"
                                      onClick={() => this.removeSlot(weekDays, slotId)}
                                    >
                                      Delete
                                    </Button.Ripple>
                                  }
                                </Col>

                                {doctorAvail.availablity[weekDays].timeSlot.length == 1 &&
                                  <Col md="2" className="p-75">
                                    <Checkbox
                                      color="success"
                                      icon={<Check className="vx-icon" size={16} />}
                                      label="Day Off"
                                      onChange={(e) => {
                                        console.log(e.target.checked)
                                        var doctorAvail = { ...this.state.doctorAvail }
                                        doctorAvail.availablity[weekDays].dayOff = e.target.checked                                        
                                        this.setState(doctorAvail) 
                                      }}
                                      checked={doctorAvail.availablity[weekDays].dayOff}
                                      className="mt-75"
                                    />
                                  </Col>
                                }
                              </Row>
                            </div>
                          )
                        })}
                    </Col>
                  </Row>
                )
              })
            ) : null}
          </Col>

          <div className="mt-3 ripple d-block">
            <Row>
              <Col md={6}>
                <Button.Ripple
                  className="cursor-pointer btn-block px-1 mb-1"
                  color="outline-primary"
                  onClick={() => { this.props.getDoctorAvailability(); }}
                >
                  Reset
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
                    "Save",
                    this.props.isSubmitting,
                    "Loading..."
                  )}

                </Button.Ripple>
              </Col>
            </Row>
          </div>
        </Form>
      </React.Fragment>
    );
  }
}


const mapStateToProps = (state) => {
  const { doctor } = state;
  return {
    availability: doctor.availabilities,
    updateAvailabilities: doctor.updateAvailabilities,
  };
};

export default connect(mapStateToProps, {
  getDoctorAvailability,
  updateDoctorAvailability
})(MyAvailability);
