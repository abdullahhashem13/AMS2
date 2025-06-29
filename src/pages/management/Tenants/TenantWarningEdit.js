import { useState, useEffect } from "react";
// @ts-ignore
import { useParams, useNavigate } from "react-router-dom";
// @ts-ignore
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// @ts-ignore
import Swal from "sweetalert2";
// @ts-ignore
// @ts-ignore
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import "../../../style/deblicateError.css";
import "../../../style/sucsefulMessage.css";
import ButtonInput from "../../../components/ButtonInput";
import SelectWithLabel3 from "../../../components/SelectWithLabel3";
import InputDate from "../../../components/InputDate";
import SearchableSelect from "../../../components/SearchableSelect";

export default function TenantWarningEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tenant_id: "",
    typeOfWarning: "",
    date: "",
    description: "",
  });
  const [error, setErrors] = useState({});
  const [tenants, setTenants] = useState([]);
  // @ts-ignore
  const [warnings, setWarnings] = useState([]);
  // @ts-ignore
  const [, setOriginalTypeOfWarning] = useState("");
  // @ts-ignore
  const [, setOriginalTenantId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://awgaff1.runasp.net/api/Tenant");
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }

        const data = await response.json();

        // جلب قائمة المستأجرين
        if (data.Tenants && Array.isArray(data.Tenants)) {
          // فلترة المستأجرين للحصول على الحاليين فقط
          const currentTenants = data.Tenants.filter(
            (tenant) => tenant.type === "حالي"
          );
          setTenants(currentTenants);
        }

        // جلب بيانات الإنذارات
        if (data.TenantWaring && Array.isArray(data.TenantWaring)) {
          setWarnings(data.TenantWaring);

          // جلب بيانات الإنذار المحدد
          const warning = data.TenantWaring.find(
            (warning) => warning.id === id
          );
          if (warning) {
            setFormData({
              tenant_id: warning.tenant_id,
              typeOfWarning: warning.typeOfWarning,
              date: warning.date,
              description: warning.description,
            });
            // حفظ القيم الأصلية للتحقق من التكرار
            setOriginalTypeOfWarning(warning.typeOfWarning);
            setOriginalTenantId(warning.tenant_id);
          } else {
            throw new Error("لم يتم العثور على الإنذار");
          }
        } else {
          throw new Error("بيانات الإنذارات غير متوفرة");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors({ general: error.message });
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // التحقق من صحة وصف الإنذار
    if (name === "description") {
      // التحقق من أن القيمة تحتوي فقط على أحرف عربية وأرقام والقوسين والفاصلة
      const arabicRegex = /^[\u0600-\u06FF0-9(),، ]*$/;
      if (!arabicRegex.test(value)) {
        setErrors({
          ...error,
          description:
            "يجب أن يحتوي الوصف على أحرف عربية وأرقام والقوسين والفاصلة فقط",
        });
        return;
      }
    }

    // إذا تم تغيير نوع الإنذار أو المستأجر، تحقق من وجود إنذار سابق
    if (
      (name === "typeOfWarning" && formData.tenant_id) ||
      (name === "tenant_id" && formData.typeOfWarning)
    ) {
      const tenantId = name === "tenant_id" ? value : formData.tenant_id;
      const warningType =
        name === "typeOfWarning" ? value : formData.typeOfWarning;

      checkExistingWarning(tenantId, warningType);
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...error, [name]: "" });
  };

  // التحقق من وجود إنذار سابق للمستأجر
  const checkExistingWarning = (tenantId, warningType) => {
    // تجاهل الإنذار الحالي الذي يتم تعديله
    const existingWarning = warnings.find(
      (warning) =>
        warning.tenant_id === tenantId &&
        warning.typeOfWarning === warningType &&
        warning.id !== id
    );

    if (existingWarning) {
      const tenantName =
        tenants.find((tenant) => tenant.id === tenantId)?.name || "المستأجر";
      setErrors({
        ...error,
        typeOfWarning: `${tenantName} لديه بالفعل ${warningType}. `,
      });
    } else {
      setErrors({ ...error, typeOfWarning: "" });
    }
  };

  // توحيد الفاليديشن بين الإضافة والتعديل (دون ملف خارجي)
  const validateForm = () => {
    let hasErrors = false;
    const newErrors = {};

    // التحقق من اسم المستأجر
    if (!formData.tenant_id) {
      newErrors.tenant_name = "يرجى اختيار اسم المستأجر";
      hasErrors = true;
    }

    // التحقق من نوع الإنذار
    if (!formData.typeOfWarning) {
      newErrors.typeOfWarning = "يرجى اختيار نوع الإنذار";
      hasErrors = true;
    }

    // التحقق من وصف الإنذار (مطلوب وصيغة)
    if (!formData.description) {
      newErrors.description = "يرجى إدخال وصف الإنذار";
      hasErrors = true;
    } else {
      const arabicRegex = /^[\u0600-\u06FF0-9(),، ]*$/;
      if (!arabicRegex.test(formData.description)) {
        newErrors.description =
          "يجب أن يحتوي الوصف على أحرف عربية وأرقام والقوسين والفاصلة فقط";
        hasErrors = true;
      }
    }

    // التحقق من تكرار الإنذار والتسلسل
    if (formData.tenant_id && formData.typeOfWarning) {
      let errorMsg = "";
      // تجاهل الإنذار الحالي الذي يتم تعديله
      const existingWarning = warnings.find(
        (warning) =>
          warning.tenant_id === formData.tenant_id &&
          warning.typeOfWarning === formData.typeOfWarning &&
          warning.id !== id
      );
      if (existingWarning) {
        const tenantName =
          tenants.find((tenant) => tenant.id === formData.tenant_id)?.name ||
          "المستأجر";
        errorMsg = `${tenantName} لديه بالفعل ${formData.typeOfWarning}`;
      } else {
        // تحقق من التسلسل
        if (formData.typeOfWarning === "إنذار ثاني") {
          const hasFirst = warnings.some(
            (warning) =>
              warning.tenant_id === formData.tenant_id &&
              warning.typeOfWarning === "إنذار أول" &&
              warning.id !== id
          );
          if (!hasFirst) {
            errorMsg = "لا يمكن إنذار ثاني قبل إنذار أول للمستأجر.";
          }
        } else if (formData.typeOfWarning === "إنذار نهائي") {
          const hasSecond = warnings.some(
            (warning) =>
              warning.tenant_id === formData.tenant_id &&
              warning.typeOfWarning === "إنذار ثاني" &&
              warning.id !== id
          );
          if (!hasSecond) {
            errorMsg = "لا يمكن إنذار نهائي قبل إنذار ثاني للمستأجر.";
          }
        }
      }
      if (errorMsg) {
        newErrors.typeOfWarning = errorMsg;
        hasErrors = true;
      }
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
      const response = await fetch(`http://localhost:3001/TenantWaring/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/management/Tenants/TenantWaringDisplaySearch");
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

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إنذارات المستأجرين" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div></div>
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Tenants/TenantWaringReport"
              />
              <Mainbutton
                text="بحث"
                path="/management/Tenants/TenantWaringDisplaySearch"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Tenants/TenantWaringAdd"
              />
            </div>
          </div>
          <form className="divforconten" onSubmit={handleSubmit}>
            <Managementdata dataname="تعديل بيانات الإنذار" />
            <div
              className="RowForInsertinputs"
              style={{
                marginBottom: 25,
              }}
            >
              <InputDate
                value={formData.date}
                name="date"
                change={handleChange}
                text="تاريخ"
              />
              <div className="widthbetween"></div>
              <div className="input-container">
                <SelectWithLabel3
                  value={formData.typeOfWarning}
                  name="typeOfWarning"
                  change={handleChange}
                  value1="إنذار أول"
                  value2="إنذار ثاني"
                  value3="إنذار نهائي"
                  text="نوع الإنذار"
                />
                {
                  // @ts-ignore
                  error.typeOfWarning && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.typeOfWarning
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <SearchableSelect
                  name="tenant_id"
                  text="اسم المستأجر"
                  options={tenants.map((tenant) => ({
                    value: tenant.id,
                    label: tenant.name,
                  }))}
                  value={formData.tenant_id}
                  change={handleChange}
                />
                {
                  // @ts-ignore
                  error.tenant_name && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.tenant_name
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div className="RowForInsertinputs">
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.description}
                  name="description"
                  change={handleChange}
                  text="وصف الإنذار"
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
            <div className="RowForInsertinputs"></div>
            <div className="RowForInsertinputs"></div>
            <div className="RowForInsertinputs"></div>
            <div className="RowForInsertinputs"></div>
            <div className="RowForInsertinputs"></div>
            <div className="RowForInsertinputs">
              <ButtonInput text="حفظ التعديلات" onClick={handleSubmit} />
            </div>
          </form>
        </div>
      </div>
      <ToastContainer rtl={true} />
    </div>
  );
}
