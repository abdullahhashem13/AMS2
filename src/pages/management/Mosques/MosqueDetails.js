import React, { useState, useEffect } from "react";
import "../../../style/Modal.css";

export default function MosqueDetails({ mosque, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [mosqueTypeName, setMosqueTypeName] = useState("");

  useEffect(() => {
    // جلب اسم الفرع ونوع المسجد
    const fetchNames = async () => {
      try {
        const response = await fetch("/JsonData/AllData.json");
        if (response.ok) {
          const data = await response.json();

          // البحث عن اسم الفرع
          if (data.Branches && Array.isArray(data.Branches)) {
            const branch = data.Branches.find((b) => b.id === mosque.branch_id);
            if (branch) {
              setBranchName(branch.name);
            }
          }

          // البحث عن نوع المسجد
          if (data.TypeOfMosque && Array.isArray(data.TypeOfMosque)) {
            const mosqueType = data.TypeOfMosque.find(
              (t) => t.id === mosque.type_id
            );
            if (mosqueType) {
              setMosqueTypeName(
                mosqueType.name || mosqueType.type || mosque.type_id
              );
            } else {
              setMosqueTypeName(mosque.type_id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (mosque) {
      fetchNames();
    }
  }, [mosque]);

  if (!mosque) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 280);
  };

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`}>
      <div className={`modal-content ${isClosing ? "closing" : ""}`}>
        <h2 className="modal-title">معلومات المسجد</h2>

        <div className="details-container">
          <div className="details-row">
            <span className="details-label">اسم المسجد:</span>
            <span className="details-value">{mosque.name}</span>
          </div>
          <div className="details-row">
            <span className="details-label">رقم المسجد:</span>
            <span className="details-value">{mosque.number}</span>
          </div>
          <div className="details-row">
            <span className="details-label">الفرع:</span>
            <span className="details-value">
              {branchName || mosque.branch_id}
            </span>
          </div>
          <div className="details-row">
            <span className="details-label">نوع المسجد:</span>
            <span className="details-value">{mosqueTypeName}</span>
          </div>
          <div className="details-row">
            <span className="details-label">حالة المسجد:</span>
            <span className="details-value">{mosque.statue}</span>
          </div>
          <div className="details-row">
            <span className="details-label">تابع للأوقاف:</span>
            <span className="details-value">
              {mosque.isForAwgaf ? "نعم" : "لا"}
            </span>
          </div>
          <div className="details-row">
            <span className="details-label">عدد الأعين:</span>
            <span className="details-value">{mosque.numberOfProperty}</span>
          </div>
          <div className="details-row">
            <span className="details-label">المحافظة:</span>
            <span className="details-value">{mosque.governorate}</span>
          </div>
          <div className="details-row">
            <span className="details-label">المدينة:</span>
            <span className="details-value">{mosque.city}</span>
          </div>
          <div className="details-row">
            <span className="details-label">الحي:</span>
            <span className="details-value">{mosque.neighborhood}</span>
          </div>
        </div>

        <button className="modal-close-btn" onClick={handleClose}>
          إغلاق
        </button>
      </div>
    </div>
  );
}
