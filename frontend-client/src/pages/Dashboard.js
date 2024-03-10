import React from "react";
import InvoiceCard from "../components/InvoiceCard";


const Dashboard = () => {
  const invoice = [
    {
      invoiceNumber: "3",
      invoiceDate: "2024-02-22",
      dueDate: "2024-02-22",
      paymentStatus: "Cash in hand",
      tax: 10,
      discount: 0,
      totalAmount: 400,
      clientId: "Arif",
      items: [
        {
          description: "bottle",
          unit: "1",
          quantity: 2,
          unitPrice: 100,
          taxPercentage: 10,
          tax: 10,
          discountPercentage: 0,
          discount: 0,
          amount: 200,
        },
        {
          description: "bucket",
          unit: "1",
          quantity: 2,
          unitPrice: 100,
          taxPercentage: 10,
          tax: 10,
          discountPercentage: 0,
          discount: 0,
          amount: 200,
        },
      ],
    },
  ];

  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="d-flex justify-content-between align-items-center gap-3 wallet-card p-3 rounded-3">
              <div>
                <p className="desc">Current Balance</p>
                <h4 className="mb-0 sub-title">$25,000.40</h4>
              </div>
              <div className="d-flex flex-column align-items-end">
                <p className="mb-0 desc">My Wallet</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="d-flex justify-content-between align-items-center gap-3 wallet-card p-3 rounded-3">
              <div>
                <p className="desc">Outstanding Balance</p>
                <h4 className="mb-0 sub-title">$1100</h4>
              </div>
              <hr className="d-lg-none" />
              <div>
                <p className="desc">Total Invoice</p>
                <h4 className="mb-0 sub-title">$45,000.40</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-end flex-grow-1 p-3 rounded-3">
          <h3 className="mb-5 title">Recent Activity</h3>
          <h3 className="mb-5 title">View All</h3>
        </div>
        <div>
          {/* <Column {...config} /> */}
          {invoice.map((invoice, index) => (
            <InvoiceCard key={index} invoice={invoice} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
