import { useState, useEffect } from "react";
// @ts-ignore
import { useParams, useNavigate } from "react-router-dom";
// @ts-ignore
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// @ts-ignore
import Swal from "sweetalert2";
import Bigbutton from "../../../components/Bigbutton";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import "../../../style/deblicateError.css";
import "../../../style/sucsefulMessage.css";
import ButtonInput from "../../../components/ButtonInput";

export default function EditBranch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    phone: "",
    governorate: "",
    city: "",
    neighborhood: "",
  });
  const [error, setErrors] = useState({});
  const [showDuplicateError, setShowDuplicateError] = useState(false);
  const [existingBranches, setExistingBranches] = useState([]);
  const [originalBranchName, setOriginalBranchName] = useState("");
  // @ts-ignore
  const [, setJsonData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/JsonData/AllData.json");
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }

        const data = await response.json();
        setJsonData(data);

        if (data.Branches && Array.isArray(data.Branches)) {
          const branch = data.Branches.find((branch) => branch.id === id);
          if (branch) {
            setFormData(branch);
            setOriginalBranchName(branch.name);
            setExistingBranches(data.Branches);
          } else {
            throw new Error("لم يتم العثور على الفرع");
          }
        } else {
          throw new Error("بيانات الفروع غير متوفرة");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors({ general: error.message });
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!formData.name) {
      errors.name = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.name)) {
      errors.name = "يجب أن يحتوي اسم الفرع على أحرف عربية فقط";
      isValid = false;
    } else if (formData.name !== originalBranchName) {
      const isDuplicate = existingBranches.some(
        (branch) => branch.name === formData.name && branch.id !== id
      );
      if (isDuplicate) {
        setShowDuplicateError(true);
        isValid = false;
      }
    }

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

    if (!formData.manager) {
      errors.manager = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.manager)) {
      errors.manager = "يجب أن يحتوي اسم المدير على أحرف عربية فقط";
      isValid = false;
    } else {
      const words = formData.manager.trim().split(/\s+/);
      if (words.length < 3) {
        errors.manager = "يجب ان يكون اسمه على اقل ثلاثي";
        isValid = false;
      }
    }

    if (!formData.governorate) {
      errors.governorate = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.governorate)) {
      errors.governorate = "يجب أن تحتوي المحافظة على أحرف عربية فقط";
      isValid = false;
    }

    if (!formData.city) {
      errors.city = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.city)) {
      errors.city = "يجب أن تحتوي المدينة على أحرف عربية فقط";
      isValid = false;
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "هل تريد تحديث بيانات الفرع؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، قم بالتحديث!",
      cancelButtonText: "إلغاء",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/Branches/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/management/Branchs/DisplaySearchBranch");
      } else {
        const data = await response.json();
        setErrors({
          ...error,
          general: data.message || "فشل في تحديث البيانات",
        });
      }
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ أثناء التحديث" });
      console.error(err);
    }
  };

  const closeDuplicateError = () => {
    setShowDuplicateError(false);
  };

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة الفروع" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div></div>
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
          <form className="divforconten" onSubmit={handleSubmit}>
            <Managementdata dataname="تعديل بيانات الفرع" />
            <div className="RowForInsertinputs">
              <div className="input-container">
                <Inputwithlabel
                  value={formData.manager}
                  name="manager"
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

            <div className="RowForInsertinputs">
              <ButtonInput text="حفظ التعديل" onClick={handleSubmit} />
            </div>
          </form>
        </div>
      </div>
      {showDuplicateError && (
        <div className="error-notification">
          <div className="error-content">
            <div className="error-message-title">اسم الفرع مكرر</div>
            <div className="error-message-body">
              اسم الفرع الذي أدخلته موجود بالفعل. يرجى اختيار اسم آخر.
            </div>
            <button className="error-button" onClick={closeDuplicateError}>
              حسناً
            </button>
          </div>
        </div>
      )}
      <ToastContainer rtl={true} />
    </div>
  );
}
