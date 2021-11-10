import React from "react";
import { Button } from "reactstrap";
import { Plus } from "react-feather";
import { connect } from "react-redux";
import {
  handleSidebar,
  handleSelectedEvent,
} from "../../../redux/actions/calendar/index";
const AddEventButton = (props) => {
  return (
    <Button.Ripple
      color="primary"
      onClick={() => {
        props.onFormReset() 
        props.handleSelectedEvent(null);
      }}
      className="mb-1"
    >
      {" "}
      <Plus size={15} /> <span className="align-middle">Appointment</span>
    </Button.Ripple>
  );
};

export default connect(null, { handleSidebar, handleSelectedEvent })(
  AddEventButton
);
