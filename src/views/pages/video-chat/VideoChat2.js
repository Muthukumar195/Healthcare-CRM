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
  Button,
} from "reactstrap";
import * as Icon from "react-feather";
import "@opentok/client";
import { getSession } from "../../../redux/actions/videoActions";
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
    };

    this.onSessionError = this.onSessionError.bind(this);

    this.sessionEventHandlers = {
      sessionConnected: () => {
        console.log(this.state);
        this.setState({ connection: "Connected" });
      },
      sessionDisconnected: () => {
        this.setState({ connection: "Disconnected" });
      },
      sessionReconnected: () => {
        this.setState({ connection: "Reconnected" });
      },
      sessionReconnecting: () => {
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
        console.log(`Publisher stream destroyed because: ${reason}`);
      },
    };

    this.subscriberEventHandlers = {
      videoEnabled: () => {
        console.log("Subscriber video enabled");
      },
      videoDisabled: () => {
        console.log("Subscriber video disabled");
      },
    };

    const sessionHelper = "";
  }
  state = {
    fullScreen: false,
  };

  onSessionError = (error) => {
    console.log(error);
    this.setState({ error: `Failed to connect: ${error.message}` });
  };

  onPublish = () => {
    console.log("Publish Success");
  };

  onPublishError = (error) => {
    this.setState({ error: `Failed to connect: ${error.message}` });
  };

  onSubscribe = () => {
    console.log("Subscribe Success");
  };

  onSubscribeError = (error) => {
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
      this.state.sessionHelper.disconnect();
    }
  };

  getSessionId = () => {
    this.state.sessionId =
      "2_MX40Njc2MTY3Mn5-MTU5NzE2NDU2MTA0NX4xbmZMT3QvVzk4OFBtQklnaVIzZUJJNVN-UH4";
    this.state.token =
      "T1==cGFydG5lcl9pZD00Njc2MTY3MiZzaWc9NTc1MWZhMTkzYmZjN2UxZGUzYjRlNWFjZmY4MWUwNDU4OGIzY2ZhZTpzZXNzaW9uX2lkPTJfTVg0ME5qYzJNVFkzTW41LU1UVTVOekUyTkRVMk1UQTBOWDR4Ym1aTVQzUXZWems0T0ZCdFFrbG5hVkl6WlVKSk5WTi1VSDQmY3JlYXRlX3RpbWU9MTU5NzE2NDU2MSZub25jZT0wLjIwMzU5Mzg0MDI5NzE2Nzc2JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE1OTcyNTA5NjEmY29ubmVjdGlvbl9kYXRhPXVzZXJuYW1lJTNERG9jdG9yJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";
  };

  componentDidUpdate() {
    // console.log("prev props getDerivedStateFromProps", props);
    console.log("props componentDidUpdate", this.props);
    // console.log("state getDerivedStateFromProps ", state);
    // const apiKey = "46761672";

    // const sessionHelper = createSession({
    //   apiKey: apiKey,
    //   sessionId: props.sessionDetails.data.sessionId,
    //   token: props.sessionDetails.data.token,
    //   onStreamsUpdated: (streams) => {
    //     this.setState({ streams });
    //   },
    // });

    // const sessionHelper = "";

    // this.state.sessionHelper = sessionHelper;
  }

  // componentWillReceiveProps() {
  //   // console.log("prev props getDerivedStateFromProps", props);
  //   console.log("props component Will receive", this.props);
  //   // console.log("state getDerivedStateFromProps ", state);
  //   // const apiKey = "46761672";

  //   // const sessionHelper = createSession({
  //   //   apiKey: apiKey,
  //   //   sessionId: props.sessionDetails.data.sessionId,
  //   //   token: props.sessionDetails.data.token,
  //   //   onStreamsUpdated: (streams) => {
  //   //     this.setState({ streams });
  //   //   },
  //   // });

  //   // const sessionHelper = "";

  //   // this.state.sessionHelper = sessionHelper;
  // }

  componentDidMount() {
    console.log("componentDidMount", this.props);
  }
  render() {
    const apiKey = "46761672";

    const {
      error,
      connection,
      publishVideo,
      publishAudio,
      subscriberVideo,
    } = this.state;
    return (
      <React.Fragment>
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
                    <CardBody>
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
                      {/* <div className="publisher-name">Name</div> */}

                      {this.state.streams.map((stream) => {
                        return (
                          <OTSubscriber
                            properties={{
                              width: "100%",
                              height: "100%",
                              style: { buttonDisplayMode: "off" },
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
                  className="doc-mini-scale"
                  id="subscribers"
                >
                  {subscriberVideo ? (
                    <Card>
                      <CardBody>
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
                            onClick={() => {
                              this.props.getSession();
                            }}
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
                        <OTPublisher
                          properties={{
                            width: "100%",
                            height: "100%",
                            style: { buttonDisplayMode: "off" },
                            publishVideo,
                            publishAudio,
                          }}
                          session={this.state.sessionHelper.session}
                          onPublish={this.onPublish}
                          onError={this.onPublishError}
                          eventHandlers={this.publisherEventHandlers}
                        ></OTPublisher>
                      </CardBody>
                    </Card>
                  ) : null}
                </Col>
              </Row>
            </Col>
            <Col md="12" lg="8" xl="8" className="doc-video-form">
              <Card>
                <CardHeader>
                  <CardTitle> Form</CardTitle>
                </CardHeader>

                <CardBody></CardBody>
              </Card>
            </Col>
          </Row>
          {/* </OTSession> */}
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  console.log("state redux", state);
  const { sessionDetails } = state;
  return {
    sessionDetails: sessionDetails,
  };
};

export default connect(mapStateToProps, { getSession })(VideoChat);
