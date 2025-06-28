import { useEffect, useState } from "react";
// @ts-ignore
import { useNavigate } from "react-router-dom";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Inputwithlabel from "../../../components/Inputwithlabel";
import InputDate from "../../../components/InputDate";
import Submitinput from "../../../components/submitinput";
import Managementdata from "../../../components/managementdata";
// import SearchableSelect from "../../../components/SearchableSelect";

export default function AddBuilder() {
  // الحصول على تاريخ اليوم بصيغة yyyy-mm-dd
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    name: "",
    NOIdentity: "",
    phone: "",
    governorate: "",
    city: "",
    neighborhood: "",
    issuedFrom: "",
    issuedDate: today,
  });
  const [errors, setErrors] = useState({
    name: "",
    NOIdentity: "",
    phone: "",
    governorate: "",
    city: "",
    neighborhood: "",
    issuedFrom: "",
    issuedDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  // const [branches, setBranches] = useState([]); // حذف جلب الفروع
  const [, setBuilders] = useState([]); // يمكن حذفه إذا لم يعد مستخدمًا
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.Builder) {
          setBuilders(data.Builder);
        }
      });
  }, []);

  const validate = () => {
    const errs = {
      name: "",
      NOIdentity: "",
      phone: "",
      governorate: "",
      city: "",
      neighborhood: "",
      issuedFrom: "",
      issuedDate: "",
    };
    // اسم الباني: غير فارغ، أحرف عربية، رباعي
    if (!form.name.trim()) {
      errs.name = "الاسم مطلوب";
    } else if (!/^[\u0600-\u06FF\s]+$/.test(form.name)) {
      errs.name = "يجب أن يكون الاسم بالأحرف العربية فقط";
    } else if (form.name.trim().split(/\s+/).length < 4) {
      errs.name = "يجب أن يكون الاسم رباعياً";
    }
    // رقم الهوية: غير فارغ، أرقام فقط، غير مكرر (تحقق التكرار لاحقاً)
    if (!form.NOIdentity.trim()) {
      errs.NOIdentity = "رقم الهوية مطلوب";
    } else if (!/^\d+$/.test(form.NOIdentity)) {
      errs.NOIdentity = "رقم الهوية يجب أن يكون أرقام فقط";
    }
    // رقم الهاتف: غير فارغ، أرقام فقط، يبدأ بـ7، 9 أرقام
    if (!form.phone.trim()) {
      errs.phone = "رقم الهاتف مطلوب";
    } else if (!/^7\d{8}$/.test(form.phone)) {
      errs.phone = "رقم الهاتف يجب أن يبدأ بـ7 ويتكون من 9 أرقام";
    }
    // المحافظة، المدينة، الحي: غير فارغ، أحرف عربية فقط
    if (!form.governorate.trim()) {
      errs.governorate = "المحافظة مطلوبة";
    } else if (!/^[\u0600-\u06FF\s]+$/.test(form.governorate)) {
      errs.governorate = "المحافظة يجب أن تكون بالأحرف العربية فقط";
    }
    if (!form.city.trim()) {
      errs.city = "المدينة مطلوبة";
    } else if (!/^[\u0600-\u06FF\s]+$/.test(form.city)) {
      errs.city = "المدينة يجب أن تكون بالأحرف العربية فقط";
    }
    if (!form.neighborhood.trim()) {
      errs.neighborhood = "الحي مطلوب";
    } else if (!/^[\u0600-\u06FF\s]+$/.test(form.neighborhood)) {
      errs.neighborhood = "الحي يجب أن يكون بالأحرف العربية فقط";
    }
    // ... حذف التحقق من الفرع ...
    // مكان الإصدار: غير فارغ، أحرف عربية فقط
    if (!form.issuedFrom.trim()) {
      errs.issuedFrom = "مكان الإصدار مطلوب";
    } else if (!/^[\u0600-\u06FF\s]+$/.test(form.issuedFrom)) {
      errs.issuedFrom = "مكان الإصدار يجب أن يكون بالأحرف العربية فقط";
    }
    // تاريخ الإصدار: غير فارغ
    if (!form.issuedDate.trim()) {
      errs.issuedDate = "تاريخ الإصدار مطلوب";
    }
    setErrors(errs);
    return Object.values(errs).every((v) => !v);
  };

  // دالة فحص حقل واحد فقط
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "الاسم مطلوب";
        else if (!/^[\u0600-\u06FF\s]+$/.test(value))
          error = "يجب أن يكون الاسم بالأحرف العربية فقط";
        else if (value.trim().split(/\s+/).length < 4)
          error = "يجب أن يكون الاسم رباعياً";
        break;
      case "NOIdentity":
        if (!value.trim()) error = "رقم الهوية مطلوب";
        else if (!/^\d+$/.test(value))
          error = "رقم الهوية يجب أن يكون أرقام فقط";
        break;
      case "phone":
        if (!value.trim()) error = "رقم الهاتف مطلوب";
        else if (!/^7\d{8}$/.test(value))
          error = "رقم الهاتف يجب أن يبدأ بـ7 ويتكون من 9 أرقام";
        break;
      case "governorate":
        if (!value.trim()) error = "المحافظة مطلوبة";
        else if (!/^[\u0600-\u06FF\s]+$/.test(value))
          error = "المحافظة يجب أن تكون بالأحرف العربية فقط";
        break;
      case "city":
        if (!value.trim()) error = "المدينة مطلوبة";
        else if (!/^[\u0600-\u06FF\s]+$/.test(value))
          error = "المدينة يجب أن تكون بالأحرف العربية فقط";
        break;
      case "neighborhood":
        if (!value.trim()) error = "الحي مطلوب";
        else if (!/^[\u0600-\u06FF\s]+$/.test(value))
          error = "الحي يجب أن يكون بالأحرف العربية فقط";
        break;
      // حذف التحقق من الفرع نهائياً
      case "issuedFrom":
        if (!value.trim()) error = "مكان الإصدار مطلوب";
        else if (!/^[\u0600-\u06FF\s]+$/.test(value))
          error = "مكان الإصدار يجب أن يكون بالأحرف العربية فقط";
        break;
      case "issuedDate":
        if (!value.trim()) error = "تاريخ الإصدار مطلوب";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    let name, value;
    if (e && e.label && e.value && e.name) {
      name = e.name;
      value = e.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    let hasValidationError = !validate();
    // إعادة تعيين رسالة الخطأ لرقم الهوية قبل التحقق الجديد
    setErrors((prev) => ({ ...prev, NOIdentity: "" }));
    if (hasValidationError) return;
    setLoading(true);
    try {
      // جلب البنائين من AllData.json مباشرة قبل التحقق
      const res = await fetch("/JsonData/AllData.json");
      const data = await res.json();
      const buildersList = data && data.Builder ? data.Builder : [];
      const isDuplicate = buildersList.some(
        (b) => b.NOIdentity === form.NOIdentity
      );
      if (isDuplicate) {
        setErrors((prev) => ({
          ...prev,
          NOIdentity: "رقم الهوية مستخدم مسبقًا",
        }));
        setLoading(false);
        return;
      }
      // إرسال البيانات بدون الفرع
      await fetch("http://localhost:3001/Builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      setForm({
        name: "",
        NOIdentity: "",
        phone: "",
        governorate: "",
        city: "",
        neighborhood: "",
        issuedFrom: "",
        issuedDate: today,
      });
      setErrors({
        name: "",
        NOIdentity: "",
        phone: "",
        governorate: "",
        city: "",
        neighborhood: "",
        issuedFrom: "",
        issuedDate: "",
      });
      navigate("/management/Builders/DisplaySearchBuilders");
    } catch (err) {
      setServerError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة البنائين" />
        <div className="subhomepage">
          <div
            className="divforbuttons"
            style={{ justifyContent: "flex-end", display: "flex", gap: 0 }}
          >
            <Mainbutton
              text="تقرير"
              path="/management/Builders/ReportBuilders"
            />

            <Mainbutton
              text="بحث"
              path="/management/Builders/DisplaySearchBuilders"
            />
            <Mainbutton text="إضافة" path="/management/Builders/AddBuilder" />
          </div>

          <form onSubmit={handleSubmit} className="divforconten">
            <Managementdata dataname="بيانات الباني" />

            <div
              className="RowForInsertinputs"
              style={{
                marginBottom: 15,
              }}
            >
              <div className="input-container">
                <Inputwithlabel
                  name="phone"
                  value={form.phone}
                  change={handleChange}
                  text="رقم الهاتف"
                />
                {errors.phone && (
                  <div className="error-message">{errors.phone}</div>
                )}
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  name="NOIdentity"
                  value={form.NOIdentity}
                  change={handleChange}
                  text="رقم الهوية"
                />
                {errors.NOIdentity && (
                  <div className="error-message">{errors.NOIdentity}</div>
                )}
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  name="name"
                  value={form.name}
                  change={handleChange}
                  text="اسم الباني"
                />
                {errors.name && (
                  <div className="error-message">{errors.name}</div>
                )}
              </div>
            </div>
            <div className="RowForInsertinputs">
              <div style={{ flex: 1 }}></div>
              <div className="input-container">
                <Inputwithlabel
                  name="issuedFrom"
                  value={form.issuedFrom}
                  change={handleChange}
                  text="مكان الإصدار"
                />
                {errors.issuedFrom && (
                  <div className="error-message">{errors.issuedFrom}</div>
                )}
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <InputDate
                  name="issuedDate"
                  value={form.issuedDate}
                  change={handleChange}
                  text="تاريخ الإصدار"
                />
                {errors.issuedDate && (
                  <div className="error-message">{errors.issuedDate}</div>
                )}
              </div>
            </div>

            <div className="RowForInsertinputs">
              <div className="deviderwithword">
                <hr className="st_hr2managment" />
                <h2>الموقع</h2>
                <hr className="st_hr1managment" />
              </div>
            </div>
            <div
              className="RowForInsertinputs"
              style={{
                marginBottom: 15,
              }}
            >
              <div className="input-container">
                <Inputwithlabel
                  name="neighborhood"
                  value={form.neighborhood}
                  change={handleChange}
                  text="الحي"
                />
                {errors.neighborhood && (
                  <div className="error-message">{errors.neighborhood}</div>
                )}
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  name="city"
                  value={form.city}
                  change={handleChange}
                  text="المدينة"
                />
                {errors.city && (
                  <div className="error-message">{errors.city}</div>
                )}
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  name="governorate"
                  value={form.governorate}
                  change={handleChange}
                  text="المحافظة"
                />
                {errors.governorate && (
                  <div className="error-message">{errors.governorate}</div>
                )}
              </div>
            </div>
            <div className="RowForInsertinputs">
              <Submitinput
                text={loading ? "جاري الحفظ..." : "حفظ"}
                disabled={loading}
              />
            </div>
            {serverError && (
              <div style={{ color: "red", marginTop: 10, textAlign: "right" }}>
                {serverError}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
