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
import SearchableSelect from "../../../components/SearchableSelect";
// @ts-ignore
import Swal from "sweetalert2";

export default function EditBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

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
          const builder = data.Builder.find((b) => b.id === id);
          if (builder) {
            setForm({ ...builder });
          }
        }
      });
  }, [id]);

  // نفس دالة validateField من صفحة الإضافة
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
            <div className="RowForInsertinputs" style={{ marginBottom: 15 }}>
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
