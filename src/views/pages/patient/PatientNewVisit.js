import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CustomInput,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form,

  Spinner
} from "reactstrap";
import SweetAlert from 'react-bootstrap-sweetalert';

import _ from 'lodash'
import * as Icon from "react-feather";
import Radio from "../../../components/@vuexy/radio/RadioVuexy"
import "react-toggle/style.css"
import Select from "react-select"
import moment from "moment"
import Swiper from "react-id-swiper"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import "swiper/css/swiper.css"
import "../../../assets/scss/plugins/extensions/swiper.scss"
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check, Info, X } from "react-feather"
import Chip from "../../../components/@vuexy/chips/ChipComponent"
import { ToastMessage } from "../../../components";
import { patientOptions, patientCheckboxChange, visitFormValidation, patientCpt, IdcInputs, patientPeStatus, patientHistoryStatus, patientVisitFormKeys, icdCount, patientCopyPreviousData } from "./PatientService";
import { visitForm, getAppointment, getIcdCodes } from "../../../redux/actions/patientActions";
import { internetSpeed, getOS,getBrowser, boolTOString } from "../../../components/Common";
import "@opentok/client";

import {
  getAppointmentToken,
  disconnectSession,
  disconnectAppointmentSession,
  sendVideoLogs
} from "../../../redux/actions/videoActions";
import { getLoggedInToken, getUserRole } from "../../../components/Auth";
import CaptureImg from "../../../assets/img/pages/capturing.jpg";

// import App from "./App";
import {
  OTSession,
  OTPublisher,
  OTStreams,
  OTSubscriber,
  createSession,
} from "opentok-react";
// import "./index.css";
import "./polyfills";


class PatientNewVisit extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      error: null,
      connection: "Connecting",
      publishVideo: true,
      publishAudio: true,
      subscriberVideo: true,
      forceDisconnet: false,
      streams: [],
      sessionId: null,
      token: null,
      sessionHelper: "",
      publisherName: "",
      subscriberName: "",
      hasVideoClosed: false,
      destroyed: false,
      waitingMsg: "",
      fullScreen: false,
      teleSrubsEmr: false,
      iFrameEmr: false,
      showWaitingMsg: true,
      collapse: 0,
      activeTab: "1",
      activeSubTab: "child-1",
      active: "1",
      activeSub: "child-2",
      information: 'Chief Complaint',
      modalShow: false,
      reviewSystem: 'Constitutional',
      tempReviewSystem: patientOptions.filterSearch[0],
      chiefcomplaint: '',
      hpi: { location: '', quality: '', timing: '', severity: '', duration: '', context: '', modifyingFactors: '', associatedSignsandSymptoms: '' },
      count: 0,
      roscount: 0,
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
      mdmResult: '',
      peConstitutional: {
        recordSigns: false, conversant: false
      },
      peConstitutionalcount: 0,
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
      icd: [],
      peStatus: '',
      historyStatus: '',
      pEtotalCount: false,
      cptValue: { value: '', label: '', },
      patientFormShow: false,
      datapoints: {
        option1: false, option2: false, option3: false, option4: false, option5: false, option6: false, option7: false
      },
      datapointscount: 0,
      errormdm: false,
      errorChief: false,
      errorPE: false,
      errors: {},
      patient: {},
      visitFormData: [],
      appointment: {},
      others: {
        musculoskeletalothers: '',
        constitutionalothers: '',
        eyesothers: '',
        entothers: '',
        respiratoryothers: '',
        cardiovascularothers: '',
        gastrointestinalothers: '',
        genitourinaryothers: '',
        skinothers: '',
        neurologicalothers: '',
        endocrineothers: '',
        pshychiatricothers: '',
        hemLymphaticothers: '',
        allergicothers: ''
      },
      peothers: {
        peconstitutionalothers: '',
        peenmtothers: '',
        perespiratoryothers: '',
        pecardiovascularothers: '',
        pegastrointestinalothers: '',
        pemusculoskeletalothers: '',
        peskinothers: '',
        peneurologicothers: '',
        pepsychiatricothers: ''
      },
      copyPrevious: {
        chief: false
      },
      icdCodes: [],
      paymentProcessing: false,
      showAuthorizationMsg: true,
      showHangUpControl: false,
      appointmentId: this.props.match.params.token,
      internetconnection: false,
      audioconnection: false,
      accessDenied: false,
      audioAccessDenied: false,
      videoAccessDenied: false,
      promptAccess: false,
      visitCount: 0,
      initState: {},
      infoSelected: patientOptions.dropOption[0],
      videoLogs:[],
      hasNoAudioVideo: false,
      hasAudioDenied:false,
      hasVideoRendered:false,
      hasVideoDenied:false
    };
    /*Video chat code */

    this.onSessionError = this.onSessionError.bind(this);

    this.sessionEventHandlers = {
      sessionConnected: () => {
        console.log(this.state);
        this.setState({ connection: "Connected" });
      },
      // sessionDisconnected: () => {
      //   console.log("session disconnected");
      //   this.setState({ connection: "Disconnected" });
      // },
      sessionReconnected: () => {
        console.log("session re connected");
        this.setState({ connection: "Reconnected" });
      },
      sessionReconnecting: () => {
        console.log("session re connecting");
        this.setState({ connection: "Reconnecting" });
      },
    };

    this.publisherEventHandlers = {
      accessDenied: () => {
        console.log(navigator);

        navigator.permissions.query({name: 'microphone'})
        .then((permissionObj) => {
          console.log(permissionObj.state);
          if(permissionObj.state == "denied"){
            this.setState({audioAccessDenied : true,hasAudioDenied:true});
          }
          if(permissionObj.state == "prompt"){
            this.setState({promptAccess : true,hasAudioDenied:true});
          }
        })
        .catch((error) => {
          console.log('Got error :', error);
        })

        navigator.permissions.query({name: 'camera'})
        .then((permissionObj) => {
          console.log(permissionObj.state);
          if(permissionObj.state == "denied"){
            this.setState({videoAccessDenied : true,hasVideoDenied:true});
          }
          if(permissionObj.state == "prompt"){
            this.setState({promptAccess : true,hasVideoDenied:true});
          }
        })
        .catch((error) => {
          console.log('Got error :', error);
        })


        this.setState({ accessDenied: true });


    },
      streamCreated: () => {
        console.log("Publisher stream created");
      },
        streamDestroyed: ({ reason }) => {
          // alert();
          console.log(`Publisher stream destroyed because: ${reason}`);
        },
    };
    var _this = this;
    this.subscriberEventHandlers = {
      videoEnabled: () => {
        console.log("Subscriber video enabled");
      },
      videoDisabled: () => {
        console.log("Subscriber video disabled");
      },
      disconnected: function () {
        // Display a user interface notification.
        console.log("Subscriber disconnected");
      },
      connected: function () {
        // Adjust user interface.
        console.log("Subscriber connected");
        _this.setState({
          waitingMsg: "",
        });
      },

      destroyed: function (event) {
        // event.preventDefault();
        console.log("Subscriber destroyed", event);
        _this.setWaitingMsg();
      },
    };
    /*Video chat code */

  }

  /**Video chat code */

  onSessionError = (error) => {
    console.log("onSessionError");
    this.setState({ error: `Failed to connect: ${error.message}` });
  }; 
  onPublish = () => {
     
    this.setState({hasVideoRendered:true});  
    internetSpeed((speed)=>{ 
      var message = `SID: ${this.props.match.params.token}, AVDS:${boolTOString(!this.state.hasNoAudioVideo)}, AA:${boolTOString(!this.state.hasAudioDenied)}, VA:${boolTOString(!this.state.hasVideoDenied)}, VR:${boolTOString(this.state.hasVideoRendered)}, Browser:${getBrowser()}, Speed:${parseInt(speed.speedInKbps)} Kbps, OS:${getOS()}`;
      this.props.sendVideoLogs({"browser":getBrowser(), isSendInvite: false,"OS":getOS(),"sessionId":this.props.match.params.token,"hasNoAudioVideo":this.state.hasNoAudioVideo,"hasAudioDenied":this.state.hasAudioDenied,"hasVideoDenied":this.state.hasVideoDenied,"hasVideoRendered":this.state.hasVideoRendered,isDoctor:this.isDoctor(),"speed":parseInt(speed.speedInKbps), message: message});
    });
    console.log("Publish Success");
  };

  onPublishError = (error) => {
    console.log("onPublishError");
    console.log(error);
    if (error.code == 1500) {
      this.setState({ audioconnection: true });
    }

    this.setState({ error: `Failed to connect: ${error.message}` });
    this.setState({ audioconnection: true, hasNoAudioVideo: true });
  };

  onSubscribe = () => {
    console.log("Subscribe Success");

  };

  onSubscribeError = (error) => {
    console.log("onSubscribeError");
    if (error.code == 1500) {
      this.setState({ audioconnection: true });
    }
    this.setState({ error: `Failed to connect: ${error.message}` });
  };

  toggleVideo = () => {
    this.setState((state) => ({
      publishVideo: !state.publishVideo,
    }));
  };

  toggleAudio = () => {
    this.setState((state) => ({
      publishAudio: !state.publishAudio,
    }));

    this.setState((state) => ({
      sessionDisconnect: !state.sessionDisconnect,
    }));
  };

  reSizeScreen = (value) => {
    this.state.fullScreen = value;
  };

  disconnect = () => {
    if (window.confirm("Do you want to disconnect the session?")) {
      if (!this.isDoctor()) {

        this.props.disconnectSession({
          sessionId: this.props.sessionDetails.data.sessionId,
          appointmentId: this.props.match.params.token
        });

        this.props.history.push(
          "/video/thankyou/" + this.props.sessionDetails.data.sessionId
        );
        // if (this.state.sessionHelper.session.connection != null) {
        //   this.state.sessionHelper.session.signal(
        //     {
        //       data: "disconnect",
        //     },
        //     function (error) {
        //       if (error) {
        //         console.log(
        //           "signal error (" + error.name + "): " + error.message
        //         );
        //       } else {
        //         console.log("signal sent.");
        //       }
        //     }
        //   );
        // }
      } else {
        this.setState({ "paymentProcessing": true });
        this.props.disconnectAppointmentSession({
          sessionId: this.props.sessionDetails.data.sessionId,
          authToken: this.props.match.params.token
        });
      }
      internetSpeed((speed)=>{ 
        
        var message = `SID: ${this.props.match.params.token}, AVDS:${boolTOString(!this.state.hasNoAudioVideo)}, AA:${boolTOString(!this.state.hasAudioDenied)}, VA:${boolTOString(!this.state.hasVideoDenied)}, VR:${boolTOString(this.state.hasVideoRendered)}, Browser:${getBrowser()}, Speed:${parseInt(speed.speedInKbps)} Kbps, OS:${getOS()}, Status: VS - End`;
        if(getLoggedInToken()){
          this.props.sendVideoLogs({"browser":getBrowser(),"OS":getOS(),"sessionId":this.props.match.params.token,"hasNoAudioVideo":this.state.hasNoAudioVideo,"hasAudioDenied":this.state.hasAudioDenied,"hasVideoDenied":this.state.hasVideoDenied,"hasVideoRendered":this.state.hasVideoRendered,isDoctor:this.isDoctor(),"speed":parseInt(speed.speedInKbps), message: message});
        }else{
          this.props.sendUnAuthVideoLogs({"browser":getBrowser(),"OS":getOS(),"sessionId":this.props.match.params.token,"hasNoAudioVideo":this.state.hasNoAudioVideo,"hasAudioDenied":this.state.hasAudioDenied,"hasVideoDenied":this.state.hasVideoDenied,"hasVideoRendered":this.state.hasVideoRendered,isDoctor:this.isDoctor(),"speed":parseInt(speed.speedInKbps), message: message});
        } 
      }); 

      // this.props.history.push(
      //   "/video/thankyou/" + this.props.sessionDetails.data.sessionId
      // );
    }
  };

  audioconnection = () => {
    this.setState({
      audioconnection: !this.state.audioconnection
    })
  }
  setWaitingMsg = () => {
    if (this.isDoctor()) {
      this.setState({
        waitingMsg: "Please wait until Patient connects the session",
      });
    } else {
      this.setState({
        waitingMsg: "Please wait until Doctor connects the session",
      });
    }
  };

  isDoctor = () => {
    return (getUserRole() == "admin") ? true : false;
  };

  /**Video chat code */

  formReset = () => {
    if (!_.isEmpty(this.state.visitFormData)) {
      this.props.getAppointment(this.props.match.params.token)
    } else {
      this.setState(this.state.initState)
    }

  }

  componentDidMount() {
    var postParams = { authToken: this.props.match.params.token, isDoctor: this.isDoctor() };
    this.props.getAppointmentToken(postParams);
    this.props.getAppointment(this.props.match.params.token)
    this.props.getIcdCodes();
    var icd = [];
    for (var i = 0; i < 4; i++) {
      icd.push({
        code: '',
        treatment: '',
        monitor: '',
        evaluate: '',
        assess: '',
        show: false
      })
    }
    this.setState({ icd: icd }, () => {
      this.setState({ initState: _.pick(this.state, patientVisitFormKeys) })
    })

    window.addEventListener('online', this.handleConnectionChange);
    window.addEventListener('offline', this.handleConnectionChange);

  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleConnectionChange);
    window.removeEventListener('offline', this.handleConnectionChange);
  }
  handleConnectionChange = () => {
    const condition = navigator.onLine ? 'online' : 'offline';
    if (condition === 'online') {
      const webPing = setInterval(
        () => {
          fetch('//google.com', {
            mode: 'no-cors',
          })
            .then(() => {
              this.setState({ internetconnection: false }, () => {
                return clearInterval(webPing)
              });
            }).catch(() => this.setState({ internetconnection: true }))
        }, 2000);
      return;
    }

    return this.setState({ internetconnection: true });
  }

  hideAVError = () => {
    this.setState({ audioconnection: false });
  }

  hidePromptAcess = () => {
    this.setState({ audioAccessDenied: false, videoAccessDenied: false });
  }

  promptAcess = () => {
    navigator.mediaDevices.getUserMedia(
      // constraints
      {
        video: true,
        audio: true
      }).then(stream => {
        this.setState({ promptAccess: false });
        window.location.reload()
      }).catch(e => {
        this.setState({ promptAccess: false });
        this.setState({ audioconnection: true });
        console.log(e.name + ": " + e.message)
      });


  }


  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.appointment.data != prevState.patient ||
      nextProps.icdCodes.data !== prevState.icdCodes
    ) {
      var deriveData = {};
      if (nextProps.appointment.status) {
        let appointment = nextProps.appointment.data[0];
        deriveData.appointment = appointment;
        deriveData.patient = [];
        deriveData.visitFormData = [];
        if (!_.isEmpty(appointment)) {
          deriveData.patient = (!_.isEmpty(appointment.patient)) ? appointment.patient[0] : [];
          if (!_.isEmpty(appointment.patient)) {
            deriveData.visitFormData = (!_.isEmpty(deriveData.appointment.visitForm)) ? deriveData.appointment.visitForm[0].visitFormData : []
            deriveData.visitFormData.information = "Chief Complaint"

            deriveData.visitCount = deriveData.appointment.visitFormList.length;
          }
        }
      }
      if (nextProps.icdCodes.status) {
        var codes = [];
        if (!_.isEmpty(nextProps.icdCodes.data)) {
          _.forEach(nextProps.icdCodes.data, (icd) => {
            codes.push({ value: icd.code, label: icd.code })
          })
        }
        deriveData.icdCodes = codes
      }
      return deriveData;
    }
    return null;
  }



  componentDidUpdate(prevProps, prevState) {
    if (this.props.appointment != prevProps.appointment) {
      if (this.props.appointment.status) {
        if (!_.isEmpty(this.state.visitFormData)) {
          this.setState(this.state.visitFormData, () => {
            console.log(this.state)
            this.setState({ infoSelected: patientOptions.dropOption[0] })
            this.peStatus();
            this.cptValue();
            this.historyStatus()
          })
        }
      }
    }

    if (prevProps.visit !== this.props.visit) {
      ToastMessage(this.props.visit)
      if (this.props.visit.status) {
        // this.props.history.push('/scheduling')
      }
    }

    if (this.props.sessionDetails !== prevProps.sessionDetails) {

      if (
        this.props.sessionDetails.key != undefined &&
        this.props.sessionDetails.key == "disconnect"
      ) {
        console.log("disconnect");
      } else {
        if (this.props.sessionDetails.status) {
          var sessionHelper = createSession({
            apiKey: "46761672",
            sessionId: this.props.sessionDetails.data.sessionId,
            token: this.props.sessionDetails.data.token,
            onStreamsUpdated: (streams) => {
              this.setState({ streams });
            },
            onStreamDestroyed: (streams) => {
              // alert();
            },
          });
          // this.props.sendWaitingNotificaiton(this.props.sessionDetails.data);
        } else {
          this.props.history.push("/video/expired-link");
          return false;
        }

        if (this.isDoctor()) {
          this.setState({
            publisherName: this.props.sessionDetails.data.doctorName,
          });
          if (this.props.sessionDetails.data.patientName != "") {
            this.setState({
              subscriberName: this.props.sessionDetails.data.patientName,
            });
          } else {
            this.setState({
              subscriberName: "Member",
            });
          }
          this.setWaitingMsg();
        } else {
          this.setState({
            subscriberName: this.props.sessionDetails.data.doctorName,
          });
          if (this.props.sessionDetails.data.patientName != "") {
            this.setState({
              publisherName: this.props.sessionDetails.data.patientName,
            });
          } else {
            this.setState({
              publisherName: "Member",
            });
          }
          this.setWaitingMsg();
        }

        if (this.props.sessionDetails.data.preferences != undefined) {
          if (this.props.sessionDetails.data.preferences.emrPreferenceId == 1) {
            this.setState({
              teleSrubsEmr: true,
            });
          } else if (
            this.props.sessionDetails.data.preferences.emrPreferenceId == 2
          ) {
            this.setState({
              teleSrubsEmr: false,
            });

            if (this.props.sessionDetails.data.preferences.iframeLink != "") {
              this.setState({
                iFrameEmr: true,
              });
            }
          }

          if (this.props.sessionDetails.data.preferences.hasSkipPayment) {
            this.state.showAuthorizationMsg = false;
          }
        }

        this.setState({
          sessionHelper: sessionHelper,
        });
        console.log(sessionHelper);
        var _this = this;
        if (sessionHelper != "") {

          sessionHelper.session.on("connectionCreated", function (event) {
            internetSpeed((speed)=>{  
              var message = `SID: ${_this.props.match.params.token}, AVDS:${boolTOString(!_this.state.hasNoAudioVideo)}, AA:${boolTOString(!_this.state.hasAudioDenied)}, VA:${boolTOString(!_this.state.hasVideoDenied)}, VR:${boolTOString(_this.state.hasVideoRendered)}, Browser:${getBrowser()}, Speed:${parseInt(speed.speedInKbps)} Kbps, OS:${getOS()}`;
              _this.props.sendVideoLogs({"browser":getBrowser(),isSendInvite: false, "OS":getOS(),"sessionId":_this.props.match.params.token,"hasNoAudioVideo":_this.state.hasNoAudioVideo,"hasAudioDenied":_this.state.hasAudioDenied,"hasVideoDenied":_this.state.hasVideoDenied,"hasVideoRendered":_this.state.hasVideoRendered,isDoctor:_this.isDoctor(),"speed":parseInt(speed.speedInKbps), message: message});
            });

            if (_this.isDoctor()) {
              console.log("*****patient connected*****");

            } else {
              // _this.setState({ showWaitingMsg: false })
              // _this.state.audio.play();
              console.log("*****Doctor connected*****");

            }
            _this.setState({ showHangUpControl: true })
          });
        }

        if (sessionHelper != "") {
          sessionHelper.session.on("streamDestroyed", function (event) {
            event.preventDefault();

            console.log("stream destroyed---->>", event);
          });

          var _props = this.props;
          sessionHelper.session.on("signal", function (event) {
            if (_this.isDoctor()) {
              _props.history.push(
                "/scheduling"
              );
            } else {
              _props.history.push(
                "/video/thankyou/" + _props.sessionDetails.data.sessionId
              );
            }

          });
        }
      }
    }


    if (this.props.disconnectData !== prevProps.disconnectData) {
      // if (this.props.disconnectData.status) {
      this.setState({ paymentProcessing: false });
      if (this.state.sessionHelper.session.connection != null) {
        this.state.sessionHelper.session.signal(
          {
            data: "disconnect",
          },
          function (error) {
            if (error) {
              console.log(
                "signal error (" + error.name + "): " + error.message
              );
            } else {
              console.log("signal sent.");
            }
          }
        );
      }

      // }

    }


  }

  othersChangeblurAction = (e) => {
    let others = this.state.others
    others[e.target.name] = e.target.value.replace(/\s\s+/g, ' ').trim()
    this.setState({
      others: others
    })
  }

  othersChange = (e) => {
    let others = this.state.others
    others[e.target.name] = e.target.value
    this.setState({
      others: others
    })
  }
  peothersblurAction = (e) => {
    let peothers = this.state.peothers
    peothers[e.target.name] = e.target.value.replace(/\s\s+/g, ' ').trim()
    this.setState({
      peothers: peothers
    })
  }
  peothersChange = (e) => {
    let peothers = this.state.peothers
    peothers[e.target.name] = e.target.value
    this.setState({
      peothers: peothers
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
        }, () => { this.peStatus(); this.cptValue(); this.historyStatus(); })
      }
    });
  }
  blurradioAction = e => {
    console.log(e.target.value)
    this.setState({
      [e.target.name]: e.target.value.replace(/\s\s+/g, ' ').trim(),
    })
  }
  radioChange = e => {
    let errors = { ...this.state.errors }
    errors = _.omit(errors, e.target.name)

    this.setState({
      [e.target.name]: e.target.value,
      errors
    }, () => {
      this.peStatus(); this.cptValue(); this.historyStatus()
    })
  }

  checkboxChange = (e, state) => {
    let extState = { ...this.state[state] };
    patientCheckboxChange(e, extState, (resState, count) => {
      this.setState({
        [state]: resState,
        [`${state}count`]: count,

      }, () => { this.peStatus(); this.cptValue(); this.historyStatus() })
    })
  }
  blurAction = e => {
    var hpi = { ...this.state.hpi }
    hpi[e.target.name] = e.target.value.replace(/\s\s+/g, ' ').trim()
    this.setState({ hpi })
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
          count: count,
          errorChief: true
        }, () => {
          this.peStatus();
          this.cptValue();
          this.historyStatus()
        })
      }

    })
  }
  blurHistoryAction = e => {
    var history = { ...this.state.history }
    history[e.target.name] = e.target.value.replace(/\s\s+/g, ' ').trim()
    this.setState({ history })
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

  cptValue = () => {

    this.setState({
      cptValue: patientCpt(this.state)
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
  toggle = tab => {
    if (this.state.active !== tab) {
      this.setState({ active: tab })
    }
  }

  handlechange = (selectedOption) => {
    this.setState({
      information: selectedOption.value,
      infoSelected: selectedOption,
      reviewSystem: 'Constitutional'
    })
  }
  icdChange = (selected, i) => {
    _.forEach(this.state.icd, (icd, k) => {
      this.setState(prevState => {
        const icd = [...prevState.icd];
        icd[k] = { ...icd[k], show: false };
        if (k === i) {
          icd[i] = { ...icd[i], ['code']: selected.value };
          icd[i] = { ...icd[i], show: true };
        }
        return { icd };
      });
    })
  }

  icdInputBlur = (e, i) => {
    const { name, value } = e.target;
    this.setState(prevState => {
      const icd = [...prevState.icd];
      icd[i] = { ...icd[i], [name]: value.replace(/\s\s+/g, ' ').trim() };
      return { icd };
    });
  }

  icdInputUpdate = (e, i) => {
    const { name, value } = e.target;
    this.setState(prevState => {
      const icd = [...prevState.icd];
      icd[i] = { ...icd[i], [name]: value };
      return { icd };
    });
  }

  reviewchange = (selectedOption) => {
    this.setState({
      reviewSystem: selectedOption.value,
      tempReviewSystem: selectedOption
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
    this.setState(patientPeStatus({ ...this.state }))
  }

  historyStatus = () => {
    this.setState(patientHistoryStatus({ ...this.state }))
  }

  copyPreviousData = (type) => {

    let visitFormData = this.state.visitFormData[(this.state.visitFormData.length - 1)];
    let copyPrevious = { ...this.state.copyPrevious }
    copyPrevious[type] = !copyPrevious[type];
    console.log(copyPrevious[type])
    this.setState({
      chiefcomplaint: visitFormData.chiefcomplaint,
      hpi: visitFormData.hpi,
      copyPrevious
    })
  }

  visitFormSubmit = (e) => {
    e.preventDefault()
    let errors = visitFormValidation(this.state);
    console.log(errors)
    if (_.isEmpty(errors)) {
      this.setState({ errors: {} })
      var clone = _.clone(this.state);

      this.props.visitForm(this.state.patient._id, _.pick(clone, patientVisitFormKeys))
    } else {
      this.setState({ errors: errors })
    }
  }

  render() {
    const { information, errors, patient, appointment, visitFormData, icdCodes,
      error,
      connection,
      publishVideo,
      publishAudio,
      subscriberVideo, visitCount } = this.state;
    console.log(information)
    return (
      <React.Fragment>
        {this.state.sessionHelper != "" ? (
          <div className={`${this.isDoctor() ? "doctor-screen" : "patient-screen"}`}>
            <Container
              fluid={true}
              className={`video-chat-wrap ${
                this.isDoctor() ?
                  this.state.fullScreen ? "max-scale" : "" : "max-scale"
                }`}
            // className={`video-chat-wrap max-scale`}
            >
              {/* <OTSession
            apiKey={apiKey}
            sessionId={sessionId}
            token={token}
            onError={this.onSessionError}
            eventHandlers={this.sessionEventHandlers}
          > */}
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
                        <CardBody className="bg-black user-bg">
                          <div className="watermark"></div>
                          {this.state.waitingMsg != "" ?
                            !this.isDoctor() ?
                              (<div className="payment-info">
                                {this.state.showAuthorizationMsg ? (
                                  <h3>Payment Authorization Successful</h3>
                                ) : null}
                                <h4>Please Wait for the doctor to join</h4>
                              </div>
                              ) : null : null}

                          <div className="pos-rt maxmin-icon">
                            <div
                              className="fonticon-wrap cursor-pointer maximize-icon"
                              onClick={(e) => {
                                this.setState({ fullScreen: true });
                              }}
                            >
                              <Icon.Maximize
                                size={18}
                                className="fonticon-wrap"
                              />
                            </div>
                            <div
                              className="fonticon-wrap cursor-pointer minimize-icon"
                              onClick={(e) => {
                                this.setState({ fullScreen: false });
                              }}
                            >
                              <Icon.Minimize
                                size={18}
                                className="fonticon-wrap"
                              />
                            </div>
                          </div>
                          <div className="subscriber-name">
                            {/* {this.state.waitingMsg != ""
                              ? this.state.waitingMsg
                              : this.state.subscriberName} */}
                            {this.state.subscriberName}
                          </div>

                          {this.state.streams.map((stream) => {
                            return (
                              <OTSubscriber
                                properties={{
                                  width: "100%",
                                  height: "100%",
                                  style: { buttonDisplayMode: "off" },
                                  // name: this.state.subscriberName,
                                }}
                                key={stream.id}
                                session={this.state.sessionHelper.session}
                                onSubscribe={this.onSubscribe}
                                onError={this.onSubscribeError}
                                eventHandlers={this.subscriberEventHandlers}
                                stream={stream}
                              ></OTSubscriber>
                            );
                          })}

                          {this.state.waitingMsg != "" ?
                            !this.isDoctor() ?

                              (<div className="cancel-televisit">
                                <Button.Ripple
                                  color="primary"
                                  className="square"
                                  onClick={this.disconnect}
                                >
                                  Cancel TeleVisit
                          </Button.Ripple>
                              </div>
                              ) : null : null}

                        </CardBody>
                      </Card>
                    </Col>

                    <Col
                      md="6"
                      lg="12"
                      xl="12"
                      className={`doc-mini-scale ${
                        this.state.hasVideoClosed ? "add-video" : ""
                        }`}
                      id="subscribers"
                    >
                      <Card>
                        <CardBody className="bg-black user-bg">
                          {this.state.showHangUpControl ? (
                            <div className="video-controls">
                              <Button
                                color="primary"
                                className="btn-icon rounded-circle mr-1"
                                onClick={this.toggleAudio}
                              >
                                {publishAudio ? (
                                  <div className="fonticon-wrap">
                                    <Icon.Mic size={14} className="fonticon-wrap" />
                                  </div>
                                ) : (
                                    <div className="fonticon-wrap">
                                      <Icon.MicOff
                                        size={14}
                                        className="fonticon-wrap"
                                      />
                                    </div>
                                  )}
                              </Button>
                              <Button
                                color="primary"
                                className="btn-icon rounded-circle mr-1 eye-btn"
                                onClick={() => {
                                  this.setState({ hasVideoClosed: false });
                                }}
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
                                {publishVideo ? (
                                  <div className="fonticon-wrap">
                                    <Icon.Video
                                      size={14}
                                      className="fonticon-wrap"
                                    />
                                  </div>
                                ) : (
                                    <div className="fonticon-wrap">
                                      <Icon.VideoOff
                                        size={14}
                                        className="fonticon-wrap"
                                      />
                                    </div>
                                  )}
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
                          ) : null}

                          <div className="fonticon-wrap cursor-pointer pos-rt">
                            <Icon.X
                              size={18}
                              className="fonticon-wrap"
                              onClick={() => {
                                this.setState({ hasVideoClosed: true });
                              }}
                            />
                          </div>
                          {!this.state.hasVideoClosed ? (
                            <div className="publisher-name">
                              {this.state.publisherName}
                              {/* Joseph Franklin */}
                            </div>
                          ) : null}
                          <OTPublisher
                            properties={{
                              width: "100%",
                              height: "100%",
                              style: { buttonDisplayMode: "off" },
                              publishVideo,
                              publishAudio,
                              // name: this.state.publisherName,
                            }}
                            session={this.state.sessionHelper.session}
                            onPublish={this.onPublish}
                            onError={this.onPublishError}
                            eventHandlers={this.publisherEventHandlers}
                          ></OTPublisher>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Col>
                {this.isDoctor() ? (
                  <Col md="12" lg="8" xl="8" className="doc-video-form patient-new-visit">
                    {this.state.teleSrubsEmr ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="w-100">
                            <Row>
                              <Col md="5">{visitCount >= 2 ? "Established Visit Form Information" : "Patient New Visit Form Information"}</Col>
                              <Col md="7" className="pl-0 text-right">
                                <ul className="patient-detail">
                                  <li>{_.toUpper(patient.lastName)}, {_.toUpper(patient.firstName)}</li>
                                  <li>DOB: {moment(patient.dateOfBirth).format('DD/MM/YYYY')}</li>
                                  <li>DoS: {moment().format('DD/MM/YYYY')}</li>
                                </ul>
                              </Col>
                            </Row>
                          </CardTitle>
                        </CardHeader>
                        <CardBody>
                          <Form type="post" onSubmit={this.visitFormSubmit}>
                            <div className="border pb-0 floating-input">
                              <Row>
                                <Col md="4 mb-1" >
                                  <Select
                                    className={`React basic-single ${information ? "bg-active" : null}`}
                                    classNamePrefix="select"
                                    value={this.state.infoSelected}
                                    name="dropOption"
                                    options={patientOptions.dropOption}
                                    onChange={this.handlechange}
                                  />
                                </Col>
                                {/* <Col md="4" >
                                  {information == "Review of Systems" || information == "Physical Exam" ? <Select
                                    className={`React basic-single ${
                                      information != '' ? "bg-active" : ''
                                      }`}
                                    classNamePrefix="select"
                                    value={this.state.tempReviewSystem}
                                    name="ros"
                                    options={information == "Review of Systems" ? patientOptions.filterSearch : information == "Physical Exam" ? patientOptions.peSelect : ''}
                                    onChange={this.reviewchange}
                                  /> : <></>}
                                </Col>
                                <Col md="1" className='col-4 pl-50 pr-0 '>      
                                {information == "Review of Systems" || information == "Physical Exam" ?
                                    <div className="position-relative">
                                          <div className="swiper-button-prev  mr-5px primary" onClick={() => { this.swiper(false) }}></div>	
                                      <div className="swiper-button-next  mr-5px primary" onClick={() => { this.swiper(true) }}></div>    </div>
                                    : <></>}
                                </Col> */}
                                {/*<Col md="3" className='mt-75'>
                          {this.state.information === 'Chief Complaint' ? <CustomInput
                            type="switch" className="mr-0"
                            inline
                            id='fetchief'
                            name="fetchChief"
                            checked={this.state.copyPrevious.chief ? true : false}
                            onChange={()=>{this.copyPreviousData('chief')}}
                          >
                            <span className="switch-label">Copy Previous Data</span>
                          </CustomInput> : <></>}
                          {this.state.information === 'Review of Systems' ? <CustomInput
                            type="switch" className="mr-0"
                            inline
                            id='fetchros'
                            name="fetchros"
                            checked={this.state.fetchros == false ? false : true}
                            onChange={this.fetchros}
                          >
                            <span className="switch-label">Copy Previous Data</span>
                          </CustomInput> : <></>}
                          {this.state.selectchange === 'Data Reviewed' ? <CustomInput
                            type="switch" className="mr-0"
                            inline
                            id='fetchDatareviewed'
                            name="fetchDatareviewed"
                            checked={this.state.fetchDatareviewed == false ? false : true}
                            onChange={this.fetchDatareviewed}
                          >
                            <span className="switch-label">Copy Previous Data</span>
                          </CustomInput> : <></>}
                          {this.state.selectchange === 'History' ? <CustomInput
                            type="switch" className="mr-0"
                            inline
                            id='fetchHistory'
                            name="fetchHistory"
                            checked={this.state.fetchHistory == false ? false : true}
                            onChange={this.fetchHistory}
                          >
                            <span className="switch-label">Copy Previous Data</span>
                          </CustomInput> : <></>}
                          {this.state.selectchange === 'Physical Exam' ? <CustomInput
                            type="switch" className="mr-0"
                            inline
                            id='fetchPE'
                            name="fetchPE"
                            checked={this.state.fetchPE == false ? false : true}
                            onChange={this.fetchPE}
                          >
                            <span className="switch-label">Copy Previous Data</span>
                          </CustomInput> : <></>}
                          {this.state.selectchange === 'MDM' ? <CustomInput
                            type="switch" className="mr-0"
                            inline
                            id='fetchmdm'
                            name="fetchmdm"
                            checked={this.state.fetchmdm == false ? false : true}
                            onChange={this.fetchmdm}
                          >
                            <span className="switch-label">Copy Previous Data</span>
                          </CustomInput> : <></>}
                          {this.state.selectchange === 'Assessment and Plan' ? <CustomInput
                            type="switch" className="mr-0"
                            inline
                            id='fetchAssessment'
                            name="fetchAssessment"
                            checked={this.state.fetchAssessment == false ? false : true}
                            onChange={this.fetchAssessment}
                          >
                            <span className="switch-label">Copy Previous Data</span>
                          </CustomInput> : <></>}
                            </Col>*/}
                              </Row>
                              {/* HPI */}

                              {information == "Chief Complaint" ? <Row>
                                <Col md={6}>
                                  <FormGroup className="form-label-group  mb-50">
                                    <Input
                                      type="text"
                                      placeholder="Chief Complaint"
                                      name="chiefcomplaint"
                                      onChange={this.radioChange}
                                      onBlur={this.blurradioAction}
                                      value={this.state.chiefcomplaint}
                                      autoFocus
                                      className={`form-control ${errors.chiefcomplaint ? 'is-invalid' : ''}`}
                                    />
                                    <label htmlFor="chiefcomplaint">Chief Complaint </label>
                                    <div className='invalid-tooltip mt-25'>{(errors.chiefcomplaint) ? errors.chiefcomplaint : ''}</div>
                                  </FormGroup></Col>
                                <Col md={12}>
                                  <h2 className=" title">HPI Elements</h2>
                                </Col>                  <Col md={6}>
                                  <FormGroup className="form-label-group ">
                                    <Input
                                      type="text"
                                      className="form-control"
                                      placeholder="Location"
                                      name="location"
                                      onChange={this.inputChange}
                                      value={this.state.hpi.location}
                                      onBlur={
                                        this.blurAction
                                      }
                                      //  className={`form-control is-invalid`}
                                      className={`form-control`}
                                    />
                                    <label htmlFor="Location">Location</label>

                                  </FormGroup>
                                </Col>
                                <Col md={6}>
                                  <FormGroup className="form-label-group  ">
                                    <Input
                                      type="text"
                                      className="form-control"
                                      onFocus={this.activateField}
                                      onChange={this.inputChange}
                                      value={this.state.hpi.quality}
                                      name="quality"
                                      placeholder="Quality"
                                      className="form-control"
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
                                  <FormGroup className="form-label-group">
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
                              {information == "Review of Systems" ?
                                <div>
                                  <div className="border pt-25">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Constitutional</h2>
                                          <Row>
                                            <Col md="3" className="mr-0 mt-50">
                                              <CustomInput
                                                type="switch" className="mr-0"
                                                id="weightloss"
                                                inline
                                                name="weightloss"
                                                checked={this.state.ros.weightloss == false ? false : true}
                                                onChange={(e) => {
                                                  this.checkboxChange(e, 'ros')
                                                }}
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
                                                onChange={(e) => {
                                                  this.checkboxChange(e, 'ros')
                                                }}
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
                                                onChange={(e) => {
                                                  this.checkboxChange(e, 'ros')
                                                }}
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
                                                onChange={(e) => {
                                                  this.checkboxChange(e, 'ros')
                                                }}
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
                                                onChange={(e) => {
                                                  this.checkboxChange(e, 'ros')
                                                }}
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
                                                  name="constitutionalothers"
                                                  onChange={this.othersChange}
                                                  onBlur={this.othersChangeblurAction}
                                                  value={this.state.others.constitutionalothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>

                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border  pt-25">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Musculoskeletal</h2>
                                          <Row>
                                            {patientOptions.Musculoskeletal.map((MusculoskeletalList) => {
                                              return (<Col md="3" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={MusculoskeletalList.title}
                                                  name={MusculoskeletalList.title}
                                                  inline
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'ros')
                                                  }}
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
                                                  name="musculoskeletalothers"
                                                  onChange={this.othersChange}
                                                  onBlur={this.othersChangeblurAction}

                                                  value={this.state.others.musculoskeletalothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border pt-25">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Eyes</h2>
                                          <Row>
                                            {patientOptions.eyes.map((eyeslist) => {
                                              return (<Col md="3" className="mr-0 mt-50" key={eyeslist.id}>
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={eyeslist.title}
                                                  name={eyeslist.title}
                                                  inline
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'ros')
                                                  }}
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
                                                  name="eyesothers"
                                                  onChange={this.othersChange}
                                                  onBlur={this.othersChangeblurAction}

                                                  value={this.state.others.eyesothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border  pt-25">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">ENT</h2>
                                          <Row>
                                            {patientOptions.ent.map((entList) => {
                                              return (<Col md="3" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={entList.title}
                                                  name={entList.title}
                                                  inline
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'ros')
                                                  }}
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
                                                  name="entothers"
                                                  onChange={this.othersChange}
                                                  onBlur={this.othersChangeblurAction}

                                                  value={this.state.others.entothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="border pt-25">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Respiratory</h2>
                                          <Row>
                                            {patientOptions.Respiratory.map((Respiratorylist) => {
                                              return (<Col md="3" className="mr-0 mt-50" key={Respiratorylist.id}>
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={Respiratorylist.title}
                                                  name={Respiratorylist.title}
                                                  inline
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'ros')
                                                  }}
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
                                                  name="respiratoryothers"
                                                  onChange={this.othersChange}
                                                  onBlur={this.othersChangeblurAction}

                                                  value={this.state.others.respiratoryothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border pt-25">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Cardiovascular</h2>
                                          <Row>
                                            {patientOptions.cardiovascular.map((cardiovascularlist) => {
                                              return (<Col md="3" className="mr-0 mt-50" key={cardiovascularlist.id}>
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={cardiovascularlist.title}
                                                  name={cardiovascularlist.title}
                                                  inline
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'ros')
                                                  }}
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
                                                  name="cardiovascularothers"
                                                  onChange={this.othersChange}
                                                  onBlur={this.othersChangeblurAction}

                                                  value={this.state.others.cardiovascularothers}

                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border  pt-25">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Gastrointestinal</h2>
                                          <Row>
                                            {patientOptions.Gastrointestinal.map((GastrointestinalList) => {
                                              return (<Col md="3" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={GastrointestinalList.title}
                                                  name={GastrointestinalList.title}
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'ros')
                                                  }}
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
                                                  name="gastrointestinalothers"
                                                  onChange={this.othersChange}
                                                  onBlur={this.othersChangeblurAction}
                                                  value={this.state.others.gastrointestinalothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border  pt-25">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Genitourinary</h2>
                                          <Row>
                                            {patientOptions.Genitourinary.map((GenitourinaryList) => {
                                              return (<Col md="3" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={GenitourinaryList.title}
                                                  name={GenitourinaryList.title}
                                                  inline
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'ros')
                                                  }}
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
                                                  name="genitourinaryothers"
                                                  onChange={this.othersChange}
                                                  onBlur={this.othersChangeblurAction}

                                                  value={this.state.others.genitourinaryothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border  pt-25">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Skin</h2>
                                          <Row>
                                            {patientOptions.skin.map((skinList) => {
                                              return (<Col md="3" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={skinList.title}
                                                  name={skinList.title}
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'ros')
                                                  }}
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
                                                  name="skinothers"
                                                  onChange={this.othersChange}
                                                  onBlur={this.othersChangeblurAction}

                                                  value={this.state.others.skinothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="border  pt-25">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Neurological</h2>
                                          <Row>
                                            {patientOptions.Neurological.map((NeurologicalList) => {
                                              return (<Col md="3" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={NeurologicalList.title}
                                                  name={NeurologicalList.title}
                                                  inline
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'ros')
                                                  }}
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
                                                  name="neurologicalothers"
                                                  onChange={this.othersChange}
                                                  onBlur={this.othersChangeblurAction}

                                                  value={this.state.others.neurologicalothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border  pt-25">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Endocrine</h2>
                                          <Row>
                                            {patientOptions.Endocrine.map((EndocrineList) => {
                                              return (<Col md="3" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={EndocrineList.title}
                                                  name={EndocrineList.title}
                                                  inline
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'ros')
                                                  }}
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
                                                  name="endocrineothers"
                                                  onChange={this.othersChange}
                                                  onBlur={this.othersChangeblurAction}

                                                  value={this.state.others.endocrineothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border  pt-25">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Psychiatric</h2>
                                          <Row>
                                            {patientOptions.Psychiatric.map((PsychiatricList) => {
                                              return (<Col md="3" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={PsychiatricList.title}
                                                  name={PsychiatricList.title}
                                                  inline
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'ros')
                                                  }}
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
                                                  name="pshychiatricothers"
                                                  onChange={this.othersChange}
                                                  onBlur={this.othersChangeblurAction}
                                                  value={this.state.others.pshychiatricothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border  pt-25">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Hem/Lymphatic</h2>
                                          <Row>
                                            {patientOptions.HemLymphatic.map((HemLymphaticList) => {
                                              return (<Col md="3" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={HemLymphaticList.title}
                                                  name={HemLymphaticList.title}
                                                  inline
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'ros')
                                                  }}
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
                                                  name="hemLymphaticothers"
                                                  onChange={this.othersChange}
                                                  onBlur={this.othersChangeblurAction}

                                                  value={this.state.others.hemLymphaticothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border pt-25">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Allergic/Immun</h2>
                                          <Row>
                                            {patientOptions.Allergic.map((allergiclist) => {
                                              return (<Col md="3" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={allergiclist.title}
                                                  name={allergiclist.title}
                                                  inline
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'ros')
                                                  }}
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
                                                  name="allergicothers"
                                                  value={this.state.others.allergicothers}
                                                  onChange={this.othersChange}
                                                  onBlur={this.othersChangeblurAction}

                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div> </div> : <></>}
                              {information == "Physical Exam" ?
                                <div>
                                  <div className="border py-50">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Constitutional</h2>
                                          <Row>
                                            {patientOptions.peConstitutional.map((peConstitutionallist, k) => {
                                              return (<Col key={k} md="4" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={peConstitutionallist.title}
                                                  name={peConstitutionallist.title}
                                                  inline
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'peConstitutional')
                                                  }}
                                                  checked={this.state.peConstitutional[peConstitutionallist.title] == false ? false : true}
                                                >
                                                  <span className="switch-label">{peConstitutionallist.label} </span>
                                                </CustomInput>
                                              </Col>)
                                            })}
                                            <Col md="12" className="mr-0 mt-1">
                                              <FormGroup className="mb-0 form-label-group">
                                                <Input
                                                  type="text"
                                                  placeholder="Others"
                                                  name="peconstitutionalothers"
                                                  onChange={this.peothersChange}
                                                  onBlur={this.peothersblurAction}
                                                  value={this.state.peothers.peconstitutionalothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border py-50">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">HEENT</h2>
                                          <Row>
                                            {patientOptions.peENMT.map((peENMTlist) => {
                                              return (<Col md="4" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={peENMTlist.title}
                                                  name={peENMTlist.title}
                                                  inline
                                                  checked={this.state.peENMT[peENMTlist.title] == false ? false : true}
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'peENMT')
                                                  }}
                                                // onChange={this.haiChange}

                                                >
                                                  <span className="switch-label">{peENMTlist.label} </span>
                                                </CustomInput>
                                              </Col>)
                                            })}
                                            <Col md="12" className="mr-0 mt-1">
                                              <FormGroup className="mb-0 form-label-group">
                                                <Input
                                                  type="text"
                                                  placeholder="Others"
                                                  name="peenmtothers"
                                                  onChange={this.peothersChange}
                                                  onBlur={this.peothersblurAction}
                                                  value={this.state.peothers.peenmtothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border py-50">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Respiratory</h2>
                                          <Row>
                                            {patientOptions.peRespiratory.map((peRespiratorylist) => {
                                              return (<Col md="4" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={peRespiratorylist.title}
                                                  name={peRespiratorylist.title}
                                                  inline
                                                  checked={this.state.peRespiratory[peRespiratorylist.title] == false ? false : true}
                                                  onChange={(e) => {
                                                    this.checkboxChange(e, 'peRespiratory')
                                                  }}
                                                >
                                                  <span className="switch-label">{peRespiratorylist.label} </span>
                                                </CustomInput>
                                              </Col>)
                                            })}
                                            <Col md="12" className="mr-0 mt-1">
                                              <FormGroup className="mb-0 form-label-group">
                                                <Input
                                                  type="text"
                                                  placeholder="Others"
                                                  name="perespiratoryothers"
                                                  onChange={this.peothersChange}
                                                  onBlur={this.peothersblurAction}
                                                  value={this.state.peothers.perespiratoryothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border py-50">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Cardiovascular</h2>
                                          <Row>
                                            {patientOptions.peCardiovascular.map((peCardiovascularlist) => {
                                              return (<Col md="4" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={peCardiovascularlist.title}
                                                  name={peCardiovascularlist.title}
                                                  inline
                                                  checked={this.state.peCardiovascular[peCardiovascularlist.title] == false ? false : true}
                                                  onChange={(e) => { this.checkboxChange(e, 'peCardiovascular') }}
                                                >
                                                  <span className="switch-label">{peCardiovascularlist.label} </span>
                                                </CustomInput>
                                              </Col>)
                                            })}
                                            <Col md="12" className="mr-0 mt-1">
                                              <FormGroup className="mb-0 form-label-group">
                                                <Input
                                                  type="text"
                                                  placeholder="Others"
                                                  name="pecardiovascularothers"
                                                  onChange={this.peothersChange}
                                                  onBlur={this.peothersblurAction}
                                                  value={this.state.peothers.pecardiovascularothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border py-50">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Gastrointestinal</h2>
                                          <Row>
                                            {patientOptions.peGastrointestinal.map((peGastrointestinallist) => {
                                              return (<Col md="4" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={peGastrointestinallist.title}
                                                  name={peGastrointestinallist.title}
                                                  inline
                                                  checked={this.state.peGastrointestinal[peGastrointestinallist.title] == false ? false : true}
                                                  onChange={(e) => { this.checkboxChange(e, 'peGastrointestinal') }}
                                                >
                                                  <span className="switch-label">{peGastrointestinallist.label} </span>
                                                </CustomInput>
                                              </Col>)
                                            })}
                                            <Col md="12" className="mr-0 mt-1">
                                              <FormGroup className="mb-0 form-label-group">
                                                <Input
                                                  type="text"
                                                  placeholder="Others"
                                                  name="pegastrointestinalothers"
                                                  onChange={this.peothersChange}
                                                  onBlur={this.peothersblurAction}
                                                  value={this.state.peothers.pegastrointestinalothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border py-50">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Musculoskeletal</h2>
                                          <Row>
                                            {patientOptions.peMusculoskeletal.map((peMusculoskeletallist) => {
                                              return (<Col md="4" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={peMusculoskeletallist.title}
                                                  name={peMusculoskeletallist.title}
                                                  inline
                                                  checked={this.state.peMusculoskeletal[peMusculoskeletallist.title] == false ? false : true}
                                                  onChange={(e) => { this.checkboxChange(e, 'peMusculoskeletal') }}
                                                >
                                                  <span className="switch-label">{peMusculoskeletallist.label} </span>
                                                </CustomInput>
                                              </Col>)
                                            })}
                                            <Col md="12" className="mr-0 mt-1">
                                              <FormGroup className="mb-0 form-label-group">
                                                <Input
                                                  type="text"
                                                  placeholder="Others"
                                                  name="pemusculoskeletalothers"
                                                  onChange={this.peothersChange}
                                                  onBlur={this.peothersblurAction}
                                                  value={this.state.peothers.pemusculoskeletalothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border py-50">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Skin</h2>

                                          <Row>
                                            {patientOptions.peSkin.map((peSkinlist) => {
                                              return (<Col md="4" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={peSkinlist.title}
                                                  name={peSkinlist.title}
                                                  inline
                                                  checked={this.state.peSkin[peSkinlist.title] == false ? false : true}
                                                  onChange={(e) => { this.checkboxChange(e, 'peSkin') }}
                                                >
                                                  <span className="switch-label">{peSkinlist.label} </span>
                                                </CustomInput>
                                              </Col>)
                                            })}
                                            <Col md="12" className="mr-0 mt-1">
                                              <FormGroup className="mb-0 form-label-group">
                                                <Input
                                                  type="text"
                                                  placeholder="Others"
                                                  name="peskinothers"
                                                  onChange={this.peothersChange}
                                                  onBlur={this.peothersblurAction}
                                                  value={this.state.peothers.peskinothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border py-50">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Neurologic</h2>
                                          <Row>
                                            {patientOptions.peNeurologic.map((peNeurologiclist) => {
                                              return (<Col md="4" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={peNeurologiclist.title}
                                                  name={peNeurologiclist.title}
                                                  inline
                                                  checked={this.state.peNeurologic[peNeurologiclist.title] == false ? false : true}
                                                  onChange={(e) => { this.checkboxChange(e, 'peNeurologic') }}
                                                >
                                                  <span className="switch-label">{peNeurologiclist.label} </span>
                                                </CustomInput>
                                              </Col>)
                                            })}
                                            <Col md="12" className="mr-0 mt-1">
                                              <FormGroup className="mb-0 form-label-group">
                                                <Input
                                                  type="text"
                                                  placeholder="Others"
                                                  name="peneurologicothers"
                                                  onChange={this.peothersChange}
                                                  onBlur={this.peothersblurAction}
                                                  value={this.state.peothers.peneurologicothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="border py-50">
                                    <Row>
                                      <Col md="12">
                                        <div>
                                          <h2 className="mb-0 title">Psychiatric</h2>
                                          <Row>
                                            {patientOptions.pePsychiatric.map((pePsychiatriclist) => {
                                              return (<Col md="4" className="mr-0 mt-50">
                                                <CustomInput
                                                  type="switch" className="mr-0"
                                                  id={pePsychiatriclist.title}
                                                  name={pePsychiatriclist.title}
                                                  inline
                                                  checked={this.state.pePsychiatric[pePsychiatriclist.title] == false ? false : true}
                                                  onChange={(e) => { this.checkboxChange(e, 'pePsychiatric') }}
                                                >
                                                  <span className="switch-label">{pePsychiatriclist.label} </span>
                                                </CustomInput>
                                              </Col>)
                                            })}
                                            <Col md="12" className="mr-0 mt-1">
                                              <FormGroup className="mb-0 form-label-group">
                                                <Input
                                                  type="text"
                                                  placeholder="Others"
                                                  name="pepsychiatricothers"
                                                  onChange={this.peothersChange}
                                                  onBlur={this.peothersblurAction}

                                                  value={this.state.peothers.pepsychiatricothers}
                                                />
                                                <Label for="others">Others</Label>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>    </div> : <></>}

                              {/* Review            */}
                              {information == "Data Reviewed" ? <div> <Row>
                                <Col md="12">
                                  <FormGroup className="form-label-group ">
                                    <Input
                                      type="textarea"
                                      placeholder="Data Reviewed"
                                      name="dataReviewed"
                                      rows="2.5"
                                      onChange={this.radioChange}
                                      onBlur={this.blurradioAction}
                                      value={this.state.dataReviewed}

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
                                          id="option1"
                                          icon={<Check className="vx-icon" size={13} />}
                                          onChange={this.handleCheckboxChange}
                                          defaultChecked={this.state.datapoints.option1}
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
                                          defaultChecked={this.state.datapoints.option2}

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
                                          defaultChecked={this.state.datapoints.option3} />
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
                                          defaultChecked={this.state.datapoints.option4}

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
                                          defaultChecked={this.state.datapoints.option5}

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
                                          defaultChecked={this.state.datapoints.option6}

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
                                          defaultChecked={this.state.datapoints.option7}


                                        />
                                      </div>
                                    </Col>
                                  </Row>
                                </FormGroup> </div> : <></>}
                              {/* Assessment and Plan */}
                              {information == "MDM" ?
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
                                            </th>
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
                              {information == "History" ?
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
                                        onBlur={this.blurHistoryAction}
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
                                        onBlur={this.blurHistoryAction}

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
                                        onBlur={this.blurHistoryAction}
                                        value={this.state.history.smokinghistory}

                                      />
                                      <Label for="smoking"> Smoking History</Label>

                                    </FormGroup>
                                  </Col>
                                </Row>

                                </div> : <></>}

                              {information == "Assessment and Plan" ?
                                <div className="assessmentplan">
                                  {
                                    this.state.icd.map((icd, k) => {
                                      return <div key={k}><IdcInputs
                                        icd={icd}
                                        index={k}
                                        icdChange={this.icdChange}
                                        icdInputUpdate={this.icdInputUpdate}
                                        icdInputBlur={this.icdInputBlur}
                                        options={icdCodes}
                                      ></IdcInputs></div>;

                                    })
                                  }
                                  <Col md="12" className="border">
                                    <Label><h5>CPT Code</h5></Label>
                                    <Select
                                      className={`React px-0 col-md-6 basic-single ${
                                        this.state.cptValue.label != '' ? "bg-active" : ''
                                        }`}
                                      classNamePrefix="select"
                                      options={patientOptions.cptValueDropdown}
                                      defaultValue={this.state.cptValue}
                                    />
                                  </Col>

                                </div>
                                : <></>}
                              {information == "Chief Complaint" ? <ul className="keyvalues pb-50">
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
                                    {this.state.roscount >= 1 ? <Col className="col-auto ">
                                      <Label className="d-inline-block px-0"><h6>ROS:</h6></Label>
                                      <Chip text={this.state.roscount} className="mr-1" /></Col>
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
                                  <Col className="ml-md-1 text-center border bg-grey"><a href="#" className="">

                                    <Info className="vx-icon" size={26} onClick={this.setModalShow}
                                    />
                                  </a></Col>
                                </Row>
                              </Col>
                            </div>
                            <div className="ripple d-block">
                              <Row >
                                <Col md={3}>
                                  <Button.Ripple
                                    type="button"
                                    className="cursor-pointer btn-block mt-1"
                                    color="primary"
                                    size="md"
                                    outline
                                    onClick={() => {
                                      this.formReset()
                                    }}
                                  >
                                    Reset
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
                                <Col md={6} >
                                  <Button.Ripple
                                    className="cursor-pointer btn-block mt-1 mb-1"
                                    color="primary"
                                    size="md"
                                    type="submit"
                                  //disabled={this.state.pEtotalCount !== 0 && this.state.count >= 1 && this.state.mdmResult !== '' ? false : true}	
                                  >
                                    Submit
                        </Button.Ripple>
                                </Col>
                              </Row>
                            </div></Form>
                        </CardBody>
                      </Card>
                    ) : null}

                    {this.state.iFrameEmr ? (
                      <Card>
                        <CardHeader></CardHeader>

                        <CardBody>
                          {this.props.sessionDetails.data != undefined ? (
                            <iframe
                              src={
                                this.props.sessionDetails.data.preferences
                                  .iframeLink
                              }
                              width="100%"
                              height="800px"
                            ></iframe>
                          ) : null}
                        </CardBody>
                      </Card>
                    ) : null}
                  </Col>
                ) : null}
              </Row>
              {/* </OTSession> */}
            </Container>
          </div>
        ) : null}
        {/* <audio className="audio-element">
          <source src="https://telescrubs.inr.dolphin247.com:5002/notificaiton/notification.mp3"></source>
        </audio> */}
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
              <Col md="5">{visitCount >= 2 ? "Established Visit Form Information" : "Patient New Visit Form Information"}</Col>
              <Col md="7" className="pl-0 text-right">
                <ul className="patient-detail">
                  <li>{_.toUpper(patient.lastName)}, {_.toUpper(patient.firstName)}</li>
                  <li>DOB: {moment(patient.dateOfBirth).format('DD/MM/YYYY')}</li>
                  <li>DoS: {moment().format('DD/MM/YYYY')}</li>
                </ul>
              </Col>
            </Row>
            <Col md={12} className="px-0">
              {this.state.count !== '' ? <div>
                {this.state.chiefcomplaint != '' ? <ul className="pl-0">
                  <li><h5 class="d-inline-block"><b>Chief Complaint:</b></h5> <p>{this.state.chiefcomplaint}</p></li>
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
              {this.state.roscount != 0 ? <div className="rosPreview">
                <h5>Review of System</h5>
                <Row>
                  <ul>
                    {this.state.ros.weightloss === true || this.state.ros.fevers === true || this.state.ros.chills === true || this.state.ros.nightsweats === true || this.state.ros.fatigue === true || this.state.others.constitutionalothers != '' ?
                      <li><p><b>Constitutional:</b></p>
                        {patientOptions.Constitutional.map((Constitutionalview, kk) => {
                          return (<p key={kk}> &nbsp;{
                            this.state.ros[Constitutionalview.title] === true ? Constitutionalview.label + ',' : ''}
                          </p>)
                        })}{this.state.others.constitutionalothers != '' ? <p><b>Others:</b> {this.state.others.constitutionalothers}</p> : ''}
                      </li> : <></>}
                    {this.state.ros.arthralgias === true || this.state.ros.myalgias === true || this.state.ros.muscleweakness === true
                      || this.state.ros.jointswelling === true || this.state.ros.nsaid === true || this.state.others.musculoskeletalothers != '' ?
                      <li><p><b>Musculoskeletal:</b></p>
                        {patientOptions.Musculoskeletal.map((Musculoskeletalview) => {
                          return (<p> &nbsp;{
                            this.state.ros[Musculoskeletalview.title] === true ? Musculoskeletalview.label + ',' : ''}
                          </p>)
                        })}{this.state.others.musculoskeletalothers != '' ? <p><b>Others:</b> {this.state.others.musculoskeletalothers}</p> : ''}
                      </li> : <></>}
                    {this.state.ros.blurryVision === true || this.state.ros.eyepain === true || this.state.ros.discharge === true
                      || this.state.ros.dryeyes === true || this.state.ros.decreasedvision === true || this.state.others.eyesothers != '' ?
                      <li><p><b>Eyes:</b></p>  {patientOptions.eyes.map((eyesview) => {
                        return (<p> &nbsp;{
                          this.state.ros[eyesview.title] === true ? eyesview.label + ',' : ''}
                        </p>)
                      })}{this.state.others.eyesothers != '' ? <p><b>Others:</b> {this.state.others.eyesothers}</p> : ''}</li> : <></>}
                    {this.state.ros.sorethroat === true || this.state.ros.tinnitus === true || this.state.ros.bloodyNose === true
                      || this.state.ros.hearingLoss === true || this.state.ros.sinusitis === true || this.state.others.entothers != '' ?
                      <li><p><b>ENT:</b></p>  {patientOptions.ent.map((entview) => {
                        return (<p> &nbsp;{
                          this.state.ros[entview.title] === true ? entview.label + ',' : ''}
                        </p>)
                      })}{this.state.others.entothers != '' ? <p><b>Others:</b> {this.state.others.entothers}</p> : ''}</li> : <></>}
                    {this.state.ros.shortofbreath === true || this.state.ros.cough === true || this.state.ros.hemoptysis === true
                      || this.state.ros.wheezing === true || this.state.ros.pleurisy === true || this.state.others.respiratoryothers != '' ?
                      <li><p><b>Respiratory:</b></p>  {patientOptions.Respiratory.map((Respiratoryview) => {
                        return (<p> &nbsp;{
                          this.state.ros[Respiratoryview.title] === true ? Respiratoryview.label + ',' : ''}
                        </p>)
                      })}{this.state.others.respiratoryothers != '' ? <p><b>Others:</b> {this.state.others.respiratoryothers}</p> : ''}</li> : <></>}
                    {this.state.ros.chestpain === true || this.state.ros.pnd === true || this.state.ros.palpitations === true
                      || this.state.ros.edema === true || this.state.ros.orhtopnea === true || this.state.ros.syncpe === true || this.state.others.cardiovascularothers != '' ?
                      <li><p><b>Cardiovascular:</b></p>  {patientOptions.cardiovascular.map((cardiovascularview) => {
                        return (<p> &nbsp;{
                          this.state.ros[cardiovascularview.title] === true ? cardiovascularview.label + ',' : ''}
                        </p>)
                      })}{this.state.others.cardiovascularothers != '' ? <p><b>Others:</b> {this.state.others.cardiovascularothers}</p> : ''}</li> : <></>}
                    {this.state.ros.nausea === true || this.state.ros.vomiting === true || this.state.ros.diarrhea === true
                      || this.state.ros.hematemesis === true || this.state.ros.melena === true || this.state.others.gastrointestinalothers != '' ?
                      <li><p><b>Gastrointestinal:</b></p>  {patientOptions.Gastrointestinal.map((Gastrointestinalview) => {
                        return (<p> &nbsp;{
                          this.state.ros[Gastrointestinalview.title] === true ? Gastrointestinalview.label + ',' : ''}
                        </p>)
                      })}{this.state.others.gastrointestinalothers != '' ? <p><b>Others:</b> {this.state.others.gastrointestinalothers}</p> : ''}</li> : <></>}
                    {this.state.ros.hematuria === true || this.state.ros.dysuria === true || this.state.ros.hesitancy === true
                      || this.state.ros.incontinence === true || this.state.ros.UTIs === true || this.state.others.genitourinaryothers != '' ?
                      <li><p><b>Genitourinary:</b></p>  {patientOptions.Genitourinary.map((Genitourinaryview) => {
                        return (<p> &nbsp;{
                          this.state.ros[Genitourinaryview.title] === true ? Genitourinaryview.label + ',' : ''}
                        </p>)
                      })}{this.state.others.genitourinaryothers != '' ? <p><b>Others:</b> {this.state.others.genitourinaryothers}</p> : ''}</li> : <></>}
                    {this.state.ros.rash === true || this.state.ros.pruritis === true || this.state.ros.sores === true
                      || this.state.ros.nailchanges === true || this.state.ros.skinThickening === true || this.state.others.skinothers != '' ?
                      <li><p><b>Skin:</b></p>  {patientOptions.skin.map((skinview) => {
                        return (<p> &nbsp;{
                          this.state.ros[skinview.title] === true ? skinview.label + ',' : ''}
                        </p>)
                      })}{this.state.others.skinothers != '' ? <p><b>Others:</b> {this.state.others.skinothers}</p> : ''}</li> : <></>}
                    {this.state.ros.migraines === true || this.state.ros.numbness === true || this.state.ros.ataxia === true
                      || this.state.ros.tremors === true || this.state.ros.vertigo === true || this.state.others.neurologicalothers != '' ?
                      <li><p><b>Neurological:</b></p>  {patientOptions.Neurological.map((Neurologicalview) => {
                        return (<p> &nbsp;{
                          this.state.ros[Neurologicalview.title] === true ? Neurologicalview.label + ',' : ''}
                        </p>)
                      })}{this.state.others.neurologicalothers != '' ? <p><b>Others:</b> {this.state.others.neurologicalothers}</p> : ''}</li> : <></>}
                    {this.state.ros.excessThirst === true || this.state.ros.polyuria === true || this.state.ros.coldintolerance === true
                      || this.state.ros.heatintolerance === true || this.state.ros.goiter === true || this.state.others.endocrineothers != '' ?
                      <li><p><b>Endocrine:</b></p>  {patientOptions.Endocrine.map((Endocrineview) => {
                        return (<p> &nbsp;{
                          this.state.ros[Endocrineview.title] === true ? Endocrineview.label + ',' : ''}
                        </p>)
                      })}{this.state.others.endocrineothers != '' ? <p><b>Others:</b> {this.state.others.endocrineothers}</p> : ''}</li> : <></>}
                    {this.state.ros.depression === true || this.state.ros.anxiety === true || this.state.ros.antiDepressants === true
                      || this.state.ros.alcoholAbuse === true || this.state.ros.drugAbuse === true || this.state.ros.insomnia === true || this.state.others.pshychiatricothers != '' ?
                      <li><p><b>Psychiatric:</b></p>  {patientOptions.Psychiatric.map((Psychiatricview) => {
                        return (<p> &nbsp;{
                          this.state.ros[Psychiatricview.title] === true ? Psychiatricview.label + ',' : ''}
                        </p>)
                      })}{this.state.others.pshychiatricothers != '' ? <p><b>Others:</b> {this.state.others.pshychiatricothers}</p> : ''}</li> : <></>}
                    {this.state.ros.easyBruising === true || this.state.ros.bleedingDiathesis === true || this.state.ros.lymphedema === true
                      || this.state.ros.bloodClots === true || this.state.ros.swollenGlands === true || this.state.others.hemLymphaticothers != '' ?
                      <li><p><b>Hem/Lymphatic:</b></p>  {patientOptions.HemLymphatic.map((HemLymphaticview) => {
                        return (<p> &nbsp;{
                          this.state.ros[HemLymphaticview.title] === true ? HemLymphaticview.label + ',' : ''}
                        </p>)
                      })}{this.state.others.hemLymphaticothers != '' ? <p><b>Others:</b> {this.state.others.hemLymphaticothers}</p> : ''}</li> : <></>}
                    {this.state.ros.allergicrhinitis === true || this.state.ros.hayfever === true || this.state.ros.hives === true
                      || this.state.ros.asthma === true || this.state.ros.positivePPD === true || this.state.others.allergicothers != '' ?
                      <li><p><b>Allergic/Immun:</b></p>  {patientOptions.Allergic.map((Allergicview) => {
                        return (<p> &nbsp;{
                          this.state.ros[Allergicview.title] === true ? Allergicview.label + ',' : ''}
                        </p>)
                      })}{this.state.others.allergicothers != '' ? <p><b>Others:</b> {this.state.others.allergicothers}</p> : ''}</li> : <></>}
                  </ul>
                </Row></div> : <></>}
              {this.state.pEtotalCount != 0 ? <div className="rosPreview">
                <h5>Physical Exam</h5>
                <Row>
                  <ul className="mb-0">
                    {this.state.peConstitutionalcount != 0 || this.state.peothers.peconstitutionalothers != '' ? <li><p><b>Constitutional: </b></p>
                      {patientOptions.peConstitutional.map((peConstitutionalview, k) => {
                        return (<p key={k}> &nbsp;{
                          this.state.peConstitutional[peConstitutionalview.title] === true ? peConstitutionalview.label + ',' : ''}
                        </p>)
                      })}
                      {this.state.peothers.peconstitutionalothers != '' ? <p><b>Others:</b> {this.state.peothers.peconstitutionalothers}</p> : ''}
                    </li> : <></>}

                    {this.state.peENMTcount != 0 || this.state.peothers.peenmtothers != '' ? <li><p><b>ENMT:</b></p>
                      {patientOptions.peENMT.map((peENMTview) => {
                        return (<p> &nbsp;{
                          this.state.peENMT[peENMTview.title] === true ? peENMTview.label + ',' : ''}
                        </p>)
                      })}
                      {this.state.peothers.peenmtothers != '' ? <p><b>Others:</b> {this.state.peothers.peenmtothers}</p> : ''}
                    </li> : <></>}

                    {this.state.peRespiratorycount != 0 || this.state.peothers.perespiratoryothers != '' ? <li><p><b>Respiratory:</b></p>
                      {patientOptions.peRespiratory.map((peRespiratoryview) => {
                        return (<p> &nbsp;{
                          this.state.peRespiratory[peRespiratoryview.title] === true ? peRespiratoryview.label + ',' : ''}
                        </p>)
                      })}
                      {this.state.peothers.perespiratoryothers != '' || this.state.peothers.pecardiovascularothers != '' ? <p><b>Others:</b> {this.state.peothers.perespiratoryothers}</p> : ''}
                    </li> : <></>}
                    {this.state.peCardiovascularcount != 0 ? <li><p><b>Cardiovascular:</b></p>
                      {patientOptions.peCardiovascular.map((peCardiovascularview) => {
                        return (<p> &nbsp;{
                          this.state.peCardiovascular[peCardiovascularview.title] === true ? peCardiovascularview.label + ',' : ''}
                        </p>)
                      })}
                      {this.state.peothers.pecardiovascularothers != '' ? <p><b>Others:</b> {this.state.peothers.pecardiovascularothers}</p> : ''}
                    </li> : <></>}
                    {this.state.peGastrointestinalcount != 0 || this.state.peothers.pegastrointestinalothers != '' ? <li><p><b>Gastrointestinal:</b></p>
                      {patientOptions.peGastrointestinal.map((peGastrointestinalview) => {
                        return (<p> &nbsp;{
                          this.state.peGastrointestinal[peGastrointestinalview.title] === true ? peGastrointestinalview.label + ',' : ''}
                        </p>)
                      })}
                      {this.state.peothers.pegastrointestinalothers != '' ? <p><b>Others:</b> {this.state.peothers.pegastrointestinalothers}</p> : ''}
                    </li> : <></>}
                    {this.state.peMusculoskeletalcount != 0 || this.state.peothers.pemusculoskeletalothers != '' ? <li><p><b>Musculoskeletal:</b></p>
                      {patientOptions.peMusculoskeletal.map((peMusculoskeletalview) => {
                        return (<p> &nbsp;{
                          this.state.peMusculoskeletal[peMusculoskeletalview.title] === true ? peMusculoskeletalview.label + ',' : ''}
                        </p>)
                      })}
                      {this.state.peothers.pemusculoskeletalothers != '' ? <p><b>Others:</b> {this.state.peothers.pemusculoskeletalothers}</p> : ''}
                    </li> : <></>}
                    {this.state.peSkincount != 0 || this.state.peothers.peskinothers != '' ? <li><p><b>Skin:</b></p>
                      {patientOptions.peSkin.map((peSkinview) => {
                        return (<p> &nbsp;{
                          this.state.peSkin[peSkinview.title] === true ? peSkinview.label + ',' : ''}
                        </p>)
                      })}
                      {this.state.peothers.peskinothers != '' ? <p><b>Others:</b> {this.state.peothers.peskinothers}</p> : ''}

                    </li> : <></>}
                    {this.state.peNeurologiccount != 0 || this.state.peothers.peneurologicothers != '' ? <li><p><b>Neurologic:</b></p>
                      {patientOptions.peNeurologic.map((peNeurologicview) => {
                        return (<p> &nbsp;{
                          this.state.peNeurologic[peNeurologicview.title] === true ? peNeurologicview.label + ',' : ''}
                        </p>)
                      })}
                      {this.state.peothers.peneurologicothers != '' ? <p><b>Others:</b> {this.state.peothers.peneurologicothers}</p> : ''}
                    </li> : <></>}
                    {this.state.pePsychiatriccount != 0 || this.state.peothers.pepsychiatricothers != '' ? <li><p><b>Psychiatric:</b></p>
                      {patientOptions.pePsychiatric.map((pePsychiatricview) => {
                        return (<p> &nbsp;{
                          this.state.pePsychiatric[pePsychiatricview.title] === true ? pePsychiatricview.label + ',' : ''}
                        </p>)
                      })}
                      {this.state.peothers.pshychiatricothers != '' ? <p><b>Others:</b> {this.state.peothers.pshychiatricothers}</p> : ''}
                    </li> : <></>}
                  </ul>
                </Row></div> : <></>}
              {this.state.mdmResult != '' ? <div className="rosPreview dataReview mb-0">
                <Row>
                  <ul>
                    <li><h5 class="d-inline-block"><b>MDM:</b></h5> <p>{this.state.mdmResult == 'SF' ? 'Minimal Risk' : this.state.mdmResult === 'low' ? 'Low Risk' : this.state.mdmResult === 'mod' ? 'Moderate Risk' : this.state.mdmResult === 'high' ? 'High Risk' : ''} </p></li>
                  </ul>
                </Row></div> : <></>}
              {this.state.dataReviewed != '' ? <div className="rosPreview dataReview mb-0">
                <Row>
                  <ul>
                    <li><h5 class="d-inline-block"><b>Data Reviewed:</b></h5>&nbsp;<p>{this.state.dataReviewed}</p></li>
                  </ul>
                  {this.state.datapointscount != 0 ? <ul>
                    <li><p><b>Data points:</b></p>&nbsp;<p>{this.state.datapoints.option1 === true ? 'Review and/or order labs (1),' : ''}</p>
                      <p>{this.state.datapoints.option2 === true ? 'Discuss test with MD (1),' : ''}</p>
                      <p>{this.state.datapoints.option3 === true ? 'Order old records (1),' : ''}</p>
                      <p>{this.state.datapoints.option4 === true ? 'Review and/or order medical test (PFTs, EKG, echo, cath) (1),' : ''}</p>
                      <p>{this.state.datapoints.option5 === true ? 'Review and/or order Xrays (1),' : ''}</p>
                      <p>{this.state.datapoints.option6 === true ? 'Review any image, tracing, specimen (2),' : ''}</p>
                      <p>{this.state.datapoints.option7 === true ? 'Summarize old records (2)' : ''}</p>
                    </li>
                  </ul> : ''}

                </Row></div> : <></>}
              {icdCount(this.state.icd) != 0 ? <div className="rosPreview assessment">
                <h5>Assessment and Plan</h5>
                <Row>
                  <ul>
                    {this.state.icd.map((icdVal, i) => {
                      return (
                        <Fragment key={i}>
                          {(icdVal.code != "" && icdVal.monitor !== '' && icdVal.evaluate !== ''
                            && icdVal.assess !== '' && icdVal.treatment !== '') ? (
                              <li>
                                <p><b>ICD Code {i + 1}:</b></p>
                                <p>{icdVal.code}:
                                  ({icdVal.monitor},{icdVal.evaluate},{icdVal.assess},{icdVal.treatment})
                                  </p>
                              </li>
                            ) : null}

                        </Fragment>
                      )
                    })
                    }

                    {this.state.cptValue.value !== '' ? <li><p><b>CPT Code:</b></p> <p>{this.state.cptValue.value} </p></li> : null}                    </ul>
                </Row></div> : <></>}
            </Col>

            {this.state.count != 0 || this.state.roscount >= 1 || this.state.pEtotalCount === true || this.state.mdmResult != '' ?
              <Col md="12" className="patient-new-visit  minHeight">
                <Row>
                  <Col md="12  " className="border " >                    <Row>
                    {this.state.count != 0 ?
                      <Col className=" col-auto pr-md-0 pl-5px">
                        <Label className="d-inline-block px-0">
                          <h6>HPI:</h6>
                        </Label>
                        {this.state.count >= 1 && this.state.count <= 3 ?
                          <p className="mr-1 d-inline-block" >&nbsp; Brief</p>
                          :
                          <p className="mr-1 d-inline-block" >&nbsp; Extended</p>
                        }</Col> : <></>}
                    {this.state.roscount >= 1 ?
                      <Col className="col-auto ">
                        <Label className="d-inline-block px-0">
                          <h6>ROS:</h6>
                        </Label>
                        <p className="mr-1 d-inline-block" >&nbsp; {this.state.roscount}</p>
                      </Col>
                      : <></>}
                    {this.state.count != 0 ?
                      <Col className="col-auto">
                        <Label className="d-inline-block px-0 " for="history-level">
                          <h6>History:</h6>
                        </Label>
                        <p className="mr-1 d-inline-block" >&nbsp; {this.state.historyStatus}</p>
                      </Col> : <></>}
                    {this.state.pEtotalCount === true ?
                      <Col className="col-auto pr-md-0">
                        <Label className="d-inline-block px-0">
                          <h6>PE:</h6>
                        </Label>
                        <p className="mr-1 d-inline-block" >&nbsp; {this.state.peStatus}</p>
                      </Col> : <></>}
                    {this.state.mdmResult != '' ?
                      <Col className="col-auto ">
                        <Label className="d-inline-block px-0" for="mdm">
                          <h6>MDM: </h6>
                        </Label>
                        <p className="mr-1 d-inline-block" >&nbsp; {this.state.mdmResult}</p>
                      </Col> : <></>}
                  </Row>
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
        {this.state.paymentProcessing ? (
          <Row className="d-flex align-items-center justify-content-center m-0 vc-loader">
            <Col md="6">
              <Card className="mb-0">
                <CardHeader className="justify-content-center">
                  <img src={CaptureImg} alt="Payment" className="img-fluid width-400 mt-1" />
                </CardHeader>
                <CardBody className="text-center">
                  <Spinner color="primary" size="lg" className="mb-2" />
                  <h2>Capturing Payment. Please wait...</h2>
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : null}
        {this.state.internetconnection ? (
          <Row className="d-flex align-items-center justify-content-center m-0 vc-loader">
            <Col md="6">
              <SweetAlert
                warning
                confirmBtnText="Try Again"
                confirmBtnBsStyle="outline-primary py-50 px-1"
                title="Unable to connect to internet"
                onCancel={() => { }}
                className="boxShadow"
                onCancel={() => { }}
                onConfirm={window.location.reload()}

              >
                Please check your internet connection
                </SweetAlert>
            </Col>
          </Row>
        ) : null}

        {(this.state.audioAccessDenied && this.state.videoAccessDenied) ? (
          <Row className="d-flex align-items-center justify-content-center m-0 vc-loader">
            <Col md="6">
              <SweetAlert
                warning
                confirmBtnText="Close"
                cancelBtnBsStyle="outline-danger py-50 px-1"
                confirmBtnBsStyle="outline-primary py-50 px-1"
                title="Please provide access to Camera and Microphone in your browser"
                onCancel={() => { }}
                className="boxShadow"
                onConfirm={this.hidePromptAcess}
              >   Please check the access for the Camera/Microphone in your browser
  
                </SweetAlert>
            </Col>
          </Row>
        ) : null
        }

        {(this.state.audioAccessDenied) ? (
          <Row className="d-flex align-items-center justify-content-center m-0 vc-loader">
            <Col md="6">
              <SweetAlert
                warning
                confirmBtnText="Close"
                cancelBtnBsStyle="outline-danger py-50 px-1"
                confirmBtnBsStyle="outline-primary py-50 px-1"
                title="Please provide access to Microphone in your browser"
                onCancel={() => { }}
                className="boxShadow"
                onConfirm={this.hidePromptAcess}
              >   Please check the access for the Microphone in your browser
  
                </SweetAlert>
            </Col>
          </Row>
        ) : null
        }

        {(this.state.videoAccessDenied) ? (
          <Row className="d-flex align-items-center justify-content-center m-0 vc-loader">
            <Col md="6">
              <SweetAlert
                warning
                confirmBtnText="Close"
                cancelBtnBsStyle="outline-danger py-50 px-1"
                confirmBtnBsStyle="outline-primary py-50 px-1"
                title="Please provide access to Camera in your browser"
                onCancel={() => { }}
                className="boxShadow"
                onConfirm={this.hidePromptAcess}
              >   Please check the access for the Camera in your browser
  
                </SweetAlert>
            </Col>
          </Row>
        ) : null
        }

        {this.state.promptAccess ? (
          <Row className="d-flex align-items-center justify-content-center m-0 vc-loader">
            <Col md="6">
              <SweetAlert
                warning
                confirmBtnText="Enable Access"
                cancelBtnBsStyle="outline-danger py-50 px-1"
                confirmBtnBsStyle="outline-primary py-50 px-1"
                title="Access Denied to the Media Devices."
                onCancel={() => { }}
                className="boxShadow"
                onConfirm={this.promptAcess}
              >   Please check the audio/video in your device
  
                </SweetAlert>
            </Col>
          </Row>
        ) : null
        }




        {this.state.audioconnection ? (
          <Row className="d-flex align-items-center justify-content-center m-0 vc-loader">
            <Col md="6">
              <SweetAlert
                warning
                confirmBtnText="Close"
                cancelBtnBsStyle="outline-danger py-50 px-1"
                confirmBtnBsStyle="outline-primary py-50 px-1"
                title="There is an issue with audio/video"
                onCancel={() => { }}
                className="boxShadow"
                onConfirm={this.hideAVError}
              >   Please check the audio/video in your device
  
                </SweetAlert>
            </Col>
          </Row>
        ) : null
        }

      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { patient, video } = state;
  console.log(patient)
  return {
    appointment: patient.appointmentDetails,
    visit: patient.visit,
    icdCodes: patient.icdCodes,
    sessionDetails: video.sessionDetails,
    disconnectData: video.disconnectData
  };
};
export default connect(mapStateToProps, {
  visitForm,
  getAppointment,
  getIcdCodes,
  getAppointmentToken,
  disconnectSession,
  // sendWaitingNotificaiton,
  disconnectAppointmentSession,
  sendVideoLogs
})(PatientNewVisit);
