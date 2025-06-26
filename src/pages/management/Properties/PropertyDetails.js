import React, { useState } from "react";
import "../../../style/Modal.css";

export default function PropertyDetails({ property, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  if (!property) return null;

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
        <h2 className="modal-title">معلومات العين</h2>
        <div className="modal-body">
          <div className="details-row">
            <span className="details-label">رقم العين:</span>
            <span className="details-value">{property.property_number}</span>
          </div>
          <div className="details-row">
            <span className="details-label">نوع العين:</span>
            <span className="details-value">{property.property_type}</span>
          </div>
          <div className="details-row">
            <span className="details-label">حالة العين:</span>
            <span className="details-value">{property.property_statue}</span>
          </div>
          <div className="details-row">
            <span className="details-label">الإيجار:</span>
            <span className="details-value">{property.property_rent}</span>
          </div>
          <div className="details-row">
            <span className="details-label">الفرع:</span>
            <span className="details-value">{property.branch_name}</span>
          </div>
          <div className="details-row">
            <span className="details-label">المسجد:</span>
            <span className="details-value">{property.mosque_name}</span>
          </div>
          <div className="details-row">
            <span className="details-label">المحافظة:</span>
            <span className="details-value">
              {property.property_governorate}
            </span>
          </div>
          <div className="details-row">
            <span className="details-label">المدينة:</span>
            <span className="details-value">{property.property_city}</span>
          </div>
          <div className="details-row">
            <span className="details-label">الحي:</span>
            <span className="details-value">
              {property.property_neighborhood}
            </span>
          </div>
          <div className="details-row">
            <span className="details-label">شمال:</span>
            <span className="details-value">{property.property_north}</span>
          </div>
          <div className="details-row">
            <span className="details-label">جنوب:</span>
            <span className="details-value">{property.property_south}</span>
          </div>
          <div className="details-row">
            <span className="details-label">شرق:</span>
            <span className="details-value">{property.property_east}</span>
          </div>
          <div className="details-row">
            <span className="details-label">غرب:</span>
            <span className="details-value">{property.property_west}</span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-close-btn" onClick={handleClose}>
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
