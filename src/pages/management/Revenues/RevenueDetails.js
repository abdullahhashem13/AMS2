import React, { useState, useEffect } from "react";
import "../../../style/Modal.css";

export default function RevenueDetails({ revenue, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [tenantName, setTenantName] = useState("غير محدد");

  useEffect(() => {
    // جلب اسم المستأجر من ملف البيانات
    const fetchTenantName = async () => {
      try {
        if (revenue && revenue.tenant_name) {
          const response = await fetch("/JsonData/AllData.json");
          if (response.ok) {
            const data = await response.json();
            const tenant = data.Tenants?.find(
              (t) => t.id === revenue.tenant_name
            );
            if (tenant) {
              setTenantName(tenant.name);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching tenant name:", error);
      }
    };

    fetchTenantName();
  }, [revenue]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 280); // مدة أقل قليلاً من مدة الانيميشن
  };

  if (!revenue) return null;

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`}>
      <div className={`modal-content ${isClosing ? "closing" : ""}`}>
        <h2 className="modal-title">تفاصيل سند الإيراد</h2>
        <div className="details-container">
          <div className="details-row">
            <span className="details-label">رقم السند:</span>
            <span className="details-value">{revenue.bondNumber}</span>
          </div>
          <div className="details-row">
            <span className="details-label">التاريخ:</span>
            <span className="details-value">{revenue.date}</span>
          </div>
          <div className="details-row">
            <span className="details-label">المبلغ:</span>
            <span className="details-value">{revenue.amount} ريال</span>
          </div>
          <div className="details-row">
            <span className="details-label">المبلغ كتابة:</span>
            <span className="details-value">
              {revenue.writtenAmount || "غير محدد"}
            </span>
          </div>
          <div className="details-row">
            <span className="details-label">اسم المستأجر:</span>
            <span className="details-value">{tenantName}</span>
          </div>
          <div className="details-row">
            <span className="details-label">الوصف:</span>
            <span className="details-value">
              {revenue.description || "غير محدد"}
            </span>
          </div>
        </div>
        <button className="modal-close-btn" onClick={handleClose}>
          إغلاق
        </button>
      </div>
    </div>
  );
}
