import React, { Fragment } from "react";
import classnames from "classnames";
import { Check, Search } from "react-feather";
import { connect } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { IntakeFormImage } from "../../../configs/ApiActionUrl";

import {
    Link,
    Route
} from "react-router-dom";
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
    TabContent, TabPane, Nav, NavItem, NavLink, Label, Collapse
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { getExtensionImg, downloadFile, confirmAlert } from "../../../components";
import { getPatientIntake } from "../../../redux/actions/patientActions";
import { rosList, patientOptions, physicalList, hpiStatus, rosCount, icdCount } from "./PatientService";
import {
    fetchEvents,
    handleSidebar,
    addEvent,
    handleSelectedEvent,
    updateEvent,
    updateDrag,
    updateResize,
} from "../../../redux/actions/calendar/index";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "react-feather";
import _ from 'lodash';
import moment from 'moment';

class PatientPreview extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            active: "1",
            patientCollapse: [],
            establishedCollapse: false,
            patientIntake: {},
            intakeForm: {},
            visitForm: [],
            cancelSession: false

        }
    }

    componentDidMount() {
        console.log(this.props)
        this.props.getPatientIntake(this.props.match.params.id, this.props.match.params.appointmentId)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.patientIntake.data != prevState.patientIntake) {
            if (nextProps.patientIntake.status) {
                let patient = nextProps.patientIntake.data[0];
                if (!_.isEmpty(patient)) {
                    return {
                        patientIntake: patient,
                        intakeForm: (!_.isEmpty(patient.intakeForm)) ? patient.intakeForm[0] : {},
                        visitForm: (!_.isEmpty(patient.visitForm)) ? patient.visitForm : [],
                        authToken: nextProps.patientIntake.data[0].authToken
                    }
                }else{
                    return null;
                }
            }
        }
        return null;
    }

    patientCollapse = (k) => {
        var collapse = []
        for (var i = 0; i <= this.state.visitForm.length; i++) {
            collapse.push(false);
        }
        collapse[k] = !this.state.patientCollapse[k];
        this.setState({ patientCollapse: collapse })
    }
    establishedCollapse = () => {
        if (this.state.patientCollapse !== true) {
            this.setState({
                establishedCollapse: !this.state.establishedCollapse
            })
        }
        else if (this.state.patientCollapse === true) {
            this.setState({
                establishedCollapse: !this.state.establishedCollapse,
                patientCollapse: false
            })
        }
    }
    toggle = tab => {
        if (this.state.active !== tab) {
            this.setState({ active: tab })
        }
    }
    cancelSession = () => {
        this.setState({
            cancelSession: !this.state.cancelSession
        })
    }
    render() {
        const { patientIntake, intakeForm, visitForm } = this.state;
        return (
            <div>
                <Row>
                    <Col md="12" className="patientPreview">
                        <Nav pills className="nav-justified nav-pill-success">
                            <NavItem>
                                <NavLink
                                    className={classnames("p-1 shadow", {
                                        active: this.state.active === "1",
                                    })}
                                    onClick={() => {
                                        this.toggle("1")
                                    }}
                                >
                                    <h3 className="mb-0">Patient Intake</h3>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames("p-1 shadow", {
                                        active: this.state.active === "2",
                                    })}
                                    onClick={() => {
                                        this.toggle("2")
                                    }}

                                >
                                    <h3 className="mb-0">Uploaded Documents</h3>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames("p-1 shadow", {
                                        active: this.state.active === "3",
                                    })}
                                    onClick={() => {
                                        this.toggle("3")
                                    }}
                                >
                                    <h3 className="mb-0">Previous Encounters</h3>
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <Col md="12" className="doc-video-form patient-new-visit px-0">
                            <Formik>
                                <Form>
                                    <TabContent activeTab={this.state.active}>

                                        <TabPane tabId="1">
                                            <Card className="mb-0">
                                                <CardBody className="w-100">
                                                    <div className="row"><div className="col-md-6">
                                                        <h3 className="title">Patient Intake Form Information</h3>
                                                    </div>
                                                        <div className="pl-0 text-right col-md-6">
                                                            <ul className="patient-detail">
                                                                <li>{_.toUpper(patientIntake.lastName)}, {_.toUpper(patientIntake.firstName)}</li>
                                                                <li>DOB: {moment(patientIntake.dateOfBirth).format('MM/DD/YYYY')}</li>
                                                                <li>DoS: {moment().format('MM/DD/YYYY')}</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="search-bar">

                                                        {/* <div className="d-block">
                                            <Checkbox
                                                color="primary"
                                                icon={<Check className="vx-icon" size={12} />}
                                                defaultChecked="true"
                                                label="Default Pharmacy"
                                                size="sm"
                                                checked
                                                readonly
                                            />
                                        </div> */}
                                                        {(intakeForm.hasDefaultPharmacy) ? (
                                                            <Media className="border p-50 mb-1">
                                                                <Media className="w-100" body>
                                                                    <h3 className="text-bold-400 mb-0">
                                                                        <a
                                                                            href="#"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                        >
                                                                            {patientIntake.pharmacy.name}
                                                                        </a>
                                                                    </h3>
                                                                    {/* <p className="mb-0">
                                                                {patientIntake.pharmacy.address}
                                                            </p>
                                                            <p className="mb-0">
                                                                {patientIntake.pharmacy.status}
                                                            </p>
                                                            <p className="mb-0">Phone Number: {patientIntake.pharmacy.phone}</p> */}
                                                                </Media>
                                                            </Media>
                                                        ) : <Media className="border p-50 mb-1">
                                                                <Media className="w-100" body>
                                                                    <h3 className="text-bold-400 mb-0">
                                                                        <a
                                                                            href="#"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                        >
                                                                            {intakeForm.pharmacy}
                                                                        </a>
                                                                    </h3>
                                                                </Media>
                                                            </Media>}

                                                        <Card className="mb-0">
                                                            <CardBody className="p-0">

                                                                <div className="history floating-input">        <Row>
                                                                    <Col md="6">
                                                                        <FormGroup className="form-label-group my-1 ">
                                                                            <Input
                                                                                type="textarea"
                                                                                placeholder="Reason For Visit"
                                                                                id="reason"
                                                                                rows="3"
                                                                                className="form-control"
                                                                                name="reason"
                                                                                value={intakeForm.visitReason}
                                                                                disabled
                                                                            />    <Label for="reason">Reason For Visit</Label>
                                                                        </FormGroup>                                </Col>
                                                                    <Col md="6">
                                                                        <FormGroup className="form-label-group my-1">
                                                                            <Input
                                                                                type="textarea"
                                                                                placeholder="Past Medical / Surgical History"
                                                                                id="pasthistory"
                                                                                rows="3"
                                                                                className="form-control"
                                                                                name="pasthistory"
                                                                                value={intakeForm.pastHistory}
                                                                                disabled
                                                                            />    <Label for="pmh">Past Medical / Surgical History</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup className="form-label-group my-1 ">
                                                                            <Input
                                                                                type="textarea"
                                                                                placeholder="Medication"
                                                                                id="medication"
                                                                                rows="3"
                                                                                className="form-control"
                                                                                name="medication"
                                                                                value={intakeForm.medications}

                                                                                disabled
                                                                            />    <Label for="medication">Medication</Label>
                                                                        </FormGroup>                                </Col>
                                                                    <Col md="6">
                                                                        <FormGroup className="form-label-group my-1">
                                                                            <Input
                                                                                type="textarea"
                                                                                placeholder="Allergies"
                                                                                id="allergies"
                                                                                rows="3"
                                                                                className="form-control"
                                                                                name="allergies"
                                                                                value={intakeForm.allergies}
                                                                                disabled
                                                                            />    <Label for="allergies">Allergies</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                </div>


                                                            </CardBody>
                                                        </Card>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <Card className='documentSection'>
                                                <CardBody className="w-100 my-1">
                                                    <Row>
                                                        {
                                                            (intakeForm.images) ?
                                                                (
                                                                    intakeForm.images.length != 0 ?
                                                                        intakeForm.images.map((image, k) => {
                                                                            let previewUrl = `${IntakeFormImage.path}${image}`

                                                                            return (
                                                                                <Col key={k} md={2} className="text-center mt-50">
                                                                                    <a href={previewUrl} target="_blank"
                                                                                    // onClick={
                                                                                    //     () => {
                                                                                    //         downloadFile('IntakePic', image)
                                                                                    //     }
                                                                                    // }
                                                                                    ><img src={getExtensionImg(image)} />
                                                                                        <p>{image}</p>
                                                                                    </a>
                                                                                </Col>
                                                                            )
                                                                        }) : <h2 className="m-auto">No Records Found</h2>
                                                                ) : null
                                                        }
                                                    </Row>

                                                </CardBody></Card>
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <Card className="patientPreviewtab">
                                                <CardBody className="w-100 min-height-55 ">
                                                    {
                                                        visitForm.length !== 0 ?
                                                            visitForm.map((visit, k) => {
                                                                var visit = visit['visitFormData'];
                                                                return (
                                                                    <Card key={k} className="previewform patientpreview  mb-0"
                                                                    >
                                                                        <CardHeader onClick={() => { this.patientCollapse(k) }} className="bg-active"
                                                                        >
                                                                            <CardTitle className="lead collapse-title collapsed">
                                                                                <div className="row">

                                                                                    <div className="pl-0 col-md-12">
                                                                                        <ul className="patient-detail">
                                                                                            <li>DoS: {moment(visit.dos).format('MM/DD/YYYY')}</li>
                                                                                            <li>{k === 0 ? "Patient Office Visit Form" : "Established Office Visit Form"}</li>
                                                                                            <li>{_.toUpper(patientIntake.lastName)}, {_.toUpper(patientIntake.firstName)}</li>
                                                                                            <li>DOB: {moment(patientIntake.dateOfBirth).format('MM/DD/YYYY')}</li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            </CardTitle> {this.state.patientCollapse[k] === true ? <ChevronUp size={25} className="collapse-icon" /> : <ChevronDown size={25} className="collapse-icon" />}
                                                                        </CardHeader>
                                                                        <Collapse isOpen={this.state.patientCollapse[k]}
                                                                        >
                                                                            <CardBody>
                                                                                <div className="px-0 col-md-12">
                                                                                    <div>
                                                                                        <ul className="pl-0">
                                                                                            <li>
                                                                                                <h5 className="d-inline-block"><b>Chief Complaint:</b></h5>
                                                                                                <p>{visit.chiefcomplaint}</p>
                                                                                            </li>
                                                                                        </ul>
                                                                                        <div>
                                                                                            <h5>HPI Elements</h5>
                                                                                            <div className="row">
                                                                                                <ul>
                                                                                                    {(visit.hpi.location) ? (
                                                                                                        <li>
                                                                                                            <p><b>Location:</b></p>
                                                                                                            <p>{visit.hpi.location}</p>
                                                                                                        </li>
                                                                                                    ) : null}
                                                                                                    {(visit.hpi.quality) ? (
                                                                                                        <li>
                                                                                                            <p><b>Quality:</b></p>
                                                                                                            <p>{visit.hpi.quality}</p>
                                                                                                        </li>
                                                                                                    ) : null}
                                                                                                    {(visit.hpi.timing) ? (
                                                                                                        <li>
                                                                                                            <p><b>Timing:</b></p>
                                                                                                            <p>{visit.hpi.timing}</p>
                                                                                                        </li>
                                                                                                    ) : null}
                                                                                                    {(visit.hpi.severity) ? (
                                                                                                        <li>
                                                                                                            <p><b>Severity:</b></p>
                                                                                                            <p>{visit.hpi.severity}</p>
                                                                                                        </li>
                                                                                                    ) : null}
                                                                                                    {(visit.hpi.duration) ? (
                                                                                                        <li>
                                                                                                            <p><b>Duration:</b></p>
                                                                                                            <p>{visit.hpi.duration}</p>
                                                                                                        </li>
                                                                                                    ) : null}
                                                                                                    {(visit.hpi.context) ? (
                                                                                                        <li>
                                                                                                            <p><b>Context:</b></p>
                                                                                                            <p>{visit.hpi.context}</p>
                                                                                                        </li>
                                                                                                    ) : null}
                                                                                                    {(visit.hpi.modifyingFactors) ? (
                                                                                                        <li>
                                                                                                            <p><b>Modifying Factors:</b></p>
                                                                                                            <p>{visit.hpi.modifyingFactors}</p>
                                                                                                        </li>
                                                                                                    ) : null}
                                                                                                    {(visit.hpi.modifyingFactors) ? (
                                                                                                        <li>
                                                                                                            <p><b>Associated Signs and Symptoms:</b></p>
                                                                                                            <p>{visit.hpi.associatedSignsandSymptoms}</p>
                                                                                                        </li>
                                                                                                    ) : null}
                                                                                                </ul>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {(visit.history.pasthistory) || (visit.history.familyhistory)
                                                                                        || (visit.history.socialhistory) || (visit.history.smokinghistory) ?
                                                                                        <div>
                                                                                            <h5>History</h5>
                                                                                            <div className="previewHistory row">
                                                                                                {(visit.history.pasthistory) ? (<div className="col-md-12">
                                                                                                    <p className="ml-md-50"><b>Past Medical History:</b></p>
                                                                                                    <p> {visit.history.pasthistory}</p>
                                                                                                </div>) : null}
                                                                                                {(visit.history.familyhistory) ? (<div className="col-md-12">
                                                                                                    <p className="ml-md-50"><b>Family History:</b></p>
                                                                                                    <p>{visit.history.familyhistory}</p>
                                                                                                </div>) : null}
                                                                                                {(visit.history.socialhistory) ? (<div className="col-md-12">
                                                                                                    <p className="ml-md-50"><b>Social History:</b></p>
                                                                                                    <p> {visit.history.socialhistory}</p>
                                                                                                </div>) : null}
                                                                                                {(visit.history.smokinghistory) ? (<div className="col-md-12">
                                                                                                    <p className="ml-md-50"><b>Smoking History:</b></p>
                                                                                                    <p> {visit.history.smokinghistory}</p>
                                                                                                </div>) : null}
                                                                                            </div>
                                                                                        </div> : null}
                                                                                    {rosCount(visit.ros) !== 0 ? <div className="rosPreview">
                                                                                        <h5>Review of System</h5>
                                                                                        <div className="row">
                                                                                            <ul>
                                                                                                {
                                                                                                    patientOptions.reviewOfSystemView.map((ros, k) => {
                                                                                                        return rosList(ros.value, visit.ros) ?
                                                                                                            (<li key={k}>
                                                                                                                <p><b>{ros.label}: </b></p>
                                                                                                                <p>&nbsp;{rosList(ros.value, visit.ros)}</p>
                                                                                                            </li>) : null

                                                                                                    })
                                                                                                }
                                                                                            </ul>
                                                                                        </div>
                                                                                    </div> : null}
                                                                                    <div className="rosPreview">
                                                                                        <h5>Physical Exam</h5>
                                                                                        <div className="row">
                                                                                            <ul className="mb-0">
                                                                                                {
                                                                                                    patientOptions.physicalSystemView.map((ps, k) => {
                                                                                                        return physicalList(ps.value, visit[ps.value]) ?
                                                                                                            (<li key={k}>
                                                                                                                <p><b>{ps.label}: </b></p>
                                                                                                                <p>&nbsp;{physicalList(ps.value, visit[ps.value])}</p>
                                                                                                                <p>&nbsp;</p>
                                                                                                            </li>) : null

                                                                                                    })
                                                                                                }
                                                                                            </ul>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="rosPreview dataReview mb-0">
                                                                                        <div className="row">
                                                                                            <ul>
                                                                                                <li>
                                                                                                    <h5 className="d-inline-block"><b>MDM:</b></h5>
                                                                                                    <p>&nbsp;{visit.mdmResult == 'SF' ? 'Minimal Risk' : visit.mdmResult === 'low' ? 'Low Risk' : visit.mdmResult === 'mod' ? 'Moderate Risk' : visit.mdmResult === 'high' ? 'High Risk' : ''} </p>
                                                                                                </li>
                                                                                            </ul>
                                                                                        </div>
                                                                                    </div>
                                                                                    {(visit.dataReviewed) ? <div className="rosPreview dataReview mb-0">
                                                                                        <div className="row">
                                                                                            <ul>
                                                                                                <li>
                                                                                                    <h5 className="d-inline-block"><b>Data Reviewed:</b></h5>
                                                                                                    &nbsp;
                                                                                     <p>{visit.dataReviewed}</p>
                                                                                                </li>
                                                                                            </ul>
                                                                                        </div>
                                                                                    </div> : null}
                                                                                    {icdCount(visit.icd) !== 0 ? <div className="rosPreview assessment">
                                                                                        <h5>Assessment and Plan</h5>
                                                                                        <div className="row">
                                                                                            <ul>
                                                                                                {visit.icd.map((icdVal, i) => {
                                                                                                    return (
                                                                                                        <Fragment key={i}>
                                                                                                            {(icdVal.code != "") ? (
                                                                                                                <li>
                                                                                                                    <p><b>ICD Code {i + 1}:</b></p>
                                                                                                                    <p>{icdVal.code}:
                                                                                         {icdVal.monitor !== '' && icdVal.evaluate !== ''
                                                                                                                            && icdVal.assess !== '' && icdVal.treatment !== '' ? (icdVal.monitor + ',' + icdVal.evaluate + ',' + icdVal.assess + ',' + icdVal.treatment) : ''}
                                                                                                                    </p>
                                                                                                                </li>
                                                                                                            ) : null}
                                                                                                        </Fragment>
                                                                                                    )
                                                                                                })
                                                                                                }
                                                                                                {visit.cptValue.value !== '' ? <li>
                                                                                                    <p><b>CPT Code:</b></p>
                                                                                                    <p>{visit.cptValue.value} </p>
                                                                                                </li> : null}
                                                                                            </ul>
                                                                                        </div>
                                                                                    </div> : ''}
                                                                                </div>
                                                                                <div className="patient-new-visit  minHeight col-md-12">
                                                                                    <div className="row">
                                                                                        <div className="border  col-md-12  ">
                                                                                            <div className="row">
                                                                                                <div className=" col-auto pr-md-0 pl-5px col">
                                                                                                    <label className="d-inline-block px-0">
                                                                                                        <h6>HPI:</h6>
                                                                                                    </label>
                                                                                                    <p className="mr-1 d-inline-block">&nbsp; {hpiStatus(visit.hpi)}</p>

                                                                                                </div>
                                                                                                <div className="col-auto  col">
                                                                                                    <label className="d-inline-block px-0">
                                                                                                        <h6>ROS:</h6>
                                                                                                    </label>
                                                                                                    <p className="mr-1 d-inline-block">&nbsp; {rosCount(visit.ros)}</p>
                                                                                                </div>
                                                                                                <div className="col-auto col">
                                                                                                    <label htmlFor="history-level" className="d-inline-block px-0 ">
                                                                                                        <h6>History:</h6>
                                                                                                    </label>
                                                                                                    <p className="mr-1 d-inline-block">&nbsp; {visit.historyStatus}</p>
                                                                                                </div>
                                                                                                <div className="col-auto pr-md-0 col">
                                                                                                    <label className="d-inline-block px-0">
                                                                                                        <h6>PE:</h6>
                                                                                                    </label>
                                                                                                    <p className="mr-1 d-inline-block">&nbsp; {visit.peStatus}</p>
                                                                                                </div>
                                                                                                <div className="col-auto  col">
                                                                                                    <label htmlFor="mdm" className="d-inline-block px-0">
                                                                                                        <h6>MDM: </h6>
                                                                                                    </label>
                                                                                                    <p className="mr-1 d-inline-block">&nbsp; {visit.mdmResult}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </CardBody>
                                                                        </Collapse>
                                                                    </Card>
                                                                )
                                                            }) : <h2 className="mx-auto text-center mt-2">No Records Found</h2>}
                                                </CardBody></Card>
                                        </TabPane>
                                    </TabContent>
                                    <div className="text-right">
                                        <Button.Ripple
                                            className="cursor-pointer btn-block mt-1 mr-1"
                                            color="danger"
                                            size="md"
                                            onClick={() => {
                                                confirmAlert({
                                                    title: "Are you Sure want to cancel the Session?"
                                                }, (status) => {
                                                    console.log(status)
                                                    if (status) {
                                                        this.props.history.push('/scheduling')

                                                    }
                                                })

                                            }}                                               // onClick={
                                        //     ()=>{
                                        //         this.props.history.push('/scheduling')
                                        //     }
                                        // }
                                        >
                                            Cancel Session

                                </Button.Ripple>
                                        <Button.Ripple
                                            className="cursor-pointer btn-block mt-1"
                                            color="primary"
                                            size="md"
                                            onClick={() => {
                                                this.props.history.push(`/telescrubs/televisit/${this.state.authToken}`)
                                            }}
                                        >
                                            Open Session
                                </Button.Ripple>
                                    </div>
                                </Form>
                            </Formik>
                        </Col>
                    </Col>
                </Row>

            </div>
        )
    }
}


const mapStateToProps = (state) => {
    const { patient } = state;
    return {
        patientIntake: patient.patientIntake
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
    getPatientIntake
})(PatientPreview);
