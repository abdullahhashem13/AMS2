import { useState, useEffect } from "react";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import SelectWithLabel4 from "../../../components/SelectWithLabel4";
import Submitinput from "../../../components/submitinput";
import "../../../style/Table.css";
import ButtonInput from "../../../components/ButtonInput";
import SearchableSelect from "../../../components/SearchableSelect";
import SelectWithLabelDynamic from "../../../components/SelectWithLabelDynamic";

export default function EmployeeWaringReport() {
  const [formData, setFormData] = useState({
    typeOfWarning: "جميع الإنذارات",
    employee_id: "الجميع",
  });
  const [error, setErrors] = useState({});
  const [warnings, setWarnings] = useState([]);
  const [employees, setEmployees] = useState([]);
  // حذف الفروع
  const [filteredWarnings, setFilteredWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  // حذف المساجد

  // جلب بيانات الإنذارات والموظفين والفروع والمساجد
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // جلب بيانات الإنذارات
        const warningsResponse = await fetch(
          "http://localhost:3001/EmployeeWaring"
        );
        if (warningsResponse.ok) {
          const warningsData = await warningsResponse.json();
          setWarnings(warningsData);
          setFilteredWarnings(warningsData);
        } else {
          console.error("Failed to fetch warnings:", warningsResponse.status);
        }

        // جلب بيانات الموظفين
        const employeesResponse = await fetch(
          "http://localhost:3001/Employees"
        );
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          setEmployees(employeesData);
        } else {
          console.error("Failed to fetch employees:", employeesResponse.status);
        }

        // حذف جلب الفروع والمساجد

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
  };

  // دالة فلترة بدون فرع
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let filtered = [...warnings];
      // فلترة حسب نوع الإنذار
      if (
        formData.typeOfWarning &&
        formData.typeOfWarning !== "جميع الإنذارات"
      ) {
        filtered = filtered.filter(
          (warning) => warning.typeOfWarning === formData.typeOfWarning
        );
      }
      // فلترة حسب اسم الموظف
      if (formData.employee_id && formData.employee_id !== "الجميع") {
        filtered = filtered.filter(
          (warning) => warning.employee_id === formData.employee_id
        );
      }
      setFilteredWarnings(filtered);
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ أثناء الفلترة." });
      console.error(err);
    }
  };

  // دالة طباعة
  const handlePrint = () => {
    const printContents = document.getElementById("propertyreport").outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  // دالة لتحديث الصفحة بعد اغلاق نافذة الطباعه
  useEffect(() => {
    const handleAfterPrint = () => {
      window.location.reload(); // تحديث الصفحة
    };

    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  // حذف خيارات الفروع

  // إعداد خيارات الموظفين للقائمة المنسدلة
  const employeeSearchOptions = [
    { value: "الجميع", label: "جميع الموظفين" },
    ...employees.map((employee) => ({
      value: employee.id,
      label: employee.name,
    })),
  ];

  // عرض رسالة تحميل
  if (loading) {
    return (
      <div className="displayflexhome">
        <Saidbar />
        <div className="sizeboxUnderSaidbar"></div>
        <div className="homepage">
          <Managmenttitle title="إنذارات الموظفين" />
          <div className="subhomepage">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>جاري تحميل البيانات...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إنذارات الموظفين" />
        <div className="subhomepage">
          <div className="divforbuttons">
            {/* تم تقسيمهن الى دفيين عشان كل دف يكون في الطرف */}
            <div>
              {/* <Bigbutton
                text="إنذارات الموظفين"
                path="/management/Employee/EmployeeWaringDisplaySearch"
              /> */}
            </div>
            {}
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
          <div className="divforconten">
            <form className="divforconten" onSubmit={handleSubmit}>
              <div className="RowForInsertinputs">
                {/* حذف حقل الفرع */}
                <SelectWithLabel4
                  name="typeOfWarning"
                  text="نوع الإنذار"
                  value={formData.typeOfWarning}
                  change={handleChange}
                  // values
                  value1="إنذار أول"
                  value2="إنذار ثاني"
                  value3="إنذار نهائي"
                  value4="جميع الإنذارات"
                />
                <div className="widthbetween"></div>
                <SearchableSelect
                  name="employee_id"
                  text="اسم الموظف"
                  options={employeeSearchOptions}
                  value={formData.employee_id}
                  change={handleChange}
                />
              </div>
              <div className="RowForInsertinputs">
                <Submitinput text="نتيجة" />
              </div>
              <div className="divfortable">
                <table id="propertyreport">
                  <thead>
                    <tr>
                      <th>الوصف</th>
                      <th>التاريخ</th>
                      <th>نوع الإنذار</th>
                      <th>اسم الموظف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWarnings.length > 0 ? (
                      filteredWarnings.map((warning) => {
                        // البحث عن الموظف
                        const employee = employees.find(
                          (emp) => emp.id === warning.employee_id
                        );
                        return (
                          <tr key={warning.id}>
                            <td>{warning.description}</td>
                            <td>{warning.date}</td>
                            <td>{warning.typeOfWarning}</td>
                            <td>
                              {employee
                                ? employee.name
                                : warning.name || "غير محدد"}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="no-data">
                          لا توجد بيانات متطابقة مع معايير البحث
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="RowForInsertinputs"></div>
              <div className="RowForInsertinputs">
                <ButtonInput text="طباعة" onClick={handlePrint} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
