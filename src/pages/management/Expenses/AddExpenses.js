import { useState, useEffect } from "react";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Inputwithlabelcustom from "../../../components/Inputwithlabelcustom";
import InputDatecustom from "../../../components/InputDatecustom";
import SearchableSelect from "../../../components/SearchableSelect";
import ButtonInput from "../../../components/ButtonInput";
import { useNavigate } from "react-router-dom";

export default function AddExpenses() {
  // تحديد تاريخ اليوم بالتنسيق المناسب (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    description: "",
    recipient: "",
    date: today,
    amount: "",
    writtenAmount: "",
    bondNumber: "",
    mosque_id: "",
  });
  const [error, setErrors] = useState({});
  const [mosques, setMosques] = useState([]);
  const [existingBondNumbers, setExistingBondNumbers] = useState([]);
  const navigate = useNavigate();

  // جلب المساجد وأرقام السندات الموجودة عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب المساجد
        const mosquesResponse = await fetch("http://localhost:3001/Mosques");
        if (mosquesResponse.ok) {
          const mosquesData = await mosquesResponse.json();
          setMosques(mosquesData);
        }

        // جلب أرقام السندات الموجودة
        const expensesResponse = await fetch("http://localhost:3001/Expenses");
        if (expensesResponse.ok) {
          const expensesData = await expensesResponse.json();
          const bondNumbers = expensesData.map((expense) => expense.bondNumber);
          setExistingBondNumbers(bondNumbers);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // تحويل الأرقام إلى كلمات باللغة العربية
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // تحديث قيمة الحقل
    const updatedFormData = { ...formData, [name]: value };

    // إذا كان الحقل هو المبلغ رقمًا، قم بتحديث المبلغ كتابة تلقائيًا
    if (name === "amount") {
      if (value) {
        updatedFormData.writtenAmount = `${convertNumberToArabicWords(
          value
        )} ريال فقط لا غير`;
      } else {
        updatedFormData.writtenAmount = ""; // إفراغ حقل المبلغ كتابة إذا كان المبلغ رقمًا فارغًا
      }
    }

    // تجاهل التغييرات المباشرة على حقل المبلغ كتابة
    if (name === "writtenAmount") {
      return; // الخروج من الدالة دون تحديث الحالة
    }

    setFormData(updatedFormData);

    // إزالة رسالة الخطأ للحقل الذي يتم تعديله
    const newErrors = { ...error };
    delete newErrors[name];

    // التحقق من رقم السند
    if (name === "bondNumber") {
      if (!value) {
        // @ts-ignore
        newErrors.bondNumber = "يجب تعبئة الحقل";
      } else if (!/^\d+$/.test(value)) {
        // @ts-ignore
        newErrors.bondNumber = "يجب أن يحتوي رقم السند على أرقام فقط";
      } else if (existingBondNumbers.includes(value)) {
        // @ts-ignore
        newErrors.bondNumber = "رقم السند موجود بالفعل";
      }
    }

    // التحقق من المبلغ (أرقام فقط)
    if (name === "amount") {
      if (!value) {
        // @ts-ignore
        newErrors.amount = "يجب تعبئة الحقل";
      } else if (!/^\d+$/.test(value)) {
        // @ts-ignore
        newErrors.amount = "يجب أن يحتوي المبلغ على أرقام فقط";
      }
    }

    // التحقق من المستلم (أحرف عربية فقط واسم رباعي)
    if (name === "recipient") {
      if (!value) {
        // @ts-ignore
        newErrors.recipient = "يجب تعبئة الحقل";
      } else if (!/^[\u0600-\u06FF\s]+$/.test(value)) {
        // @ts-ignore
        newErrors.recipient = "يجب أن يحتوي اسم المستلم على أحرف عربية فقط";
      } else {
        const words = value.trim().split(/\s+/);
        if (words.length < 4) {
          // @ts-ignore
          newErrors.recipient = "يجب أن يكون اسم المستلم رباعي على الأقل";
        }
      }
    }

    // التحقق من الوصف (أحرف عربية وأرقام ورموز)
    if (name === "description") {
      if (!value) {
        // @ts-ignore
        newErrors.description = "يجب تعبئة الحقل";
      }
      // لا نضيف تحقق إضافي لنسمح بالأحرف العربية والأرقام والرموز
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    // التحقق من رقم السند
    if (!formData.bondNumber) {
      errors.bondNumber = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.bondNumber)) {
      errors.bondNumber = "يجب أن يحتوي رقم السند على أرقام فقط";
      isValid = false;
    } else if (existingBondNumbers.includes(formData.bondNumber)) {
      errors.bondNumber = "رقم السند موجود بالفعل";
      isValid = false;
    }

    // التحقق من اختيار المسجد
    if (!formData.mosque_id) {
      errors.mosque_id = "يجب اختيار المسجد";
      isValid = false;
    }

    // التحقق من المبلغ
    if (!formData.amount) {
      errors.amount = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.amount)) {
      errors.amount = "يجب أن يحتوي المبلغ على أرقام فقط";
      isValid = false;
    }

    // التحقق من المستلم (أحرف عربية فقط واسم رباعي)
    if (!formData.recipient) {
      errors.recipient = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.recipient)) {
      errors.recipient = "يجب أن يحتوي اسم المستلم على أحرف عربية فقط";
      isValid = false;
    } else {
      const words = formData.recipient.trim().split(/\s+/);
      if (words.length < 4) {
        errors.recipient = "يجب أن يكون اسم المستلم رباعي على الأقل";
        isValid = false;
      }
    }

    // التحقق من الوصف (فقط التحقق من أنه غير فارغ)
    if (!formData.description) {
      errors.description = "يجب تعبئة الحقل";
      isValid = false;
    }

    // التحقق من المبلغ كتابة
    if (!formData.writtenAmount) {
      errors.writtenAmount = "يجب تعبئة الحقل";
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
      const response = await fetch("http://localhost:3001/Expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // الانتقال مباشرة إلى صفحة العرض بعد الحفظ
        navigate("/management/Expenses/DisplaySearchExpenses");
        return;
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

  // تعديل دالة الحفظ والطباعة
  const handleSaveAndPrint = async (e) => {
    e.preventDefault();

    // التحقق من صحة النموذج قبل الإرسال
    if (!validateForm()) {
      return;
    }

    try {
      // حفظ البيانات أولاً
      const response = await fetch("http://localhost:3001/Expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("تم الحفظ بنجاح!");
        navigate("/management/Expenses/DisplaySearchExpenses");
        return;
      } else {
        console.error("فشل في الحفظ");
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
      console.error("خطأ في الحفظ:", err);
      setErrors({ ...error, general: "حدث خطأ ما." });
    }
  };

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
            <Managementdata dataname="سند صرف" />
            <div className="RowForInsertinputs">
              <div
                style={{ width: "27%", marginRight: "auto", marginBottom: 15 }}
              >
                <Inputwithlabelcustom
                  widthinput="74%"
                  widthlabel="26%"
                  value={formData.bondNumber}
                  name="bondNumber"
                  change={handleChange}
                  text="رقم السند"
                />
                {
                  // @ts-ignore
                  error.bondNumber && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.bondNumber
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div
              className="RowForInsertinputs"
              style={{ justifyContent: "space-between", marginBottom: 20 }}
            >
              <div style={{ width: "75%" }}>
                <InputDatecustom
                  widthinput="27%"
                  widthlabel="7%"
                  value={formData.date}
                  name="date"
                  change={handleChange}
                  text="تاريخ"
                  disabled={true} // جعل حقل التاريخ غير قابل للتعديل
                />
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
                {
                  // @ts-ignore
                  error.amount && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.amount
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div
              className="RowForInsertinputs"
              style={{ justifyContent: "space-between", marginBottom: 20 }}
            >
              <div style={{ width: "28%" }}>
                <div className="input-container">
                  <SearchableSelect
                    name="mosque_id"
                    text="المسجد"
                    options={mosques.map((mosque) => ({
                      value: mosque.id,
                      label: mosque.name,
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
                  value={formData.recipient}
                  name="recipient"
                  change={handleChange}
                  text="بيد المحترم"
                />
                {
                  // @ts-ignore
                  error.recipient && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.recipient
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div
              className="RowForInsertinputs"
              style={{ justifyContent: "space-between", marginBottom: 20 }}
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
                {
                  // @ts-ignore
                  error.description && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.description
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
                  value={formData.writtenAmount}
                  name="writtenAmount"
                  change={handleChange}
                  text="المبلغ كتابة"
                  disabled={true} // جعل حقل المبلغ كتابة غير قابل للتعديل
                />
                {
                  // @ts-ignore
                  error.writtenAmount && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.writtenAmount
                      }
                    </div>
                  )
                }
              </div>
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
              <ButtonInput text="حفظ وطباعة" onClick={handleSaveAndPrint} />
              <ButtonInput text="حفظ" onClick={handleSaveOnly} />
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
