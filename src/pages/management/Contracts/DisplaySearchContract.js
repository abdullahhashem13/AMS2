import React, { useEffect, useState } from "react";
import Saidbar from "../../../components/Saidbar";
import Managmenttitle from "../../../components/Managmenttitle";
import Mainbutton from "../../../components/Mainbutton";
import Bigbutton from "../../../components/Bigbutton";
import Searchsection from "../../../components/Searchsection";
import "../../../style/styleful.css";
import ContractCard from "../../../components/ContractCard";
import RenewlyContractCard from "../../../components/RenewlyContractCard";
import Swal from "sweetalert2";
import ContractDatailes from "./ContractDatailes";

export default function DisplaySearchContract() {
  const [contracts, setContracts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tenants, setTenants] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        // جمع كل العقود
        const allContracts = [];
        [
          "LandFarmingContract",
          "WhiteLandContract",
          "PropertyContract",
        ].forEach((type) => {
          if (Array.isArray(data[type])) {
            data[type].forEach((c) =>
              allContracts.push({ ...c, contractType: type })
            );
          }
        });
        // إضافة عقود التجديد
        if (Array.isArray(data.RenewlyContract)) {
          data.RenewlyContract.forEach((c) =>
            allContracts.push({ ...c, contractType: "RenewlyContract" })
          );
        }
        // تجهيز جدول المستأجرين
        const tenantsMap = {};
        if (Array.isArray(data.Tenants)) {
          data.Tenants.forEach((t) => {
            tenantsMap[t.id] = t.name;
          });
        }
        setContracts(allContracts);
        setFiltered(allContracts);
        setTenants(tenantsMap);
      });
  }, []);

  // حذف العقد مع تأكيد sweetalert2 (حذف API فقط)
  // تعديل دالة الحذف لإغلاق نافذة التفاصيل قبل إظهار التأكيد
  const handleDelete = async (id, type) => {
    setShowDetails(false); // إغلاق نافذة التفاصيل إذا كانت مفتوحة
    setSelectedId(null);
    setTimeout(async () => {
      const result = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تتمكن من استعادة هذا العقد!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم، احذفه!",
        cancelButtonText: "إلغاء",
      });
      if (!result.isConfirmed) return;
      // حذف من السيرفر (API فقط)
      let endpoint = "";
      if (type === "LandFarmingContract")
        endpoint = `http://localhost:3001/LandFarmingContract/${id}`;
      if (type === "WhiteLandContract")
        endpoint = `http://localhost:3001/WhiteLandContract/${id}`;
      if (type === "PropertyContract")
        endpoint = `http://localhost:3001/PropertyContract/${id}`;
      if (type === "RenewlyContract")
        endpoint = `http://localhost:3001/RenewlyContract/${id}`;
      try {
        const res = await fetch(endpoint, { method: "DELETE" });
        if (!res.ok) throw new Error("فشل في حذف العقد من السيرفر");
        const updatedContracts = contracts.filter(
          (c) => !(c.id === id && c.contractType === type)
        );
        setContracts(updatedContracts);
        setFiltered(updatedContracts);
        Swal.fire("تم الحذف!", "تم حذف العقد بنجاح.", "success");
      } catch (err) {
        Swal.fire("خطأ!", "حدث خطأ أثناء حذف العقد.", "error");
      }
    }, 200); // تأخير بسيط حتى تغلق نافذة التفاصيل
  };

  // البحث المرن
  const handleSearch = (term) => {
    if (!term) {
      setFiltered(contracts);
      return;
    }
    const lower = term.trim().toLowerCase();
    setFiltered(
      contracts.filter((c) => {
        const tenantName = tenants[c.tenant_name] || "";
        return (
          (tenantName && tenantName.toLowerCase().includes(lower)) ||
          (c.contract_contractNumber &&
            c.contract_contractNumber.includes(lower))
        );
      })
    );
  };

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة العقود" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div></div>
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Contracts/ReportContract"
              />
              <Mainbutton
                text="بحث"
                path="/management/Contracts/DisplaySearchContract"
              />
              <Bigbutton
                text="عقد عين"
                path="/management/Contracts/AddPropertyContract"
              />
              <Bigbutton
                text="عقد أرض بيضاء"
                path="/management/Contracts/AddWhiteLandContract"
              />
              <Bigbutton
                text="عقد أرض زراعية"
                path="/management/Contracts/AddLandFarmingContract"
              />
            </div>
          </div>
          <div className="divforconten">
            <div className="divforsearchandcards">
              <div className="displayflexjust divforsearch">
                <Searchsection
                  placeholder="ابحث باسم المستأجر أو رقم العقد"
                  maxLength="30"
                  onSearch={handleSearch}
                />
              </div>
              <div className="divforcards">
                {filtered.map((c) =>
                  c.contractType === "RenewlyContract" ? (
                    <RenewlyContractCard
                      key={c.id}
                      tenantName={tenants[c.tenant_name] || c.tenant_name}
                      contractNumber={c.contract_contractNumber}
                      contractStatue={c.contract_statue}
                      contractId={c.id}
                      contractType={c.contractType}
                      renewalOrder={c.renewal_order} // تمرير ترتيب التجديد
                      onDelete={(e) => {
                        e?.stopPropagation && e.stopPropagation();
                        // إذا كانت نافذة التفاصيل مفتوحة لهذا الكارد، لا تفتحها عند الضغط على الحذف
                        if (showDetails && selectedId === c.id) {
                          setShowDetails(false);
                          setSelectedId(null);
                          setTimeout(
                            () => handleDelete(c.id, c.contractType),
                            200
                          );
                        } else {
                          handleDelete(c.id, c.contractType);
                        }
                      }}
                      onClick={() => {
                        // لا تفتح نافذة التفاصيل إذا كان الضغط على الحذف
                        if (!showDetails) {
                          setSelectedId(c.id);
                          setShowDetails(true);
                        }
                      }}
                    />
                  ) : (
                    <ContractCard
                      key={c.id}
                      tenantName={tenants[c.tenant_name] || c.tenant_name}
                      contractNumber={c.contract_contractNumber}
                      contractStatue={c.contract_statue}
                      contractId={c.id}
                      contractType={c.contractType}
                      onDelete={(e) => {
                        e?.stopPropagation && e.stopPropagation();
                        if (showDetails && selectedId === c.id) {
                          setShowDetails(false);
                          setSelectedId(null);
                          setTimeout(
                            () => handleDelete(c.id, c.contractType),
                            200
                          );
                        } else {
                          handleDelete(c.id, c.contractType);
                        }
                      }}
                      onClick={() => {
                        if (!showDetails) {
                          setSelectedId(c.id);
                          setShowDetails(true);
                        }
                      }}
                    />
                  )
                )}
                {filtered.length === 0 && <div>لا توجد نتائج مطابقة</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDetails && (
        <ContractDatailes
          id={selectedId}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}
