import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getallInvoice } from "../features/invoice/invoiceSlice";
import InvoiceCard from "../components/InvoiceCard";

const Invoicelist = () => {
  const dispatch = useDispatch();
  const InvoiceState = useSelector((state) => state.invoice.invoice);

  useEffect(() => {
    dispatch(getallInvoice());
  }, [dispatch]);

  console.log("InvoiceState:", InvoiceState); // Add this line to check the value of InvoiceState

  return (
    <div>
      <h3 className="mb-4 title">Invoicelist</h3>
      <div>
        {InvoiceState && InvoiceState.length > 0 ? (
          InvoiceState.map((invoice, index) => (
            <InvoiceCard key={index} invoice={invoice} />
          ))
        ) : (
          <p>No invoices found</p>
        )}
      </div>
    </div>
  );
};

export default Invoicelist;
