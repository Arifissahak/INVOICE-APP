import React from "react";
import { Card } from "antd";

const ClientListCard = ({ client }) => {
  const { username, email, address } = client;

  return (
    <Card className="user-info-card" style={{ cursor: "pointer" }}>
      <div className="row">
        <div className="col-md-6">
          <h5>{username}</h5>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Address:</strong> {address}</p>
        </div>
      </div>
    </Card>
  );
};

export default ClientListCard;
