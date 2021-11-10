import React from "react";
import * as Icon from "react-feather";
const navigationConfig = [
  /*  {
    id: "dashboard",
    title: "Dashboard",
    type: "item",
    icon: <Icon.Home size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/",
  }, */

  /*{
    id: "scheduling",
    title: "Scheduling",
    type: "item",
    icon: <Icon.Calendar size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/scheduling",
  },*/
  {
    id: "send-invite",
    title: "Send Invite",
    type: "item",
    icon: <Icon.Mail size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/send-invite",
  },
  {
    id: "patient-intake-form",
    title: "Intake Form",
    type: "item",
    icon: <Icon.FileText size={20} />,
    permissions: ["patient"],
    navLink: "/patient-intake",
    collapsed: true,
  },
  {
    id: "patient-scheduling",
    title: "Urgent Care",
    type: "item",
    icon: <Icon.Clock size={20} />,
    permissions: ["patient"],
    navLink: "/patient-scheduling",
    collapsed: true,
  },
  {
    id: "scheduling",
    title: "Scheduling",
    type: "item",
    icon: <Icon.Calendar size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/scheduling",
  },
  {
    id: "documentation-management",
    title: "Documentation Management",
    type: "item",
    icon: <Icon.FileText size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/documentation-management",
  },
  {
    id: "video-session-logs",
    title: "Logs",
    type: "item",
    icon: <Icon.FileText size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/video-session-logs",
  },

  // {
  //   id: "waiting-room",
  //   title: "Waiting Room",
  //   type: "item",
  //   icon: <Icon.Clock size={20} />,
  //   permissions: ["admin"],
  //   navLink: "/waiting-room",
  // },
];

export default navigationConfig;
