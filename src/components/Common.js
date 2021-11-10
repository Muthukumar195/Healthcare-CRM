import React, { Fragment } from "react";
import { Spinner } from "reactstrap";
import { toast } from "react-toastify";
import jpgImg from '../assets/img/icons/jpg.png'
import pdfImg from '../assets/img/icons/pdf.png'
import docImg from '../assets/img/icons/doc.png'
import xlsImg from '../assets/img/icons/xls.png'
import config from '../configs/index'
import { saveAs } from 'file-saver';
import moment from "moment";
import Swal from 'sweetalert2'
import _ from "lodash";
import { UAParser } from 'ua-parser-js';
import { post } from "./AjaxConfig";
import { AUDIT_LOG } from "../configs/ApiActionUrl";


const loadingButton = (button, isSubmitting, buttonTxt = "") => {
  let txt = (buttonTxt) ? buttonTxt : 'Loading...';
  if (isSubmitting) {
    return (
      <Fragment>
        <Spinner color="white" size="sm" />
        <span className="ml-50">{txt}</span>
      </Fragment>
    )
  }
  return button;
}

const getOS = () => {
  let parser = new UAParser();
  var OS = parser.getOS();
  return OS['name'] + "/" + OS['version'];

}

const getBrowser = () => {
  let parser = new UAParser();
  var browser = parser.getBrowser();
  return browser['name'] + "/" + browser['version'];
}

const GeoCurrentPosition = (callback) => {
  navigator.geolocation.getCurrentPosition((position) => {
    //  console.log("Latitude is :", position.coords.latitude);
    //  console.log("Longitude is :", position.coords.longitude);  
    callback({ lat: position.coords.latitude, lng: position.coords.longitude })
  });
}

const FormikActions = (actions = {}) => {
  return actions
}
const ToastMessage = (response) => {
  if (!_.isEmpty(response)) {
    if (response.status && !_.isEmpty(response.message)) {
      toast.success(response.message, {
        autoClose: 1500, pauseOnFocusLoss: false
      });
    } else if (!_.isEmpty(response.message)) {
      toast.error(response.message, {
        autoClose: 1500, pauseOnFocusLoss: false
      });
    }
  }
}
const ToastSuccess = (message) => {
  if (!_.isEmpty(message)) {
    toast.success(message, {
      autoClose: 1500, pauseOnFocusLoss: false
    });
  }

}
const ToastError = (message) => {
  if (!_.isEmpty(message)) {
    toast.error(message, {
      autoClose: 5000, pauseOnFocusLoss: false
    });
  }

}
const confirmAlert = (options, callback) => {
  Swal.fire({
    title: (options.title) ? options.title : 'Are you sure?',
    text: (options.text) ? options.text : '',
    icon: (options.icon) ? options.icon : 'warning',
    showCancelButton: true,
    confirmButtonText: (options.confirmText) ? options.confirmText : 'Yes',
    cancelButtonText: (options.cancelText) ? options.cancelText : 'No',
  }).then((result) => {
    if (result.value) {
      callback(true)
    } else {
      callback(false)
    }
  })
}

const getExtensionImg = (ext) => {
  let extention = ext.split('.');
  switch (extention[extention.length - 1]) {
    case 'jpg':
      return jpgImg;
    case 'pdf':
      return pdfImg;
    case 'doc':
      return docImg;
    case 'xls':
      return xlsImg;
    case 'xlsx':
      return xlsImg;
    default:
      return docImg;
  }
}
const downloadFile = (folderName, fileName) => {
  var blob = new Blob([`${config.apiBaseUrl}${folderName}/${fileName}`], { type: "application/octet-stream;charset=utf-8" });
  saveAs(blob, fileName);
}

const internetSpeed = (callback) => {
  var userImageLink = "https://telescrubs.com/wp-content/uploads/2020/09/mock-scaled.jpg";
  var time_start = new Date().getTime();
  var downloadImgSrc = new Image();
  downloadImgSrc.onload = () => {
    var end_time = new Date().getTime();
    var timeDuration = (end_time - time_start) / 1000;
    var downloadSize = 800000;
    var loadedBits = downloadSize * 8;
    var bps = (loadedBits / timeDuration).toFixed(2);
    var speedInKbps = (bps / 1024).toFixed(2);
    var speedInMbps = (speedInKbps / 1024).toFixed(2);
    callback({ speedInKbps, speedInMbps })
  };

  var cacheBuster = "?nnn=" + new Date().getTime();
  downloadImgSrc.src = userImageLink + cacheBuster;
}

const getTimeList = () => {
  var timeList = [];
  var clk = 0;
  var ante = "AM";
  for (var i = 0; i < 24; i++) {
    if (clk == 12) { clk = 12; ante = "PM"; }
    if (clk == 13) { clk = 1; ante = "PM"; }
    if (clk == 0) { clk = 12; ante = "AM"; }
    timeList.push({ value: clk, index: ante, rangeList: [] });
    var mins = 0;
    for (var r = 0; r < 6; r++) {
      var startTime = timeList[i].value;
      var endTime = startTime;
      if (r === 5) {
        endTime = (startTime + 1 == 13) ? '1' : (startTime + 1);
      }
      timeList[i].rangeList.push({
        start: `${startTime}:${(r === 0) ? '00' : mins}`,
        end: `${endTime}:${(r === 5) ? '00' : (mins + 10)}`,
        ante: ante
      })
      mins += 10
    }
    if (clk == 12 && ante == "AM") {
      clk = 0;
    }
    clk++;
  }
  return timeList;
};

const isWithinTime = (time) => {
  var now = moment().format('HH:mm');
  var end = moment(time, 'hh:mm A').format('HH:mm');

  if (now.toString() > end.toString()) {
    return false;
  }
  return true;
}


const TableLoading = props => {
  return (
    <div className=""> 
     {props.loading?<Spinner color="primary" size="lg"/> : "There are no records to display" }
    </div>
  )
}

const boolTOString = (bool) => {
  return (bool) ? "T" : "F";
}

const auditLog = (action, message="")=>{
  internetSpeed((speed)=>{
   var logData = {
     speed: parseInt(speed.speedInKbps),
     action: action,
     message:message
   } 
   post(AUDIT_LOG, logData)
    .then((response) => {
      console.log("Audit Logged")
    })
    .catch((error) => {
     // errorHandling(error.response);
     console.log("Audit Log error")
    });
  }) 
}

const crossTxt = (txt)=>{ 
  var AtSymbol = txt.indexOf("@");
  if(AtSymbol > 0){
   var posText = txt.substr((AtSymbol/2), (AtSymbol-(AtSymbol/2)));
   var maskedTest = txt.replace(posText, "XXXX"); 
   return maskedTest;
  }else{
   return txt.replace(/[^0-5\.]+/g, 'X');
  } 
 }



 const isSlotAvailable = (availabilities, date, time) => {
  var day = moment(date).format("dddd");
  var format = 'HH:mm:ss';
  var startTime = moment(moment(time, ["hh:mm A"]).format(format), format);
  var endTime = moment(moment(time, ["hh:mm A"]).format(format), format);
  var isAvailable = false; 
  _.forEach(availabilities, (avail) => {
    console.log(avail)
    if (!avail.availablity[day].dayOff) {
      _.forEach(avail.availablity[day].timeSlot, (slot) => {
        if (moment(slot.from).format(format) > moment(slot.to).format(format)) {
          var fromStart = moment(moment(slot.from).format(format), format);
          var fromEnd = moment(moment("23:59:59", "HH:mm:ss").format(format), format);
          var toStart = moment(moment("00:00:00", "HH:mm:ss").format(format), format);
          var toEnd = moment(moment(slot.to).format(format), format);
          if ((startTime.isBetween(fromStart, fromEnd, null, '[]') && endTime.isBetween(fromStart, fromEnd, null, '[]')) ||
            (startTime.isBetween(toStart, toEnd, null, '[]') && endTime.isBetween(toStart, toEnd, null, '[]')) ||
            moment(time, ["hh:mm A"]).format(format) == "00:00:00") {
            isAvailable = true;
          }
        } else {
          var startSlotTime = moment(moment(slot.from).format(format), format);
          var endSlotTime = moment(moment(slot.to).format(format), format);
          if (startTime.isBetween(startSlotTime, endSlotTime, null, '[]') && endTime.isBetween(startSlotTime, endSlotTime, null, '[]')) {
            isAvailable = true;
          }
        }
      })
    }
  })
  return isAvailable;
}



export { loadingButton, GeoCurrentPosition, FormikActions, ToastMessage, confirmAlert, getExtensionImg, downloadFile, ToastError, ToastSuccess, internetSpeed, getTimeList, isWithinTime, getOS, getBrowser, TableLoading, auditLog, crossTxt, boolTOString, isSlotAvailable }

