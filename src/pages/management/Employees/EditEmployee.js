import React, { useState, useEffect } from "react";
// @ts-ignore
import { useParams, useNavigate } from "react-router-dom";
// @ts-ignore
import Swal from "sweetalert2";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import Submitinput from "../../../components/submitinput";
import InputDate from "../../../components/InputDate";
import Bigbutton from "../../../components/Bigbutton";
import SelectWithLabel from "../../../components/SelectWithLabel";
import SelectWithLabel3 from "../../../components/SelectWithLabel3";
import SearchableSelect from "../../../components/SearchableSelect";
import "../../../style/Inputwithlabel.css";
import "../../../style/deblicateError.css";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee_name: "",
    employee_phone: "",
    employee_abilities: "",
    employee_birthDate: "",
    employee_gender: "",
    employee_workAs: "",
    employee_statue: "",
    employee_salary: "",
    employee_governorate: "",
    employee_city: "",
    employee_neighborhood: "",
    mosque_assignments: [
      {
        id: Date.now(), // معرف فريد للتعيين الافتراضي
        mosque_id: "",
        employee_type_id: "",
      },
    ], // مصفوفة لتخزين تعيينات المساجد مع تعيين افتراضي واحد
  });
  const [error, setErrors] = useState({});
  const [existingEmployees, setExistingEmployees] = useState([]);
  const [showDuplicateError, setShowDuplicateError] = useState(false);
  const [isClosingDuplicateError, setIsClosingDuplicateError] = useState(false);
  const [mosques, setMosques] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);
  // @ts-ignore
  const [, setOriginalEmployeeName] = useState("");

  // جلب بيانات الموظف المحدد والبيانات الأخرى عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب بيانات الموظف المحدد
        const employeeResponse = await fetch(
          `http://localhost:3001/Employees/${id}`
        );
        if (employeeResponse.ok) {
          const employeeData = await employeeResponse.json();
          setFormData(employeeData);
          setOriginalEmployeeName(employeeData.employee_name);
          console.log("Employee data loaded:", employeeData);
        } else {
          console.error("Failed to fetch employee:", employeeResponse.status);
          Swal.fire("خطأ", "لم يتم العثور على بيانات الموظف", "error");
        }

        // جلب قائمة الموظفين للتحقق من عدم تكرار الأسماء
        const employeesResponse = await fetch(
          "http://localhost:3001/Employees"
        );
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          setExistingEmployees(
            employeesData.filter((employee) => employee.id !== id)
          );
        } else {
          console.error("Failed to fetch employees:", employeesResponse.status);
        }

        // جلب بيانات المساجد
        const mosquesResponse = await fetch("http://localhost:3001/Mosques");
        if (mosquesResponse.ok) {
          const mosquesData = await mosquesResponse.json();
          setMosques(mosquesData);
        } else {
          console.error("Failed to fetch mosques:", mosquesResponse.status);
        }

        // جلب أنواع الموظفين
        const typesResponse = await fetch(
          "http://localhost:3001/TypesOfEmployee"
        );
        if (typesResponse.ok) {
          const typesData = await typesResponse.json();
          setEmployeeTypes(typesData);
        } else {
          console.error(
            "Failed to fetch employee types:",
            typesResponse.status
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        Swal.fire("خطأ", "حدث خطأ أثناء جلب البيانات", "error");
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
    setShowDuplicateError(false);
  };

  // إضافة دوال إدارة التعيينات
  const addAssignment = () => {
    const newAssignment = {
      id: Date.now(), // معرف فريد للتعيين
      mosque_id: "",
      employee_type_id: "",
    };
    setFormData({
      ...formData,
      mosque_assignments: [...formData.mosque_assignments, newAssignment],
    });
  };

  // حذف تعيين
  const removeAssignment = (id) => {
    // التأكد من عدم حذف التعيين الأخير
    if (formData.mosque_assignments.length <= 1) {
      setErrors({
        ...error,
        mosque_assignments: "يجب أن يكون هناك تعيين واحد على الأقل",
      });
      return;
    }

    setFormData({
      ...formData,
      mosque_assignments: formData.mosque_assignments.filter(
        (assignment) => assignment.id !== id
      ),
    });
  };

  // تحديث بيانات التعيين
  const handleAssignmentChange = (id, field, value) => {
    setFormData({
      ...formData,
      mosque_assignments: formData.mosque_assignments.map((assignment) =>
        assignment.id === id ? { ...assignment, [field]: value } : assignment
      ),
    });
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    // التحقق من اسم الموظف (أحرف عربية فقط واسم رباعي)
    if (!formData.employee_name) {
      errors.employee_name = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.employee_name)) {
      errors.employee_name = "يجب أن يحتوي اسم الموظف على أحرف عربية فقط";
      isValid = false;
    } else {
      // التحقق من أن الاسم يتكون من أربع كلمات على الأقل (اسم رباعي)
      const words = formData.employee_name.trim().split(/\s+/);
      if (words.length < 4) {
        errors.employee_name = "يجب أن يكون الاسم رباعي";
        isValid = false;
      } else {
        // التحقق من تكرار اسم الموظف
        const isDuplicate = existingEmployees.some(
          (employee) => employee.employee_name === formData.employee_name
        );
        if (isDuplicate) {
          setShowDuplicateError(true);
          isValid = false;
        }
      }
    }

    // التحقق من رقم الهاتف (9 أرقام ويبدأ بـ 7)
    if (!formData.employee_phone) {
      errors.employee_phone = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.employee_phone)) {
      errors.employee_phone = "يجب أن يحتوي رقم الهاتف على أرقام فقط";
      isValid = false;
    } else if (formData.employee_phone.length !== 9) {
      errors.employee_phone = "يجب أن يتكون رقم الهاتف من 9 أرقام";
      isValid = false;
    } else if (!formData.employee_phone.startsWith("7")) {
      errors.employee_phone = "يجب أن يبدأ رقم الهاتف بالرقم 7";
      isValid = false;
    }

    // التحقق من المؤهل (أحرف عربية فقط)
    if (!formData.employee_abilities) {
      errors.employee_abilities = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.employee_abilities)) {
      errors.employee_abilities = "يجب أن يحتوي المؤهل على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من الراتب (أرقام فقط)
    if (!formData.employee_salary) {
      errors.employee_salary = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.employee_salary)) {
      errors.employee_salary = "يجب أن يحتوي الراتب على أرقام فقط";
      isValid = false;
    }

    // التحقق من تاريخ الميلاد (يجب أن يكون الموظف 18 سنة أو أكثر)
    if (!formData.employee_birthDate) {
      errors.employee_birthDate = "يجب تعبئة الحقل";
      isValid = false;
    } else {
      // حساب العمر
      const birthDate = new Date(formData.employee_birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // تعديل العمر إذا لم يصل بعد إلى شهر ميلاده في السنة الحالية
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        errors.employee_birthDate = "يجب أن يكون عمر الموظف 18 سنة أو أكثر";
        isValid = false;
      }
    }

    // التحقق من الجنس
    if (!formData.employee_gender) {
      errors.employee_gender = "يجب اختيار الجنس";
      isValid = false;
    }

    // التحقق من يعمل كـ
    if (!formData.employee_workAs) {
      errors.employee_workAs = "يجب اختيار نوع العمل";
      isValid = false;
    }

    // التحقق من الحالة
    if (!formData.employee_statue) {
      errors.employee_statue = "يجب اختيار الحالة";
      isValid = false;
    }

    // التحقق من المحافظة (أحرف عربية فقط)
    if (!formData.employee_governorate) {
      errors.employee_governorate = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.employee_governorate)) {
      errors.employee_governorate = "يجب أن تحتوي المحافظة على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من المدينة (أحرف عربية فقط)
    if (!formData.employee_city) {
      errors.employee_city = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.employee_city)) {
      errors.employee_city = "يجب أن تحتوي المدينة على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من الحي (أحرف عربية فقط)
    if (!formData.employee_neighborhood) {
      errors.employee_neighborhood = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.employee_neighborhood)) {
      errors.employee_neighborhood = "يجب أن يحتوي الحي على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من وجود تعيين واحد على الأقل وأنه مكتمل
    if (formData.mosque_assignments.length === 0) {
      errors.mosque_assignments = "يجب إضافة تعيين واحد على الأقل";
      isValid = false;
    } else {
      // التحقق من أن التعيين الأول مكتمل
      const firstAssignment = formData.mosque_assignments[0];
      if (!firstAssignment.mosque_id || !firstAssignment.employee_type_id) {
        errors.mosque_assignments = "يجب تعبئة بيانات التعيين بشكل كامل";
        isValid = false;
      }
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

    try {
      const response = await fetch(`http://localhost:3001/Employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire("تم التحديث!", "تم تحديث بيانات الموظف بنجاح.", "success");
        navigate("/management/Employee/DisplaySearchEmployee");
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
    setIsClosingDuplicateError(true);
    setTimeout(() => {
      setShowDuplicateError(false);
      setIsClosingDuplicateError(false);
    }, 300); // مدة الانيميشن
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
        <Managmenttitle title="إدارة الموظفين" />
        {/*  */}
        {/* يحمل ما تحت العنوان */}
        <div className="subhomepage">
          {/* يحمل البوتنس */}
          <div className="divforbuttons">
            {/* تم تقسيمهن الى دفيين عشان كل دف يكون في الطرف */}
            <div>
              <Bigbutton
                text="أنواع الموظفين"
                path="/management/Employee/TypesOfEmployee"
              />
            </div>
            {}
            <div className="displayflexjust">
              <Bigbutton
                text="إنذارات الموظفين"
                path="/management/Employee/EmployeeWaringDisplaySearch"
              />
              <Mainbutton
                text="تقرير"
                path="/management/Employee/ReportEmployee"
              />
              <Mainbutton
                text="بحث"
                path="/management/Employee/DisplaySearchEmployee"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Employee/AddEmployee"
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
            <Managementdata dataname=" تعديل بيانات الموظف" />
            <div className="RowForInsertinputs">
              <div className="input-container">
                <Inputwithlabel
                  value={formData.employee_abilities}
                  name="employee_abilities"
                  change={handleChange}
                  text="المؤهل"
                />
                {
                  // @ts-ignore
                  error.employee_abilities && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.employee_abilities
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.employee_phone}
                  name="employee_phone"
                  change={handleChange}
                  text="رقم التلفون"
                />
                {
                  // @ts-ignore
                  error.employee_phone && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.employee_phone
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.employee_name}
                  name="employee_name"
                  change={handleChange}
                  text="اسم الموظف"
                />
                {
                  // @ts-ignore
                  error.employee_name && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.employee_name
                      }
                    </div>
                  )
                }
                {showDuplicateError &&
                  !(
                    // @ts-ignore
                    error.employee_name
                  ) && (
                    <div className="error-message">هذا الاسم موجود بالفعل</div>
                  )}
              </div>
            </div>
            <div className="RowForInsertinputs">
              <div className="input-container">
                <Inputwithlabel
                  value={formData.employee_salary}
                  name="employee_salary"
                  change={handleChange}
                  text="الراتب"
                />
                {
                  // @ts-ignore
                  error.employee_salary && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.employee_salary
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <InputDate
                  value={formData.employee_birthDate}
                  name="employee_birthDate"
                  change={handleChange}
                  text="تاريخ الميلاد"
                />
                {
                  // @ts-ignore
                  error.employee_birthDate && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.employee_birthDate
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <SelectWithLabel
                  value={formData.employee_gender}
                  name="employee_gender"
                  change={handleChange}
                  // values
                  value1="ذكر"
                  value2="أنثى"
                  text="الجنس"
                />
                {
                  // @ts-ignore
                  error.employee_gender && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.employee_gender
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div className="RowForInsertinputs">
              <div style={{ width: "100%" }}></div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <SelectWithLabel
                  value={formData.employee_statue}
                  name="employee_statue"
                  change={handleChange}
                  // values
                  value1="فعال"
                  value2="موقف"
                  text="حالة"
                />
                {
                  // @ts-ignore
                  error.employee_statue && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.employee_statue
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <SelectWithLabel3
                  value={formData.employee_workAs}
                  name="employee_workAs"
                  change={handleChange}
                  // values
                  value1="اوقافي"
                  value2="ارشادي"
                  value3="اوقافي وارشادي"
                  text="يعمل كـ"
                />
                {
                  // @ts-ignore
                  error.employee_workAs && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.employee_workAs
                      }
                    </div>
                  )
                }
              </div>
            </div>

            {/* قسم التعيينات في المساجد */}
            <div className="RowForInsertinputs">
              <div className="deviderwithword">
                <hr className="st_hr2managment"></hr>
                <h2>التعيينات</h2>
                <hr className="st_hr1managment"></hr>
              </div>
            </div>

            {formData.mosque_assignments.map((assignment) => (
              <div className="RowForInsertinputs" key={assignment.id}>
                <div className="input-container">
                  <SearchableSelect
                    id={`employee_type_id_${assignment.id}`}
                    name="employee_type_id"
                    text="نوع الموظف"
                    options={
                      employeeTypes && employeeTypes.length > 0
                        ? employeeTypes.map((type) => ({
                            value: type.id,
                            label: type.employee_type,
                          }))
                        : []
                    }
                    value={assignment.employee_type_id}
                    change={(e) =>
                      handleAssignmentChange(
                        assignment.id,
                        "employee_type_id",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <SearchableSelect
                    id={`mosque_id_${assignment.id}`}
                    name="mosque_id"
                    text="تابع لمسجد"
                    options={mosques.map((mosque) => ({
                      value: mosque.id,
                      label: mosque.mosque_name,
                    }))}
                    value={assignment.mosque_id}
                    change={(e) =>
                      handleAssignmentChange(
                        assignment.id,
                        "mosque_id",
                        e.target.value
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAssignment(assignment.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginRight: "10px",
                    display:
                      formData.mosque_assignments.length > 1 ? "block" : "none",
                  }}
                >
                  <span style={{ color: "#f44336", fontSize: "20px" }}>✖</span>{" "}
                  حذف
                </button>
              </div>
            ))}
            {
              // @ts-ignore
              error.mosque_assignments && (
                <div
                  className="error-message"
                  style={{ textAlign: "center", marginTop: "10px" }}
                >
                  {
                    // @ts-ignore
                    error.mosque_assignments
                  }
                </div>
              )
            }

            <div
              className="RowForInsertinputs"
              style={{ justifyContent: "flex-end" }}
            >
              <button
                type="button"
                onClick={addAssignment}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 16px",
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                <span
                  style={{
                    color: "#4caf50",
                    fontSize: "20px",
                    marginLeft: "5px",
                  }}
                >
                  +
                </span>{" "}
                إضافة تعيين جديد
              </button>
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
                  value={formData.employee_neighborhood}
                  name="employee_neighborhood"
                  change={handleChange}
                  text="الحي"
                />
                {
                  // @ts-ignore
                  error.employee_neighborhood && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.employee_neighborhood
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.employee_city}
                  name="employee_city"
                  change={handleChange}
                  text="المدينة"
                />
                {
                  // @ts-ignore
                  error.employee_city && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.employee_city
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.employee_governorate}
                  name="employee_governorate"
                  change={handleChange}
                  text="المحافظة"
                />
                {
                  // @ts-ignore
                  error.employee_governorate && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.employee_governorate
                      }
                    </div>
                  )
                }
              </div>
            </div>

            <div
              className="RowForInsertinputs"
              style={{ justifyContent: "flex-end" }}
            >
              <Submitinput text=" حفظ التعديلات " onClick={handleSubmit} />
            </div>
          </form>
          {/*  */}
        </div>
      </div>
      {/*  */}
      <style>
        {`
        .salary-display {
          font-family: "amiri";
          font-size: 14px;
          color: var(--primary-color);
          margin-top: 5px;
          text-align: center;
        }
        .error-notification {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          opacity: 1;
          transition: opacity 0.3s ease;
        }
        .error-notification.closing {
          opacity: 0;
        }
        .error-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
          max-width: 90%;
          text-align: center;
          transform: scale(1);
          transition: transform 0.3s ease;
        }
        .error-content.closing {
          transform: scale(0.8);
        }
        .error-message-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #f44336;
        }
        .error-message-body {
          margin-bottom: 20px;
        }
        .error-button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
      `}
      </style>
      {showDuplicateError && (
        <div
          className={`error-notification ${
            isClosingDuplicateError ? "closing" : ""
          }`}
        >
          <div
            className={`error-content ${
              isClosingDuplicateError ? "closing" : ""
            }`}
          >
            <div className="error-message-title">اسم الموظف مكرر</div>
            <div className="error-message-body">
              اسم الموظف الذي أدخلته موجود بالفعل. يرجى اختيار اسم آخر.
            </div>
            <button className="error-button" onClick={closeDuplicateError}>
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
