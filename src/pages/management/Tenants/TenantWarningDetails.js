import React, { useState, useEffect } from "react";
import "../../../style/Modal.css";

export default function TenantWarningDetails({ warning, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [tenantName, setTenantName] = useState("غير محدد");

  useEffect(() => {
    // جلب اسم المستأجر إذا لم يكن موجودًا في بيانات الإنذار
    const fetchTenantName = async () => {
      if (!warning.tenantName && warning.tenant_id) {
        try {
          const response = await fetch(
            `http://awgaff1.runasp.net/api/Tenant/${warning.tenant_id}`
          );
          if (response.ok) {
            const tenant = await response.json();
            setTenantName(tenant.name);
          }
        } catch (error) {
          console.error("Error fetching tenant name:", error);
        }
      } else if (warning.tenantName) {
        setTenantName(warning.tenantName);
      }
    };

    fetchTenantName();
  }, [warning]);

  if (!warning) return null;

  const handleClose = () => {
    setIsClosing(true);
    // انتظر حتى ينتهي الانيميشن قبل إغلاق النافذة فعليًا
    setTimeout(() => {
      onClose();
    }, 280); // وقت أقل قليلاً من مدة الانيميشن (300ms)
  };

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`}>
      <div className={`modal-content ${isClosing ? "closing" : ""}`}>
        <h2 className="modal-title">تفاصيل الإنذار</h2>

        <div className="details-container">
          <div className="details-row">
            <div className="details-label">اسم المستأجر:</div>
            <div className="details-value">{tenantName}</div>
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
