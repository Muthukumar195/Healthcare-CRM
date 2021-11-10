import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { X } from "react-feather";

class ModalSearch extends Component {
    keyPress = (e) => {
        if (e.keyCode == 13) {
            console.log('value', e.target.value);
            // put the login here
            alert()
        }
    }
    render() {
        const { toggle, modal, handleChange, handleSubmit } = this.props
        const style = {
            background: 'rgba(0, 0, 0, 0.85)'
        };


        return (
            <div >

                <div className="modalSearch">
                    <div className="closeIcon cursor-pointer" onClick={toggle}>  <X size={15} /> </div>
                    <input placeholder="Search" className="form-control" onKeyDown={this.keyPress} /> </div>
            </div>
        )
    }
}
export default ModalSearch