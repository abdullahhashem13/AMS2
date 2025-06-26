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
    branch_id: "الجميع",
    employeeWarning_typeOfWarning: "جميع الإنذارات",
    employee_id: "الجميع",
  });
  const [error, setErrors] = useState({});
  const [warnings, setWarnings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filteredWarnings, setFilteredWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mosques, setMosques] = useState([]);

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

        // جلب بيانات الفروع
        const branchesResponse = await fetch("http://localhost:3001/Branches");
        if (branchesResponse.ok) {
          const branchesData = await branchesResponse.json();
          setBranches(branchesData);
        } else {
          console.error("Failed to fetch branches:", branchesResponse.status);
        }

        // جلب بيانات المساجد
        const mosquesResponse = await fetch("http://localhost:3001/Mosques");
        if (mosquesResponse.ok) {
          const mosquesData = await mosquesResponse.json();
          setMosques(mosquesData);
        } else {
          console.error("Failed to fetch mosques:", mosquesResponse.status);
        }

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

  // دالة مساعدة للحصول على الفرع الذي ينتمي إليه الموظف من خلال المسجد

  // تعديل handleSubmit لفلترة حسب الفرع الذي ينتمي إليه المسجد الذي يعمل فيه الموظف
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // تطبيق الفلترة على البيانات المحلية
      let filtered = [...warnings];

      // فلترة حسب الفرع (باستخدام الفرع الذي ينتمي إليه المسجد الذي يعمل فيه الموظف)
      if (formData.branch_id && formData.branch_id !== "الجميع") {
        filtered = filtered.filter((warning) => {
          const employee = employees.find(
            (emp) => emp.id === warning.employee_id
          );
          if (
            !employee ||
            !employee.mosque_assignments ||
            employee.mosque_assignments.length === 0
          ) {
            return false;
          }

          // الحصول على معرف المسجد من التعيين الأول للموظف
          const mosqueId = employee.mosque_assignments[0].mosque_id;

          // البحث عن المسجد
          const mosque = mosques.find((m) => m.id === mosqueId);
          if (!mosque) {
            return false;
          }

          // التحقق من أن الفرع الذي ينتمي إليه المسجد يطابق الفرع المحدد في الفلتر
          return mosque.branch_id === formData.branch_id;
        });
      }

      // فلترة حسب نوع الإنذار
      if (
        formData.employeeWarning_typeOfWarning &&
        formData.employeeWarning_typeOfWarning !== "جميع الإنذارات"
      ) {
        filtered = filtered.filter(
          (warning) =>
            warning.typeOfWarning === formData.employeeWarning_typeOfWarning
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

  // إعداد خيارات الفروع للقائمة المنسدلة
  const branchOptions = [
    { id: "الجميع", name: "جميع الفروع" },
    ...branches.map((branch) => ({
      id: branch.id,
      name: branch.name || branch.branch_name, // التعامل مع الاختلافات في هيكل البيانات
    })),
  ];

  // إعداد خيارات الموظفين للقائمة المنسدلة
  const employeeSearchOptions = [
    { value: "الجميع", label: "جميع الموظفين" },
    ...employees.map((employee) => ({
      value: employee.id,
      label: employee.employee_name,
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
                <SelectWithLabelDynamic
                  name="branch_id"
                  text="الفرع"
                  value={formData.branch_id}
                  change={handleChange}
                  options={branchOptions}
                  placeholder="اختر الفرع"
                  valueKey="id"
                  displayKey="name"
                />
                <div className="widthbetween"></div>
                <SelectWithLabel4
                  name="employeeWarning_typeOfWarning"
                  text="نوع الإنذار"
                  value={formData.employeeWarning_typeOfWarning}
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
                      <th>الفرع</th>
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

                        // الحصول على الفرع الذي ينتمي إليه الموظف من خلال المسجد
                        const branch =
                          employee &&
                          employee.mosque_assignments &&
                          employee.mosque_assignments.length > 0
                            ? (() => {
                                const mosqueId =
                                  employee.mosque_assignments[0].mosque_id;
                                const mosque = mosques.find(
                                  (m) => m.id === mosqueId
                                );
                                if (!mosque) return null;
                                return branches.find(
                                  (b) => b.id === mosque.branch_id
                                );
                              })()
                            : null;

                        return (
                          <tr key={warning.id}>
                            <td>
                              {branch
                                ? branch.name || branch.branch_name
                                : "غير محدد"}
                            </td>
                            <td>{warning.description}</td>
                            <td>{warning.date}</td>
                            <td>{warning.typeOfWarning}</td>
                            <td>
                              {employee
                                ? employee.employee_name
                                : warning.employee_name || "غير محدد"}
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
