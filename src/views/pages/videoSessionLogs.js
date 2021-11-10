import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Input,

} from "reactstrap";
import DataTable from "react-data-table-component"
import { Search, Calendar } from "react-feather"
import { FaStethoscope } from 'react-icons/fa';
import moment from "moment";
import _ from "lodash";
import { getVideoSessionLogs } from "../../redux/actions/videoActions";
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/flatpickr.css'
const intakeformpdf = React.createRef();
const visitnotepdf = React.createRef();

const options = {
  orientation: 'landscape'
};

const CustomHeader = props => {
  return (
    <div className="d-flex flex-wrap pull-right mb-5px pr-md-2 pl-2 pl-md-0 pl-sm-0">
      <div className="position-relative has-icon-right">
        <Flatpickr
          className="form-control"
          placeholder="Date Filter"
          options={{
            mode: "range",
            dateFormat: "m-d-Y",
            maxDate: moment().toDate(),
          }}
          onChange={date => {
            props.dateFilter(date)
          }}
        />
        <div className="form-control-position">
          <Calendar size={15} />
        </div>
      </div>
      <div className="position-relative has-icon-right">

        <Input value={props.search} onChange={e => props.handleFilter(e)} placeholder="Search" />
        <div className="form-control-position">
          <Search size="15" />
        </div>
      </div>
    </div>
  )
}

class VideoSessionLogs extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    columns: [
      {
        name: "Log Date & Time",
        selector: "datetime",
        sortable: true,
        // cell: row => (
        //   <p className="text-bold-500 text-truncate mb-0">{moment(row.createdAt).format('MMM DD, YYYY HH:mm:ss')}</p>
        // ),
        grow: 0.8,
        maxWidth: '200px'
      },
      {
        name: "User",
        selector: "User",
        sortable: true,
        grow: 1,

        maxWidth: '200px'
        // cell: (row) => {
        //   if (!row.isDoctor) {
        //     var patientName = "Anonymous User";
        //     if (!_.isEmpty(row.patient)) {
        //       patientName = `${row.patient[0].firstName} ${row.patient[0].lastName}`;
        //     }
        //     return (
        //       <Fragment>
        //         <p title={patientName}><span className="feather icon-user primary customIcon" ></span>{patientName}</p>
        //       </Fragment>
        //     )
        //   } else {
        //     return (
        //       <Fragment>
        //         <p title={`${row.doctor[0].firstName} ${row.doctor[0].lastName}`}><FaStethoscope className="primary" size="20" /> {row.doctor[0].firstName} {row.doctor[0].lastName}</p>
        //       </Fragment>
        //     )
        //   }
        // }

      },
      {
        name: "UT",
        selector: "UT",
        sortable: true,
        //   cell: (row) => {
        //     if (!row.hasNoAudioVideo) {
        //       return <span className="feather icon-check text-success customIcon" ></span>
        //     } else {
        //       return <span className="feather icon-x text-danger customIcon"></span>
        //     }
        //   }
        width: '50px'
      },
      {
        name: "Action",
        selector: "Action",
        sortable: true,
        // cell: (row) => {
        //   if (!row.hasAudioDenied) {
        //     return <span className="feather icon-check text-success customIcon" ></span>
        //   } else {
        //     return <span className="feather icon-x text-danger customIcon"></span>
        //   }
        // }
        grow: 1,
        maxWidth: '150px'
      },
      {
        name: "Status",
        selector: "Status",
        sortable: true,
        // cell: (row) => {
        //   if (!row.hasVideoDenied) {
        //     return <span className="feather icon-check text-success customIcon" ></span>
        //   } else {
        //     return <span className="feather icon-x text-danger customIcon"></span>
        //   }
        // }
        grow: 1.5,
        maxWidth: '400px',
        style:{
          whiteSpace:'unset'
        },
        whiteSpace:'unset'

      },
    ],
    logData: [],
    sortable: { selector: "createdAt", sort: "desc" },
    page: 1,
    perPage: 10,
    total: 0,
    search: "",
    dateFilter: []
  }

  componentDidMount() {
    this.getLogs();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.videoSessionLogs.data != state.videoSessionLogs) {
      if (props.videoSessionLogs.status) {
        return { logData: props.videoSessionLogs.data.list, total: props.videoSessionLogs.data.total }
      }
    }
    return null
  }

  getLogs = () => {
    this.props.getVideoSessionLogs({
      request: this.props.authentication.userRole,
      page: this.state.page,
      perPage: this.state.perPage,
      sortable: this.state.sortable,
      search: this.state.search,
      dateFilter: this.state.dateFilter
    })
  }
  handleFilter = e => {
    let search = e.target.value;
    this.setFilter({ search });
  }

  dateFilter = date => {
    if (date.length == 2) {
      this.setFilter({ dateFilter: date });
    }
  }

  setFilter = (state) => {
    this.setState(state, () => {
      this.getLogs();
    })
  }

  render() {
    let { logData, columns, search, perPage, total } = this.state
    return (
      <Row className="video_audit_logs">
        <Col md={12}>
          <Card>
            <CardHeader>
              <CardTitle>Video &amp; Audit Logs</CardTitle>
            </CardHeader>
            <CardBody className="rdt_Wrapper">
              <CustomHeader search={search} handleFilter={this.handleFilter} dateFilter={this.dateFilter} />
              <DataTable
                className="document-management-datatable min-row-list"
                data={logData}
                columns={columns}
                noHeader
                pagination
                paginationServer
                paginationTotalRows={total}
                paginationPerPage={perPage}
                onChangePage={page => this.setFilter({ page })}
                onChangeRowsPerPage={perPage => this.setFilter({ perPage })}
                sortServer={true}
                onSort={(column, sortDirection) => {
                  this.setFilter({
                    sortable: {
                      selector: column.selector,
                      sort: sortDirection
                    }
                  })
                }}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
  }
}
const mapStateToProps = (state) => {
  const { auth, patient, video } = state;
  return {
    authentication: auth.login,
    videoSessionLogs: video.videoSessionLogs
  };
};

export default connect(mapStateToProps, { getVideoSessionLogs })(
  VideoSessionLogs
); 