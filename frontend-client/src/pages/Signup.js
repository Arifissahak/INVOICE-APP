import React from "react";

import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomInput from "../components/CustomInput";
import { register, resetState } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const signUpSchema = yup.object().shape({
  firstname: yup.string().required("First Name is Requried"),
  lastname: yup.string().required("Last Name is Requried"),
  email: yup.string().email("Enter Email").required("Email is Requried"),
  mobile: yup.string().required("Mobile Number is Requried"),
  password: yup.string().required("Password is Requried"),
});

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      password: "",
    },
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      dispatch(register(values))
      .then(() => {
        navigate("/"); // Navigate to "/" after logout is successful
        toast.success("Register Successfullly, Please login through here");
        dispatch(resetState()); // Reset the auth state
      })
      .catch((error) => {
        console.error("Logout failed:", error); // Handle logout failure
      });
      
    },
  });
  return (
    <>
      <div className="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="auth-card">
            <h3 className="text-center mb-3">Sign Up</h3>
            <form
              action=""
              onSubmit={formik.handleSubmit}
              className="d-flex flex-column gap-15"
            >
              <CustomInput
                type="text"
                name="firstname"
                label="First name"
                val={formik.values.firstname}
                onChng={formik.handleChange("firstname")}
                onBlr={formik.handleBlur("firstname")}
                id="firstname"
              />

              <div className="error">
                {formik.touched.firstname && formik.errors.firstname}
              </div>

              <CustomInput
                type="text"
                name="lastname"
                label="Last name"
                val={formik.values.lastname}
                onChng={formik.handleChange("lastname")}
                onBlr={formik.handleBlur("lastname")}
                id="lastname"
              />

              <div className="error">
                {formik.touched.lastname && formik.errors.lastname}
              </div>

              <CustomInput
                type="email"
                name="email"
                label="Email"
                val={formik.values.email}
                onChng={formik.handleChange("email")}
                onBlr={formik.handleBlur("email")}
                id="email"
              />

              <div className="error">
                {formik.touched.email && formik.errors.email}
              </div>
              <CustomInput
                type="tel"
                name="mobile"
                label="Mobile Number"
                val={formik.values.mobile}
                onChng={formik.handleChange("mobile")}
                onBlr={formik.handleBlur("mobile")}
                id="mobile"
              />

              <div className="error">
                {formik.touched.mobile && formik.errors.mobile}
              </div>
              <CustomInput
                type="password"
                name="password"
                label="Password"
                val={formik.values.password}
                onChng={formik.handleChange("password")}
                onBlr={formik.handleBlur("password")}
                id="password"
              />

              <div className="error">
                {formik.touched.password && formik.errors.password}
              </div>

              <div>
                <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                  <button className="button border-0" type="submit">
                    Sign Up
                  </button>
                </div>
                <div className="mb-3 text-end">
                  <Link to="/" className="button signup">
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
