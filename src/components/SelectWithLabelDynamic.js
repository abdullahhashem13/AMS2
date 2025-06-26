import React from "react";
import "../style/Inputwithlabel.css";

export default function SelectWithLabelDynamic({
  value,
  name,
  change,
  text,
  options,
  placeholder,
  valueKey = "value",
  displayKey = "label",
}) {
  return (
    <div className="SelectWithLabel">
      <select
        className="selectInput"
        id={name}
        name={name}
        value={value}
        onChange={change}
      >
        <option disabled value="">
          {placeholder || "اختر..."}
        </option>
        {options &&
          options.map((option) => (
            <option
              key={
                option.id ||
                option._id ||
                option[valueKey] ||
                option[displayKey]
              }
              value={option[valueKey] || option.id || option._id}
            >
              {option[displayKey] || option.name}
            </option>
          ))}
      </select>
      <label htmlFor={name} className="labeltextinput">
        {text}
      </label>
    </div>
  );
}
