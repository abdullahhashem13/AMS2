import React, { useState, useEffect } from "react";
import "../../../style/Modal.css";

export default function QuranCenterDetails({ center, onClose }) {
  const [mosqueName, setMosqueName] = useState("غير محدد");
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // جلب اسم المسجد من ملف البيانات
    const fetchMosqueName = async () => {
      try {
        if (center && center.mosque_id) {
          const response = await fetch("/JsonData/AllData.json");
          if (response.ok) {
            const data = await response.json();
            const mosque = data.Mosques?.find((m) => m.id === center.mosque_id);
            if (mosque) {
              setMosqueName(mosque.mosque_name);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching mosque name:", error);
      }
    };

    fetchMosqueName();
  }, [center]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // مدة الانيميشن
  };

  if (!center) return null;

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`}>
      <div className={`modal-content ${isClosing ? "closing" : ""}`}>
        <h2 className="modal-title">معلومات مركز القرآن</h2>
        <div className="details-container">
          <div className="details-row">
            <span className="details-label">اسم المركز:</span>
            <span className="details-value">{center.quranCenter_name}</span>
          </div>
          <div className="details-row">
            <span className="details-label">المسجد التابع له:</span>
            <span className="details-value">{mosqueName}</span>
          </div>
          <div className="details-row">
            <span className="details-label">اسم مدير المركز:</span>
            <span className="details-value">
              {center.quranCenter_managerName || "غير محدد"}
            </span>
          </div>
          <div className="details-row">
            <span className="details-label">رقم هوية المدير:</span>
            <span className="details-value">
              {center.quranCenter_managerIdNumber || "غير محدد"}
            </span>
          </div>
          <div className="details-row">
            <span className="details-label">رقم هاتف المدير:</span>
            <span className="details-value">
              {center.quranCenter_managerPhone || "غير محدد"}
            </span>
          </div>
        </div>

        <div className="details-container">
          <h3 className="modal-subtitle">الموقع</h3>
          <div className="details-row">
            <span className="details-label">المحافظة:</span>
            <span className="details-value">
              {center.quranCenter_governorate || "غير محدد"}
            </span>
          </div>
          <div className="details-row">
            <span className="details-label">المدينة:</span>
            <span className="details-value">
              {center.quranCenter_city || "غير محدد"}
            </span>
          </div>
          <div className="details-row">
            <span className="details-label">الحي:</span>
            <span className="details-value">
              {center.quranCenter_neighborhood || "غير محدد"}
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
