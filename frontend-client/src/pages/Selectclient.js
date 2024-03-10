import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getallClients, selectClient } from "../features/cutomers/customerSlice";
import { useNavigate } from "react-router-dom";

const Selectclient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Fetch clients from Redux store
  const clients = useSelector((state) => state.client.clients);

  useEffect(() => {
    dispatch(getallClients());
  }, [dispatch]);

  // Formik for managing form state
  const formik = useFormik({
    initialValues: {
      selectedClient: "", // Selected client ID
    },
    validationSchema: yup.object().shape({
      selectedClient: yup.string().required("Please select a client"),
    }),
    onSubmit: (values) => {
        dispatch(selectClient(values))
        navigate("/admin/client/add-invoice");
    },
  });

  return (
    <div className="container">
  <div className="row">
    <div className="col-md-6 offset-md-3">
      <h1 className="mb-4">Select Client</h1>
      <form onSubmit={formik.handleSubmit}>
        {/* Dropdown to select a client */}
        <div className="form-group">
          <select
            className="form-control"
            name="selectedClient"
            value={formik.values.selectedClient}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.username}
              </option>
            ))}
          </select>
          {/* Display error message if client selection is invalid */}
          {formik.touched.selectedClient && formik.errors.selectedClient && (
            <div className="text-danger">{formik.errors.selectedClient}</div>
          )}
        </div>
        {/* Button to submit the form */}
        <button type="submit" className="btn btn-primary mr-2">
          Next Step
        </button>
        {/* Button to navigate to "add-client" */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/admin/add-client")}
        >
          Add Client
        </button>
      </form>
    </div>
  </div>
</div>
  );
};

export default Selectclient;
