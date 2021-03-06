import React from "react"
import {
  NavItem,
  NavLink,
  UncontrolledTooltip,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  CustomInput
} from "reactstrap"
import * as Icon from "react-feather"
import { Link } from "react-router-dom"
import classnames from "classnames"
import AutoComplete from "../../../components/@vuexy/autoComplete/AutoCompleteComponent"
import { history } from "../../../history"
import { connect } from "react-redux"
import _ from "lodash";
import {
  loadSuggestions,
  updateStarred
} from "../../../redux/actions/navbar/Index"
import { setUrgentStatus  } from "../../../redux/actions/auth/loginActions"
import { cancleUrgentCareAppointments  } from "../../../redux/actions/doctorActions"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { ToastError, ToastSuccess, confirmAlert } from "../../../components";
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"

// a little function to help us with reordering the bookmarks
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

class NavbarBookmarks extends React.PureComponent {

   
  state = {
    showBookmarks: false,
    value: "",
    noSuggestions: false,
    isStarred: false,
    suggestions: [],
    starredItems: [],
    urgentCareStatus: false
  }

  updateBookmarks = false

  handleBookmarksVisibility = () => {
    this.setState({
      showBookmarks: !this.state.showBookmarks,
      value: "",
      suggestions: [],
      noSuggestions: false,
      starred: null,
      urget_care_status: []
    })
  }



  componentDidUpdate(prevProps) {
    if (
      prevProps.bookmarks.starred.length !== this.state.starredItems.length &&
      this.updateBookmarks === true
    ) {
      this.setState({ starredItems: this.props.bookmarks.starred })
      this.updateBookmarks = false
    } 
    if (this.props.urget_care_status != prevProps.urget_care_status) {
      if (this.props.urget_care_status.status) {
        ToastSuccess(this.props.urget_care_status.message)
        this.setState({urgentCareStatus: !this.state.urgentCareStatus})
      } else {
        if(this.props.urget_care_status.appointmentAvailable){
          confirmAlert({
            title: "Are you sure you want to Cancel the Urgent care appointment?"
          }, (status) => { 
            if (status) {
              this.props.cancleUrgentCareAppointments()
            }else{
              this.setState({urgentCareStatus: true})
            }
          })
        }else{
          ToastError(this.props.urget_care_status.message)
        } 
      }
    }
    if (this.props.cancelAppointmets != prevProps.cancelAppointmets) {
      if (this.props.cancelAppointmets.status) {
        this.props.setUrgentStatus(false)
      }
    }
  }

  componentDidMount() {
    
    let {
      bookmarks: { suggestions, starred },
      loadSuggestions
    } = this.props; 
    var UrgentCare = false;
    if(!_.isEmpty(this.props.user)){
      UrgentCare = this.props.user.isAvailableForUrgentCare
    }
    this.setState(
      {
        suggestions: suggestions,
        starredItems: starred,
        urgentCareStatus: UrgentCare
      },
      loadSuggestions()
    )
  }

  onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const starredItems = reorder(
      this.state.starredItems,
      result.source.index,
      result.destination.index
    )

    this.setState({
      starredItems
    })
  }

  renderBookmarks = () => {
    this.updateBookmarks = true
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="d-flex flex-sm-wrap flex-lg-nowrap draggable-cards">
              {this.state.starredItems.map((item, index) => {
                const IconTag = Icon[item.icon ? item.icon : "X"]
                return (
                  <Draggable
                    key={item.target}
                    draggableId={item.target}
                    index={index}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}>
                          <NavItem className="nav-item d-none d-lg-block">
                            <NavLink
                              tag="span"
                              id={item.target}
                              className="nav-link cursor-pointer"
                              onClick={() => history.push(item.link)}>
                              <IconTag size={21} />
                            </NavLink>
                            <UncontrolledTooltip
                              placement="bottom"
                              target={item.target}>
                              {item.title}
                            </UncontrolledTooltip>
                          </NavItem>
                        </div>
                      )
                    }}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }

  render() {
    let {
      bookmarks: { extraStarred, suggestions },
      sidebarVisibility,
      updateStarred,
      handleAppOverlay
    } = this.props

    const renderExtraStarred =
      extraStarred.length > 0
        ? extraStarred.map(i => {
          const IconTag = Icon[i.icon ? i.icon : null]
          return (
            <DropdownItem key={i.id} href={i.link}>
              <IconTag size={15} />
              <span className="align-middle ml-1">{i.title}</span>
            </DropdownItem>
          )
        })
        : null

    return (
      <div className="mr-auto float-left bookmark-wrapper d-flex align-items-center">
        <ul className="navbar-nav d-xl-none">
          <NavItem className="mobile-menu mr-auto">
            <NavLink
              className="nav-menu-main menu-toggle hidden-xs is-active"
              onClick={sidebarVisibility}>
              <Icon.Menu className="ficon" />
            </NavLink>
          </NavItem>
        </ul>
        <ul className="nav navbar-nav bookmark-icons">
          {/* {this.renderBookmarks()} */}
          {extraStarred.length > 0 ? (
            <NavItem>
              <NavLink tag="div">
                <UncontrolledDropdown>
                  <DropdownToggle tag="span">
                    <Icon.ChevronDown />
                  </DropdownToggle>
                  <DropdownMenu right>{renderExtraStarred}</DropdownMenu>
                </UncontrolledDropdown>
              </NavLink>
            </NavItem>
          ) : null}
          <NavItem
            className="nav-item d-none d-md-block d-lg-block"
            onClick={this.handleBookmarksVisibility}>
            {this.props.user != null && this.props.user.userRole == "admin" ? (
              <CustomInput
                type="switch"
                id="oucSwitch"
                name="oucSwitch"
                className="custom-switch-success"
                inline
               // defaultChecked={this.props.user.isAvailableForUrgentCare} 
                checked={this.state.urgentCareStatus} 
                onChange={() => {
                  //this.props.user.isAvailableForUrgentCare = !this.props.user.isAvailableForUrgentCare;             
                  this.props.setUrgentStatus(!this.state.urgentCareStatus)
                }}
              >
                <h5 className="switch-label">Available for Urgent Care</h5>
              </CustomInput>
            ) : null}
            {/* <NavLink>
              <Icon.Star className="text-warning" size={21} />
            </NavLink> 
            <div
              className={classnames("bookmark-input search-input", {
                show: this.state.showBookmarks
              })}>
              <div className="bookmark-input-icon">
                <Icon.Search size={15} className="primary" />
              </div>

              <AutoComplete
                suggestions={suggestions}
                className="form-control"
                filterKey="title"
                autoFocus={true}
                suggestionLimit={this.state.value.length ? 6 : 100}
                clearInput={this.state.showBookmarks}
                defaultSuggestions={true}
                onChange={e => this.setState({ value: e.target.value })}
                externalClick={e => this.setState({ showBookmarks: false })}
                onKeyDown={e => {
                  if (e.keyCode === 27 || e.keyCode === 13) {
                    this.setState({
                      showBookmarks: false
                    })
                    handleAppOverlay("")
                  }
                }}
                customRender={(
                  suggestion,
                  i,
                  filteredData,
                  activeSuggestion,
                  onSuggestionItemClick,
                  onSuggestionItemHover,
                  userInput
                ) => {
                  const IconTag = Icon[suggestion.icon ? suggestion.icon : "X"]
                  if (userInput.length) {
                    return (
                      <li
                        className={classnames(
                          "suggestion-item d-flex justify-content-between",
                          {
                            active:
                              filteredData.indexOf(suggestion) ===
                              activeSuggestion
                          }
                        )}
                        key={suggestion.target}
                        onClick={e => {
                          if (!this.state.showBookmarks) {
                            e.stopPropagation()
                          }
                        }}>
                        <Link
                          to={suggestion.link}
                          className="component-info w-100"
                          onClick={() =>
                            this.setState({ showBookmarks: false })
                          }>
                          <IconTag size={15} />
                          <span className="align-middle ml-1">
                            {suggestion.title}
                          </span>
                        </Link>
                        <Icon.Star
                          className={classnames({
                            "text-warning": suggestion.starred === true
                          })}
                          size={17}
                          onClick={e => {
                            updateStarred(suggestion)
                            e.stopPropagation()
                          }}
                        />
                      </li>
                    )
                  } else {
                    return suggestion.starred === true ? (
                      <li
                        key={suggestion.target}
                        className={classnames(
                          "suggestion-item d-flex justify-content-between",
                          {
                            active:
                              filteredData.indexOf(suggestion) ===
                              activeSuggestion
                          }
                        )}
                        onClick={e => {
                          if (!this.state.showBookmarks) {
                            e.stopPropagation()
                          }
                        }}>
                        <Link
                          to={suggestion.link}
                          className="component-info w-100"
                          onClick={e =>
                            this.setState({ showBookmarks: false })
                          }>
                          <IconTag size={15} />
                          <span className="align-middle ml-1">
                            {suggestion.title}
                          </span>
                        </Link>
                        <Icon.Star
                          className={classnames({
                            "text-warning": suggestion.starred === true
                          })}
                          size={17}
                          onClick={e => {
                            updateStarred(suggestion)
                            e.stopPropagation()
                          }}
                        />
                      </li>
                    ) : null
                  }
                }}
                onSuggestionsShown={userInput => {
                  if (this.state.showBookmarks) {
                    handleAppOverlay(userInput)
                  }
                }}
              />
            </div>
             */}
          </NavItem>
        </ul>
      </div>
    )
  }
}
const mapStateToProps = state => { 
  return {
    bookmarks: state.navbar,
    urget_care_status: state.auth.login.urget_care_status,
    cancelAppointmets: state.doctor.cancelAppointmets
  }
}

export default connect(mapStateToProps, { loadSuggestions, updateStarred, setUrgentStatus, cancleUrgentCareAppointments })(
  NavbarBookmarks
)
