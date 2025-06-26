import { useState, useEffect } from "react";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import SelectWithLabel3 from "../../../components/SelectWithLabel3";
import Submitinput from "../../../components/submitinput";
import InputDate from "../../../components/InputDate";
import SearchableSelect from "../../../components/SearchableSelect";
// @ts-ignore
import { useNavigate } from "react-router-dom";
// @ts-ignore
import Swal from "sweetalert2";

export default function EmployeeWaringAdd() {
  const [formData, setFormData] = useState({
    employee_id: "", // معرّف الموظف
    typeOfWarning: "", // نوع الإنذار
    date: new Date().toISOString().split("T")[0], // تعيين تاريخ اليوم كقيمة افتراضية
    description: "", // وصف الإنذار
  });
  const [error, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [showWarningError, setShowWarningError] = useState(false);
  const [warningErrorMessage, setWarningErrorMessage] = useState("");
  const [isClosingWarningError, setIsClosingWarningError] = useState(false);
  const navigate = useNavigate();

  // جلب قائمة الموظفين عند تحميل الصفحة
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:3001/Employees");
        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
        } else {
          console.error("Failed to fetch employees:", response.status);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    // جلب الإنذارات الحالية للتحقق من التكرار
    const fetchWarnings = async () => {
      try {
        const response = await fetch("http://localhost:3001/EmployeeWaring");
        if (response.ok) {
          const data = await response.json();
          setWarnings(data);
        } else {
          console.error("Failed to fetch warnings:", response.status);
        }
      } catch (error) {
        console.error("Error fetching warnings:", error);
      }
    };

    fetchEmployees();
    fetchWarnings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
    setShowWarningError(false);
  };

  const closeWarningError = () => {
    setIsClosingWarningError(true);
    setTimeout(() => {
      setShowWarningError(false);
      setIsClosingWarningError(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من صحة البيانات
    const newErrors = {};

    if (!formData.employee_id) {
      newErrors.employee_id = "يرجى اختيار الموظف";
    }

    if (!formData.typeOfWarning) {
      newErrors.typeOfWarning = "يرجى اختيار نوع الإنذار";
    }

    if (!formData.description) {
      newErrors.description = "يرجى إدخال وصف الإنذار";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // التحقق من وجود إنذار مماثل للموظف نفسه
    const existingWarning = warnings.find(
      (warning) =>
        warning.employee_id === formData.employee_id &&
        warning.typeOfWarning === formData.typeOfWarning
    );

    if (existingWarning) {
      setWarningErrorMessage("هذا الموظف لديه بالفعل إنذار من هذا النوع");
      setShowWarningError(true);
      return;
    }

    try {
      // الحصول على اسم الموظف من القائمة
      const selectedEmployee = employees.find(
        (emp) => emp.id === formData.employee_id
      );
      const employeeName = selectedEmployee
        ? selectedEmployee.employee_name
        : "";

      // إنشاء كائن الإنذار للإرسال
      const warningData = {
        employee_id: formData.employee_id,
        employee_name: employeeName,
        typeOfWarning: formData.typeOfWarning,
        date: formData.date,
        description: formData.description,
        id: Date.now().toString(),
      };

      const response = await fetch("http://localhost:3001/EmployeeWaring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(warningData),
      });

      if (response.ok) {
        // إظهار رسالة نجاح
        Swal.fire({
          title: "تم بنجاح!",
          text: "تم إضافة الإنذار بنجاح",
          icon: "success",
          confirmButtonText: "حسناً",
        }).then((result) => {
          if (result.isConfirmed) {
            // إعادة توجيه المستخدم إلى صفحة البحث بعد الإضافة الناجحة
            navigate("/management/Employee/EmployeeWaringDisplaySearch");
          }
        });
      } else {
        const data = await response.json();

        if (data && data.message) {
          if (typeof data.message === "object") {
            setErrors({ ...error, ...data.message });
          } else if (typeof data.message === "string") {
            setErrors({ ...error, general: data.message });
          } else {
            setErrors({ ...error, general: "فشلت عملية الإضافة." });
          }
        } else {
          setErrors({ ...error, general: "فشلت عملية الإضافة." });
        }
      }
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ غير متوقع." });
      console.error(err);
    }
  };

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إنذارات الموظفين" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div></div>
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Employee/EmployeeWaringReport"
              />
              <Mainbutton
                text="بحث"
                path="/management/Employee/EmployeeWaringDisplaySearch"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Employee/EmployeeWaringAdd"
              />
            </div>
          </div>
          <form className="divforconten" onSubmit={handleSubmit}>
            <Managementdata dataname="بيانات الإنذار" />
            <div className="RowForInsertinputs">
              <div className="input-container">
                <InputDate
                  value={formData.date}
                  name="date"
                  change={handleChange}
                  text="تاريخ"
                  disabled={true} // جعل حقل التاريخ غير قابل للتعديل
                />
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <SelectWithLabel3
                  value={formData.typeOfWarning}
                  name="typeOfWarning"
                  change={handleChange}
                  value1="إنذار أول"
                  value2="إنذار ثاني"
                  value3="إنذار نهائي"
                  text="نوع الإنذار"
                />
                {
                  // @ts-ignore
                  error.typeOfWarning && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.typeOfWarning
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <SearchableSelect
                  name="employee_id"
                  text="اسم الموظف"
                  options={employees.map((employee) => ({
                    value: employee.id,
                    label: employee.employee_name,
                  }))}
                  value={formData.employee_id}
                  change={handleChange}
                />
                {
                  // @ts-ignore
                  error.employee_id && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.employee_id
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div className="RowForInsertinputs">
              <div className="input-container">
                <Inputwithlabel
                  value={formData.description}
                  name="description"
                  change={handleChange}
                  text="وصف الإنذار"
                />
                {
                  // @ts-ignore
                  error.description && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.description
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
            <div className="RowForInsertinputs"></div>

            <div className="RowForInsertinputs">
              <Submitinput text="حفظ" />
            </div>
          </form>
        </div>
      </div>
      {/* رسالة خطأ تكرار الإنذار */}
      {showWarningError && (
        <div
          className={`error-notification ${
            isClosingWarningError ? "closing" : ""
          }`}
        >
          <div
            className={`error-content ${
              isClosingWarningError ? "closing" : ""
            }`}
          >
            <div className="error-message-title">إنذار مكرر</div>
            <div className="error-message-body">{warningErrorMessage}</div>
            <button className="error-button" onClick={closeWarningError}>
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
