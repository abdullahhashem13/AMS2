import { useState, useEffect } from "react";
import Bigbutton from "../../../components/Bigbutton";
import Checkpoint from "../../../components/checkpoint";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import SelectWithLabel from "../../../components/SelectWithLabel";
import SelectWithLabel4 from "../../../components/SelectWithLabel4";
import SearchableSelect from "../../../components/SearchableSelect";
import Submitinput from "../../../components/submitinput";
import "../../../style/Table.css";
import ButtonInput from "../../../components/ButtonInput";

export default function ReportEmployee() {
  const [formData, setFormData] = useState({
    employee_gender: "الجميع",
    mosque_id: "الجميع",
    employee_type_id: "الجميع",
    employee_statue: "الجميع",
    employee_workAs: "الجميع",
  });
  const [error, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mosques, setMosques] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);

  // الأعمدة القابلة للاضافة - جميعها مخفية افتراض<|im_start|>
  const [showemployee_salary, setshowemployee_salary] = useState(false);
  const [showemployee_birthDate, setShowemployee_birthDate] = useState(false);
  const [showemployee_abilities, setShowemployee_abilities] = useState(false);
  const [showemployee_governorate, setShowemployee_governorate] =
    useState(false);
  const [showemployee_city, setShowemployee_city] = useState(false);
  const [showemployee_neighborhood, setShowemployee_neighborhood] =
    useState(false);

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب بيانات الموظفين
        const employeesResponse = await fetch(
          "http://localhost:3001/Employees"
        );
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          setEmployees(employeesData);
          setFilteredEmployees(employeesData);
        }

        // جلب بيانات المساجد
        const mosquesResponse = await fetch("http://localhost:3001/Mosques");
        if (mosquesResponse.ok) {
          const mosquesData = await mosquesResponse.json();
          setMosques(mosquesData);
        }

        // جلب أنواع الموظفين
        const typesResponse = await fetch(
          "http://localhost:3001/TypesOfEmployee"
        );
        if (typesResponse.ok) {
          const typesData = await typesResponse.json();
          setEmployeeTypes(typesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors({ ...error, general: "حدث خطأ أثناء جلب البيانات" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // تطبيق الفلترة على البيانات المحلية
      let filtered = [...employees];

      if (formData.employee_gender && formData.employee_gender !== "الجميع") {
        filtered = filtered.filter(
          (emp) => emp.employee_gender === formData.employee_gender
        );
      }

      if (formData.mosque_id && formData.mosque_id !== "الجميع") {
        filtered = filtered.filter((emp) => {
          if (emp.mosque_assignments && emp.mosque_assignments.length > 0) {
            return emp.mosque_assignments.some(
              (assignment) => assignment.mosque_id === formData.mosque_id
            );
          }
          return false;
        });
      }

      if (formData.employee_type_id && formData.employee_type_id !== "الجميع") {
        filtered = filtered.filter((emp) => {
          if (emp.mosque_assignments && emp.mosque_assignments.length > 0) {
            return emp.mosque_assignments.some(
              (assignment) =>
                assignment.employee_type_id === formData.employee_type_id
            );
          }
          return false;
        });
      }

      if (formData.employee_statue && formData.employee_statue !== "الجميع") {
        filtered = filtered.filter(
          (emp) => emp.employee_statue === formData.employee_statue
        );
      }

      if (formData.employee_workAs && formData.employee_workAs !== "الجميع") {
        filtered = filtered.filter(
          (emp) => emp.employee_workAs === formData.employee_workAs
        );
      }

      setFilteredEmployees(filtered);
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ أثناء البحث" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // دالة لتنسيق التعيينات
  const formatAssignments = (employee) => {
    if (
      !employee.mosque_assignments ||
      employee.mosque_assignments.length === 0
    ) {
      return "لا توجد تعيينات";
    }

    return employee.mosque_assignments
      .map((assignment) => {
        const mosque = mosques.find((m) => m.id === assignment.mosque_id);
        const employeeType = employeeTypes.find(
          (t) => t.id === assignment.employee_type_id
        );

        return `${employeeType ? employeeType.employee_type : "غير معروف"} ${
          mosque ? mosque.mosque_name : "غير معروف"
        }`;
      })
      .join(" و ");
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

  // حساب عدد الأعمدة المرئية للـ colSpan
  const getVisibleColumnsCount = () => {
    // الأعمدة الأساسية دائمًا ظاهرة
    let count = 6; // اسم الموظف، رقم التلفون، الجنس، يعمل كـ، الحالة، التعيينات

    // الأعمدة الاختيارية
    if (showemployee_abilities) count++;
    if (showemployee_salary) count++;
    if (showemployee_birthDate) count++;
    if (showemployee_neighborhood) count++;
    if (showemployee_city) count++;
    if (showemployee_governorate) count++;

    return count;
  };

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة الموظفون" />
        <div className="subhomepage">
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
          <div className="divforconten">
            <form className="divforconten" onSubmit={handleSubmit}>
              <div className="RowForInsertinputs">
                <SelectWithLabel
                  name="employee_gender"
                  text="الجنس"
                  value={formData.employee_gender}
                  change={handleChange}
                  // values
                  value1="الجميع"
                  value2="ذكر"
                  value3="أنثى"
                />
                <div className="widthbetween"></div>
                <SearchableSelect
                  id="mosque_id"
                  name="mosque_id"
                  text="تابع لمسجد"
                  options={[
                    { value: "الجميع", label: "الجميع" },
                    ...mosques.map((mosque) => ({
                      value: mosque.id,
                      label: mosque.mosque_name,
                    })),
                  ]}
                  value={formData.mosque_id}
                  change={handleChange}
                />
                <div className="widthbetween"></div>
                <SearchableSelect
                  id="employee_type_id"
                  name="employee_type_id"
                  text="نوع الموظف"
                  options={[
                    { value: "الجميع", label: "الجميع" },
                    ...employeeTypes.map((type) => ({
                      value: type.id,
                      label: type.employee_type,
                    })),
                  ]}
                  value={formData.employee_type_id}
                  change={handleChange}
                />
              </div>
              <div className="RowForInsertinputs">
                <div
                  style={{
                    display: "flex",
                    width: "64.6%",
                  }}
                >
                  <SelectWithLabel
                    name="employee_statue"
                    text="الحالة"
                    value={formData.employee_statue}
                    change={handleChange}
                    // values
                    value1="الجميع"
                    value2="فعال"
                    value3="موقف"
                  />
                  <div className="widthbetween"></div>
                  <SelectWithLabel4
                    name="employee_workAs"
                    text="يعمل كـ"
                    value={formData.employee_workAs}
                    change={handleChange}
                    // values
                    value1="الجميع"
                    value2="اوقافي"
                    value3="ارشادي"
                    value4="اوقافي وارشادي"
                  />
                </div>
              </div>
              <div className="RowForInsertinputs">
                <div
                  className="displayflexjust"
                  style={{
                    width: "100%",
                    justifyItems: "end",
                    justifyContent: "end",
                  }}
                >
                  <Checkpoint
                    text="الحي"
                    change={(e) =>
                      setShowemployee_neighborhood(e.target.checked)
                    }
                    checked={showemployee_neighborhood}
                  />
                  <Checkpoint
                    text="المدينة"
                    change={(e) => setShowemployee_city(e.target.checked)}
                    checked={showemployee_city}
                  />
                  <Checkpoint
                    text="المحافظة"
                    change={(e) =>
                      setShowemployee_governorate(e.target.checked)
                    }
                    checked={showemployee_governorate}
                  />
                  <Checkpoint
                    text="المؤهل"
                    change={(e) => setShowemployee_abilities(e.target.checked)}
                    checked={showemployee_abilities}
                  />
                  <Checkpoint
                    text="تاريخ الميلاد"
                    change={(e) => setShowemployee_birthDate(e.target.checked)}
                    checked={showemployee_birthDate}
                  />
                  <Checkpoint
                    text="الراتب"
                    change={(e) => setshowemployee_salary(e.target.checked)}
                    checked={showemployee_salary}
                  />
                </div>
              </div>
              <div className="RowForInsertinputs">
                <Submitinput text="نتيجة" />
              </div>
              <div
                className="divfortable"
                style={{
                  height: "50%",
                }}
              >
                <table id="propertyreport">
                  <thead>
                    <tr>
                      {showemployee_governorate && <th>المحافظة</th>}
                      {showemployee_city && <th>المدينة</th>}
                      {showemployee_neighborhood && <th>الحي</th>}
                      {showemployee_birthDate && <th>تاريخ الميلاد</th>}
                      {showemployee_salary && <th>الراتب</th>}
                      <th>التعيينات</th>
                      <th>الحالة</th>
                      <th>يعمل كـ</th>
                      <th>الجنس</th>
                      {showemployee_abilities && <th>المؤهل</th>}
                      <th>رقم التلفون</th>
                      <th>اسم الموظف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={getVisibleColumnsCount()}
                          style={{ textAlign: "center" }}
                        >
                          جاري التحميل...
                        </td>
                      </tr>
                    ) : filteredEmployees.length === 0 ? (
                      <tr>
                        <td
                          colSpan={getVisibleColumnsCount()}
                          style={{ textAlign: "center" }}
                        >
                          لا توجد بيانات
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <tr key={employee.id}>
                          {showemployee_governorate && (
                            <td>
                              {employee.employee_governorate || "غير متوفر"}
                            </td>
                          )}
                          {showemployee_city && (
                            <td>{employee.employee_city || "غير متوفر"}</td>
                          )}
                          {showemployee_neighborhood && (
                            <td>
                              {employee.employee_neighborhood || "غير متوفر"}
                            </td>
                          )}
                          {showemployee_birthDate && (
                            <td>
                              {employee.employee_birthDate || "غير متوفر"}
                            </td>
                          )}
                          {showemployee_salary && (
                            <td>
                              {employee.employee_salary
                                ? `${employee.employee_salary} ريال`
                                : "غير متوفر"}
                            </td>
                          )}
                          <td>{formatAssignments(employee)}</td>
                          <td>{employee.employee_statue || "غير متوفر"}</td>
                          <td>{employee.employee_workAs || "غير متوفر"}</td>
                          <td>{employee.employee_gender || "غير متوفر"}</td>
                          {showemployee_abilities && (
                            <td>
                              {employee.employee_abilities || "غير متوفر"}
                            </td>
                          )}
                          <td>{employee.employee_phone || "غير متوفر"}</td>
                          <td>{employee.employee_name || "غير متوفر"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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
