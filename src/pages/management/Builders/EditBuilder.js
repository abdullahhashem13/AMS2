import { useEffect, useState } from "react";
// @ts-ignore
import { useParams, useNavigate } from "react-router-dom";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Inputwithlabel from "../../../components/Inputwithlabel";
import InputDate from "../../../components/InputDate";
import Submitinput from "../../../components/submitinput";
import Managementdata from "../../../components/managementdata";
// import SearchableSelect from "../../../components/SearchableSelect";
// @ts-ignore
import Swal from "sweetalert2";

export default function EditBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  // تم حذف التكرار الخاطئ لتعريف الحالة
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
  useEffect(() => {
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.Builder) {
          const builder = data.Builder.find((b) => b.id === id);
          if (builder) {
            // حذف حقل الفرع عند جلب البيانات القديمة
            const { branch, ...rest } = builder;
            setForm({ ...rest });
          }
        }
      });
  }, [id]);

  // نفس دالة validateField من صفحة الإضافة
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

  const validate = () => {
    let valid = true;
    Object.entries(form).forEach(([name, value]) => {
      validateField(name, value);
      if (value === "" || errors[name]) valid = false;
    });
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "هل تريد حفظ التعديلات؟",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم، احفظ!",
        cancelButtonText: "إلغاء",
      });
      if (!result.isConfirmed) {
        setLoading(false);
        return;
      }
      // إرسال البيانات بدون الفرع
      await fetch(`http://localhost:3001/Builder/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      Swal.fire("تم الحفظ!", "تم حفظ التعديلات بنجاح.", "success");
      navigate("/management/Builders/DisplaySearchBuilders");
    } catch (err) {
      Swal.fire("خطأ!", "حدث خطأ أثناء حفظ التعديلات.", "error");
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
          <div className="divforbuttons" style={{ justifyContent: "flex-end" }}>
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
            <div className="RowForInsertinputs" style={{ marginBottom: 15 }}>
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
            {/* تم حذف التكرار الزائد لحقلي مكان الإصدار وتاريخ الإصدار */}
            <div className="RowForInsertinputs">
              <div className="deviderwithword">
                <hr className="st_hr2managment" />
                <h2>الموقع</h2>
                <hr className="st_hr1managment" />
              </div>
            </div>
            <div className="RowForInsertinputs" style={{ marginBottom: 15 }}>
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
                text={loading ? "جاري الحفظ..." : "حفظ التعديلات"}
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
