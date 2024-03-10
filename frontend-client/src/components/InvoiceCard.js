import React from "react";
import { Link } from "react-router-dom";

const InvoiceCard = (props) => {
  const {
    _id,
    invoiceNumber,
    invoiceDate,
    dueDate,
    paymentStatus,
    totalAmount,
    clientId,
  } = props.invoice;

  return (
    <Link to={`${_id}`} className="invoice-card-link">
    <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="invoice-card border p-3 mb-3 rounded">
          <div className="row">
            <div className="col-md-5 text-center">
              <h6 className="text-primary">#000{invoiceNumber}</h6>
              <h3 className="client-id">{clientId}</h3>
              <p className="mb-0">Invoice Date: <span className="invoice-date">{invoiceDate}</span></p>
              <p>Due Date: <span className="due-date">{dueDate}</span></p>
            </div>
            <div className="col-md-7 text-end">
              <p className="text-muted mb-1">Payment Status: <span className="payment-status">{paymentStatus}</span></p>
              <h5 className="text-success">Total: $<span className="total-amount">{totalAmount}</span></h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  

    </Link>
  );
};

export default InvoiceCard;
