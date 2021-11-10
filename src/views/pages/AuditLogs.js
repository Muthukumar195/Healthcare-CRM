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
import { getAuditLogs } from "../../redux/actions/doctorActions";
import { TableLoading } from "../../components";
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



class AuditLogs extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    columns: [
      {
        name: "Logs",
        selector: "createdAt",
        sortable: true,
        cell: row => (
          <p className="text-bold-500 text-truncate mb-0">
          {moment(row.createdAt).format('MMM DD, YYYY HH:mm:ss')} - {moment().tz(moment.tz.guess()).format('z')} | {this.userName(row)} | {this.userType(row)} | {row.action} | {row.message}
          </p>
        ) 
      }   
    ],
    auditLogs: [],
    sortable: {selector: "createdAt", sort: "desc"},
    page: 1,
    perPage: 10,
    total: 0,
    search: "",
    dateFilter: [],
    loading:true,
  }

  componentDidMount() {
    this.getLogs();
  }

  static getDerivedStateFromProps(props, state) {  
    if (props.auditLogs.data != state.auditLogs) { 
      if (props.auditLogs.status) { 
        return { auditLogs: props.auditLogs.data, total: props.auditLogs.data.total, loading:false }
      }
    }
    return null
  }

  userName = (row) =>{
    if (row.isDoctor) { 
      let userName = (!_.isEmpty(row.doctor))? `${row.doctor[0].firstName} ${row.doctor[0].lastName}`: null;
      return userName; 
    } else {
      var userName = "Anonymous User";
      if (!_.isEmpty(row.patient)) {
        userName = `${row.patient[0].firstName} ${row.patient[0].lastName}`;
      }
      return userName 
    }
  }
  userType = (row)=>{
    if (row.isDoctor) {  
      return  "D";
    } else {
      return  "P";
    }
  }
   

  getLogs = () => { 
    this.setState({loading: true})
    var date = this.state.dateFilter;
    if(!_.isEmpty(date)){
      date[0] = moment(date[0]).format("YYYY-MM-DD")
      date[1] = moment(date[1]).format("YYYY-MM-DD")
    } 
    this.props.getAuditLogs({
      request: this.props.authentication.userRole,
      page: this.state.page,
      perPage: this.state.perPage,
      sortable: this.state.sortable,
      search: this.state.search,
      dateFilter: date
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
    console.log(this.state.loading)
    let { auditLogs, columns, search, perPage, total, loading } = this.state
    return (
      <Row className="video_audit_logs">
        <Col md={12}>
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
            </CardHeader>
            <CardBody className="rdt_Wrapper">
            <CustomHeader search={search} handleFilter={this.handleFilter} dateFilter={this.dateFilter} />
              <DataTable
                className="document-management-datatable min-row-list"
                data={auditLogs.list}
                columns={columns}
                //noDataComponent= {<TableLoading loading={loading}/>}
                progressPending={loading}
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
  const { auth, doctor } = state;
  return {
    authentication: auth.login,
    auditLogs: doctor.auditLogs
  };
};

export default connect(mapStateToProps, { getAuditLogs })(
  AuditLogs
); 