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
import Saidbar from "../../../components/saidbar";
import "../../../style/deblicateError.css";
import "../../../style/sucsefulMessage.css";
import ButtonInput from "../../../components/ButtonInput";

export default function EditBranch() {
  const { id } = useParams();
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
  const [showDuplicateError, setShowDuplicateError] = useState(false);
  const [existingBranches, setExistingBranches] = useState([]);
  const [originalBranchName, setOriginalBranchName] = useState("");
  // @ts-ignore
  const [, setJsonData] = useState(null);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب بيانات الفرع من الـ API الخارجي
        const response = await fetch(
          `http://awgaff1.runasp.net/api/Branch/${id}`
        );
        if (!response.ok) {
          throw new Error("فشل في جلب بيانات الفرع من السيرفر");
        }
        let branch = await response.json();
        // معالجة إذا كانت البيانات داخل خاصية Branch أو مباشرة
        if (branch && branch.Branch) {
          branch = branch.Branch;
        }
        // إذا كان هناك خاصية data أو payload أو result بداخل branch، استخرجها
        let branchData = branch;
        if (branch.data) branchData = branch.data;
        if (branch.payload) branchData = branch.payload;
        if (branch.result) branchData = branch.result;
        setFormData({
          name: branchData.name ?? "",
          manger: branchData.manger ?? branchData.manager ?? "",
          phone: branchData.phone ?? "",
          governorate: branchData.governorate ?? "",
          city: branchData.city ?? "",
          neighborhood: branchData.neighborhood ?? "",
        });
        // توحيد منطق تعيين الاسم الأصلي للفرع ليعتمد فقط على branchData.name
        setOriginalBranchName(branchData.name ?? "");

        // جلب جميع الفروع للتحقق من التكرار
        const allBranchesRes = await fetch(
          "http://awgaff1.runasp.net/api/Branch"
        );
        if (allBranchesRes.ok) {
          const allBranchesData = await allBranchesRes.json();
          if (Array.isArray(allBranchesData)) {
            setExistingBranches(allBranchesData);
          } else if (Array.isArray(allBranchesData.Branches)) {
            setExistingBranches(allBranchesData.Branches);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors({ general: error.message });
      } finally {
        setLoading(false);
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
    } else if (!/^\d{9}$/.test(formData.phone)) {
      errors.phone = "يجب أن يتكون رقم الهاتف من 9 أرقام فقط";
      isValid = false;
    }

    if (!formData.manger) {
      errors.manger = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.manger)) {
      errors.manger = "يجب أن يحتوي اسم المدير على أحرف عربية فقط";
      isValid = false;
    } else {
      const words = formData.manger.trim().split(/\s+/);
      if (words.length < 3) {
        errors.manger = "يجب ان يكون اسمه على اقل ثلاثي";
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
      const response = await fetch(
        `http://awgaff1.runasp.net/api/Branch/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

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
          {loading ? (
            <div
              style={{
                textAlign: "center",
                margin: "30px",
                fontWeight: "bold",
              }}
            >
              جاري تحميل بيانات الفرع...
            </div>
          ) : (
            <form className="divforconten" onSubmit={handleSubmit}>
              <Managementdata dataname="تعديل بيانات الفرع" />
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
                    error.manger && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          error.manger
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
          )}
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
