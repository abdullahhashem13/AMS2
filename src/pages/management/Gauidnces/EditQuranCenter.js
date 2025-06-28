import { useState, useEffect } from "react";
// @ts-ignore
import { useNavigate, useParams } from "react-router-dom";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import SearchableSelect from "../../../components/SearchableSelect";
// @ts-ignore
import Swal from "sweetalert2";
// @ts-ignore
import "../../../style/searchableSelect.css";

export default function EditQuranCenter() {
  const navigate = useNavigate();
  const { id } = useParams(); // استخراج معرف المركز من الرابط
  const [formData, setFormData] = useState({
    name: "",
    mosque_id: "",
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
  const [mosques, setMosques] = useState([]);
  const [originalCenterName, setOriginalCenterName] = useState("");

  // جلب بيانات المركز والمساجد عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب بيانات المركز المحدد
        const centerResponse = await fetch(
          `http://localhost:3001/Gauidnces/${id}`
        );
        if (centerResponse.ok) {
          const centerData = await centerResponse.json();
          setFormData(centerData);
          setOriginalCenterName(centerData.name);
          console.log("Center data loaded:", centerData);
        } else {
          console.error("Failed to fetch center:", centerResponse.status);
          Swal.fire("خطأ", "لم يتم العثور على بيانات المركز", "error");
        }

        // جلب مراكز القرآن للتحقق من التكرار
        const centersResponse = await fetch("http://localhost:3001/Gauidnces");
        if (centersResponse.ok) {
          const centersData = await centersResponse.json();
          setExistingCenters(centersData.filter((center) => center.id !== id));
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
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...error, [name]: "" });

    // إزالة خطأ التكرار عند تغيير اسم المركز
    if (name === "name") {
      setShowDuplicateError(false);
    }
  };

  const handleMosqueChange = (selectedOption) => {
    setFormData({ ...formData, mosque_id: selectedOption.value });
    setErrors({ ...error, mosque_id: "" });
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    // التحقق من اسم المركز
    if (!formData.name.trim()) {
      errors.name = "اسم المركز مطلوب";
      isValid = false;
    } else if (
      formData.name !== originalCenterName &&
      existingCenters.some((center) => center.name === formData.name)
    ) {
      setShowDuplicateError(true);
      isValid = false;
    }

    // التحقق من المسجد
    if (!formData.mosque_id) {
      errors.mosque_id = "يجب اختيار المسجد";
      isValid = false;
    }

    // التحقق من اسم المدير
    if (!formData.managerName.trim()) {
      errors.managerName = "اسم المدير مطلوب";
      isValid = false;
    }

    // التحقق من رقم الهوية
    if (!formData.managerIdNumber.trim()) {
      errors.managerIdNumber = "رقم الهوية مطلوب";
      isValid = false;
    }

    // التحقق من رقم الهاتف
    if (!formData.managerPhone.trim()) {
      errors.managerPhone = "رقم الهاتف مطلوب";
      isValid = false;
    }

    // التحقق من المحافظة
    if (!formData.governorate.trim()) {
      errors.governorate = "المحافظة مطلوبة";
      isValid = false;
    }

    // التحقق من المدينة
    if (!formData.city.trim()) {
      errors.city = "المدينة مطلوبة";
      isValid = false;
    }

    // التحقق من الحي
    if (!formData.neighborhood.trim()) {
      errors.neighborhood = "الحي مطلوب";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من صحة البيانات
    if (!validateForm()) {
      return;
    }

    // تأكيد التعديل
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "هل تريد تحديث بيانات المركز؟",
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
      const response = await fetch(`http://localhost:3001/Gauidnces/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire("تم التحديث!", "تم تحديث بيانات المركز بنجاح.", "success");
        navigate("/management/Gauidnces/DisplaySearchQuranCenter");
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
            <Managementdata dataname="تعديل بيانات المركز" />
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
                <input
                  type="submit"
                  className="submitinput"
                  value="حفظ التعديلات"
                />
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
