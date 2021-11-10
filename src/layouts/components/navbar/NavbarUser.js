import React, { useState } from "react";
import {
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Media,
  Badge,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import axios from "axios";
import * as Icon from "react-feather";
import classnames from "classnames";
import Autocomplete from "../../../components/@vuexy/autoComplete/AutoCompleteComponent";
import { history } from "../../../history";
import { ProfileImage } from "../../../configs/ApiActionUrl";
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from "moment";
import { loadingButton, ToastMessage, appointmentValidation, confirmAlert, auditLog, crossTxt } from "../../../components";

const handleNavigation = (e, path) => {
  e.preventDefault();
  history.push(path);
};
const UserDropdown = (props) => {
  const { user } = props;
  const [doctorlogout, doctorlog] = useState(false)
  const changeView =()=>{
    doctorlog(doctorlogout => !doctorlogout)
  } 

  return (
    <div>
    <DropdownMenu right>
      <DropdownItem
        tag="a"
        href="#"
        onClick={(e) => handleNavigation(e, "/my-profile")}
      >
        <Icon.User size={14} className="mr-50" />
        <span className="align-middle">My Profile</span>
      </DropdownItem>
      <DropdownItem
        tag="a"
        href="#"
        onClick={(e) => handleNavigation(e, "/my-availability")}
      >
        <Icon.UserCheck size={14} className="mr-50" />
        <span className="align-middle">My Availability</span>
      </DropdownItem>
      <DropdownItem
        tag="a"
        href="#"
        onClick={(e) => handleNavigation(e, "/change-password")}
      >
        <Icon.Lock size={14} className="mr-50" />
        <span className="align-middle">Change Password</span>
      </DropdownItem>
      {user != null && user.userRole == "admin" ? (
        <DropdownItem
          tag="a"
          href="#"
          onClick={(e) => handleNavigation(e, "/settings")}
        >
          <Icon.Settings size={14} className="mr-50" />
          <span className="align-middle">Settings</span>
        </DropdownItem>
      ) : null}
      <DropdownItem divider />
      <DropdownItem tag="a"
      //  onClick={(e) => props.logout(props.user.userRole)}
      onClick={() => {
          confirmAlert({
            title: "Are you sure you want to logout?"
          }, (status) => { 
            if (status) {
              auditLog("Logged out", `${crossTxt(props.user.email)}`)
              props.logout(props.user.userRole)
            }
          })
        
      }}       >
        <Icon.Power size={14} className="mr-50" />
        <span className="align-middle">Log Out</span>
      </DropdownItem>
    </DropdownMenu>
    </div>
  );
};

class NavbarUser extends React.PureComponent {
  state = {
    logoutmodal:false
  };
  logoutmodal = ()=>{
    this.setState({
       logoutmodal: !this.state.logoutmodal
    })
  }
  render() {
    return (
      <div>
      <ul className="nav navbar-nav navbar-nav-user float-right">
        {this.props.user != null && this.props.user.userRole != "admin" ? (
        <NavItem className="nav-item">
          <NavLink onClick={(e) => handleNavigation(e, "/patient-profile")}>
            <Icon.User size={18} className="mr-50" />
            <span className="align-middle">My Profile</span>
          </NavLink>
        </NavItem>
        ) : null}
        {this.props.user != null && this.props.user.userRole != "admin" ? (
        <NavItem className="nav-item">
          <NavLink onClick={(e) => handleNavigation(e, "/change-password")}>
            <Icon.Lock size={18} className="mr-50" />
            <span className="align-middle">Change Password</span>
          </NavLink>
        </NavItem>
        ) : null}
        {this.props.user != null && this.props.user.userRole != "admin" ? (
        <NavItem className="nav-item pr-50">
          <NavLink        onClick={() => {
                      if (this.state.logoutmodal !== true) {
                        confirmAlert({
                          title: "Are you sure you want to logout?"
                        }, (status) => {
                          if (status) {
                            auditLog("Logged out", `${crossTxt(this.props.user.email)}`)
                            this.props.logout(this.props.user.userRole)
                          }
                        })
                      } 
                    }}>
            <Icon.Power size={18} className="mr-50" />
            <span className="align-middle">Logout</span>
          </NavLink>
        </NavItem>
        ) : null}
        <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
          {this.props.user != null && this.props.user.userRole == "admin" ? (
          <DropdownToggle tag="a" className="nav-link dropdown-user-link">
            <div className="user-nav">
              <span className="user-name text-bold-600 mb-0 text-right">
                {this.props.userRole == "admin" ? (this.props.user.prefix !== '' &&  this.props.user.prefix !== null) ? this.props.user.prefix + ' ' :""  : null}
                {this.props.user !== null ? this.props.user.fullName  : null}
                { this.props.user.suffix !== null ? ',' + ' '+  this.props.user.suffix   : ''}

              </span>
              {/* <span className="user-status">Available</span> */}
            </div>
            <span data-tour="user">
              <img
                src={
                  this.props.user != null
                    ? this.props.user.profileImage != null
                      ? ProfileImage.path + this.props.user.profileImage
                      : this.props.userImg
                    : this.props.userImg
                }
                className="round"
                height="40"
                width="40"
                alt="avatar"
              />
            </span>
          </DropdownToggle>
          ) : null}
          {this.props.user != null && this.props.user.userRole == "admin" ? (
          <UserDropdown {...this.props} />
          ) : null}
        </UncontrolledDropdown>
      </ul>
      
         </div>
    );
  }
}

export default NavbarUser;
