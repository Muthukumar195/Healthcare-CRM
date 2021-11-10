import SweetAlert from 'react-bootstrap-sweetalert';

import React, { Component } from 'react'

 class Alertfile extends Component {
     constructor(props) {
         super(props)
     
         this.state = {
            cancelAppointment:false,
            disconnectCall:false
         }
     
     }
     cancelAppointment = ()=>{
         this.setState({
            cancelAppointment: !this.state.cancelAppointment
         })
     }
     disconnectCall = ()=>{
        this.setState({
            disconnectCall: !this.state.disconnectCall
        })
    }
    render() {
        return (
            <div>
                <button     onClick={this.cancelAppointment}>Cancel Appointment</button>
                <br>
                </br>
                <button                 onClick={this.disconnectCall}>Disconnect Call</button>

                  <SweetAlert
                
                showCancel
                confirmBtnText="Yes"
                title={false}

                confirmBtnBsStyle="outline-primary py-50 px-1"
                cancelBtnBsStyle="outline-danger py-50 px-1"
                onConfirm={()=>{}}
                onCancel={this.cancelAppointment}
                show={this.state.cancelAppointment}
                >
               Are you want to cancel the appointment?
                    
                </SweetAlert>
                <SweetAlert
                
                showCancel
                confirmBtnText="Yes"
                cancelBtnBsStyle="outline-danger py-50 px-1"
                confirmBtnBsStyle="outline-primary py-50 px-1"
                title={false}
                onConfirm={()=>{}}

                onCancel={this.disconnectCall}
                show={this.state.disconnectCall}
                >  Are you want to disconnect the Call?
                </SweetAlert>
            </div>
        )
    }
}
export default  Alertfile 