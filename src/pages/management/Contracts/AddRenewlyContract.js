import { useState, useEffect } from "react";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Submitinput from "../../../components/submitinput";
import InputDate from "../../../components/InputDate";
import Bigbutton from "../../../components/Bigbutton";
import SearchableSelect from "../../../components/SearchableSelect";
import { useNavigate, useParams } from "react-router-dom";
import SelectWithLabel3 from "../../../components/SelectWithLabel3";
import Swal from "sweetalert2";

export default function AddRenewlyContract() {
  const navigate = useNavigate();
  const { id } = useParams(); // id للعقد الأصلي
  const [formData, setFormData] = useState(null);
  // متغيرات لتحديد نوع العقد الأصلي
  const [propertyMode, setPropertyMode] = useState(false);
  const [showYearlyRent, setShowYearlyRent] = useState(false);
  const [showInitialPayment, setShowInitialPayment] = useState(false);
  const initialErrors = {
    landlord: "",
    tenant_name: "",
    property_number: "",
    statue: "",
    contractNumber: "",
    creationDate: "",
    startDate: "",
    endDate: "",
    yerlyRent: "",
    rentDuration: "",
    monthlyRent: "",
    purposeOfLease: "",
    renewal_order: "",
    initialPayment: "",
    landArea: "",
    error_general: "",
  };
  const [error, setError] = useState(initialErrors);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  // حذف الفروع نهائياً
  const [loading, setLoading] = useState(true);
  const [allRenewals, setAllRenewals] = useState([]);

  useEffect(() => {
    // جلب بيانات العقد الأصلي وجميع عقود التجديد
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        let contract = null;
        let contractType = null;
        // حدد نوع العقد الأصلي
        contract = (data.LandFarmingContract || []).find((c) => c.id === id);
        if (contract) contractType = "landFarming";
        if (!contract) {
          contract = (data.WhiteLandContract || []).find((c) => c.id === id);
          if (contract) contractType = "whiteLand";
        }
        if (!contract) {
          contract = (data.PropertyContract || []).find((c) => c.id === id);
          if (contract) contractType = "property";
        }
        if (contract) {
          // إعداد بيانات العقد المجدد
          setFormData({
            ...contract,
            id: `renew_${contract.id}_${Date.now()}`,
            statue: "مجدد",
            renewal_order: "",
            contractNumber: contract.contractNumber,
            creationDate: new Date().toISOString().slice(0, 10),
          });
          // ضبط منطق الحقول حسب نوع العقد
          if (contractType === "property") {
            setPropertyMode(true);
            setShowYearlyRent(false);
            setShowInitialPayment(false);
          } else if (contractType === "whiteLand") {
            setPropertyMode(false);
            setShowYearlyRent(true);
            setShowInitialPayment(true);
          } else {
            // landFarming
            setPropertyMode(false);
            setShowYearlyRent(false);
            setShowInitialPayment(false);
          }
        }
        setTenants(data.Tenants || []);
        setProperties(data.Properties || []);
        setAllRenewals(data.RenewlyContract || []);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };
    // تحديث حالة العقد
    if (
      (name === "endDate" || name === "startDate") &&
      updated.endDate &&
      updated.startDate
    ) {
      const end = new Date(name === "endDate" ? value : updated.endDate);
      const now = new Date();
      if (end < now) {
        updated.statue = "منتهي";
      } else {
        updated.statue = "مجدد";
      }
    } else if (name === "endDate") {
      const end = new Date(value);
      const now = new Date();
      if (end < now) {
        updated.statue = "منتهي";
      } else {
        updated.statue = "مجدد";
      }
    } else {
      updated.statue = formData.statue === "منتهي" ? "منتهي" : "مجدد";
    }
    setFormData(updated);
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.landlord) newErrors.landlord = "هذا الحقل مطلوب";
    if (!formData.tenant_name) newErrors.tenant_name = "المستأجر مطلوب";
    if (!formData.property_number)
      newErrors.property_number = "رقم العين مطلوب";
    // حذف التحقق من الفرع
    if (!formData.startDate) newErrors.startDate = "تاريخ البداية مطلوب";
    if (!formData.endDate) newErrors.endDate = "تاريخ النهاية مطلوب";
    if (!formData.renewal_order)
      newErrors.renewal_order = "ترتيب التجديد مطلوب";

    // تحقق من تكرار وترتيب التجديدات
    if (formData.renewal_order) {
      // جميع التجديدات لنفس العقد الأصلي
      const renewalsForThisContract = allRenewals.filter(
        (c) =>
          c.contractNumber === formData.contractNumber ||
          c.property_number === formData.property_number
      );
      // تحقق من التكرار
      if (
        renewalsForThisContract.some(
          (c) => c.renewal_order === formData.renewal_order
        )
      ) {
        newErrors.renewal_order = "لا يمكن تكرار ترتيب التجديد لنفس العقد";
      }
      // تحقق من التسلسل
      const orders = ["التجديد الأول", "التجديد الثاني", "التجديد الثالث"];
      const selectedIndex = orders.indexOf(formData.renewal_order);
      for (let i = 0; i < selectedIndex; i++) {
        if (
          !renewalsForThisContract.some((c) => c.renewal_order === orders[i])
        ) {
          newErrors.renewal_order = `يجب اختيار ${orders[i]} أولاً`;
          break;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setError({ ...initialErrors, ...newErrors });
      if (newErrors.renewal_order) {
        Swal.fire({
          icon: "error",
          title: "خطأ في ترتيب التجديد",
          text: newErrors.renewal_order,
          confirmButtonText: "حسناً",
        });
      }
      return;
    }
    // إرسال البيانات (POST)
    try {
      const response = await fetch(`http://localhost:3001/RenewlyContract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        navigate("/management/Contracts/DisplaySearchContract");
      } else {
        let data;
        try {
          data = await response.json();
        } catch (e) {
          const text = await response.text();
          setError({
            ...initialErrors,
            error_general: text || "حدث خطأ غير متوقع من السيرفر.",
          });
          return;
        }
        setError(
          data.message ? data.message : { error_general: "فشل الإضافة" }
        );
      }
    } catch (err) {
      setError({
        ...initialErrors,
        error_general: "حدث خطأ أثناء الاتصال بالسيرفر.",
      });
    }
  };

  if (loading || !formData) return <div>جاري التحميل...</div>;

  // إعادة استخدام نفس منطق الإضافة: إظهار الحقول حسب نوع العقد الأصلي
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
          {/* إعادة استخدام نفس منطق الحقول كما في الإضافة */}
          <form className="divforconten" onSubmit={handleSubmit}>
            {error.error_general && (
              <div
                className="error-message"
                style={{ textAlign: "center", color: "red", marginBottom: 10 }}
              >
                {error.error_general}
              </div>
            )}
            <Managementdata dataname="إضافة عقد مجدد" />
            <div className="divforaddmosque">
              <div
                className="RowForInsertinputs"
                style={{ marginBottom: 25, marginTop: 15 }}
              >
                <div className="input-container">
                  <Inputwithlabel
                    value={(() => {
                      const property = properties.find(
                        (p) => p.id === formData.property_number
                      );
                      return property
                        ? property.number
                        : formData.property_number;
                    })()}
                    name="property_number"
                    change={() => {}}
                    text="رقم العين"
                    disabled={true}
                  />
                  {error.property_number && (
                    <div className="error-message">{error.property_number}</div>
                  )}
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={(() => {
                      const tenant = tenants.find(
                        (t) => t.id === formData.tenant_name
                      );
                      return tenant ? tenant.name : formData.tenant_name;
                    })()}
                    name="tenant_name"
                    change={() => {}}
                    text="المستأجر"
                    disabled={true}
                  />
                  {error.tenant_name && (
                    <div className="error-message">{error.tenant_name}</div>
                  )}
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.landlord}
                    name="landlord"
                    change={() => {}}
                    text="الطرف الأول"
                    disabled={true}
                    error={error.landlord}
                  />
                  {error.landlord && (
                    <div className="error-message">{error.landlord}</div>
                  )}
                </div>
              </div>
              <div className="RowForInsertinputs" style={{ marginBottom: 25 }}>
                <div className="input-container">
                  <InputDate
                    value={formData.creationDate}
                    name="creationDate"
                    change={handleChange}
                    text="تاريخ الاصدار"
                  />
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.contractNumber}
                    name="contractNumber"
                    change={() => {}}
                    text="رقم العقد"
                    disabled={true}
                  />
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.statue}
                    name="statue"
                    change={() => {}}
                    text="حالة العقد"
                    disabled={true}
                  />
                </div>
              </div>
              <div className="RowForInsertinputs" style={{ marginBottom: 25 }}>
                <div className="input-container">
                  <InputDate
                    value={formData.endDate}
                    name="endDate"
                    change={handleChange}
                    text="إلى فترة"
                    error={error.endDate}
                  />
                  {error.endDate && (
                    <div className="error-message">{error.endDate}</div>
                  )}
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <InputDate
                    value={formData.startDate}
                    name="startDate"
                    change={handleChange}
                    text="من فترة"
                    error={error.startDate}
                  />
                  {error.startDate && (
                    <div className="error-message">{error.startDate}</div>
                  )}
                </div>
              </div>
              <div className="RowForInsertinputs" style={{ marginBottom: 25 }}>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.purposeOfLease}
                    name="purposeOfLease"
                    change={handleChange}
                    text="غرض الإيجار"
                    error={error.purposeOfLease}
                  />
                  {error.purposeOfLease && (
                    <div className="error-message">{error.purposeOfLease}</div>
                  )}
                </div>
                <div className="widthbetween"></div>
                {/* منطق الحقول حسب نوع العقد */}
                {propertyMode ? (
                  <>
                    <div className="input-container">
                      <Inputwithlabel
                        value={formData.yerlyRent}
                        name="yerlyRent"
                        change={handleChange}
                        text="إيجار السنوي"
                        error={error.yerlyRent}
                      />
                      {error.yerlyRent && (
                        <div className="error-message">{error.yerlyRent}</div>
                      )}
                    </div>
                    <div className="widthbetween"></div>
                    <div className="input-container">
                      <Inputwithlabel
                        value={formData.rentDuration}
                        name="rentDuration"
                        change={handleChange}
                        text="مدة دفع الإيجار"
                        error={error.rentDuration}
                      />
                      {error.rentDuration && (
                        <div className="error-message">
                          {error.rentDuration}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="input-container">
                      <Inputwithlabel
                        value={formData.monthlyRent}
                        name="monthlyRent"
                        change={handleChange}
                        text="إيجار الشهري"
                        error={error.monthlyRent}
                      />
                      {error.monthlyRent && (
                        <div className="error-message">{error.monthlyRent}</div>
                      )}
                    </div>
                    {showYearlyRent && (
                      <>
                        <div className="widthbetween"></div>
                        <div className="input-container">
                          <Inputwithlabel
                            value={formData.yerlyRent}
                            name="yerlyRent"
                            change={handleChange}
                            text="إيجار السنوي"
                            error={error.yerlyRent}
                          />
                          {error.yerlyRent && (
                            <div className="error-message">
                              {error.yerlyRent}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              {showInitialPayment && (
                <div
                  className="RowForInsertinputs"
                  style={{ marginBottom: 25 }}
                >
                  <div className="input-container">
                    <Inputwithlabel
                      value={formData.initialPayment}
                      name="initialPayment"
                      change={handleChange}
                      text="المبلغ المقدم"
                      error={error.initialPayment}
                    />
                    {error.initialPayment && (
                      <div className="error-message">
                        {error.initialPayment}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="RowForInsertinputs" style={{ marginBottom: 25 }}>
                {/* حقل ترتيب التجديد يظهر فقط في صفحة إضافة عقد مجدد */}
                {formData && formData.id && formData.id.startsWith("renew") && (
                  <div className="input-container">
                    <SelectWithLabel3
                      name="renewal_order"
                      value={formData.renewal_order}
                      change={handleChange}
                      text="ترتيب التجديد"
                      value1="التجديد الأول"
                      value2="التجديد الثاني"
                      value3="التجديد الثالث"
                    />
                    {error.renewal_order && (
                      <div className="error-message">{error.renewal_order}</div>
                    )}
                  </div>
                )}
              </div>
              <div className="RowForInsertinputs">
                <Submitinput text="إضافة " />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
