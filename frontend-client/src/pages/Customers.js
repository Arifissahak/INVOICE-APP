import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getallClients, deleteClient } from "../features/cutomers/customerSlice";
import { AiFillDelete } from "react-icons/ai";
import ClientListCard from "../components/ClientListCard";
import CustomModal from "../components/CustomModal";

const Customers = () => {
  const [open, setOpen] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState("");
  const dispatch = useDispatch();
  const customerState = useSelector((state) => state.client.clients);

  const showModal = (clientId) => {
    setOpen(true);
    setClientIdToDelete(clientId);
  };

  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getallClients());
  }, [dispatch]);

  const deleteAClient = async (clientId) => {
    try {
      await dispatch(deleteClient(clientId));
      setOpen(false);
      setTimeout(() => {
        dispatch(getallClients());
      }, 100);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred"; // Get error message from response data or use a default message
      console.error("Error deleting client:", errorMessage);
      // dispatch(deleteClientFailed(errorMessage)); // Dispatch a custom action with the error message
    }
  };

  return (
    // <div>
    //   <h3 className="mb-4 title">Customers</h3>
    //   <div>
    //     {customerState.map((client) => (
    //       <div key={client._id}>
    //         <ClientListCard client={client} />
    //         <button
    //           className="ms-3 fs-3 text-danger bg-transparent border-0"
    //           onClick={() => showModal(client._id)}
    //         >
    //           <AiFillDelete />
    //         </button>
    //       </div>
    //     ))}
    //     <CustomModal
    //       hideModal={hideModal}
    //       open={open}
    //       performAction={() => deleteAClient(clientIdToDelete)}
    //       title="Are you sure you want to delete this client?"
    //     />
    //   </div>
    // </div>
    <div className="container">
  <h3 className="mb-4 title">Customers</h3>
  <div className="row">
    {customerState.map((client) => (
      <div key={client._id} className="col-lg-4 col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <ClientListCard client={client} />
            <button
              className="btn btn-danger mt-3"
              onClick={() => showModal(client._id)}
            >
              <AiFillDelete className="me-1" />
              Delete Client
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
  <CustomModal
    hideModal={hideModal}
    open={open}
    performAction={() => deleteAClient(clientIdToDelete)}
    title="Are you sure you want to delete this client?"
  />
</div>
  );
};

export default Customers;
