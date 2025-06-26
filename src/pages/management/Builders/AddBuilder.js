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
import SearchableSelect from "../../../components/SearchableSelect";

export default function AddBuilder() {
  // الحصول على تاريخ اليوم بصيغة yyyy-mm-dd
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    builderMosque_name: "",
    builderMosque_NOIdentity: "",
    builderMosque_phone: "",
    builderMosque_governorate: "",
    builderMosque_city: "",
    builderMosque_neighborhood: "",
    builderMosque_branch: "",
    builderMosque_issuedFrom: "",
    builderMosque_issuedDate: today,
  });
  const [errors, setErrors] = useState({
    builderMosque_name: "",
    builderMosque_NOIdentity: "",
    builderMosque_phone: "",
    builderMosque_governorate: "",
    builderMosque_city: "",
    builderMosque_neighborhood: "",
    builderMosque_branch: "",
    builderMosque_issuedFrom: "",
    builderMosque_issuedDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [branches, setBranches] = useState([]);
  const [, setBuilders] = useState([]); // يمكن حذفه إذا لم يعد مستخدمًا
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.Branches) {
          setBranches(
            data.Branches.map((b) => ({ label: b.name, value: b.id }))
          );
        }
        if (data && data.Builder) {
          setBuilders(data.Builder);
        }
      });
  }, []);

  const validate = () => {
    const errs = {
      builderMosque_name: "",
      builderMosque_NOIdentity: "",
      builderMosque_phone: "",
      builderMosque_governorate: "",
      builderMosque_city: "",
      builderMosque_neighborhood: "",
      builderMosque_branch: "",
      builderMosque_issuedFrom: "",
      builderMosque_issuedDate: "",
    };
    // اسم الباني: غير فارغ، أحرف عربية، رباعي
    if (!form.builderMosque_name.trim()) {
      errs.builderMosque_name = "الاسم مطلوب";
    } else if (!/^[\u0600-\u06FF\s]+$/.test(form.builderMosque_name)) {
      errs.builderMosque_name = "يجب أن يكون الاسم بالأحرف العربية فقط";
    } else if (form.builderMosque_name.trim().split(/\s+/).length < 4) {
      errs.builderMosque_name = "يجب أن يكون الاسم رباعياً";
    }
    // رقم الهوية: غير فارغ، أرقام فقط، غير مكرر (تحقق التكرار لاحقاً)
    if (!form.builderMosque_NOIdentity.trim()) {
      errs.builderMosque_NOIdentity = "رقم الهوية مطلوب";
    } else if (!/^\d+$/.test(form.builderMosque_NOIdentity)) {
      errs.builderMosque_NOIdentity = "رقم الهوية يجب أن يكون أرقام فقط";
    }
    // رقم الهاتف: غير فارغ، أرقام فقط، يبدأ بـ7، 9 أرقام
    if (!form.builderMosque_phone.trim()) {
      errs.builderMosque_phone = "رقم الهاتف مطلوب";
    } else if (!/^7\d{8}$/.test(form.builderMosque_phone)) {
      errs.builderMosque_phone = "رقم الهاتف يجب أن يبدأ بـ7 ويتكون من 9 أرقام";
    }
    // المحافظة، المدينة، الحي: غير فارغ، أحرف عربية فقط
    if (!form.builderMosque_governorate.trim()) {
      errs.builderMosque_governorate = "المحافظة مطلوبة";
    } else if (!/^[\u0600-\u06FF\s]+$/.test(form.builderMosque_governorate)) {
      errs.builderMosque_governorate =
        "المحافظة يجب أن تكون بالأحرف العربية فقط";
    }
    if (!form.builderMosque_city.trim()) {
      errs.builderMosque_city = "المدينة مطلوبة";
    } else if (!/^[\u0600-\u06FF\s]+$/.test(form.builderMosque_city)) {
      errs.builderMosque_city = "المدينة يجب أن تكون بالأحرف العربية فقط";
    }
    if (!form.builderMosque_neighborhood.trim()) {
      errs.builderMosque_neighborhood = "الحي مطلوب";
    } else if (!/^[\u0600-\u06FF\s]+$/.test(form.builderMosque_neighborhood)) {
      errs.builderMosque_neighborhood = "الحي يجب أن يكون بالأحرف العربية فقط";
    }
    // الفرع: غير فارغ
    if (!form.builderMosque_branch.trim()) {
      errs.builderMosque_branch = "الفرع مطلوب";
    }
    // مكان الإصدار: غير فارغ، أحرف عربية فقط
    if (!form.builderMosque_issuedFrom.trim()) {
      errs.builderMosque_issuedFrom = "مكان الإصدار مطلوب";
    } else if (!/^[\u0600-\u06FF\s]+$/.test(form.builderMosque_issuedFrom)) {
      errs.builderMosque_issuedFrom =
        "مكان الإصدار يجب أن يكون بالأحرف العربية فقط";
    }
    // تاريخ الإصدار: غير فارغ
    if (!form.builderMosque_issuedDate.trim()) {
      errs.builderMosque_issuedDate = "تاريخ الإصدار مطلوب";
    }
    setErrors(errs);
    return Object.values(errs).every((v) => !v);
  };

  // دالة فحص حقل واحد فقط
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "builderMosque_name":
        if (!value.trim()) error = "الاسم مطلوب";
        else if (!/^[\u0600-\u06FF\s]+$/.test(value))
          error = "يجب أن يكون الاسم بالأحرف العربية فقط";
        else if (value.trim().split(/\s+/).length < 4)
          error = "يجب أن يكون الاسم رباعياً";
        break;
      case "builderMosque_NOIdentity":
        if (!value.trim()) error = "رقم الهوية مطلوب";
        else if (!/^\d+$/.test(value))
          error = "رقم الهوية يجب أن يكون أرقام فقط";
        break;
      case "builderMosque_phone":
        if (!value.trim()) error = "رقم الهاتف مطلوب";
        else if (!/^7\d{8}$/.test(value))
          error = "رقم الهاتف يجب أن يبدأ بـ7 ويتكون من 9 أرقام";
        break;
      case "builderMosque_governorate":
        if (!value.trim()) error = "المحافظة مطلوبة";
        else if (!/^[\u0600-\u06FF\s]+$/.test(value))
          error = "المحافظة يجب أن تكون بالأحرف العربية فقط";
        break;
      case "builderMosque_city":
        if (!value.trim()) error = "المدينة مطلوبة";
        else if (!/^[\u0600-\u06FF\s]+$/.test(value))
          error = "المدينة يجب أن تكون بالأحرف العربية فقط";
        break;
      case "builderMosque_neighborhood":
        if (!value.trim()) error = "الحي مطلوب";
        else if (!/^[\u0600-\u06FF\s]+$/.test(value))
          error = "الحي يجب أن يكون بالأحرف العربية فقط";
        break;
      case "builderMosque_branch":
        if (!value.trim()) error = "الفرع مطلوب";
        break;
      case "builderMosque_issuedFrom":
        if (!value.trim()) error = "مكان الإصدار مطلوب";
        else if (!/^[\u0600-\u06FF\s]+$/.test(value))
          error = "مكان الإصدار يجب أن يكون بالأحرف العربية فقط";
        break;
      case "builderMosque_issuedDate":
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
    setErrors((prev) => ({ ...prev, builderMosque_NOIdentity: "" }));
    if (hasValidationError) return;
    setLoading(true);
    try {
      // جلب البنائين من AllData.json مباشرة قبل التحقق
      const res = await fetch("/JsonData/AllData.json");
      const data = await res.json();
      const buildersList = data && data.Builder ? data.Builder : [];
      const isDuplicate = buildersList.some(
        (b) => b.builderMosque_NOIdentity === form.builderMosque_NOIdentity
      );
      if (isDuplicate) {
        setErrors((prev) => ({
          ...prev,
          builderMosque_NOIdentity: "رقم الهوية مستخدم مسبقًا",
        }));
        setLoading(false);
        return;
      }
      // إرسال id الفرع فقط
      const formToSend = {
        ...form,
        builderMosque_branch: form.builderMosque_branch,
      };
      await fetch("http://localhost:3001/Builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formToSend),
      });
      setForm({
        builderMosque_name: "",
        builderMosque_NOIdentity: "",
        builderMosque_phone: "",
        builderMosque_governorate: "",
        builderMosque_city: "",
        builderMosque_neighborhood: "",
        builderMosque_branch: "",
        builderMosque_issuedFrom: "",
        builderMosque_issuedDate: today,
      });
      setErrors({
        builderMosque_name: "",
        builderMosque_NOIdentity: "",
        builderMosque_phone: "",
        builderMosque_governorate: "",
        builderMosque_city: "",
        builderMosque_neighborhood: "",
        builderMosque_branch: "",
        builderMosque_issuedFrom: "",
        builderMosque_issuedDate: "",
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
                  name="builderMosque_phone"
                  value={form.builderMosque_phone}
                  change={handleChange}
                  text="رقم الهاتف"
                />
                {errors.builderMosque_phone && (
                  <div className="error-message">
                    {errors.builderMosque_phone}
                  </div>
                )}
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  name="builderMosque_NOIdentity"
                  value={form.builderMosque_NOIdentity}
                  change={handleChange}
                  text="رقم الهوية"
                />
                {errors.builderMosque_NOIdentity && (
                  <div className="error-message">
                    {errors.builderMosque_NOIdentity}
                  </div>
                )}
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  name="builderMosque_name"
                  value={form.builderMosque_name}
                  change={handleChange}
                  text="اسم الباني"
                />
                {errors.builderMosque_name && (
                  <div className="error-message">
                    {errors.builderMosque_name}
                  </div>
                )}
              </div>
            </div>
            <div className="RowForInsertinputs">
              <div style={{ flex: 1 }}></div>
              <div className="input-container">
                <SearchableSelect
                  name="builderMosque_branch"
                  value={form.builderMosque_branch}
                  change={handleChange}
                  options={branches}
                  placeholder="اختر الفرع"
                  label="الفرع"
                />
                {errors.builderMosque_branch && (
                  <div className="error-message">
                    {errors.builderMosque_branch}
                  </div>
                )}
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  name="builderMosque_issuedFrom"
                  value={form.builderMosque_issuedFrom}
                  change={handleChange}
                  text="مكان الإصدار"
                />
                {errors.builderMosque_issuedFrom && (
                  <div className="error-message">
                    {errors.builderMosque_issuedFrom}
                  </div>
                )}
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <InputDate
                  name="builderMosque_issuedDate"
                  value={form.builderMosque_issuedDate}
                  change={handleChange}
                  text="تاريخ الإصدار"
                />
                {errors.builderMosque_issuedDate && (
                  <div className="error-message">
                    {errors.builderMosque_issuedDate}
                  </div>
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
                  name="builderMosque_neighborhood"
                  value={form.builderMosque_neighborhood}
                  change={handleChange}
                  text="الحي"
                />
                {errors.builderMosque_neighborhood && (
                  <div className="error-message">
                    {errors.builderMosque_neighborhood}
                  </div>
                )}
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  name="builderMosque_city"
                  value={form.builderMosque_city}
                  change={handleChange}
                  text="المدينة"
                />
                {errors.builderMosque_city && (
                  <div className="error-message">
                    {errors.builderMosque_city}
                  </div>
                )}
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  name="builderMosque_governorate"
                  value={form.builderMosque_governorate}
                  change={handleChange}
                  text="المحافظة"
                />
                {errors.builderMosque_governorate && (
                  <div className="error-message">
                    {errors.builderMosque_governorate}
                  </div>
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
