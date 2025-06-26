import React, { useState } from "react";
// @ts-ignore
import Select from "react-select";
import "../style/searchableSelect.css"; // استخدام نفس ملف CSS الذي يستخدمه SearchableSelect

export default function SearchableSelectWithAdd(props) {
  const [isNewValue, setIsNewValue] = useState(props.isNewOption || false);

  // استخدام نفس الأنماط المخصصة من مكون SearchableSelect
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
      caretColor: "black",
    }),
  };

  const handleChange = (selectedOption) => {
    if (selectedOption && selectedOption.value === "new") {
      setIsNewValue(true);
      props.change(selectedOption);
    } else {
      setIsNewValue(false);
      props.change(selectedOption);
    }
  };

  return (
    <div className="SelectWithLabel">
      {!isNewValue ? (
        <div style={{ width: "75%" }}>
          <Select
            styles={customStyles}
            options={props.options}
            onChange={handleChange}
            placeholder={props.placeholder || ""}
            noOptionsMessage={() => props.noOptionsMessage || "لا توجد نتائج"}
            isSearchable={true}
            value={
              props.value && !isNewValue
                ? props.options.find((option) => option.label === props.value)
                : null
            }
          />
        </div>
      ) : (
        <div className="new-value-input" style={{ width: "75%" }}>
          <input
            type="text"
            name={props.name}
            value={props.value}
            onChange={props.onNewValueChange}
            placeholder={`أدخل ${props.text}`}
            style={{
              backgroundColor: "var(--button-color)",
              border: "none",
              borderRadius: "5px",
              height: "30px",
              width: "100%",
              fontFamily: "amiri",
              fontWeight: "bold",
              fontSize: "18px",
              textAlign: "center",
              color: "black",
              direction: "rtl",
            }}
          />
          <button
            type="button"
            className="back-to-select-btn"
            onClick={() => {
              setIsNewValue(false);
              props.change({ value: "", label: "" });
            }}
            style={{
              backgroundColor: "var(--primary-color)",
              color: "var(--secondry-color)",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
              marginTop: "5px",
              cursor: "pointer",
              fontFamily: "amiri",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            العودة للقائمة
          </button>
        </div>
      )}
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
