import React, { useState } from "react";
import "../../../style/Modal.css";

export default function BranchDetails({ branch, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  if (!branch) return null;

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
        <h2 className="modal-title">معلومات الفرع</h2>

        <div className="details-container">
          <div className="details-row">
            <div className="details-label">اسم الفرع:</div>
            <div className="details-value">{branch.name}</div>
          </div>

          <div className="details-row">
            <div className="details-label">رقم التلفون:</div>
            <div className="details-value">{branch.phone}</div>
          </div>

          <div className="details-row">
            <div className="details-label">المدير:</div>
            <div className="details-value">{branch.manager}</div>
          </div>

          <div className="details-row">
            <div className="details-label">المحافظة:</div>
            <div className="details-value">
              {branch.governorate || "غير محدد"}
            </div>
          </div>

          <div className="details-row">
            <div className="details-label">المدينة:</div>
            <div className="details-value">{branch.city || "غير محدد"}</div>
          </div>

          <div className="details-row">
            <div className="details-label">الحي:</div>
            <div className="details-value">
              {branch.neighborhood || "غير محدد"}
            </div>
          </div>
        </div>

        <button className="modal-close-btn" onClick={handleClose}>
          إغلاق
        </button>
      </div>
    </div>
  );
}
