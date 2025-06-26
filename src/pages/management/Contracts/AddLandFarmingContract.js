import { useState, useEffect } from "react";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import SelectWithLabel from "../../../components/SelectWithLabel";
import Submitinput from "../../../components/submitinput";
import InputDate from "../../../components/InputDate";
import Bigbutton from "../../../components/Bigbutton";
import SearchableSelect from "../../../components/SearchableSelect";
import { useNavigate, useParams } from "react-router-dom";
import SelectWithLabel3 from "../../../components/SelectWithLabel3";
import Swal from "sweetalert2";

export default function AddLandFarmingContract({
  submitUrl = "http://localhost:3001/LandFarmingContract",
  title = "إدارة العقود",
  dataTitle = "بيانات عقد أرض زراعية",
  initialData = null,
  submitButtonText,
  buttonText,
  onSubmit,
  disabledFields = [],
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const today = new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState({
    contract_landlord: "",
    tenant_name: "",
    property_number: "",
    contract_statue: "جديد", // افتراضي جديد
    contract_contractNumber: "",
    contract_creationDate: today,
    contract_startDate: today,
    contract_endDate: today,
    branch_name: "",
    contract_monthlyRent: "",
    contract_yerlyRent: "",
    contract_purposeOfLease: "",
    contract_initialPayment: "",
    contract_landArea: "",
    renewal_order: "",
  });
  // تعريف الأخطاء بقيم أولية لجميع الحقول
  const initialErrors = {
    contract_landlord: "",
    tenant_name: "",
    property_number: "",
    contract_statue: "",
    contract_contractNumber: "",
    contract_creationDate: "",
    contract_startDate: "",
    contract_endDate: "",
    branch_name: "",
    contract_monthlyRent: "",
    contract_yerlyRent: "",
    contract_purposeOfLease: "",
    contract_initialPayment: "",
    contract_landArea: "",
    error_general: "",
  };
  const [error, setErrors] = useState(initialErrors);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [branches, setBranches] = useState([]);
  const [allContractNumbers, setAllContractNumbers] = useState([]);
  // جلب جميع العقود من AllData.json
  useEffect(() => {
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        const allNumbers = [
          ...(data.LandFarmingContract || []),
          ...(data.WhiteLandContract || []),
          ...(data.PropertyContract || []),
        ]
          // استثني العقد الحالي عند التعديل (لو فيه id)
          .filter((c) => !id || c.id !== id)
          .map((c) => c.contract_contractNumber);
        setAllContractNumbers(allNumbers);
        setTenants(data.Tenants || []);
        setProperties(data.Properties || []);
        setBranches(data.Branches || []);
      });
  }, [id]);
  // تحديث القيم بين الإيجار الشهري والسنوي تلقائياً مع فحص لايف
  const handleRentChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };
    let rentErrors = { ...error };
    if (name === "contract_monthlyRent") {
      if (/^\d+$/.test(value)) {
        updated.contract_yerlyRent = (parseInt(value, 10) * 12).toString();
        rentErrors.contract_monthlyRent = "";
        rentErrors.contract_yerlyRent = "";
      } else {
        updated.contract_yerlyRent = "";
        rentErrors.contract_monthlyRent = value
          ? "الإيجار الشهري يجب أن يكون أرقام فقط"
          : "الإيجار الشهري مطلوب";
      }
    } else if (name === "contract_yerlyRent") {
      if (/^\d+$/.test(value)) {
        updated.contract_monthlyRent = Math.round(
          parseInt(value, 10) / 12
        ).toString();
        rentErrors.contract_yerlyRent = "";
        rentErrors.contract_monthlyRent = "";
      } else {
        updated.contract_monthlyRent = "";
        rentErrors.contract_yerlyRent = value
          ? "الإيجار السنوي يجب أن يكون أرقام فقط"
          : "الإيجار السنوي مطلوب";
      }
    }
    setFormData(updated);
    setErrors(rentErrors);
  };
  // تحديث الحقول مع فحص لايف
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };
    let fieldError = "";
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    switch (name) {
      case "contract_contractNumber":
        if (submitUrl.includes("RenewlyContract")) {
          fieldError = "";
        } else if (allContractNumbers.includes(value)) {
          fieldError = "رقم العقد مستخدم مسبقاً";
        } else if (!value) fieldError = "رقم العقد مطلوب";
        else if (!/^\d+$/.test(value))
          fieldError = "رقم العقد يجب أن يكون أرقام فقط";
        break;
      case "contract_landlord":
        if (!value) fieldError = "هذا الحقل مطلوب";
        else if (!arabicRegex.test(value))
          fieldError = "يجب أن يكون الاسم باللغة العربية فقط";
        break;
      case "contract_purposeOfLease":
        if (!value) fieldError = "غرض الإيجار مطلوب";
        else if (!arabicRegex.test(value))
          fieldError = "يجب أن يكون باللغة العربية فقط";
        break;
      case "contract_initialPayment":
        if (!value) fieldError = "المبلغ المقدم مطلوب";
        else if (!/^\d+$/.test(value))
          fieldError = "المبلغ المقدم يجب أن يكون أرقام فقط";
        break;
      case "contract_landArea":
        if (!value) fieldError = "المساحة مطلوبة";
        break;
      case "branch_name":
        if (!value) fieldError = "الفرع مطلوب";
        break;
      case "tenant_name":
        if (!value) fieldError = "المستأجر مطلوب";
        break;
      case "property_number":
        if (!value) fieldError = "رقم العين مطلوب";
        break;
      case "contract_endDate":
      case "contract_startDate":
        if (name === "contract_endDate" && formData.contract_startDate) {
          const start = new Date(formData.contract_startDate);
          const end = new Date(value);
          if (end < start)
            fieldError = "تاريخ النهاية يجب أن يكون بعد أو يساوي تاريخ البداية";
        }
        if (name === "contract_startDate" && formData.contract_endDate) {
          const start = new Date(value);
          const end = new Date(formData.contract_endDate);
          if (end < start)
            fieldError = "تاريخ البداية يجب أن يكون قبل أو يساوي تاريخ النهاية";
        }
        break;
      default:
        break;
    }
    setFormData(updated);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // تحقق من الطرف الأول
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    let newErrors = {};
    if (!formData.contract_landlord) {
      newErrors.contract_landlord = "هذا الحقل مطلوب";
    } else if (!arabicRegex.test(formData.contract_landlord)) {
      newErrors.contract_landlord = "يجب أن يكون الاسم باللغة العربية فقط";
    }
    // تحقق من رقم العقد
    if (!disabledFields.includes("contract_contractNumber")) {
      if (!formData.contract_contractNumber) {
        newErrors.contract_contractNumber = "رقم العقد مطلوب";
      } else if (!/^\d+$/.test(formData.contract_contractNumber)) {
        newErrors.contract_contractNumber = "رقم العقد يجب أن يكون أرقام فقط";
      }
    }
    // تحقق من تواريخ البداية والنهاية
    if (formData.contract_startDate && formData.contract_endDate) {
      const start = new Date(formData.contract_startDate);
      const end = new Date(formData.contract_endDate);
      if (end < start) {
        newErrors.contract_endDate =
          "تاريخ النهاية يجب أن يكون بعد أو يساوي تاريخ البداية";
        newErrors.contract_startDate =
          "تاريخ البداية يجب أن يكون قبل أو يساوي تاريخ النهاية";
      }
    }
    // تحقق من الإيجار الشهري والسنوي
    if (!formData.contract_monthlyRent) {
      newErrors.contract_monthlyRent = "الإيجار الشهري مطلوب";
    } else if (!/^\d+$/.test(formData.contract_monthlyRent)) {
      newErrors.contract_monthlyRent = "الإيجار الشهري يجب أن يكون أرقام فقط";
    }
    if (!formData.contract_yerlyRent) {
      newErrors.contract_yerlyRent = "الإيجار السنوي مطلوب";
    } else if (!/^\d+$/.test(formData.contract_yerlyRent)) {
      newErrors.contract_yerlyRent = "الإيجار السنوي يجب أن يكون أرقام فقط";
    }
    // تحقق من غرض الإيجار
    if (!formData.contract_purposeOfLease) {
      newErrors.contract_purposeOfLease = "غرض الإيجار مطلوب";
    } else if (!arabicRegex.test(formData.contract_purposeOfLease)) {
      newErrors.contract_purposeOfLease = "يجب أن يكون باللغة العربية فقط";
    }
    // تحقق من المبلغ المقدم
    if (!formData.contract_initialPayment) {
      newErrors.contract_initialPayment = "المبلغ المقدم مطلوب";
    } else if (!/^\d+$/.test(formData.contract_initialPayment)) {
      newErrors.contract_initialPayment = "المبلغ المقدم يجب أن يكون أرقام فقط";
    }
    // تحقق من المساحة
    if (!formData.contract_landArea) {
      newErrors.contract_landArea = "المساحة مطلوبة";
    }
    // تحقق من الفرع
    if (!formData.branch_name) {
      newErrors.branch_name = "الفرع مطلوب";
    }
    // تحقق من المستأجر
    if (!formData.tenant_name) {
      newErrors.tenant_name = "المستأجر مطلوب";
    }
    // تحقق من رقم العين
    if (!formData.property_number) {
      newErrors.property_number = "رقم العين مطلوب";
    }
    // تحقق من ترتيب التجديد
    if (submitUrl.includes("RenewlyContract")) {
      if (!formData.renewal_order) {
        newErrors.renewal_order = "ترتيب التجديد مطلوب";
      } else {
        // جلب جميع عقود التجديد لنفس العقد الأصلي (نفس رقم العقد) من AllData.json
        let renewalsForThisContract = [];
        try {
          const res = await fetch("/JsonData/AllData.json");
          if (res.ok) {
            const allData = await res.json();
            const allRenewals = (allData.RenewlyContract || []).filter(
              (c) =>
                c.contract_contractNumber === formData.contract_contractNumber
            );
            renewalsForThisContract = allRenewals;
          }
        } catch (e) {}
        // لا يمكن تكرار نفس الترتيب
        if (
          renewalsForThisContract.some(
            (c) => c.renewal_order === formData.renewal_order
          )
        ) {
          newErrors.renewal_order = "لا يمكن تكرار ترتيب التجديد لنفس العقد";
        }
        // لا يمكن اختيار الثاني قبل الأول أو الثالث قبل الثاني
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
    }
    if (Object.keys(newErrors).length > 0) {
      // SweetAlert2 popup for renewal_order error
      if (newErrors.renewal_order) {
        Swal.fire({
          icon: "error",
          title: "خطأ في ترتيب التجديد",
          text: newErrors.renewal_order,
          confirmButtonText: "حسناً",
        });
      }
      setErrors({ ...initialErrors, ...newErrors });
      return;
    }
    setErrors(initialErrors);
    try {
      let url = submitUrl;
      let method = "POST";
      let bodyData = { ...formData };
      // إذا كان التجديد، دومًا POST بدون id
      if (submitUrl.includes("RenewlyContract")) {
        method = "POST";
        url = submitUrl;
      } else if (id) {
        url = `${submitUrl}/${id}`;
        method = "PUT";
      }
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
      if (response.ok) {
        navigate("/management/Contracts/DisplaySearchContract");
      } else {
        const data = await response.json();
        if (data && data.message) {
          if (typeof data.message === "object") {
            // إذا كان رقم العقد Disabled (تجديد)، لا تعرض الخطأ تحته
            if (disabledFields.includes("contract_contractNumber")) {
              setErrors({
                ...error,
                error_general:
                  data.message.contract_contractNumber || data.message,
              });
            } else {
              setErrors({ ...error, ...data.message });
            }
          } else if (typeof data.message === "string") {
            if (disabledFields.includes("contract_contractNumber")) {
              setErrors({ ...error, error_general: data.message });
            } else {
              setErrors({ ...error, contract_contractNumber: data.message });
            }
          } else {
            setErrors({
              ...error,
              contract_contractNumber: "Registration failed.",
            });
          }
        } else {
          setErrors({
            ...error,
            contract_contractNumber: "Registration failed.",
          });
        }
      }
    } catch (err) {
      setErrors({ ...error, contract_contractNumber: "An error occurred." });
      console.error(err);
    }
  };
  // تحديث حالة العقد تلقائياً عند انتهاء الفترة
  useEffect(() => {
    if (formData.contract_endDate) {
      const end = new Date(formData.contract_endDate);
      const now = new Date();
      if (end < now && formData.contract_statue !== "منتهي") {
        setFormData((prev) => ({ ...prev, contract_statue: "منتهي" }));
      } else if (end >= now && formData.contract_statue !== "جديد") {
        setFormData((prev) => ({ ...prev, contract_statue: "جديد" }));
      }
    }
    // eslint-disable-next-line
  }, [formData.contract_endDate, formData.contract_statue]);
  // جلب بيانات العقد عند وجود id في الرابط
  useEffect(() => {
    if (id) {
      fetch("/JsonData/AllData.json")
        .then((res) => res.json())
        .then((data) => {
          const contract = (data.LandFarmingContract || []).find(
            (c) => c.id === id
          );
          if (contract) setFormData(contract);
        });
    }
  }, [id]);
  // ملء الحقول بالبيانات الأولية عند توفرها
  useEffect(() => {
    if (initialData) {
      setFormData({
        contract_landlord: initialData.contract_landlord,
        tenant_name: initialData.tenant_name,
        property_number: initialData.property_number,
        contract_statue: initialData.contract_statue,
        contract_contractNumber: initialData.contract_contractNumber,
        contract_creationDate: initialData.contract_creationDate,
        contract_startDate: initialData.contract_startDate,
        contract_endDate: initialData.contract_endDate,
        branch_name: initialData.branch_name,
        contract_monthlyRent: initialData.contract_monthlyRent,
        contract_yerlyRent: initialData.contract_yerlyRent,
        contract_purposeOfLease: initialData.contract_purposeOfLease,
        contract_initialPayment: initialData.contract_initialPayment,
        contract_landArea: initialData.contract_landArea,
        renewal_order: initialData.renewal_order || "",
      });
    }
  }, [initialData]);
  return (
    <div className="displayflexhome">
      <Saidbar />
      {/* مساحة أخذنها بمثابة السايد البار لانه عملت السايد بار ثابت على اليسار */}
      <div className="sizeboxUnderSaidbar"></div>
      {/*  */}
      {/* المحتوى الخاص بالصفحة */}
      <div className="homepage">
        {/* عنوان الصفحة */}
        <Managmenttitle title={title} />
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
          {/*  */}
          {/* يحمل المحتوى تحت البوتنس */}
          <form className="divforconten" onSubmit={handleSubmit}>
            {error.error_general && (
              <div
                className="error-message"
                style={{ textAlign: "center", color: "red", marginBottom: 10 }}
              >
                {error.error_general}
              </div>
            )}
            <Managementdata dataname={dataTitle} />
            <div className="divforaddmosque">
              <div
                className="RowForInsertinputs"
                style={{ marginBottom: 25, marginTop: 15 }}
              >
                <div className="input-container">
                  {disabledFields.includes("property_number") ? (
                    <Inputwithlabel
                      value={
                        // إذا كان الحقل ثابتًا، اعرض رقم العين المقروء بدلاً من id
                        properties.find(
                          (p) => p.id === formData.property_number
                        )?.property_number || formData.property_number
                      }
                      name="property_number"
                      change={() => {}}
                      text="رقم العين"
                      disabled={true}
                    />
                  ) : (
                    <SearchableSelect
                      value={formData.property_number}
                      name="property_number"
                      change={(e) => {
                        setFormData({
                          ...formData,
                          property_number: e.target.value,
                        });
                        handleChange({
                          target: {
                            name: "property_number",
                            value: e.target.value,
                          },
                        });
                      }}
                      options={properties.map((p) => ({
                        value: p.id,
                        label: p.property_number,
                      }))}
                      text="رقم العين"
                      placeholder="اختر رقم العين"
                      disabled={disabledFields.includes("property_number")}
                    />
                  )}
                  {error.property_number && (
                    <div className="error-message">{error.property_number}</div>
                  )}
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  {disabledFields.includes("tenant_name") ? (
                    <Inputwithlabel
                      value={
                        // إذا كان الحقل ثابتًا، اعرض اسم المستأجر بدلاً من id
                        tenants.find((t) => t.id === formData.tenant_name)
                          ?.name || formData.tenant_name
                      }
                      name="tenant_name"
                      change={() => {}}
                      text="المستأجر"
                      disabled={true}
                    />
                  ) : (
                    <SearchableSelect
                      value={formData.tenant_name}
                      name="tenant_name"
                      change={(e) => {
                        setFormData({
                          ...formData,
                          tenant_name: e.target.value,
                        });
                        handleChange({
                          target: {
                            name: "tenant_name",
                            value: e.target.value,
                          },
                        });
                      }}
                      options={tenants.map((t) => ({
                        value: t.id,
                        label: t.name,
                      }))}
                      text="المستأجر"
                      placeholder="اختر المستأجر"
                      disabled={disabledFields.includes("tenant_name")}
                    />
                  )}
                  {error.tenant_name && (
                    <div className="error-message">{error.tenant_name}</div>
                  )}
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.contract_landlord}
                    name="contract_landlord"
                    change={handleChange}
                    text="الطرف الأول"
                    error={error && error.contract_landlord}
                    disabled={disabledFields.includes("contract_landlord")}
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
                    change={handleChange}
                    text="رقم العقد"
                    error={error && error.contract_contractNumber}
                    disabled={submitUrl.includes("RenewlyContract")}
                  />
                  {error.contract_contractNumber && (
                    <div className="error-message">
                      {error.contract_contractNumber}
                    </div>
                  )}
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
                  {disabledFields.includes("branch_name") ? (
                    <Inputwithlabel
                      value={
                        // إذا كان الحقل ثابتًا، اعرض اسم الفرع بدلاً من id
                        branches.find((b) => b.id === formData.branch_name)
                          ?.name || formData.branch_name
                      }
                      name="branch_name"
                      change={() => {}}
                      text="الفرع"
                      disabled={true}
                    />
                  ) : (
                    <SearchableSelect
                      value={formData.branch_name}
                      name="branch_name"
                      change={(e) => {
                        setFormData({
                          ...formData,
                          branch_name: e.target.value,
                        });
                        handleChange({
                          target: {
                            name: "branch_name",
                            value: e.target.value,
                          },
                        });
                      }}
                      options={branches.map((b) => ({
                        value: b.id, // id الخاص بالفرع
                        label: b.name, // اسم الفرع للعرض
                      }))}
                      text="الفرع"
                      placeholder="اختر الفرع"
                      disabled={disabledFields.includes("branch_name")}
                    />
                  )}
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
                    error={error && error.contract_endDate}
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
                    error={error && error.contract_startDate}
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
                    error={error && error.contract_purposeOfLease}
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
                    change={handleRentChange}
                    text="إيجار السنوي"
                    error={error && error.contract_yerlyRent}
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
                    change={handleRentChange}
                    text="إيجار الشهري"
                    error={error && error.contract_monthlyRent}
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
                    change={handleChange}
                    text="المساحة"
                    error={error && error.contract_landArea}
                    disabled={disabledFields.includes("contract_landArea")}
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
                    error={error && error.contract_initialPayment}
                  />
                  {error.contract_initialPayment && (
                    <div className="error-message">
                      {error.contract_initialPayment}
                    </div>
                  )}
                </div>
              </div>
              <div className="RowForInsertinputs">
                <Submitinput
                  text={
                    submitButtonText ||
                    buttonText ||
                    (id ? "حفظ التعديلات" : "حفظ")
                  }
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
