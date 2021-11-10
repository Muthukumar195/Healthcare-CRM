import React from "react"
import Router from "./Router"
import "./components/@vuexy/rippleButton/RippleButton"
import moment from 'moment-timezone';
import config from './configs/index'; 

import "react-perfect-scrollbar/dist/css/styles.css"
import "prismjs/themes/prism-tomorrow.css" 
 
// moment.tz.setDefault(config.timeZone);
const App = props => {
  return <Router />
}

export default App
