import React from "react";
import classnames from "classnames";
import { Check, Search } from "react-feather";
import { connect } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";

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
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy";
import { getExtensionImg, downloadFile } from "../../components";
import { getPatientIntake } from "../../redux/actions/patientActions";
import {
    fetchEvents,
    handleSidebar,
    addEvent,
    handleSelectedEvent,
    updateEvent,
    updateDrag,
    updateResize,
} from "../../redux/actions/calendar/index";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "react-feather";
import _ from 'lodash';
import moment from 'moment';

class PatientPreview extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            active: "1",
            patientCollapse: false,
            establishedCollapse: false,
            patientIntake: {},
            intakeForm: {},
            cancelSession:false
        }
    }

    componentDidMount() {
        console.log(this.props)
        this.props.getPatientIntake(this.props.match.params.id)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.patientIntake.data != prevState.patientIntake) {
            if (nextProps.patientIntake.status) {
                let patient = nextProps.patientIntake.data[0]
                return {
                    patientIntake: patient,
                    intakeForm: (patient.intakeForm) ? patient.intakeForm[0] : {}
                }
            }
        }
        return null;
    }

    patientCollapse = () => {
        if (this.state.establishedCollapse !== true) {
            this.setState({
                patientCollapse: !this.state.patientCollapse
            })
        }
        else if (this.state.establishedCollapse === true) {
            this.setState({
                patientCollapse: !this.state.patientCollapse,
                establishedCollapse: false
            })
        }
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
    cancelSession = ()=>{
        this.setState({
            cancelSession: !this.state.cancelSession
        })
    }
    toggle = tab => {
        if (this.state.active !== tab) {
            this.setState({ active: tab })
        }
    }
    render() {
        const { patientIntake, intakeForm } = this.state;
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
                                                                <li>DOB: {moment(patientIntake.dateOfBirth).format('DD/MM/YYYY')}</li>
                                                                <li>DoS: 24/08/2020</li>
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
                                                        {(patientIntake.pharmacy) ? (
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
                                                                    <p className="mb-0">
                                                                        {patientIntake.pharmacy.address}
                                                                    </p>
                                                                    <p className="mb-0">
                                                                        {patientIntake.pharmacy.status}
                                                                    </p>
                                                                    <p className="mb-0">Phone Number: {patientIntake.pharmacy.phone}</p>
                                                                </Media>
                                                            </Media>
                                                        ) : null}

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
                                                                            />    <Label htmlFor="reason">Reason For Visit</Label>
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
                                                                            />    <Label htmlFor="pmh">Past Medical / Surgical History</Label>
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
                                                                            />    <Label htmlFor="medication">Medication</Label>
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
                                                                            />    <Label htmlFor="allergies">Allergies</Label>
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
                                                <CardBody className="w-100 mt-1">
                                                    <Row>
                                                        {
                                                            (intakeForm.images) ?
                                                                (
                                                                    intakeForm.images.map((image, k) => {
                                                                        return (
                                                                            <Col key={k} md={2} className="text-center mt-50">
                                                                                <Link to="#" onClick={
                                                                                    () => {
                                                                                        downloadFile('IntakePic', image)
                                                                                    }
                                                                                }><img src={getExtensionImg(image)} />
                                                                                    <p>{image}</p>
                                                                                </Link>
                                                                            </Col>
                                                                        )
                                                                    })
                                                                ) : null
                                                        }
                                                    </Row>

                                                </CardBody></Card>
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <Card className="patientPreviewtab mb-0">
                                                <CardBody className="w-100 min-height-55 ">

                                                    <Card className="previewform patientpreview  mb-0"
                                                    >
                                                        <CardHeader onClick={this.patientCollapse} className="bg-active"
                                                        >
                                                            <CardTitle className="lead collapse-title collapsed">
                                                                <div className="row">
                                                                    <div className="pl-0  col-md-12">
                                                                        <ul className="patient-detail">
                                                                            <li>DoS: 24/08/2020</li>
                                                                            <li>Patient Office Visit Form</li>
                                                                            <li>{_.toUpper(patientIntake.lastName)}, {_.toUpper(patientIntake.firstName)}</li>
                                                                            <li>DOB: {moment(patientIntake.dateOfBirth).format('DD/MM/YYYY')}</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </CardTitle> {this.state.patientCollapse === true ? <ChevronUp size={25} className="collapse-icon" /> : <ChevronDown size={25} className="collapse-icon" />}
                                                        </CardHeader>
                                                        <Collapse isOpen={this.state.patientCollapse}
                                                        >
                                                            <CardBody>
                                                                <div className="px-0 col-md-12">
                                                                    <div>
                                                                        <ul className="pl-0"><li><h5 className="d-inline-block"><b>Chief Complaint:</b></h5> <p>Body Pain</p></li></ul><div>
                                                                            <h5>HPI Elements</h5>
                                                                            <div className="row"><ul><li><p><b>Location:</b></p> <p>Right Shoulder</p></li><li><p><b>Quality:</b></p> <p>Deep pain</p></li><li><p><b>Timing:</b></p> <p>Morning</p></li><li><p><b>Severity:</b></p> <p>High</p></li><li><p><b>Duration:</b></p> <p>2 to 3 hours</p></li><li><p><b>Context:</b></p> <p>After heavy foods</p></li><li><p><b>Modifying Factors:</b></p> <p>Asprin helps</p></li><li><p><b>Associated Signs and Symptoms:</b></p> <p>Feel Feverish</p></li></ul></div></div></div><div><h5>History</h5>
                                                                        <div className="previewHistory row"><div className="col-md-12"><p className="ml-md-50"><b>Past Medical History:</b></p> <p> swelling of tongue and difficulty breathing and swallowing</p></div><div className="col-md-12"> <p className="ml-md-50"><b>Family History:</b></p> <p>a review of medical events in the patient's family,</p></div><div className="col-md-12"> <p className="ml-md-50"><b>Social History:</b></p> <p> including diseases which may be hereditary or place the patient at risk</p></div>
                                                                            <div className="col-md-12"><p className="ml-md-50"><b>Smoking History:</b></p> <p> new onset of fever, HTN, rigidity and altered mental status</p></div></div></div>
                                                                    <div className="rosPreview"><h5>Review of System</h5><div className="row"><ul><li><p><b>Constitutional:</b></p><p> &nbsp;Weight Loss,</p><p> &nbsp;Fevers,</p><p> &nbsp;Chills,</p><p> &nbsp;</p><p> &nbsp;</p></li><li><p><b>Musculoskeletal:</b></p><p> &nbsp;Arthralgias,</p><p> &nbsp;Myalgias,</p><p> &nbsp;</p><p> &nbsp;</p><p> &nbsp;NSAID use,</p></li><li><p><b>Eyes:</b></p>  <p> &nbsp;Blurry vision,</p><p> &nbsp;</p><p> &nbsp;</p><p> &nbsp;</p><p> &nbsp;</p></li></ul></div></div>
                                                                    <div className="rosPreview"><h5>Physical Exam</h5><div className="row"><ul className="mb-0"><li><p><b>Constitutional: </b></p><p> &nbsp;Record three vital signs,</p><p> &nbsp;</p></li><li><p><b>ENMT:</b></p><p> &nbsp;Pink conjunctivae; no ptosis,</p><p> &nbsp;Perrla,</p><p> &nbsp;Fundi clear, no AV nicking,</p><p> &nbsp;</p><p> &nbsp;</p><p> &nbsp;</p><p> &nbsp;</p><p> &nbsp;</p></li></ul></div></div>
                                                                    <div className="rosPreview dataReview mb-0"><div className="row"><ul><li><h5 className="d-inline-block"><b>MDM:</b></h5> <p>Minimal Risk </p></li></ul></div>
                                                                    </div><div className="rosPreview dataReview mb-0"><div className="row"><ul><li><h5 className="d-inline-block"><b>Data Reviewed:</b></h5>&nbsp;<p>Adsdadasd</p></li></ul></div></div>
                                                                    <div className="rosPreview assessment"><h5>Assessment and Plan</h5><div className="row"><ul><li><p><b>ICD Code 1:</b></p> <p>Hypertension-r03.0: (1233,45553,44232,4434343)   </p></li><li><p><b>CPT Code:</b></p> <p>99201 </p></li></ul></div></div></div>
                                                                <div className="patient-new-visit  minHeight col-md-12"><div className="row"><div className="border  col-md-12  ">
                                                                    <div className="row">
                                                                        <div className=" col-auto pr-md-0 pl-5px col">
                                                                            <label className="d-inline-block px-0"><h6>HPI:</h6></label><p className="mr-1 d-inline-block">&nbsp; Extended</p></div>
                                                                        <div className="col-auto  col"><label className="d-inline-block px-0"><h6>ROS:</h6></label><p className="mr-1 d-inline-block">&nbsp; 1</p></div>
                                                                        <div className="col-auto col"><label htmlFor="history-level" className="d-inline-block px-0 "><h6>History:</h6></label><p className="mr-1 d-inline-block">&nbsp; Detailed</p>   </div>
                                                                        <div className="col-auto pr-md-0 col"><label className="d-inline-block px-0"><h6>PE:</h6></label><p className="mr-1 d-inline-block">&nbsp; PF</p>    </div>
                                                                        <div className="col-auto  col"><label htmlFor="mdm" className="d-inline-block px-0"><h6>MDM: </h6></label><p className="mr-1 d-inline-block">&nbsp; SF</p></div>             </div></div></div></div>
                                                            </CardBody>
                                                        </Collapse>
                                                    </Card>
                                                    <Card className="previewform patientpreview mb-0 "
                                                    >
                                                        <CardHeader onClick={this.establishedCollapse}
                                                            //  className={` ${
                                                            //         this.state.establishedCollapse === false ? "collapse-active" : 'bg-active'
                                                            //         }`}
                                                            className="bg-active "
                                                        >
                                                            <CardTitle className="lead collapse-title collapsed">
                                                                <div className="row">
                                                            
                                                                    <div className="pl-0 col-md-12">
                                                                        <ul className="patient-detail">
                                                                        <li>DoS: 24/08/2020</li>

                                                                            <li>Established Office Visit Form</li>
                                                                            <li>{_.toUpper(patientIntake.lastName)}, {_.toUpper(patientIntake.firstName)}</li>
                                                                            <li>DOB: {moment(patientIntake.dateOfBirth).format('DD/MM/YYYY')}</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </CardTitle>
                                                            {this.state.establishedCollapse === true ? <ChevronUp size={25} className="collapse-icon" /> : <ChevronDown size={25} className="collapse-icon" />}

                                                        </CardHeader>
                                                        <Collapse isOpen={this.state.establishedCollapse}
                                                        >
                                                            <CardBody>
                                                                <div className="px-0 col-md-12">
                                                                    <div>
                                                                        <ul className="pl-0"><li><h5 className="d-inline-block"><b>Chief Complaint:</b></h5> <p>Body Pain</p></li></ul><div>
                                                                            <h5>HPI Elements</h5>
                                                                            <div className="row"><ul><li><p><b>Location:</b></p> <p>Right Shoulder</p></li><li><p><b>Quality:</b></p> <p>Deep pain</p></li><li><p><b>Timing:</b></p> <p>Morning</p></li><li><p><b>Severity:</b></p> <p>High</p></li><li><p><b>Duration:</b></p> <p>2 to 3 hours</p></li><li><p><b>Context:</b></p> <p>After heavy foods</p></li><li><p><b>Modifying Factors:</b></p> <p>Asprin helps</p></li><li><p><b>Associated Signs and Symptoms:</b></p> <p>Feel Feverish</p></li></ul></div></div></div><div><h5>History</h5>
                                                                        <div className="previewHistory row"><div className="col-md-12"><p className="ml-md-50"><b>Past Medical History:</b></p> <p> swelling of tongue and difficulty breathing and swallowing</p></div><div className="col-md-12"> <p className="ml-md-50"><b>Family History:</b></p> <p>a review of medical events in the patient's family,</p></div><div className="col-md-12"> <p className="ml-md-50"><b>Social History:</b></p> <p> including diseases which may be hereditary or place the patient at risk</p></div>
                                                                            <div className="col-md-12"><p className="ml-md-50"><b>Smoking History:</b></p> <p> new onset of fever, HTN, rigidity and altered mental status</p></div></div></div>
                                                                    <div className="rosPreview"><h5>Review of System</h5><div className="row"><ul><li><p><b>Constitutional:</b></p><p> &nbsp;Weight Loss,</p><p> &nbsp;Fevers,</p><p> &nbsp;Chills,</p><p> &nbsp;</p><p> &nbsp;</p></li><li><p><b>Musculoskeletal:</b></p><p> &nbsp;Arthralgias,</p><p> &nbsp;Myalgias,</p><p> &nbsp;</p><p> &nbsp;</p><p> &nbsp;NSAID use,</p></li><li><p><b>Eyes:</b></p>  <p> &nbsp;Blurry vision,</p><p> &nbsp;</p><p> &nbsp;</p><p> &nbsp;</p><p> &nbsp;</p></li></ul></div></div>
                                                                    <div className="rosPreview"><h5>Physical Exam</h5><div className="row"><ul className="mb-0"><li><p><b>Constitutional: </b></p><p> &nbsp;Record three vital signs,</p><p> &nbsp;</p></li><li><p><b>ENMT:</b></p><p> &nbsp;Pink conjunctivae; no ptosis,</p><p> &nbsp;Perrla,</p><p> &nbsp;Fundi clear, no AV nicking,</p><p> &nbsp;</p><p> &nbsp;</p><p> &nbsp;</p><p> &nbsp;</p><p> &nbsp;</p></li></ul></div></div>
                                                                    <div className="rosPreview dataReview mb-0 "><div className="row"><ul><li><h5 className="d-inline-block"><b>MDM:</b></h5> <p>Minimal Risk </p></li></ul></div></div>
                                                                    <div className="rosPreview dataReview  mb-0"><div className="row"><ul><li><h5 className="d-inline-block"><b>Data Reviewed:</b></h5>&nbsp;<p>Adsdadasd</p></li></ul></div></div>
                                                                    <div className="rosPreview assessment"><h5>Assessment and Plan</h5><div className="row"><ul><li><p><b>ICD Code 1:</b></p> <p>Hypertension-r03.0: (1233,45553,44232,4434343)   </p></li><li><p><b>CPT Code:</b></p> <p>99221 </p></li></ul></div></div></div>

                                                                <div className="patient-new-visit  minHeight col-md-12"><div className="row"><div className="border  col-md-12  ">                    <div className="row"><div className=" col-auto pr-md-0 pl-5px col"> <label className="d-inline-block px-0"><h6>HPI:</h6></label><p className="mr-1 d-inline-block">&nbsp; Extended</p></div><div className="col-auto  col"><label className="d-inline-block px-0"><h6>ROS:</h6></label><p className="mr-1 d-inline-block">&nbsp; 1</p></div><div className="col-auto col"><label htmlFor="history-level" className="d-inline-block px-0 "><h6>History:</h6></label><p className="mr-1 d-inline-block">&nbsp; Detailed</p>   </div><div className="col-auto pr-md-0 col"><label className="d-inline-block px-0"><h6>PE:</h6></label><p className="mr-1 d-inline-block">&nbsp; PF</p>    </div><div className="col-auto  col"><label htmlFor="mdm" className="d-inline-block px-0"><h6>MDM: </h6></label><p className="mr-1 d-inline-block">&nbsp; SF</p></div>             </div></div></div></div>
                                                            </CardBody>
                                                        </Collapse>
                                                    </Card>
                                                </CardBody></Card>


                                        </TabPane>
                                    </TabContent>    <div className="text-right">
                                        <Button.Ripple
                                            className="cursor-pointer btn-block mt-1 mr-1"
                                            color="danger"
                                            size="md"
                                            onClick={this.cancelSession}
                                        >
                                            Cancel Session
                                                                  </Button.Ripple>
                                        <Button.Ripple
                                            className="cursor-pointer btn-block mt-1"
                                            color="primary"
                                            size="md"
                                            onClick={() => {
                                                this.props.history.push(`/telescrubs/televisit/${this.props.match.params.appointmentId}`)
                                            }}
                                        >
                                            Open Session
                                                                 </Button.Ripple>
                                    </div>  </Form>
                            </Formik>
                        </Col>
                    </Col>
                </Row>
                <SweetAlert
                
                showCancel
                confirmBtnText="Yes"
                cancelBtnText="No"
                title={<h2 className="mb-0"> Are you Sure want to cancel the Session?</h2>}
                 warning                           
                confirmBtnBsStyle="primary py-75 px-1"
                cancelBtnBsStyle="danger py-75 px-1"
                onConfirm={()=>{}}
                onCancel={this.cancelSession}
                show={this.state.cancelSession}
                />     
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
