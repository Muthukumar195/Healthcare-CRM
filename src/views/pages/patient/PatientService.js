
import React from "react";
import _ from 'lodash'
import Select from "react-select"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CustomInput,
  Collapse,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
  TabContent,
  TabPane,
  Tooltip,
  Nav,
  NavItem,
  NavLink, Modal, ModalHeader, ModalBody, ModalFooter,
  Form
} from "reactstrap";
import { ToastError } from "../../../components";

const patientOptions = {
  filterSearch: [
    { value: "Constitutional", label: "Constitutional" },
    { value: "Musculoskeletal", label: "Musculoskeletal" },
    { value: "Eyes", label: "Eyes" },
    { value: "Ears/Nose/Throat", label: "Ent" },
    { value: "Respiratory", label: "Respiratory" },
    { value: "Cardiovascular", label: "Cardiovascular" },
    { value: "Gastrointestinal", label: "Gastrointestinal" },
    { value: "Genitourinary", label: "Genitourinary" },
    { value: "Skin", label: "Skin" },
    { value: "Neurological", label: "Neurological" },
    { value: "Endocrine", label: "Endocrine" },
    { value: "Psychiatric", label: "Psychiatric" },
    { value: "Hem/Lymphatic", label: "Hem/Lymphatic" },
    { value: "Allergic/Immun", label: "Allergic/Immun" },
  ],
  peSelect: [
    { value: "Constitutional", label: "Constitutional" },
    { value: "ENMT", label: "ENMT" },
    { value: "Respiratory", label: "Respiratory" },
    { value: "Cardiovascular", label: "Cardiovascular" },
    { value: "Gastrointestinal", label: "Gastrointestinal" },
    { value: "Musculoskeletal", label: "Musculoskeletal" },
    { value: "Skin", label: "Skin" },
    { value: "Neurologic", label: "Neurologic" },
    { value: "Psychiatric", label: "Psychiatric" },
  ],
  Constitutional: [
    { label: 'Weight Loss', title: 'weightloss' },
    { label: 'Fevers', title: 'fevers' },
    { label: 'Chills', title: 'chills' },
    { label: 'Night Sweats', title: 'nightsweats' },
    { label: 'Fatigue', title: 'fatigue' },
  ],
  eyes: [
    { label: 'Blurry vision', title: 'blurryVision' },
    { label: 'Eye pain', title: 'eyepain' },
    { label: 'Discharge', title: 'discharge' },
    { label: 'Dry eyes', title: 'dryeyes' },
    { label: 'Decreased vision', title: 'decreasedvision' },
  ],
  Allergic: [
    { label: 'Allergic rhinitis ', title: 'allergicrhinitis' },
    { label: 'Hay fever', title: 'hayfever' },
    { label: 'Asthma', title: 'asthma' },
    { label: 'Positive PPD ', title: 'positivePPD' },
    { label: 'Hives', title: 'hives' }
  ],
  Respiratory: [
    { label: 'Short of breath', title: 'shortofbreath' },
    { label: 'Cough', title: 'cough' },
    { label: 'Hemoptysis', title: 'hemoptysis' },
    { label: 'Wheezing', title: 'wheezing' },
    { label: 'Pleurisy', title: 'pleurisy' }
  ],
  ent: [
    { label: 'Sore Throat', title: 'sorethroat' },
    { label: 'Tinnitus', title: 'tinnitus' },
    { label: 'Bloody Nose', title: 'bloodyNose' },
    { label: 'Hearing Loss', title: 'hearingLoss' },
    { label: 'Sinusitis', title: 'sinusitis' }
  ],
  cardiovascular: [
    { label: 'Chest pain', title: 'chestpain' },
    { label: 'PND', title: 'pnd' },
    { label: 'Palpitations', title: 'palpitations' },
    { label: 'Edema', title: 'edema' },
    { label: 'Orhtopnea', title: 'orhtopnea' },
    { label: 'Syncpe', title: 'syncpe' },

  ],
  skin: [
    { label: 'Rash', title: 'rash' },
    { label: 'Pruritis', title: 'pruritis' },
    { label: 'Sores', title: 'sores' },
    { label: 'Nail changes ', title: 'nailchanges' },
    { label: 'Skin thickening', title: 'skinThickening' }
  ],
  Musculoskeletal: [
    { label: 'Arthralgias', title: 'arthralgias' },
    { label: 'Myalgias', title: 'myalgias' },
    { label: 'Muscle weakness', title: 'muscleweakness' },
    { label: 'Joint swelling', title: 'jointswelling' },
    { label: 'NSAID use', title: 'nsaid' },
  ],
  Gastrointestinal: [
    { label: 'Nausea', title: 'nausea' },
    { label: 'Vomiting', title: 'vomiting' },
    { label: 'Diarrhea', title: 'diarrhea' },
    { label: 'Hematemesis', title: 'hematemesis' },
    { label: 'Melena', title: 'melena' }
  ],
  Genitourinary: [
    { label: 'Hematuria', title: 'hematuria' },
    { label: 'Dysuria', title: 'dysuria' },
    { label: 'Hesitancy', title: 'hesitancy' },
    { label: 'Incontinence', title: 'incontinence' },
    { label: 'UTIs', title: 'UTIs' }
  ],
  Neurological: [
    { label: 'Migraines', title: 'migraines' },
    { label: 'Numbness', title: 'numbness' },
    { label: 'Ataxia', title: 'ataxia' },
    { label: 'Tremors', title: 'tremors' },
    { label: 'Vertigo', title: 'vertigo' }
  ]
  , Endocrine: [
    { label: 'Excess thirst', title: 'excessThirst' },
    { label: 'Polyuria', title: 'polyuria' },
    { label: 'Cold intolerance', title: 'coldintolerance' },
    { label: 'Heat intolerance', title: 'heatintolerance' },
    { label: 'Goiter', title: 'goiter' }
  ],
  Psychiatric: [
    { label: 'Depression', title: 'depression' },
    { label: 'Anxiety', title: 'anxiety' },
    { label: 'Anti-depressants', title: 'antiDepressants' },
    { label: 'Alcohol abuse', title: 'alcoholAbuse' },
    { label: 'Drug abuse', title: 'drugAbuse' },
    { label: 'Insomnia', title: 'insomnia' }
  ],
  HemLymphatic: [
    { label: 'Easy bruising', title: 'easyBruising' },
    { label: 'Bleeding diathesis', title: 'bleedingDiathesis' },
    { label: 'Blood clots', title: 'bloodClots' },
    { label: 'Swollen glands', title: 'swollenGlands' },
    { label: 'Lymphedema', title: 'lymphedema' }
  ],
  peConstitutional: [
    { label: 'Record three vital signs', title: 'recordSigns' },
    { label: 'Conversant/NAD', title: 'conversant' },
  ],
  peENMT: [
    { label: 'Pink conjunctivae; no ptosis', title: 'pinkConjucative' },
    { label: 'Perrla', title: 'perrla' },
    { label: 'Fundi clear, no AV nicking', title: 'fundiClear' },
    { label: 'Non-tender, no masses', title: 'nonTender' },
    { label: 'No Thryomegaly or Nodules', title: 'thryomegaly' },
    { label: 'Nose and ears appear normal', title: 'noseEar' },
    { label: 'Good dentition', title: 'dentition' },
    { label: 'No pharyngeal erythema ', title: 'pharyngeal' }
  ],
  peRespiratory: [
    { label: 'Normal respiratory effort', title: 'respiratoryEffort' },
    { label: 'Clear to auscultation', title: 'ausculation' },
    { label: 'Clear to percussion', title: 'percussion' },
  ],
  peCardiovascular: [
    { label: 'No carotid bruits', title: 'carotidBruits' },
    { label: 'RRR, no MRGs', title: 'rrr' },
    { label: 'No peripheral edema', title: 'peripheralEdema' }
  ],
  peGastrointestinal: [
    { label: 'Abdomen soft, with no masses', title: 'abdomen' },
    { label: 'No hepatosplenomegaly', title: 'hepatosplenomegaly' },
    { label: 'No hernias', title: 'hernias' },
    { label: 'Heme occult negative', title: 'hemeOccult' }
  ],
  peMusculoskeletal: [
    { label: 'Normal gait and station', title: 'normalGait' },
    { label: 'No digital cyanosis or clubbing', title: 'noCyanosis' }
  ],
  peSkin: [
    { label: 'No rashes, ulcers or lesions', title: 'noRashes' }
    , { label: 'Normal turgor and temperature', title: 'normalTurgor' },
  ],
  pePsychiatric: [
    { label: 'Appropriate affect', title: 'effect' },
    { label: 'A&OX3', title: 'aox' },
    { label: 'Intact judgment and insight ', title: 'instactJudgement' }
  ],
  peNeurologic: [
    { label: 'CNs intact', title: 'cnIntact' }
    , { label: 'No sensory deficits', title: 'noSensoryDeficits' },
    { label: 'DTRs intact and symmetrical', title: 'dtrIntact' },
  ]
  , dropOption: [
    { value: "Chief Complaint", label: "Chief Complaint *" },
    { value: "Review of Systems", label: "Review of Systems" },
    { value: "History", label: "History" },
    { value: "Data Reviewed", label: "Data Reviewed" },
    { value: "Physical Exam", label: "Physical Exam *" },
    { value: "MDM", label: "MDM *" },
    // { value: "Assessment", label: "Assessment" },
    { value: "Assessment and Plan", label: "Assessment and Plan *" },
  ]
  , icd1: [
    { value: "Hypertension-r03.0", label: "Hypertension R03.0" },
    { value: "Hypertension-r03.1", label: "Hypertension R03.1" },
    { value: "Headache", label: "Headache" },
  ]
  , cptValueDropdown: [
    { value: "99201", label: "99201" },
    { value: "99202", label: "99202" },
    { value: "99203", label: "99203" },
    { value: "99204", label: "99204" },
    { value: "99205", label: "99205" },
  ]
  ,
  reviewOfSystemView: [
    { value: 'Constitutional', label: 'Constitutional' },
    { value: 'Musculoskeletal', label: 'Musculoskeletal' },
    { value: 'eyes', label: 'Eyes' },
    { value: 'ent', label: 'Ent' },
    { value: 'Respiratory', label: 'Respiratory' },
    { value: 'cardiovascular', label: 'Cardiovascular' },
    { value: 'Gastrointestinal', label: 'Gastrointestinal' },
    { value: 'Genitourinary', label: 'Genitourinary' },
    { value: 'skin', label: 'Skin' },
    { value: 'Neurological', label: 'Neurological' },
    { value: 'Endocrine', label: 'Endocrine' },
    { value: 'Psychiatric', label: 'Psychiatric' },
    { value: 'HemLymphatic', label: 'Hem/Lymphatic' },
    { value: 'Allergic', label: 'Allergic/Immun' },
    { value: 'Endocrine', label: 'Endocrine' }
  ],
  physicalSystemView: [
    { value: "peConstitutional", label: "Constitutional" },
    { value: "peENMT", label: "ENMT" },
    { value: "peRespiratory", label: "Respiratory" },
    { value: "peCardiovascular", label: "Cardiovascular" },
    { value: "peGastrointestinal", label: "Gastrointestinal" },
    { value: "peMusculoskeletal", label: "Musculoskeletal" },
    { value: "peSkin", label: "Skin" },
    { value: "pePsychiatric", label: "Psychiatric" },
    { value: "peNeurologic", label: "Neurologic" },
  ]
}

const patientVisitFormKeys = [
  "appointmentId",
  "information",
  "reviewSystem",
  "chiefcomplaint",
  "hpi",
  "count",
  "ros",
  "roscount",
  "history",
  "dataReviewed",
  "mdmResult",
  "peConstitutional",
  "peENMT",
  "peRespiratory",
  "peCardiovascular",
  "peGastrointestinal",
  "peMusculoskeletal",
  "peSkin",
  "peNeurologic",
  "pePsychiatric",
  "icd",
  "icdSelected",
  "peStatus",
  "historyStatus",
  "cptValue",
  "datapoints",
  "others",
  "peothers",
  "pEtotalCount"];

const patientCheckboxChange = (e, extandState, callback) => {
  let count = 0
  extandState[e.target.name] = !extandState[e.target.name]
  var keys = _.keys(extandState)
  for (let i = 0; i < keys.length; i++) {
    if (extandState[keys[i]] == true) {
      count = count + 1
    }
  }
  callback(extandState, count)
}
const notify = () => ToastError('Please enter Chief Complaint');

const visitFormValidation = (state) => {
  let validationField = ['chiefcomplaint']
  var errors = {};
  var errorMsg = [];
  _.forEach(state, (value, key) => {
    if (_.includes(validationField, key)) {
      if (_.isEmpty(value)) {
        errors[key] = "Chief Complaint is Required";
        errorMsg.push("Chief Complaint is Required")
        notify()
      }
    }
  })
  // if(state.count <3 ){
  //   errors['hpi'] = "Enter atleast 3 fields";
  //   errorMsg.push("Enter atleast 3 fields")
  // }
  // if(!state.errorPE){
  //   errors['physicalExam'] = "Select atleast one Physical Exam";
  //   errorMsg.push("Select atleast one Physical Exam")
  // }
  return errors;
}

const patientCpt = (state) => {
  let cptvalues = {}  
  if (state.visitCount <= 1) {
    if ((state.mdmResult === 'SF' && state.peStatus === 'PF' && state.historyStatus === 'PF')
      || (state.mdmResult === 'SF' && state.peStatus === 'PF' && state.historyStatus === 'Detailed')
      || (state.mdmResult === 'SF' && state.peStatus === 'PF' && state.historyStatus === 'Comprehensive')
      || (state.mdmResult === 'SF' && state.peStatus === 'EPF' && state.historyStatus === 'PF')
      || (state.mdmResult === 'SF' && state.peStatus === 'Detailed' && state.historyStatus === 'PF')
      || (state.mdmResult === 'SF' && state.peStatus === 'Comprehensive' && state.historyStatus === 'PF')
    ) {
      cptvalues.label = '99201';
      cptvalues.value = '99201';
    }
    else if ((state.mdmResult === 'SF' && state.peStatus === 'EPF' && state.historyStatus === 'EPF')
      || (state.mdmResult === 'SF' && state.peStatus === 'EPF' && state.historyStatus === 'Detailed')
      || (state.mdmResult === 'SF' && state.peStatus === 'EPF' && state.historyStatus === 'Comprehensive')
      || (state.mdmResult === 'SF' && state.peStatus === 'Detailed' && state.historyStatus === 'EPF')
      || (state.mdmResult === 'SF' && state.peStatus === 'Comprehensive' && state.historyStatus === 'EPF')) {
      cptvalues.label = '99202';
      cptvalues.value = '99202';
    }
    else if ((state.mdmResult === 'low' && state.peStatus === 'Detailed' && state.historyStatus === 'Detailed')
      || (state.mdmResult === 'low' && state.peStatus === 'Detailed' && state.historyStatus === 'Comprehensive')
      || (state.mdmResult === 'low' && state.peStatus === 'Comprehensive' && state.historyStatus === 'Detailed')
    ) {
      cptvalues.label = '99203';
      cptvalues.value = '99203';
    }
    else if ((state.mdmResult === 'mod' && state.peStatus === 'Comprehensive' && state.historyStatus === 'Comprehensive')) {
      cptvalues.label = '99204';
      cptvalues.value = '99204';
    }
    else if ((state.mdmResult === 'high' && state.peStatus === 'Comprehensive' && state.historyStatus === 'Comprehensive')
    ) {
      cptvalues.label = '99205';
      cptvalues.value = '99205';
    }
    else {
      cptvalues.label = '';
      cptvalues.value = '';
    }
  }
  else {
    
    if ((state.mdmResult === 'SF' && state.peStatus === 'PF')
      || (state.mdmResult === 'SF' && state.historyStatus === 'PF')
      || (state.peStatus === 'PF' && state.historyStatus === 'PF')

      || (state.peStatus === 'PF' && state.historyStatus === 'EPF')
      || (state.peStatus === 'PF' && state.mdmResult === 'SF')
      || (state.historyStatus === 'EPF' && state.mdmResult === 'SF')

      || (state.peStatus === 'EPF' && state.historyStatus === 'PF')
      || (state.peStatus === 'EPF' && state.mdmResult === 'SF')
      || (state.historyStatus === 'PF' && state.mdmResult === 'SF')
    ) {

      cptvalues.label = '99212'
      cptvalues.value = '99212'
    }
    else if ((state.mdmResult === 'low' && state.peStatus === 'EPF')
      || (state.mdmResult === 'low' && state.historyStatus === 'EPF')
      || (state.peStatus === 'EPF' && state.historyStatus === 'EPF')

      || (state.peStatus === 'EPF' && state.historyStatus === 'Detailed')
      || (state.peStatus === 'EPF' && state.mdmResult === 'low')
      || (state.historyStatus === 'Detailed' && state.mdmResult === 'low')

      || (state.peStatus === 'Detailed' && state.historyStatus === 'EPF')
      || (state.peStatus === 'Detailed' && state.mdmResult === 'low')
      || (state.historyStatus === 'EPF' && state.mdmResult === 'low')
    ) {
      cptvalues.label = '99213'
      cptvalues.value = '99213'

    }
    else if ((state.mdmResult === 'mod' && state.peStatus === 'Detailed')
      || (state.mdmResult === 'mod' && state.historyStatus === 'Detailed')
      || (state.peStatus === 'Detailed' && state.historyStatus === 'Detailed')

      || (state.mdmResult === 'mod' && state.peStatus === 'Detailed')
      || (state.mdmResult === 'mod' && state.historyStatus === 'Comprehensive')
      || (state.peStatus === 'Detailed' && state.historyStatus === 'Comprehensive')

      || (state.peStatus === 'Comprehensive' && state.historyStatus === 'Detailed')
      || (state.peStatus === 'Comprehensive' && state.mdmResult === 'mod')
      || (state.historyStatus === 'Detailed' && state.mdmResult === 'mod')
    ) {
      cptvalues.label = '99214'
      cptvalues.value = '99214'

    }
    else if ((state.mdmResult === 'high' && state.peStatus === 'Comprehensive')
      || (state.mdmResult === 'high' && state.historyStatus === 'Comprehensive')
      || (state.peStatus === 'Comprehensive' && state.historyStatus === 'Comprehensive')) {
      cptvalues.label = '99215'
      cptvalues.value = '99215'
    }
    else {
      cptvalues.label = ''
      cptvalues.value = ''
    }
  }
  console.log(cptvalues)
  return cptvalues

}

const patientPeStatus = (state) => {
  let totalCount = (state.peConstitutionalcount + state.peENMTcount +
    state.peRespiratorycount + state.peCardiovascularcount + state.peGastrointestinalcount + state.peMusculoskeletalcount
    + state.peSkincount + state.peNeurologiccount + state.pePsychiatriccount)
  let localstate = {}
  if (totalCount != 0) {
    localstate.pEtotalCount = true
  } else if (totalCount === 0) {
    localstate.pEtotalCount = false
  }
  if (totalCount >= 6 && totalCount <= 11) {
    localstate.peStatus = 'EPF'
  }
  else if (totalCount === 12) {
    localstate.peStatus = 'Detailed'
  }
  else if ((state.peConstitutionalcount === 2 && state.peENMTcount === 2 &&
    state.peRespiratorycount === 2 && state.peCardiovascularcount === 2 && state.peGastrointestinalcount === 2 && state.peMusculoskeletalcount
    === 2 && state.peSkincount === 2 && state.peNeurologiccount === 2 && state.pePsychiatriccount === 2)) {
    localstate.peStatus = 'Comprehensive'
  }
  else {
    localstate.peStatus = 'PF'
  }
  return localstate
}

const patientHistoryStatus = (state) => {
  let historystatus = {}
  if (state.count <= 3 && state.roscount === 1 && state.historycount === 0) {
    historystatus.historyStatus = 'EPF'
  }
  else if (state.count > 3 && (state.roscount >= 2 || state.roscount <= 9) && state.historycount === 1) {
    historystatus.historyStatus = 'Detailed'
  }
  else if (state.count > 3 && state.roscount === 10 && state.historycount === 3) {
    historystatus.historyStatus = 'Comprehensive'
  }
  else {
    historystatus.historyStatus = 'PF'
  }
  return historystatus
}




const IdcInputs = (props) => {
  let icd = props.icd;
  let k = props.index;
  let selected = (icd.code != '')? {label:icd.code, value:icd.code} : "";
  return (
    <Col md="12" className="border" >

      <Label><h5>ICD Code {k + 1}</h5></Label>
      <Select
        className={`React col-md-6  px-0 basic-single ${
          icd.code != '' ? "bg-active" : ''
          }`}
        classNamePrefix="select"
        options={props.options}
        onChange={(selectedOption) => {
          console.log(k)
          props.icdChange(selectedOption, k)
        }} 
        value={selected}
        clearable
      />
      <Collapse isOpen={icd.code == '' && icd.monitor == '' && icd.treatment == '' && icd.evaluate == '' && icd.assess == ''
        ? false : icd.show == false ? false : true} >
        <Col md={12} className="meat px-0 mt-2">
          <Row>
            <Col md={3}>
              <FormGroup className="form-label-group  mb-50">
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Monitor"
                  name="monitor"
                  onChange={(e) => {
                    props.icdInputUpdate(e, k)
                  }}
                  onBlur={(e) => {
                    props.icdInputBlur(e, k)
                  }}
                  value={icd.monitor}
                />
                <label htmlFor="Monitor">Monitor</label>

              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup className="form-label-group  mb-50">
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Evaluate"
                  name="evaluate"
                  onChange={(e) => {
                    props.icdInputUpdate(e, k)
                  }}
                  onBlur={(e) => {
                    props.icdInputBlur(e, k)
                  }}
                  value={icd.evaluate}
                />
                <label htmlFor="Evaluate">Evaluate</label>

              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup className="form-label-group mb-50">
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Assess"
                  name="assess"
                  onChange={(e) => {
                    props.icdInputUpdate(e, k)
                  }}
                  onBlur={(e) => {
                    props.icdInputBlur(e, k)
                  }}
                  value={icd.assess}

                />
                <label htmlFor="Assess">Assess</label>

              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup className="form-label-group mb-50">
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Treatment"
                  name="treatment"
                  onChange={(e) => {
                    props.icdInputUpdate(e, k)
                  }}
                  onBlur={(e) => {
                    props.icdInputBlur(e, k)
                  }}
                  value={icd.treatment}
                />
                <label htmlFor="treatment">Treatment</label>
              </FormGroup>
            </Col>
          </Row>
        </Col>
      </Collapse>
    </Col>)
}
const rosList = (type, ros) => {
  var list = []
  _.forEach(patientOptions[type], (val, key) => {
    if (ros[val.title]) {
      list.push(val.label)
    }
  })
  return _.toString(list)
}

const physicalList = (type, ps) => {
  var list = []
  _.forEach(patientOptions[type], (val, key) => {
    if (ps[val.title]) {
      list.push(val.label)
    }
  })
  return _.toString(list)
}


const hpiStatus = (hpi) => {
  var hipCount = 0;
  _.forEach(hpi, (value, key) => {
    if (!_.isEmpty(value)) {
      hipCount = (hipCount + 1);
    }
  })
  if (hipCount <= 3) {
    return "Brief"
  }
  return "Extended"
}
const rosCount = (ros) => {
  var count = 0;
  _.forEach(ros, (value, key) => {
    if (value) {
      count = (count + 1);
    }
  })
  return count;
}

const icdCount = (icd) => {
  var count = 0;
  _.forEach(icd, (value, key) => {
    if (!_.isEmpty(value.code)) {
      count = (count + 1);
    }
  })
  return count;
}


const patientCopyPreviousData = () => {

}

export {
  patientOptions,
  patientCheckboxChange,
  visitFormValidation,
  patientCpt,
  IdcInputs,
  patientPeStatus,
  patientHistoryStatus,
  patientVisitFormKeys,
  rosList,
  physicalList,
  hpiStatus,
  rosCount,
  icdCount,
  patientCopyPreviousData
};
