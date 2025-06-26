import React from "react";
// @ts-ignore
import Select from "react-select";
import "../style/Inputwithlabel.css";

export default function SearchableSelect(props) {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "var(--button-color)",
      border: "none",
      borderRadius: "5px",
      height: "30px",
      minHeight: "30px",
      width: "100%",
      fontFamily: "amiri",
      fontWeight: "bold",
      fontSize: "18px",
      textAlign: "center",
      color: "black",
    }),
    option: (provided) => ({
      ...provided,
      fontFamily: "amiri",
      fontWeight: "bold",
      fontSize: "16px",
      textAlign: "right",
      direction: "rtl",
      color: "black",
    }),
    placeholder: (provided) => ({
      ...provided,
      textAlign: "center",
      fontFamily: "amiri",
      fontWeight: "bold",
      color: "black",
    }),
    singleValue: (provided) => ({
      ...provided,
      textAlign: "center",
      fontFamily: "amiri",
      fontWeight: "bold",
      direction: "rtl",
      color: "black",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      backgroundColor: "var(--button-color)",
    }),
    input: (provided) => ({
      ...provided,
      textAlign: "center",
      direction: "rtl",
      caretColor: "black", // لون المؤشر
    }),
  };

  return (
    <div className="SelectWithLabel">
      <div style={{ width: "75%" }}>
        <Select
          styles={customStyles}
          options={props.options}
          onChange={(selectedOption) => {
            const event = {
              target: {
                name: props.name,
                value: selectedOption.value,
              },
            };
            props.change(event);
          }}
          placeholder={props.placeholder || ""}
          noOptionsMessage={() => props.noOptionsMessage || "لا توجد نتائج"}
          isSearchable={true}
          value={
            props.options.find((option) => option.value === props.value) || null
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        />
      </div>
      <label
        htmlFor={props.name}
        className="labeltextinput"
        style={{
          width: props.widthlabel || "30%",
        }}
      >
        {props.text}
      </label>
    </div>
  );
}
