import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getaInvoice, deleteInvoice } from "../features/invoice/invoiceSlice";
import { AiFillDelete } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import CustomModal from "../components/CustomModal";

const Invoicebill = () => {
  const [open, setOpen] = useState(false);
  const [invoiceIdToDelete, setInvoiceIdToDelete] = useState(""); // Initialize state for invoice ID to delete
  const [clientIdToDelete, setClientIdToDelete] = useState(""); // Initialize state for client ID to delete
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getIvcId = location.pathname.split("/").pop();
  const invoiceState = useSelector((state) => state.invoice.invoice);
  const recipientName = useSelector((state) => {
    const { _id, firstname, lastname } = state.auth.user;
    return `${firstname} ${lastname}`;
  });

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const deleteAInvoice = async () => {
    try {
      await dispatch(
        deleteInvoice({ id: invoiceIdToDelete, username: clientIdToDelete })
      );
      setOpen(false);
      setTimeout(() => {
        navigate("/admin/invoice");
      }, 100);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred"; // Get error message from response data or use a default message
      console.error("Error deleting invoice:", errorMessage);
      // dispatch(deleteClientFailed(errorMessage)); // Dispatch a custom action with the error message
    }
  };
  useEffect(() => {
    dispatch(getaInvoice(getIvcId));
  }, [dispatch, getIvcId]);

  // Check if invoiceState is populated before rendering
  if (!invoiceState) return null;

  const {
    _id,
    invoiceNumber,
    invoiceDate,
    dueDate,
    clientId,
    paymentStatus,
    totalAmount,
    items,
  } = invoiceState;

  return (
    <div className="container">
      <div className="invoice-bill">
        <h2 className="mb-4">Invoice #{invoiceNumber}</h2>
        <div className="row mb-3">
          <div className="col-md-6">
            <p className="mb-1">
              Invoice Date: {new Date(invoiceDate).toLocaleDateString()}
            </p>
            <p className="mb-1">
              Due Date: {new Date(dueDate).toLocaleDateString()}
            </p>
            <p className="mb-1">Payment Status: {paymentStatus}</p>
            <p className="mb-1">Total Amount: ${totalAmount}</p>
          </div>
          <div className="col-md-6">
            <p className="mb-1">Recipient: {recipientName}</p>
            <p className="mb-1">Customer: {clientId}</p>
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Description</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
          {items && items.length > 0 ? (
    items.map((item) => (
      <tr key={item._id}>
        <td>{item.description}</td>
        <td>${item.unitPrice}</td>
        <td>{item.quantity}</td>
        <td>${item.amount}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4">No items found</td>
    </tr>
  )}
          </tbody>
        </table>

        <button
          className="btn btn-danger mt-3"
          onClick={() => {
            showModal();
            setInvoiceIdToDelete(_id);
            setClientIdToDelete(clientId);
          }} // Set invoiceIdToDelete and clientIdToDelete before showing the modal
        >
          <AiFillDelete className="me-1" />
          Delete Invoice
        </button>
        <CustomModal
          hideModal={hideModal}
          open={open}
          performAction={deleteAInvoice}
          title="Are you sure you want to delete this invoice?"
        />
      </div>
    </div>
  );
};

export default Invoicebill;
