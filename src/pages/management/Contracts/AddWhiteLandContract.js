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
          if (contract) setInitialData(contract);
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
      onSubmit={handleSubmit}
    />
  );
}
