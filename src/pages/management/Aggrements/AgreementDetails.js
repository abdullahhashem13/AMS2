import React, { useEffect, useState } from "react";
import "../../../style/Modal.css";

export default function AgreementDetailsModal({ id, onClose }) {
  const [data, setData] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/Aggrements/${id}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (err) {
        setData(null);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 280);
  };

  if (!id) return null;

  return (
    <div className={`modal-overlay${isClosing ? " closing" : ""}`}>
      <div
        className={`modal-content${isClosing ? " closing" : ""}`}
        style={{ maxWidth: 600 }}
      >
        <h2 className="modal-title">تفاصيل الاتفاقية</h2>
        {!data ? (
          <div style={{ textAlign: "center", margin: 40 }}>جاري التحميل...</div>
        ) : (
          <>
            <div className="details-container">
              <div className="details-row">
                <div className="details-label">رقم الاتفاقية:</div>
                <div className="details-value">{data.aggrementNo}</div>
              </div>
              <div className="details-row">
                <div className="details-label">نوع الاتفاقية:</div>
                <div className="details-value">{data.agreementType}</div>
              </div>
              <div className="details-row">
                <div className="details-label">تاريخ الاتفاقية:</div>
                <div className="details-value">{data.date}</div>
              </div>
              <div className="details-row">
                <div className="details-label">فترة البناء:</div>
                <div className="details-value">{data.timeToBuild}</div>
              </div>
              <div className="details-row">
                <div className="details-label">اسم الباني:</div>
                <div className="details-value">{data.builderMosque_name}</div>
              </div>
              <div className="details-row">
                <div className="details-label">الشاهد الأول:</div>
                <div className="details-value">{data.firstWitness}</div>
              </div>
              <div className="details-row">
                <div className="details-label">الشاهد الثاني:</div>
                <div className="details-value">{data.secondWitness}</div>
              </div>
              <div className="details-row">
                <div className="details-label">الطول:</div>
                <div className="details-value">{data.height}</div>
              </div>
              <div className="details-row">
                <div className="details-label">العرض:</div>
                <div className="details-value">{data.width}</div>
              </div>
              <div className="details-row">
                <div className="details-label">الإجمالي:</div>
                <div className="details-value">{data.totalArea}</div>
              </div>
              {/* حذف نص الحدود والديفايدر */}
              <div className="details-row">
                <div className="details-label">شمال:</div>
                <div className="details-value">{data.north}</div>
              </div>
              <div className="details-row">
                <div className="details-label">جنوب:</div>
                <div className="details-value">{data.south}</div>
              </div>
              <div className="details-row">
                <div className="details-label">شرق:</div>
                <div className="details-value">{data.east}</div>
              </div>
              <div className="details-row">
                <div className="details-label">غرب:</div>
                <div className="details-value">{data.west}</div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-close-btn" onClick={handleClose}>
                إغلاق
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
