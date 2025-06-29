import { useState, useEffect } from "react";
// @ts-ignore
import { useNavigate } from "react-router-dom";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Submitinput from "../../../components/submitinput";
import Bigbutton from "../../../components/Bigbutton";
import "../../../style/deblicateError.css";
import SelectWithLabel from "../../../components/SelectWithLabel";

export default function AddTenant() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    IdNumber: "",
    gender: "",
    type: "",
    governorate: "",
    city: "",
    neighborhood: "",
  });
  const [error, setErrors] = useState({
    IdNumber: "",
  });
  const [existingTenants, setExistingTenants] = useState([]);
  const [showDuplicateError, setShowDuplicateError] = useState(false);
  // إضافة متغير حالة جديد لعرض خطأ تكرار رقم الهوية
  // إضافة متغيرات حالة للتحكم في الانيميشن
  const [isClosingDuplicateError, setIsClosingDuplicateError] = useState(false);
  useState(false);

  // جلب قائمة المستأجرين الحاليين
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://awgaff1.runasp.net/api/Tenant");
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
        const data = await response.json();
        if (data.Tenants && Array.isArray(data.Tenants)) {
          setExistingTenants(data.Tenants);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
  };

  // توحيد الفاليديشن بين الإضافة والتعديل
  function validateTenantForm(
    formData,
    setErrors,
    existingTenants,
    originalIDNumber,
    id
  ) {
    let isValid = true;
    let errors = {};

    // التحقق من اسم المستأجر (أحرف عربية فقط واسم رباعي)
    if (!formData.name) {
      errors.name = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.name)) {
      errors.name = "يجب أن يحتوي اسم المستأجر على أحرف عربية فقط";
      isValid = false;
    } else if (formData.name.trim().split(/\s+/).length < 4) {
      errors.name = "يجب أن يكون الاسم رباعي";
      isValid = false;
    }

    // التحقق من رقم الهاتف (9 أرقام ويبدأ بـ 7)
    if (!formData.phone) {
      errors.phone = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.phone)) {
      errors.phone = "يجب أن يحتوي رقم الهاتف على أرقام فقط";
      isValid = false;
    } else if (formData.phone.length !== 9) {
      errors.phone = "يجب أن يتكون رقم الهاتف من 9 أرقام";
      isValid = false;
    } else if (!formData.phone.startsWith("7")) {
      errors.phone = "يجب أن يبدأ رقم الهاتف بالرقم 7";
      isValid = false;
    }

    // التحقق من رقم الهوية (أرقام فقط)
    if (!formData.IdNumber) {
      errors.IdNumber = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.IdNumber)) {
      errors.IdNumber = "يجب أن يحتوي رقم الهوية على أرقام فقط";
      isValid = false;
    } else if (
      (typeof originalIDNumber !== "undefined" &&
        formData.IdNumber !== originalIDNumber) ||
      typeof originalIDNumber === "undefined"
    ) {
      // تحقق من التكرار فقط إذا كان في التعديل وتم تغيير الرقم أو إذا كان في الإضافة
      const isDuplicateID = existingTenants.some(
        (tenant) =>
          tenant.IdNumber === formData.IdNumber && (!id || tenant.id !== id)
      );
      if (isDuplicateID) {
        errors.IdNumber = "رقم الهوية مكرر";
        isValid = false;
      }
    }

    // التحقق من المحافظة (أحرف عربية فقط)
    if (!formData.governorate) {
      errors.governorate = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.governorate)) {
      errors.governorate = "يجب أن تحتوي المحافظة على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من المدينة (أحرف عربية فقط)
    if (!formData.city) {
      errors.city = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.city)) {
      errors.city = "يجب أن تحتوي المدينة على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من الحي (أحرف عربية فقط)
    if (!formData.neighborhood) {
      errors.neighborhood = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.neighborhood)) {
      errors.neighborhood = "يجب أن يحتوي الحي على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من نوع المستأجر
    if (!formData.type) {
      errors.type = "يجب اختيار نوع المستأجر";
      isValid = false;
    }
    // التحقق من الجنس
    if (!formData.gender) {
      errors.gender = "يجب اختيار الجنس";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  }

  const closeDuplicateError = () => {
    setIsClosingDuplicateError(true);
    setTimeout(() => {
      setShowDuplicateError(false);
      setIsClosingDuplicateError(false);
    }, 300); // مدة الانيميشن
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من صحة البيانات قبل الإرسال
    const validateForm = () =>
      validateTenantForm(formData, setErrors, existingTenants);

    if (!validateForm()) {
      return;
    }

    try {
      // تحويل الحقول لتطابق الـ API
      const apiData = {
        name: formData.name,
        genders: formData.gender,
        phone: Number(formData.phone),
        city: formData.city,
        neighborhood: formData.neighborhood,
        governorate: formData.governorate,
        idNumber: Number(formData.IdNumber),
        type: formData.type,
        tenant_Warining: null,
        receipt_Vouchers: null,
        aggrements: null,
      };
      const response = await fetch("http://awgaff1.runasp.net/api/Tenant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        console.log("successful!");
        navigate("/management/Tenants/DisplaySearchTenant");
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
  return (
    <div className="displayflexhome">
      <Saidbar />
      {/* مساحة أخذنها بمثابة السايد البار لانه عملت السايد بار ثابت على اليسار */}
      <div className="sizeboxUnderSaidbar"></div>
      {/*  */}
      {/* المحتوى الخاص بالصفحة */}
      <div className="homepage">
        {/* عنوان الصفحة */}
        <Managmenttitle title="إدارة المستأجرين" />
        {/*  */}
        {/* يحمل ما تحت العنوان */}
        <div className="subhomepage">
          {/* يحمل البوتنس */}
          <div className="divforbuttons">
            {/* تم تقسيمهن الى دفيين عشان كل دف يكون في الطرف */}
            <div></div>
            {/* الاول */}
            <div className="displayflexjust">
              <Bigbutton
                text="إنذارات المستأجرين"
                path="/management/Tenants/TenantWaringDisplaySearch"
              />
              <Mainbutton
                text="تقرير"
                path="/management/Tenants/ReportTenant"
              />
              <Mainbutton
                text="بحث"
                path="/management/Tenants/DisplaySearchTenant"
              />
              <Mainbutton text="إضافة" path="/management/Tenants/AddTenant" />
            </div>
          </div>
          {/*  */}
          {/* يحمل المحتوى تحت البوتنس */}
          <form
            className="divforconten"
            onSubmit={handleSubmit}
            // action="/management/Properties/AddProperty"
          >
            <Managementdata dataname="بيانات المستأجر" />
            <div
              className="RowForInsertinputs"
              style={{
                marginBottom: 20,
              }}
            >
              <div className="input-container">
                <Inputwithlabel
                  value={formData.IdNumber}
                  name="IdNumber"
                  change={handleChange}
                  text="رقم الهوية"
                />
                {
                  // @ts-ignore
                  error.IdNumber && (
                    <div className="error-message">{error.IdNumber}</div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.phone}
                  name="phone"
                  change={handleChange}
                  text="رقم التلفون"
                />
                {
                  // @ts-ignore
                  error.phone && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.phone
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.name}
                  name="name"
                  change={handleChange}
                  text="اسم المستأجر"
                />
                {
                  // @ts-ignore
                  error.name && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.name
                      }
                    </div>
                  )
                }
              </div>
            </div>

            <div
              className="RowForInsertinputs"
              style={{
                width: "70%",
              }}
            >
              <div className="input-container">
                <SelectWithLabel
                  value={formData.type}
                  name="type"
                  change={handleChange}
                  value1="حالي"
                  value2="سابق"
                  text="نوع المستأجر"
                />
                {
                  // @ts-ignore
                  error.type && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.type
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <SelectWithLabel
                  value={formData.gender}
                  name="gender"
                  change={handleChange}
                  value1="أنثى"
                  value2="ذكر"
                  text="الجنس"
                  defaultValue="نوع اجنس"
                />
                {
                  // @ts-ignore
                  error.gender && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.gender
                      }
                    </div>
                  )
                }
              </div>
            </div>

            <div className="RowForInsertinputs">
              <div className="deviderwithword">
                <hr className="st_hr2managment"></hr>
                <h2>الموقع</h2>
                <hr className="st_hr1managment"></hr>
              </div>
            </div>
            <div className="RowForInsertinputs">
              <div className="input-container">
                <Inputwithlabel
                  value={formData.neighborhood}
                  name="neighborhood"
                  change={handleChange}
                  text="الحي"
                />
                {
                  // @ts-ignore
                  error.neighborhood && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.neighborhood
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.city}
                  name="city"
                  change={handleChange}
                  text="المدينة"
                />
                {
                  // @ts-ignore
                  error.city && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.city
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.governorate}
                  name="governorate"
                  change={handleChange}
                  text="المحافظة"
                />
                {
                  // @ts-ignore
                  error.governorate && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.governorate
                      }
                    </div>
                  )
                }
              </div>
            </div>

            <div className="RowForInsertinputs"></div>
            <div className="RowForInsertinputs"></div>
            <div className="RowForInsertinputs"></div>

            <div className="RowForInsertinputs">
              <Submitinput text="حفظ" onClick={handleSubmit} />
            </div>
          </form>
          {/*  */}
        </div>
      </div>
      {/*  */}
      {showDuplicateError && (
        <div
          className={`error-notification ${
            isClosingDuplicateError ? "closing" : ""
          }`}
        >
          <div
            className={`error-content ${
              isClosingDuplicateError ? "closing" : ""
            }`}
          >
            <div className="error-message-title">اسم المستأجر مكرر</div>
            <div className="error-message-body">
              اسم المستأجر الذي أدخلته موجود بالفعل. يرجى اختيار اسم آخر.
            </div>
            <button className="error-button" onClick={closeDuplicateError}>
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
