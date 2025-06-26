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

export default function TypesMosque() {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [error, setErrors] = useState({});
  const [existingTypes, setExistingTypes] = useState([]);
  const [showDuplicateError, setShowDuplicateError] = useState(false);

  // جلب أنواع المساجد الموجودة عند تحميل الصفحة
  useEffect(() => {
    const fetchExistingTypes = async () => {
      try {
        const response = await fetch("http://localhost:3001/TypeOfMosque");
        if (response.ok) {
          const data = await response.json();
          setExistingTypes(data);
        }
      } catch (err) {
        console.error("Error fetching mosque types:", err);
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
    let isValid = true;
    let errors = {};

    // التحقق من نوع المسجد (أحرف عربية فقط)
    if (!formData.name) {
      errors.name = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.name)) {
      errors.name = "يجب أن يحتوي نوع المسجد على أحرف عربية فقط";
      isValid = false;
    } else {
      // التحقق من تكرار نوع المسجد
      const isDuplicate = existingTypes.some(
        (type) => type.name === formData.name
      );
      if (isDuplicate) {
        setShowDuplicateError(true);
        isValid = false;
      }
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/TypeOfMosque", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // إضافة النوع الجديد إلى القائمة المحلية
        setExistingTypes([...existingTypes, formData]);
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

  // إضافة دالة حذف نوع المسجد
  const handleDeleteType = async (typeId, typeName) => {
    // تأكيد الحذف باستخدام SweetAlert2
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: `هل تريد حذف نوع المسجد "${typeName}"؟`,
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
          `http://localhost:3001/TypeOfMosque/${typeId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // تحديث القائمة المحلية بعد الحذف
          setExistingTypes(existingTypes.filter((type) => type.id !== typeId));
          Swal.fire("تم الحذف!", "تم حذف نوع المسجد بنجاح.", "success");
        } else {
          Swal.fire("خطأ!", "فشل في حذف نوع المسجد.", "error");
        }
      } catch (error) {
        console.error("Error deleting mosque type:", error);
        Swal.fire("خطأ!", "حدث خطأ أثناء حذف نوع المسجد.", "error");
      }
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
        <Managmenttitle title="إدارة المساجد" />
        {/*  */}
        {/* يحمل ما تحت العنوان */}
        <div className="subhomepage">
          {/* يحمل البوتنس */}
          <div className="divforbuttons">
            {/* تم تقسيمهن الى دفيين عشان كل دف يكون في الطرف */}
            {/* الثاني */}
            <div>
              <Bigbutton
                text="أنواع المساجد"
                path="/management/Mosques/TypesMosque"
              />
            </div>
            {/* الاول */}
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Mosques/ReportMosque"
              />
              <Mainbutton
                text="بحث"
                path="/management/Mosques/DisplaySearchMosque"
              />
              <Mainbutton text="إضافة" path="/management/Mosques/AddMosque" />
            </div>
          </div>
          {/*  */}
          {/* يحمل المحتوى تحت البوتنس */}
          <div className="divforconten">
            <Managementdata dataname="أنواع المساجد" />
            <div className="RowForInsertinputs2">
              <form onSubmit={handleSubmit} className="displayflexjust">
                <Submitinput text="إضافة" />
                <div>
                  <Inputwithlabel
                    name="name"
                    text="نوع المسجد"
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
                  text={type.name}
                  onDelete={() => handleDeleteType(type.id, type.name)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
