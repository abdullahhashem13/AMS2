import { useState, useEffect } from "react";
import Bigbutton from "../../../components/Bigbutton";
import CardForTypesOfManagement from "../../../components/CardForTypesOfManagement";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Submitinput from "../../../components/submitinput";
// @ts-ignore
import Swal from "sweetalert2";

export default function TypesOfEmployee() {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [error, setErrors] = useState({});
  const [existingTypes, setExistingTypes] = useState([]);
  const [showDuplicateError, setShowDuplicateError] = useState(false);

  // جلب أنواع الموظفين الموجودة عند تحميل الصفحة
  useEffect(() => {
    const fetchExistingTypes = async () => {
      try {
        const response = await fetch("http://localhost:3001/TypesOfEmployee");
        if (response.ok) {
          const data = await response.json();
          setExistingTypes(data);
        }
      } catch (err) {
        console.error("Error fetching employee types:", err);
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

    if (!formData.name.trim()) {
      newErrors.name = "يرجى إدخال نوع الموظف";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.name)) {
      newErrors.name = "يجب أن يحتوي نوع الموظف على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من وجود نوع مكرر
    const isDuplicate = existingTypes.some(
      (type) =>
        (type.name || type.employee_type || "").toLowerCase() ===
        formData.name.toLowerCase()
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
      const response = await fetch("http://localhost:3001/TypesOfEmployee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.name }),
      });

      if (response.ok) {
        // إضافة النوع الجديد إلى القائمة المحلية
        setExistingTypes([...existingTypes, { name: formData.name }]);
        // إعادة تعيين النموذج
        setFormData({ name: "" });
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

  // إضافة دالة حذف نوع الموظف
  const handleDeleteType = async (typeId, typeName) => {
    // تأكيد الحذف باستخدام SweetAlert2
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: `هل تريد حذف نوع الموظف "${typeName}"؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3001/TypesOfEmployee/${typeId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // تحديث القائمة المحلية بعد الحذف
          setExistingTypes(existingTypes.filter((type) => type.id !== typeId));
          Swal.fire("تم الحذف!", "تم حذف نوع الموظف بنجاح.", "success");
        } else {
          Swal.fire("خطأ!", "فشل في حذف نوع الموظف.", "error");
        }
      } catch (error) {
        console.error("Error deleting employee type:", error);
        Swal.fire("خطأ!", "حدث خطأ أثناء حذف نوع الموظف.", "error");
      }
    }
  };

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="القائمين بالمساجد" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div>
              <Bigbutton
                text="أنواع الموظفين"
                path="/management/Employee/TypesOfEmployee"
              />
            </div>
            <div className="displayflexjust">
              <Bigbutton
                text="إنذارات الموظفين"
                path="/management/Employee/EmployeeWaringDisplaySearch"
              />
              <Mainbutton
                text="تقرير"
                path="/management/Employee/ReportEmployee"
              />
              <Mainbutton
                text="بحث"
                path="/management/Employee/DisplaySearchEmployee"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Employee/AddEmployee"
              />
            </div>
          </div>
          <div className="divforconten">
            <Managementdata dataname="أنواع الموظفين" />
            <div className="RowForInsertinputs2">
              <form onSubmit={handleSubmit} className="displayflexjust">
                <Submitinput text="إضافة" />
                <div>
                  <Inputwithlabel
                    name="name"
                    text="نوع الموظف"
                    value={formData.name}
                    change={handleChange}
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
              {existingTypes.map((type, index) => (
                <CardForTypesOfManagement
                  key={type.id || index}
                  text={type.name || type.employee_type}
                  onDelete={() =>
                    handleDeleteType(type.id, type.name || type.employee_type)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
