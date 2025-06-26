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
    quranCenter_name: "",
    mosque_id: "", // تغيير من mosque_name إلى mosque_id
    quranCenter_managerName: "",
    quranCenter_managerIdNumber: "",
    quranCenter_managerPhone: "",
    quranCenter_governorate: "",
    quranCenter_city: "",
    quranCenter_neighborhood: "",
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
    if (name === "quranCenter_name") {
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
    if (!formData.quranCenter_name) {
      errors.quranCenter_name = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.quranCenter_name)) {
      errors.quranCenter_name = "يجب أن يحتوي اسم المركز على أحرف عربية فقط";
      isValid = false;
    } else {
      // التحقق من تكرار اسم المركز
      const isDuplicate = existingCenters.some(
        (center) => center.quranCenter_name === formData.quranCenter_name
      );
      if (isDuplicate) {
        setShowDuplicateError(true);
        isValid = false;
      }
    }

    // التحقق من المحافظة (أحرف عربية فقط)
    if (!formData.quranCenter_governorate) {
      errors.quranCenter_governorate = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.quranCenter_governorate)) {
      errors.quranCenter_governorate =
        "يجب أن تحتوي المحافظة على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من المدينة (أحرف عربية فقط)
    if (!formData.quranCenter_city) {
      errors.quranCenter_city = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.quranCenter_city)) {
      errors.quranCenter_city = "يجب أن تحتوي المدينة على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من الحي (أحرف عربية فقط)
    if (!formData.quranCenter_neighborhood) {
      errors.quranCenter_neighborhood = "يجب تعبئة الحقل";
      isValid = false;
    } else if (
      !/^[\u0600-\u06FF\s]+$/.test(formData.quranCenter_neighborhood)
    ) {
      errors.quranCenter_neighborhood = "يجب أن يحتوي الحي على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من اسم المدير (أحرف عربية فقط واسم رباعي)
    if (!formData.quranCenter_managerName) {
      errors.quranCenter_managerName = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.quranCenter_managerName)) {
      errors.quranCenter_managerName =
        "يجب أن يحتوي اسم المدير على أحرف عربية فقط";
      isValid = false;
    } else {
      // التحقق من أن الاسم يتكون من أربع كلمات على الأقل (اسم رباعي)
      const words = formData.quranCenter_managerName.trim().split(/\s+/);
      if (words.length < 4) {
        errors.quranCenter_managerName = "يجب أن يكون اسم المدير رباعي";
        isValid = false;
      }
    }

    // التحقق من رقم الهوية (أرقام فقط)
    if (!formData.quranCenter_managerIdNumber) {
      errors.quranCenter_managerIdNumber = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.quranCenter_managerIdNumber)) {
      errors.quranCenter_managerIdNumber =
        "يجب أن يحتوي رقم الهوية على أرقام فقط";
      isValid = false;
    }

    // التحقق من رقم الهاتف (9 أرقام ويبدأ بـ 7)
    if (!formData.quranCenter_managerPhone) {
      errors.quranCenter_managerPhone = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.quranCenter_managerPhone)) {
      errors.quranCenter_managerPhone = "يجب أن يحتوي رقم الهاتف على أرقام فقط";
      isValid = false;
    } else if (formData.quranCenter_managerPhone.length !== 9) {
      errors.quranCenter_managerPhone = "يجب أن يتكون رقم الهاتف من 9 أرقام";
      isValid = false;
    } else if (!formData.quranCenter_managerPhone.startsWith("7")) {
      errors.quranCenter_managerPhone = "يجب أن يبدأ رقم الهاتف بالرقم 7";
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
          quranCenter_name: "",
          mosque_id: "",
          quranCenter_managerName: "",
          quranCenter_managerIdNumber: "",
          quranCenter_managerPhone: "",
          quranCenter_governorate: "",
          quranCenter_city: "",
          quranCenter_neighborhood: "",
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
                    label: mosque.mosque_name,
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
                  value={formData.quranCenter_name}
                  name="quranCenter_name"
                  change={handleChange}
                  text="اسم المركز"
                />
                {
                  // @ts-ignore
                  error.quranCenter_name && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.quranCenter_name
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
                  value={formData.quranCenter_neighborhood}
                  name="quranCenter_neighborhood"
                  change={handleChange}
                  text="الحي"
                />
                {
                  // @ts-ignore
                  error.quranCenter_neighborhood && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.quranCenter_neighborhood
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.quranCenter_city}
                  name="quranCenter_city"
                  change={handleChange}
                  text="المدينة"
                />
                {
                  // @ts-ignore
                  error.quranCenter_city && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.quranCenter_city
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.quranCenter_governorate}
                  name="quranCenter_governorate"
                  change={handleChange}
                  text="المحافظة"
                />
                {
                  // @ts-ignore
                  error.quranCenter_governorate && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.quranCenter_governorate
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
                  value={formData.quranCenter_managerPhone}
                  name="quranCenter_managerPhone"
                  change={handleChange}
                  text="التلفون"
                />
                {
                  // @ts-ignore
                  error.quranCenter_managerPhone && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.quranCenter_managerPhone
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.quranCenter_managerIdNumber}
                  name="quranCenter_managerIdNumber"
                  change={handleChange}
                  text="رقم الهوية"
                />
                {
                  // @ts-ignore
                  error.quranCenter_managerIdNumber && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.quranCenter_managerIdNumber
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.quranCenter_managerName}
                  name="quranCenter_managerName"
                  change={handleChange}
                  text="الاسم"
                />
                {
                  // @ts-ignore
                  error.quranCenter_managerName && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.quranCenter_managerName
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
