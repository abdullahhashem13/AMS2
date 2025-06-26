import { useState, useEffect } from "react";
// @ts-ignore
import { useParams, useNavigate } from "react-router-dom";
// @ts-ignore
import Swal from "sweetalert2";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Inputwithlabelcustom from "../../../components/Inputwithlabelcustom";
import InputDatecustom from "../../../components/InputDatecustom";
import SearchableSelect from "../../../components/SearchableSelect";
import ButtonInput from "../../../components/ButtonInput";

export default function EditExpense() {
  const { id } = useParams(); // استخراج معرف السند من الرابط
  const navigate = useNavigate();
  const [mosques, setMosques] = useState([]);
  const [existingBondNumbers, setExistingBondNumbers] = useState([]);
  const [error, setErrors] = useState({});
  // حفظ رقم السند الأصلي عند تحميل البيانات
  const [originalBondNumber, setOriginalBondNumber] = useState("");

  // تهيئة حالة formData
  const [formData, setFormData] = useState({
    paymentVoucher_description: "",
    paymentVoucher_recipient: "",
    paymentVoucher_date: "",
    paymentVoucher_amount: "",
    paymentVoucher_writtenAmount: "",
    paymentVoucher_bondNumber: "",
    mosque_id: "",
  });

  // جلب بيانات السند المحدد والمساجد عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data for expense ID:", id);

        // جلب بيانات السند المحدد
        const expenseResponse = await fetch(
          `http://localhost:3001/Expenses/${id}`
        );
        if (expenseResponse.ok) {
          const expenseData = await expenseResponse.json();
          console.log("Expense data loaded:", expenseData);

          // تطبيق وظيفة التحويل على المبلغ كتابة
          if (expenseData.paymentVoucher_amount) {
            expenseData.paymentVoucher_writtenAmount = `${convertNumberToArabicWords(
              expenseData.paymentVoucher_amount
            )} ريال فقط لا غير`;
          }

          // جلب اسم المسجد مباشرة إذا كان هناك معرف مسجد
          if (expenseData.mosque_id) {
            const mosqueResponse = await fetch(
              `http://localhost:3001/Mosques/${expenseData.mosque_id}`
            );
            if (mosqueResponse.ok) {
              const mosqueData = await mosqueResponse.json();
              // إضافة اسم المسجد إلى بيانات السند
              expenseData.mosque_name = mosqueData.mosque_name;
            }
          }

          setFormData(expenseData);
          setOriginalBondNumber(expenseData.paymentVoucher_bondNumber);
        } else {
          console.error("Failed to fetch expense:", expenseResponse.status);
          Swal.fire("خطأ", "لم يتم العثور على بيانات السند", "error");
        }

        // جلب المساجد
        const mosquesResponse = await fetch("http://localhost:3001/Mosques");
        if (mosquesResponse.ok) {
          const mosquesData = await mosquesResponse.json();
          setMosques(mosquesData);
        }

        // جلب أرقام السندات الموجودة (باستثناء السند الحالي)
        const expensesResponse = await fetch("http://localhost:3001/Expenses");
        if (expensesResponse.ok) {
          const expensesData = await expensesResponse.json();
          const bondNumbers = expensesData
            .filter((expense) => expense.id !== parseInt(id))
            .map((expense) => expense.paymentVoucher_bondNumber);
          setExistingBondNumbers(bondNumbers);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        Swal.fire("خطأ", "حدث خطأ أثناء جلب البيانات", "error");
      }
    };

    if (id) {
      fetchData();
    }
  }); // فقط id كتابع

  // إضافة وظيفة تحويل الأرقام إلى كلمات باللغة العربية (نسخها من صفحة الإضافة)
  const convertNumberToArabicWords = (number) => {
    if (!number) return "";

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
      "",
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
      "ثلاثة آلاف",
      "أربعة آلاف",
      "خمسة آلاف",
      "ستة آلاف",
      "سبعة آلاف",
      "ثمانية آلاف",
      "تسعة آلاف",
    ];
    const millions = [
      "",
      "مليون",
      "مليونان",
      "ثلاثة ملايين",
      "أربعة ملايين",
      "خمسة ملايين",
      "ستة ملايين",
      "سبعة ملايين",
      "ثمانية ملايين",
      "تسعة ملايين",
    ];
    const billions = [
      "",
      "مليار",
      "ملياران",
      "ثلاثة مليارات",
      "أربعة مليارات",
      "خمسة مليارات",
      "ستة مليارات",
      "سبعة مليارات",
      "ثمانية مليارات",
      "تسعة مليارات",
    ];

    const num = parseInt(number);
    if (num === 0) return "صفر";

    // الأرقام من 1 إلى 19
    if (num < 20) return units[num];

    // الأرقام من 20 إلى 99
    if (num < 100) {
      const unit = num % 10;
      const ten = Math.floor(num / 10);
      return unit ? `${units[unit]} و${tens[ten]}` : tens[ten];
    }

    // الأرقام من 100 إلى 999
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      return remainder
        ? `${hundreds[hundred]} و${convertNumberToArabicWords(remainder)}`
        : hundreds[hundred];
    }

    // الأرقام من 1000 إلى 999,999
    if (num < 1000000) {
      const thousand = Math.floor(num / 1000);
      const remainder = num % 1000;

      let thousandText;
      if (thousand >= 1 && thousand <= 10) {
        // استخدام مصفوفة thousands
        thousandText = thousands[thousand];
      } else {
        thousandText = `${convertNumberToArabicWords(thousand)} ألف`;
      }

      return remainder
        ? `${thousandText} و${convertNumberToArabicWords(remainder)}`
        : thousandText;
    }

    // الأرقام من 1,000,000 إلى 999,999,999
    if (num < 1000000000) {
      const million = Math.floor(num / 1000000);
      const remainder = num % 1000000;

      let millionText;
      if (million >= 1 && million <= 10) {
        // استخدام مصفوفة millions
        millionText = millions[million];
      } else {
        millionText = `${convertNumberToArabicWords(million)} مليون`;
      }

      return remainder
        ? `${millionText} و${convertNumberToArabicWords(remainder)}`
        : millionText;
    }

    // الأرقام من 1,000,000,000 وما فوق
    const billion = Math.floor(num / 1000000000);
    const remainder = num % 1000000000;

    let billionText;
    if (billion >= 1 && billion <= 10) {
      // استخدام مصفوفة billions
      billionText = billions[billion];
    } else {
      billionText = `${convertNumberToArabicWords(billion)} مليار`;
    }

    return remainder
      ? `${billionText} و${convertNumberToArabicWords(remainder)}`
      : billionText;
  };

  // معالجة تغيير قيم الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;

    // تحديث قيمة الحقل
    const updatedFormData = { ...formData, [name]: value };

    // إذا كان الحقل هو المبلغ رقمًا، قم بتحديث المبلغ كتابة تلقائيًا
    if (name === "paymentVoucher_amount") {
      if (value) {
        updatedFormData.paymentVoucher_writtenAmount = `${convertNumberToArabicWords(
          value
        )} ريال فقط لا غير`;
      } else {
        updatedFormData.paymentVoucher_writtenAmount = ""; // إفراغ حقل المبلغ كتابة إذا كان المبلغ رقمًا فارغًا
      }
    }

    // تجاهل التغييرات المباشرة على حقل المبلغ كتابة
    if (name === "paymentVoucher_writtenAmount") {
      return; // الخروج من الدالة دون تحديث الحالة
    }

    setFormData(updatedFormData);

    // إزالة رسالة الخطأ للحقل الذي يتم تعديله
    const newErrors = { ...error };
    delete newErrors[name];
    setErrors(newErrors);
  };

  // معالجة حفظ التعديلات
  const handleSaveOnly = async (e) => {
    e.preventDefault();

    // التحقق من صحة البيانات
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/Expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire("تم التحديث!", "تم تحديث بيانات السند بنجاح.", "success");
        navigate("/management/Expenses/DisplaySearchExpenses");
      } else {
        const data = await response.json();
        setErrors({
          ...error,
          general: data.message || "فشل في تحديث البيانات",
        });
      }
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ أثناء التحديث" });
      console.error(err);
    }
  };

  // معالجة حفظ التعديلات والطباعة
  const handleSaveAndPrint = async (e) => {
    e.preventDefault();

    // التحقق من صحة البيانات
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/Expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // إظهار رسالة نجاح
        Swal.fire("تم التحديث!", "تم تحديث بيانات السند بنجاح.", "success");

        // استخدام اسم المسجد المخزن في formData إذا كان موجودًا
        let mosqueName = "";
        // @ts-ignore
        if (formData.mosque_name) {
          // @ts-ignore
          mosqueName = formData.mosque_name;
        } else {
          // البحث عن اسم المسجد في مصفوفة المساجد
          const mosque = mosques.find(
            (m) => m.id === parseInt(formData.mosque_id)
          );
          mosqueName = mosque ? mosque.mosque_name : "";
        }

        console.log(
          "Selected mosque:",
          mosques.find((m) => m.id === formData.mosque_id)
        );
        console.log("Mosque name:", mosqueName);
        console.log("Mosque ID:", formData.mosque_id);
        console.log("Available mosques:", mosques);

        // إنشاء محتوى الطباعة
        const printContent = `
          <!DOCTYPE html>
          <html dir="rtl">
            <head>
              <title>سند صرف</title>
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
                  width: 170mm; /* تصغير عرض السند */
                  height: 120mm; /* تصغير ارتفاع السند */
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
                
                h1 {
                  font-size: 16px;
                  margin: 0;
                  font-weight: bold;
                  color: black;
                }
                
                .voucher-title {
                  text-align: center;
                  font-size: 18px;
                  font-weight: bold;
                  margin: 10px 0;
                  color: black;
                }
                
                .field-row {
                  display: flex;
                  margin-bottom: 8px;
                }
                
                .field {
                  flex: 1;
                  display: flex;
                  align-items: center;
                }
                
                .full-width-field {
                  width: 100%;
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
                  border-bottom: 1px solid #777;
                  padding: 2px 5px;
                  flex: 1;
                  font-size: 11px;
                  color: black;
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
                // تنفيذ الطباعة مباشرة بعد تحميل الصفحة
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
                
                <div class="voucher-title">سند صرف</div>
                
                <div class="field-row">
                  <div class="field">
                    <span class="label">رقم السند:</span>
                    <span class="value">${
                      formData.paymentVoucher_bondNumber
                    }</span>
                  </div>
                  <div class="field">
                    <span class="label">التاريخ:</span>
                    <span class="value">${formData.paymentVoucher_date}</span>
                  </div>
                </div>
                
                <div class="field-row">
                  <div class="field">
                    <span class="label">المبلغ رقماً:</span>
                    <span class="value">${
                      formData.paymentVoucher_amount
                    } ريال</span>
                  </div>
                </div>
                
                <div class="field-row">
                  <div class="full-width-field">
                    <span class="label">المبلغ كتابة:</span>
                    <span class="full-width-value">${
                      formData.paymentVoucher_writtenAmount
                    }</span>
                  </div>
                </div>
                
                <div class="field-row">
                  <div class="full-width-field">
                    <span class="label">اسم المستلم:</span>
                    <span class="full-width-value">${
                      formData.paymentVoucher_recipient
                    }</span>
                  </div>
                </div>
                
                <div class="field-row">
                  <div class="full-width-field">
                    <span class="label">الجهة المستفيدة:</span>
                    <span class="full-width-value">${
                      "مسجد " + mosqueName
                    }</span>
                  </div>
                </div>
                
                <div class="field-row">
                  <div class="full-width-field">
                    <span class="label">وذلك مقابل:</span>
                    <span class="full-width-value">${
                      formData.paymentVoucher_description
                    }</span>
                  </div>
                </div>
                
                <div class="signatures">
                  <div class="signature">
                    <div class="label">توقيع المستلم</div>
                    <div class="signature-line"></div>
                  </div>
                  <div class="signature">
                    <div class="label">ختم المدير</div>
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
      } else {
        const data = await response.json();
        setErrors({
          ...error,
          general: data.message || "فشل في تحديث البيانات",
        });
      }
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ أثناء التحديث" });
      console.error(err);
    }
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors = {};

    // التحقق من رقم السند
    if (!formData.paymentVoucher_bondNumber) {
      newErrors.paymentVoucher_bondNumber = "رقم السند مطلوب";
    } else if (
      // التحقق من تكرار رقم السند فقط إذا تم تغييره
      formData.paymentVoucher_bondNumber !== originalBondNumber &&
      existingBondNumbers.includes(formData.paymentVoucher_bondNumber)
    ) {
      newErrors.paymentVoucher_bondNumber = "رقم السند موجود بالفعل";
    }

    if (!formData.paymentVoucher_amount) {
      newErrors.paymentVoucher_amount = "المبلغ مطلوب";
      // @ts-ignore
    } else if (isNaN(formData.paymentVoucher_amount)) {
      newErrors.paymentVoucher_amount = "المبلغ يجب أن يكون رقمًا";
    }

    if (!formData.paymentVoucher_recipient) {
      newErrors.paymentVoucher_recipient = "اسم المستلم مطلوب";
    }

    if (!formData.paymentVoucher_description) {
      newErrors.paymentVoucher_description = "وصف السند مطلوب";
    }

    if (!formData.mosque_id) {
      newErrors.mosque_id = "المسجد مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إزالة useEffect الثاني الذي يستدعي updateWrittenAmount
  // لا تستخدم هذا الكود:
  // useEffect(() => {
  //   if (id) {
  //     updateWrittenAmount();
  //   }
  // }, [id]);

  // إزالة وظيفة updateWrittenAmount
  // لا تستخدم هذه الوظيفة:
  // const updateWrittenAmount = async () => { ... }

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة المصروفات" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div></div>
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Expenses/ReportExpenses"
              />
              <Mainbutton
                text="بحث"
                path="/management/Expenses/DisplaySearchExpenses"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Expenses/AddExpenses"
              />
            </div>
          </div>
          <form
            id="printableForm"
            className="divforconten logo"
            onSubmit={(e) => e.preventDefault()} // تغيير handleSubmit إلى منع السلوك الافتراضي فقط
          >
            <Managementdata dataname=" تعديل بيانات سند صرف" />
            <div className="RowForInsertinputs">
              <div style={{ width: "27%", marginRight: "auto" }}>
                <Inputwithlabelcustom
                  widthinput="74%"
                  widthlabel="26%"
                  value={formData.paymentVoucher_bondNumber}
                  name="paymentVoucher_bondNumber"
                  change={handleChange}
                  text="رقم السند"
                />
                {
                  // @ts-ignore
                  error.paymentVoucher_bondNumber && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.paymentVoucher_bondNumber
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div
              className="RowForInsertinputs"
              style={{ justifyContent: "space-between" }}
            >
              <div style={{ width: "75%" }}>
                <InputDatecustom
                  widthinput="27%"
                  widthlabel="7%"
                  value={formData.paymentVoucher_date}
                  name="paymentVoucher_date"
                  change={handleChange}
                  text="تاريخ"
                  disabled={true} // جعل حقل التاريخ غير قابل للتعديل
                />
              </div>
              <div style={{ width: "25%" }}>
                <Inputwithlabelcustom
                  widthinput="100%"
                  widthlabel="48%"
                  value={formData.paymentVoucher_amount}
                  name="paymentVoucher_amount"
                  change={handleChange}
                  text="المبلغ رقمًا"
                />
                {
                  // @ts-ignore
                  error.paymentVoucher_amount && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.paymentVoucher_amount
                      }
                    </div>
                  )
                }
              </div>
            </div>
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
                      <div className="error-message">
                        {
                          // @ts-ignore
                          error.mosque_id
                        }
                      </div>
                    )
                  }
                </div>
              </div>
              <div style={{ width: "40%" }}>
                <Inputwithlabelcustom
                  widthinput="100%"
                  widthlabel="25%"
                  value={formData.paymentVoucher_recipient}
                  name="paymentVoucher_recipient"
                  change={handleChange}
                  text="بيد المحترم"
                />
                {
                  // @ts-ignore
                  error.paymentVoucher_recipient && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.paymentVoucher_recipient
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div
              className="RowForInsertinputs"
              style={{ justifyContent: "space-between" }}
            >
              <div style={{ width: "25%" }}></div>
              <div style={{ width: "75%" }}>
                <Inputwithlabelcustom
                  widthinput="100%"
                  widthlabel="12%"
                  value={formData.paymentVoucher_description}
                  name="paymentVoucher_description"
                  change={handleChange}
                  text="ذلك بمقابل"
                />
                {
                  // @ts-ignore
                  error.paymentVoucher_description && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.paymentVoucher_description
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div
              className="RowForInsertinputs"
              style={{ justifyContent: "space-between" }}
            >
              <div style={{ width: "40%" }}></div>
              <div style={{ width: "60%" }}>
                <Inputwithlabelcustom
                  widthinput="100%"
                  widthlabel="15%"
                  value={formData.paymentVoucher_writtenAmount}
                  name="paymentVoucher_writtenAmount"
                  change={handleChange}
                  text="المبلغ كتابة"
                  disabled={true} // جعل حقل المبلغ كتابة غير قابل للتعديل
                />
                {
                  // @ts-ignore
                  error.paymentVoucher_writtenAmount && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.paymentVoucher_writtenAmount
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div className="RowForInsertinputs">
              <h4
                style={{
                  width: "70%",
                  textAlign: "center",
                  fontFamily: "amiri",
                }}
              >
                ختم المدير
              </h4>
              <h4
                style={{
                  width: "30%",
                  textAlign: "center",
                  fontFamily: "amiri",
                }}
              >
                توقيع المستلم
              </h4>
            </div>
            <div className="RowForInsertinputs"></div>
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
              <ButtonInput text="حفظ التعديلات" onClick={handleSaveOnly} />
            </div>
            {
              // @ts-ignore
              error.general && (
                <div className="error-message general-error">
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
