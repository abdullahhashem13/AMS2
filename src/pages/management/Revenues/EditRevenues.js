import { useState, useEffect } from "react";
// @ts-ignore
import { useParams, useNavigate } from "react-router-dom";
// @ts-ignore
import Swal from "sweetalert2";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import Inputwithlabelcustom from "../../../components/Inputwithlabelcustom";
// @ts-ignore
import InputDatecustom from "../../../components/InputDatecustom";
import SearchableSelect from "../../../components/SearchableSelect";
import ButtonInput from "../../../components/ButtonInput";
import "../../../style/deblicateError.css";

export default function EditRevenues() {
  // الحصول على التاريخ الحالي بتنسيق YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // متغيرات الحالة
  const [formData, setFormData] = useState({
    receiptVoucher_description: "",
    tenant_name: "",
    receiptVoucher_date: today,
    receiptVoucher_amount: "",
    receiptVoucher_writtenAmount: "",
    receiptVoucher_bondNumber: "",
    mosque_id: "",
    property_id: "",
  });
  const [error, setErrors] = useState({});
  const [mosques, setMosques] = useState([]);
  const [properties, setProperties] = useState([]); // إضافة متغير حالة للعقارات
  const [existingBondNumbers, setExistingBondNumbers] = useState([]);
  // @ts-ignore
  const [tenants, setTenants] = useState([]); // إضافة متغير حالة للمستأجرين
  // @ts-ignore
  const [, setFilteredProperties] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // أضف متغير حالة لتخزين رقم السند الأصلي
  const [originalBondNumber, setOriginalBondNumber] = useState("");

  // أولاً، أضف دالة تحويل الأرقام إلى كلمات عربية (نسخة من الدالة الموجودة في AddExpenses.js)
  const convertNumberToArabicWords = (number) => {
    if (number === 0) return "صفر";

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
    const thousands = [
      "",
      "ألف",
      "ألفان",
      "آلاف",
      "آلاف",
      "آلاف",
      "آلاف",
      "آلاف",
      "آلاف",
      "آلاف",
    ];
    const millions = [
      "",
      "مليون",
      "مليونان",
      "ملايين",
      "ملايين",
      "ملايين",
      "ملايين",
      "ملايين",
      "ملايين",
      "ملايين",
    ];
    const billions = [
      "",
      "مليار",
      "ملياران",
      "مليارات",
      "مليارات",
      "مليارات",
      "مليارات",
      "مليارات",
      "مليارات",
      "مليارات",
    ];

    // تحويل الرقم إلى نص
    // @ts-ignore

    // معالجة الأرقام من 1-10
    if (number < 11) {
      return units[number];
    }

    // معالجة الأرقام من 11-19
    if (number < 20) {
      return teens[number - 10];
    }

    // معالجة الأرقام من 20-99
    if (number < 100) {
      const unit = number % 10;
      const ten = Math.floor(number / 10);
      return unit === 0 ? tens[ten] : `${units[unit]} و${tens[ten]}`;
    }

    // معالجة الأرقام من 100-999
    if (number < 1000) {
      const hundred = Math.floor(number / 100);
      const remainder = number % 100;
      return remainder
        ? `${hundreds[hundred]} و${convertNumberToArabicWords(remainder)}`
        : hundreds[hundred];
    }

    // معالجة الأرقام من 1000-999999
    if (number < 1000000) {
      const thousand = Math.floor(number / 1000);
      const remainder = number % 1000;

      let thousandText;
      if (thousand === 1) {
        thousandText = thousands[1];
      } else if (thousand === 2) {
        thousandText = thousands[2];
      } else if (thousand >= 3 && thousand <= 10) {
        thousandText = `${units[thousand]} ${thousands[3]}`;
      } else {
        thousandText = `${convertNumberToArabicWords(thousand)} ${
          thousands[1]
        }`;
      }

      return remainder
        ? `${thousandText} و${convertNumberToArabicWords(remainder)}`
        : thousandText;
    }

    // معالجة الأرقام من 1000000-999999999
    if (number < 1000000000) {
      const million = Math.floor(number / 1000000);
      const remainder = number % 1000000;

      let millionText;
      if (million === 1) {
        millionText = millions[1];
      } else if (million === 2) {
        millionText = millions[2];
      } else if (million >= 3 && million <= 10) {
        millionText = `${units[million]} ${millions[3]}`;
      } else {
        millionText = `${convertNumberToArabicWords(million)} ${millions[1]}`;
      }

      return remainder
        ? `${millionText} و${convertNumberToArabicWords(remainder)}`
        : millionText;
    }

    // معالجة الأرقام من 1000000000 وما فوق
    const billion = Math.floor(number / 1000000000);
    const remainder = number % 1000000000;

    let billionText;
    if (billion === 1) {
      billionText = billions[1];
    } else if (billion === 2) {
      billionText = billions[2];
    } else if (billion >= 3 && billion <= 10) {
      billionText = `${units[billion]} ${billions[3]}`;
    } else {
      billionText = `${convertNumberToArabicWords(billion)} ${billions[1]}`;
    }

    return remainder
      ? `${billionText} و${convertNumberToArabicWords(remainder)}`
      : billionText;
  };

  // جلب المساجد والعقارات
  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب المساجد
        const mosquesResponse = await fetch("http://localhost:3001/Mosques");
        if (mosquesResponse.ok) {
          const mosquesData = await mosquesResponse.json();
          setMosques(mosquesData);
        }

        // جلب العقارات
        const propertiesResponse = await fetch(
          "http://localhost:3001/Properties"
        );
        if (propertiesResponse.ok) {
          const propertiesData = await propertiesResponse.json();
          setProperties(propertiesData);
        }

        // جلب أرقام السندات الموجودة
        const revenuesResponse = await fetch("http://localhost:3001/Revenues");
        if (revenuesResponse.ok) {
          const revenuesData = await revenuesResponse.json();
          const bondNumbers = revenuesData.map(
            (revenue) => revenue.receiptVoucher_bondNumber
          );
          setExistingBondNumbers(bondNumbers);
        }
      } catch (err) {
        console.error("خطأ في جلب البيانات:", err);
      }
    };

    fetchData();
  }, []);

  // جلب بيانات المستأجرين
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch("/JsonData/AllData.json");
        if (!response.ok) {
          throw new Error("فشل في جلب بيانات المستأجرين");
        }
        const data = await response.json();
        // استخراج مصفوفة المستأجرين من البيانات
        const tenantsData = data.Tenants || [];
        setTenants(tenantsData);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }
    };

    fetchTenants();
  }, []);

  // تعديل دالة handleChange لتحديث المسجد تلقائيًا عند اختيار العين
  const handleChange = (e) => {
    const { name, value } = e.target;

    // تحديث قيمة الحقل
    const updatedFormData = { ...formData, [name]: value };

    // إذا كان الحقل هو العين، قم بتحديث المسجد تلقائيًا
    if (name === "property_id") {
      // البحث عن العين المختارة في قائمة العقارات
      const selectedProperty = properties.find((prop) => prop.id === value);
      if (selectedProperty && selectedProperty.mosque_id) {
        // تحديث المسجد المرتبط بالعين
        updatedFormData.mosque_id = selectedProperty.mosque_id;
      }
    }

    // إذا كان الحقل هو المبلغ رقمًا، قم بتحديث المبلغ كتابة تلقائيًا
    if (name === "receiptVoucher_amount") {
      if (value) {
        updatedFormData.receiptVoucher_writtenAmount = `${convertNumberToArabicWords(
          value
        )} ريال فقط لا غير`;
      } else {
        updatedFormData.receiptVoucher_writtenAmount = "";
      }
    }

    // تجاهل التغييرات المباشرة على حقل المبلغ كتابة
    if (name === "receiptVoucher_writtenAmount") {
      return;
    }

    setFormData(updatedFormData);

    // إزالة رسالة الخطأ للحقل الذي يتم تعديله
    const newErrors = { ...error };
    delete newErrors[name];

    // باقي التحققات كما هي...
    setErrors(newErrors);
  };

  // تعديل دالة validateForm للتحقق من تكرار رقم السند فقط إذا تم تغييره
  const validateForm = () => {
    let isValid = true;
    let errors = {};

    // التحقق من رقم السند
    if (!formData.receiptVoucher_bondNumber) {
      errors.receiptVoucher_bondNumber = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.receiptVoucher_bondNumber)) {
      errors.receiptVoucher_bondNumber = "يجب أن يحتوي رقم السند على أرقام فقط";
      isValid = false;
    } else if (
      formData.receiptVoucher_bondNumber !== originalBondNumber &&
      existingBondNumbers.includes(formData.receiptVoucher_bondNumber)
    ) {
      errors.receiptVoucher_bondNumber = "رقم السند موجود بالفعل";
      isValid = false;
    }

    // التحقق من المبلغ
    if (!formData.receiptVoucher_amount) {
      errors.receiptVoucher_amount = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.receiptVoucher_amount)) {
      errors.receiptVoucher_amount = "يجب أن يحتوي المبلغ على أرقام فقط";
      isValid = false;
    }

    // التحقق من الوصف
    if (!formData.receiptVoucher_description) {
      errors.receiptVoucher_description = "يجب تعبئة الحقل";
      isValid = false;
    }

    // التحقق من المبلغ كتابة
    if (!formData.receiptVoucher_writtenAmount) {
      errors.receiptVoucher_writtenAmount = "يجب تعبئة الحقل";
      isValid = false;
    }

    // التحقق من اختيار المسجد
    if (!formData.mosque_id) {
      errors.mosque_id = "يجب اختيار المسجد";
      isValid = false;
    }

    // التحقق من اختيار العين
    if (!formData.property_id) {
      errors.property_id = "يجب اختيار العين";
      isValid = false;
    }

    // التحقق من اختيار المستأجر
    if (!formData.tenant_name) {
      errors.tenant_name = "يجب اختيار المستأجر";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  // إضافة دالة للحفظ فقط
  const handleSaveOnly = async (e) => {
    e.preventDefault();

    // التحقق من صحة النموذج قبل الإرسال
    if (!validateForm()) {
      return;
    }

    try {
      // استخدام PUT بدلاً من POST وإضافة معرف السند في عنوان URL
      const response = await fetch(`http://localhost:3001/Revenues/${id}`, {
        method: "PUT", // تغيير الطريقة إلى PUT للتعديل
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // إظهار رسالة نجاح
        Swal.fire({
          icon: "success",
          title: "تم التحديث",
          text: "تم تحديث بيانات السند بنجاح",
        });

        // الانتقال إلى صفحة البحث والعرض
        navigate("/management/Revenues/DisplaySearchRevenues");
      } else {
        const data = await response.json();
        if (data && data.message) {
          if (typeof data.message === "object") {
            setErrors({ ...error, ...data.message });
          } else if (typeof data.message === "string") {
            setErrors({ ...error, general: data.message });
          } else {
            setErrors({ ...error, general: "فشل في التحديث." });
          }
        } else {
          setErrors({ ...error, general: "فشل في التحديث." });
        }
      }
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ ما." });
      console.error(err);
    }
  };

  // تعديل دالة الحفظ والطباعة
  const handleSaveAndPrint = async (e) => {
    e.preventDefault();

    // التحقق من صحة النموذج قبل الإرسال
    if (!validateForm()) {
      return;
    }

    try {
      // استخدام PUT بدلاً من POST وإضافة معرف السند في عنوان URL
      const response = await fetch(`http://localhost:3001/Revenues/${id}`, {
        method: "PUT", // تغيير الطريقة إلى PUT للتعديل
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // إنشاء محتوى الطباعة
        const printContent = `
          <!DOCTYPE html>
          <html dir="rtl">
            <head>
              <meta charset="UTF-8">
              <title>سند قبض</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
                
                body {
                  font-family: 'Amiri', Arial, sans-serif;
                  direction: rtl;
                  margin: 0;
                  padding: 0;
                  background-color: white;
                  font-size: 11px;
                  color: black;
                }
                
                .voucher-container {
                  width: 170mm;
                  height: 120mm;
                  margin: 0 auto;
                  padding: 10px;
                  background-color: white;
                  border: 1px solid #333;
                  box-sizing: border-box;
                }
                
                .header {
                  text-align: center;
                  margin-bottom: 6px;
                  border-bottom: 1.5px solid #333;
                  padding-bottom: 6px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                }
                
                .logo {
                  width: 60px;
                  height: auto;
                  margin-bottom: 5px;
                }
                
                .header h1 {
                  margin: 0;
                  font-size: 14px;
                  font-weight: bold;
                }
                
                .voucher-title {
                  text-align: center;
                  font-size: 16px;
                  font-weight: bold;
                  margin: 10px 0;
                  text-decoration: underline;
                }
                
                .field-row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 8px;
                }
                
                .field {
                  display: flex;
                  align-items: center;
                }
                
                .label {
                  font-weight: bold;
                  margin-left: 5px;
                  font-size: 11px;
                  color: black;
                }
                
                .value {
                  border-bottom: 1px dotted #333;
                  min-width: 100px;
                  padding: 2px 5px;
                  font-size: 11px;
                  color: black;
                }
                
                .full-width-field {
                  display: flex;
                  align-items: center;
                  width: 100%;
                }
                
                .full-width-value {
                  flex: 1;
                  border-bottom: 1px solid #777;
                  padding: 2px 5px;
                  font-size: 11px;
                  color: black;
                }
                
                .signatures {
                  display: flex;
                  margin-top: 15px;
                  justify-content: space-between;
                }
                
                .signature {
                  flex: 1;
                  text-align: center;
                  padding: 5px;
                }
                
                .signature-line {
                  border-top: 1px solid #333;
                  margin-top: 15px;
                  padding-top: 3px;
                }
                
                .footer {
                  margin-top: 15px;
                  display: flex;
                  justify-content: space-between;
                  font-size: 9px;
                  color: black;
                  border-top: 1px solid #ddd;
                  padding-top: 5px;
                }
                
                .employee-info {
                  text-align: left;
                  font-size: 9px;
                  color: black;
                }
                
                @media print {
                  body {
                    margin: 0;
                    padding: 0;
                    color: black !important;
                  }
                  
                  .voucher-container {
                    border: none;
                    width: 100%;
                    height: auto;
                    padding: 0;
                  }
                  
                  @page {
                    size: A5 landscape;
                    margin: 6mm;
                  }
                }
              </style>
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                };
              </script>
            </head>
            <body>
              <div class="voucher-container">
                <div class="header">
                  <img src="/logo.jpg" alt="شعار الأوقاف" class="logo">
                  <h1>مكتب وزارة الأوقاف والإرشاد بساحل حضرموت</h1>
                </div>
                
                <div class="voucher-title">سند قبض</div>
                
                <div class="field-row">
                  <div class="field">
                    <span class="label">رقم السند:</span>
                    <span class="value">${
                      formData.receiptVoucher_bondNumber
                    }</span>
                  </div>
                  <div class="field">
                    <span class="label">التاريخ:</span>
                    <span class="value">${formData.receiptVoucher_date}</span>
                  </div>
                </div>
                
                <div class="field-row">
                  <div class="field">
                    <span class="label">استلمنا من السيد/ة:</span>
                    <span class="value">${
                      tenants.find(
                        (tenant) => tenant.id === formData.tenant_name
                      )?.name || formData.tenant_name
                    }</span>
                  </div>
                </div>
                
                <div class="field-row">
                  <div class="field">
                    <span class="label">العين:</span>
                    <span class="value">${
                      properties.find(
                        (property) => property.id === formData.property_id
                      )?.property_number || ""
                    }</span>
                  </div>
                </div>
                
                <div class="field-row">
                  <div class="field">
                    <span class="label">مبلغ وقدره:</span>
                    <span class="value">${
                      formData.receiptVoucher_amount
                    } ريال</span>
                  </div>
                </div>
                
                <div class="field-row">
                  <div class="field">
                    <span class="label">فقط:</span>
                    <span class="value">${
                      formData.receiptVoucher_writtenAmount
                    }</span>
                  </div>
                </div>
                
                <div class="field-row">
                  <div class="full-width-field">
                    <span class="label">وذلك مقابل:</span>
                    <span class="full-width-value">${
                      formData.receiptVoucher_description
                    }</span>
                  </div>
                </div>
                
                <div class="signatures">
                  <div class="signature">
                    <div class="label">توقيع الموظف المستلم</div>
                    <div class="signature-line"></div>
                  </div>
                </div>
                
                <div class="footer">
                  <div></div>
                  <div class="employee-info">الموظف: عبدالله الحامد</div>
                </div>
              </div>
            </body>
          </html>
        `;

        // فتح نافذة الطباعة مباشرة بعد الحفظ
        const printWindow = window.open("", "_blank");

        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(printContent);
          printWindow.document.close();
        } else {
          console.error("لم يتم فتح نافذة الطباعة");
        }

        // بعد الطباعة، الانتقال إلى صفحة البحث والعرض
        navigate("/management/Revenues/DisplaySearchRevenues");
      } else {
        const data = await response.json();
        if (data && data.message) {
          if (typeof data.message === "object") {
            setErrors({ ...error, ...data.message });
          } else if (typeof data.message === "string") {
            setErrors({ ...error, general: data.message });
          } else {
            setErrors({ ...error, general: "فشل في الحفظ." });
          }
        } else {
          setErrors({ ...error, general: "فشل في الحفظ." });
        }
      }
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ ما." });
      console.error(err);
    }
  };

  // إضافة متغير لتخزين الأعيان المفلترة حسب المسجد المحدد
  const propertiesFilteredByMosque = formData.mosque_id
    ? properties.filter((property) => property.mosque_id === formData.mosque_id)
    : properties;

  // إضافة useEffect لجلب بيانات السند عند تحميل الصفحة
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // جلب بيانات السند
        const response = await fetch(`http://localhost:3001/Revenues/${id}`);
        if (!response.ok) {
          throw new Error("فشل في جلب بيانات السند");
        }

        const revenueData = await response.json();

        // حفظ رقم السند الأصلي
        setOriginalBondNumber(revenueData.receiptVoucher_bondNumber || "");

        // تحديث نموذج البيانات بالقيم المجلوبة
        setFormData({
          receiptVoucher_description:
            revenueData.receiptVoucher_description || "",
          tenant_name: revenueData.tenant_name || "",
          receiptVoucher_date: revenueData.receiptVoucher_date || today,
          receiptVoucher_amount: revenueData.receiptVoucher_amount || "",
          receiptVoucher_writtenAmount:
            revenueData.receiptVoucher_writtenAmount || "",
          receiptVoucher_bondNumber:
            revenueData.receiptVoucher_bondNumber || "",
          mosque_id: revenueData.mosque_id || "",
          property_id: revenueData.property_id || "",
        });

        // إذا كان هناك معرف للمسجد، قم بجلب العقارات المرتبطة به
        if (revenueData.mosque_id) {
          const propertiesForMosque = properties.filter(
            (prop) => prop.mosque_id === revenueData.mosque_id
          );
          setFilteredProperties(propertiesForMosque);
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ أثناء جلب بيانات السند",
        });
      }
    };

    // جلب البيانات فقط إذا كان هناك معرف
    if (id) {
      fetchRevenueData();
    }
  }, [id, properties, today]);

  // تعديل دالة handleSubmit لتستخدم PUT بدلاً من POST

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
            id="printableForm" // إضافة id للنموذج للطباعة
            className="divforconten logo"
            onSubmit={(e) => e.preventDefault()}
          >
            <Managementdata dataname="تعديل بيانات سند قبض" />
            <div className="RowForInsertinputs">
              <div className="input-container">
                <Inputwithlabelcustom
                  widthinput="20%"
                  widthlabel="7%"
                  value={formData.receiptVoucher_bondNumber}
                  name="receiptVoucher_bondNumber"
                  change={handleChange}
                  text="رقم السند"
                />
                {
                  // @ts-ignore
                  error.receiptVoucher_bondNumber && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.receiptVoucher_bondNumber
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div className="RowForInsertinputs">
              <div className="input-container">
                <InputDatecustom
                  widthinput="20%"
                  widthlabel="7%"
                  value={formData.receiptVoucher_date}
                  name="receiptVoucher_date"
                  change={handleChange}
                  text="تاريخ"
                  disabled={true}
                />
              </div>
            </div>
            <div style={{ marginBottom: "8px" }}></div>
            <div
              className="RowForInsertinputs"
              style={{ justifyContent: "space-between" }}
            >
              <div style={{ width: "28%" }}>
                <div className="input-container">
                  <SearchableSelect
                    name="mosque_id"
                    text="المسجد"
                    options={mosques.map((mosque) => ({
                      value: mosque.id,
                      label: mosque.mosque_name,
                    }))}
                    value={formData.mosque_id}
                    change={handleChange}
                  />
                  {
                    // @ts-ignore
                    error.mosque_id && (
                      <div
                        className="error-message"
                        style={{ direction: "rtl" }}
                      >
                        {
                          // @ts-ignore
                          error.mosque_id
                        }
                      </div>
                    )
                  }
                </div>
              </div>
              <div style={{ width: "32%" }}>
                <div className="input-container">
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
                  {
                    // @ts-ignore
                    error.tenant_name && (
                      <div
                        className="error-message"
                        style={{ direction: "rtl" }}
                      >
                        {
                          // @ts-ignore
                          error.tenant_name
                        }
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
            <div style={{ marginBottom: "8px" }}></div>
            <div
              className="RowForInsertinputs"
              style={{ justifyContent: "space-between" }}
            >
              <div style={{ width: "28%" }}>
                <div className="input-container">
                  <SearchableSelect
                    name="property_id"
                    text="العين"
                    options={propertiesFilteredByMosque.map((property) => ({
                      value: property.id,
                      label: property.property_number,
                    }))}
                    value={formData.property_id}
                    change={handleChange}
                  />
                  {
                    // @ts-ignore
                    error.property_id && (
                      <div
                        className="error-message"
                        style={{ direction: "rtl" }}
                      >
                        {
                          // @ts-ignore
                          error.property_id
                        }
                      </div>
                    )
                  }
                </div>
              </div>
              <div style={{ width: "25%" }}>
                <Inputwithlabelcustom
                  widthinput="100%"
                  widthlabel="48%"
                  value={formData.receiptVoucher_amount}
                  name="receiptVoucher_amount"
                  change={handleChange}
                  text="المبلغ رقمًا"
                />
                {
                  // @ts-ignore
                  error.receiptVoucher_amount && (
                    <div className="error-message" style={{ direction: "rtl" }}>
                      {
                        // @ts-ignore
                        error.receiptVoucher_amount
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div style={{ marginBottom: "8px" }}></div>
            <div
              className="RowForInsertinputs"
              style={{ justifyContent: "space-between" }}
            >
              <div style={{ width: "25%" }}></div>
              <div style={{ width: "75%" }}>
                <Inputwithlabelcustom
                  widthinput="100%"
                  widthlabel="12%"
                  value={formData.receiptVoucher_description}
                  name="receiptVoucher_description"
                  change={handleChange}
                  text="ذلك بمقابل"
                />
                {
                  // @ts-ignore
                  error.receiptVoucher_description && (
                    <div className="error-message" style={{ direction: "rtl" }}>
                      {
                        // @ts-ignore
                        error.receiptVoucher_description
                      }
                    </div>
                  )
                }
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
                  value={formData.receiptVoucher_writtenAmount}
                  name="receiptVoucher_writtenAmount"
                  change={handleChange}
                  text="المبلغ كتابة"
                  disabled={true} // جعل حقل المبلغ كتابة غير قابل للتعديل
                />
                {
                  // @ts-ignore
                  error.receiptVoucher_writtenAmount && (
                    <div className="error-message" style={{ direction: "rtl" }}>
                      {
                        // @ts-ignore
                        error.receiptVoucher_writtenAmount
                      }
                    </div>
                  )
                }
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
              <ButtonInput text="طباعة" onClick={handleSaveAndPrint} />
              <ButtonInput text=" حفظ التعديلات " onClick={handleSaveOnly} />
            </div>
            {
              // @ts-ignore
              error.general && (
                <div
                  className="error-message general-error"
                  style={{ direction: "rtl" }}
                >
                  {
                    // @ts-ignore
                    error.general
                  }
                </div>
              )
            }
          </form>
        </div>
      </div>
    </div>
  );
}
