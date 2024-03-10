import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  getallClients,
  selectClient,
} from "../features/cutomers/customerSlice";
import { toast } from "react-toastify";
import { createNewInvoice, resetState } from "../features/invoice/invoiceSlice";
import { useLocation, useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  invoiceNumber: yup.string().required("Invoice Number is required"),
  invoiceDate: yup.string().required("Invoice Date is required"),
  dueDate: yup.string().required("Due Date is required"),
  paymentStatus: yup.string().required("Payment Status is required"),
  // clientId: yup.string().required("Client Name is required"),
  tax: yup.number(),
  discount: yup.number(),
  totalAmount: yup.number().required("Total Amount is required"),
  items: yup.array().of(
    yup.object().shape({
      description: yup.string().required("Description is required"),
      unit: yup.number().required("Unit is required"),
      quantity: yup.number().required("Quantity is required"),
      unitPrice: yup.number().required("Unit Price is required"),
      taxPercentage: yup.number(),
      discountPercentage: yup.number(),
      amount: yup.number().required("Amount is required"),
    })
  ),
});

const Addinvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const newInvoice = useSelector((state) => state.invoice);
  const { isSuccess, isError, isLoading, createInvoice } = newInvoice;

  const selectedClientId = useSelector((state) => state.client.selectedClient);
  let selectedClient = null; // Initialize selectedClient to null
  
  // Check if selectedClientId is defined before destructuring
  if (selectedClientId) {
    selectedClient = selectedClientId.selectedClient; // Assign selectedClient if selectedClientId is defined
    console.log("This is selected client: ", selectedClient);
  } else {
    console.log("selectedClientId is undefined");
  }

  useEffect(() => {
    if (isSuccess && createInvoice) {
      toast.success("Invoice Added Successfullly!");
      navigate("/admin/invoice");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);
  const generateInvoiceNumber = () => {
    return Math.floor(Math.random() * 1000000) + 1; // Generate a random number
  };

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [items, setItems] = useState([
    {
      description: "",
      unit: "",
      quantity: 0,
      unitPrice: 0,
      taxPercentage: 0,
      discountPercentage: 0,
      amount: 0,
    },
  ]);



  const formik = useFormik({
    initialValues: {
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: getCurrentDate(), // Pass as string
      dueDate: getCurrentDate(), // Pass as string
      // clientId: "",
      paymentStatus: "",
      tax: "",
      discount: "",
      totalAmount: "",
      items: items,
    },
    validationSchema: schema,
    onSubmit: (values, formik) => {
      console.log("in Submit", selectedClient);
    dispatch(createNewInvoice({ invoice: values, selectedClient }));
    toast.success("Invoice Added Successfullly!");
      navigate("/admin/invoice");
    formik.resetForm();
    setTimeout(() => {
      dispatch(resetState());
    }, 300);
  },
  });

  const customerState = useSelector((state) => state.client.clients);
  console.log(customerState);

  useEffect(() => {
    // dispatch(getallClients());
    // dispatch(selectClient());
    calculateTotalValues();
  }, [items, dispatch]);


  // Define handleItemChange function
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
    formik.setFieldValue("items", updatedItems);
    calculateTotalValues(); // Call the function to update total values
    // Calculate total amount for the current item
    let subtotal = 0;
    if (
      field === "unit" ||
      field === "quantity" ||
      field === "unitPrice" ||
      field === "taxPercentage" ||
      field === "discountPercentage"
    ) {
      // Recalculate subtotal if any of these fields change
      subtotal =
        updatedItems[index].unit *
        updatedItems[index].quantity *
        updatedItems[index].unitPrice;
    } else {
      // Otherwise, use the existing subtotal value
      subtotal = updatedItems[index].amount;
    }

    // Calculate tax amount if tax percentage is provided
    const taxAmount = updatedItems[index].taxPercentage
      ? (subtotal * updatedItems[index].taxPercentage) / 100
      : 0;

    // Calculate discount amount if discount percentage is provided
    const discountAmount = updatedItems[index].discountPercentage
      ? (subtotal * updatedItems[index].discountPercentage) / 100
      : 0;

    // Calculate total amount
    const totalAmount = subtotal + taxAmount - discountAmount;

    // Update amount for the current item
    updatedItems[index].tax = taxAmount;
    updatedItems[index].amount = totalAmount;
    updatedItems[index].discount = discountAmount;
    setItems(updatedItems);
     formik.setFieldValue(`items[${index}].tax`, taxAmount);
    formik.setFieldValue(`items[${index}].amount`, totalAmount);
    formik.setFieldValue(`items[${index}].discount`, discountAmount);
  };

  function calculateTotalValues() {
    let totalTax = 0;
    let totalDiscount = 0;
    let totalAmount = 0;

    // Iterate over items to calculate totals
    items.forEach((item) => {
      // Calculate subtotal for the current item
      const subtotal = item.unit * item.quantity * item.unitPrice;

      // Calculate tax amount for the current item
      const taxAmount = item.taxPercentage
        ? (subtotal * item.taxPercentage) / 100
        : 0;

      // Calculate discount amount for the current item
      const discountAmount = item.discountPercentage
        ? (subtotal * item.discountPercentage) / 100
        : 0;

      // Update total tax, discount, and amount
      totalTax += taxAmount;
      totalDiscount += discountAmount;
      totalAmount += subtotal + taxAmount - discountAmount;
    });

    // Update formik values
    formik.setFieldValue("tax", totalTax);
    formik.setFieldValue("discount", totalDiscount);
    formik.setFieldValue("totalAmount", totalAmount);
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        description: "", // Provide a default value for description
        unit: "",
        quantity: "",
        unitPrice: "",
        taxPercentage: "",
        discountPercentage: "",
        amount: "",
      },
    ]);
  };

  return (
    <div className="container-fluid">
    <div className="form-container">
      <h3>Add Invoice</h3>
      <form onSubmit={formik.handleSubmit}>
        <CustomInput
          type="text"
          name="invoiceNumber"
          onChng={formik.handleChange}
          onBlr={formik.handleBlur}
          val={formik.values.invoiceNumber}
          label="Invoice Number"
          id="invoiceNumber"
        />
        <CustomInput
          type="date"
          name="invoiceDate"
          onChng={(e) => formik.setFieldValue("invoiceDate", e.target.value)} // Convert date to string
          onBlur={formik.handleBlur}
          val={formik.values.invoiceDate}
          label="Invoice Date"
          id="invoiceDate"
        />
        <CustomInput
          type="date"
          name="dueDate"
          onChng={(e) => formik.setFieldValue("dueDate", e.target.value)} // Convert date to string
          onBlur={formik.handleBlur}
          val={formik.values.dueDate}
          label="Due Date"
          id="dueDate"
        />

        {/* <CustomInput
          type="select"
          name="clientId"
          onChng={handleClientIdChange}
          onBlr={formik.handleBlur}
          options={customerState.map((customer) => ({
            value: customer.username,
            label: customer.username,
          }))}
          val={formik.values.clientId}
          label="Customer Name"
          id="clientId"
        /> */}
        <CustomInput
          type="select"
          name="paymentStatus"
          onChng={formik.handleChange("paymentStatus")}
          onBlr={formik.handleBlur("paymentStatus")}
          options={[
            { value: "Cash in hand", label: "Cash in Hand" },
            { value: "Bank Transfer", label: "Bank Transfer" },
          ]}
          val={formik.values.paymentStatus}
          label="Payment Status"
          id="paymentStatus"
        />
        <CustomInput
          type="Number"
          name="tax"
          onChng={formik.handleChange}
          onBlr={formik.handleBlur}
          val={formik.values.tax}
          label="Tax Amount"
          id="tax"
        />
        <CustomInput
          type="Number"
          name="discount"
          onChng={formik.handleChange}
          onBlr={formik.handleBlur}
          val={formik.values.discount}
          label="discount Amount"
          id="discount"
        />
        <CustomInput
          type="Number"
          name="totalAmount"
          onChng={formik.handleChange}
          onBlr={formik.handleBlur}
          val={formik.values.totalAmount}
          label="Total Amount"
          id="totalAmount"
        />
       <button type="button" onClick={addItem} className="btn-add-item">
  Add Item
</button>
        {/* Iterate over items */}
        {/* <div className="item-container">
          {items.map((item, index) => (
            <div key={index} className="form-group">
              <h4>Item {index + 1}</h4>
              <CustomInput
                type="text"
                name={`items[${index}].description`}
                onChng={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
                onBlr={formik.handleBlur}
                val={formik.values.items[index]?.description || ""}
                label="Item description"
                id={`description-${index}`}
              />
              <CustomInput
                type="number"
                name={`items[${index}].unit`}
                onChng={(e) => handleItemChange(index, "unit", e.target.value)}
                onBlr={formik.handleBlur}
                val={formik.values.items[index]?.unit || ""}
                label="Item unit"
                id={`unit-${index}`}
              />
              <CustomInput
                type="number"
                name={`items[${index}].quantity`}
                onChng={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                onBlr={formik.handleBlur}
                val={formik.values.items[index]?.quantity || 0}
                label="Item quantity"
                id={`quantity-${index}`}
              />
              <CustomInput
                type="number"
                name={`items[${index}].unitPrice`}
                onChng={(e) =>
                  handleItemChange(index, "unitPrice", e.target.value)
                }
                onBlr={formik.handleBlur}
                val={formik.values.items[index]?.unitPrice || 0}
                label="Item unitPrice"
                id={`unitPrice-${index}`}
              />
              <CustomInput
                type="number"
                name={`items[${index}].taxPercentage`}
                onChng={(e) =>
                  handleItemChange(index, "taxPercentage", e.target.value)
                }
                onBlr={formik.handleBlur}
                val={formik.values.items[index]?.taxPercentage || 0}
                label="Tax Percentage"
                id={`taxPercentage-${index}`}
              />
              <CustomInput
                type="number"
                name={`items[${index}].tax`}
                onChng={(e) => handleItemChange(index, "tax", e.target.value)}
                onBlr={formik.handleBlur}
                val={formik.values.items[index]?.tax || 0}
                label="Tax Number"
                id={`tax-${index}`}
              />
              <CustomInput
                type="number"
                name={`items[${index}].discountPercentage`}
                onChng={(e) =>
                  handleItemChange(index, "discountPercentage", e.target.value)
                }
                onBlr={formik.handleBlur}
                val={formik.values.items[index]?.discountPercentage || 0}
                label="Discount Percentage"
                id={`discountPercentage-${index}`}
              />
              <CustomInput
                type="number"
                name={`items[${index}].discount`}
                onChng={(e) =>
                  handleItemChange(index, "discount", e.target.value)
                }
                onBlr={formik.handleBlur}
                val={formik.values.items[index]?.discount || 0}
                label="Discount Amount"
                id={`discount-${index}`}
              />
              <CustomInput
                type="number"
                name={`items[${index}].amount`}
                onChng={(e) =>
                  handleItemChange(index, "amount", e.target.value)
                }
                onBlr={formik.handleBlur}
                val={formik.values.items[index]?.amount || 0}
                label="Amount"
                id={`amount-${index}`}
              />
            </div>
          ))}
        </div> */}
        <div className="item-container">
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Unit</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Tax Percentage</th>
        <th>Tax</th>
        <th>Discount Percentage</th>
        <th>Discount Amount</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item, index) => (
        <tr key={index}>
          <td>
            <CustomInput
              type="text"
              name={`items[${index}].description`}
              onChng={(e) =>
                handleItemChange(index, "description", e.target.value)
              }
              onBlr={formik.handleBlur}
              val={formik.values.items[index]?.description || ""}
              // label="Item description"
              id={`description-${index}`}
            />
          </td>
          <td>
            <CustomInput
              type="number"
              name={`items[${index}].unit`}
              onChng={(e) => handleItemChange(index, "unit", e.target.value)}
              onBlr={formik.handleBlur}
              val={formik.values.items[index]?.unit || ""}
              // label="Item unit"
              id={`unit-${index}`}
            />
          </td>
          <td>
            <CustomInput
              type="number"
              name={`items[${index}].quantity`}
              onChng={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              onBlr={formik.handleBlur}
              val={formik.values.items[index]?.quantity || 0}
              // label="Item quantity"
              id={`quantity-${index}`}
            />
          </td>
          <td>
            <CustomInput
              type="number"
              name={`items[${index}].unitPrice`}
              onChng={(e) =>
                handleItemChange(index, "unitPrice", e.target.value)
              }
              onBlr={formik.handleBlur}
              val={formik.values.items[index]?.unitPrice || 0}
              // label="Item unitPrice"
              id={`unitPrice-${index}`}
            />
          </td>
          <td>
            <CustomInput
              type="number"
              name={`items[${index}].taxPercentage`}
              onChng={(e) =>
                handleItemChange(index, "taxPercentage", e.target.value)
              }
              onBlr={formik.handleBlur}
              val={formik.values.items[index]?.taxPercentage || 0}
              // label="Tax Percentage"
              id={`taxPercentage-${index}`}
            />
          </td>
          <td>
            <CustomInput
              type="number"
              name={`items[${index}].tax`}
              onChng={(e) => handleItemChange(index, "tax", e.target.value)}
              onBlr={formik.handleBlur}
              val={formik.values.items[index]?.tax || 0}
              // label="Tax Number"
              id={`tax-${index}`}
            />
          </td>
          <td>
            <CustomInput
              type="number"
              name={`items[${index}].discountPercentage`}
              onChng={(e) =>
                handleItemChange(index, "discountPercentage", e.target.value)
              }
              onBlr={formik.handleBlur}
              val={formik.values.items[index]?.discountPercentage || 0}
              // label="Discount Percentage"
              id={`discountPercentage-${index}`}
            />
          </td>
          <td>
            <CustomInput
               type="number"
               name={`items[${index}].discount`}
               onChng={(e) =>
                 handleItemChange(index, "discount", e.target.value)
               }
               onBlr={formik.handleBlur}
               val={formik.values.items[index]?.discount || 0}
              //  label="Discount Amount"
               id={`discount-${index}`}
            />
          </td>
          <td>
            <CustomInput
              type="number"
              name={`items[${index}].amount`}
              onChng={(e) =>
                handleItemChange(index, "amount", e.target.value)
              }
              onBlr={formik.handleBlur}
              val={formik.values.items[index]?.amount || 0}
              // label="Amount"
              id={`amount-${index}`}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        <button type="submit">Submit</button>
      </form>
    </div>
    </div>
  );
};

export default Addinvoice;
