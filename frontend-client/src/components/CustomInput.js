import React from "react";

const CustomInput = ({ type, name, onChng, onBlr, val, label, i_id, i_class, options }) => {
  if (type === "select" && options) { // Check if options is defined
    return (
      <div className="form-floating mt-3">
        <select
          className={`form-control ${i_class}`}
          id={i_id}
          name={name}
          value={val}
          onChange={onChng}
          onBlur={onBlr}
        >
          <option value="">Select an option</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label htmlFor={i_id}>{label}</label>
      </div>
    );
  } else {
    return (
      <div className="form-floating mt-3">
        <input
          type={type}
          className={`form-control ${i_class}`}
          id={i_id}
          placeholder={label}
          name={name}
          value={val}
          onChange={onChng}
          onBlur={onBlr}
        />
        <label htmlFor={i_id}>{label}</label>
      </div>
    );
  }
};

export default CustomInput;
