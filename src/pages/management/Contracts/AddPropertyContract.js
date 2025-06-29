import AddLandFarmingContract from "./AddLandFarmingContract";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AddPropertyContract() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (id) {
      fetch("/JsonData/AllData.json")
        .then((res) => res.json())
        .then((data) => {
          const contract = (data.PropertyContract || []).find(
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
      ? `http://localhost:3001/PropertyContract/${id}`
      : `http://localhost:3001/PropertyContract`;
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
      submitUrl="http://localhost:3001/PropertyContract"
      title="إدارة العقود"
      dataTitle="بيانات عقد عين"
      initialData={initialData}
      submitButtonText={undefined}
      buttonText={initialData ? "حفظ التعديلات" : "إضافة عقد جديد"}
      onSubmit={handleSubmit}
      propertyMode={true}
    />
  );
}
