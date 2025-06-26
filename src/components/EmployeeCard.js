import React, { useEffect, useState } from "react";
import "../style/Cards.css";
// @ts-ignore
import { RiDeleteBin6Line } from "react-icons/ri";
// @ts-ignore
import { FiEdit } from "react-icons/fi";
// @ts-ignore
import Swal from "sweetalert2";
// @ts-ignore
import { useNavigate } from "react-router-dom";
import EmployeeDetails from "../pages/management/Employees/EmployeeDetails";

export default function EmployeeCard(props) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [employeeAssignments, setEmployeeAssignments] = useState([]);
  const [employeeData, setEmployeeData] = useState(null);

  // جلب تعيينات الموظف مع أسماء المساجد وأنواع الوظائف
  useEffect(() => {
    const fetchEmployeeAssignments = async () => {
      try {
        const response = await fetch("/JsonData/AllData.json");
        if (response.ok) {
          const data = await response.json();

          // الحصول على بيانات الموظف الكاملة
          const employee = data.Employees?.find((emp) => emp.id === props.id);

          // حفظ بيانات الموظف كاملة لاستخدامها في صفحة التفاصيل
          if (employee) {
            setEmployeeData(employee);
          }

          if (
            employee &&
            employee.mosque_assignments &&
            Array.isArray(employee.mosque_assignments)
          ) {
            // تجميع معلومات التعيينات
            const assignments = await Promise.all(
              employee.mosque_assignments.map(async (assignment) => {
                // البحث عن المسجد
                const mosque = data.Mosques?.find(
                  (mosque) => mosque.id === assignment.mosque_id
                );

                // البحث عن نوع الوظيفة
                const employeeType = data.TypesOfEmployee?.find(
                  (type) => type.id === assignment.employee_type_id
                );

                return {
                  type: employeeType ? employeeType.employee_type : "؟",
                  mosque: mosque ? mosque.mosque_name : "؟",
                };
              })
            );

            setEmployeeAssignments(assignments);
          }
        }
      } catch (error) {
        console.error("Error fetching employee assignments:", error);
      }
    };

    if (props.id) {
      fetchEmployeeAssignments();
    }
  }, [props.id]);

  const handleCardClick = (e) => {
    // منع انتشار الحدث للأيقونات
    if (!e.target.closest(".deleteAndEditicons")) {
      setShowDetails(true);
      // يمكن إضافة توجيه إلى صفحة تفاصيل الموظف هنا
      if (props.onViewDetails) {
        props.onViewDetails(props.id);
      }
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // منع انتشار الحدث
    navigate(`/management/Employee/EditEmployee/${props.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // منع انتشار الحدث
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed)
        if (props.onDelete) {
          props.onDelete(props.id);
        }
    });
  };

  // تنسيق التعيينات للعرض (مثال: "إمام المحضار و خطيب الرحمة")
  const formattedAssignments =
    employeeAssignments.length > 0
      ? employeeAssignments.map((a) => `${a.type} ${a.mosque}`).join(" و ")
      : "لا يوجد تعيين";

  return (
    <>
      <div
        className="cards"
        onClick={handleCardClick}
        style={{ cursor: "pointer" }}
      >
        {/* تأخذ اسم الموظف */}
        <div>
          <p>{props.name || "اسم الموظف"}</p>
        </div>
        {/* تأخذ تعيينات الموظف وأيقونات التعديل والحذف */}
        <div className="displayflexjust alinmentcenter">
          {/* تعيينات الموظف */}
          <div>
            <p>{formattedAssignments}</p>
          </div>
          {/* أيقونات التعديل والحذف */}
          <div className="displayflexjust deleteAndEditicons">
            <FiEdit
              size="27"
              onClick={handleEdit}
              style={{ cursor: "pointer" }}
            />
            <div className="spacebetweenicons"></div>
            <RiDeleteBin6Line
              size="30"
              onClick={handleDelete}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>

      {showDetails && employeeData && (
        <EmployeeDetails
          employee={employeeData}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
