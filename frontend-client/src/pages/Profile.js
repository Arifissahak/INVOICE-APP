import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getaClient } from "./yourAuthSliceFile"; // Import the action to fetch user profile data

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Access user data from the Redux store



  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card mt-5">
            <div className="card-body">
              <h5 className="card-title">Profile</h5>
              {user && (
                <div>
                  <p>Name: {user.firstname} {user.lastname}</p>
                  <p>Email: {user.email}</p>
                  {/* Add more profile fields here */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
