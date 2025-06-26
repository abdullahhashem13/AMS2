import { useState, useEffect } from "react";
import Bigbutton from "../../../components/Bigbutton";
import CardForTypesOfManagement from "../../../components/CardForTypesOfManagement";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import Submitinput from "../../../components/submitinput";
// @ts-ignore
import Swal from "sweetalert2";

export default function TypesProperty() {
  const [formData, setFormData] = useState({
    property_type: "",
  });
  const [error, setErrors] = useState({});
  const [existingTypes, setExistingTypes] = useState([]);
  const [showDuplicateError, setShowDuplicateError] = useState(false);

  // جلب أنواع الأعيان الموجودة عند تحميل الصفحة
  useEffect(() => {
    const fetchExistingTypes = async () => {
      try {
        const response = await fetch("http://localhost:3001/TypeOfProperty");
        if (response.ok) {
          const data = await response.json();
          setExistingTypes(data);
          console.log("Property types loaded:", data);
        }
      } catch (err) {
        console.error("Error fetching property types:", err);
      }
    };
    fetchExistingTypes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
    setShowDuplicateError(false);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.property_type.trim()) {
      newErrors.property_type = "يرجى إدخال نوع العين";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.property_type)) {
      newErrors.property_type = "يجب أن يحتوي نوع العين على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من وجود نوع مكرر
    const isDuplicate = existingTypes.some(
      (type) =>
        type.property_type.toLowerCase() ===
        formData.property_type.toLowerCase()
    );

    if (isDuplicate) {
      setShowDuplicateError(true);
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/TypeOfProperty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // إضافة النوع الجديد إلى القائمة المحلية
        const newType = await response.json();
        setExistingTypes([...existingTypes, newType]);
        // إعادة تعيين النموذج
        setFormData({ property_type: "" });
        console.log("تمت الإضافة بنجاح!");
      } else {
        const data = await response.json();

        if (data && data.message) {
          if (typeof data.message === "object") {
            setErrors({ ...error, ...data.message });
          } else if (typeof data.message === "string") {
            setErrors({ ...error, general: data.message });
          } else {
            setErrors({ ...error, general: "فشلت عملية الإضافة." });
          }
        } else {
          setErrors({ ...error, general: "فشلت عملية الإضافة." });
        }
      }
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ." });
      console.error(err);
    }
  };

  // دالة لحذف نوع العين
  const handleDeleteType = async (typeId) => {
    // تأكيد الحذف باستخدام SweetAlert2
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا الإجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، قم بالحذف!",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3001/TypeOfProperty/${typeId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // تحديث القائمة المحلية بعد الحذف
          setExistingTypes(existingTypes.filter((type) => type.id !== typeId));
          Swal.fire("تم الحذف!", "تم حذف نوع العين بنجاح.", "success");
        } else {
          Swal.fire("خطأ!", "فشل في حذف نوع العين.", "error");
        }
      } catch (error) {
        console.error("Error deleting property type:", error);
        Swal.fire("خطأ!", "حدث خطأ أثناء حذف نوع العين.", "error");
      }
    }
  };

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة الأعيان" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div>
              <Bigbutton
                text="أنواع الأعيان"
                path="/management/Properties/TypesProperty"
              />
            </div>
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Properties/ReportProperty"
              />
              <Mainbutton
                text="بحث"
                path="/management/Properties/DisplaySearchProperty"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Properties/AddProperty"
              />
            </div>
          </div>
          <div className="divforconten">
            <Managementdata dataname="أنواع الأعيان" />
            <div className="RowForInsertinputs2">
              <form onSubmit={handleSubmit} className="displayflexjust">
                <Submitinput text="إضافة" />
                <div className="input-container">
                  <Inputwithlabel
                    name="property_type"
                    text="نوع العين"
                    value={formData.property_type}
                    change={handleChange}
                  />
                  {// @ts-ignore
                  error.property_type && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.property_type
                      }
                    </div>
                  )}
                  {showDuplicateError && (
                    <div className="error-message">هذا النوع موجود بالفعل</div>
                  )}
                </div>
              </form>
            </div>
            <div className="RowForInsertinputs2">
              <div className="deviderwithword">
                <hr className="st_hr2managment"></hr>
                <h2
                  style={{
                    width: "14%",
                  }}
                >
                  جميع الأنواع
                </h2>
                <hr className="st_hr1managment"></hr>
              </div>
            </div>
            <div className="RowForInsertinputs3">
              {existingTypes.length > 0 ? (
                existingTypes.map((type) => (
                  <CardForTypesOfManagement
                    key={type.id}
                    text={type.property_type}
                    onDelete={() => handleDeleteType(type.id)}
                  />
                ))
              ) : (
                <p>لا توجد أنواع أعيان مسجلة</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
