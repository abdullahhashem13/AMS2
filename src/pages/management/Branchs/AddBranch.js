import { useState, useEffect } from "react";
// @ts-ignore
import { useNavigate } from "react-router-dom";
import Bigbutton from "../../../components/Bigbutton";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
// @ts-ignore
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Submitinput from "../../../components/submitinput";
import "../../../style/deblicateError.css";
import "../../../style/sucsefulMessage.css"; // استيراد ملف CSS الخاص برسالة النجاح
import Managementdata from "../../../components/managementdata";
export default function AddBranch() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    manger: "",
    phone: "",
    governorate: "",
    city: "",
    neighborhood: "",
  });
  const [error, setErrors] = useState({});
  const [existingBranches, setExistingBranches] = useState([]);

  // جلب بيانات الفروع الموجودة عند تحميل الصفحة
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("http://awgaff1.runasp.net/api/Branch");
        if (response.ok) {
          const data = await response.json();
          if (data && data.Branches) {
            setExistingBranches(data.Branches);
          }
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    // التحقق من اسم الفرع (أحرف عربية فقط)
    if (!formData.name) {
      errors.name = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.name)) {
      errors.name = "يجب أن يحتوي اسم الفرع على أحرف عربية فقط";
      isValid = false;
    } else {
      // التحقق من تكرار اسم الفرع
      const isDuplicate = existingBranches.some(
        (branch) => branch.name === formData.name
      );
      if (isDuplicate) {
        errors.name = "اسم الفرع مكرر، يرجى اختيار اسم آخر";
        isValid = false;
      }
    }

    // التحقق من رقم الهاتف (6 أرقام أو 9 أرقام ويبدأ بـ 7)
    if (!formData.phone) {
      errors.phone = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.phone)) {
      errors.phone = "يجب أن يحتوي رقم الهاتف على أرقام فقط";
      isValid = false;
    } else if (formData.phone.length !== 6 && formData.phone.length !== 9) {
      errors.phone = "يجب أن يتكون رقم الهاتف من 6 أو 9 أرقام";
      isValid = false;
    } else if (formData.phone.length === 9 && !formData.phone.startsWith("7")) {
      errors.phone = "يجب أن يبدأ رقم الهاتف المكون من 9 أرقام بالرقم 7";
      isValid = false;
    }

    // التحقق من اسم المدير (أحرف عربية فقط واسم ثلاثي على الأقل)
    if (!formData.manger) {
      errors.manger = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.manger)) {
      errors.manger = "يجب أن يحتوي اسم المدير على أحرف عربية فقط";
      isValid = false;
    } else {
      // التحقق من أن الاسم يتكون من ثلاث كلمات على الأقل (اسم ثلاثي)
      const words = formData.manger.trim().split(/\s+/);
      if (words.length < 3) {
        errors.manger = "يجب ان يكون اسمه على اقل ثلاثي";
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

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://awgaff1.runasp.net/api/Branch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // إعادة تعيين النموذج بعد النجاح
        setFormData({
          name: "",
          manger: "",
          phone: "",
          governorate: "",
          city: "",
          neighborhood: "",
        });
        // الانتقال إلى صفحة عرض الفروع
        navigate("/management/Branchs/DisplaySearchBranch");
        // إضافة الفرع الجديد إلى القائمة المحلية
        setExistingBranches([...existingBranches, formData]);
      } else {
        const data = await response.json();
        if (data && data.message) {
          if (typeof data.message === "object") {
            setErrors({ ...error, ...data.message });
          } else if (typeof data.message === "string") {
            setErrors({ ...error, general: data.message });
          } else {
            setErrors({ ...error, general: "فشل في التسجيل" });
          }
        } else {
          setErrors({ ...error, general: "فشل في التسجيل" });
        }
      }
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ أثناء التسجيل" });
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
        <Managmenttitle title="إدارة الفروع" />
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
                text="جميع الفروع"
                path="/management/Branchs/AllBranch"
              />
              <Mainbutton
                text="بحث"
                path="/management/Branchs/DisplaySearchBranch"
              />
              <Mainbutton text="إضافة" path="/management/Branchs/AddBranch" />
            </div>
          </div>
          {/*  */}
          {/* يحمل المحتوى تحت البوتنس */}
          <form className="divforconten" onSubmit={handleSubmit}>
            <Managementdata dataname="بيانات الفرع" />
            <div className="RowForInsertinputs">
              <div className="input-container">
                <Inputwithlabel
                  value={formData.manger}
                  name="manger"
                  change={handleChange}
                  text="المدير"
                />
                {
                  // @ts-ignore
                  error.manager && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.manager
                      }
                    </div>
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
                  text="اسم الفرع"
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
            <div className="RowForInsertinputs"></div>

            <div className="RowForInsertinputs">
              <Submitinput text="حفظ" />
            </div>
          </form>
          {/*  */}
        </div>
      </div>
      {/* نافذة خطأ تكرار اسم الفرع */}
      {/* تم إظهار رسالة التكرار تحت الحقل مباشرة */}
    </div>
  );
}
