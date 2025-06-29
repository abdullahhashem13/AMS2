import React, { useState } from "react";
import "../../../style/Modal.css";

export default function TenantDetails({ tenant, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  // تحويل بيانات المستأجر إذا كانت قادمة من الـ API بشكل خام
  const normalizedTenant = tenant ? normalizeTenant(tenant) : null;

  if (!normalizedTenant) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 280);
  };

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`}>
      <div className={`modal-content ${isClosing ? "closing" : ""}`}>
        <h2 className="modal-title">معلومات المستأجر</h2>

        <div className="details-container">
          <div className="details-row">
            <div className="details-label">اسم المستأجر:</div>
            <div className="details-value">{normalizedTenant.name}</div>
          </div>

          <div className="details-row">
            <div className="details-label">رقم الهوية:</div>
            <div className="details-value">{normalizedTenant.IdNumber}</div>
          </div>

          <div className="details-row">
            <div className="details-label">رقم التلفون:</div>
            <div className="details-value">{normalizedTenant.phone}</div>
          </div>

          <div className="details-row">
            <div className="details-label">الجنس:</div>
            <div className="details-value">{normalizedTenant.gender}</div>
          </div>

          <div className="details-row">
            <div className="details-label">نوع المستأجر:</div>
            <div className="details-value">{normalizedTenant.type}</div>
          </div>

          <div className="details-row">
            <div className="details-label">المحافظة:</div>
            <div className="details-value">
              {normalizedTenant.governorate || "غير محدد"}
            </div>
          </div>

          <div className="details-row">
            <div className="details-label">المدينة:</div>
            <div className="details-value">
              {normalizedTenant.city || "غير محدد"}
            </div>
          </div>

          <div className="details-row">
            <div className="details-label">الحي:</div>
            <div className="details-value">
              {normalizedTenant.neighborhood || "غير محدد"}
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

// دالة لتحويل الحقول القادمة من الـ API إلى الشكل المطلوب للعرض
function normalizeTenant(apiTenant) {
  return {
    name: apiTenant.name || "",
    phone: apiTenant.phone ? String(apiTenant.phone) : "",
    IdNumber: apiTenant.IdNumber || apiTenant.idNumber || "",
    gender: apiTenant.gender || apiTenant.genders || "",
    type: apiTenant.type || "",
    governorate: apiTenant.governorate || "",
    city: apiTenant.city || "",
    neighborhood: apiTenant.neighborhood || "",
  };
}
