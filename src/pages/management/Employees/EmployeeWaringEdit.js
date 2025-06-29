import { useState, useEffect } from "react";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import SelectWithLabel3 from "../../../components/SelectWithLabel3";
import Submitinput from "../../../components/submitinput";
import InputDate from "../../../components/InputDate";
import SearchableSelect from "../../../components/SearchableSelect";
// @ts-ignore
import { useNavigate, useParams } from "react-router-dom";
// @ts-ignore
import Swal from "sweetalert2";

export default function EmployeeWaringEdit() {
  const params = useParams();
  const { id } = params;

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

  // جلب بيانات الإنذار عند تحميل الصفحة
  useEffect(() => {
    const fetchWarningData = async () => {
      try {
        // جلب بيانات الإنذار
        const warningResponse = await fetch(
          `http://localhost:3001/EmployeeWaring/${id}`
        );
        if (warningResponse.ok) {
          const warningData = await warningResponse.json();
          setFormData(warningData);
          console.log("Warning data loaded:", warningData);
        } else {
          console.error("Failed to fetch warning:", warningResponse.status);
          Swal.fire("خطأ", "لم يتم العثور على بيانات الإنذار", "error");
        }

        // جلب قائمة الموظفين
        const employeesResponse = await fetch(
          "http://localhost:3001/Employees"
        );
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          setEmployees(employeesData);
        } else {
          console.error("Failed to fetch employees:", employeesResponse.status);
        }

        // جلب قائمة الإنذارات للتحقق من التكرار
        const warningsResponse = await fetch(
          "http://localhost:3001/EmployeeWaring"
        );
        if (warningsResponse.ok) {
          const warningsData = await warningsResponse.json();
          // استبعاد الإنذار الحالي من قائمة التحقق
          setWarnings(warningsData.filter((warning) => warning.id !== id));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchWarningData();
  }, [id]);

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

  // إضافة دالة validateForm
  const validateForm = () => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // التحقق من وجود إنذار مماثل للموظف نفسه (باستثناء الإنذار الحالي)
    let newErrorsObj = { ...error };
    if (typeof newErrorsObj !== "object" || newErrorsObj === null)
      newErrorsObj = {};
    // يجب التحقق من التكرار فقط إذا كان هناك إنذار آخر بنفس النوع لنفس الموظف غير الإنذار الجاري تعديله
    const existingWarning = warnings.find(
      (warning) =>
        warning.employee_id === formData.employee_id &&
        warning.typeOfWarning === formData.typeOfWarning
    );
    if (existingWarning) {
      newErrorsObj["typeOfWarning"] =
        "هذا الموظف لديه بالفعل إنذار من هذا النوع";
    }
    // بناء قائمة إنذارات مؤقتة تتضمن التعديل الحالي
    const tempWarnings = [
      ...warnings.filter((w) => w.id !== id),
      { ...formData, id },
    ];
    const employeeWarnings = tempWarnings.filter(
      (warning) => warning.employee_id === formData.employee_id
    );
    const hasFirst = employeeWarnings.some(
      (w) => w.typeOfWarning === "إنذار أول"
    );
    const hasSecond = employeeWarnings.some(
      (w) => w.typeOfWarning === "إنذار ثاني"
    );
    // تحقق تسلسل الإنذارات بشكل صحيح: لا يمكن "ثاني" إلا إذا كان يوجد "أول"، ولا يمكن "نهائي" إلا إذا كان يوجد "أول" و"ثاني"
    if (formData.typeOfWarning === "إنذار ثاني" && !hasFirst) {
      newErrorsObj["typeOfWarning"] = "لا يمكن إنذار ثاني قبل إنذار أول للموظف";
    }
    if (formData.typeOfWarning === "إنذار نهائي" && (!hasFirst || !hasSecond)) {
      newErrorsObj["typeOfWarning"] =
        "لا يمكن إنذار نهائي قبل إنذار أول وإنذار ثاني للموظف";
    }
    if (Object.keys(newErrorsObj).length > 0) {
      setErrors(newErrorsObj);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/EmployeeWaring/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        navigate("/management/Employee/EmployeeWaringDisplaySearch");
        return;
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
            <Managementdata dataname="تعديل بيانات الإنذار" />
            <div
              className="RowForInsertinputs"
              style={{
                marginBottom: 25,
              }}
            >
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
                    label: employee.name,
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

            <div className="RowForInsertinputs">
              <Submitinput text="حفظ التعديلات" />
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
