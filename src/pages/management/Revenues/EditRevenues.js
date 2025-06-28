import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Inputwithlabelcustom from "../../../components/Inputwithlabelcustom";
import InputDatecustom from "../../../components/InputDatecustom";
import SearchableSelect from "../../../components/SearchableSelect";
import ButtonInput from "../../../components/ButtonInput";
import "../../../style/deblicateError.css";

// حقل الإيجار الشهري
const getMonthlyRent = (propertyId, properties) => {
  const property = properties.find((p) => p.id === propertyId);
  return property ? property.monthlyRent || "" : "";
};
/**
 * @typedef {Object} ErrorState
 * @property {string=} bondNumber
 * @property {string=} date
 * @property {string=} property_id
 * @property {string=} monthlyRent
 * @property {string=} tenant_name
 * @property {string=} amount
 * @property {string=} writtenAmount
 * @property {string=} collectorName
 * @property {string=} description
 * @property {string=} general
 */

export default function EditRevenues() {
  // الحصول على التاريخ الحالي بتنسيق YYYY-MM-DD

  const today = new Date().toISOString().split("T")[0];
  const { id } = useParams();
  const navigate = useNavigate();

  // الحالة الموحدة مثل صفحة الإضافة
  const [formData, setFormData] = useState({
    bondNumber: "",
    date: today,
    property_id: "",
    monthlyRent: "",
    tenant_name: "",
    amount: "",
    writtenAmount: "",
    collectorName: "",
    description: "",
  });
  /** @type {[ErrorState, Function]} */
  const [error, setErrors] = useState({});
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [existingBondNumbers, setExistingBondNumbers] = useState([]);
  const [originalBondNumber, setOriginalBondNumber] = useState("");

  // دالة تحويل الأرقام إلى كلمات عربية (مطابقة للإضافة)
  const convertNumberToArabicWords = (number) => {
    if (number === 0 || number === "0") return "صفر";
    const units = [
      "",
      "واحد",
      "اثنان",
      "ثلاثة",
      "أربعة",
      "خمسة",
      "ستة",
      "سبعة",
      "ثمانية",
      "تسعة",
      "عشرة",
    ];
    const teens = [
      "",
      "أحد عشر",
      "اثنا عشر",
      "ثلاثة عشر",
      "أربعة عشر",
      "خمسة عشر",
      "ستة عشر",
      "سبعة عشر",
      "ثمانية عشر",
      "تسعة عشر",
    ];
    const tens = [
      "",
      "عشرة",
      "عشرون",
      "ثلاثون",
      "أربعون",
      "خمسون",
      "ستون",
      "سبعون",
      "ثمانون",
      "تسعون",
    ];
    const hundreds = [
      "",
      "مائة",
      "مائتان",
      "ثلاثمائة",
      "أربعمائة",
      "خمسمائة",
      "ستمائة",
      "سبعمائة",
      "ثمانمائة",
      "تسعمائة",
    ];
    if (number < 11) return units[number];
    if (number < 20) return teens[number - 10];
    if (number < 100) {
      const unit = number % 10;
      const ten = Math.floor(number / 10);
      return unit === 0 ? tens[ten] : `${units[unit]} و${tens[ten]}`;
    }
    if (number < 1000) {
      const hundred = Math.floor(number / 100);
      const remainder = number % 100;
      return remainder
        ? `${hundreds[hundred]} و${convertNumberToArabicWords(remainder)}`
        : hundreds[hundred];
    }
    if (number < 1000000) {
      const thousand = Math.floor(number / 1000);
      const remainder = number % 1000;
      let thousandText =
        thousand === 1
          ? "ألف"
          : thousand === 2
          ? "ألفان"
          : thousand >= 3 && thousand <= 10
          ? `${units[thousand]} آلاف`
          : `${convertNumberToArabicWords(thousand)} ألف`;
      return remainder
        ? `${thousandText} و${convertNumberToArabicWords(remainder)}`
        : thousandText;
    }
    return "عدد كبير";
  };

  // جلب العقارات
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("http://localhost:3001/Properties");
        if (res.ok) {
          const data = await res.json();
          setProperties(data);
        }
      } catch (err) {
        console.error("خطأ في جلب العقارات:", err);
      }
    };
    fetchProperties();
  }, []);

  // جلب المستأجرين
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch("/JsonData/AllData.json");
        if (!response.ok) throw new Error();
        const data = await response.json();
        setTenants(data.Tenants || []);
      } catch (err) {
        setTenants([]);
      }
    };
    fetchTenants();
  }, []);

  // جلب أرقام السندات
  useEffect(() => {
    const fetchBondNumbers = async () => {
      try {
        const res = await fetch("http://localhost:3001/Revenues");
        if (res.ok) {
          const data = await res.json();
          setExistingBondNumbers(data.map((r) => r.bondNumber));
        }
      } catch {}
    };
    fetchBondNumbers();
  }, []);

  // handleChange موحد مع صفحة الإضافة
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    // تحديث الإيجار الشهري تلقائياً عند اختيار العين
    if (name === "property_id") {
      updatedFormData.monthlyRent = getMonthlyRent(value, properties);
    }

    // تحديث المبلغ كتابة تلقائياً
    if (name === "amount") {
      updatedFormData.writtenAmount = value
        ? `${convertNumberToArabicWords(Number(value))} ريال فقط لا غير`
        : "";
    }

    setFormData(updatedFormData);
    const newErrors = { ...error };
    delete newErrors[name];
    setErrors(newErrors);
  };

  // validateForm موحد مع صفحة الإضافة
  const validateForm = () => {
    let isValid = true;
    let errors = {};
    // رقم السند
    if (!formData.bondNumber) {
      errors.bondNumber = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.bondNumber)) {
      errors.bondNumber = "يجب أن يحتوي رقم السند على أرقام فقط";
      isValid = false;
    } else if (
      formData.bondNumber !== originalBondNumber &&
      existingBondNumbers.includes(formData.bondNumber)
    ) {
      errors.bondNumber = "رقم السند موجود بالفعل";
      isValid = false;
    }
    // التاريخ
    if (!formData.date) {
      errors.date = "يجب اختيار التاريخ";
      isValid = false;
    }
    // العين
    if (!formData.property_id) {
      errors.property_id = "يجب اختيار العين";
      isValid = false;
    }
    // الإيجار الشهري
    if (!formData.monthlyRent) {
      errors.monthlyRent = "يجب اختيار العين ليظهر الإيجار";
      isValid = false;
    }
    // المستأجر
    if (!formData.tenant_name) {
      errors.tenant_name = "يجب اختيار المستأجر";
      isValid = false;
    }
    // المبلغ رقمًا
    if (!formData.amount) {
      errors.amount = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.amount)) {
      errors.amount = "يجب أن يحتوي المبلغ على أرقام فقط";
      isValid = false;
    }
    // المبلغ كتابة
    if (!formData.writtenAmount) {
      errors.writtenAmount = "يجب تعبئة الحقل";
      isValid = false;
    }
    // اسم المحصل
    if (!formData.collectorName) {
      errors.collectorName = "يجب تعبئة اسم المحصل";
      isValid = false;
    } else if (
      !/^[\u0600-\u06FF\s]{6,}$/.test(formData.collectorName.trim()) ||
      formData.collectorName.trim().split(" ").length < 2
    ) {
      errors.collectorName = "يجب أن يكون الاسم عربيًا وثنائيًا على الأقل";
      isValid = false;
    }
    // الوصف
    if (!formData.description) {
      errors.description = "يجب تعبئة الحقل";
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };

  // حفظ فقط
  const handleSaveOnly = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await fetch(`http://localhost:3001/Revenues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // إعادة تعيين النموذج بعد الحفظ
        setFormData({
          bondNumber: "",
          date: today,
          property_id: "",
          monthlyRent: "",
          tenant_name: "",
          amount: "",
          writtenAmount: "",
          collectorName: "",
          description: "",
        });
        navigate("/management/Revenues/DisplaySearchRevenues");
      } else {
        const data = await response.json();
        if (data && data.message) {
          if (typeof data.message === "object")
            setErrors({ ...error, ...data.message });
          else if (typeof data.message === "string")
            setErrors({ ...error, general: data.message });
          else setErrors({ ...error, general: "فشل في التحديث." });
        } else setErrors({ ...error, general: "فشل في التحديث." });
      }
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ ما." });
    }
  };

  // حفظ وطباعة
  const handleSaveAndPrint = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await fetch(`http://localhost:3001/Revenues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // نافذة الطباعة
        const printContent = `
          <html dir="rtl"><head><meta charset='UTF-8'><title>سند قبض</title></head><body>
          <div style='font-family:Amiri,Arial,sans-serif;width:90%;margin:auto;'>
            <h2 style='text-align:center;'>سند قبض</h2>
            <div>رقم السند: ${formData.bondNumber}</div>
            <div>التاريخ: ${formData.date}</div>
            <div>العين: ${
              properties.find((p) => p.id === formData.property_id)
                ?.property_number || ""
            }</div>
            <div>الإيجار الشهري: ${formData.monthlyRent}</div>
            <div>المستأجر: ${
              tenants.find((t) => t.id === formData.tenant_name)?.name ||
              formData.tenant_name
            }</div>
            <div>المبلغ رقمًا: ${formData.amount} ريال</div>
            <div>المبلغ كتابة: ${formData.writtenAmount}</div>
            <div>المحصل: ${formData.collectorName}</div>
            <div>وذلك مقابل: ${formData.description}</div>
          </div>
          <script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};}</script>
          </body></html>
        `;
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(printContent);
          printWindow.document.close();
        }
        navigate("/management/Revenues/DisplaySearchRevenues");
      } else {
        const data = await response.json();
        if (data && data.message) {
          if (typeof data.message === "object")
            setErrors({ ...error, ...data.message });
          else if (typeof data.message === "string")
            setErrors({ ...error, general: data.message });
          else setErrors({ ...error, general: "فشل في الحفظ." });
        } else setErrors({ ...error, general: "فشل في الحفظ." });
      }
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ ما." });
    }
  };

  // جلب بيانات السند عند تحميل الصفحة
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/Revenues/${id}`);
        if (!response.ok) throw new Error();
        const revenueData = await response.json();
        setOriginalBondNumber(revenueData.bondNumber || "");
        // جلب الإيجار الشهري الصحيح من العقارات بعد تحميلها
        let monthlyRentValue = "";
        if (revenueData.property_id && properties.length > 0) {
          const property = properties.find(
            (p) => p.id === revenueData.property_id
          );
          monthlyRentValue = property
            ? property.monthlyRent ||
              property.rent ||
              property.rent_amount ||
              ""
            : "";
        }
        setFormData({
          bondNumber: revenueData.bondNumber || "",
          date: revenueData.date || today,
          property_id: revenueData.property_id || "",
          monthlyRent: monthlyRentValue,
          tenant_name: revenueData.tenant_name || "",
          amount: revenueData.amount || "",
          writtenAmount: revenueData.writtenAmount || "",
          collectorName: revenueData.collectorName || "",
          description: revenueData.description || "",
        });
      } catch {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ أثناء جلب بيانات السند",
        });
      }
    };
    if (id && properties.length > 0) fetchRevenueData();
  }, [id, properties, today]);

  // تعديل دالة handleSubmit لتستخدم PUT بدلاً من POST

  // واجهة مطابقة تماماً للإضافة
  // عرض جميع الأعيان بدون فلترة
  const propertiesFilteredByMosque = properties;

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة الإيرادات" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div></div>
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Revenues/ReportRevenues"
              />
              <Mainbutton
                text="بحث"
                path="/management/Revenues/DisplaySearchRevenues"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Revenues/AddRevenues"
              />
            </div>
          </div>
          <form
            id="printableForm"
            className="divforconten logo"
            onSubmit={(e) => e.preventDefault()}
          >
            <Managementdata dataname="تعديل بيانات سند قبض" />
            <div
              className="RowForInsertinputs"
              style={{
                display: "flex",
                gap: "18px",
                alignItems: "flex-start",
                marginBottom: 15,
              }}
            >
              <div className="input-container" style={{ flex: 1, minWidth: 0 }}>
                <Inputwithlabelcustom
                  widthinput="20%"
                  widthlabel="10%"
                  value={formData.bondNumber}
                  name="bondNumber"
                  change={handleChange}
                  text="رقم السند"
                />
                {typeof error === "object" &&
                  error &&
                  "bondNumber" in error &&
                  error.bondNumber && (
                    <div className="error-message">{error.bondNumber}</div>
                  )}
              </div>
            </div>
            <div
              className="RowForInsertinputs"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0",
                marginBottom: 15,
              }}
            >
              <div
                className="input-container"
                style={{ width: "27%", minWidth: 0, textAlign: "right" }}
              >
                <InputDatecustom
                  widthinput="100%"
                  widthlabel="32%"
                  value={formData.date}
                  name="date"
                  change={handleChange}
                  text="تاريخ"
                  disabled={true}
                />
              </div>
              <div
                className="input-container"
                style={{ width: "25%", minWidth: 0, textAlign: "left" }}
              >
                <Inputwithlabelcustom
                  widthinput="65%"
                  widthlabel="40%"
                  value={formData.monthlyRent}
                  name="monthlyRent"
                  change={() => {}}
                  text="الإيجار الشهري"
                  disabled={true}
                />
              </div>
            </div>
            <div style={{ marginBottom: "8px" }}></div>
            <div
              className="RowForInsertinputs"
              style={{
                justifyContent: "flex-start",
                gap: "18px",
                marginBottom: 15,
              }}
            >
              <div className="input-container" style={{ flex: 1, minWidth: 0 }}>
                <Inputwithlabelcustom
                  widthinput="32%"
                  widthlabel="15%"
                  value={formData.collectorName}
                  name="collectorName"
                  change={handleChange}
                  text="اسم المحصل"
                />
                {typeof error === "object" &&
                  error &&
                  "collectorName" in error &&
                  error.collectorName && (
                    <div className="error-message">{error.collectorName}</div>
                  )}
              </div>
              <div
                style={{
                  width: "35%",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <SearchableSelect
                    name="tenant_name"
                    text="المستأجر"
                    options={tenants.map((tenant) => ({
                      value: tenant.id,
                      label: tenant.name,
                    }))}
                    value={formData.tenant_name}
                    change={handleChange}
                  />
                  {typeof error === "object" &&
                    error &&
                    "tenant_name" in error &&
                    error.tenant_name && (
                      <div
                        className="error-message"
                        style={{ direction: "rtl" }}
                      >
                        {error.tenant_name}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: "8px" }}></div>
            <div
              className="RowForInsertinputs"
              style={{ justifyContent: "space-between", marginBottom: 15 }}
            >
              <div style={{ width: "28%" }}>
                <div className="input-container">
                  <SearchableSelect
                    name="property_id"
                    text="العين"
                    options={propertiesFilteredByMosque.map((property) => ({
                      value: property.id,
                      label: property.property_number || property.number,
                    }))}
                    value={formData.property_id}
                    change={handleChange}
                  />
                  {error.property_id && (
                    <div className="error-message" style={{ direction: "rtl" }}>
                      {error.property_id}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ width: "25%" }}>
                <Inputwithlabelcustom
                  widthinput="100%"
                  widthlabel="48%"
                  value={formData.amount}
                  name="amount"
                  change={handleChange}
                  text="المبلغ رقمًا"
                />
                {error.amount && (
                  <div className="error-message" style={{ direction: "rtl" }}>
                    {error.amount}
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginBottom: "8px" }}></div>
            <div
              className="RowForInsertinputs"
              style={{ justifyContent: "space-between", marginBottom: 15 }}
            >
              <div style={{ width: "25%" }}></div>
              <div style={{ width: "75%" }}>
                <Inputwithlabelcustom
                  widthinput="100%"
                  widthlabel="12%"
                  value={formData.description}
                  name="description"
                  change={handleChange}
                  text="ذلك بمقابل"
                />
                {error.description && (
                  <div className="error-message" style={{ direction: "rtl" }}>
                    {error.description}
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginBottom: "8px" }}></div>
            <div
              className="RowForInsertinputs"
              style={{ justifyContent: "space-between" }}
            >
              <div style={{ width: "40%" }}></div>
              <div style={{ width: "60%" }}>
                <Inputwithlabelcustom
                  widthinput="100%"
                  widthlabel="15%"
                  value={formData.writtenAmount}
                  name="writtenAmount"
                  change={handleChange}
                  text="المبلغ كتابة"
                  disabled={true}
                />
                {error.writtenAmount && (
                  <div className="error-message" style={{ direction: "rtl" }}>
                    {error.writtenAmount}
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginBottom: "8px" }}></div>
            <div className="RowForInsertinputs">
              <h5
                style={{
                  width: "100%",
                  textAlign: "start",
                  fontFamily: "amiri",
                }}
              >
                الموظف: عبدالله الحامد
              </h5>
            </div>
            <div
              className="RowForInsertinputs"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <ButtonInput text="حفظ وطباعة" onClick={handleSaveAndPrint} />
              <ButtonInput text=" حفظ التعديل" onClick={handleSaveOnly} />
            </div>
            {error.general && (
              <div
                className="error-message general-error"
                style={{ direction: "rtl" }}
              >
                {error.general}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
