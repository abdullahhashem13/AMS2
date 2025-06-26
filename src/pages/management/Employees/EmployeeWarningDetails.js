import React, { useState, useEffect } from "react";
import "../../../style/Modal.css";

export default function EmployeeWarningDetails({ warning, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [employeeName, setEmployeeName] = useState("غير محدد");

  useEffect(() => {
    // جلب اسم الموظف إذا لم يكن موجودًا في بيانات الإنذار
    const fetchEmployeeName = async () => {
      if (!warning.employee_name && warning.employee_id) {
        try {
          const response = await fetch(
            `http://localhost:3001/Employees/${warning.employee_id}`
          );
          if (response.ok) {
            const employee = await response.json();
            setEmployeeName(employee.employee_name);
          }
        } catch (error) {
          console.error("Error fetching employee name:", error);
        }
      } else if (warning.employee_name) {
        setEmployeeName(warning.employee_name);
      }
    };

    fetchEmployeeName();
  }, [warning]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`}>
      <div className={`modal-content ${isClosing ? "closing" : ""}`}>
        <h2 className="modal-title">تفاصيل الإنذار</h2>

        <div className="details-container">
          <div className="details-row">
            <div className="details-label">اسم الموظف:</div>
            <div className="details-value">{employeeName}</div>
          </div>

          <div className="details-row">
            <div className="details-label">نوع الإنذار:</div>
            <div className="details-value">{warning.typeOfWarning}</div>
          </div>

          <div className="details-row">
            <div className="details-label">تاريخ الإنذار:</div>
            <div className="details-value">{warning.date}</div>
          </div>

          <div className="details-row">
            <div className="details-label">وصف الإنذار:</div>
            <div className="details-value">{warning.description}</div>
          </div>
        </div>

        <button className="modal-close-btn" onClick={handleClose}>
          إغلاق
        </button>
      </div>
    </div>
  );
}
