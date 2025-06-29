import { useState, useEffect } from "react";
import Checkpoint from "../../../components/checkpoint";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import SelectWithLabel from "../../../components/SelectWithLabel";
import Submitinput from "../../../components/submitinput";
import "../../../style/Table.css";
import ButtonInput from "../../../components/ButtonInput";
import Bigbutton from "../../../components/Bigbutton";
import SelectWithLabel4 from "../../../components/SelectWithLabel4";
import SearchableSelect from "../../../components/SearchableSelect";

export default function ReportContract() {
  const [formData, setFormData] = useState({
    tenant_name: "جميع المستأجرين",
    statue: " جميع الحالات",
  });
  const [error, setErrors] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/ReportAggrement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("successful!");
      } else {
        const data = await response.json();

        if (data && data.message) {
          // تحقق من وجود data و data.message
          if (typeof data.message === "object") {
            setErrors({ ...error, ...data.message }); // دمج أخطاء الخادم
          } else if (typeof data.message === "string") {
            setErrors({ ...error, general: data.message }); // خطأ عام
          } else {
            setErrors({ ...error, general: "Registration failed." });
          }
        } else {
          setErrors({ ...error, general: "Registration failed." });
        }
      }
    } catch (err) {
      setErrors({ ...error, general: "An error occurred." });
      console.error(err);
    }
  };
  // الأعمدة القابلة للاضافة
  const [showlandArea, setShowlandArea] = useState(false);
  const [showinitialPayment, setShowinitialPayment] = useState(false);
  const [showpurposeOfLease, setShowpurposeOfLease] = useState(false);
  const [showyerlyRent, setShowyerlyRent] = useState(false);
  const [showmonthlyRent, setShowmonthlyRent] = useState(false);
  const [showcreationDate, setShowcreationDate] = useState(false);

  // دالة طباعة
  const handlePrint = () => {
    const printContents = document.getElementById("propertyreport").outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  // دالة لتحديث الصفحة بعد اغلاق نافذة الطباعه
  useEffect(() => {
    const handleAfterPrint = () => {
      window.location.reload(); // تحديث الصفحة
    };

    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  const [tenants, setTenants] = useState([]);
  // حذف الفروع نهائياً
  const tenantOptions = [
    { value: "جميع المستأجرين", label: "جميع المستأجرين" },
    ...tenants.map((t) => ({ value: t.name, label: t.name })),
  ];

  // جلب جميع العقود (أصلية ومجددة)
  const [contracts, setContracts] = useState([]);
  const [contractsProperties, setContractsProperties] = useState([]);
  useEffect(() => {
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        // دمج العقود الأصلية والمجددة
        const propertyContracts = data.PropertyContract || [];
        const renewlyContracts = data.RenewlyContract || [];
        setContracts([...propertyContracts, ...renewlyContracts]);
        setContractsProperties(data.Properties || []);
      });
  }, []);

  // فلترة العقود بناءً على الحقول
  const filteredContracts = contracts.filter((contract) => {
    // حذف فلترة الفرع
    // فلترة المستأجر
    if (
      formData.tenant_name &&
      formData.tenant_name !== "جميع المستأجرين" &&
      tenants.find((t) => t.id === contract.tenant_name)?.name !==
        formData.tenant_name
    )
      return false;
    // فلترة حالة العقد
    if (
      formData.statue &&
      formData.statue !== " جميع الحالات" &&
      contract.statue !== formData.statue
    )
      return false;
    return true;
  });

  useEffect(() => {
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        setTenants(data.Tenants || []);
        // حذف جلب الفروع نهائياً
      });
  }, []);

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
            <form className="divforconten" onSubmit={handleSubmit}>
              <div className="RowForInsertinputs">
                {/* حذف حقل الفرع */}
                <SelectWithLabel4
                  name="statue"
                  text="حالة العقد"
                  value={formData.statue}
                  change={handleChange}
                  value1=" جميع الحالات"
                  value2="جديد"
                  value3="مجدد"
                  value4="منتهي"
                />
                <div className="widthbetween"></div>
                <SearchableSelect
                  name="tenant_name"
                  text="اسم المستأجر"
                  value={formData.tenant_name}
                  change={handleChange}
                  options={tenantOptions}
                />
              </div>
              <div className="RowForInsertinputs">
                <Checkpoint
                  text="المساحة"
                  change={(e) => setShowlandArea(e.target.checked)}
                />
                <Checkpoint
                  text="المبلغ المقدم"
                  change={(e) => setShowinitialPayment(e.target.checked)}
                />
                <Checkpoint
                  text="غرض الإيجار"
                  change={(e) => setShowpurposeOfLease(e.target.checked)}
                />
                <Checkpoint
                  text="إيجار سنوي"
                  change={(e) => setShowyerlyRent(e.target.checked)}
                />
                <Checkpoint
                  text="إيجار شهري"
                  change={(e) => setShowmonthlyRent(e.target.checked)}
                />
                <Checkpoint
                  text="تاريخ الإصدار"
                  change={(e) => setShowcreationDate(e.target.checked)}
                />
              </div>

              <div className="RowForInsertinputs">
                <Submitinput text="نتيجة" />
              </div>
              <div className="divfortable">
                <table id="propertyreport">
                  <thead>
                    <tr>
                      {showlandArea && <th>المساحة</th>}
                      {showinitialPayment && <th>المبلغ المقدم</th>}
                      {showpurposeOfLease && <th>غرض الإيجار</th>}
                      {showyerlyRent && <th>الإيجار السنوي</th>}
                      {showmonthlyRent && <th>الإيجار الشهري</th>}
                      {showcreationDate && <th>تاريخ الإصدار</th>}
                      {/* حذف عمود الفرع */}
                      <th>الى فترة</th>
                      <th>من فترة</th>
                      <th>رقم العقد</th>
                      <th>حالة العقد</th>
                      <th>رقم العين</th>
                      <th>المستأجر</th>
                      <th>الطرف الاول</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContracts.map((contract, idx) => {
                      const tenant = tenants.find(
                        (t) => t.id === contract.tenant_name
                      );
                      return (
                        <tr key={contract.id || idx}>
                          {showlandArea && <td>{contract.landArea}</td>}
                          {showinitialPayment && (
                            <td>{contract.initialPayment}</td>
                          )}
                          {showpurposeOfLease && (
                            <td>{contract.purposeOfLease}</td>
                          )}
                          {showyerlyRent && <td>{contract.yerlyRent}</td>}
                          {showmonthlyRent && <td>{contract.monthlyRent}</td>}
                          {showcreationDate && <td>{contract.creationDate}</td>}
                          {/* حذف حقل الفرع من الجدول */}
                          <td>{contract.endDate}</td>
                          <td>{contract.startDate}</td>
                          <td>{contract.contractNumber}</td>
                          <td>{contract.statue}</td>
                          <td>
                            {(() => {
                              // جلب رقم العين الحقيقي من جدول Properties
                              const property = contractsProperties.find(
                                (p) => p.id === contract.property_number
                              );
                              return property
                                ? property.number
                                : contract.property_number;
                            })()}
                          </td>
                          <td>{tenant ? tenant.name : contract.tenant_name}</td>
                          <td>{contract.landlord}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="RowForInsertinputs">
                <ButtonInput text="طباعة" onClick={handlePrint} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
