import AddLandFarmingContract from "./AddLandFarmingContract";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AddWhiteLandContract() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (id) {
      fetch("/JsonData/AllData.json")
        .then((res) => res.json())
        .then((data) => {
          const contract = (data.WhiteLandContract || []).find(
            (c) => c.id === id
          );
          if (contract) {
            setInitialData({
              landlord: contract.landlord || "",
              tenant_name: contract.tenant_name || "",
              property_number: contract.property_number || "",
              statue: contract.statue || "جديد",
              contractNumber: contract.contractNumber || "",
              creationDate: contract.creationDate || "",
              startDate: contract.startDate || "",
              endDate: contract.endDate || "",
              yerlyRent: contract.yerlyRent || "",
              rentDuration: contract.rentDuration || "",
              monthlyRent: contract.monthlyRent || "",
              purposeOfLease: contract.purposeOfLease || "",
              renewal_order: contract.renewal_order || "",
              initialPayment: contract.initialPayment || "",
            });
          }
        });
    }
  }, [id]);

  // عند الإرسال:
  const handleSubmit = async (formData) => {
    let url = id
      ? `http://localhost:3001/WhiteLandContract/${id}`
      : `http://localhost:3001/WhiteLandContract`;
    let method = id ? "PUT" : "POST";
    let bodyData = { ...formData };
    if (id && bodyData.id) delete bodyData.id;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });
    if (res.ok) {
      navigate("/management/Contracts/DisplaySearchContract");
    }
  };

  return (
    <AddLandFarmingContract
      submitUrl="http://localhost:3001/WhiteLandContract"
      title="إدارة العقود"
      dataTitle="بيانات عقد أرض بيضاء"
      initialData={initialData}
      submitButtonText={initialData ? "حفظ التعديلات" : "إضافة عقد جديد"}
      buttonText={undefined}
      onSubmit={handleSubmit}
      showYearlyRent={true}
      showInitialPayment={true}
    />
  );
}
