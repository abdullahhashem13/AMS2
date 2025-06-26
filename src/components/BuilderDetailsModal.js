import React, { useState } from "react";
import "../style/Modal.css";

export default function BuilderDetailsModal({ builder, branchName, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  if (!builder) return null;
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 280);
  };
  return (
    <div className={`modal-overlay${isClosing ? " closing" : ""}`}>
      <div className={`modal-content${isClosing ? " closing" : ""}`}>
        <h2 className="modal-title">بيانات الباني</h2>
        <div className="details-container">
          <div className="details-row">
            <div className="details-label">اسم الباني الرباعي:</div>
            <div className="details-value">
              {builder.builderMosque_name || "-"}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">رقم الهوية:</div>
            <div className="details-value">
              {builder.builderMosque_NOIdentity || "-"}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">رقم الهاتف:</div>
            <div className="details-value">
              {builder.builderMosque_phone || "-"}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">الفرع:</div>
            <div className="details-value">{branchName}</div>
          </div>
          <div className="details-row">
            <div className="details-label">المحافظة:</div>
            <div className="details-value">
              {builder.builderMosque_governorate || "-"}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">المدينة:</div>
            <div className="details-value">
              {builder.builderMosque_city || "-"}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">الحي:</div>
            <div className="details-value">
              {builder.builderMosque_neighborhood || "-"}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">مكان الإصدار:</div>
            <div className="details-value">
              {builder.builderMosque_issuedFrom || "-"}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">تاريخ الإصدار:</div>
            <div className="details-value">
              {builder.builderMosque_issuedDate || "-"}
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
