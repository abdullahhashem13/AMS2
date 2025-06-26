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

          // جلب اسم الفرع من Branches
          let branchName = contract.branch_name;
          if (branchName && allData.Branches) {
            const branchObj = allData.Branches.find((b) => b.id === branchName);
            if (branchObj) branchName = branchObj.name;
          }

          // جلب رقم العقار من Properties
          let propertyNumber = contract.property_number;
          if (propertyNumber && allData.Properties) {
            const propertyObj = allData.Properties.find(
              (p) => p.id === propertyNumber
            );
            if (propertyObj) propertyNumber = propertyObj.property_number;
          }

          setData({
            ...contract,
            tenant_name: tenantName,
            branch_name: branchName,
            property_number: propertyNumber,
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
                <div className="details-value">
                  {data.contract_contractNumber}
                </div>
              </div>
              <div className="details-row">
                <div className="details-label">اسم المؤجر:</div>
                <div className="details-value">{data.contract_landlord}</div>
              </div>
              <div className="details-row">
                <div className="details-label">اسم المستأجر:</div>
                <div className="details-value">{data.tenant_name}</div>
              </div>
              <div className="details-row">
                <div className="details-label">رقم العقار:</div>
                <div className="details-value">{data.property_number}</div>
              </div>
              <div className="details-row">
                <div className="details-label">تاريخ إنشاء العقد:</div>
                <div className="details-value">
                  {data.contract_creationDate}
                </div>
              </div>
              <div className="details-row">
                <div className="details-label">تاريخ بداية العقد:</div>
                <div className="details-value">{data.contract_startDate}</div>
              </div>
              <div className="details-row">
                <div className="details-label">تاريخ نهاية العقد:</div>
                <div className="details-value">{data.contract_endDate}</div>
              </div>
              <div className="details-row">
                <div className="details-label">قيمة الإيجار الشهري:</div>
                <div className="details-value">{data.contract_monthlyRent}</div>
              </div>
              <div className="details-row">
                <div className="details-label">قيمة الإيجار السنوي:</div>
                <div className="details-value">{data.contract_yerlyRent}</div>
              </div>
              <div className="details-row">
                <div className="details-label">الغرض من الإيجار:</div>
                <div className="details-value">
                  {data.contract_purposeOfLease}
                </div>
              </div>
              <div className="details-row">
                <div className="details-label">الدفعة المقدمة:</div>
                <div className="details-value">
                  {data.contract_initialPayment}
                </div>
              </div>
              <div className="details-row">
                <div className="details-label">الحالة:</div>
                <div className="details-value">{data.contract_statue}</div>
              </div>
              <div className="details-row">
                <div className="details-label">اسم الفرع:</div>
                <div className="details-value">{data.branch_name}</div>
              </div>
              <div className="details-row">
                <div className="details-label">المساحة:</div>
                <div className="details-value">{data.contract_landArea}</div>
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
