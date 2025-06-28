import { useState, useEffect } from "react";
// @ts-ignore
import { useNavigate } from "react-router-dom";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import SearchableSelect from "../../../components/SearchableSelect";
// @ts-ignore
import "../../../style/searchableSelect.css"; // إضافة ملف CSS للتنسيق

export default function AddQuranCenter() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    mosque_id: "", // تغيير من mosque_name إلى mosque_id
    managerName: "",
    managerIdNumber: "",
    managerPhone: "",
    governorate: "",
    city: "",
    neighborhood: "",
  });
  const [error, setErrors] = useState({});
  const [existingCenters, setExistingCenters] = useState([]);
  const [showDuplicateError, setShowDuplicateError] = useState(false);
  const [mosques, setMosques] = useState([]); // إضافة حالة للمساجد

  // جلب مراكز القرآن الموجودة للتحقق من التكرار والمساجد
  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب مراكز القرآن
        const centersResponse = await fetch("http://localhost:3001/Gauidnces");
        if (centersResponse.ok) {
          const centersData = await centersResponse.json();
          setExistingCenters(centersData);
        }

        // جلب المساجد
        const mosquesResponse = await fetch("http://localhost:3001/Mosques");
        if (mosquesResponse.ok) {
          const mosquesData = await mosquesResponse.json();
          setMosques(mosquesData);
          console.log("Mosques loaded:", mosquesData);
        } else {
          console.error("Failed to fetch mosques:", mosquesResponse.status);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...error, [name]: "" });

    // إزالة خطأ التكرار عند تغيير اسم المركز
    if (name === "name") {
      setShowDuplicateError(false);
    }
  };

  // دالة خاصة للتعامل مع تغيير المسجد من SearchableSelect
  const handleMosqueChange = (e) => {
    // التحقق من شكل البيانات المرسلة من SearchableSelect
    if (e && e.target && e.target.name === "mosque_id") {
      // إذا كان e هو حدث تغيير عادي (من النموذج الأصلي)
      setFormData({ ...formData, [e.target.name]: e.target.value });
      setErrors({ ...error, [e.target.name]: "" });
    } else if (e && e.value) {
      // إذا كان e هو كائن يحتوي على value (من react-select)
      setFormData({ ...formData, mosque_id: e.value });
      setErrors({ ...error, mosque_id: "" });
    } else {
      // إذا كان e فارغًا أو غير معرّف
      setFormData({ ...formData, mosque_id: "" });
    }
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    // التحقق من اختيار المسجد
    if (!formData.mosque_id) {
      errors.mosque_id = "يجب اختيار المسجد";
      isValid = false;
    }

    // التحقق من اسم المركز (أحرف عربية فقط)
    if (!formData.name) {
      errors.name = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.name)) {
      errors.name = "يجب أن يحتوي اسم المركز على أحرف عربية فقط";
      isValid = false;
    } else {
      // التحقق من تكرار اسم المركز
      const isDuplicate = existingCenters.some(
        (center) => center.name === formData.name
      );
      if (isDuplicate) {
        setShowDuplicateError(true);
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

    // التحقق من اسم المدير (أحرف عربية فقط واسم رباعي)
    if (!formData.managerName) {
      errors.managerName = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.managerName)) {
      errors.managerName = "يجب أن يحتوي اسم المدير على أحرف عربية فقط";
      isValid = false;
    } else {
      // التحقق من أن الاسم يتكون من أربع كلمات على الأقل (اسم رباعي)
      const words = formData.managerName.trim().split(/\s+/);
      if (words.length < 4) {
        errors.managerName = "يجب أن يكون اسم المدير رباعي";
        isValid = false;
      }
    }

    // التحقق من رقم الهوية (أرقام فقط)
    if (!formData.managerIdNumber) {
      errors.managerIdNumber = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.managerIdNumber)) {
      errors.managerIdNumber = "يجب أن يحتوي رقم الهوية على أرقام فقط";
      isValid = false;
    }

    // التحقق من رقم الهاتف (9 أرقام ويبدأ بـ 7)
    if (!formData.managerPhone) {
      errors.managerPhone = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.managerPhone)) {
      errors.managerPhone = "يجب أن يحتوي رقم الهاتف على أرقام فقط";
      isValid = false;
    } else if (formData.managerPhone.length !== 9) {
      errors.managerPhone = "يجب أن يتكون رقم الهاتف من 9 أرقام";
      isValid = false;
    } else if (!formData.managerPhone.startsWith("7")) {
      errors.managerPhone = "يجب أن يبدأ رقم الهاتف بالرقم 7";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من صحة النموذج قبل الإرسال
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/Gauidnces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("successful!");
        // يمكن إضافة توجيه إلى صفحة أخرى أو إعادة تعيين النموذج هنا
        setFormData({
          name: "",
          mosque_id: "",
          managerName: "",
          managerIdNumber: "",
          managerPhone: "",
          governorate: "",
          city: "",
          neighborhood: "",
        });
        navigate("/management/Gauidnces/DisplaySearchQuranCenter");
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
        <Managmenttitle title="إدارة الارشاد" />
        {/*  */}
        {/* يحمل ما تحت العنوان */}
        <div className="subhomepage">
          {/* يحمل البوتنس */}
          <div className="divforbuttons">
            {/* تم تقسيمهن الى دفيين عشان كل دف يكون في الطرف */}
            <div>
              {/* <Bigbutton
                text="أنواع الموظفين"
                path="/management/Employee/TypesOfEmployee"
              /> */}
            </div>
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Gauidnces/ReportQuranCenter"
              />
              <Mainbutton
                text="بحث"
                path="/management/Gauidnces/DisplaySearchQuranCenter"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Gauidnces/AddQuranCenter"
              />
            </div>
          </div>
          {/*  */}
          {/* يحمل المحتوى تحت البوتنس */}
          <form
            className="divforconten"
            onSubmit={handleSubmit}
            // action="/management/Properties/AddProperty"
          >
            <Managementdata dataname="بيانات المركز" />
            <div className="RowForInsertinputs">
              <div className="input-container">
                <SearchableSelect
                  name="mosque_id"
                  text="تابع لمسجد"
                  options={mosques.map((mosque) => ({
                    value: mosque.id,
                    label: mosque.name,
                  }))}
                  value={formData.mosque_id}
                  change={handleMosqueChange} // Cambiado de onChange a change
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
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.name}
                  name="name"
                  change={handleChange}
                  text="اسم المركز"
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

            {/* عرض رسالة خطأ التكرار */}
            {showDuplicateError && (
              <div className="error-message">
                اسم المركز موجود بالفعل، يرجى اختيار اسم آخر
              </div>
            )}

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
            <div className="RowForInsertinputs">
              <div className="deviderwithword">
                <hr className="st_hr2managment"></hr>
                <h2>المدير</h2>
                <hr className="st_hr1managment"></hr>
              </div>
            </div>
            <div className="RowForInsertinputs">
              <div className="input-container">
                <Inputwithlabel
                  value={formData.managerPhone}
                  name="managerPhone"
                  change={handleChange}
                  text="التلفون"
                />
                {
                  // @ts-ignore
                  error.managerPhone && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.managerPhone
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.managerIdNumber}
                  name="managerIdNumber"
                  change={handleChange}
                  text="رقم الهوية"
                />
                {
                  // @ts-ignore
                  error.managerIdNumber && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.managerIdNumber
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.managerName}
                  name="managerName"
                  change={handleChange}
                  text="الاسم"
                />
                {
                  // @ts-ignore
                  error.managerName && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.managerName
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  marginTop: "20px",
                }}
              >
                <input type="submit" className="submitinput" value="حفظ" />
              </div>
            </div>
          </form>
          {/*  */}
        </div>
      </div>
      {/*  */}
    </div>
  );
}
