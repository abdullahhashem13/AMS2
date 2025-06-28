import React, { useState } from "react";
import "../../../style/Modal.css";

// مكون تفاصيل الباني - تنسيق شبيه بتفاصيل المستأجر
export default function BuilderDetails({ builder, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  if (!builder) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) onClose();
      setIsClosing(false);
    }, 280); // وقت أقل قليلاً من مدة الانيميشن (300ms)
  };

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`}>
      <div
        className={`modal-content ${isClosing ? "closing" : ""}`}
        style={{ minWidth: 320, maxWidth: 500 }}
      >
        <h2 className="modal-title">معلومات الباني</h2>
        <div className="details-container">
          <div className="details-row">
            <div className="details-label">اسم الباني:</div>
            <div className="details-value">{builder.name || "غير محدد"}</div>
          </div>
          <div className="details-row">
            <div className="details-label">رقم الهوية:</div>
            <div className="details-value">
              {builder.NOIdentity || "غير محدد"}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">رقم الهاتف:</div>
            <div className="details-value">{builder.phone || "غير محدد"}</div>
          </div>
          <div className="details-row">
            <div className="details-label">المحافظة:</div>
            <div className="details-value">
              {builder.governorate || "غير محدد"}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">المدينة:</div>
            <div className="details-value">{builder.city || "غير محدد"}</div>
          </div>
          <div className="details-row">
            <div className="details-label">الحي:</div>
            <div className="details-value">
              {builder.neighborhood || "غير محدد"}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">مكان الإصدار:</div>
            <div className="details-value">
              {builder.issuedFrom || "غير محدد"}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">تاريخ الإصدار:</div>
            <div className="details-value">
              {builder.issuedDate || "غير محدد"}
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
