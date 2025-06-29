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
  showYearlyRent = false,
  showInitialPayment = false,
  propertyMode = false,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const today = new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState({
    landlord: "",
    tenant_name: "",
    property_number: "",
    statue: "جديد", // افتراضي جديد
    contractNumber: "",
    creationDate: today,
    startDate: today,
    endDate: today,
    yerlyRent: "",
    rentDuration: "",
    monthlyRent: "",
    purposeOfLease: "",
    renewal_order: "",
    initialPayment: "",
  });
  // تعريف الأخطاء بقيم أولية لجميع الحقول
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
    error_general: "",
  };
  const [error, setErrors] = useState(initialErrors);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  // حذف الفرع
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
          .map((c) => c.contractNumber);
        setAllContractNumbers(allNumbers);
        setTenants(data.Tenants || []);
        setProperties(data.Properties || []);
      });
  }, [id]);
  // تحديث القيم بين الإيجار الشهري والسنوي تلقائياً مع فحص لايف
  // حذف دالة handleRentChange لأننا لن نستخدم الإيجار السنوي
  // تحديث الحقول مع فحص لايف
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };
    let fieldError = "";
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    switch (name) {
      case "contractNumber":
        if (submitUrl.includes("RenewlyContract")) {
          fieldError = "";
        } else if (allContractNumbers.includes(value)) {
          fieldError = "رقم العقد مستخدم مسبقاً";
        } else if (!value) fieldError = "رقم العقد مطلوب";
        else if (!/^\d+$/.test(value))
          fieldError = "رقم العقد يجب أن يكون أرقام فقط";
        break;
      case "landlord":
        if (!value) fieldError = "هذا الحقل مطلوب";
        else if (!arabicRegex.test(value))
          fieldError = "يجب أن يكون الاسم باللغة العربية فقط";
        break;
      case "purposeOfLease":
        if (!value) fieldError = "غرض الإيجار مطلوب";
        else if (!arabicRegex.test(value))
          fieldError = "يجب أن يكون باللغة العربية فقط";
        break;
      case "initialPayment":
        if (showInitialPayment) {
          if (!value) fieldError = "المبلغ المقدم مطلوب";
          else if (!/^\d+$/.test(value))
            fieldError = "المبلغ المقدم يجب أن يكون أرقام فقط";
        }
        break;
      case "landArea":
        if (!value) fieldError = "المساحة مطلوبة";
        break;
      // حذف تحقق الفرع
      case "tenant_name":
        if (!value) fieldError = "المستأجر مطلوب";
        break;
      case "property_number":
        if (!value) fieldError = "رقم العين مطلوب";
        break;
      case "endDate":
      case "startDate":
        if (name === "endDate" && formData.startDate) {
          const start = new Date(formData.startDate);
          const end = new Date(value);
          if (end < start)
            fieldError = "تاريخ النهاية يجب أن يكون بعد أو يساوي تاريخ البداية";
        }
        if (name === "startDate" && formData.endDate) {
          const start = new Date(value);
          const end = new Date(formData.endDate);
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
    if (!formData.landlord) {
      newErrors.landlord = "هذا الحقل مطلوب";
    } else if (!arabicRegex.test(formData.landlord)) {
      newErrors.landlord = "يجب أن يكون الاسم باللغة العربية فقط";
    }
    // تحقق من رقم العقد
    if (!disabledFields.includes("contractNumber")) {
      if (!formData.contractNumber) {
        newErrors.contractNumber = "رقم العقد مطلوب";
      } else if (!/^\d+$/.test(formData.contractNumber)) {
        newErrors.contractNumber = "رقم العقد يجب أن يكون أرقام فقط";
      }
    }
    // تحقق من تواريخ البداية والنهاية
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate =
          "تاريخ النهاية يجب أن يكون بعد أو يساوي تاريخ البداية";
        newErrors.startDate =
          "تاريخ البداية يجب أن يكون قبل أو يساوي تاريخ النهاية";
      }
    }
    // تحقق من الإيجار
    if (propertyMode) {
      if (!formData.yerlyRent) {
        newErrors.yerlyRent = "الإيجار السنوي مطلوب";
      } else if (!/^\d+$/.test(formData.yerlyRent)) {
        newErrors.yerlyRent = "الإيجار السنوي يجب أن يكون أرقام فقط";
      }
      if (!formData.rentDuration) {
        newErrors.rentDuration = "مدة دفع الإيجار مطلوبة";
      } else if (!/^[\u0600-\u06FF0-9\s]+$/.test(formData.rentDuration)) {
        newErrors.rentDuration =
          "مدة دفع الإيجار يجب أن تكون أحرف عربية أو أرقام فقط";
      }
    } else {
      if (!formData.monthlyRent) {
        newErrors.monthlyRent = "الإيجار الشهري مطلوب";
      } else if (!/^\d+$/.test(formData.monthlyRent)) {
        newErrors.monthlyRent = "الإيجار الشهري يجب أن يكون أرقام فقط";
      }
      if (showYearlyRent) {
        if (!formData.yerlyRent) {
          newErrors.yerlyRent = "الإيجار السنوي مطلوب";
        } else if (!/^\d+$/.test(formData.yerlyRent)) {
          newErrors.yerlyRent = "الإيجار السنوي يجب أن يكون أرقام فقط";
        }
      }
    }
    // تحقق من غرض الإيجار
    if (!formData.purposeOfLease) {
      newErrors.purposeOfLease = "غرض الإيجار مطلوب";
    } else if (!arabicRegex.test(formData.purposeOfLease)) {
      newErrors.purposeOfLease = "يجب أن يكون باللغة العربية فقط";
    }
    // تحقق من المبلغ المقدم إذا كان ظاهر
    if (showInitialPayment) {
      if (!formData.initialPayment) {
        newErrors.initialPayment = "المبلغ المقدم مطلوب";
      } else if (!/^\d+$/.test(formData.initialPayment)) {
        newErrors.initialPayment = "المبلغ المقدم يجب أن يكون أرقام فقط";
      }
    }
    // حذف تحقق الفرع
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
              (c) => c.contractNumber === formData.contractNumber
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
            if (disabledFields.includes("contractNumber")) {
              setErrors({
                ...error,
                error_general: data.message.contractNumber || data.message,
              });
            } else {
              setErrors({ ...error, ...data.message });
            }
          } else if (typeof data.message === "string") {
            if (disabledFields.includes("contractNumber")) {
              setErrors({ ...error, error_general: data.message });
            } else {
              setErrors({ ...error, contractNumber: data.message });
            }
          } else {
            setErrors({
              ...error,
              contractNumber: "Registration failed.",
            });
          }
        } else {
          setErrors({
            ...error,
            contractNumber: "Registration failed.",
          });
        }
      }
    } catch (err) {
      setErrors({ ...error, contractNumber: "An error occurred." });
      console.error(err);
    }
  };
  // تحديث حالة العقد تلقائياً عند انتهاء الفترة
  useEffect(() => {
    if (formData.endDate) {
      const end = new Date(formData.endDate);
      const now = new Date();
      if (end < now && formData.statue !== "منتهي") {
        setFormData((prev) => ({ ...prev, statue: "منتهي" }));
      } else if (end >= now && formData.statue !== "جديد") {
        setFormData((prev) => ({ ...prev, statue: "جديد" }));
      }
    }
    // eslint-disable-next-line
  }, [formData.endDate, formData.statue]);
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
        landlord: initialData.landlord || "",
        tenant_name: initialData.tenant_name || "",
        property_number: initialData.property_number || "",
        statue: initialData.statue || "جديد",
        contractNumber: initialData.contractNumber || "",
        creationDate: initialData.creationDate || today,
        startDate: initialData.startDate || today,
        endDate: initialData.endDate || today,
        yerlyRent: initialData.yerlyRent || "",
        rentDuration: initialData.rentDuration || "",
        monthlyRent: initialData.monthlyRent || "",
        purposeOfLease: initialData.purposeOfLease || "",
        renewal_order: initialData.renewal_order || "",
        initialPayment: initialData.initialPayment || "",
      });
    }
  }, [initialData, showYearlyRent, showInitialPayment]);
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
                        label: p.number,
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
                    value={formData.landlord}
                    name="landlord"
                    change={handleChange}
                    text="الطرف الأول"
                    error={error && error.landlord}
                    disabled={disabledFields.includes("landlord")}
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
                    change={handleChange}
                    text="رقم العقد"
                    error={error && error.contractNumber}
                    disabled={submitUrl.includes("RenewlyContract")}
                  />
                  {error.contractNumber && (
                    <div className="error-message">{error.contractNumber}</div>
                  )}
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
                    error={error && error.endDate}
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
                    error={error && error.startDate}
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
                    error={error && error.purposeOfLease}
                  />
                  {error.purposeOfLease && (
                    <div className="error-message">{error.purposeOfLease}</div>
                  )}
                </div>
                <div className="widthbetween"></div>
                {propertyMode ? (
                  <>
                    <div className="input-container">
                      <Inputwithlabel
                        value={formData.yerlyRent}
                        name="yerlyRent"
                        change={handleChange}
                        text="إيجار السنوي"
                        error={error && error.yerlyRent}
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
                        error={error && error.rentDuration}
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
                        error={error && error.monthlyRent}
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
                            error={error && error.yerlyRent}
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
                      error={error && error.initialPayment}
                    />
                    {error.initialPayment && (
                      <div className="error-message">
                        {error.initialPayment}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
