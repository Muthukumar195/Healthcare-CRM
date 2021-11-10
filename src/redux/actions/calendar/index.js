import axios from "axios"

export const fetchEvents = () => {
  return async dispatch => {
    // await axios
    //   .get("/api/apps/calendar/events")
    //   .then(response => {
    //     dispatch({ type: "FETCH_EVENTS", events: response.data })
    //   })
    //   .catch(err => console.log(err))
    dispatch({ type: "FETCH_EVENTS", events: [
      {
        id: 1,
        title: "My Event",
        start: new Date(),
        end: new Date(),
        label: "business",
        allDay: true,
        selectable: true
      }
    ] })
  }
}

export const handleSidebar = bool => {
  return dispatch => dispatch({ type: "HANDLE_SIDEBAR", status: bool })
}

export const addEvent = event => {
  return dispatch => {
    dispatch({ type: "ADD_EVENT", event })
  }
}
export const updateEvent = event => {
  return dispatch => {
    dispatch({ type: "UPDATE_EVENT", event })
  }
}

export const updateDrag = event => {
  return dispatch => {
    dispatch({ type: "UPDATE_DRAG", event })
  }
}

export const updateResize = event => {
  return dispatch => {
    dispatch({ type: "EVENT_RESIZE", event })
  }
}

export const handleSelectedEvent = event => {
  return dispatch => dispatch({ type: "HANDLE_SELECTED_EVENT", event })
}
