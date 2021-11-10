import React from "react";
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
  NavLink, Modal, ModalHeader, ModalBody, ModalFooter

} from "reactstrap";
import _ from 'lodash'
import * as Icon from "react-feather";
import Radio from "../../components/@vuexy/radio/RadioVuexy"
import "react-toggle/style.css"
import Select from "react-select"
import Swiper from "react-id-swiper"

import "../../assets/scss/plugins/forms/switch/react-toggle.scss"
import "swiper/css/swiper.css"
import "../../assets/scss/plugins/extensions/swiper.scss"
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check, Info, X } from "react-feather"
import Chip from "../../components/@vuexy/chips/ChipComponent"
import { Formik, Field, Form, ErrorMessage } from "formik";
// import { patientFormValidation } from "../../components/FormValidation";

const params = {
  navigation: {
    // nextEl: ".swiper-button-next border mt-2px mr-5px primary",
    // prevEl: ".swiper-button-prev border mt-2px mr-5px primary"
  },
  onlyExternal: false,
  noSwiping: false
}

const filterSearch = [
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
]

const peSelect = [
  { value: "Constitutional", label: "Constitutional" },
  { value: "EENNMT", label: "EENNMT" },
  { value: "Respiratory", label: "Respiratory" },
  { value: "Cardiovascular", label: "Cardiovascular" },
  { value: "Gastrointestinal", label: "Gastrointestinal" },
  { value: "Musculoskeletal", label: "Musculoskeletal" },
  { value: "Skin", label: "Skin" },
  { value: "Neurologic", label: "Neurologic" },
  { value: "Psychiatric", label: "Psychiatric" },
]
const Constitutional = [
  { label: 'Weight Loss', title: 'weightloss' }
  , { label: 'Fevers', title: 'fevers' },
  { label: 'Chills', title: 'chills' }
  , { label: 'Night Sweats', title: 'nightsweats' },
  , { label: 'Fatigue', title: 'fatigue' },
]
const eyes = [
  { label: 'Blurry vision', title: 'blurryVision' }
  , { label: 'Eye pain', title: 'eyepain' },
  { label: 'Discharge', title: 'discharge' }
  , { label: 'Dry eyes', title: 'dryeyes' },
  , { label: 'Decreased vision', title: 'decreasedvision' },
]
const Allergic = [
  { label: 'Allergic rhinitis ', title: 'allergicrhinitis' }
  , { label: 'Hay fever', title: 'hayfever' },
  , { label: 'Asthma', title: 'asthma' },
  { label: 'Positive PPD ', title: 'positivePPD' }
  , { label: 'Hives', title: 'hives' },
]
const Respiratory = [
  { label: 'Short of breath', title: 'shortofbreath' }
  , { label: 'Cough', title: 'cough' },
  , { label: 'Hemoptysis', title: 'hemoptysis' },
  { label: 'Wheezing', title: 'wheezing' }
  , { label: 'Pleurisy', title: 'pleurisy' },
]
const ent = [
  { label: 'Sore Throat', title: 'sorethroat' }
  , { label: 'Tinnitus', title: 'tinnitus' },
  , { label: 'Bloody Nose', title: 'bloodyNose' },
  { label: 'Hearing Loss', title: 'hearingLoss' }
  , { label: 'Sinusitis', title: 'sinusitis' },
]
const cardiovascular = [
  { label: 'Chest pain', title: 'chestpain' }
  , { label: 'PND', title: 'pnd' },
  , { label: 'Palpitations', title: 'palpitations' },
  { label: 'Edema', title: 'edema' }
  , { label: 'Orhtopnea', title: 'orhtopnea' }
  , { label: 'Syncpe', title: 'syncpe' },

]
const skin = [
  { label: 'Rash', title: 'rash' }
  , { label: 'Pruritis', title: 'pruritis' },
  , { label: 'Sores', title: 'sores' },
  { label: 'Nail changes ', title: 'nailchanges' }
  , { label: 'Skin thickening', title: 'skinThickening' },

]
const Musculoskeletal = [
  { label: 'Arthralgias', title: 'arthralgias' }
  , { label: 'Myalgias', title: 'myalgias' },
  , { label: 'Muscle weakness', title: 'muscleweakness' },
  { label: 'Joint swelling', title: 'jointswelling' }
  , { label: 'NSAID use', title: 'nsaid' },
]
const Gastrointestinal = [
  { label: 'Nausea', title: 'nausea' }
  , { label: 'Vomiting', title: 'vomiting' },
  , { label: 'Diarrhea', title: 'diarrhea' },
  { label: 'Hematemesis', title: 'hematemesis' }
  , { label: 'Melena', title: 'melena' },
]
const Genitourinary = [
  { label: 'Hematuria', title: 'hematuria' }
  , { label: 'Dysuria', title: 'dysuria' },
  , { label: 'Hesitancy', title: 'hesitancy' },
  { label: 'Incontinence', title: 'incontinence' }
  , { label: 'UTIs', title: 'UTIs' },
]
const Neurological = [
  { label: 'Migraines', title: 'migraines' }
  , { label: 'Numbness', title: 'numbness' },
  , { label: 'Ataxia', title: 'ataxia' },
  { label: 'Tremors', title: 'tremors' }
  , { label: 'Vertigo', title: 'vertigo' },
]
const Endocrine = [
  { label: 'Excess thirst', title: 'excessThirst' }
  , { label: 'Polyuria', title: 'polyuria' },
  , { label: 'Cold intolerance', title: 'coldintolerance' },
  { label: 'Heat intolerance', title: 'heatintolerance' }
  , { label: 'Goiter', title: 'goiter' },
]
const Psychiatric = [
  { label: 'Depression', title: 'depression' }
  , { label: 'Anxiety', title: 'anxiety' },
  , { label: 'Anti-depressants', title: 'antiDepressants' },
  { label: 'Alcohol abuse', title: 'alcoholAbuse' }
  , { label: 'Drug abuse', title: 'drugAbuse' },
  { label: 'Insomnia', title: 'insomnia' },
]
const HemLymphatic = [
  { label: 'Easy bruising', title: 'easyBruising' }
  , { label: 'Bleeding diathesis', title: 'bleedingDiathesis' },
  , { label: 'Blood clots', title: 'bloodClots' },
  { label: 'Swollen glands', title: 'swollenGlands' },
  { label: 'Lymphedema', title: 'lymphedema' },
]

const peConstitutional = [
  { label: 'Record three vital signs', title: 'recordSigns' }
  , { label: 'Conversant/NAD', title: 'conversant' },
]

const peENMT = [
  { label: 'Pink conjunctivae; no ptosis', title: 'pinkConjucative' }
  , { label: 'Perrla', title: 'perrla' },
  { label: 'Fundi clear, no AV nicking', title: 'fundiClear' },
  { label: 'Non-tender, no masses', title: 'nonTender' }
  , { label: 'No Thryomegaly or Nodules', title: 'thryomegaly' },
  { label: 'Nose and ears appear normal', title: 'noseEar' }
  , { label: 'Good dentition', title: 'dentition' },
  { label: 'No pharyngeal erythema ', title: 'pharyngeal' }
]

const peRespiratory = [
  { label: 'Normal respiratory effort', title: 'respiratoryEffort' }
  , { label: 'Clear to auscultation', title: 'ausculation' },
  { label: 'Clear to percussion', title: 'percussion' },
]
const peCardiovascular = [
  { label: 'No carotid bruits', title: 'carotidBruits' }
  , { label: 'RRR, no MRGs', title: 'rrr' },
  { label: 'No peripheral edema', title: 'peripheralEdema' },

]
const peGastrointestinal = [
  { label: 'Abdomen soft, with no masses', title: 'abdomen' }
  , { label: 'No hepatosplenomegaly', title: 'hepatosplenomegaly' },
  { label: 'No hernias', title: 'hernias' },
  { label: 'Heme occult negative', title: 'hemeOccult' },
]
const peMusculoskeletal = [
  { label: 'Normal gait and station', title: 'normalGait' }
  , { label: 'No digital cyanosis or clubbing', title: 'noCyanosis' },
]
const peSkin = [
  { label: 'No rashes, ulcers or lesions', title: 'noRashes' }
  , { label: 'Normal turgor and temperature', title: 'normalTurgor' },
]
const pePsychiatric = [
  { label: 'Appropriate affect', title: 'effect' }
  , { label: 'A&OX3', title: 'aox' },
  { label: 'Intact judgment and insight ', title: 'instactJudgement' },
]
const peNeurologic = [
  { label: 'CNs intact', title: 'cnIntact' }
  , { label: 'No sensory deficits', title: 'noSensoryDeficits' },
  { label: 'DTRs intact and symmetrical', title: 'dtrIntact' },
]
const dropOption = [
  { value: "Chief Complaint", label: "Chief Complaint" },
  { value: "Review of Systems", label: "Review of Systems" },
  { value: "History", label: "History" },
  { value: "Data Reviewed", label: "Data Reviewed" },
  { value: "Physical Exam", label: "Physical Exam" },
  { value: "MDM", label: "MDM" },
  // { value: "Assessment", label: "Assessment" },
  { value: "Assessment and Plan", label: "Assessment and Plan" },
]
const icd1 = [
  { value: "Hypertension-r03.0", label: "Hypertension R03.0" },
  { value: "Hypertension-r03.1", label: "Hypertension R03.1" },
  { value: "Headache", label: "Headache" },

]
const cptValueDropdown = [
  { value: "99201", label: "99201" },
  { value: "99202", label: "99202" },
  { value: "99203", label: "99203" },
  { value: "99204", label: "99204" },
  { value: "99205", label: "99205" },
]

class EstablishedForm extends React.Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false,
      collapse: 0,
      isChecked: false,
      activeTab: "1",
      activeSubTab: "child-1",
      active: "1",
      activeSub: "child-2",
      selectchange: 'Chief Complaint',
      fieldActivate: true,
      modalShow: false,
      reviewSystem: 'Constitutional',
      chiefcomplaint: '',
      hpi: { location: '', quality: '', timing: '', severity: '', duration: '', context: '', modifyingFactors: '', associatedSignsandSymptoms: '' },
      count: 0,
      rosCount: 0,
      ros: {
        weightloss: false, fevers: false, chills: false, nightsweats: false, fatigue: false,
        sorethroat: false, tinnitus: false, bloodyNose: false, hearingLoss: false, sinusitis: false,
        shortofbreath: false, cough: false, hemoptysis: false, wheezing: false, pleurisy: false,
        arthralgias: false, myalgias: false, muscleweakness: false, jointswelling: false, nsaid: false,
        blurryVision: false, eyepain: false, discharge: false, dryeyes: false, decreasedvision: false,
        chestpain: false, pnd: false, palpitations: false, edema: false, orhtopnea: false, syncpe: false,
        nausea: false, vomiting: false, diarrhea: false, hematemesis: false, melena: false,
        hematuria: false, dysuria: false, hesitancy: false, incontinence: false, UTIs: false,
        rash: false, pruritis: false, sores: false, nailchanges: false, skinThickening: false,
        migraines: false, numbness: false, ataxia: false, tremors: false, vertigo: false,
        excessThirst: false, polyuria: false, coldintolerance: false, heatintolerance: false, goiter: false,
        depression: false, anxiety: false, antiDepressants: false, alcoholAbuse: false, drugAbuse: false, insomnia: false,
        easyBruising: false, bleedingDiathesis: false, bloodClots: false, swollenGlands: false, lymphedema: false,
        allergicrhinitis: false, hayfever: false, asthma: false, positivePPD: false, hives: false
      },
      history: {
        pasthistory: '',
        familyhistory: '',
        socialhistory: '',
        smokinghistory: ''
      },
      dataReviewed: '',
      historycount: 0,
      // pe:{
      //   peConstitutional:{
      //     recordSigns:false,conversant:false,  peconstitutionalcount:0,
      //   },

      //   peEyes:{
      //         pinkConjucative:false,perrla:false,fundiClear:false
      //       },
      //       peENMT:{
      //           noseEar:false,dentition:false,pharyngeal:false
      //         },
      // },
      mdmResult: '',
      peConstitutional: {
        recordSigns: false, conversant: false
      },
      peConstitutionalCount: 0,
      peENMT: {
        pinkConjucative: false, perrla: false, fundiClear: false
        , noseEar: false, dentition: false, pharyngeal: false, nonTender: false, thryomegaly: false
      },
      peENMTcount: 0,
      peRespiratory: {
        respiratoryEffort: false, ausculation: false, percussion: false
      },
      peRespiratorycount: 0,
      peCardiovascular: {
        carotidBruits: false, rrr: false, peripheralEdema: false
      },
      peCardiovascularcount: 0,
      peGastrointestinal: {
        abdomen: false, hepatosplenomegaly: false, hernias: false, hemeOccult: false
      },
      peGastrointestinalcount: 0,
      peMusculoskeletal: {
        normalGait: false, noCyanosis: false
      },
      peMusculoskeletalcount: 0,
      peSkin: {
        noRashes: false, normalTurgor: false
      },
      peSkincount: 0,
      peNeurologic: {
        cnIntact: false, noSensoryDeficits: false, dtrIntact: false
      },
      peNeurologiccount: 0,
      pePsychiatric: {
        effect: false, aox: false, instactJudgement: false
      },
      pePsychiatriccount: 0,
      icdCode1: '',
      icd1treatment: '',
      icd1monitor: '',
      icd1evaluate: '',
      icd1assess: '',
      icdCode2: '',
      icd2treatment: '',
      icd2monitor: '',
      icd2evaluate: '',
      icd2assess: '',
      icdCode3: '',
      icd3treatment: '',
      icd3monitor: '',
      icd3evaluate: '',
      icd3assess: '',
      icdCode4: '',
      icd4treatment: '',
      icd4monitor: '',
      icd4evaluate: '',
      icd4assess: '',
      icdCode1Show: false,
      icdCode2Show: false,
      icdCode3Show: false,
      icdCode4Show: false,
      peStatus: '',
      historyStatus: '',
      pEtotalCount: false,
      cptValue: { value: '', label: '', },
      patientFormShow: false,
      datapoints: {
        option1: false, option2: false, option3: false, option4: false, option5: false, option6: false, option7: false
      },
      
      datapointscount: 0,
     fetchChief:false,
     fetchros:false,
     fetchPE:false,
     fetchmdm:false,
     fetchAssessment:false,
     fetchHistory:false,
     fetchDatareviewed:false
    };

  }
  icdinputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleCheckboxChange = (e) => {
   
    let datapoints = this.state.datapoints 
    let datapointscount = 0
    datapoints[e.target.name] = !datapoints[e.target.name]
    this.setState({
      datapoints: datapoints
    }, () => {
      var datapointskeys = _.keys(this.state.datapoints)
      for (let i = 0; i < datapointskeys.length; i++) {
        if (this.state.datapoints[datapointskeys[i]] == true) {
          datapointscount = datapointscount + 1
        }
        this.setState({
          datapointscount: datapointscount
        }, () => { this.peStatus(); this.cptValue(); this.historyStatus();console.log(this.state.datapoints); })
      }
    });
  }
  radioChange = e => {

    this.setState({
      [e.target.name]: e.target.value
    }, () => { this.peStatus(); this.cptValue(); this.historyStatus() })
  }
  fetchChief = (e) => {
    this.setState({
      fetchChief : !this.state.fetchChief 
    })
  }
  fetchros = (e) => {
    this.setState({
      fetchros : !this.state.fetchros 
    })
  }
  fetchPE = (e) => {
    this.setState({
      fetchPE : !this.state.fetchPE 
    })
  }
  fetchAssessment = (e) => {
    this.setState({
      fetchAssessment : !this.state.fetchAssessment 
    })
  }
  fetchDatareviewed = (e) => {
    this.setState({
      fetchDatareviewed : !this.state.fetchDatareviewed 
    })
  }
  fetchHistory = (e) => {
    this.setState({
      fetchHistory : !this.state.fetchHistory 
    })
  }
  fetchmdm = (e) => {
    this.setState({
      fetchmdm : !this.state.fetchmdm 
    })
  }


  checkboxChange = e => {
    let ros = { ...this.state.ros }
    let rosCount = 0
    ros[e.target.name] = !ros[e.target.name]
    this.setState({
      ros: ros
      // [e.target.name]: !this.state.[e.target.name]
    }, () => {
      var roskeys = _.keys(this.state.ros)
      for (let i = 0; i < roskeys.length; i++) {
        if (this.state.ros[roskeys[i]] == true) {
          rosCount = rosCount + 1
        }
        this.setState({
          rosCount: rosCount
        }, () => { this.peStatus(); this.cptValue(); this.historyStatus() })
      }
    })
  }

  constitutionalChange = e => {
    let peConstitutional = { ...this.state.peConstitutional }
    let peConstitutionalCount = 0;
    peConstitutional[e.target.name] = !peConstitutional[e.target.name]
    this.setState({
      peConstitutional: peConstitutional
    }, () => {
      var peConstitutionalkeys = _.keys(this.state.peConstitutional)
      for (let i = 0; i < peConstitutionalkeys.length; i++) {
        if (this.state.peConstitutional[peConstitutionalkeys[i]] == true) {
          peConstitutionalCount = peConstitutionalCount + 1;
        }
        this.setState({
          peConstitutionalCount: peConstitutionalCount,
        }, () => { this.peStatus(); this.cptValue(); this.historyStatus() })
      }
    })
  }

  enmtChange = e => {
    let peENMT = { ...this.state.peENMT }
    let peENMTcount = 0
    peENMT[e.target.name] = !peENMT[e.target.name]
    this.setState({
      peENMT: peENMT
    }, () => {
      var peENMTkeys = _.keys(this.state.peENMT)
      for (let i = 0; i < peENMTkeys.length; i++) {
        if (this.state.peENMT[peENMTkeys[i]] == true) {
          peENMTcount = peENMTcount + 1;
        }
        this.setState({
          peENMTcount: peENMTcount,
        }, () => { this.peStatus(); this.cptValue(); this.historyStatus() })
      }
    })

  }


  peRespiratoryChange = e => {
    let peRespiratory = { ...this.state.peRespiratory }
    let peRespiratorycount = 0
    peRespiratory[e.target.name] = !peRespiratory[e.target.name]
    this.setState({
      peRespiratory: peRespiratory
    }, () => {
      var peRespiratorykeys = _.keys(this.state.peRespiratory)
      for (let i = 0; i < peRespiratorykeys.length; i++) {
        if (this.state.peRespiratory[peRespiratorykeys[i]] == true) {
          peRespiratorycount = peRespiratorycount + 1;
        }
        this.setState({
          peRespiratorycount: peRespiratorycount,
        }, () => { this.peStatus(); this.cptValue(); this.historyStatus() })
      }
    })

  }
  peCardiovascularChange = e => {
    let peCardiovascular = { ...this.state.peCardiovascular }
    let peCardiovascularcount = 0
    peCardiovascular[e.target.name] = !peCardiovascular[e.target.name]
    this.setState({
      peCardiovascular: peCardiovascular
    }, () => {
      var peCardiovascularkeys = _.keys(this.state.peCardiovascular)
      for (let i = 0; i < peCardiovascularkeys.length; i++) {
        if (this.state.peCardiovascular[peCardiovascularkeys[i]] == true) {
          peCardiovascularcount = peCardiovascularcount + 1;
        }
        this.setState({
          peCardiovascularcount: peCardiovascularcount,
        }, () => { this.peStatus(); this.cptValue(); this.historyStatus() })
      }
    })

  }
  peGastrointestinalChange = e => {
    let peGastrointestinal = { ...this.state.peGastrointestinal }
    let peGastrointestinalcount = 0
    peGastrointestinal[e.target.name] = !peGastrointestinal[e.target.name]
    this.setState({
      peGastrointestinal: peGastrointestinal
    }, () => {
      var peGastrointestinalkeys = _.keys(this.state.peGastrointestinal)
      for (let i = 0; i < peGastrointestinalkeys.length; i++) {
        if (this.state.peGastrointestinal[peGastrointestinalkeys[i]] == true) {
          peGastrointestinalcount = peGastrointestinalcount + 1;
        }
        this.setState({
          peGastrointestinalcount: peGastrointestinalcount,
        }, () => { this.peStatus(); this.cptValue(); this.historyStatus() })
      }
    })

  }
  peMusculoskeletalChange = e => {
    let peMusculoskeletal = { ...this.state.peMusculoskeletal }
    let peMusculoskeletalcount = 0
    peMusculoskeletal[e.target.name] = !peMusculoskeletal[e.target.name]
    this.setState({
      peMusculoskeletal: peMusculoskeletal
    }, () => {
      var peMusculoskeletalkeys = _.keys(this.state.peMusculoskeletal)
      for (let i = 0; i < peMusculoskeletalkeys.length; i++) {
        if (this.state.peMusculoskeletal[peMusculoskeletalkeys[i]] == true) {
          peMusculoskeletalcount = peMusculoskeletalcount + 1;
        }
        this.setState({
          peMusculoskeletalcount: peMusculoskeletalcount,
        }, () => { this.peStatus(); this.cptValue(); this.historyStatus() })
      }
    })
  }
  peSkinChange = e => {
    let peSkin = { ...this.state.peSkin }
    let peSkincount = 0
    peSkin[e.target.name] = !peSkin[e.target.name]
    this.setState({
      peSkin: peSkin
    }, () => {
      var peSkinkeys = _.keys(this.state.peSkin)
      for (let i = 0; i < peSkinkeys.length; i++) {
        if (this.state.peSkin[peSkinkeys[i]] == true) {
          peSkincount = peSkincount + 1;
        }
        this.setState({
          peSkincount: peSkincount,
        }, () => { this.peStatus(); this.cptValue(); this.historyStatus() })
      }
    })

  }
  peNeurologicChange = e => {
    let peNeurologic = { ...this.state.peNeurologic }
    let peNeurologiccount = 0
    peNeurologic[e.target.name] = !peNeurologic[e.target.name]
    this.setState({
      peNeurologic: peNeurologic
    }, () => {
      var peNeurologickeys = _.keys(this.state.peNeurologic)
      for (let i = 0; i < peNeurologickeys.length; i++) {
        if (this.state.peNeurologic[peNeurologickeys[i]] == true) {
          peNeurologiccount = peNeurologiccount + 1;
        }
        this.setState({
          peNeurologiccount: peNeurologiccount,
        }, () => { this.peStatus(); this.cptValue(); this.historyStatus() })
      }
    })

  }
  pePsychiatricChange = e => {
    let pePsychiatric = { ...this.state.pePsychiatric }
    let pePsychiatriccount = 0
    pePsychiatric[e.target.name] = !pePsychiatric[e.target.name]
    this.setState({
      pePsychiatric: pePsychiatric
    }, () => {
      var pePsychiatrickeys = _.keys(this.state.pePsychiatric)
      for (let i = 0; i < pePsychiatrickeys.length; i++) {
        if (this.state.pePsychiatric[pePsychiatrickeys[i]] == true) {
          pePsychiatriccount = pePsychiatriccount + 1;
        }
        this.setState({
          pePsychiatriccount: pePsychiatriccount,
        }, () => { this.peStatus(); this.cptValue(); this.historyStatus() })
      }
    })

  }

  inputChange = e => {
    var count = 0
    var hpi = { ...this.state.hpi }
    hpi[e.target.name] = e.target.value
    this.setState({ hpi }, () => {
      var hpikeys = _.keys(this.state.hpi)
      for (let i = 0; i < hpikeys.length; i++) {
        if (this.state.hpi[hpikeys[i]] !== '') {
          count = count + 1
        }
        this.setState({
          count: count
        }, () => { this.peStatus(); this.cptValue(); this.historyStatus() })
      }

    })
  }
  historyChange = e => {
    var historycount = 0
    var history = { ...this.state.history }
    history[e.target.name] = e.target.value
    this.setState({ history }, () => {
      var historykeys = _.keys(this.state.history)
      for (let i = 0; i < historykeys.length; i++) {
        if (this.state.history[historykeys[i]] !== '') {
          historycount = historycount + 1
        }
        this.setState({
          historycount: historycount
        }, () => { this.peStatus(); this.cptValue(); this.historyStatus() })
      }
    })
  }

  setModalShow = (modalShow) => {
    this.setState({
      modalShow: !this.state.modalShow,
    })
  }

  setPatientModal = (modalShow) => {
    this.setState({
      patientFormShow: !this.state.patientFormShow,
    })
  }
  
  handlechange = (selectedOption) => {
    this.setState({
      selectchange: selectedOption.value,
      reviewSystem: 'Constitutional'
    }
    )
  }
  icdCode1Change = (selectedOption) => {
    this.setState({
      icdCode1: selectedOption.value,
      icdCode1Show: true,
      icdCode2Show: false,
      icdCode3Show: false,
      icdCode4Show: false,
    })
  }
  icdCode2Change = (selectedOption) => {
    this.setState({
      icdCode2: selectedOption.value,
      icdCode1Show: false,
      icdCode2Show: true,
      icdCode3Show: false,
      icdCode4Show: false,
    })
  }
  icdCode3Change = (selectedOption) => {
    this.setState({
      icdCode3: selectedOption.value,
      icdCode1Show: false,
      icdCode2Show: false,
      icdCode3Show: true,
      icdCode4Show: false,
    })
  }
  icdCode4Change = (selectedOption) => {
    this.setState({
      icdCode4: selectedOption.value,
      icdCode1Show: false,
      icdCode2Show: false,
      icdCode3Show: false,
      icdCode4Show: true,
    })
    if (this.state.icd4monitor && this.state.icd4assess && this.state.icd4evaluate && this.state.icd4treatment === '') {
      this.setState({
        icdCode4: '',
      })
    }
  }
  reviewchange = (selectedOption) => {
    this.setState({
      reviewSystem: selectedOption.value
    })
  }

  toggle = tab => {
    if (this.state.active !== tab) {
      this.setState({ active: tab })
    }
    if (this.state.activeSub !== tab) {
      this.setState({ activeSub: tab })
    }
  }

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab })
    }
    if (this.state.activeSubTab !== tab) {
      this.setState({ activeSubTab: tab })
    }
  }

  peStatus = () => {
    let totalCount = (this.state.peConstitutionalCount + this.state.peENMTcount +
      this.state.peRespiratorycount + this.state.peCardiovascularcount + this.state.peGastrointestinalcount + this.state.peMusculoskeletalcount
      + this.state.peSkincount + this.state.peNeurologiccount + this.state.pePsychiatriccount)
    // console.log(totalCount)
    if (totalCount != 0) {
      this.setState({
        pEtotalCount: true
      })
    } else if (totalCount === 0) {
      this.setState({
        pEtotalCount: false
      })
    }
    if (totalCount >= 1 && totalCount <= 5) {
      this.setState({
        peStatus: 'PF'
      })
    }
    else if (totalCount >= 6 && totalCount <= 11) {
      this.setState({
        peStatus: 'EPF'
      })

    }
    else if (totalCount === 12) {
      this.setState({
        peStatus: 'Detailed'
      })

    }
    else if ((this.state.peConstitutionalCount === 2 && this.state.peENMTcount === 2 &&
      this.state.peRespiratorycount === 2 && this.state.peCardiovascularcount === 2 && this.state.peGastrointestinalcount === 2 && this.state.peMusculoskeletalcount
      === 2 && this.state.peSkincount === 2 && this.state.peNeurologiccount === 2 && this.state.pePsychiatriccount === 2)) {
      this.setState({
        peStatus: 'Comprehensive'
      })
    }
    else {
      this.setState({
        peStatus: ''
      })
    }
  }
  historyStatus = () => {
    if (this.state.count <= 3 && this.state.rosCount === 0 && this.state.historycount === 0) {
      this.setState({
        historyStatus: 'PF'
      })
    }
    else if (this.state.count <= 3 && this.state.rosCount === 1 && this.state.historycount === 0) {
      this.setState({
        historyStatus: 'EPF'
      })
    }
    else if (this.state.count > 3 && (this.state.rosCount >= 2 || this.state.rosCount <= 9) && this.state.historycount === 1) {
      this.setState({
        historyStatus: 'Detailed'
      })
    }
    else if (this.state.count > 3 && this.state.rosCount === 10 && this.state.historycount === 3) {
      this.setState({
        historyStatus: 'Comprehensive'
      })
    }
    else if (this.state.count > 3 && this.state.rosCount === 0 && this.state.historycount === 0) {
      this.setState({
        historyStatus: 'PF'
      })
    }
    else {
      this.setState({
        historyStatus: 'PF'
      })
    }
  }
  cptValue = () => { 
    if ((this.state.mdmResult === 'SF' && this.state.peStatus === 'PF' )
      || (this.state.mdmResult === 'SF' && this.state.historyStatus === 'PF') 
      || (this.state.peStatus === 'PF'  && this.state.historyStatus === 'PF')

      ||(this.state.peStatus === 'PF'  && this.state.historyStatus === 'EPF')
      ||(this.state.peStatus === 'PF'  && this.state.mdmResult === 'SF')
      ||(this.state.historyStatus === 'EPF' &&this.state.mdmResult === 'SF')
      
      ||(this.state.peStatus === 'EPF'  && this.state.historyStatus === 'PF')
      ||(this.state.peStatus === 'EPF'  && this.state.mdmResult === 'SF')
      ||(this.state.historyStatus === 'PF' &&this.state.mdmResult === 'SF')
        ) {

      this.setState({
        cptValue: { label: '99212', value: '99212' }
      })
    }
    else if ((this.state.mdmResult === 'low' && this.state.peStatus === 'EPF' )
    || (this.state.mdmResult === 'low' && this.state.historyStatus === 'EPF') 
    || (this.state.peStatus === 'EPF'  && this.state.historyStatus === 'EPF')

    ||(this.state.peStatus === 'EPF'  && this.state.historyStatus === 'Detailed')
    ||(this.state.peStatus === 'EPF'  && this.state.mdmResult === 'low')
    ||(this.state.historyStatus === 'Detailed' && this.state.mdmResult === 'low')
    
    ||(this.state.peStatus === 'Detailed'  && this.state.historyStatus === 'EPF')
    ||(this.state.peStatus === 'Detailed'  && this.state.mdmResult === 'low')
    ||(this.state.historyStatus === 'EPF' && this.state.mdmResult === 'low')
      )
      { this.setState({
        cptValue: { label: '99213', value: '99213' }
      })
    }
    else if ((this.state.mdmResult === 'mod' && this.state.peStatus === 'Detailed' )
    || (this.state.mdmResult === 'mod' && this.state.historyStatus === 'Detailed') 
    || (this.state.peStatus === 'Detailed'  && this.state.historyStatus === 'Detailed')

    ||(this.state.mdmResult === 'mod' && this.state.peStatus === 'Detailed' )
    || (this.state.mdmResult === 'mod' && this.state.historyStatus === 'Comprehensive') 
    || (this.state.peStatus === 'Detailed'  && this.state.historyStatus === 'Comprehensive')
    
    ||(this.state.peStatus === 'Comprehensive'  && this.state.historyStatus === 'Detailed')
    ||(this.state.peStatus === 'Comprehensive'  && this.state.mdmResult === 'mod')
    ||(this.state.historyStatus === 'Detailed' &&this.state.mdmResult === 'mod')
      )
      {
      this.setState({
        cptValue: { label: '99214', value: '99214' }
      })
    }
    else if ((this.state.mdmResult === 'high' && this.state.peStatus === 'Comprehensive' )
    || (this.state.mdmResult === 'high' && this.state.historyStatus === 'Comprehensive') 
    || (this.state.peStatus === 'Comprehensive'  && this.state.historyStatus === 'Comprehensive')){     this.setState({
        cptValue: { label: '99215', value: '99215' }
      })
    }
    else {
      this.setState({
        cptValue: { label: '', value: '' }
      })
    }

    console.log('cpt:' + JSON.stringify(this.state.cptValue))
  }
  render() {
    const { } = this.state;
    return (
      <React.Fragment>
        <Container fluid={true} className="video-chat-wrap">
          <Row>
            <Col md="12" lg="4" xl="4">
              <Row>
                <Col
                  md="6"
                  lg="12"
                  xl="12"
                  className="doc-full-scale"
                  id="publisher"
                >
                  <Card>
                    <CardBody>
                      <div className="watermark"></div>
                      <div className="pos-rt">
                        <div
                          className="fonticon-wrap cursor-pointer maximize-icon"
                          onClick={(e) => {
                            this.setState({ fullScreen: true });
                          }}
                        >
                          <Icon.Maximize size={18} className="fonticon-wrap" />
                        </div>
                        <div
                          className="fonticon-wrap cursor-pointer minimize-icon"
                          onClick={(e) => {
                            this.setState({ fullScreen: false });
                          }}
                        >
                          <Icon.Minimize size={18} className="fonticon-wrap" />
                        </div>
                      </div>
                      <div className="subscriber-name">Member</div>
                    </CardBody>
                  </Card>
                </Col>
                <Col
                  md="6"
                  lg="12"
                  xl="12"
                  className="doc-mini-scale"
                  id="subscribers"
                >
                  <Card>
                    <CardBody>
                      <div className="video-controls">
                        <Button
                          color="primary"
                          className="btn-icon rounded-circle mr-1"
                          onClick={this.toggleAudio}
                        >
                          <div className="fonticon-wrap">
                            <Icon.Mic size={14} className="fonticon-wrap" />
                          </div>
                        </Button>
                        <Button
                          color="primary"
                          className="btn-icon rounded-circle mr-1 eye-btn"
                        >
                          <div className="fonticon-wrap">
                            <Icon.Eye size={14} className="fonticon-wrap" />
                          </div>
                        </Button>
                        <Button
                          color="primary"
                          className="btn-icon rounded-circle mr-1"
                          onClick={this.toggleVideo}
                        >
                          <div className="fonticon-wrap">
                            <Icon.Video
                              size={14}
                              className="fonticon-wrap"
                            />
                          </div>
                        </Button>

                        <Button
                          color="danger"
                          className="btn-icon rounded-circle mr-1"
                          onClick={this.disconnect}
                        >
                          <div className="fonticon-wrap">
                            <Icon.Phone size={14} className="fonticon-wrap" />
                          </div>
                        </Button>
                      </div>
                      <div className="fonticon-wrap cursor-pointer pos-rt">
                        <Icon.X
                          size={18}
                          className="fonticon-wrap"
                          onClick={() => {
                            this.setState({ subscriberVideo: false });
                          }}
                        />
                      </div>

                      <div className="publisher-name">Dr. Stephen Clark</div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col md="12" lg="8" xl="8" className="doc-video-form patient-new-visit">

              <Card>
                <CardHeader>
                  <CardTitle className="w-100">
                    <Row>
                      <Col md="6">Established Office Visit Form Information</Col>
                      <Col md="6" className="pl-0 text-right">
                        <ul className="patient-detail"><li>FRANKLIN, JOSEPH</li> <li>DOB: 24/08/2020</li> <li>DoS: 24/08/2020</li></ul>
                      </Col>
                    </Row>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Formik
                    initialValues={{
                      location: "",
                      quality: "",
                      timing: "",
                      severity: "",
                      duration: "",
                      context: "",
                      associatedSignsandSymptoms: '',
                      modifyingFactors: '',
                      mdmResult: ''
                    }}
                    // validationSchema={patientFormValidation}
                    onSubmit={(values) => {
                      //actions.setSubmitting(false);
                    }}
                  >
                    {({ errors, touched, values, setFieldValue }) => (

                      <Form>

                        <div className="border pb-0 floating-input">
                          <Row>
                            <Col md="4 mb-1" >
                              <Select
                                className={`React basic-single ${
                                  this.state.selectchange != '' ? "bg-active" : ''
                                  }`}
                                classNamePrefix="select"
                                defaultValue={dropOption[0]}
                                name="dropOption"
                                options={dropOption}
                                onChange={this.handlechange}
                              />
                            </Col>
                            <Col md="4" >
                              {this.state.selectchange == "Review of Systems" || this.state.selectchange == "Physical Exam" ? <Select
                                className={`React basic-single ${
                                  this.state.selectchange != '' ? "bg-active" : ''
                                  }`}
                                classNamePrefix="select"
                                defaultValue={filterSearch[0]}
                                name="ros"
                                options={this.state.selectchange == "Review of Systems" ? filterSearch : this.state.selectchange == "Physical Exam" ? peSelect : ''}
                                onChange={this.reviewchange}
                              /> : <></>}
                            </Col>
                            <Col md="1"  className='px-0'>
                              {this.state.selectchange == "Review of Systems" || this.state.selectchange == "Physical Exam" ?
                                <div className="position-relative">  <div className="swiper-button-prev border mr-5px primary"></div>
                                  <div className="swiper-button-next border mr-5px primary"></div>
                                </div>
                                : <></>}
                            </Col>
                            <Col md="3" className='mt-75'>
                            {  this.state.selectchange === 'Chief Complaint' ?     <CustomInput
                            type="switch" className="mr-0"
                            inline
                            id='fetchief'
                            name="fetchChief"
                            checked={this.state.fetchChief == false ? false : true}
                            onChange={this.fetchChief}
                          >
                            <span className="switch-label">Copy Previous Data</span>
                          </CustomInput>:<></>}
                          {  this.state.selectchange === 'Review of Systems' ?     <CustomInput
                            type="switch" className="mr-0"
                            inline
                            id='fetchros'
                            name="fetchros"
                            checked={this.state.fetchros == false ? false : true}
                            onChange={this.fetchros}
                          >
                            <span className="switch-label">Copy Previous Data</span>
                          </CustomInput>:<></>}
                          {  this.state.selectchange === 'Data Reviewed' ?     <CustomInput
                            type="switch" className="mr-0"
                            inline
                            id='fetchDatareviewed'
                            name="fetchDatareviewed"
                            checked={this.state.fetchDatareviewed == false ? false : true}
                            onChange={this.fetchDatareviewed}
                          >
                            <span className="switch-label">Copy Previous Data</span>
                          </CustomInput>:<></>}
                          {  this.state.selectchange === 'History' ?     <CustomInput
                            type="switch" className="mr-0"
                            inline
                            id='fetchHistory'
                            name="fetchHistory"
                            checked={this.state.fetchHistory == false ? false : true}
                            onChange={this.fetchHistory}
                          >
                            <span className="switch-label">Copy Previous Data</span>
                          </CustomInput>:<></>}
                          {  this.state.selectchange === 'Physical Exam' ?     <CustomInput
                            type="switch" className="mr-0"
                            inline
                            id='fetchPE'
                            name="fetchPE"
                            checked={this.state.fetchPE == false ? false : true}
                            onChange={this.fetchPE}
                          >
                            <span className="switch-label">Copy Previous Data</span>
                          </CustomInput>:<></>}
                          {  this.state.selectchange === 'MDM' ?     <CustomInput
                            type="switch" className="mr-0"
                            inline
                            id='fetchmdm'
                            name="fetchmdm"
                            checked={this.state.fetchmdm == false ? false : true}
                            onChange={this.fetchmdm}
                          >
                            <span className="switch-label">Copy Previous Data</span>
                          </CustomInput>:<></>}
                          {  this.state.selectchange === 'Assessment and Plan' ?     <CustomInput
                            type="switch" className="mr-0"
                            inline
                            id='fetchAssessment'
                            name="fetchAssessment"
                            checked={this.state.fetchAssessment == false ? false : true}
                            onChange={this.fetchAssessment}
                          >
                            <span className="switch-label">Copy Previous Data</span>
                          </CustomInput>:<></>}
                            </Col>
                          </Row>
                          {/* HPI */}
                          {this.state.selectchange == "Chief Complaint" ? <Row>
                            <Col md={6}>
                              <FormGroup className="form-label-group  mb-50">
                                <Input
                                  type="text"
                                  className="form-control"
                                  placeholder="Chief Complaint"
                                  name="chiefcomplaint"
                                  onChange={this.radioChange}
                                  value={this.state.chiefcomplaint}

                                />


                                <label htmlFor="chiefcomplaint">Chief Complaint</label>
                              </FormGroup> </Col>
                            <Col md={12}>
                              <h2 className=" title">HPI Elements</h2>
                            </Col>                  <Col md={6}>
                              <FormGroup className="form-label-group ">
                                <Field
                                  type="text"
                                  className="form-control"
                                  placeholder="Location"
                                  name="location"
                                  onChange={this.inputChange}
                                  value={this.state.hpi.location}
                                  className={`form-control ${
                                    errors.location &&
                                    touched.location &&
                                    "is-invalid"
                                    }`}
                                />
                                <ErrorMessage
                                  name="location"
                                  component="div"
                                  className="invalid-tooltip mt-25"
                                />

                                <label htmlFor="Location">Location</label>

                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup className="form-label-group  ">

                                <Field
                                  type="text"
                                  className="form-control"
                                  onFocus={this.activateField}
                                  onChange={this.inputChange}
                                  value={this.state.hpi.quality}
                                  name="quality"
                                  placeholder="Quality"
                                  className={`form-control ${
                                    errors.quality &&
                                    touched.quality &&
                                    "is-invalid"
                                    }`}
                                />
                                <ErrorMessage
                                  name="quality"
                                  component="div"
                                  className="invalid-tooltip mt-25"
                                />
                                <label htmlFor="Quality">Quality</label>

                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup className="form-label-group ">
                                <Input
                                  type="text"
                                  className="form-control"
                                  placeholder="Timing"
                                  name='timing'
                                  onChange={this.inputChange}
                                  value={this.state.hpi.timing}
                                />
                                <label htmlFor="Timing">Timing</label>

                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup className="form-label-group ">
                                <Input
                                  type="text"
                                  className="form-control"
                                  placeholder="Severity"
                                  name='severity'
                                  onChange={this.inputChange}
                                  value={this.state.hpi.severity}
                                />
                                <label htmlFor="Severity">Severity</label>

                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup className="form-label-group ">
                                <Input
                                  type="text"
                                  className="form-control"
                                  placeholder="Duration"
                                  name="duration"
                                  onChange={this.inputChange}
                                  value={this.state.hpi.duration}
                                />
                                <label htmlFor="Duration">Duration</label>

                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup className="form-label-group ">
                                <Input
                                  type="text"
                                  className="form-control"
                                  placeholder="Context"
                                  name='context'
                                  onChange={this.inputChange}
                                  value={this.state.hpi.context}
                                />
                                <label htmlFor="Context">Context</label>

                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup className="form-label-group mb-0 ">
                                <Input
                                  type="text"
                                  className="form-control"
                                  placeholder="Modifying Factors"
                                  name='modifyingFactors'
                                  onChange={this.inputChange}
                                  value={this.state.hpi.modifyingFactors}
                                />
                                <label htmlFor="ModifyingFactors">Modifying Factors</label>

                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup className="form-label-group mb-0 ">
                                <Input
                                  type="text"
                                  className="form-control"
                                  name='associatedSignsandSymptoms'
                                  placeholder="Associated Signs and Symptoms"
                                  onChange={this.inputChange}
                                  value={this.state.hpi.associatedSignsandSymptoms}
                                />
                                <label htmlFor="AssociatedSignsandSymptoms">Associated Signs and Symptoms</label>

                              </FormGroup>
                            </Col>
                          </Row> : <></>}
                          {this.state.selectchange == "Review of Systems" && this.state.reviewSystem == 'Constitutional' ?
                            <div className="border pt-25">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      <Col md="3" className="mr-0 mt-50">
                                        <CustomInput
                                          type="switch" className="mr-0"
                                          id="weightloss"
                                          inline
                                          name="weightloss"
                                          checked={this.state.ros.weightloss == false ? false : true}
                                          onChange={this.checkboxChange}
                                        >
                                          <span className="switch-label">Weight loss</span>
                                        </CustomInput>
                                      </Col>
                                      <Col md="3" className="mr-0 mt-50">
                                        <CustomInput
                                          type="switch" className="mr-0"
                                          id="fevers"
                                          name="fevers"
                                          checked={this.state.ros.fevers == false ? false : true}
                                          onChange={this.checkboxChange}
                                          inline
                                        >
                                          <span className="switch-label">Fevers</span>
                                        </CustomInput>
                                      </Col>
                                      <Col md="3" className="mr-0 mt-50">
                                        <CustomInput
                                          type="switch" className="mr-0"
                                          id="chills"
                                          name="chills"
                                          inline
                                          onChange={this.checkboxChange}
                                          checked={this.state.ros.chills == false ? false : true}

                                        >
                                          <span className="switch-label">Chills</span>
                                        </CustomInput>
                                      </Col>
                                      <Col md="3" className="mr-0 mt-50">
                                        <CustomInput
                                          type="switch" className="mr-0"
                                          id="nightsweats"
                                          name="nightsweats"
                                          inline
                                          onChange={this.checkboxChange}
                                          checked={this.state.ros.nightsweats == false ? false : true}
                                        >
                                          <span className="switch-label">Night sweats</span>
                                        </CustomInput>
                                      </Col>
                                      <Col md="3" className="mr-0 mt-50">
                                        <CustomInput
                                          type="switch" className="mr-0"
                                          id="fatigue"
                                          name="fatigue"
                                          inline
                                          onChange={this.checkboxChange}
                                          checked={this.state.ros.fatigue == false ? false : true}
                                        >
                                          <span className="switch-label">Fatigue</span>
                                        </CustomInput>
                                      </Col>

                                      <Col md="12" className="mr-0 mt-1">
                                        <FormGroup className="mb-0 form-label-group">
                                          <Input
                                            type="text"
                                            placeholder="Others"
                                            name="others"
                                            onChange={this.radioChange}
                                          />
                                          <Label for="others">Others</Label>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>

                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Review of Systems" && this.state.reviewSystem == 'Ears/Nose/Throat' ?
                            <div className="border  pt-25">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {ent.map((entList) => {
                                        return (<Col md="3" className="mr-0 mt-50">
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={entList.title}
                                            name={entList.title}
                                            inline
                                            onChange={this.checkboxChange}
                                            checked={this.state.ros[entList.title] == false ? false : true}
                                          >
                                            <span className="switch-label">{entList.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                      <Col md="12" className="mr-0 mt-1">
                                        <FormGroup className="mb-0 form-label-group">
                                          <Input
                                            type="text"
                                            placeholder="Others"
                                          />
                                          <Label for="others">Others</Label>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Review of Systems" && this.state.reviewSystem == 'Skin' ?
                            <div className="border  pt-25">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {skin.map((skinList) => {
                                        return (<Col md="3" className="mr-0 mt-50">
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={skinList.title}
                                            name={skinList.title}
                                            onChange={this.checkboxChange}
                                            inline
                                          >
                                            <span className="switch-label">{skinList.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                      <Col md="12" className="mr-0 mt-1">
                                        <FormGroup className="mb-0 form-label-group">
                                          <Input
                                            type="text"
                                            placeholder="Others"
                                          />
                                          <Label for="others">Others</Label>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Review of Systems" && this.state.reviewSystem == 'Musculoskeletal' ?
                            <div className="border  pt-25">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {Musculoskeletal.map((MusculoskeletalList) => {
                                        return (<Col md="3" className="mr-0 mt-50">
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={MusculoskeletalList.title}
                                            name={MusculoskeletalList.title}
                                            inline
                                            onChange={this.checkboxChange}
                                            checked={this.state.ros[MusculoskeletalList.title] == false ? false : true}
                                          >
                                            <span className="switch-label">{MusculoskeletalList.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                      <Col md="12" className="mr-0 mt-1">
                                        <FormGroup className="mb-0 form-label-group">
                                          <Input
                                            type="text"
                                            placeholder="Others"
                                          />
                                          <Label for="others">Others</Label>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Review of Systems" && this.state.reviewSystem == 'Gastrointestinal' ?
                            <div className="border  pt-25">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {Gastrointestinal.map((GastrointestinalList) => {
                                        return (<Col md="3" className="mr-0 mt-50">
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={GastrointestinalList.title}
                                            name={GastrointestinalList.title}
                                            onChange={this.checkboxChange}
                                            checked={this.state.ros[GastrointestinalList.title] == false ? false : true}

                                            inline
                                          >
                                            <span className="switch-label">{GastrointestinalList.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                      <Col md="12" className="mr-0 mt-1">
                                        <FormGroup className="mb-0 form-label-group">
                                          <Input
                                            type="text"
                                            placeholder="Others"
                                          />
                                          <Label for="others">Others</Label>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Review of Systems" && this.state.reviewSystem == 'Genitourinary' ?
                            <div className="border  pt-25">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {Genitourinary.map((GenitourinaryList) => {
                                        return (<Col md="3" className="mr-0 mt-50">
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={GenitourinaryList.title}
                                            name={GenitourinaryList.title}
                                            inline
                                            onChange={this.checkboxChange}
                                            checked={this.state.ros[GenitourinaryList.title] == false ? false : true}
                                          >
                                            <span className="switch-label">{GenitourinaryList.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                      <Col md="12" className="mr-0 mt-1">
                                        <FormGroup className="mb-0 form-label-group">
                                          <Input
                                            type="text"
                                            placeholder="Others"
                                          />
                                          <Label for="others">Others</Label>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Review of Systems" && this.state.reviewSystem == 'Neurological' ?
                            <div className="border  pt-25">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {Neurological.map((NeurologicalList) => {
                                        return (<Col md="3" className="mr-0 mt-50">
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={NeurologicalList.title}
                                            name={NeurologicalList.title}
                                            inline
                                            onChange={this.checkboxChange}
                                            checked={this.state.ros[NeurologicalList.title] == false ? false : true}

                                          >
                                            <span className="switch-label">{NeurologicalList.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                      <Col md="12" className="mr-0 mt-1">
                                        <FormGroup className="mb-0 form-label-group">
                                          <Input
                                            type="text"
                                            placeholder="Others"
                                          />
                                          <Label for="others">Others</Label>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Review of Systems" && this.state.reviewSystem == 'Endocrine' ?
                            <div className="border  pt-25">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {Endocrine.map((EndocrineList) => {
                                        return (<Col md="3" className="mr-0 mt-50">
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={EndocrineList.title}
                                            name={EndocrineList.title}
                                            inline
                                            onChange={this.checkboxChange}
                                            checked={this.state.ros[EndocrineList.title] == false ? false : true}

                                          >
                                            <span className="switch-label">{EndocrineList.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                      <Col md="12" className="mr-0 mt-1">
                                        <FormGroup className="mb-0 form-label-group">
                                          <Input
                                            type="text"
                                            placeholder="Others"
                                          />
                                          <Label for="others">Others</Label>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Review of Systems" && this.state.reviewSystem == 'Psychiatric' ?
                            <div className="border  pt-25">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {Psychiatric.map((PsychiatricList) => {
                                        return (<Col md="3" className="mr-0 mt-50">
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={PsychiatricList.title}
                                            name={PsychiatricList.title}
                                            inline
                                            onChange={this.checkboxChange}
                                            checked={this.state.ros[PsychiatricList.title] == false ? false : true}

                                          >
                                            <span className="switch-label">{PsychiatricList.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                      <Col md="12" className="mr-0 mt-1">
                                        <FormGroup className="mb-0 form-label-group">
                                          <Input
                                            type="text"
                                            placeholder="Others"
                                          />
                                          <Label for="others">Others</Label>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Review of Systems" && this.state.reviewSystem == 'Hem/Lymphatic' ?
                            <div className="border  pt-25">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {HemLymphatic.map((HemLymphaticList) => {
                                        return (<Col md="3" className="mr-0 mt-50">
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={HemLymphaticList.title}
                                            name={HemLymphaticList.title}
                                            inline
                                            onChange={this.checkboxChange}
                                            checked={this.state.ros[HemLymphaticList.title] == false ? false : true}

                                          >
                                            <span className="switch-label">{HemLymphaticList.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                      <Col md="12" className="mr-0 mt-1">
                                        <FormGroup className="mb-0 form-label-group">
                                          <Input
                                            type="text"
                                            placeholder="Others"
                                          />
                                          <Label for="others">Others</Label>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Review of Systems" && this.state.reviewSystem == 'Eyes' ?
                            <div className="border pt-25">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {eyes.map((eyeslist) => {
                                        return (<Col md="3" className="mr-0 mt-50" key={eyeslist.id}>
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={eyeslist.title}
                                            name={eyeslist.title}
                                            inline
                                            onChange={this.checkboxChange}
                                            checked={this.state.ros[eyeslist.title] == false ? false : true}

                                          >
                                            <span className="switch-label">{eyeslist.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                      <Col md="12" className="mr-0 mt-1">
                                        <FormGroup className="mb-0 form-label-group">
                                          <Input
                                            type="text"
                                            placeholder="Others"
                                          />
                                          <Label for="others">Others</Label>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}      {this.state.selectchange == "Review of Systems" && this.state.reviewSystem == 'Cardiovascular' ?
                              <div className="border pt-25">
                                <Row>
                                  <Col md="12">
                                    <div>
                                      <Row>
                                        {cardiovascular.map((cardiovascularlist) => {
                                          return (<Col md="3" className="mr-0 mt-50" key={cardiovascularlist.id}>
                                            <CustomInput
                                              type="switch" className="mr-0"
                                              id={cardiovascularlist.title}
                                              name={cardiovascularlist.title}
                                              inline
                                              onChange={this.checkboxChange}
                                              checked={this.state.ros[cardiovascularlist.title] == false ? false : true}
                                            >
                                              <span className="switch-label">{cardiovascularlist.label} </span>
                                            </CustomInput>
                                          </Col>)
                                        })}
                                        <Col md="12" className="mr-0 mt-1">
                                          <FormGroup className="mb-0 form-label-group">
                                            <Input
                                              type="text"
                                              placeholder="Others"
                                            />
                                            <Label for="others">Others</Label>
                                          </FormGroup>
                                        </Col>
                                      </Row>
                                    </div>
                                  </Col>
                                </Row>
                              </div> : <></>}
                          {this.state.selectchange == "Review of Systems" && this.state.reviewSystem == 'Respiratory' ?
                            <div className="border pt-25">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {Respiratory.map((Respiratorylist) => {
                                        return (<Col md="3" className="mr-0 mt-50" key={Respiratorylist.id}>
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={Respiratorylist.title}
                                            name={Respiratorylist.title}
                                            inline
                                            onChange={this.checkboxChange}
                                            checked={this.state.ros[Respiratorylist.title] == false ? false : true}
                                          >
                                            <span className="switch-label">{Respiratorylist.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                      <Col md="12" className="mr-0 mt-1">
                                        <FormGroup className="mb-0 form-label-group">
                                          <Input
                                            type="text"
                                            placeholder="Others"

                                          />
                                          <Label for="others">Others</Label>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Review of Systems" && this.state.reviewSystem == 'Allergic/Immun' ?
                            <div className="border pt-25">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {Allergic.map((allergiclist) => {
                                        return (<Col md="3" className="mr-0 mt-50" key={allergiclist.id}>
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={allergiclist.title}
                                            name={allergiclist.title}
                                            inline
                                            onChange={this.checkboxChange}
                                            checked={this.state.ros[allergiclist.title] == false ? false : true}


                                          >
                                            <span className="switch-label">{allergiclist.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                      <Col md="12" className="mr-0 mt-1">
                                        <FormGroup className="mb-0 form-label-group">
                                          <Input
                                            type="text"
                                            placeholder="Others"
                                          />
                                          <Label for="others">Others</Label>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Physical Exam" && this.state.reviewSystem == 'Constitutional' ?
                            <div className="border py-50">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {peConstitutional.map((peConstitutionallist) => {
                                        return (<Col md="4" className="mr-0 mt-50" key={peConstitutionallist.id}>
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={peConstitutionallist.title}
                                            name={peConstitutionallist.title}
                                            inline
                                            onChange={this.constitutionalChange}
                                            // onChange={this.peChange(peConstitutional)}

                                            checked={this.state.peConstitutional[peConstitutionallist.title] == false ? false : true}
                                          >
                                            <span className="switch-label">{peConstitutionallist.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}

                          {this.state.selectchange == "Physical Exam" && this.state.reviewSystem == 'EENNMT' ?
                            <div className="border py-50">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {peENMT.map((peENMTlist) => {
                                        return (<Col md="4" className="mr-0 mt-50" key={peENMTlist.id}>
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={peENMTlist.title}
                                            name={peENMTlist.title}
                                            inline
                                            checked={this.state.peENMT[peENMTlist.title] == false ? false : true}
                                            onChange={this.enmtChange}
                                          // onChange={this.haiChange}

                                          >
                                            <span className="switch-label">{peENMTlist.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}

                          {this.state.selectchange == "Physical Exam" && this.state.reviewSystem == 'Respiratory' ?
                            <div className="border py-50">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {peRespiratory.map((peRespiratorylist) => {
                                        return (<Col md="4" className="mr-0 mt-50" key={peRespiratorylist.id}>
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={peRespiratorylist.title}
                                            name={peRespiratorylist.title}
                                            inline
                                            checked={this.state.peRespiratory[peRespiratorylist.title] == false ? false : true}
                                            onChange={this.peRespiratoryChange}
                                          >
                                            <span className="switch-label">{peRespiratorylist.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Physical Exam" && this.state.reviewSystem == 'Cardiovascular' ?
                            <div className="border py-50">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {peCardiovascular.map((peCardiovascularlist) => {
                                        return (<Col md="4" className="mr-0 mt-50" key={peCardiovascularlist.id}>
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={peCardiovascularlist.title}
                                            name={peCardiovascularlist.title}
                                            inline
                                            checked={this.state.peCardiovascular[peCardiovascularlist.title] == false ? false : true}
                                            onChange={this.peCardiovascularChange}
                                          >
                                            <span className="switch-label">{peCardiovascularlist.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Physical Exam" && this.state.reviewSystem == 'Gastrointestinal' ?
                            <div className="border py-50">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {peGastrointestinal.map((peGastrointestinallist) => {
                                        return (<Col md="4" className="mr-0 mt-50" key={peGastrointestinallist.id}>
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={peGastrointestinallist.title}
                                            name={peGastrointestinallist.title}
                                            inline
                                            checked={this.state.peGastrointestinal[peGastrointestinallist.title] == false ? false : true}
                                            onChange={this.peGastrointestinalChange}
                                          >
                                            <span className="switch-label">{peGastrointestinallist.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Physical Exam" && this.state.reviewSystem == 'Musculoskeletal' ?
                            <div className="border py-50">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {peMusculoskeletal.map((peMusculoskeletallist) => {
                                        return (<Col md="4" className="mr-0 mt-50"  key={peMusculoskeletallist.id}>
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={peMusculoskeletallist.title}
                                            name={peMusculoskeletallist.title}
                                            inline
                                            checked={this.state.peMusculoskeletal[peMusculoskeletallist.title] == false ? false : true}
                                            onChange={this.peMusculoskeletalChange}
                                          >
                                            <span className="switch-label">{peMusculoskeletallist.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Physical Exam" && this.state.reviewSystem == 'Skin' ?
                            <div className="border py-50">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {peSkin.map((peSkinlist) => {
                                        return (<Col md="4" className="mr-0 mt-50" key={peSkinlist.id}>
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={peSkinlist.title}
                                            name={peSkinlist.title}
                                            inline
                                            checked={this.state.peSkin[peSkinlist.title] == false ? false : true}
                                            onChange={this.peSkinChange}
                                          >
                                            <span className="switch-label">{peSkinlist.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}

                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Physical Exam" && this.state.reviewSystem == 'Neurologic' ?
                            <div className="border py-50">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {peNeurologic.map((peNeurologiclist) => {
                                        return (<Col md="4" className="mr-0 mt-50"  key={peNeurologiclist.id}>
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={peNeurologiclist.title}
                                            name={peNeurologiclist.title}
                                            inline
                                            checked={this.state.peNeurologic[peNeurologiclist.title] == false ? false : true}
                                            onChange={this.peNeurologicChange}
                                          >
                                            <span className="switch-label">{peNeurologiclist.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}

                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "Physical Exam" && this.state.reviewSystem == 'Psychiatric' ?
                            <div className="border py-50">
                              <Row>
                                <Col md="12">
                                  <div>
                                    <Row>
                                      {pePsychiatric.map((pePsychiatriclist) => {
                                        return (<Col md="4" className="mr-0 mt-50"  key={pePsychiatriclist.id}>
                                          <CustomInput
                                            type="switch" className="mr-0"
                                            id={pePsychiatriclist.title}
                                            name={pePsychiatriclist.title}
                                            inline
                                            checked={this.state.pePsychiatric[pePsychiatriclist.title] == false ? false : true}
                                            onChange={this.pePsychiatricChange}
                                          >
                                            <span className="switch-label">{pePsychiatriclist.label} </span>
                                          </CustomInput>
                                        </Col>)
                                      })}
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div> : <></>}

                          {/* Review            */}
                          {this.state.selectchange == "Data Reviewed" ? <div> <Row>
                            <Col md="12">
                              <FormGroup className="form-label-group ">
                                <Input
                                  type="textarea"
                                  placeholder="Data Reviewed"
                                  name="dataReviewed"
                                  rows="2.5"
                                  onChange={this.radioChange}
                                />                        <Label className="d-block" htmlFor="data-reviewed">Data Reviewed</Label>

                              </FormGroup>
                            </Col>
                          </Row>
                            <FormGroup className=" mb-0">
                              <Label className="d-block" for="Data-points"><h2 className="title mb-50">Data Points</h2></Label>
                              <Row className="data-reviewed">
                                <Col md="6" className="pl-5px">
                                  <div className="d-inline-block mr-1">
                                    <Checkbox
                                      color="primary"
                                      name="option1"
                                      icon={<Check className="vx-icon" size={13} />}
                                      onChange={this.handleCheckboxChange}
                                      defaultChecked={this.state.option1}
                                      label="Review and/or order labs (1)"
                                    />
                                  </div>
                                </Col>
                                <Col md="6" >
                                  <div className="d-inline-block mr-1">
                                    <Checkbox
                                      color="primary"
                                      name="option2"
                                      icon={<Check className="vx-icon" size={13} />}
                                      label="Review and/or order Xrays (1)"
                                      onChange={this.handleCheckboxChange}
                                      defaultChecked={this.state.option2}

                                    />
                                  </div>
                                </Col>
                                <Col md="6" className="pl-5px">
                                  <div className="d-inline-block mr-1">
                                    <Checkbox
                                      color="primary"
                                      name="option3"
                                      icon={<Check className="vx-icon" size={13} />}
                                      label="Discuss test with MD (1)"
                                      onChange={this.handleCheckboxChange}
                                      defaultChecked={this.state.option3} />
                                  </div>
                                </Col>
                                <Col md="6" >
                                  <div className="d-inline-block mr-1">
                                    <Checkbox
                                      color="primary"
                                      name="option4"
                                      icon={<Check className="vx-icon" size={13} />}
                                      label="Review any image, tracing, specimen (2)"
                                      onChange={this.handleCheckboxChange}
                                      defaultChecked={this.state.option4}

                                    />
                                  </div>
                                </Col>
                                <Col md="6" className="pl-5px">
                                  <div className="d-inline-block mr-1">
                                    <Checkbox
                                      color="primary"
                                      name="option5"
                                      icon={<Check className="vx-icon" size={13} />}
                                      label="Order old records (1)"
                                      onChange={this.handleCheckboxChange}
                                      defaultChecked={this.state.option5}

                                    />
                                  </div>
                                </Col>
                                <Col md="6">
                                  <div className="d-inline-block mr-1">
                                    <Checkbox
                                      color="primary"
                                      name="option6"
                                      icon={<Check className="vx-icon" size={13} />}
                                      label="Summarize old records (2)"
                                      onChange={this.handleCheckboxChange}
                                      defaultChecked={this.state.option6}

                                    />
                                  </div>
                                </Col>
                                <Col md="12" className="pl-5px">
                                  <div className="d-inline-block mr-1">
                                    <Checkbox
                                      color="primary"
                                      name="option7"
                                      icon={<Check className="vx-icon" size={13} />}
                                      label="Review and/or order medical test (PFTs, EKG, echo, cath) (1)"
                                      onChange={this.handleCheckboxChange}
                                      defaultChecked={this.state.option7}


                                    />
                                  </div>
                                </Col>
                              </Row>
                            </FormGroup> </div> : <></>}
                          {/* Assessment and Plan */}
                          {this.state.selectchange == "MDM" ?
                            <div>
                              <Row>
                                <Col md="12" className="mdm">
                                  <Table bordered responsive>
                                    <thead>
                                      <tr>
                                        <th>   <div className="has-icon-right position-relative">
                                          <Radio
                                            color="primary"
                                            // icon={<Check className="vx-icon" size={14} />}
                                            label="Minimal Risk"
                                            size="sm"
                                            // defaultChecked={false}
                                            name="mdmResult"
                                            onChange={this.radioChange}
                                            value="SF"
                                            checked={this.state.mdmResult === 'SF' ? true : false}
                                          />
                                        </div>
                                          <ErrorMessage
                                            name="mdmResult"
                                            component="div"
                                            className="invalid-tooltip mt-25"
                                          /></th>
                                        <th> <div className="has-icon-right position-relative">
                                          <Radio
                                            color="primary"
                                            // icon={<Check className="vx-icon" size={14} />}
                                            label="Low Risk"
                                            size="sm"
                                            // defaultChecked={false}
                                            name="mdmResult"
                                            onChange={this.radioChange}
                                            value="low"
                                            checked={this.state.mdmResult === 'low' ? true : false}
                                          /></div></th>
                                        <th><div className="has-icon-right position-relative">
                                          <Radio
                                            color="primary"
                                            // icon={<Check className="vx-icon" size={14} />}
                                            label="Moderate Risk"
                                            size="sm"
                                            // defaultChecked={false}
                                            name="mdmResult"
                                            onChange={this.radioChange}
                                            value="mod"
                                            checked={this.state.mdmResult === 'mod' ? true : false}
                                          />
                                        </div></th>
                                        <th> <div className="has-icon-right position-relative">
                                          <Radio
                                            color="primary"
                                            // icon={<Check className="vx-icon" size={14} />}
                                            label="High Risk"
                                            size="sm"
                                            // defaultChecked={false}
                                            name="mdmResult"
                                            onChange={this.radioChange}
                                            value="high"
                                            checked={this.state.mdmResult === 'high' ? true : false}
                                          /></div></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          <ul>
                                            <li>One self limited problem<br />(e.g., cold, insect bite)</li>
                                          </ul>
                                        </td>
                                        <td>
                                          <ul>
                                            <li>Two self-limited problems</li>
                                            <li>One stable chronic illness</li>
                                            <li>Acute uncomplicated illness<br />(e.g., cystitis/rhinitis)</li>
                                            <li>OTC drugs</li></ul></td>
                                        <td>
                                          <ul>
                                            <li>Mild exacerbation of one chronic illness</li>
                                            <li>Two stable chronic illnesses</li>
                                            <li>Undiagnosed new problem</li>
                                            <li>Acute illness with systemic symptoms<br></br>(e.g., pyelonephritis, colitis)</li>
                                            <li>Prescription drug management</li>
                                          </ul>
                                        </td>
                                        <td>
                                          <ul>
                                            <li>Severe exacerbation of chronic illness</li>
                                            <li>Illness with threat to life or bodily function</li>
                                            <li>Abrupt change in neurological status <br /> (e.g., TIA/weakness)</li>
                                            <li>Parenteral controlled substances</li>
                                            <li>Decision for DNR or to de-escalate care</li>
                                            <li>Drugs requiring intensive monitoring for toxicity</li>
                                          </ul>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </Col>
                              </Row>
                            </div> : <></>}
                          {this.state.selectchange == "History" ?
                            <div className="history floating-input">        <Row>
                              <Col md="12">
                                <FormGroup className="form-label-group ">
                                  <Input
                                    type="textarea"
                                    placeholder="Past Medical History"
                                    id="pasthistory"
                                    rows="2"
                                    className="form-control"
                                    name="pasthistory"
                                    onChange={this.historyChange}
                                    value={this.state.history.pasthistory}

                                  />    <Label for="pmh">Past Medical History</Label>

                                </FormGroup>
                                <FormGroup className="form-label-group ">
                                  <Input
                                    type="textarea"
                                    placeholder="Family History"
                                    id="fh"
                                    className="form-control"
                                    rows="2"
                                    name="familyhistory"
                                    onChange={this.historyChange}
                                    value={this.state.history.familyhistory}
                                  />    <Label for="fh">Family History</Label>

                                </FormGroup>
                                <FormGroup className="form-label-group ">
                                  <Input
                                    type="textarea"
                                    placeholder="Social History"
                                    id="sh"
                                    rows="2"
                                    className="form-control"
                                    name="socialhistory"
                                    onChange={this.historyChange}
                                    value={this.state.history.socialhistory}
                                  />                            <Label for="sh"> Social History</Label>

                                </FormGroup>
                                <FormGroup className="form-label-group ">
                                  <Input
                                    type="textarea"
                                    placeholder="Smoking History"
                                    id="pmh"
                                    rows="2"
                                    className="form-control"
                                    name="smokinghistory"
                                    onChange={this.historyChange}
                                    value={this.state.history.smokinghistory}

                                  />                            <Label for="smoking"> Smoking History</Label>

                                </FormGroup>
                              </Col>
                            </Row>

                            </div> : <></>}

                          {this.state.selectchange == "Assessment and Plan" ?
                            <div className="assessmentplan">
                              <Col md="12" className="border" >
                                <Label><h5>ICD Code 1</h5></Label>
                                <Select
                                  className={`React col-md-6  px-0 basic-single ${
                                    this.state.icdCode1 != '' ? "bg-active" : ''
                                    }`}
                                  classNamePrefix="select"
                                  options={icd1}
                                  onChange={this.icdCode1Change}
                                  clearable
                                />
                                <Collapse isOpen={this.state.icdCode1 == '' && this.state.icd1monitor == '' && this.state.icd1treatment == '' && this.state.icd1evaluate == '' && this.state.icd1assess == ''
                                  ? false : this.state.icdCode1Show == false ? false : true} >
                                  <Col md={12} className="meat px-0 mt-2">
                                    <Row>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group  mb-0">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Monitor"
                                            name="icd1monitor"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd1monitor}
                                          />
                                          <label htmlFor="Monitor">Monitor</label>

                                        </FormGroup>
                                      </Col>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group  mb-0">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Evaluate"
                                            name="icd1evaluate"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd1evaluate}

                                          />
                                          <label htmlFor="Evaluate">Evaluate</label>

                                        </FormGroup>
                                      </Col>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group  mb-0">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Assess"
                                            name="icd1assess"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd1assess}

                                          />
                                          <label htmlFor="Assess">Assess</label>

                                        </FormGroup>
                                      </Col>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group  mb-0">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Treatment"
                                            name="icd1treatment"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd1treatment}

                                          />
                                          <label htmlFor="treatment">Treatment</label>

                                        </FormGroup>
                                      </Col>
                                    </Row>

                                  </Col>
                                </Collapse>
                              </Col>
                              <Col md="12" className="border">
                                <Label><h5>ICD Code 2</h5></Label>
                                <Select
                                  className={`React px-0 col-md-6 ${
                                    this.state.icdCode2 != '' ? "bg-active" : ''
                                    }`}
                                  classNamePrefix="select"
                                  options={icd1}
                                  onChange={this.icdCode2Change}

                                />
                                <Collapse isOpen={this.state.icdCode2 == '' && this.state.icd2monitor == '' && this.state.icd2treatment == ''
                                  && this.state.icd2evaluate == '' && this.state.icd2assess == ''
                                  ? false : this.state.icdCode2Show == false ? false : true} >
                                  <Col md={12} className="meat px-0 mt-2">
                                    <Row>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group  mb-0">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Monitor"
                                            name="icd2monitor"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd2monitor}

                                          />
                                          <label htmlFor="Monitor">Monitor</label>

                                        </FormGroup>
                                      </Col>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group ">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Evaluate"
                                            name="icd2evaluate"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd2evaluate}

                                          />
                                          <label htmlFor="Evaluate">Evaluate</label>

                                        </FormGroup>
                                      </Col>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group  mb-0">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Assess"
                                            name="icd2assess"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd2assess}

                                          />
                                          <label htmlFor="Assess">Assess</label>

                                        </FormGroup>
                                      </Col>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group  mb-0">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Treatment"
                                            name="icd2treatment"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd2treatment}

                                          />
                                          <label htmlFor="treatment">Treatment</label>

                                        </FormGroup>
                                      </Col>
                                    </Row>

                                  </Col>
                                </Collapse>
                              </Col>
                              <Col md="12" className="border">
                                <Label><h5>ICD Code 3</h5></Label>
                                <Select
                                  className={`React px-0 col-md-6 ${
                                    this.state.icdCode3 != '' ? "bg-active" : ''
                                    }`}
                                  classNamePrefix="select"
                                  options={icd1}
                                  onChange={this.icdCode3Change}

                                />
                                <Collapse isOpen={this.state.icdCode3 == '' && this.state.icd3monitor == '' &&
                                  this.state.icd3treatment == '' && this.state.icd3evaluate == ''
                                  && this.state.icd3assess == ''
                                  ? false : this.state.icdCode3Show == false ? false : true} >
                                  <Col md={12} className="meat px-0 mt-2">
                                    <Row>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group  mb-0">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Monitor"
                                            name="icd3monitor"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd3monitor}

                                          />
                                          <label htmlFor="Monitor">Monitor</label>

                                        </FormGroup>
                                      </Col>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group  mb-0">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Evaluate"
                                            name="icd3evaluate"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd3evaluate}

                                          />
                                          <label htmlFor="Evaluate">Evaluate</label>

                                        </FormGroup>
                                      </Col>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group  mb-0">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Assess"
                                            name="icd3assess"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd3assess}

                                          />
                                          <label htmlFor="Assess">Assess</label>

                                        </FormGroup>
                                      </Col>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group  mb-0">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Treatment"
                                            name="icd3treatment"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd3treatment}

                                          />
                                          <label htmlFor="treatment">Treatment</label>

                                        </FormGroup>
                                      </Col>
                                    </Row>

                                  </Col>
                                </Collapse>
                              </Col>
                              <Col md="12" className="border">
                                <Label><h5>ICD Code 4</h5></Label>
                                <Select
                                  className={`React px-0 col-md-6 ${
                                    this.state.icdCode4 != '' ? "bg-active" : ''
                                    }`}
                                  classNamePrefix="select"
                                  options={icd1}
                                  onChange={this.icdCode4Change}

                                />
                                <Collapse isOpen={this.state.icdCode4 == '' && this.state.icd4monitor == '' &&
                                  this.state.icd4treatment == '' && this.state.icd4evaluate == ''
                                  && this.state.icd4assess == ''
                                  ? false : this.state.icdCode4Show == false ? false : true} >
                                  <Col md={12} className="meat px-0 mt-2">
                                    <Row>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group  mb-0">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Monitor"
                                            name="icd4monitor"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd4monitor}

                                          />
                                          <label htmlFor="Monitor">Monitor</label>

                                        </FormGroup>
                                      </Col>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group  mb-0">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Evaluate"
                                            name="icd4evaluate"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd4evaluate}

                                          />
                                          <label htmlFor="Evaluate">Evaluate</label>

                                        </FormGroup>
                                      </Col>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group  mb-0">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Assess"
                                            name="icd4assess"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd4assess}

                                          />
                                          <label htmlFor="Assess">Assess</label>

                                        </FormGroup>
                                      </Col>
                                      <Col md={3}>
                                        <FormGroup className="form-label-group  mb-0">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Treatment"
                                            name="icd4treatment"
                                            onChange={this.icdinputChange}
                                            value={this.state.icd4treatment}
                                          />
                                          <label htmlFor="treatment">Treatment</label>

                                        </FormGroup>
                                      </Col>
                                    </Row>

                                  </Col>
                                </Collapse>
                              </Col>


                              <Col md="12" className="border">
                                <Label><h5>CPT Code</h5></Label>
                                <Select
                                  className={`React px-0 col-md-6 basic-single ${
                                    this.state.cptValue.label != '' ? "bg-active" : ''
                                    }`}
                                  classNamePrefix="select"
                                  options={cptValueDropdown}
                                  defaultValue={this.state.cptValue}
                                />
                              </Col>

                            </div>
                            : <></>}
                          {this.state.selectchange == "Chief Complaint" ? <ul className="keyvalues pb-50">
                            <li>
                              Brief: 1 - 3 HPI elements *                       </li>
                            <li>Extended: 4 HPI elements* or status of 3 problems</li>
                          </ul> : <></>}
                        </div>
                        <div className=" ">

                          <Col md="12" className=" minHeight">
                            <Row>
                              <Col md="11  " className="border bg-grey " >                    <Row>

                                {this.state.count != 0 ? <Col className=" col-auto pr-md-0 pl-5px"> <Label className="d-inline-block px-0"><h6>HPI:</h6></Label>
                                  {this.state.count >= 1 && this.state.count <= 3 ? <Chip text='Brief' className="mr-1" /> : <Chip text='Extended' className="mr-1" />}</Col> : <></>}
                                {this.state.rosCount >= 1 ? <Col className="col-auto ">
                                  <Label className="d-inline-block px-0"><h6>ROS:</h6></Label>
                                  <Chip text={this.state.rosCount} className="mr-1" /></Col>
                                  : <></>}
                                {this.state.count != 0 ? <Col className="col-auto">
                                  <Label className="d-inline-block px-0 " for="history-level"><h6>History:</h6></Label>
                                  <Chip text={this.state.historyStatus} className="mr-1" /> </Col> : <></>}

                                {this.state.pEtotalCount === true ? <Col className="col-auto pr-md-0">    <Label className="d-inline-block px-0"><h6>PE:</h6></Label>
                                  <Chip text={this.state.peStatus}
                                    className="mr-1" /> </Col> : <></>}
                                {this.state.mdmResult != '' ? <Col className="col-auto ">
                                  <Label className="d-inline-block px-0" for="mdm"><h6>MDM: </h6></Label>
                                  <Chip text={this.state.mdmResult} lassName="mr-1" />
                                </Col> : <></>}             </Row>
                              </Col>
                              <Col className="ml-1 text-center border bg-grey"><a href="#" className="">

                                <Info className="vx-icon" size={26} onClick={this.setModalShow}
                                />
                              </a></Col>
                            </Row>
                          </Col>
                        </div>
                        <Row>
                          <Col md={3}>
                            <Button.Ripple
                              className="cursor-pointer btn-block mt-1"
                              color="primary"
                              size="md"
                              outline
                            >
                              Cancel
                        </Button.Ripple>
                          </Col>
                          <Col md={3}>
                            <Button.Ripple
                              className="cursor-pointer btn-block mt-1"
                              color="danger"
                              size="md"
                              outline
                              onClick={this.setPatientModal}
                            >
                              Preview
                        </Button.Ripple>
                          </Col>
                          <Col md={6}>
                            <Button.Ripple
                              className="cursor-pointer btn-block mt-1"
                              color="primary"
                              size="md"
                              type="submit"
                              disabled={this.state.pEtotalCount !== 0 && this.state.count >= 1 && this.state.mdmResult !== '' ? false : true}

                            >
                              Submit
                        </Button.Ripple>
                          </Col>
                        </Row></Form>)}</Formik>
                </CardBody>

              </Card>
            </Col>

          </Row>
          <Modal className="patientonly" isOpen={this.state.modalShow} centered>
            <ModalBody>      <a href='#' className="close" onClick={this.setModalShow}
            >  <X size={16} /></a>

              <Col md={12} className="px-0 ">
                <Table bordered responsive className="patientInfo">
                  <thead className="text-center">
                    <tr>
                      <td colSpan='5'> 3 out of 3 Key Components Required</td>
                    </tr>
                  </thead>
                  <thead>
                    <tr>
                      <td>E/M </td>
                      <td>Hx</td>
                      <td>Exam</td>
                      <td>MDM</td>
                      <td>Time</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>99201</td>
                      <td>PF</td>
                      <td>PF</td>
                      <td>SF</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>99202</td>
                      <td>EPF</td>
                      <td>EPF</td>
                      <td>SF</td>
                      <td>20</td>
                    </tr>
                    <tr>
                      <td>99203</td>
                      <td>Det</td>
                      <td>Det</td>
                      <td>Low</td>
                      <td>30</td>
                    </tr>
                    <tr>
                      <td>99204</td>
                      <td>Comp</td>
                      <td>Comp</td>
                      <td>Mod</td>
                      <td>45</td>
                    </tr>
                    <tr>
                      <td>99205</td>
                      <td>Comp</td>
                      <td>Comp</td>
                      <td>High</td>
                      <td>60</td>
                    </tr>

                  </tbody>
                </Table></Col>
            </ModalBody>

          </Modal>
          <Modal className="patientonly previewform" isOpen={this.state.patientFormShow} centered size="lg">

            <ModalBody>      <a href='#' className="close" onClick={this.setPatientModal}
            >  <X size={16} /></a>
              <Row>
                <Col md="5"><b>Patient New Visit Form Information</b></Col>
                <Col md="7" className="pl-0 text-right">
                  <ul className="patient-detail"><li>FRANKLIN, JOSEPH</li> <li>DOB: 24/08/2020</li> <li>DoS: 24/08/2020</li></ul>
                </Col>
              </Row>
              <Col md={12} className="px-0">
                {this.state.count !== '' ? <div>
                  {this.state.chiefcomplaint != '' ? <ul className="pl-0">
                    <li><p><b>Chief Complaint:</b></p> <p>{this.state.chiefcomplaint}</p></li>
                  </ul> : <></>}
                  {this.state.count != '' ? <div>    <h5>HPI Elements</h5>
                    <Row>
                      <ul>
                        {this.state.hpi.location != '' ? <li><p><b>Location:</b></p> <p>{this.state.hpi.location}</p></li> : ''}
                        {this.state.hpi.quality != '' ? <li><p><b>Quality:</b></p> <p>{this.state.hpi.quality}</p></li> : ''}
                        {this.state.hpi.timing != '' ? <li><p><b>Timing:</b></p> <p>{this.state.hpi.timing}</p></li> : ''}
                        {this.state.hpi.severity != '' ? <li><p><b>Severity:</b></p> <p>{this.state.hpi.severity}</p></li> : ''}
                        {this.state.hpi.duration != '' ? <li><p><b>Duration:</b></p> <p>{this.state.hpi.duration}</p></li> : ''}
                        {this.state.hpi.context != '' ? <li><p><b>Context:</b></p> <p>{this.state.hpi.context}</p></li> : ''}
                        {this.state.hpi.modifyingFactors != '' ? <li><p><b>Modifying Factors:</b></p> <p>{this.state.hpi.modifyingFactors}</p></li> : ''}
                        {this.state.hpi.associatedSignsandSymptoms != '' ? <li><p><b>Associated Signs and Symptoms:</b></p> <p>{this.state.hpi.associatedSignsandSymptoms}</p></li> : ''}
                      </ul>
                    </Row></div> : <></>}</div> : <></>}
                {(this.state.history.pasthistory !== '' || this.state.history.familyhistory != '' || this.state.history.socialhistory != '' || this.state.history.smokinghistory != '') ? <div>
                  <h5>History</h5>
                  <Row className="previewHistory">
                    {this.state.history.pasthistory != '' ? <Col md={12} ><p className="ml-md-50"><b>Past Medical History:</b></p> <p>{this.state.history.pasthistory}</p></Col> : <></>}
                    {this.state.history.familyhistory != '' ? <Col md={12} > <p className="ml-md-50"><b>Family History:</b></p> <p>{this.state.history.familyhistory}</p></Col> : <></>}
                    {this.state.history.socialhistory != '' ? <Col md={12} > <p className="ml-md-50"><b>Social History:</b></p> <p>{this.state.history.socialhistory}</p></Col> : <></>}
                    {this.state.history.smokinghistory != '' ? <Col md={12} ><p className="ml-md-50"><b>Smoking History:</b></p> <p>{this.state.history.smokinghistory}</p></Col> : <></>}
                  </Row>
                </div> : <></>}
                {this.state.rosCount != 0 ? <div className="rosPreview">
                  <h5>Review of System</h5>
                  <Row>
                    <ul>
                      {this.state.ros.weightloss === true || this.state.ros.fevers === true || this.state.ros.chills === true || this.state.ros.nightsweats === true || this.state.ros.fatigue === true ?
                        <li><p><b>Constitutional:</b></p>
                          {Constitutional.map((Constitutionalview) => {
                            return (<p  key={Constitutionalview.id}> &nbsp;{
                              this.state.ros[Constitutionalview.title] === true ? Constitutionalview.label + ',' : ''}
                            </p>)
                          })}
                        </li> : <></>}
                      {this.state.ros.arthralgias === true || this.state.ros.myalgias === true || this.state.ros.muscleweakness === true
                        || this.state.ros.jointswelling === true || this.state.ros.nsaid === true ?
                        <li><p><b>Musculoskeletal:</b></p>
                          {Musculoskeletal.map((Musculoskeletalview) => {
                            return (<p key={Musculoskeletalview.id}> &nbsp;{
                              this.state.ros[Musculoskeletalview.title] === true ? Musculoskeletalview.label + ',' : ''}
                            </p>)
                          })}
                        </li> : <></>}
                      {this.state.ros.blurryVision === true || this.state.ros.eyepain === true || this.state.ros.discharge === true
                        || this.state.ros.dryeyes === true || this.state.ros.decreasedvision === true ?
                        <li><p><b >Eyes:</b></p>  {eyes.map((eyesview) => {
                          return (<p key={eyesview.id}> &nbsp;{
                            this.state.ros[eyesview.title] === true ? eyesview.label + ',' : ''}
                          </p>)
                        })}</li> : <></>}
                      {this.state.ros.sorethroat === true || this.state.ros.tinnitus === true || this.state.ros.bloodyNose === true
                        || this.state.ros.hearingLoss === true || this.state.ros.sinusitis === true ?
                        <li><p><b>ENT:</b></p>  {ent.map((entview) => {
                          return (<p  key={entview.id}> &nbsp;{
                            this.state.ros[entview.title] === true ? entview.label + ',' : ''}
                          </p>)
                        })}</li> : <></>}
                      {this.state.ros.shortofbreath === true || this.state.ros.cough === true || this.state.ros.hemoptysis === true
                        || this.state.ros.wheezing === true || this.state.ros.pleurisy === true ?
                        <li><p><b>Respiratory:</b></p>  {Respiratory.map((Respiratoryview) => {
                          return (<p key={Respiratoryview.id}> &nbsp;{
                            this.state.ros[Respiratoryview.title] === true ? Respiratoryview.label + ',' : ''}
                          </p>)
                        })}</li> : <></>}
                      {this.state.ros.chestpain === true || this.state.ros.pnd === true || this.state.ros.palpitations === true
                        || this.state.ros.edema === true || this.state.ros.orhtopnea === true || this.state.ros.syncpe === true ?
                        <li><p><b>Cardiovascular:</b></p>  {cardiovascular.map((cardiovascularview) => {
                          return (<p key={cardiovascularview.id}> &nbsp;{
                            this.state.ros[cardiovascularview.title] === true ? cardiovascularview.label + ',' : ''}
                          </p>)
                        })}</li> : <></>}
                      {this.state.ros.nausea === true || this.state.ros.vomiting === true || this.state.ros.diarrhea === true
                        || this.state.ros.hematemesis === true || this.state.ros.melena === true ?
                        <li><p><b>Gastrointestinal:</b></p>  {Gastrointestinal.map((Gastrointestinalview) => {
                          return (<p key={Gastrointestinalview.id}> &nbsp;{
                            this.state.ros[Gastrointestinalview.title] === true ? Gastrointestinalview.label + ',' : ''}
                          </p>)
                        })}</li> : <></>}
                      {this.state.ros.hematuria === true || this.state.ros.dysuria === true || this.state.ros.hesitancy === true
                        || this.state.ros.incontinence === true || this.state.ros.UTIs === true ?
                        <li><p><b>Genitourinary:</b></p>  {Genitourinary.map((Genitourinaryview) => {
                          return (<p key={Genitourinaryview.id}> &nbsp;{
                            this.state.ros[Genitourinaryview.title] === true ? Genitourinaryview.label + ',' : ''}
                          </p>)
                        })}</li> : <></>}
                      {this.state.ros.rash === true || this.state.ros.pruritis === true || this.state.ros.sores === true
                        || this.state.ros.nailchanges === true || this.state.ros.skinThickening === true ?
                        <li><p><b>Skin:</b></p>  {skin.map((skinview) => {
                          return (<p key={skinview.id}> &nbsp;{
                            this.state.ros[skinview.title] === true ? skinview.label + ',' : ''}
                          </p>)
                        })}</li> : <></>}
                      {this.state.ros.migraines === true || this.state.ros.numbness === true || this.state.ros.ataxia === true
                        || this.state.ros.tremors === true || this.state.ros.vertigo === true ?
                        <li><p><b>Neurological:</b></p>  {Neurological.map((Neurologicalview) => {
                          return (<p key={Neurologicalview.id}> &nbsp;{
                            this.state.ros[Neurologicalview.title] === true ? Neurologicalview.label + ',' : ''}
                          </p>)
                        })}</li> : <></>}
                      {this.state.ros.excessThirst === true || this.state.ros.polyuria === true || this.state.ros.coldintolerance === true
                        || this.state.ros.heatintolerance === true || this.state.ros.goiter === true ?
                        <li><p><b>Endocrine:</b></p>  {Endocrine.map((Endocrineview) => {
                          return (<p  key={Endocrineview.id}> &nbsp;{
                            this.state.ros[Endocrineview.title] === true ? Endocrineview.label + ',' : ''}
                          </p>)
                        })}</li> : <></>}
                      {this.state.ros.depression === true || this.state.ros.anxiety === true || this.state.ros.antiDepressants === true
                        || this.state.ros.alcoholAbuse === true || this.state.ros.drugAbuse === true || this.state.ros.insomnia === true ?
                        <li><p><b>Psychiatric:</b></p>  {Psychiatric.map((Psychiatricview) => {
                          return (<p> &nbsp;{
                            this.state.ros[Psychiatricview.title] === true ? Psychiatricview.label + ',' : ''}
                          </p>)
                        })}</li> : <></>}
                      {this.state.ros.easyBruising === true || this.state.ros.bleedingDiathesis === true || this.state.ros.lymphedema === true
                        || this.state.ros.bloodClots === true || this.state.ros.swollenGlands === true ?
                        <li><p><b>Hem/Lymphatic:</b></p>  {HemLymphatic.map((HemLymphaticview) => {
                          return (<p> &nbsp;{
                            this.state.ros[HemLymphaticview.title] === true ? HemLymphaticview.label + ',' : ''}
                          </p>)
                        })}</li> : <></>}
                      {this.state.ros.allergicrhinitis === true || this.state.ros.hayfever === true || this.state.ros.hives === true
                        || this.state.ros.asthma === true || this.state.ros.positivePPD === true ?
                        <li><p><b>Allergic/Immun:</b></p>  {Allergic.map((Allergicview) => {
                          return (<p> &nbsp;{
                            this.state.ros[Allergicview.title] === true ? Allergicview.label + ',' : ''}
                          </p>)
                        })}</li> : <></>}
                    </ul>
                  </Row></div> : <></>}
                {this.state.pEtotalCount != 0 ? <div className="rosPreview">
                  <h5>Physical Exam</h5>
                  <Row>
                    <ul className="mb-0">
                      {this.state.peConstitutionalCount != 0 ? <li><p><b>Constitutional: </b></p>
                        {peConstitutional.map((peConstitutionalview) => {
                          return (<p> &nbsp;{
                            this.state.peConstitutional[peConstitutionalview.title] === true ? peConstitutionalview.label + ',' : ''}
                          </p>)
                        })}
                      </li> : <></>}

                      {this.state.peENMTcount != 0 ? <li><p><b>ENMT:</b></p>
                        {peENMT.map((peENMTview) => {
                          return (<p> &nbsp;{
                            this.state.peENMT[peENMTview.title] === true ? peENMTview.label + ',' : ''}
                          </p>)
                        })}
                      </li> : <></>}

                      {this.state.peRespiratorycount != 0 ? <li><p><b>Respiratory:</b></p>
                        {peRespiratory.map((peRespiratoryview) => {
                          return (<p> &nbsp;{
                            this.state.peRespiratory[peRespiratoryview.title] === true ? peRespiratoryview.label + ',' : ''}
                          </p>)
                        })}
                      </li> : <></>}
                      {this.state.peCardiovascularcount != 0 ? <li><p><b>Cardiovascular:</b></p>
                        {peCardiovascular.map((peCardiovascularview) => {
                          return (<p> &nbsp;{
                            this.state.peCardiovascular[peCardiovascularview.title] === true ? peCardiovascularview.label + ',' : ''}
                          </p>)
                        })}
                      </li> : <></>}
                      {this.state.peGastrointestinalcount != 0 ? <li><p><b>Gastrointestinal:</b></p>
                        {peGastrointestinal.map((peGastrointestinalview) => {
                          return (<p> &nbsp;{
                            this.state.peGastrointestinal[peGastrointestinalview.title] === true ? peGastrointestinalview.label + ',' : ''}
                          </p>)
                        })}
                      </li> : <></>}
                      {this.state.peMusculoskeletalcount != 0 ? <li><p><b>Musculoskeletal:</b></p>
                        {peMusculoskeletal.map((peMusculoskeletalview) => {
                          return (<p> &nbsp;{
                            this.state.peMusculoskeletal[peMusculoskeletalview.title] === true ? peMusculoskeletalview.label + ',' : ''}
                          </p>)
                        })}
                      </li> : <></>}
                      {this.state.peSkincount != 0 ? <li><p><b>Skin:</b></p>
                        {peSkin.map((peSkinview) => {
                          return (<p> &nbsp;{
                            this.state.peSkin[peSkinview.title] === true ? peSkinview.label + ',' : ''}
                          </p>)
                        })}
                      </li> : <></>}
                      {this.state.peNeurologiccount != 0 ? <li><p><b>Neurologic:</b></p>
                        {peNeurologic.map((peNeurologicview) => {
                          return (<p> &nbsp;{
                            this.state.peNeurologic[peNeurologicview.title] === true ? peNeurologicview.label + ',' : ''}
                          </p>)
                        })}
                      </li> : <></>}
                      {this.state.pePsychiatriccount != 0 ? <li><p><b>Psychiatric:</b></p>
                        {pePsychiatric.map((pePsychiatricview) => {
                          return (<p> &nbsp;{
                            this.state.pePsychiatric[pePsychiatricview.title] === true ? pePsychiatricview.label + ',' : ''}
                          </p>)
                        })}
                      </li> : <></>}
                    </ul>
                  </Row></div> : <></>}
                {this.state.mdmResult != '' ? <div className="rosPreview dataReview mb-0">
                  <Row>
                    <ul>
                      <li><p><b>MDM:</b></p> <p>{this.state.mdmResult == 'SF' ? 'Minimal Risk' : this.state.mdmResult === 'low' ? 'Low Risk' : this.state.mdmResult === 'mod' ? 'Moderate Risk' : this.state.mdmResult === 'high' ? 'High Risk' : ''} </p></li>
                    </ul>
                  </Row></div> : <></>}
                {this.state.dataReviewed != '' ? <div className="rosPreview dataReview mb-0">
                  <Row>
                    <ul>
                      <li><p><b>Data Reviewed:</b></p>&nbsp;<p>{this.state.dataReviewed}</p></li>
                    </ul>
                    {this.state.datapointscount != 0 ?      <ul>
                   <li><p><b>Data points:</b></p>&nbsp;<p>{this.state.datapoints.option1 ===true ? 'Review and/or order labs (1)':''}</p>
                      <p>{this.state.datapoints.option2 ===true ? 'Discuss test with MD (1),':''}</p>
                      <p>{this.state.datapoints.option3 ===true ? 'Order old records (1),':''}</p>
                      <p>{this.state.datapoints.option4 ===true ? 'Review and/or order medical test (PFTs, EKG, echo, cath) (1),':''}</p>
                      <p>{this.state.datapoints.option5 ===true ? 'Review and/or order Xrays (1),':''}</p>
                      <p>{this.state.datapoints.option6 ===true ? 'Review any image, tracing, specimen (2),':''}</p>
                      <p>{this.state.datapoints.option7 ===true ? 'Summarize old records (2)':''}</p>
                      </li>
                    </ul> :''}

                  </Row></div> : <></>}
                {this.state.icdCode1 != '' || this.state.icdCode2 != '' || this.state.icdCode3 != '' || this.state.icdCode4 != '' ? <div className="rosPreview assessment">
                  <h5>Assessment and Plan</h5>
                  <Row>
                    <ul>
                      {this.state.icdCode1 !== '' ? <li><p><b>ICD Code 1:</b></p> <p>{this.state.icdCode1}: ({this.state.icd1monitor},{this.state.icd1evaluate},{this.state.icd1assess},{this.state.icd1treatment})   </p></li> : <></>}
                      {this.state.icdCode2 !== '' ? <li><p><b>ICD Code 2:</b></p> <p>{this.state.icdCode2}: ({this.state.icd2monitor},{this.state.icd2evaluate},{this.state.icd2assess},{this.state.icd2treatment})   </p></li> : <></>}
                      {this.state.icdCode3 !== '' ? <li><p><b>ICD Code 2:</b></p> <p>{this.state.icdCode3}: ({this.state.icd3monitor},{this.state.icd3evaluate},{this.state.icd3assess},{this.state.icd3treatment})   </p></li> : <></>}
                      {this.state.icdCode4 !== '' ? <li><p><b>ICD Code 2:</b></p> <p>{this.state.icdCode4}: ({this.state.icd4monitor},{this.state.icd4evaluate},{this.state.icd4assess},{this.state.icd4treatment})   </p></li> : <></>}
                      <li><p><b>CPT Code:</b></p> <p>{this.state.cptValue.value} </p></li>
                    </ul>
                  </Row></div> : <></>}
              </Col>

              {this.state.count != 0 || this.state.rosCount >= 1 || this.state.pEtotalCount === true || this.state.mdmResult != '' ?
                <Col md="12" className="patient-new-visit  minHeight">
                  <Row>
                    <Col md="12  " className="border " >                    <Row>

                      {this.state.count != 0 ? <Col className=" col-auto pr-md-0 pl-5px"> <Label className="d-inline-block px-0"><h6>HPI:</h6></Label>
                        {this.state.count >= 1 && this.state.count <= 3 ? <p className="mr-1 d-inline-block" >&nbsp; Brief</p> : <p className="mr-1 d-inline-block" >&nbsp; Extended</p>}</Col> : <></>}
                      {this.state.rosCount >= 1 ? <Col className="col-auto ">
                        <Label className="d-inline-block px-0"><h6>ROS:</h6></Label>
                        <p className="mr-1 d-inline-block" >&nbsp; {this.state.rosCount}</p></Col>
                        : <></>}
                      {this.state.count != 0 ? <Col className="col-auto">
                        <Label className="d-inline-block px-0 " for="history-level"><h6>History:</h6></Label>
                        <p className="mr-1 d-inline-block" >&nbsp; {this.state.historyStatus}</p>   </Col> : <></>}

                      {this.state.pEtotalCount === true ? <Col className="col-auto pr-md-0">
                        <Label className="d-inline-block px-0"><h6>PE:</h6></Label>
                        <p className="mr-1 d-inline-block" >&nbsp; {this.state.peStatus}</p>    </Col> : <></>}
                      {this.state.mdmResult != '' ? <Col className="col-auto ">
                        <Label className="d-inline-block px-0" for="mdm"><h6>MDM: </h6></Label>
                        <p className="mr-1 d-inline-block" >&nbsp; {this.state.mdmResult}</p>
                      </Col> : <></>}             </Row>
                    </Col>

                  </Row>
                </Col> : <></>}
              <Col md={12} className="text-right">
                <Button.Ripple
                  className="cursor-pointer btn-block mt-1"
                  color="danger"
                  size="md"
                  outline
                  onClick={this.setPatientModal}
                >
                  Close
                        </Button.Ripple>
              </Col>
            </ModalBody>

          </Modal>
          {/* </OTSession> */}
        </Container>
      </React.Fragment>
    );
  }
}

export default EstablishedForm;
