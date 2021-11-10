import React from "react";
import AddEventSidebar from "./AddEventSidebar";
import AddEventButton from "./AddEventButton";
import { Card, CardBody, Button, ButtonGroup, Table, Row, Col, Spinner } from "reactstrap";
import { Calendar, momentLocalizer, Views, Navigate } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { ToastMessage, getTimeList } from "../../../components";
import * as dates from "date-arithmetic";
import moment from "moment-timezone";
import _ from 'lodash';
import { connect } from "react-redux";
import {
  fetchEvents,
  handleSidebar,
  addEvent,
  handleSelectedEvent,
  updateEvent,
  updateDrag,
  updateResize,
} from "../../../redux/actions/calendar/index";
import config from "../../../configs/index";
import { ChevronLeft, ChevronRight } from "react-feather";
import { getPatient, getPatientAppointments } from "../../../redux/actions/patientActions";
import { getAvailabilities } from "../../../redux/actions/doctorActions";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../../assets/scss/plugins/calendars/react-big-calendar.scss";
const DragAndDropCalendar = withDragAndDrop(Calendar);
// moment_timezone.tz.setDefault(Intl.DateTimeFormat().resolvedOptions().timeZone);
//moment.tz.setDefault(config.timeZone);
const localizer = momentLocalizer(moment);
const eventColors = {
  Connected: "bg-success",
  Waiting: "bg-warning",
  Completed: "bg-secondary",
  Scheduled: "bg-primary",
};

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    props.onView(props.view);
    this.state = {
      isActive: false,
    };
  }

  render() {
    const { appointmentCount } = this.props;
    return (
      <React.Fragment>
        <Row className="calendar-header mb-1">
          <Col md={4} className="btn-add-appointment">
            <AddEventButton onFormReset={this.props.onFormReset} />
          </Col>
          <Col md={4} className="text-center view-options">
            <ButtonGroup>
              <button
                className={`btn ${
                  this.props.view === "dayCalendar"
                    ? "btn-primary"
                    : "btn-outline-primary text-primary"
                  }`}
                onClick={() => {
                  this.props.onView("dayCalendar");
                  this.props.getPatientAppointments(moment(this.props.date).toDate(), "dayCalendar")
                }}
              >
                Day
              </button>
              <button

                className={`btn ${
                  this.props.view === "week"
                    ? "btn-primary"
                    : "btn-outline-primary text-primary"
                  }`}
                onClick={() => {
                  this.props.getPatientAppointments(moment(this.props.date).toDate(), "week")
                  this.props.onView("week");
                }}
              >
                Week
              </button>
            </ButtonGroup>
          </Col>
          <Col md={4} className="month-label text-right pt-50 px-md-1 ">
            <div className="calendar-navigation">
              <Button.Ripple
                className="btn-icon rounded-circle"
                size="sm"
                color="primary"
                onClick={() => this.props.onNavigate("PREV")}
              >
                <ChevronLeft size={15} />
              </Button.Ripple>
              <div className="month d-inline-block mx-50 text-bold-500 font-medium-1 align-middle">
                {this.props.label}
              </div>
              <Button.Ripple
                className="btn-icon rounded-circle"
                size="sm"
                color="primary"
                onClick={() => this.props.onNavigate("NEXT")}
              >
                <ChevronRight size={15} />
              </Button.Ripple>
            </div>
            <p  className="pr-7px"><i>Current Time Zone: {moment().tz(moment.tz.guess()).format('z')}</i></p>
          </Col>
        </Row>

        <div className="event-tags d-none d-sm-flex justify-content-end mt-1">
          <div className="tag mr-1">
            <span className="bullet bullet-success bullet-sm mr-50"></span>
            <span>Connected
              {/* ({(appointmentCount.connected) ? appointmentCount.connected : 0}) */}
            </span>
          </div>
          <div className="tag mr-1">
            <span className="bullet bullet-warning bullet-sm mr-50"></span>
            <span>Waiting
               {/* ({(appointmentCount.waiting) ? appointmentCount.waiting : 0}) */}
            </span>
          </div>
          <div className="tag mr-1">
            <span className="bullet bullet-primary bullet-sm mr-50"></span>
            <span>Scheduled
               {/* ({(appointmentCount.scheduled) ? appointmentCount.scheduled : 0}) */}
            </span>
          </div>
          {/* <div className="tag mr-1">
            <span className="bullet bullet-purple bullet-sm mr-50"></span>
            <span>NS/Cancelled ({(appointmentCount.cancelled) ? appointmentCount.cancelled : 0})</span>
          </div> */}
          <div className="tag">
            <span className="bullet bullet-secondary bullet-sm mr-50"></span>
            <span>Completed
               {/* ({this.props.appointmentCount.completed}) */}
            </span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class DayCalendar extends React.Component {


  getAppointment = (range) => {
    var format = 'HH:mm:ss';
    var startTime = moment(moment(range.start + ' ' + range.ante, ["hh:mm A"]).format(format), format);
    var endTime = moment(moment(range.end + ' ' + range.ante, ["hh:mm A"]).format(format), format);
    var match = null;
    _.forEach(this.props.appointments, (appoint) => {
      for (var c = 1; c <= (appoint.length / 10); c++) {
        var startApointTime = moment(moment(appoint.datetime).add((c * 9), 'minutes').format(format), format);

        if (startApointTime.isBetween(startTime, endTime)) {
          if (!_.isEmpty(appoint.doctor)) {
            match = {
              data: appoint,
              status: appoint.status,
              name: _.toUpper(`${appoint.doctor[0].firstName} ${appoint.doctor[0].lastName}`)
            }
          }

        }
      }
    })
    return match;
  }

  isSlotAvailable = (date, range) => {
    var day = moment(this.props.date).format("dddd");
    var pickDate = moment(this.props.date).format("YYYY-MM-DD");
    var format = 'HH:mm:ss';
    var dateTimeFormat = "YYYY-MM-DD HH:mm";
    var fromAnte = range.ante;
    var toAnte = range.ante;
    if (range.start == "11:50" && range.ante == "AM") {
      toAnte = "PM"
    }
    if (range.start == "11:50" && range.ante == "PM") {
      toAnte = "AM"
    }
    var startTime = moment(moment(range.start + ' ' + fromAnte, ["hh:mm A"]).format(format), format);
    var endTime = moment(moment(range.end + ' ' + toAnte, ["hh:mm A"]).format(format), format);
    var isAvailable = false;
    _.forEach(this.props.availabilities, (avail) => {
      if (!avail.availablity[day].dayOff) {
        _.forEach(avail.availablity[day].timeSlot, (slot) => {
          if (moment(slot.from).format(format) > moment(slot.to).format(format)) {
            var fromStart = moment(moment(slot.from).format(format), format);
            var fromEnd = moment(moment("23:59:59", "HH:mm:ss").format(format), format);
            var toStart = moment(moment("00:00:00", "HH:mm:ss").format(format), format);
            var toEnd = moment(moment(slot.to).format(format), format);
            if ((startTime.isBetween(fromStart, fromEnd, null, '[]') && endTime.isBetween(fromStart, fromEnd, null, '[]')) ||
              (startTime.isBetween(toStart, toEnd, null, '[]') && endTime.isBetween(toStart, toEnd, null, '[]')) ||
              moment(range.end + ' ' + toAnte, ["hh:mm A"]).format(format) == "00:00:00") {
              isAvailable = true;
            }
          } else {
            var startSlotTime = moment(moment(slot.from).format(format), format);
            var endSlotTime = moment(moment(slot.to).format(format), format);
            if (startTime.isBetween(startSlotTime, endSlotTime, null, '[]') && endTime.isBetween(startSlotTime, endSlotTime, null, '[]')) {
              isAvailable = true;
            }
          }
        })
      }
    })
    if (isAvailable) {
      var startDateTime = moment(moment(pickDate + ' ' + range.start + ' ' + fromAnte, ["YYYY-MM-DD hh:mm A"]).format(dateTimeFormat), dateTimeFormat);
      var endDateTime = moment(moment(pickDate + ' ' + range.end + ' ' + fromAnte, ["YYYY-MM-DD hh:mm A"]).format(dateTimeFormat), dateTimeFormat);
      _.forEach(this.props.previousAppoint, (appoint) => { 
        var startPrevTime = moment(appoint.datetime).format(dateTimeFormat);
        var endPrevTime = moment(appoint.datetime).add(appoint.length, 'minutes').format(dateTimeFormat);       
        if (startDateTime.isBetween(startPrevTime, endPrevTime, null, '[]') && endDateTime.isBetween(startPrevTime, endPrevTime, null, '[]')) {
          isAvailable = false;
        }
      });
    }
    return isAvailable;
  }


  getAppointmentClassName = (status) => {
    if (_.includes(status, "Waiting")) {
      return 'bg-warning';
    } else if (_.includes(status, "Connected")) {
      return 'bg-success';
    }
    else if (_.includes(status, "Completed")) {
      return 'bg-secondary';
    }
    else if (_.includes(status, "Cancelled")) {
      return 'bg-purple';
    }
    return 'bg-primary';
  }

  render() {

    return (
      <div className="dayCalendarTable">
        <Table responsive bordered className="text-center">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>&nbsp;</th>
              <th>&nbsp;</th>
              <th>&nbsp;</th>
              <th>&nbsp;</th>
              <th>&nbsp;</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {
              getTimeList().map((time, i) => {
                var setRange = { start: time.value, end: time.value, ante: time.index };
                return (
                  <tr key={i}>
                    <th className={`cursor-pointer ${
                      moment(moment(moment(this.props.date).format("DD-MM-YYY") + ' ' + time.value + ' ' + time.index, ["DD-MM-YYYY hh:mm A"])).isBefore() ||
                        !this.isSlotAvailable(this.props.date, setRange) ? 'bg-grey' : 'grey-bg'}`}>  {time.value}<sup> {time.index}</sup></th>
                    {time.rangeList.map((range, r) => {
                      let appoint = this.getAppointment(range);
                      let pickDate = moment(moment(this.props.date).format("DD-MM-YYY") + ' ' + range.start + ' ' + range.ante, ["DD-MM-YYYY hh:mm A"]);
                      return (
                        (appoint) ? (
                          <td key={r} className={`timeScheduled cursor-pointer ${this.getAppointmentClassName(appoint.status)} `} onClick={
                            () => {
                              if (_.includes(appoint.status, "Waiting")) {
                                this.props.parentProps.history.push(`/telescrubs/televisit/${appoint.data.authToken}`)
                              }
                              if (_.includes(appoint.status, "Scheduled")) {
                                this.props.onEditAppointment(appoint.data)
                              }
                              if (_.includes(appoint.status, "Connected")) {
                                this.props.parentProps.history.push(`/telescrubs/televisit/${appoint.data.authToken}`)
                              }
                            }
                          } >
                            <span>{appoint.name}</span>
                            {range.start} - {range.end}
                          </td>) : (
                            <td className={`cursor-pointer ${
                              moment(pickDate).isBefore() || !this.isSlotAvailable(this.props.date, range) ? 'bg-grey' : ''}`} key={r} onClick={
                                () => {
                                  if (moment(pickDate).isAfter()) {
                                    if (this.isSlotAvailable(this.props.date, range)) {
                                      this.props.onAddAppointment(range.start, this.props.date, range.ante)
                                    } else {
                                      ToastMessage({ status: false, message: "No Doctors Available!" })
                                    }
                                  } else {
                                    ToastMessage({ status: false, message: "Select Future Date and Time" })
                                  }
                                }
                              } >
                              {range.start} - {range.end}
                            </td>
                          )
                      )
                    })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
    );
  }
}

DayCalendar.range = (date) => {
  let start = date;

  let end = dates.add(start, 2, "day");

  let current = start;
  let range = [];

  while (dates.lte(current, end, "day")) {
    range.push(current);
    current = dates.add(current, 1, "day");
  }

  return range;
};

DayCalendar.navigate = (date, action) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return dates.add(date, -1, "day");

    case Navigate.NEXT:
      return dates.add(date, 1, "day");

    default:
      return date;
  }
};

DayCalendar.title = (date) => {
  //var options = { weekday: "long", month: "long", day: "numeric", timeZone: config.timeZone };  
  var options = { weekday: "long", month: "long", day: "numeric" };
  return `${date.toLocaleDateString("en-US", options)}`;
};




class CalendarApp extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (props.app.sidebar !== state.sidebar ||
      props.appointments.data !== state.appointments ||
      props.patients.data != state.patients ||
      props.availabilities.data.avail != state.availabilities ||
      props.availabilities.data.appoint != state.previousAppoint
    ) {
      var appointments = []
      if (props.appointments.status) {
        appointments = props.appointments.data;
      }
      var weekAppointments = []
      if (!_.isEmpty(appointments)) {
        weekAppointments = appointments.list.map((event) => {
          event.title = _.toUpper(`${event.doctor[0].firstName} ${event.doctor[0].lastName}`);
          event.start = new Date(moment(event.datetime));
          event.end = new Date(moment(event.datetime).add(event.length, 'minutes'));
          event.allDay = false;
          event.selectable = false;
          event.label = event.status.toString();
          return event;
        });
      }
      return {
        events: weekAppointments,
        sidebar: props.app.sidebar,
        patients: (!_.isEmpty(props.patients)) ? props.patients.data : [],
        appointments: (!_.isEmpty(appointments)) ? appointments.list : [],
        appointmentCount: (!_.isEmpty(appointments)) ? appointments.count : {},
        availabilities: (!_.isEmpty(props.availabilities)) ? props.availabilities.data.avail : [],
        previousAppoint: (!_.isEmpty(props.availabilities)) ? props.availabilities.data.appoint : [],
      };
    }

    // Return null if the state hasn't changed
    return null;
  }
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      weekAppointments: [],
      views: {
        month: true,
        week: true,
        day: true,
        dayCalendar: DayCalendar,
      },
      eventInfo: null,
      appointmentInfo: null,
      patients: [],
      user: props.user.login.user,
      navigationDate: moment().toDate(),
      selectedView: "dayCalendar",
      appTime: null,
      appDate: '',
      appDateshow: false,
      edit: false,
      loader: false,
      availabilities: [],
      previousAppoint: []

    };
    //props.getPatient(); 
    props.getPatientAppointments(moment().toDate(), this.state.selectedView);
    props.getAvailabilities(moment().toDate(), this.state.selectedView)
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.props.getPatientAppointments(moment(this.state.navigationDate).toDate(), this.state.selectedView);
      this.props.getAvailabilities(moment().toDate(), this.state.selectedView)
    }, 5000);
    window.addEventListener('scroll', this.handleScroll);
    if (window.scrollY === 0) {
      this.documentStyle.setProperty('--sidebar-top-position', '109px');
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    window.removeEventListener('scroll', this.handleScroll);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.appointments.data != this.props.appointments.data) {
      this.setState({ loader: false });
    }
  }

  handleEventColors = (event) => {
    return { className: eventColors[event.label] };
  };

  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const { events } = this.state;
    const idx = events.indexOf(event);
    let allDay = event.allDay;
    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }
    const updatedEvent = { ...event, start, end, allDay };
    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);
    this.setState({
      events: nextEvents,
    });
    this.props.updateDrag(updatedEvent);
  };


  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state;
    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });

    this.setState({
      events: nextEvents,
    });

    this.props.updateResize({ ...event, start, end });
  };


  addAppointment = (time, date, meridean) => {
    let timecheck = time.split(":")
    this.props.handleSelectedEvent(null);
    this.setState({ appointmentInfo: null, appTime: { value: time + " " + meridean, label: time + " " + meridean }, appDate: date, appDateshow: true }, () => this.props.handleSidebar(true))
  }

  editAppointment = (appointment) => {
    this.props.handleSidebar(true);
    this.setState({
      appointmentInfo: appointment,
      edit: true
    })
    this.props.handleSelectedEvent(null);
  }
  formReset = () => {
    this.setState({ appointmentInfo: null, appDate: new Date(), appTime: { value: '', label: 'Select Time' } }, () => this.props.handleSidebar(true))
  }

  documentStyle = document.documentElement.style;
  initialtopposition = '109px';
  scrolledtopposition = '80px';

  handleScroll = () => {
    if (window.scrollY === 0) {
      this.documentStyle.setProperty('--sidebar-top-position', this.initialtopposition);
    } else {
      this.documentStyle.setProperty('--sidebar-top-position', this.scrolledtopposition);
    }
  }

  handleSelectEvent = (event) => {
    let filteredState = this.state.events.filter((i) => i.id === event.id);
    this.props.handleSidebar(true);
    this.props.handleSelectedEvent(filteredState[0]);
    this.setState({
      eventInfo: filteredState[0],
    });
  };

  isWeekSlotAvailable = (date) => {
    var day = moment(date).format("dddd");
    var format = 'HH:mm:ss';
    var startTime = moment(moment(date).format(format), format);
    var endTime = moment(moment(date).add(9, 'minutes').format(format), format);
    var isAvailable = false;
    _.forEach(this.state.availabilities, (avail) => {
      if (!avail.availablity[day].dayOff) {
        _.forEach(avail.availablity[day].timeSlot, (slot) => {
          if (moment(slot.from).format(format) > moment(slot.to).format(format)) {
            var fromStart = moment(moment(slot.from).format(format), format);
            var fromEnd = moment(moment("23:59:59", "HH:mm:ss").format(format), format);
            var toStart = moment(moment("00:00:00", "HH:mm:ss").format(format), format);
            var toEnd = moment(moment(slot.to).format(format), format);
            if ((startTime.isBetween(fromStart, fromEnd, null, '[]') && endTime.isBetween(fromStart, fromEnd, null, '[]')) ||
              (startTime.isBetween(toStart, toEnd, null, '[]') && endTime.isBetween(toStart, toEnd, null, '[]'))) {
              isAvailable = true;
            }
          } else {
            var startSlotTime = moment(moment(slot.from).format(format), format);
            var endSlotTime = moment(moment(slot.to).format(format), format);
            if (startTime.isBetween(startSlotTime, endSlotTime, null, '[]') && endTime.isBetween(startSlotTime, endSlotTime, null, '[]')) {
              isAvailable = true;
            }
          }
        })
      }
    })
    return isAvailable;
  }

  render() {

    let today = new Date();
    const resourceMap = [{ resourceId: 1, resourceTitle: "Morning" }];
    const { events, views, sidebar, appointments, appointmentCount, loader, availabilities, previousAppoint } = this.state;

    const ColoredDateCellWrapper = ({ children, value }) =>
      React.cloneElement(React.Children.only(children), {
        style: {
          ...children.style,
          backgroundColor: value < moment().toDate() || !this.isWeekSlotAvailable(value) ? '#cccccc' : '',
        },
      });
    return (
      <div className="app-calendar position-relative">
        {
          loader ? (
            <div className="spinnerSec">
              <Spinner color="primary" size="lg" className="mb-2" />
            </div>
          ) : null
        }

        <div
          className={`app-content-overlay ${sidebar ? "show" : "hidden"}`}
          onClick={() => {
            this.props.handleSidebar(false);
            this.props.handleSelectedEvent(null);
          }}
        ></div>
        <Card>
          <CardBody>

            <Calendar
              localizer={localizer}
              events={events}
              defaultView="dayCalendar"
              appointments={appointments}
              availabilities={availabilities}
              previousAppoint={previousAppoint}
              onEditAppointment={this.editAppointment}
              onAddAppointment={this.addAppointment}
              //  onEventDrop={this.moveEvent}
              //onEventResize={this.resizeEvent}
              onDrillDown={() => { }}
              onNavigate={(date, view) => {
                this.setState({ navigationDate: moment(date).toDate(), selectedView: view, loader: true })
                if (view == "dayCalendar") {
                  this.props.getPatientAppointments(moment(date).toDate(), view)
                } else if (view == "week") {
                  this.props.getPatientAppointments(moment(date).startOf('isoWeek').toDate(), "week")
                }
              }}
              startAccessor="start"
              endAccessor="end"
              views={views}
              step={10}
              timeslots={1}
              components={{
                toolbar: props => (<Toolbar {...props} getPatientAppointments={(date, view) => {
                  this.setState({ navigationDate: date, selectedView: view, loader: true })

                  this.props.getPatientAppointments(date, view)

                }}
                  appointmentCount={appointmentCount} onFormReset={this.formReset} />),
                timeSlotWrapper: ColoredDateCellWrapper
              }}
              eventPropGetter={this.handleEventColors}

              popup={true}
              onSelectEvent={(event) => {
                if (_.includes(event.status, "Waiting")) {
                  this.props.history.push(`/patient-preview/${event.patient[0]._id}/${event._id}`)
                }
                if (_.includes(event.status, "Scheduled")) {
                  this.editAppointment(event)
                }
                if (_.includes(event.status, "Connected")) {
                  this.props.history.push(`/telescrubs/televisit/${event.authToken}`)
                }
              }}
              onSelectSlot={({ start, end }) => {
                if (moment(start).isAfter()) {
                  if (this.isWeekSlotAvailable(start)) {
                    this.addAppointment(moment(start).format("hh:mm"), start, moment(start).format("A"))
                  } else {
                    ToastMessage({ status: false, message: "Not Available!" })
                  }
                } else {
                  ToastMessage({ status: false, message: "Select Future Date and Time" })
                }

              }}
              selectable={true}
              onSelecting={(slot) => {
                var duration = moment.duration(moment(slot.end).diff(slot.start));
                var mins = duration.asMinutes();
                if (mins > 10) {
                  return false;
                }
              }}


              parentProps={this.props}
            />
          </CardBody>
        </Card>
        <AddEventSidebar
          sidebar={sidebar}
          closeForm={() => {
            this.props.handleSidebar(false)
            this.props.getPatientAppointments(this.state.navigationDate, this.state.selectedView)
            this.state.appTime = ''
          }}
          addEvent={this.props.addEvent}
          events={this.state.events}
          eventInfo={this.state.eventInfo}
          appointmentInfo={this.state.appointmentInfo}
          selectedEvent={this.props.handleSelectedEvent}
          updateEvent={this.props.updateEvent}
          availabilities={this.state.availabilities}
          patients={this.state.patients}
          user={this.state.user}
          resizable
          appTime={this.state.appTime}
          appDate={this.state.appDate}
          appDateshow={this.state.appDateshow}

        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {

  const { doctor, patient, auth } = state;

  return {
    app: state.calendar,
    patients: patient.list,
    user: auth.login,
    appointments: patient.appointments,
    availabilities: doctor.availabilities,
  };
};

export default connect(mapStateToProps, {
  fetchEvents,
  handleSidebar,
  addEvent,
  handleSelectedEvent,
  updateEvent,
  updateDrag,
  updateResize,
  getPatient,
  getPatientAppointments,
  getAvailabilities
})(CalendarApp);





