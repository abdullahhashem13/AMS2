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

export default function EditRenewlyContract() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState({});
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [branches, setBranches] = useState([]);
  const [allRenewals, setAllRenewals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب بيانات العقد الأصلي عند التجديد
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        // إذا كان هناك id لعقد أصلي (وليس عقد مجدد)
        let contract = null;
        // ابحث في جميع أنواع العقود الأصلية
        contract =
          (data.LandFarmingContract || []).find((c) => c.id === id) ||
          (data.WhiteLandContract || []).find((c) => c.id === id) ||
          (data.PropertyContract || []).find((c) => c.id === id);
        // إذا لم يوجد، ابحث في المجدد
        if (!contract) {
          contract = (data.RenewlyContract || []).find((c) => c.id === id);
        }
        // إذا جلبنا عقد أصلي أو مجدد، ثبّت كل القيم كما هي، فقط غيّر الحالة إلى "مجدد"
        if (contract) {
          // إذا كانت القيمة "جديد" أو أي قيمة أخرى غير "منتهي"، اجعلها "مجدد"
          setFormData({
            ...contract,
            contract_statue:
              contract.contract_statue === "منتهي" ? "منتهي" : "مجدد",
          });
        }
        setTenants(data.Tenants || []);
        setProperties(data.Properties || []);
        setBranches(data.Branches || []);
        setAllRenewals(data.RenewlyContract || []);
        setLoading(false);
      });
  }, [id]);

  // عند أي تغيير في الحقول، ثبّت حالة العقد على "مجدد" إلا إذا انتهى
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };
    // إذا كان تاريخ النهاية أقل من اليوم، الحالة "منتهي"، غير ذلك "مجدد"
    if (
      (name === "contract_endDate" || name === "contract_startDate") &&
      updated.contract_endDate &&
      updated.contract_startDate
    ) {
      const end = new Date(
        name === "contract_endDate" ? value : updated.contract_endDate
      );
      const now = new Date();
      if (end < now) {
        updated.contract_statue = "منتهي";
      } else {
        updated.contract_statue = "مجدد";
      }
    } else if (name === "contract_endDate") {
      // إذا فقط تم تغيير تاريخ النهاية
      const end = new Date(value);
      const now = new Date();
      if (end < now) {
        updated.contract_statue = "منتهي";
      } else {
        updated.contract_statue = "مجدد";
      }
    } else {
      // في كل الحالات الأخرى
      updated.contract_statue =
        formData.contract_statue === "منتهي" ? "منتهي" : "مجدد";
    }
    setFormData(updated);
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // تحقق من الحقول المطلوبة
    let newErrors = {};
    if (!formData.contract_landlord)
      newErrors.contract_landlord = "هذا الحقل مطلوب";
    if (!formData.tenant_name) newErrors.tenant_name = "المستأجر مطلوب";
    if (!formData.property_number)
      newErrors.property_number = "رقم العين مطلوب";
    if (!formData.branch_name) newErrors.branch_name = "الفرع مطلوب";
    if (!formData.contract_startDate)
      newErrors.contract_startDate = "تاريخ البداية مطلوب";
    if (!formData.contract_endDate)
      newErrors.contract_endDate = "تاريخ النهاية مطلوب";
    if (!formData.renewal_order)
      newErrors.renewal_order = "ترتيب التجديد مطلوب";

    // تحقق من تكرار وترتيب التجديدات (مع استثناء العقد الحالي)
    if (formData.renewal_order) {
      const renewalsForThisContract = allRenewals.filter(
        (c) =>
          (c.contract_contractNumber === formData.contract_contractNumber ||
            c.property_number === formData.property_number) &&
          c.id !== formData.id // استثناء العقد الحالي
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
      setError(newErrors);
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
    // إرسال التعديل (PUT)
    try {
      const response = await fetch(
        `http://localhost:3001/RenewlyContract/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        navigate("/management/Contracts/DisplaySearchContract");
      } else {
        let data;
        try {
          data = await response.json();
        } catch (e) {
          const text = await response.text();
          setError({ error_general: text || "حدث خطأ غير متوقع من السيرفر." });
          return;
        }
        setError(
          data.message ? data.message : { error_general: "فشل التعديل" }
        );
      }
    } catch (err) {
      setError({ error_general: "حدث خطأ أثناء الاتصال بالسيرفر." });
    }
  };

  if (loading || !formData) return <div>جاري التحميل...</div>;

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة العقود" />
        {/*  */}
        {/* يحمل ما تحت العنوان */}
        <div className="subhomepage">
          {/* يحمل البوتنس */}
          <div className="divforbuttons">
            {/* تم تقسيمهن الى دفيين عشان كل دف يكون في الطرف */}

            {/* الثاني */}
            <div>
              {/* <Bigbutton
                                                      text="أنواع الاعيان"
                                                      path="/management/Properties/TypesProperty"
                                                    /> */}
            </div>
            {/* الاول */}
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

          <form className="divforconten" onSubmit={handleSubmit}>
            {error.error_general && (
              <div
                className="error-message"
                style={{ textAlign: "center", color: "red", marginBottom: 10 }}
              >
                {error.error_general}
              </div>
            )}
            <Managementdata
              dataname={
                formData && formData.contract_type === "أرض بيضاء"
                  ? "تعديل عقد مجدد أرض بيضاء"
                  : "تعديل عقد مجدد أرض زراعية "
              }
            />
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
                        ? property.property_number
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
                    value={formData.contract_landlord}
                    name="contract_landlord"
                    change={() => {}}
                    text="الطرف الأول"
                    disabled={true}
                    error={error.contract_landlord}
                  />
                  {error.contract_landlord && (
                    <div className="error-message">
                      {error.contract_landlord}
                    </div>
                  )}
                </div>
              </div>
              <div className="RowForInsertinputs" style={{ marginBottom: 25 }}>
                <div className="input-container">
                  <InputDate
                    value={formData.contract_creationDate}
                    name="contract_creationDate"
                    change={handleChange}
                    text="تاريخ الاصدار"
                  />
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.contract_contractNumber}
                    name="contract_contractNumber"
                    change={() => {}}
                    text="رقم العقد"
                    disabled={true}
                  />
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.contract_statue}
                    name="contract_statue"
                    change={() => {}}
                    text="حالة العقد"
                    disabled={true}
                  />
                </div>
              </div>
              <div className="RowForInsertinputs" style={{ marginBottom: 25 }}>
                <div className="input-container">
                  <Inputwithlabel
                    value={(() => {
                      const branch = branches.find(
                        (b) => b.id === formData.branch_name
                      );
                      return branch ? branch.name : formData.branch_name;
                    })()}
                    name="branch_name"
                    change={() => {}}
                    text="الفرع"
                    disabled={true}
                  />
                  {error.branch_name && (
                    <div className="error-message">{error.branch_name}</div>
                  )}
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <InputDate
                    value={formData.contract_endDate}
                    name="contract_endDate"
                    change={handleChange}
                    text="إلى فترة"
                    error={error.contract_endDate}
                  />
                  {error.contract_endDate && (
                    <div className="error-message">
                      {error.contract_endDate}
                    </div>
                  )}
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <InputDate
                    value={formData.contract_startDate}
                    name="contract_startDate"
                    change={handleChange}
                    text="من فترة"
                    error={error.contract_startDate}
                  />
                  {error.contract_startDate && (
                    <div className="error-message">
                      {error.contract_startDate}
                    </div>
                  )}
                </div>
              </div>
              <div className="RowForInsertinputs" style={{ marginBottom: 25 }}>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.contract_purposeOfLease}
                    name="contract_purposeOfLease"
                    change={handleChange}
                    text="غرض الإيجار"
                    error={error.contract_purposeOfLease}
                  />
                  {error.contract_purposeOfLease && (
                    <div className="error-message">
                      {error.contract_purposeOfLease}
                    </div>
                  )}
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.contract_yerlyRent}
                    name="contract_yerlyRent"
                    change={handleChange}
                    text="إيجار السنوي"
                    error={error.contract_yerlyRent}
                  />
                  {error.contract_yerlyRent && (
                    <div className="error-message">
                      {error.contract_yerlyRent}
                    </div>
                  )}
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.contract_monthlyRent}
                    name="contract_monthlyRent"
                    change={handleChange}
                    text="إيجار الشهري"
                    error={error.contract_monthlyRent}
                  />
                  {error.contract_monthlyRent && (
                    <div className="error-message">
                      {error.contract_monthlyRent}
                    </div>
                  )}
                </div>
              </div>
              <div className="RowForInsertinputs" style={{ marginBottom: 25 }}>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.contract_landArea}
                    name="contract_landArea"
                    change={() => {}}
                    text="المساحة"
                    disabled={true}
                    error={error.contract_landArea}
                  />
                  {error.contract_landArea && (
                    <div className="error-message">
                      {error.contract_landArea}
                    </div>
                  )}
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.contract_initialPayment}
                    name="contract_initialPayment"
                    change={handleChange}
                    text="المبلغ المقدم"
                    error={error.contract_initialPayment}
                  />
                  {error.contract_initialPayment && (
                    <div className="error-message">
                      {error.contract_initialPayment}
                    </div>
                  )}
                </div>
                <div className="widthbetween"></div>
                {/* حقل ترتيب التجديد يظهر فقط في صفحة تجديد العقد */}
                {formData &&
                  formData.contract_statue === "مجدد" &&
                  // يظهر فقط إذا كان id موجود في RenewlyContract (id يبدأ بـ "renew")
                  formData.id &&
                  formData.id.startsWith("renew") && (
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
                        <div className="error-message">
                          {error.renewal_order}
                        </div>
                      )}
                    </div>
                  )}
              </div>
              <div className="RowForInsertinputs">
                <Submitinput text="حفظ التعديل" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
