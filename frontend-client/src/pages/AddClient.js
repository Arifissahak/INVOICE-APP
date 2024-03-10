import { React, useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { getallClients,createNewClient,deleteClient,getaClient, resetState  } from "../features/cutomers/customerSlice";

let schema = yup.object().shape({
    username: yup.string().required("User Name is Required"),
    email: yup.string().required("Email is Required"),
    mobile: yup.string().required("Mobile Number is Required"),
    tax: yup.string(),
    address: yup.string(),
    city: yup.string(),
    country: yup.string(),
    postelcode: yup.string(),
    aboutme: yup.string(),
  });

const AddClient = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const getClientName = location.pathname.split("/")[3];
    const newClient = useSelector((state) => state.client);
    const {
        isSuccess,
        isError,
        isLoading,
        createClients,
      } = newClient;
    //   useEffect(() => {
    //     if (getClientName !== undefined) {
    //       dispatch(getABlogCat(getClientName));
    //     } else {
    //       dispatch(resetState());
    //     }
    //   }, [getBlogCatId]);
    useEffect(() => {
        if (isSuccess && createClients) {
          toast.success("Client Added Successfullly!");
          navigate("/admin/customers");
        }
        if (isError) {
          toast.error("Something Went Wrong!");
        }
      }, [isSuccess, isError, isLoading]);
      const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: "",
            email:"",
            mobile:"",
            tax:"",
            address:"",
            city:"",
            country:"",
            postelcode:"",
            aboutme:""
        },
        validationSchema: schema,
        onSubmit: (values) => {
            dispatch(createNewClient(values));
            formik.resetForm();
            setTimeout(() => {
              dispatch(resetState());
            }, 300);
        },
      });
  return (
    <div>
        <h3 className="mb-4  title"> Add Client</h3>
        <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="username"
            onChng={formik.handleChange("username")}
            onBlr={formik.handleBlur("username")}
            val={formik.values.username}
            label="Enter Username"
            id="username"
          />
          <div className="error">
            {formik.touched.username && formik.errors.username}
          </div>
          <CustomInput
            type="text"
            name="email"
            onChng={formik.handleChange("email")}
            onBlr={formik.handleBlur("email")}
            val={formik.values.email}
            label="Enter email"
            id="email"
          />
          <div className="error">
            {formik.touched.email && formik.errors.email}
          </div>
          <CustomInput
            type="text"
            name="mobile"
            onChng={formik.handleChange("mobile")}
            onBlr={formik.handleBlur("mobile")}
            val={formik.values.mobile}
            label="Enter mobile"
            id="mobile"
          />
          <div className="error">
            {formik.touched.mobile && formik.errors.mobile}
          </div>
          <CustomInput
            type="text"
            name="tax"
            onChng={formik.handleChange("tax")}
            onBlr={formik.handleBlur("tax")}
            val={formik.values.tax}
            label="Enter tax"
            id="tax"
          />
          <CustomInput
            type="text"
            name="address"
            onChng={formik.handleChange("address")}
            onBlr={formik.handleBlur("address")}
            val={formik.values.address}
            label="Enter address"
            id="address"
          />
          <CustomInput
            type="text"
            name="city"
            onChng={formik.handleChange("city")}
            onBlr={formik.handleBlur("city")}
            val={formik.values.city}
            label="Enter city"
            id="city"
          />
          <CustomInput
            type="text"
            name="country"
            onChng={formik.handleChange("country")}
            onBlr={formik.handleBlur("country")}
            val={formik.values.country}
            label="Enter country"
            id="country"
          />
          <CustomInput
            type="text"
            name="postelcode"
            onChng={formik.handleChange("postelcode")}
            onBlr={formik.handleBlur("postelcode")}
            val={formik.values.postelcode}
            label="Enter postelcode"
            id="postelcode"
          />
          <CustomInput
            type="text"
            name="aboutme"
            onChng={formik.handleChange("aboutme")}
            onBlr={formik.handleBlur("aboutme")}
            val={formik.values.aboutme}
            label="Enter aboutme"
            id="aboutme"
          />
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            Add Client
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddClient