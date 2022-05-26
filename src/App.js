import React, { useReducer } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const validationSchema = yup.object({
  title: yup
    .string("Enter your event title")
    .required("Event title is required"),
  start: yup.string("Enter your start time").required("start time is required"),
  end: yup.string("Enter your end time").required("end time is required"),
});

const App = () => {
  const formik = useFormik({
    initialValues: {
      title: "",
      start: "",
      end: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch({
        type: "add",
        payload: values,
      });
      formik.handleReset();
    },
  });

  const memoizedReducer = React.useCallback((state, action) => {
    switch (action.type) {
      case "add":
        if (new Date(action.payload.start) >= new Date(action.payload.end)) {
          alert("Invalid date input");
          return state;
        }
        state.events.map((slot) => {
          if (
            (action.payload.start >= slot.start &&
              action.payload.start < slot.end) ||
            (action.payload.end > slot.start && action.payload.end <= slot.end)
          ) {
            alert("Conflicts with existing events");
            return state;
          } else {
            const stateEvent = { ...state };
            stateEvent.events.push({
              title: action.payload.title,
              start: action.payload.start,
              end: action.payload.end,
            });
            return stateEvent;
          }
        });
        break;
      default:
        return state;
    }
  }, []);

  const initialState = { events: [] };

  const [state, dispatch] = useReducer(memoizedReducer, initialState);

  return (
    <div className="d-flex justify-content-around">
      <form onSubmit={formik.handleSubmit}>
        <div className="d-flex flex-column gap-4 justify-content-center">
          <div>
            <span>Title</span>
            <TextField
              fullWidth
              id="title"
              name="title"
              placeholder="Enter Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </div>
          <div>
            <span>Start Time</span>
            <TextField
              fullWidth
              id="start"
              name="start"
              type={"datetime-local"}
              value={formik.values.start}
              onChange={formik.handleChange}
              error={formik.touched.start && Boolean(formik.errors.start)}
              helperText={formik.touched.start && formik.errors.start}
            />
          </div>
          <div>
            <span>End Time</span>
            <TextField
              fullWidth
              id="end"
              name="end"
              type={"datetime-local"}
              value={formik.values.end}
              onChange={formik.handleChange}
              error={formik.touched.end && Boolean(formik.errors.end)}
              helperText={formik.touched.end && formik.errors.end}
            />
          </div>
          <div className="d-flex justify-content-center">
            <Button color="primary" variant="contained" type="submit">
              Submit
            </Button>
          </div>
        </div>
      </form>
      <table className="table table-striped w-50">
        <thead>
          <tr>
            <th scope="col">Event No.</th>
            <th scope="col">Title</th>
            <th scope="col">Start Time</th>
            <th scope="col">End Time</th>
          </tr>
        </thead>
        <tbody>
          {state.events.map((event, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{event.title}</td>
              <td>{event.start}</td>
              <td>{event.end}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
