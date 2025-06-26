import { useState, useEffect } from "react";
import Bigbutton from "../../../components/Bigbutton";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import Searchsection from "../../../components/Searchsection";
import EmployeeCard from "../../../components/EmployeeCard";
// @ts-ignore
import Swal from "sweetalert2";

export default function DisplaySearchEmployee() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setSearchTerm] = useState("");

  // جلب بيانات الموظفين من ملف AllData.json
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch("/JsonData/AllData.json");
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
        const data = await response.json();

        // التأكد من وجود مصفوفة الموظفين في البيانات
        if (data.Employees && Array.isArray(data.Employees)) {
          // تحويل البيانات إلى الشكل المطلوب للعرض
          const formattedEmployees = data.Employees.map((employee) => {
            return {
              id: employee.id,
              name: employee.employee_name,
              // نمرر فقط المعرف، وسيقوم المكون بجلب التعيينات
            };
          });

          setEmployees(formattedEmployees);
          setFilteredEmployees(formattedEmployees);
        } else {
          setEmployees([]);
          setFilteredEmployees([]);
        }
      } catch (err) {
        console.error("خطأ في جلب البيانات:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // وظيفة البحث
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter((employee) =>
        employee.name.includes(term)
      );
      setFilteredEmployees(filtered);
    }
  };

  // وظيفة الحذف
  const handleDeleteEmployee = async (id) => {
    // استخدام SweetAlert2 للتأكيد
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      try {
        // إرسال طلب حذف إلى الخادم
        const response = await fetch(`http://localhost:3001/Employees/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("فشل في حذف الموظف");
        }

        // تحديث واجهة المستخدم بعد الحذف الناجح
        setEmployees(employees.filter((emp) => emp.id !== id));
        setFilteredEmployees(filteredEmployees.filter((emp) => emp.id !== id));

        Swal.fire("تم الحذف!", "تم حذف الموظف بنجاح.", "success");
      } catch (error) {
        console.error("Error deleting employee:", error);
        Swal.fire("خطأ!", "حدث خطأ أثناء حذف الموظف.", "error");
      }
    }
  };

  // وظيفة التعديل
  const handleEditEmployee = (id) => {
    // توجيه المستخدم إلى صفحة تعديل الموظف
    window.location.href = `/management/Employee/EditEmployee/${id}`;
  };

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة الموظفين" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div>
              <Bigbutton
                text="أنواع الموظفين"
                path="/management/Employee/TypesOfEmployee"
              />
            </div>
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
            <div className="divforsearchandcards">
              <div className="displayflexjust divforsearch">
                <Searchsection
                  placeholder="ابحث بإسم الموظف"
                  maxLength="30"
                  onSearch={handleSearch}
                />
              </div>
              <div className="divforcards">
                {loading ? (
                  <p>جاري التحميل...</p>
                ) : error ? (
                  <p>خطأ: {error}</p>
                ) : filteredEmployees.length === 0 ? (
                  <p>لا يوجد موظفين</p>
                ) : (
                  filteredEmployees.map((employee) => (
                    <EmployeeCard
                      key={employee.id}
                      id={employee.id}
                      name={employee.name}
                      onDelete={handleDeleteEmployee}
                      onEdit={handleEditEmployee}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
