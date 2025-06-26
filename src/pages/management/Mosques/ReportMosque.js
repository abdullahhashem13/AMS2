import React, { useState, useEffect } from "react";
import Saidbar from "../../../components/saidbar";
import Managmenttitle from "../../../components/Managmenttitle";
import Bigbutton from "../../../components/Bigbutton";
import Mainbutton from "../../../components/Mainbutton";
import SearchableSelect from "../../../components/SearchableSelect";
import Checkpoint from "../../../components/checkpoint";
import Submitinput from "../../../components/submitinput";
import ButtonInput from "../../../components/ButtonInput";
import SelectWithLabel3 from "../../../components/SelectWithLabel3";
import SelectWithLabel4 from "../../../components/SelectWithLabel4";

export default function ReportMosque() {
  // حالات لتخزين البيانات
  const [mosques, setMosques] = useState([]);
  const [filteredMosques, setFilteredMosques] = useState([]);
  const [branches, setBranches] = useState([]);
  const [mosqueTypes, setMosqueTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // حالة نموذج البحث
  const [formData, setFormData] = useState({
    branch_id: "الجميع",
    isForAwgaf: "الجميع",
    type_id: "الجميع",
    statue: "الجميع",
  });

  const [error, setErrors] = useState({});

  // الأعمدة القابلة للاضافة

  const [showimam, setShowImam] = useState(false);
  const [showmuezzin, setShowmuezzin] = useState(false);
  const [showkhatib, setShowkhatib] = useState(false);
  const [showcleaner, setShowcleaner] = useState(false);
  const [showattendant, setShowattendant] = useState(false);
  const [showsupervisor, setShowsupervisor] = useState(false);
  const [showNumberOfProperty, setShowNumberOfProperty] = useState(false); // حالة لعدد الأعين

  // دالة للعثور على الموظف المرتبط بمسجد معين حسب نوع الوظيفة
  const findEmployeeByMosqueAndType = (mosqueId, employeeTypeId) => {
    console.log(
      `Searching for employee with id=${mosqueId} and employee_type_id=${employeeTypeId}`
    );

    if (!employees || employees.length === 0) {
      console.log("No employees data available");
      return "غير محدد";
    }

    const employee = employees.find((emp) => {
      console.log(
        `Checking employee ${emp.employee_name}, assignments:`,
        emp.assignments
      );
      return (
        emp.assignments &&
        emp.assignments.some((assignment) => {
          const match =
            assignment.id === mosqueId &&
            assignment.employee_type_id === employeeTypeId;
          if (match) {
            console.log(
              `Found match: ${emp.employee_name} for mosque ${mosqueId} as type ${employeeTypeId}`
            );
          }
          return match;
        })
      );
    });

    console.log(
      `Result for mosque ${mosqueId}, type ${employeeTypeId}:`,
      employee ? employee.employee_name : "غير محدد"
    );
    return employee ? employee.employee_name : "غير محدد";
  };

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // جلب بيانات المساجد
        const mosquesResponse = await fetch("http://localhost:3001/Mosques");
        if (mosquesResponse.ok) {
          const mosquesData = await mosquesResponse.json();
          setMosques(mosquesData);
          setFilteredMosques(mosquesData);
          console.log("Mosques data:", mosquesData);
        } else {
          console.error("Failed to fetch mosques:", mosquesResponse.status);
        }

        // جلب بيانات الفروع
        const branchesResponse = await fetch("http://localhost:3001/Branches");
        if (branchesResponse.ok) {
          const branchesData = await branchesResponse.json();
          setBranches(branchesData);
        } else {
          console.error("Failed to fetch branches:", branchesResponse.status);
        }

        // جلب أنواع المساجد
        const typesResponse = await fetch("http://localhost:3001/TypeOfMosque");
        if (typesResponse.ok) {
          const typesData = await typesResponse.json();
          setMosqueTypes(typesData);
        } else {
          console.error("Failed to fetch mosque types:", typesResponse.status);
        }

        // جلب بيانات الموظفين
        const employeesResponse = await fetch(
          "http://localhost:3001/Employees"
        );
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          setEmployees(employeesData);
          console.log("Employees data:", employeesData);
        } else {
          console.error("Failed to fetch employees:", employeesResponse.status);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // معالجة تغيير قيم النموذج
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
  };

  // معالجة تقديم النموذج للبحث
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // تطبيق الفلترة على البيانات المحلية
      let filtered = [...mosques];

      // فلترة حسب الفرع
      if (formData.branch_id && formData.branch_id !== "الجميع") {
        filtered = filtered.filter(
          (mosque) => mosque.branch_id === formData.branch_id
        );
      }

      // فلترة حسب نوع المسجد
      if (formData.type_id && formData.type_id !== "الجميع") {
        filtered = filtered.filter(
          (mosque) => mosque.type_id === formData.type_id
        );
      }

      // فلترة حسب تابع لـ (isAwgaf)
      if (formData.isForAwgaf && formData.isForAwgaf !== "الجميع") {
        filtered = filtered.filter((mosque) => {
          const isForAwgafValue =
            mosque.isForAwgaf === true ||
            mosque.isForAwgaf === "true" ||
            mosque.isForAwgaf === 1 ||
            mosque.isForAwgaf === "1";
          // Debug: طباعة القيم للتحقق
          console.log("فلترة isForAwgaf:", {
            mosqueId: mosque.id,
            mosqueIsForAwgaf: mosque.isForAwgaf,
            isForAwgafValue,
            filter: formData.isForAwgaf,
          });
          if (formData.isForAwgaf === "للأوقاف")
            return isForAwgafValue === true;
          if (formData.isForAwgaf === "أخرى") return isForAwgafValue === false;
          return true;
        });
      }

      // فلترة حسب حالة المسجد
      if (formData.statue && formData.statue !== "الجميع") {
        filtered = filtered.filter(
          (mosque) => mosque.statue === formData.statue
        );
      }

      setFilteredMosques(filtered);
      setLoading(false);
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ أثناء البحث" });
      console.error(err);
      setLoading(false);
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

  // إعداد خيارات أنواع المساجد للبحث
  const mosqueTypeOptions = [
    { value: "الجميع", label: "الجميع" },
    ...mosqueTypes.map((type) => ({
      value: type.id,
      label: type.type || type.name || type.mosqueTypeName || String(type.id),
    })),
  ];

  // إعداد خيارات الفروع للقائمة المنسدلة
  const branchOptions = [
    { id: "الجميع", name: "جميع الفروع" },
    ...branches.map((branch) => ({
      id: branch.id,
      name: branch.name || branch.branch_name, // التعامل مع الاختلافات في هيكل البيانات
    })),
  ];

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة المساجد" />
        <div className="subhomepage">
          <div className="divforbuttons">
            {/* الثاني */}
            <div>
              <Bigbutton
                text="أنواع المساجد"
                path="/management/Mosques/TypesMosque"
              />
            </div>
            {/* الاول */}
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Mosques/ReportMosque"
              />
              <Mainbutton
                text="بحث"
                path="/management/Mosques/DisplaySearchMosque"
              />
              <Mainbutton text="إضافة" path="/management/Mosques/AddMosque" />
            </div>
          </div>
          <div>
            <form className="divforconten" onSubmit={handleSubmit}>
              <div
                className="RowForInsertinputs"
                style={{
                  marginBottom: 5,
                }}
              >
                <SelectWithLabel3
                  name="isForAwgaf"
                  text="تابع"
                  value={formData.isForAwgaf}
                  change={handleChange}
                  // values
                  value1="الجميع"
                  value2="للأوقاف"
                  value3="أخرى"
                />
                <div className="widthbetween"></div>
                <SearchableSelect
                  id="branch_id"
                  name="branch_id"
                  text="الفرع"
                  options={branchOptions.map((b) => ({
                    value: b.id,
                    label: b.name,
                  }))}
                  value={formData.branch_id}
                  change={handleChange}
                />
                <div className="widthbetween"></div>
                <SearchableSelect
                  id="type_id"
                  name="type_id"
                  text="نوع المسجد"
                  options={mosqueTypeOptions}
                  value={formData.type_id}
                  change={handleChange}
                />
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
                    text="الفراش"
                    change={(e) => setShowattendant(e.target.checked)}
                  />
                  <Checkpoint
                    text="المنظف"
                    change={(e) => setShowcleaner(e.target.checked)}
                  />
                  <Checkpoint
                    text="الناظر"
                    change={(e) => setShowsupervisor(e.target.checked)}
                  />
                  <Checkpoint
                    text="المؤذن"
                    change={(e) => setShowmuezzin(e.target.checked)}
                  />
                  <Checkpoint
                    text="الخطيب"
                    change={(e) => setShowkhatib(e.target.checked)}
                  />
                  <Checkpoint
                    text="الإمام"
                    change={(e) => setShowImam(e.target.checked)}
                  />
                  <Checkpoint
                    text="عدد الأعين"
                    change={(e) => setShowNumberOfProperty(e.target.checked)}
                  />
                  <div
                    style={{
                      width: "29.5%",
                    }}
                  >
                    <SelectWithLabel4
                      name="statue"
                      text="حالة"
                      value={formData.statue}
                      change={handleChange}
                      // values
                      value1="الجميع"
                      value2="جاهز"
                      value3="قيد البناء"
                      value4="موقف"
                    />
                  </div>
                </div>
              </div>
              <div className="RowForInsertinputs">
                <Submitinput text="نتيجة" />
              </div>
              <div className="divfortable">
                {loading ? (
                  <p>جاري تحميل البيانات...</p>
                ) : (
                  <table id="propertyreport">
                    <thead>
                      <tr>
                        {showsupervisor && <th>الناظر</th>}
                        {showattendant && <th>الفراش</th>}
                        {showcleaner && <th>المنظف</th>}
                        {showkhatib && <th>الخطيب</th>}
                        {showmuezzin && <th>المؤذن</th>}
                        {showimam && <th>الإمام</th>}
                        {showNumberOfProperty && <th>عدد الأعين</th>}
                        <th>حالة المسجد</th>
                        <th>تابع</th>
                        <th>نوع المسجد</th>
                        <th>الفرع</th>
                        <th>رقم المسجد</th>
                        <th>اسم المسجد</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMosques.length === 0 ? (
                        <tr>
                          <td
                            // @ts-ignore
                            colSpan="13"
                            style={{ textAlign: "center" }}
                          >
                            لا توجد بيانات متطابقة مع معايير البحث
                          </td>
                        </tr>
                      ) : (
                        filteredMosques.map((mosque) => {
                          // Debug: طباعة القيم للتحقق
                          console.log(
                            "mosque.type_id:",
                            mosque.type_id,
                            "mosque.branch_id:",
                            mosque.branch_id
                          );
                          console.log("mosqueTypes:", mosqueTypes);
                          console.log("branches:", branches);
                          // البحث عن الفرع مع تطابق نوع البيانات
                          const branch = branches.find(
                            (b) => String(b.id) === String(mosque.branch_id)
                          );
                          // البحث عن نوع المسجد مع تطابق نوع البيانات
                          const mosqueType = mosqueTypes.find(
                            (t) => String(t.id) === String(mosque.type_id)
                          );
                          // fallback: إذا لم يوجد النوع اطبع الكائن في الكونسول
                          if (!mosqueType) {
                            console.log(
                              "MosqueType not found for id:",
                              mosque.type_id,
                              "All mosqueTypes:",
                              mosqueTypes
                            );
                          }

                          // البحث عن الموظفين المرتبطين بالمسجد
                          const imamName = findEmployeeByMosqueAndType(
                            mosque.id,
                            "36c9"
                          ); // معرف نوع الإمام
                          const muezzinName = findEmployeeByMosqueAndType(
                            mosque.id,
                            "712d"
                          ); // معرف نوع المؤذن
                          const khatibName = findEmployeeByMosqueAndType(
                            mosque.id,
                            "48dd"
                          ); // معرف نوع الخطيب
                          const cleanerName = findEmployeeByMosqueAndType(
                            mosque.id,
                            "45df"
                          ); // معرف نوع المنظف
                          const attendantName = findEmployeeByMosqueAndType(
                            mosque.id,
                            "f2d4"
                          ); // معرف نوع الفراش
                          const supervisorName = findEmployeeByMosqueAndType(
                            mosque.id,
                            "4d16"
                          ); // معرف نوع الناظر

                          // Debug: طباعة قيمة isAwgaf للتحقق
                          console.log(
                            "mosque.id:",
                            mosque.id,
                            "isAwgaf:",
                            mosque.isAwgaf
                          );

                          return (
                            <tr key={mosque.id}>
                              {showsupervisor && <td>{supervisorName}</td>}
                              {showattendant && <td>{attendantName}</td>}
                              {showcleaner && <td>{cleanerName}</td>}
                              {showkhatib && <td>{khatibName}</td>}
                              {showmuezzin && <td>{muezzinName}</td>}
                              {showimam && <td>{imamName}</td>}
                              {showNumberOfProperty && (
                                <td>{mosque.numberOfProperty || "غير محدد"}</td>
                              )}
                              <td>{mosque.statue || "غير محدد"}</td>
                              <td>
                                {
                                  // منطق عرض عمود تابع
                                  mosque.isForAwgaf === true ||
                                  mosque.isForAwgaf === "true" ||
                                  mosque.isForAwgaf === 1 ||
                                  mosque.isForAwgaf === "1"
                                    ? "أوقاف"
                                    : mosque.isForAwgaf === false ||
                                      mosque.isForAwgaf === "false" ||
                                      mosque.isForAwgaf === 0 ||
                                      mosque.isForAwgaf === "0"
                                    ? "أخرى"
                                    : `غير محدد (${mosque.isForAwgaf})`
                                }
                              </td>
                              <td>
                                {mosqueType
                                  ? mosqueType.type ||
                                    mosqueType.name ||
                                    mosqueType.mosqueTypeName ||
                                    JSON.stringify(mosqueType)
                                  : `غير محدد (${mosque.type_id})`}
                              </td>
                              <td>
                                {branch
                                  ? branch.name || branch.branch_name
                                  : `غير محدد (${mosque.branch_id})`}
                              </td>
                              <td>{mosque.number || "غير محدد"}</td>
                              <td>{mosque.name || "غير محدد"}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
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
