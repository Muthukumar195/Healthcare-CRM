import React from "react"
import { Card, CardHeader, CardTitle, CardBody, Collapse } from "reactstrap"
import { ChevronDown } from "react-feather"
import classnames from "classnames"

const collapseItems = [
  {
    id: 1,
    title: "What is video conferencing?",
    content:
      "Video conferencing is two-way interactive communication delivered using telephone or Internet technologies that allows people at different location to come together for a meeting. The video conference can be as simple as a conversation between two people in private offices (point-to-point) or involve several sites (multi-point) with more than one person in large rooms at different sites."
  },
  {
    id: 2,
    title: "What are the benefits of video conferencing?",
    content:
      "Video conferencing saves travel time and money. Participants can see and hear all other participants and communicate both verbally and visually, creating a face-to-face experience. PowerPoint and other on screen graphic, as well as other cameras are also available presentation options. People downtime is reduced and productivity gains are achieved by removing the logistics of flight preparations, airport delays, hotel stays, and all the other inconveniences of business travel. In distance education, video conferencing provides quality access to students who could not travel to or could afford to relocate to a traditional campus. Video conferences can also be recorded and made available in a variety of ways, e.g., DVDs, streaming video. Besides distance education, other applications include meetings, dissertation and thesis defenses, telemedical procedures, and online conferences."
  },
  {
    id: 3,
    title: "Can I video conference from home? My office? A hotel? ",
    content:
      "Technically, the answer is yes. A USB camera, a microphone, and video conferencing software can turn your computer into a video conferencing system. In actual practice, however, it can be difficult to accomplish. The main stumbling blocks are adequate bandwidth and firewalls.  For high-stakes video conferences, such as job interviews, dissertations, etc., testing with the same equipment, Internet connection, and software you intend to use on the day of your conference and connecting with the far-point(s) is recommended."
  },
  {
    id: 4,
    title: "What network bandwidth and type enables a quality video conference?",
    content:
      "The quality of a video conference primarily depends on the characteristics of the network connection between the conferencing sites. In the H.323 world, a high-quality conference (excellent audio and video) needs about 768 kbps (kilobits/second) of bandwidth on a switched network. On campus, this is possible since most network connections are 100 Mbps (megabits/second). When a video conference includes an off-campus site then the type of network connection, the bandwidth between sites, and firewalls must be considered."
  },
  {
    id: 5,
    title: "How can I contact customer support?",
    content:
      "If you have read our FAQs and still require further assistance, you can contact us via e-Mail here"
  },
  {
    id: 6,
    title:
      "How do I call someone on their mobile in Telescrubs?",
    content:
      "If the end users need to pay to see the end product, you need an Extended License. There can be more than one end user as long as there is only one end product. Example: A website that requires money before you can access the content."
  },
  {
    id: 7,
    title: "Which license do I need to use an item in a commercial?",
    content:
      "You only need a Regular License where the end product is an advertisement, as the audience does not have to pay to view it. It doesn't matter if the advertisement is for things that are being sold. Example: An After Effects template used to produce a TV commercial would only need the Regular License."
  },
  {
    id: 8,
    title: "Can I re-distribute an item? What about under an Extended License?",
    content:
      "No. You can't license items and then make them available to others 'as-is' (that is, as a stand-alone item or as stock), regardless of which license you purchase. Example: You can't buy a business card template and distribute it as a template, source files and all."
  },
  {
    id: 9,
    title: "Can multiple people within my company have access to the item?",
    content:
      "Yes. If you purchased a single-use license, access should only be given to people working on the single end product incorporating that item."
  },
  {
    id: 10,
    title: "Can I store the item on an intranet so everyone has access?",
    content:
      "No, items must be stored in a location where only those who need them have access. If you purchased a single-use license, once the item has been used in a single end product, the only place you should store it is in the archive files for that end product."
  },
  {
    id: 11,
    title: "What to do if connect lost? How to revoke the same video call?",
    content:
      "No. This only applies to items with real-world products and trademarks in the actual item. This is most likely in product mock-ups (graphics items), product promos (motion graphics project files) and 3D items. This does not apply to PhotoDune items, which are available for commercial use. This also does not apply to images of products and trademarks used illustratively in item previews, as they're not included in the item you download."
  },
  {
    id: 12,
    title: "What does 'Telescrubs Platform' mean?",
    content:
      "Editorial use means using an item only for news or journalistic purposes like in blogs, magazine and newspaper editorial applications."
  },
  {
    id: 13,
    title: "How to TeleVisit With own EMR ?",
    content:
      "Yes. Royalty free means you pay for the item once for each end product, and you don't need to pay any additional or ongoing fees for each person who sees or uses it. This is separate to whether you need a clearance from the owner of rights in the real world product or trademark within an item."
  }
]

class FaqQuestions extends React.Component {
  state = {
    collapseID: "",
    status: "Closed"
  }

  toggleCollapse = collapseID => {
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }))
  }

  onEntered = id => {
    if (id === this.state.collapseID) this.setState({ status: "Opened" })
  }
  onEntering = id => {
    if (id === this.state.collapseID) this.setState({ status: "Opening..." })
  }

  onExited = id => {
    if (id === this.state.collapseID) this.setState({ status: "Closed" })
  }

  onExiting = id => {
    if (id === this.state.collapseID) this.setState({ status: "Closing..." })
  }

  render() {
    const accordionMarginItems = collapseItems.map(collapseItem => {
      if (this.props.value > 0) {
        return (
          <div
            className="collapse-margin accordion vx-collapse"
            key={collapseItem.id}
          >
            <Card
              onClick={() => this.toggleCollapse(collapseItem.id)}
              className={classnames("shadow-none", {
                "collapse-collapsed":
                  this.state.status === "Closed" &&
                  this.state.collapseID === collapseItem.id,
                "collapse-shown":
                  this.state.status === "Opened" &&
                  this.state.collapseID === collapseItem.id,
                closing:
                  this.state.status === "Closing..." &&
                  this.state.collapseID === collapseItem.id,
                opening:
                  this.state.status === "Opening..." &&
                  this.state.collapseID === collapseItem.id
              })}
            >
              <CardHeader>
                <CardTitle className="lead collapse-title collapsed text-truncate w-75">
                  {collapseItem.title}
                </CardTitle>
                <ChevronDown className="collapse-icon" size={15} />
              </CardHeader>
              <Collapse
                isOpen={collapseItem.id === this.state.collapseID}
                onEntering={() => this.onEntering(collapseItem.id)}
                onEntered={() => this.onEntered(collapseItem.id)}
                onExiting={() => this.onExiting(collapseItem.id)}
                onExited={() => this.onExited(collapseItem.id)}
              >
                <CardBody className="pt-0">{collapseItem.content}</CardBody>
              </Collapse>
            </Card>
          </div>
        )
      } else if (collapseItem.title.toLowerCase().includes(this.props.value)) {
        return (
          <div
            className="collapse-margin accordion vx-collapse"
            key={collapseItem.id}
          >
            <Card
              onClick={() => this.toggleCollapse(collapseItem.id)}
              className={classnames("shadow-none", {
                "collapse-collapsed":
                  this.state.status === "Closed" &&
                  this.state.collapseID === collapseItem.id,
                "collapse-shown":
                  this.state.status === "Opened" &&
                  this.state.collapseID === collapseItem.id,
                closing:
                  this.state.status === "Closing..." &&
                  this.state.collapseID === collapseItem.id,
                opening:
                  this.state.status === "Opening..." &&
                  this.state.collapseID === collapseItem.id
              })}
            >
              <CardHeader>
                <CardTitle className="lead collapse-title collapsed text-truncate w-75">
                  {collapseItem.title}
                </CardTitle>
                <ChevronDown className="collapse-icon" size={15} />
              </CardHeader>
              <Collapse
                isOpen={collapseItem.id === this.state.collapseID}
                onEntering={() => this.onEntering(collapseItem.id)}
                onEntered={() => this.onEntered(collapseItem.id)}
                onExiting={() => this.onExiting(collapseItem.id)}
                onExited={() => this.onExited(collapseItem.id)}
              >
                <CardBody className="pt-0">{collapseItem.content}</CardBody>
              </Collapse>
            </Card>
          </div>
        )
      }else{
        return null
      }
      
    })
    return <div> {accordionMarginItems}</div>
  }
}
export default FaqQuestions
