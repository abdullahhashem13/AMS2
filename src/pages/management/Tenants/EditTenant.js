import { useState, useEffect } from "react";
// @ts-ignore
import { useParams, useNavigate } from "react-router-dom";
// @ts-ignore
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// @ts-ignore
import Swal from "sweetalert2";
import Bigbutton from "../../../components/Bigbutton";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import "../../../style/deblicateError.css";
import "../../../style/sucsefulMessage.css";
import SelectWithLabel from "../../../components/SelectWithLabel";
import ButtonInput from "../../../components/ButtonInput";

export default function EditTenant() {
  const { id } = useParams();
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
    general: "",
    // ...existing code...
  });
  const [showDuplicateError, setShowDuplicateError] = useState(false);
  const [existingTenants, setExistingTenants] = useState([]);
  const [originalTenantName, setOriginalTenantName] = useState("");
  // إضافة متغير حالة جديد لعرض خطأ تكرار رقم الهوية
  const [showDuplicateIDError, setShowDuplicateIDError] = useState(false);
  const [originalIdNumber, setOriginalIdNumber] = useState("");
  // إضافة متغيرات حالة للتحكم في الانيميشن
  const [isClosingDuplicateError, setIsClosingDuplicateError] = useState(false);
  const [isClosingDuplicateIDError, setIsClosingDuplicateIDError] =
    useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://awgaff1.runasp.net/api/Tenant");
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }

        const data = await response.json();

        // دعم جميع أشكال الاستجابة: مصفوفة مباشرة أو داخل خاصية Tenants أو data أو payload أو result
        let tenantsArr = [];
        if (Array.isArray(data)) {
          tenantsArr = data;
        } else if (Array.isArray(data.Tenants)) {
          tenantsArr = data.Tenants;
        } else if (Array.isArray(data.data)) {
          tenantsArr = data.data;
        } else if (Array.isArray(data.payload)) {
          tenantsArr = data.payload;
        } else if (Array.isArray(data.result)) {
          tenantsArr = data.result;
        }
        setExistingTenants(tenantsArr);

        // البحث عن المستأجر المحدد
        const tenant = tenantsArr.find(
          (tenant) => String(tenant.id) === String(id)
        );
        if (tenant) {
          // تحويل الحقول القادمة من الـ API لتناسب formData
          const normalizedTenant = normalizeTenant(tenant);
          setFormData(normalizedTenant);
          setOriginalTenantName(normalizedTenant.name);
          setOriginalIdNumber(normalizedTenant.IdNumber); // حفظ رقم الهوية الأصلي
        } else {
          throw new Error("لم يتم العثور على المستأجر");
        }
        // دالة لتحويل الحقول القادمة من الـ API إلى الشكل المطلوب في formData
        function normalizeTenant(apiTenant) {
          return {
            name: apiTenant.name || "",
            phone: apiTenant.phone ? String(apiTenant.phone) : "",
            IdNumber: apiTenant.IdNumber || apiTenant.idNumber || "",
            gender: apiTenant.gender || apiTenant.genders || "",
            type: apiTenant.type || "",
            governorate: apiTenant.governorate || "",
            city: apiTenant.city || "",
            neighborhood: apiTenant.neighborhood || "",
          };
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors({ general: error.message });
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
  };

  // استبدال validateForm بالدالة الموحدة
  const validateForm = () =>
    validateTenantForm(
      formData,
      setErrors,
      existingTenants,
      originalIdNumber,
      id
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // عرض رسالة التأكيد أولاً
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "هل تريد حفظ التعديلات؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، قم بحفظ التعديلات!",
      cancelButtonText: "إلغاء",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://awgaff1.runasp.net/api/Tenant/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        navigate("/management/Tenants/DisplaySearchTenant");
      } else {
        // محاولة قراءة رسالة الخطأ كنص وليس كـ JSON
        let errorMsg = "فشل في تحديث البيانات";
        try {
          const text = await response.text();
          // محاولة استخراج الرسالة العربية من النص
          if (text && text.length < 200) {
            errorMsg = text;
          }
        } catch (e) {}
        setErrors({
          ...error,
          general: errorMsg,
        });
      }
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ أثناء التحديث" });
      console.error(err);
    }
  };

  const closeDuplicateError = () => {
    setIsClosingDuplicateError(true);
    setTimeout(() => {
      setShowDuplicateError(false);
      setIsClosingDuplicateError(false);
    }, 300); // مدة الانيميشن
  };

  // تعديل دالة إغلاق رسالة خطأ تكرار رقم الهوية
  const closeDuplicateIDError = () => {
    setIsClosingDuplicateIDError(true);
    setTimeout(() => {
      setShowDuplicateIDError(false);
      setIsClosingDuplicateIDError(false);
    }, 300); // مدة الانيميشن
  };

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة المستأجرين" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div></div>
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
          <form className="divforconten" onSubmit={handleSubmit}>
            <Managementdata dataname="تعديل بيانات المستأجر" />
            <div
              className="RowForInsertinputs"
              style={{
                marginBottom: 15,
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
            <div className="RowForInsertinputs">
              <div className="input-container">
                <SelectWithLabel
                  value={formData.type}
                  name="type"
                  change={handleChange}
                  text="نوع المستأجر"
                  value1="حالي"
                  value2="سابق"
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
                  text="الجنس"
                  value1="ذكر"
                  value2="أنثى"
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
            <div className="RowForInsertinputs"></div>

            <div className="RowForInsertinputs">
              <div className="displayflexjust">
                <ButtonInput text="حفظ التعديلات" onClick={handleSubmit} />
              </div>
            </div>
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
                  <button
                    className="error-button"
                    onClick={closeDuplicateError}
                  >
                    حسناً
                  </button>
                </div>
              </div>
            )}
            {showDuplicateIDError && (
              <div
                className={`error-notification ${
                  isClosingDuplicateIDError ? "closing" : ""
                }`}
              >
                <div
                  className={`error-content ${
                    isClosingDuplicateIDError ? "closing" : ""
                  }`}
                >
                  <div className="error-message-title">رقم الهوية مكرر</div>
                  <div className="error-message-body">
                    رقم الهوية الذي أدخلته موجود بالفعل. يرجى التحقق من الرقم.
                  </div>
                  <button
                    className="error-button"
                    onClick={closeDuplicateIDError}
                  >
                    حسناً
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

// توحيد الفاليديشن بين الإضافة والتعديل
function validateTenantForm(
  formData,
  setErrors,
  existingTenants,
  originalIdNumber,
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
    (typeof originalIdNumber !== "undefined" &&
      formData.IdNumber !== originalIdNumber) ||
    typeof originalIdNumber === "undefined"
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
