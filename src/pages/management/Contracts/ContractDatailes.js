import React, { useEffect, useState } from "react";
import "../../../style/Modal.css";

export default function ContractDatailes({ id, onClose }) {
  const [data, setData] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/JsonData/AllData.json");
        if (res.ok) {
          const allData = await res.json();
          const allContracts = [];
          [
            "LandFarmingContract",
            "WhiteLandContract",
            "PropertyContract",
            "RenewlyContract",
          ].forEach((type) => {
            if (Array.isArray(allData[type])) {
              allData[type].forEach((c) =>
                allContracts.push({ ...c, contractType: type })
              );
            }
          });
          const contract = allContracts.find((c) => c.id === id);
          if (!contract) return setData(null);

          // جلب اسم المستأجر من Tenants
          let tenantName = contract.tenant_name;
          if (tenantName && allData.Tenants) {
            const tenantObj = allData.Tenants.find((t) => t.id === tenantName);
            if (tenantObj) tenantName = tenantObj.name;
          }

          // حذف جلب اسم الفرع نهائياً

          // جلب رقم العقار من Properties
          let propertyNumber = contract.property_number;
          let propertyNumberDisplay = propertyNumber;
          if (propertyNumber && allData.Properties) {
            const propertyObj = allData.Properties.find(
              (p) => p.id === propertyNumber
            );
            if (propertyObj) propertyNumberDisplay = propertyObj.number;
          }

          setData({
            ...contract,
            tenant_name: tenantName,
            // حذف branch_name نهائياً
            number: propertyNumberDisplay,
          });
        } else {
          setData(null);
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
        <h2 className="modal-title">تفاصيل العقد</h2>
        {!data ? (
          <div style={{ textAlign: "center", margin: 40 }}>جاري التحميل...</div>
        ) : (
          <>
            <div className="details-container">
              <div className="details-row">
                <div className="details-label">رقم العقد:</div>
                <div className="details-value">{data.contractNumber}</div>
              </div>
              <div className="details-row">
                <div className="details-label">اسم المؤجر:</div>
                <div className="details-value">{data.landlord}</div>
              </div>
              <div className="details-row">
                <div className="details-label">اسم المستأجر:</div>
                <div className="details-value">{data.tenant_name}</div>
              </div>
              <div className="details-row">
                <div className="details-label">رقم العين:</div>
                <div className="details-value">{data.number}</div>
              </div>
              <div className="details-row">
                <div className="details-label">تاريخ إنشاء العقد:</div>
                <div className="details-value">{data.creationDate}</div>
              </div>
              <div className="details-row">
                <div className="details-label">تاريخ بداية العقد:</div>
                <div className="details-value">{data.startDate}</div>
              </div>
              <div className="details-row">
                <div className="details-label">تاريخ نهاية العقد:</div>
                <div className="details-value">{data.endDate}</div>
              </div>
              <div className="details-row">
                <div className="details-label">قيمة الإيجار الشهري:</div>
                <div className="details-value">{data.monthlyRent}</div>
              </div>
              <div className="details-row">
                <div className="details-label">قيمة الإيجار السنوي:</div>
                <div className="details-value">{data.yerlyRent}</div>
              </div>
              <div className="details-row">
                <div className="details-label">الغرض من الإيجار:</div>
                <div className="details-value">{data.purposeOfLease}</div>
              </div>
              <div className="details-row">
                <div className="details-label">الدفعة المقدمة:</div>
                <div className="details-value">{data.initialPayment}</div>
              </div>
              <div className="details-row">
                <div className="details-label">الحالة:</div>
                <div className="details-value">{data.statue}</div>
              </div>
              {/* حذف عرض اسم الفرع */}
              <div className="details-row">
                <div className="details-label">المساحة:</div>
                <div className="details-value">{data.landArea}</div>
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
