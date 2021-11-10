import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  FormGroup,
  Input,
  Badge,
  Label,
} from "reactstrap";
import DataTable from "react-data-table-component"
import { Star, Search, Calendar } from "react-feather"
import moment from "moment";
import _ from "lodash";
import { getPatientDocuments } from "../../redux/actions/patientActions";
import loginImg from "../../assets/img/logo/logo.png";
import { IntakeFormImage } from "../../configs/ApiActionUrl";
import config from "../../configs";
import { patientOptions, patientCheckboxChange, visitFormValidation, patientCpt, IdcInputs, patientPeStatus, patientHistoryStatus, patientVisitFormKeys, icdCount, patientCopyPreviousData } from "./patient/PatientService";
import Pdf from "react-to-pdf";
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/flatpickr.css'
import SweetAlert from 'react-bootstrap-sweetalert';
import PDFViewer from 'pdf-viewer-reactjs'
import base64Img from 'base64-img';

const intakeformpdf = React.createRef();
const visitnotepdf = React.createRef();
const downloadFileRef = React.createRef();
const options = {
  orientation: 'landscape'
};

const CustomHeader = props => {
  return (
    <div className="d-flex flex-wrap justify-content-between">
      <div className="position-relative has-icon-right">
        <Flatpickr
          className="form-control"
          placeholder="Date Filter"
          options={{
            mode: "range",
            dateFormat: "m-d-Y",
            maxDate: moment().subtract(1, "days").toDate(),
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

class DocumentationManagement extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    columns: [
      {
        name: "First Name",
        selector: "patient.firstName",
        sortable: true,
        cell: row => (
          <p className="text-bold-500 text-truncate mb-0">{row.patient.firstName}</p>
        )
      },
      {
        name: "Last Name",
        selector: "patient.lastName",
        sortable: true,
        cell: row => (
          <p className="text-bold-500 text-truncate mb-0">{row.patient.lastName}</p>
        )
      },
      {
        name: "V_Type",
        selector: "createdByDoctor",
        sortable: true,
        cell: row => (
          <Badge
            color={row.createdByDoctor ? "light-warning" : "light-success"}
            pill>
            {(row.createdByDoctor) ? "N" : "UC"}
          </Badge>
        )
      },
      {
        name: "Visit Date",
        selector: "date",
        sortable: true,
        cell: row => (
          <p className="text-bold-500 text-truncate mb-0">{moment(row.date).format('MMM DD, YYYY')}</p>
        )
      },
      {
        name: "Intake Form",
        selector: "intakeForm",
        sortable: false,
        cell: (row) => {
          if (!_.isEmpty(row.intakeForm)) {
            return (
              <Pdf targetRef={intakeformpdf} onComplete={() => {
                this.setState({ download: false })
              }} options={options} filename={`Intake Form.pdf`}>
                {({ toPdf }) => <a className="text-bold-500" onClick={() => {
                  this.setState({ download: true, intakeForm: row.intakeForm[0], patient: row.patient }, () => {
                    toPdf()
                  });
                }} >Intake Form</a>}
              </Pdf>
            )
          } else {
            return null
          }
        }
      },
      {
        name: "Documents Uploaded",
        selector: "docUploaded",
        sortable: false,
        cell: (row) => {
          if (!_.isEmpty(row.intakeForm)) {
            return (
              <ul className="colors-list list-unstyled mb-0">
                {row.intakeForm[0].images.map((file, i) => {
                  return <li key={i}><span onClick={() => {
                    this.showFile(`${IntakeFormImage.path}` + `${file}`, file);
                  }} className="text-bold-500" key={i} title={file.split('_')[1]}>{this.showLimitedContent(file.split('_')[1])}</span></li>
                  // href={`${IntakeFormImage.path}${file}`}
                })}
              </ul>
            )
          }
        }
      },
      {
        name: "Visit Note",
        selector: "visitNote",
        sortable: false,
        cell: (row) => {
          if (!_.isEmpty(row.visitForm)) {
            return (
              <Pdf targetRef={visitnotepdf} onComplete={() => {
                this.setState({ download: false })
              }} options={options} filename={'Visit Form Note'}>
                {({ toPdf }) => <a className="text-bold-500" onClick={() => {
                  this.setState({ download: true, visitForm: row.visitForm[0], patient: row.patient }, () => {
                    toPdf()
                  });
                }} href="#">Visit Note</a>}
              </Pdf>
            )
          } else {
            return null
          }
        }
      },
      {
        name: "Fee Collected",
        selector: "payment.amount",
        sortable: true,
        cell: (row) => {
          if (!_.isEmpty(row.payment)) {
            return <p className="text-bold-500 text-truncate mb-0">${row.payment[0].amount}</p>
          } else {
            return <p className="text-bold-500 text-truncate mb-0">$0</p>
          }

        } 
      } 
    ],
    documentData: [],
    sortable: {selector: "date", sort: "desc"},
    page: 1,
    perPage: 10,
    total: 0,
    search: "",
    intakeForm: {},
    visitForm: {},
    patient: {},
    download: false,
    dateFilter: [],
    file: ""
  }

  componentDidMount() {
    this.getDocuments();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.documents.data != state.documentData) {
      if (props.documents.status) {
        return { documentData: props.documents.data.list, total: props.documents.data.total }
      }
    }
    return null
  }


  showFile = (filePath, file) => {
    base64Img.requestBase64(filePath, function (err, res, body) {
      console.log(res)
    });
    this.setState({ filePath: filePath, file: file, showFile: true });
  }

  showLimitedContent = (content) => {
    if (content.length > 7) {
      return content.substring(0, 7) + "...";
    }
    return content;
  }

  downloadFile = () => {


    downloadFileRef.current.click();
  }

  getDocuments = () => {
    this.props.getPatientDocuments({
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
      this.getDocuments();
    })
  }

  render() {
    let { documentData, columns, search, perPage, total, patient, intakeForm, visitForm, download } = this.state
    return (
      <Row>
        <Col md={12}>
          <Card>
            <CardHeader>
              <CardTitle>Patient Documentation Management</CardTitle>
            </CardHeader>
            <CardBody className="rdt_Wrapper">
              <DataTable
                className="document-management-datatable"
                data={documentData}
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
                subHeader
                subHeaderComponent={
                  <CustomHeader search={search} handleFilter={this.handleFilter} dateFilter={this.dateFilter} />
                }
              />
            </CardBody>
          </Card>

          {download ? (
            <div className="previewform" ref={intakeformpdf} style={{ width: 1122, height: '100%' }}>
              {!_.isEmpty(intakeForm) ? (
                <Card>
                  <CardHeader style={{ background: "white" }}>
                    <CardTitle className="w-100">
                      <Row>
                        <Col md="12">
                          <img
                            src={loginImg}
                            alt="loginImg"
                            width="165"
                            className="d-inline-block align-middle"
                            data-test="logoIMG" />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="5">Form Information</Col>
                        <Col md="7" className="pl-0 text-right">
                          <ul className="patient-detail">
                            <li>{_.toUpper(patient.lastName + ", " + patient.firstName)}</li>
                            <li>Mobile: {patient.mobile}</li>
                            <li>Email: {patient.email}</li>
                          </ul>
                        </Col>
                      </Row>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="pt-1" style={{ background: "white" }}>
                    <Col md={12} className="px-0">

                      <div>
                        <h5>Pharmacy</h5>
                        <p>{(intakeForm.hasDefaultPharmacy) ? patient.pharmacy.name : intakeForm.pharmacy}</p>
                      </div>

                      <div>
                        <h5>Reason of Visit</h5>
                        <p>{intakeForm.visitReason}</p>
                      </div>

                      <div>
                        <h5>Past Medical / Surgical History</h5>
                        <p>{intakeForm.pastHistory}</p>
                      </div>

                      <div>
                        <h5>Medications</h5>
                        <p>{intakeForm.medications}</p>
                      </div>

                      <div>
                        <h5>Allergies</h5>
                        <p>{intakeForm.allergies}</p>
                      </div>
                    </Col>
                  </CardBody>
                </Card>
              ) : null}
            </div>
          ) : null}

          {download ? (
            <div className="previewform" ref={visitnotepdf} style={{ width: 1122, height: '100%' }}>
              {!_.isEmpty(visitForm) ? (
                <Card>
                  <CardHeader style={{ background: "white" }}>
                    <CardTitle className="w-100">
                      <Row>
                        <Col md="12">
                          <img
                            src={loginImg}
                            alt="loginImg"
                            width="165"
                            className="d-inline-block align-middle"
                            data-test="logoIMG" />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="5">Patient New Visit Form Information</Col>
                        <Col md="7" className="pl-0 text-right">
                          <ul className="patient-detail">
                            <li>{_.toUpper(patient.lastName + ", " + patient.firstName)}</li>
                            <li>DOB: {moment(patient.dateOfBirth).format('DD/MM/YYYY')}</li>
                            <li>DoS: {moment(visitForm.createdAt).format('DD/MM/YYYY')}</li>
                          </ul>
                        </Col>
                      </Row>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="pt-1" style={{ background: "white" }}>
                    <Col md={12} className="px-0">
                      <div>
                        <ul className="pl-0">
                          <li>
                            <h5 className="d-inline-block"><b>Chief Complaint</b></h5>
                          </li>
                        </ul>
                        <div>
                          <h5>HPI Elements</h5>
                          <Row>
                            <ul>
                              <li><p><b>Location:</b></p> <p>{visitForm.visitFormData.hpi.location}</p></li>
                              <li><p><b>Quality:</b></p> <p>{visitForm.visitFormData.hpi.quality}</p></li>
                              <li><p><b>Timing:</b></p> <p>{visitForm.visitFormData.hpi.timing}</p></li>
                              <li><p><b>Severity:</b></p> <p>{visitForm.visitFormData.hpi.severity}</p></li>
                              <li><p><b>Duration:</b></p> <p>{visitForm.visitFormData.hpi.duration}</p></li>
                              <li><p><b>Context:</b></p> <p>{visitForm.visitFormData.hpi.context}</p></li>
                              <li><p><b>Modifying Factors:</b></p> <p>{visitForm.visitFormData.hpi.modifyingFactors}</p></li>
                              <li><p><b>Associated Signs and Symptoms:</b></p> <p>{visitForm.visitFormData.hpi.associatedSignsandSymptoms}</p></li>
                            </ul>
                          </Row>
                        </div>
                      </div>

                      <div>
                        <h5>History</h5>
                        <Row className="previewHistory">
                          <Col md={12} ><p className="ml-md-50"><b>Past Medical History:</b></p> <p>{visitForm.visitFormData.history.pasthistory}</p></Col>
                          <Col md={12} ><p className="ml-md-50"><b>Family History:</b></p> <p>{visitForm.visitFormData.history.familyhistory}</p></Col>
                          <Col md={12} ><p className="ml-md-50"><b>Social History:</b></p> <p>{visitForm.visitFormData.history.socialhistory}</p></Col>
                          <Col md={12} ><p className="ml-md-50"><b>Smoking History:</b></p> <p>{visitForm.visitFormData.history.smokinghistory}</p></Col>
                        </Row>
                      </div>
                      <div className="rosPreview">
                        <h5>Review of System</h5>
                        <Row>
                          <ul>
                            {visitForm.visitFormData.ros.weightloss === true || visitForm.visitFormData.ros.fevers === true || visitForm.visitFormData.ros.chills === true || visitForm.visitFormData.ros.nightsweats === true || visitForm.visitFormData.ros.fatigue === true || visitForm.visitFormData.others.constitutionalothers != '' ?
                              <li><p><b>Constitutional:</b></p>
                                {patientOptions.Constitutional.map((Constitutionalview, kk) => {
                                  return (<p key={kk}> &nbsp;{
                                    visitForm.visitFormData.ros[Constitutionalview.title] === true ? Constitutionalview.label + ',' : ''}
                                  </p>)
                                })}{visitForm.visitFormData.others.constitutionalothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.others.constitutionalothers}</p> : ''}
                              </li> : <></>}
                            {visitForm.visitFormData.ros.arthralgias === true || visitForm.visitFormData.ros.myalgias === true || visitForm.visitFormData.ros.muscleweakness === true
                              || visitForm.visitFormData.ros.jointswelling === true || visitForm.visitFormData.ros.nsaid === true || visitForm.visitFormData.others.musculoskeletalothers != '' ?
                              <li><p><b>Musculoskeletal:</b></p>
                                {patientOptions.Musculoskeletal.map((Musculoskeletalview) => {
                                  return (<p> &nbsp;{
                                    visitForm.visitFormData.ros[Musculoskeletalview.title] === true ? Musculoskeletalview.label + ',' : ''}
                                  </p>)
                                })}{visitForm.visitFormData.others.musculoskeletalothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.others.musculoskeletalothers}</p> : ''}
                              </li> : <></>}
                            {visitForm.visitFormData.ros.blurryVision === true || visitForm.visitFormData.ros.eyepain === true || visitForm.visitFormData.ros.discharge === true
                              || visitForm.visitFormData.ros.dryeyes === true || visitForm.visitFormData.ros.decreasedvision === true || visitForm.visitFormData.others.eyesothers != '' ?
                              <li><p><b>Eyes:</b></p>  {patientOptions.eyes.map((eyesview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.ros[eyesview.title] === true ? eyesview.label + ',' : ''}
                                </p>)
                              })}{visitForm.visitFormData.others.eyesothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.others.eyesothers}</p> : ''}</li> : <></>}
                            {visitForm.visitFormData.ros.sorethroat === true || visitForm.visitFormData.ros.tinnitus === true || visitForm.visitFormData.ros.bloodyNose === true
                              || visitForm.visitFormData.ros.hearingLoss === true || visitForm.visitFormData.ros.sinusitis === true || visitForm.visitFormData.others.entothers != '' ?
                              <li><p><b>ENT:</b></p>  {patientOptions.ent.map((entview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.ros[entview.title] === true ? entview.label + ',' : ''}
                                </p>)
                              })}{visitForm.visitFormData.others.entothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.others.entothers}</p> : ''}</li> : <></>}
                            {visitForm.visitFormData.ros.shortofbreath === true || visitForm.visitFormData.ros.cough === true || visitForm.visitFormData.ros.hemoptysis === true
                              || visitForm.visitFormData.ros.wheezing === true || visitForm.visitFormData.ros.pleurisy === true || visitForm.visitFormData.others.respiratoryothers != '' ?
                              <li><p><b>Respiratory:</b></p>  {patientOptions.Respiratory.map((Respiratoryview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.ros[Respiratoryview.title] === true ? Respiratoryview.label + ',' : ''}
                                </p>)
                              })}{visitForm.visitFormData.others.respiratoryothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.others.respiratoryothers}</p> : ''}</li> : <></>}
                            {visitForm.visitFormData.ros.chestpain === true || visitForm.visitFormData.ros.pnd === true || visitForm.visitFormData.ros.palpitations === true
                              || visitForm.visitFormData.ros.edema === true || visitForm.visitFormData.ros.orhtopnea === true || visitForm.visitFormData.ros.syncpe === true || visitForm.visitFormData.others.cardiovascularothers != '' ?
                              <li><p><b>Cardiovascular:</b></p>  {patientOptions.cardiovascular.map((cardiovascularview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.ros[cardiovascularview.title] === true ? cardiovascularview.label + ',' : ''}
                                </p>)
                              })}{visitForm.visitFormData.others.cardiovascularothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.others.cardiovascularothers}</p> : ''}</li> : <></>}
                            {visitForm.visitFormData.ros.nausea === true || visitForm.visitFormData.ros.vomiting === true || visitForm.visitFormData.ros.diarrhea === true
                              || visitForm.visitFormData.ros.hematemesis === true || visitForm.visitFormData.ros.melena === true || visitForm.visitFormData.others.gastrointestinalothers != '' ?
                              <li><p><b>Gastrointestinal:</b></p>  {patientOptions.Gastrointestinal.map((Gastrointestinalview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.ros[Gastrointestinalview.title] === true ? Gastrointestinalview.label + ',' : ''}
                                </p>)
                              })}{visitForm.visitFormData.others.gastrointestinalothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.others.gastrointestinalothers}</p> : ''}</li> : <></>}
                            {visitForm.visitFormData.ros.hematuria === true || visitForm.visitFormData.ros.dysuria === true || visitForm.visitFormData.ros.hesitancy === true
                              || visitForm.visitFormData.ros.incontinence === true || visitForm.visitFormData.ros.UTIs === true || visitForm.visitFormData.others.genitourinaryothers != '' ?
                              <li><p><b>Genitourinary:</b></p>  {patientOptions.Genitourinary.map((Genitourinaryview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.ros[Genitourinaryview.title] === true ? Genitourinaryview.label + ',' : ''}
                                </p>)
                              })}{visitForm.visitFormData.others.genitourinaryothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.others.genitourinaryothers}</p> : ''}</li> : <></>}
                            {visitForm.visitFormData.ros.rash === true || visitForm.visitFormData.ros.pruritis === true || visitForm.visitFormData.ros.sores === true
                              || visitForm.visitFormData.ros.nailchanges === true || visitForm.visitFormData.ros.skinThickening === true || visitForm.visitFormData.others.skinothers != '' ?
                              <li><p><b>Skin:</b></p>  {patientOptions.skin.map((skinview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.ros[skinview.title] === true ? skinview.label + ',' : ''}
                                </p>)
                              })}{visitForm.visitFormData.others.skinothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.others.skinothers}</p> : ''}</li> : <></>}
                            {visitForm.visitFormData.ros.migraines === true || visitForm.visitFormData.ros.numbness === true || visitForm.visitFormData.ros.ataxia === true
                              || visitForm.visitFormData.ros.tremors === true || visitForm.visitFormData.ros.vertigo === true || visitForm.visitFormData.others.neurologicalothers != '' ?
                              <li><p><b>Neurological:</b></p>  {patientOptions.Neurological.map((Neurologicalview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.ros[Neurologicalview.title] === true ? Neurologicalview.label + ',' : ''}
                                </p>)
                              })}{visitForm.visitFormData.others.neurologicalothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.others.neurologicalothers}</p> : ''}</li> : <></>}
                            {visitForm.visitFormData.ros.excessThirst === true || visitForm.visitFormData.ros.polyuria === true || visitForm.visitFormData.ros.coldintolerance === true
                              || visitForm.visitFormData.ros.heatintolerance === true || visitForm.visitFormData.ros.goiter === true || visitForm.visitFormData.others.endocrineothers != '' ?
                              <li><p><b>Endocrine:</b></p>  {patientOptions.Endocrine.map((Endocrineview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.ros[Endocrineview.title] === true ? Endocrineview.label + ',' : ''}
                                </p>)
                              })}{visitForm.visitFormData.others.endocrineothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.others.endocrineothers}</p> : ''}</li> : <></>}
                            {visitForm.visitFormData.ros.depression === true || visitForm.visitFormData.ros.anxiety === true || visitForm.visitFormData.ros.antiDepressants === true
                              || visitForm.visitFormData.ros.alcoholAbuse === true || visitForm.visitFormData.ros.drugAbuse === true || visitForm.visitFormData.ros.insomnia === true || visitForm.visitFormData.others.pshychiatricothers != '' ?
                              <li><p><b>Psychiatric:</b></p>  {patientOptions.Psychiatric.map((Psychiatricview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.ros[Psychiatricview.title] === true ? Psychiatricview.label + ',' : ''}
                                </p>)
                              })}{visitForm.visitFormData.others.pshychiatricothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.others.pshychiatricothers}</p> : ''}</li> : <></>}
                            {visitForm.visitFormData.ros.easyBruising === true || visitForm.visitFormData.ros.bleedingDiathesis === true || visitForm.visitFormData.ros.lymphedema === true
                              || visitForm.visitFormData.ros.bloodClots === true || visitForm.visitFormData.ros.swollenGlands === true || visitForm.visitFormData.others.hemLymphaticothers != '' ?
                              <li><p><b>Hem/Lymphatic:</b></p>  {patientOptions.HemLymphatic.map((HemLymphaticview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.ros[HemLymphaticview.title] === true ? HemLymphaticview.label + ',' : ''}
                                </p>)
                              })}{visitForm.visitFormData.others.hemLymphaticothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.others.hemLymphaticothers}</p> : ''}</li> : <></>}
                            {visitForm.visitFormData.ros.allergicrhinitis === true || visitForm.visitFormData.ros.hayfever === true || visitForm.visitFormData.ros.hives === true
                              || visitForm.visitFormData.ros.asthma === true || visitForm.visitFormData.ros.positivePPD === true || visitForm.visitFormData.others.allergicothers != '' ?
                              <li><p><b>Allergic/Immun:</b></p>  {patientOptions.Allergic.map((Allergicview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.ros[Allergicview.title] === true ? Allergicview.label + ',' : ''}
                                </p>)
                              })}{visitForm.visitFormData.others.allergicothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.others.allergicothers}</p> : ''}</li> : <></>}
                          </ul>
                        </Row>
                      </div>

                      <div className="rosPreview">
                        <h5>Physical Exam</h5>
                        <Row>
                          <ul className="mb-0">
                            {visitForm.visitFormData.peConstitutionalcount != 0 || visitForm.visitFormData.peothers.peconstitutionalothers != '' ? <li><p><b>Constitutional: </b></p>
                              {patientOptions.peConstitutional.map((peConstitutionalview, k) => {
                                return (<p key={k}> &nbsp;{
                                  visitForm.visitFormData.peConstitutional[peConstitutionalview.title] === true ? peConstitutionalview.label + ',' : ''}
                                </p>)
                              })}
                              {visitForm.visitFormData.peothers.peconstitutionalothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.peothers.peconstitutionalothers}</p> : ''}
                            </li> : <></>}

                            {visitForm.visitFormData.peENMTcount != 0 || visitForm.visitFormData.peothers.peenmtothers != '' ? <li><p><b>ENMT:</b></p>
                              {patientOptions.peENMT.map((peENMTview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.peENMT[peENMTview.title] === true ? peENMTview.label + ',' : ''}
                                </p>)
                              })}
                              {visitForm.visitFormData.peothers.peenmtothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.peothers.peenmtothers}</p> : ''}
                            </li> : <></>}

                            {visitForm.visitFormData.peRespiratorycount != 0 || visitForm.visitFormData.peothers.perespiratoryothers != '' ? <li><p><b>Respiratory:</b></p>
                              {patientOptions.peRespiratory.map((peRespiratoryview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.peRespiratory[peRespiratoryview.title] === true ? peRespiratoryview.label + ',' : ''}
                                </p>)
                              })}
                              {visitForm.visitFormData.peothers.perespiratoryothers != '' || visitForm.visitFormData.peothers.pecardiovascularothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.peothers.perespiratoryothers}</p> : ''}
                            </li> : <></>}
                            {visitForm.visitFormData.peCardiovascularcount != 0 ? <li><p><b>Cardiovascular:</b></p>
                              {patientOptions.peCardiovascular.map((peCardiovascularview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.peCardiovascular[peCardiovascularview.title] === true ? peCardiovascularview.label + ',' : ''}
                                </p>)
                              })}
                              {visitForm.visitFormData.peothers.pecardiovascularothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.peothers.pecardiovascularothers}</p> : ''}
                            </li> : <></>}
                            {visitForm.visitFormData.peGastrointestinalcount != 0 || visitForm.visitFormData.peothers.pegastrointestinalothers != '' ? <li><p><b>Gastrointestinal:</b></p>
                              {patientOptions.peGastrointestinal.map((peGastrointestinalview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.peGastrointestinal[peGastrointestinalview.title] === true ? peGastrointestinalview.label + ',' : ''}
                                </p>)
                              })}
                              {visitForm.visitFormData.peothers.pegastrointestinalothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.peothers.pegastrointestinalothers}</p> : ''}
                            </li> : <></>}
                            {visitForm.visitFormData.peMusculoskeletalcount != 0 || visitForm.visitFormData.peothers.pemusculoskeletalothers != '' ? <li><p><b>Musculoskeletal:</b></p>
                              {patientOptions.peMusculoskeletal.map((peMusculoskeletalview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.peMusculoskeletal[peMusculoskeletalview.title] === true ? peMusculoskeletalview.label + ',' : ''}
                                </p>)
                              })}
                              {visitForm.visitFormData.peothers.pemusculoskeletalothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.peothers.pemusculoskeletalothers}</p> : ''}
                            </li> : <></>}
                            {visitForm.visitFormData.peSkincount != 0 || visitForm.visitFormData.peothers.peskinothers != '' ? <li><p><b>Skin:</b></p>
                              {patientOptions.peSkin.map((peSkinview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.peSkin[peSkinview.title] === true ? peSkinview.label + ',' : ''}
                                </p>)
                              })}
                              {visitForm.visitFormData.peothers.peskinothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.peothers.peskinothers}</p> : ''}

                            </li> : <></>}
                            {visitForm.visitFormData.peNeurologiccount != 0 || visitForm.visitFormData.peothers.peneurologicothers != '' ? <li><p><b>Neurologic:</b></p>
                              {patientOptions.peNeurologic.map((peNeurologicview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.peNeurologic[peNeurologicview.title] === true ? peNeurologicview.label + ',' : ''}
                                </p>)
                              })}
                              {visitForm.visitFormData.peothers.peneurologicothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.peothers.peneurologicothers}</p> : ''}
                            </li> : <></>}
                            {visitForm.visitFormData.pePsychiatriccount != 0 || visitForm.visitFormData.peothers.pepsychiatricothers != '' ? <li><p><b>Psychiatric:</b></p>
                              {patientOptions.pePsychiatric.map((pePsychiatricview) => {
                                return (<p> &nbsp;{
                                  visitForm.visitFormData.pePsychiatric[pePsychiatricview.title] === true ? pePsychiatricview.label + ',' : ''}
                                </p>)
                              })}
                              {visitForm.visitFormData.peothers.pshychiatricothers != '' ? <p><b>Others:</b> {visitForm.visitFormData.peothers.pshychiatricothers}</p> : ''}
                            </li> : <></>}
                          </ul>
                        </Row>
                      </div>

                      {visitForm.visitFormData.mdmResult != '' ? <div className="rosPreview dataReview mb-0">
                        <Row>
                          <ul>
                            <li><h5 class="d-inline-block"><b>MDM:</b></h5> <p>{visitForm.visitFormData.mdmResult == 'SF' ? 'Minimal Risk' : this.state.mdmResult === 'low' ? 'Low Risk' : this.state.mdmResult === 'mod' ? 'Moderate Risk' : this.state.mdmResult === 'high' ? 'High Risk' : ''} </p></li>
                          </ul>
                        </Row></div> : <></>}

                      <Col md="12" className="patient-new-visit  minHeight">
                        <Row>
                          <Col md="12 " className="border" >
                            <Row>
                              {visitForm.visitFormData.count != 0 ?
                                <Col className=" col-auto pr-md-0 pl-5px">
                                  <Label className="d-inline-block px-0">
                                    <h6>HPI:</h6>
                                  </Label>
                                  {visitForm.visitFormData.count >= 1 && visitForm.visitFormData.count <= 3 ?
                                    <p className="mr-1 d-inline-block" >&nbsp; Brief</p>
                                    :
                                    <p className="mr-1 d-inline-block" >&nbsp; Extended</p>
                                  }</Col> : <></>}
                              {visitForm.visitFormData.roscount >= 1 ?
                                <Col className="col-auto ">
                                  <Label className="d-inline-block px-0">
                                    <h6>ROS:</h6>
                                  </Label>
                                  <p className="mr-1 d-inline-block" >&nbsp; {visitForm.visitFormData.roscount}</p>
                                </Col>
                                : <></>}
                              {visitForm.visitFormData.count != 0 ?
                                <Col className="col-auto">
                                  <Label className="d-inline-block px-0 " for="history-level">
                                    <h6>History:</h6>
                                  </Label>
                                  <p className="mr-1 d-inline-block" >&nbsp; {visitForm.visitFormData.historyStatus}</p>
                                </Col> : <></>}
                              {visitForm.visitFormData.pEtotalCount === true ?
                                <Col className="col-auto pr-md-0">
                                  <Label className="d-inline-block px-0">
                                    <h6>PE:</h6>
                                  </Label>
                                  <p className="mr-1 d-inline-block" >&nbsp; {visitForm.visitFormData.peStatus}</p>
                                </Col> : <></>}
                              {visitForm.visitFormData.mdmResult != '' ?
                                <Col className="col-auto ">
                                  <Label className="d-inline-block px-0" for="mdm">
                                    <h6>MDM: </h6>
                                  </Label>
                                  <p className="mr-1 d-inline-block" >&nbsp; {visitForm.visitFormData.mdmResult}</p>
                                </Col> : <></>}
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Col>

                  </CardBody>
                </Card>
              ) : null}
            </div>
          ) : null}
        </Col>

        {this.state.showFile ? (
          <Row className="d-flex align-items-center justify-content-center m-0 vc-loader">
            <Col md="12">
              <SweetAlert
                style={{ width: '100%' }}
                showCloseButton
                confirmBtnText="Download"
                confirmBtnBsStyle="outline-primary py-50 px-1"
                title="Intake Document"
                className="boxShadow"
                onCancel={() => this.setState({ showFile: false })}
                onConfirm={() => { this.downloadFile() }}
                width='850px'
                onEscapeKey={() => this.setState({ showFile: false })}
                onOutsideClick={() => this.setState({ showFile: false })}
              >
                {(this.state.file.split('.').pop() == "pdf") ?
                  (<PDFViewer
                    document={{
                      url: `${config.apiBaseUrl}/api/patient/pdfViewer/IntakePic/${this.state.file}`,
                    }}
                  />) :
                  (<img src={this.state.filePath} />)
                }
              </SweetAlert>
            </Col>
          </Row>
        ) : null
        }


      </Row>
    )
  }
}
const mapStateToProps = (state) => {
  const { auth, patient } = state;
  return {
    authentication: auth.login,
    documents: patient.documents
  };
};

export default connect(mapStateToProps, { getPatientDocuments })(
  DocumentationManagement
); 