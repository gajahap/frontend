import React from "react";
import Select from "react-select";

const color = {
  primary: "#1537ce",
  primarylight: "rgba(48, 110, 242, 0.2)",
};

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: state.isDisabled ? "#e9ecef" : (state.isFocused ? color.primarylight : "#fff"),
    borderColor: state.isFocused ? color.primary : "#dee2e6",
    borderWidth: 1,
    boxShadow: state.isFocused ? "none" : null,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    "&:hover": {
      borderColor: color.primary,
    },
    borderRadius: "7px",
  }),
  
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? color.primarylight
      : state.data.isImportant
      ? "#ffefef"
      : "#fff",
    cursor: "pointer",
    zIndex: 9999,
    color: state.isFocused ? "#000" : "#000",
    "&:active": {
      backgroundColor: color.primarylight,
    },  
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#000",
  }),
};

const filterOption = (option, inputValue) =>
  option.label.toLowerCase().replace(/\s/g, "").includes(inputValue.toLowerCase().replace(/\s/g, ""));

const CustomSelect = ({
  value,
  options,
  onChange,
  placeholder = "Select an option...",
  isDisabled,
  name
}) => {
  return (
    <Select
      name={name}
      value={value}
      options={options}
      styles={customStyles}
      onChange={onChange}
      placeholder={placeholder}
      isDisabled={isDisabled}
      filterOption={filterOption}
    />
  );
};

export default CustomSelect;

