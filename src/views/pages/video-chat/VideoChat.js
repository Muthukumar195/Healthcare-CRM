import React from "react";
import { connect } from "react-redux";
import _ from 'lodash'
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Input,
  Form,
  UncontrolledTooltip,
  Button,
  Spinner
} from "reactstrap";
import SweetAlert from 'react-bootstrap-sweetalert';
import * as Icon from "react-feather";
import "@opentok/client";
import {
  getToken,
  disconnectSession,
  // sendWaitingNotificaiton,
  sendVideoLogs,
  sendUnAuthVideoLogs
} from "../../../redux/actions/videoActions";
import CaptureImg from "../../../assets/img/pages/capturing.jpg";
import { getLoggedInToken, getUserRole } from "../../../components/Auth";
import { internetSpeed, getOS, getBrowser, boolTOString } from "../../../components/Common";
import {
  OTSession,
  OTPublisher,
  OTStreams,
  OTSubscriber,
  createSession,
} from "opentok-react";
// import "./index.css";
import "./polyfills";

class VideoChat extends React.Component {
  constructor(props) {
    super(props);

    console.log(props);
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
      paymentProcessing: false,
      showHangUpControl: false,
      internetconnection: false,
      audioconnection: false,
      accessDenied: false,
      audioAccessDenied: false,
      videoAccessDenied: false,
      promptAccess: false,
      hasAudio: true,
      videoLogs: [],
      hasNoAudioVideo: false,
      hasAudioDenied: false,
      hasVideoRendered: false,
      hasVideoDenied: false
    };

    this.onSessionError = this.onSessionError.bind(this);

    this.videoLogs = [...this.state.videoLogs];


    this.sessionEventHandlers = {
      sessionConnected: () => {
        alert("connected")
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
        alert("re connecting")
        console.log("session re connecting");
        this.setState({ connection: "Reconnecting" });
      },
    };
    var successCallback = function (error) {
      console.log("success")
      // user allowed access to camera
    };
    var errorCallback = function (error) {
      console.log("errorCam", error)
      if (error.name == 'NotAllowedError') {
        // user denied access to camera
      }
    };

    this.publisherEventHandlers = {
      accessDenied: () => {
        console.log(navigator);

        navigator.permissions.query({ name: 'microphone' })
          .then((permissionObj) => {
            console.log(permissionObj.state);
            if (permissionObj.state == "denied") {
              this.setState({ audioAccessDenied: true, hasAudioDenied: true });
            }
            if (permissionObj.state == "prompt") {
              this.setState({ promptAccess: true, hasAudioDenied: true });
            }
          })
          .catch((error) => {
            console.log('Got error :', error);
          })

        navigator.permissions.query({ name: 'camera' })
          .then((permissionObj) => {
            console.log(permissionObj.state);
            if (permissionObj.state == "denied") {
              this.setState({ videoAccessDenied: true, hasVideoDenied: true });
            }
            if (permissionObj.state == "prompt") {
              this.setState({ promptAccess: true, hasVideoDenied: true });
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
      accessDenied: () => {
        // this.setState({ accessDenied : true });

      },
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
  }

  onSessionError = (error) => {
    console.log("onSessionError");
    this.setState({ error: `Failed to connect: ${error.message}` });
  }; 

  onPublish = () => {
    this.setState({ hasVideoRendered: true });
    internetSpeed((speed) => {
      var message = `SID: ${this.props.match.params.sessionId}, AVDS:${boolTOString(!this.state.hasNoAudioVideo)}, AA:${boolTOString(!this.state.hasAudioDenied)}, VA:${boolTOString(!this.state.hasVideoDenied)}, VR:${boolTOString(this.state.hasVideoRendered)}, Browser:${getBrowser()}, Speed:${parseInt(speed.speedInKbps)} Kbps, OS:${getOS()}`;
      if (getLoggedInToken()) {
        this.props.sendVideoLogs({
          isSendInvite: true,
          sessionId: this.props.match.params.sessionId,
          hasNoAudioVideo: this.state.hasNoAudioVideo,
          hasAudioDenied: this.state.hasAudioDenied,
          hasVideoDenied: this.state.hasVideoDenied,
          hasVideoRendered: this.state.hasVideoRendered,
          isDoctor: this.isDoctor(),
          speed: parseInt(speed.speedInKbps),
          message: message
        });
      } else {
        this.props.sendUnAuthVideoLogs({
          isSendInvite: true,
          sessionId: this.props.match.params.sessionId,
          hasNoAudioVideo: this.state.hasNoAudioVideo,
          hasAudioDenied: this.state.hasAudioDenied,
          hasVideoDenied: this.state.hasVideoDenied,
          hasVideoRendered: this.state.hasVideoRendered,
          isDoctor: this.isDoctor(),
          speed: parseInt(speed.speedInKbps),
          message: message
        });
      }

    });
    console.log("Publish Success");
  };

  onPublishError = (error) => {
    console.log(error);
    if (error.code == 1500 && error.name != "OT_USER_MEDIA_ACCESS_DENIED") {
      this.setState({ audioconnection: true, hasNoAudioVideo: true });
    }
  };

  onSubscribe = () => {
    console.log("Subscribe Success");
  };

  onSubscribeError = (error) => {
    console.log("onSubscribeError");
    if (error.code == 1500 && error.name != "OT_USER_MEDIA_ACCESS_DENIED") {
      // this.setState({ audioconnection: true });
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
      this.props.disconnectSession({
        sessionId: this.props.sessionDetails.data.sessionId,
      });
      if (this.state.sessionHelper.session.connection != null) {
        this.state.sessionHelper.session.signal(
          {
            data: "disconnect",
          },
          (error) => {
            if (error) {
              console.log(
                "signal error (" + error.name + "): " + error.message
              );
              internetSpeed((speed) => {
                var message = `SID: ${this.props.match.params.sessionId}, AVDS:${boolTOString(!this.state.hasNoAudioVideo)}, AA:${boolTOString(!this.state.hasAudioDenied)}, VA:${boolTOString(!this.state.hasVideoDenied)}, VR:${boolTOString(this.state.hasVideoRendered)}, Browser:${getBrowser()}, Speed:${parseInt(speed.speedInKbps)} Kbps, OS:${getOS()}, Status: VS - End failed, Reason: ${error.message}`;
                if (getLoggedInToken()) {
                  this.props.sendVideoLogs({ "browser": getBrowser(), "OS": getOS(), "sessionId": this.props.match.params.sessionId, "hasNoAudioVideo": this.state.hasNoAudioVideo, "hasAudioDenied": this.state.hasAudioDenied, "hasVideoDenied": this.state.hasVideoDenied, "hasVideoRendered": this.state.hasVideoRendered, isDoctor: this.isDoctor(), "speed": parseInt(speed.speedInKbps), message: message });
                } else {
                  this.props.sendUnAuthVideoLogs({ "browser": getBrowser(), "OS": getOS(), "sessionId": this.props.match.params.sessionId, "hasNoAudioVideo": this.state.hasNoAudioVideo, "hasAudioDenied": this.state.hasAudioDenied, "hasVideoDenied": this.state.hasVideoDenied, "hasVideoRendered": this.state.hasVideoRendered, isDoctor: this.isDoctor(), "speed": parseInt(speed.speedInKbps), message: message });
                }
              });
            } else {
              console.log("signal sent.");
              internetSpeed((speed) => {
                var message = `SID: ${this.props.match.params.sessionId}, AVDS:${boolTOString(!this.state.hasNoAudioVideo)}, AA:${boolTOString(!this.state.hasAudioDenied)}, VA:${boolTOString(!this.state.hasVideoDenied)}, VR:${boolTOString(this.state.hasVideoRendered)}, Browser:${getBrowser()}, Speed:${parseInt(speed.speedInKbps)} Kbps, OS:${getOS()}, Status: VS - End`;
                if (getLoggedInToken()) {
                  this.props.sendVideoLogs({ "browser": getBrowser(), "OS": getOS(), "sessionId": this.props.match.params.sessionId, "hasNoAudioVideo": this.state.hasNoAudioVideo, "hasAudioDenied": this.state.hasAudioDenied, "hasVideoDenied": this.state.hasVideoDenied, "hasVideoRendered": this.state.hasVideoRendered, isDoctor: this.isDoctor(), "speed": parseInt(speed.speedInKbps), message: message });
                } else {
                  this.props.sendUnAuthVideoLogs({ "browser": getBrowser(), "OS": getOS(), "sessionId": this.props.match.params.sessionId, "hasNoAudioVideo": this.state.hasNoAudioVideo, "hasAudioDenied": this.state.hasAudioDenied, "hasVideoDenied": this.state.hasVideoDenied, "hasVideoRendered": this.state.hasVideoRendered, isDoctor: this.isDoctor(), "speed": parseInt(speed.speedInKbps), message: message });
                }
              });
            }
          }
        );
      }

      // this.props.history.push(
      //   "/video/thankyou/" + this.props.sessionDetails.data.sessionId
      // );
    }
  };

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
    if (getLoggedInToken()) {
      return (getUserRole() == "admin") ? true : false;
    } else {
      return false;
    }

  };
  componentDidUpdate(prevProps) {
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
          console.log("Session", sessionHelper)
          // this.props.sendWaitingNotificaiton(this.props.sessionDetails.data);
        } else {
          this.props.history.push("/video/expired-link");
          return false;
        }

        if (this.isDoctor()) {
          this.setState({
            publisherName: this.props.sessionDetails.data.doctorName,
          });
          if (this.props.sessionDetails.data.patientName != null) {
            this.setState({
              subscriberName: this.props.sessionDetails.data.patientName,
            });
          } else {
            console.log("Member")
            this.setState({
              subscriberName: "Member",
            });
          }
          this.setWaitingMsg();
        } else {
          this.setState({
            subscriberName: this.props.sessionDetails.data.doctorName,
          });
          if (!_.isEmpty(this.props.sessionDetails.data.patientName)) {
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
        }

        this.setState({
          sessionHelper: sessionHelper,
        });
        console.log(sessionHelper);
        var _this = this;
        if (sessionHelper != "") {
          sessionHelper.session.on("connectionCreated", function (event) {

            // _this.videoLogs.push({browser:_this.getBrowser()},{sessionId: _this.props.match.params.sessionId });
            // _this.setState({videoLogs:_this.videoLogs});
            internetSpeed((speed) => {
              var message = `SID: ${_this.props.match.params.sessionId}, AVDS:${boolTOString(!_this.state.hasNoAudioVideo)}, AA:${boolTOString(!_this.state.hasAudioDenied)}, VA:${boolTOString(!_this.state.hasVideoDenied)}, VR:${boolTOString(_this.state.hasVideoRendered)}, Browser:${getBrowser()}, Speed:${parseInt(speed.speedInKbps)} Kbps, OS:${getOS()}`;
              if (getLoggedInToken()) {
                _this.props.sendVideoLogs({ "browser": getBrowser(), "OS": getOS(), "sessionId": _this.props.match.params.sessionId, "hasNoAudioVideo": _this.state.hasNoAudioVideo, "hasAudioDenied": _this.state.hasAudioDenied, "hasVideoDenied": _this.state.hasVideoDenied, "hasVideoRendered": _this.state.hasVideoRendered, isDoctor: _this.isDoctor(), "speed": parseInt(speed.speedInKbps), message: message });
              } else {
                _this.props.sendUnAuthVideoLogs({ "browser": getBrowser(), "OS": getOS(), "sessionId": _this.props.match.params.sessionId, "hasNoAudioVideo": _this.state.hasNoAudioVideo, "hasAudioDenied": _this.state.hasAudioDenied, "hasVideoDenied": _this.state.hasVideoDenied, "hasVideoRendered": _this.state.hasVideoRendered, isDoctor: _this.isDoctor(), "speed": parseInt(speed.speedInKbps), message: message });
              }

            });
            if (_this.isDoctor()) {
              console.log("*****Doctor connected*****");
            } else {
            }
            _this.setState({ showHangUpControl: true })
          });
        }

        if (sessionHelper != "") {
          sessionHelper.session.on("streamDestroyed", function (event) {
            event.preventDefault();

            console.log("stream destroyed---->>", event);
          });

          sessionHelper.session.on("sessionReconnecting", function (event) {
            // alert("reconnecting")
          });
          sessionHelper.session.on("sessionReconnected", function (event) {
            // alert("reconnected")
          });

          sessionHelper.session.on("streamPropertyChanged", function (event) {
            var subscribers = sessionHelper.session.getSubscribersForStream(event.stream);
            console.log("SubAudio", subscribers)
          });

          var _props = this.props;
          sessionHelper.session.on("signal", function (event) {
            _props.history.push(
              "/video/thankyou/" + _props.sessionDetails.data.sessionId
            );
          });
        }
      }
    }







  }

  componentDidMount() {
    var postParams = { sessionId: this.props.match.params.sessionId };
    this.props.getToken(postParams);
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


  render() {
    const {
    error,
      connection,
      publishVideo,
      publishAudio,
      subscriberVideo,
      isDisconnected
  } = this.state;
    return (
      <React.Fragment>
        {this.state.sessionHelper != "" ? (
          <div className="doctor-screen">
            <Container
              fluid={true}
              className={`video-chat-wrap ${
                this.state.fullScreen ? "max-scale" : ""
                }`}
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
                          <div className="pos-rt">
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
                            {this.state.waitingMsg != ""
                              ? this.state.waitingMsg
                              : this.state.subscriberName}
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
                                className="btn-icon rounded-circle"
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
                  <Col md="12" lg="8" xl="8" className="doc-video-form">
                    {this.state.teleSrubsEmr ? (
                      <Card>
                        <CardHeader>
                          <CardTitle> Form</CardTitle>
                        </CardHeader>

                        <CardBody></CardBody>
                      </Card>
                    ) : null}

                    {this.state.iFrameEmr ? (
                      <Card className="iframe-card">
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

        {(this.state.audioAccessDenied && !this.state.videoAccessDenied) ? (
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

        {(this.state.videoAccessDenied && !this.state.audioAccessDenied) ? (
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

        {
          this.state.paymentProcessing ? (
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
          ) : null
        }
      </React.Fragment >
    );
  }
}
const mapStateToProps = (state) => {
  console.log("state redux", state);
  const { video } = state;
  return {
    sessionDetails: video.sessionDetails,
  };
};

export default connect(mapStateToProps, {
  getToken,
  disconnectSession,
  // sendWaitingNotificaiton,
  sendVideoLogs,
  sendUnAuthVideoLogs
})(VideoChat);
