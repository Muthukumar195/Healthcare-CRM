import React from "react";
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
      forceDisconnet: false,
      streams: [],
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
      this.sessionHelper.disconnect();
    }
  };

  componentWillMount() {
    this.sessionHelper = createSession({
      apiKey: "46761672",
      sessionId:
        "1_MX40Njc2MTY3Mn5-MTU5NzA0ODc2Mzg3NH4xUWhCQnBDVFpIQlF6bm5NTmhRbDFTejd-UH4",
      token:
        "T1==cGFydG5lcl9pZD00Njc2MTY3MiZzaWc9ZTlhYjRkNWI4MDk0NDg5MjMxMGY5ZDVmOWU2NWUxZjM2MmY1NGJkMzpzZXNzaW9uX2lkPTFfTVg0ME5qYzJNVFkzTW41LU1UVTVOekEwT0RjMk16ZzNOSDR4VVdoQ1FuQkRWRnBJUWxGNmJtNU5UbWhSYkRGVGVqZC1VSDQmY3JlYXRlX3RpbWU9MTU5NzA0ODc2NCZub25jZT0wLjY4NjEzNTkyNDU4NDI4ODgmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTU5NzEzNTE2NCZjb25uZWN0aW9uX2RhdGE9dXNlcm5hbWUlM0REb2N0b3ImaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=",
      onStreamsUpdated: (streams) => {
        this.setState({ streams });
      },
    });

    console.log(this.sessionHelper);
  }

  render() {
    const apiKey = "46761672";
    const sessionId =
      "1_MX40Njc2MTY3Mn5-MTU5NzA0ODc2Mzg3NH4xUWhCQnBDVFpIQlF6bm5NTmhRbDFTejd-UH4";
    const token =
      "T1==cGFydG5lcl9pZD00Njc2MTY3MiZzaWc9ZTlhYjRkNWI4MDk0NDg5MjMxMGY5ZDVmOWU2NWUxZjM2MmY1NGJkMzpzZXNzaW9uX2lkPTFfTVg0ME5qYzJNVFkzTW41LU1UVTVOekEwT0RjMk16ZzNOSDR4VVdoQ1FuQkRWRnBJUWxGNmJtNU5UbWhSYkRGVGVqZC1VSDQmY3JlYXRlX3RpbWU9MTU5NzA0ODc2NCZub25jZT0wLjY4NjEzNTkyNDU4NDI4ODgmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTU5NzEzNTE2NCZjb25uZWN0aW9uX2RhdGE9dXNlcm5hbWUlM0REb2N0b3ImaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";

    const { error, connection, publishVideo, publishAudio } = this.state;
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
                              <Icon.Video size={14} className="fonticon-wrap" />
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
                      <OTPublisher
                        properties={{
                          width: "100%",
                          height: "100%",
                          style: { buttonDisplayMode: "off" },
                          publishVideo,
                          publishAudio,
                        }}
                        session={this.sessionHelper.session}
                        onPublish={this.onPublish}
                        onError={this.onPublishError}
                        eventHandlers={this.publisherEventHandlers}
                      ></OTPublisher>
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
                      <div className="fonticon-wrap cursor-pointer pos-rt">
                        <Icon.X size={18} className="fonticon-wrap" />
                      </div>
                      {this.state.streams.map((stream) => {
                        return (
                          <OTSubscriber
                            properties={{
                              width: "100%",
                              height: "100%",
                              style: { buttonDisplayMode: "off" },
                            }}
                            key={stream.id}
                            session={this.sessionHelper.session}
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

export default VideoChat;
