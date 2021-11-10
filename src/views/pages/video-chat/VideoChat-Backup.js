import React from "react";
import { connect } from "react-redux";
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
} from "reactstrap";
import * as Icon from "react-feather";
import "@opentok/client";
import {
  getToken,
  disconnectSession,
  // sendWaitingNotificaiton,
} from "../../../redux/actions/videoActions";
import { getLoggedInToken } from "../../../components/Auth";
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
    };

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
        console.log("User denied access to media source");
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
  }

  onSessionError = (error) => {
    console.log("onSessionError");
    this.setState({ error: `Failed to connect: ${error.message}` });
  };

  onPublish = () => {
    console.log("Publish Success");
  };

  onPublishError = (error) => {
    console.log("onPublishError");
    this.setState({ error: `Failed to connect: ${error.message}` });
  };

  onSubscribe = () => {
    console.log("Subscribe Success");
  };

  onSubscribeError = (error) => {
    console.log("onSubscribeError");
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

      // this.props.history.push(
      //   "/video/thankyou/" + this.props.sessionDetails.data.sessionId
      // );
    }
  };

  setWaitingMsg = () => {
    if (getLoggedInToken()) {
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
    return getLoggedInToken() ? true : false;
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
          // this.props.sendWaitingNotificaiton(this.props.sessionDetails.data);
        } else {
          this.props.history.push("/video/expired-link");
          return false;
        }

        if (getLoggedInToken()) {
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
        }

        this.setState({
          sessionHelper: sessionHelper,
        });
        console.log(sessionHelper);
        var _this = this;
        if (sessionHelper != "") {
          sessionHelper.session.on("connectionCreated", function (event) {
            if (getLoggedInToken()) {
              console.log("*****Doctor connected*****");
            } else {
            }
          });
        }

        if (sessionHelper != "") {
          sessionHelper.session.on("streamDestroyed", function (event) {
            event.preventDefault();

            console.log("stream destroyed---->>", event);
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
    // if(getLoggedInToken()){
    //   postParams.doctorId =
    // }
    console.log("token", getLoggedInToken(), "token");
    this.props.getToken(postParams);
  }

  render() {
    const {
      error,
      connection,
      publishVideo,
      publishAudio,
      subscriberVideo,
    } = this.state;
    return (
      <React.Fragment>
        {this.state.sessionHelper != "" ? (
          /*<div className="doctor-screen">
            <Container
              fluid={true}
              className={`video-chat-wrap ${
                this.state.fullScreen ? "max-scale" : ""
              }`}
            >*/
          <div className="patient-screen">
            <Container
              fluid={true}
              className="video-chat-wrap max-scale"
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
                        
                        <div className="payment-info">
                          <h3>Payment Authorization Successfull</h3>
                          <h4>Please Wait for the doctor to join</h4>
                        </div>

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
                        
                        <div className="cancel-televisit">
                          <Button.Ripple
                            color="primary"
                            className="square"
                          >
                            Cancel TeleVisit
                          </Button.Ripple>
                        </div>
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
                      <CardBody className="bg-black">
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
      </React.Fragment>
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
})(VideoChat);
