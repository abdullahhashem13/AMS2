import { useState, useEffect } from "react";
import Bigbutton from "../../../components/Bigbutton";
import Checkpoint from "../../../components/checkpoint";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import SelectWithLabel from "../../../components/SelectWithLabel";
import SelectWithLabel4 from "../../../components/SelectWithLabel4";
import SearchableSelect from "../../../components/SearchableSelect";
import Submitinput from "../../../components/submitinput";
import "../../../style/Table.css";
import ButtonInput from "../../../components/ButtonInput";
import SelectWithLabel3 from "../../../components/SelectWithLabel3";

export default function ReportEmployee() {
  const [formData, setFormData] = useState({
    gender: "الجميع",
    mosque_id: "الجميع",
    type_id: "الجميع",
    statue: "الجميع",
    workAs: "الجميع",
  });
  const [error, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mosques, setMosques] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);

  // الأعمدة القابلة للاضافة - جميعها مخفية افتراض<|im_start|>
  const [showsalary, setshowsalary] = useState(false);
  const [showbirthDate, setShowbirthDate] = useState(false);
  const [showabilities, setShowabilities] = useState(false);
  const [showgovernorate, setShowgovernorate] = useState(false);
  const [showcity, setShowcity] = useState(false);
  const [showneighborhood, setShowneighborhood] = useState(false);

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

      if (formData.gender && formData.gender !== "الجميع") {
        filtered = filtered.filter((emp) => emp.gender === formData.gender);
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

      if (formData.type_id && formData.type_id !== "الجميع") {
        filtered = filtered.filter((emp) => {
          if (emp.mosque_assignments && emp.mosque_assignments.length > 0) {
            return emp.mosque_assignments.some(
              (assignment) => assignment.type_id === formData.type_id
            );
          }
          return false;
        });
      }

      if (formData.statue && formData.statue !== "الجميع") {
        filtered = filtered.filter((emp) => emp.statue === formData.statue);
      }

      if (formData.workAs && formData.workAs !== "الجميع") {
        filtered = filtered.filter((emp) => emp.workAs === formData.workAs);
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
          (t) => t.id === assignment.type_id
        );
        const mosqueName = mosque
          ? mosque.name || mosque.mosque_name
          : "غير معروف";
        const typeName = employeeType
          ? employeeType.name || employeeType.type
          : "غير معروف";
        return `${typeName} ${mosqueName}`;
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
    if (showabilities) count++;
    if (showsalary) count++;
    if (showbirthDate) count++;
    if (showneighborhood) count++;
    if (showcity) count++;
    if (showgovernorate) count++;

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
          <div>
            <form className="divforconten" onSubmit={handleSubmit}>
              <div className="RowForInsertinputs">
                <SelectWithLabel3
                  name="gender"
                  text="الجنس"
                  value={formData.gender}
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
                      label: mosque.name,
                    })),
                  ]}
                  value={formData.mosque_id}
                  change={handleChange}
                />
                <div className="widthbetween"></div>
                <SearchableSelect
                  id="type_id"
                  name="type_id"
                  text="نوع الموظف"
                  options={[
                    { value: "الجميع", label: "الجميع" },
                    ...employeeTypes.map((type) => ({
                      value: type.id,
                      label: type.name,
                    })),
                  ]}
                  value={formData.type_id}
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
                  <SelectWithLabel3
                    name="statue"
                    text="الحالة"
                    value={formData.statue}
                    change={handleChange}
                    // values
                    value1="الجميع"
                    value2="فعال"
                    value3="موقف"
                  />
                  <div className="widthbetween"></div>
                  <SelectWithLabel4
                    name="workAs"
                    text="يعمل كـ"
                    value={formData.workAs}
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
                    change={(e) => setShowneighborhood(e.target.checked)}
                    checked={showneighborhood}
                  />
                  <Checkpoint
                    text="المدينة"
                    change={(e) => setShowcity(e.target.checked)}
                    checked={showcity}
                  />
                  <Checkpoint
                    text="المحافظة"
                    change={(e) => setShowgovernorate(e.target.checked)}
                    checked={showgovernorate}
                  />
                  <Checkpoint
                    text="المؤهل"
                    change={(e) => setShowabilities(e.target.checked)}
                    checked={showabilities}
                  />
                  <Checkpoint
                    text="تاريخ الميلاد"
                    change={(e) => setShowbirthDate(e.target.checked)}
                    checked={showbirthDate}
                  />
                  <Checkpoint
                    text="الراتب"
                    change={(e) => setshowsalary(e.target.checked)}
                    checked={showsalary}
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
                      {showgovernorate && <th>المحافظة</th>}
                      {showcity && <th>المدينة</th>}
                      {showneighborhood && <th>الحي</th>}
                      {showbirthDate && <th>تاريخ الميلاد</th>}
                      {showsalary && <th>الراتب</th>}
                      <th>التعيينات</th>
                      <th>الحالة</th>
                      <th>يعمل كـ</th>
                      <th>الجنس</th>
                      {showabilities && <th>المؤهل</th>}
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
                          {showgovernorate && (
                            <td>{employee.governorate || "غير متوفر"}</td>
                          )}
                          {showcity && <td>{employee.city || "غير متوفر"}</td>}
                          {showneighborhood && (
                            <td>{employee.neighborhood || "غير متوفر"}</td>
                          )}
                          {showbirthDate && (
                            <td>{employee.birthDate || "غير متوفر"}</td>
                          )}
                          {showsalary && (
                            <td>
                              {employee.salary
                                ? `${employee.salary} ريال`
                                : "غير متوفر"}
                            </td>
                          )}
                          <td>{formatAssignments(employee)}</td>
                          <td>{employee.statue || "غير متوفر"}</td>
                          <td>{employee.workAs || "غير متوفر"}</td>
                          <td>{employee.gender || "غير متوفر"}</td>
                          {showabilities && (
                            <td>{employee.abilities || "غير متوفر"}</td>
                          )}
                          <td>{employee.phone || "غير متوفر"}</td>
                          <td>{employee.name || "غير متوفر"}</td>
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
