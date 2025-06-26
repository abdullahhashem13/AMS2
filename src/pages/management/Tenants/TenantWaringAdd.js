import { useState, useEffect } from "react";
// @ts-ignore
import { useNavigate } from "react-router-dom";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import Submitinput from "../../../components/submitinput";
import InputDate from "../../../components/InputDate";
import SelectWithLabel3 from "../../../components/SelectWithLabel3";
import SearchableSelect from "../../../components/SearchableSelect";
import "../../../style/deblicateError.css"; // استيراد ملف CSS الخاص بنافذة الخطأ

export default function TenantWaringAdd() {
  const [formData, setFormData] = useState({
    tenant_id: "", // إضافة معرّف المستأجر
    typeOfWarning: "",
    date: new Date().toISOString().split("T")[0], // تعيين تاريخ اليوم كقيمة افتراضية
    description: "",
  });
  const [error, setErrors] = useState({});
  const [tenants, setTenants] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const navigate = useNavigate();

  // جلب بيانات المستأجرين والإنذارات عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/JsonData/AllData.json");
        if (response.ok) {
          const data = await response.json();
          // التأكد من أن البيانات تحتوي على مصفوفة المستأجرين
          if (data.Tenants && Array.isArray(data.Tenants)) {
            // فلترة المستأجرين للحصول على الحاليين فقط
            const currentTenants = data.Tenants.filter(
              (tenant) => tenant.type === "حالي"
            );
            setTenants(currentTenants);
          } else {
            console.error("بيانات المستأجرين غير متوفرة أو ليست مصفوفة");
          }

          // حفظ بيانات الإنذارات
          if (data.TenantWaring && Array.isArray(data.TenantWaring)) {
            setWarnings(data.TenantWaring);
          }
        } else {
          console.error("Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

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
    let errorMsg = "";
    const existingWarning = warnings.find(
      (warning) =>
        warning.tenant_id === tenantId && warning.typeOfWarning === warningType
    );
    if (existingWarning) {
      const tenantName =
        tenants.find((tenant) => tenant.id === tenantId)?.name || "المستأجر";
      errorMsg = `${tenantName} لديه بالفعل ${warningType}`;
    } else {
      // تحقق من التسلسل: لا يمكن إضافة الثاني بدون الأول، ولا الثالث بدون الثاني
      if (warningType === "إنذار ثاني") {
        const hasFirst = warnings.some(
          (warning) =>
            warning.tenant_id === tenantId &&
            warning.typeOfWarning === "إنذار أول"
        );
        if (!hasFirst) {
          errorMsg =
            "لا يمكن إضافة إنذار ثاني قبل إضافة إنذار أول لنفس المستأجر.";
        }
      } else if (warningType === "إنذار نهائي") {
        const hasSecond = warnings.some(
          (warning) =>
            warning.tenant_id === tenantId &&
            warning.typeOfWarning === "إنذار ثاني"
        );
        if (!hasSecond) {
          errorMsg =
            "لا يمكن إضافة إنذار نهائي قبل إضافة إنذار ثاني لنفس المستأجر.";
        }
      }
    }
    if (errorMsg) {
      setErrors((prev) => ({ ...prev, typeOfWarning: errorMsg }));
    } else {
      setErrors((prev) => ({ ...prev, typeOfWarning: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من صحة البيانات قبل الإرسال
    let hasErrors = false;
    const newErrors = {};

    if (!formData.tenant_id) {
      newErrors.tenant_name = "يرجى اختيار اسم المستأجر";
      hasErrors = true;
    }

    if (!formData.typeOfWarning) {
      newErrors.typeOfWarning = "يرجى اختيار نوع الإنذار";
      hasErrors = true;
    }

    if (!formData.description) {
      newErrors.description = "يرجى إدخال وصف الإنذار";
      hasErrors = true;
    }

    // التحقق من وجود إنذار سابق أو تسلسل خاطئ
    if (formData.tenant_id && formData.typeOfWarning) {
      let errorMsg = "";
      const existingWarning = warnings.find(
        (warning) =>
          warning.tenant_id === formData.tenant_id &&
          warning.typeOfWarning === formData.typeOfWarning
      );
      if (existingWarning) {
        const tenantName =
          tenants.find((tenant) => tenant.id === formData.tenant_id)?.name ||
          "المستأجر";
        errorMsg = `${tenantName} لديه بالفعل ${formData.typeOfWarning}. لا يمكن إضافة نفس نوع الإنذار مرتين.`;
      } else {
        if (formData.typeOfWarning === "إنذار ثاني") {
          const hasFirst = warnings.some(
            (warning) =>
              warning.tenant_id === formData.tenant_id &&
              warning.typeOfWarning === "إنذار أول"
          );
          if (!hasFirst) {
            errorMsg = "لا يمكن إنذار ثاني قبل إنذار أول للمستأجر.";
          }
        } else if (formData.typeOfWarning === "إنذار نهائي") {
          const hasSecond = warnings.some(
            (warning) =>
              warning.tenant_id === formData.tenant_id &&
              warning.typeOfWarning === "إنذار ثاني"
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

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // إنشاء نسخة من البيانات للإرسال بدون حقول إضافية
    const dataToSend = {
      tenant_id: formData.tenant_id,
      typeOfWarning: formData.typeOfWarning,
      date: formData.date,
      description: formData.description,
    };

    try {
      const response = await fetch("http://localhost:3001/TenantWaring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        console.log("successful!");
        // إعادة تعيين النموذج بعد النجاح مع الاحتفاظ بتاريخ اليوم
        setFormData({
          tenant_id: "",
          typeOfWarning: "",
          date: new Date().toISOString().split("T")[0],
          description: "",
        });
        navigate("/management/Tenants/TenantWaringDisplaySearch");

        // تحديث قائمة الإنذارات
        const newWarning = {
          ...dataToSend,
          id: Math.random().toString(36).substr(2, 4),
        };
        setWarnings([...warnings, newWarning]);
      } else {
        const data = await response.json();

        if (data && data.message) {
          if (typeof data.message === "object") {
            setErrors({ ...error, ...data.message });
          } else if (typeof data.message === "string") {
            setErrors({ ...error, general: data.message });
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
            <Managementdata dataname="بيانات الإنذار" />
            <div className="RowForInsertinputs" style={{ marginBottom: 25 }}>
              <InputDate
                value={formData.date}
                name="date"
                change={handleChange}
                text="تاريخ"
                disabled={true}
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
              <Submitinput text="حفظ" />
              {
                // @ts-ignore
                error.general && (
                  <div className="error-message">
                    {
                      // @ts-ignore
                      error.general
                    }
                  </div>
                )
              }
            </div>
          </form>
        </div>
        {/* إزالة رسالة الخطأ المنبثقة الخاصة بالإنذار المكرر */}
      </div>
    </div>
  );
}
