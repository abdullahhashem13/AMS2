import React, { useState, useEffect } from "react";
import "../../../style/Modal.css";

export default function TenantDetails({ tenant, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // لم نعد بحاجة لجلب بيانات الفروع أو branchName
    // fetchBranches();
  }, [tenant]);

  if (!tenant) return null;

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
        <h2 className="modal-title">معلومات المستأجر</h2>

        <div className="details-container">
          <div className="details-row">
            <div className="details-label">اسم المستأجر:</div>
            <div className="details-value">{tenant.name}</div>
          </div>

          <div className="details-row">
            <div className="details-label">رقم الهوية:</div>
            <div className="details-value">{tenant.IDnumber}</div>
          </div>

          <div className="details-row">
            <div className="details-label">رقم التلفون:</div>
            <div className="details-value">{tenant.phone}</div>
          </div>

          <div className="details-row">
            <div className="details-label">الجنس:</div>
            <div className="details-value">{tenant.gender}</div>
          </div>

          <div className="details-row">
            <div className="details-label">نوع المستأجر:</div>
            <div className="details-value">{tenant.type}</div>
          </div>

          <div className="details-row">
            <div className="details-label">المحافظة:</div>
            <div className="details-value">
              {tenant.governorate || "غير محدد"}
            </div>
          </div>

          <div className="details-row">
            <div className="details-label">المدينة:</div>
            <div className="details-value">{tenant.city || "غير محدد"}</div>
          </div>

          <div className="details-row">
            <div className="details-label">الحي:</div>
            <div className="details-value">
              {tenant.neighborhood || "غير محدد"}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="modal-close-btn" onClick={handleClose}>
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
