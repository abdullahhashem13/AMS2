import React, { useState, useEffect } from "react";
import "../../../style/Modal.css";

export default function EmployeeDetails({ employee, onClose }) {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch("/JsonData/AllData.json");
        if (response.ok) {
          const data = await response.json();

          if (
            employee &&
            employee.mosque_assignments &&
            Array.isArray(employee.mosque_assignments)
          ) {
            const formattedAssignments = employee.mosque_assignments.map(
              (assignment) => {
                const mosque = data.Mosques?.find(
                  (m) => m.id === assignment.mosque_id
                );
                const employeeType = data.TypesOfEmployee?.find(
                  (t) => t.id === assignment.type_id
                );

                return {
                  mosque_name: mosque
                    ? mosque.name || mosque.mosque_name
                    : "غير معروف",
                  type: employeeType
                    ? employeeType.name || employeeType.type
                    : "غير معروف",
                };
              }
            );

            setAssignments(formattedAssignments);
          }
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, [employee]);

  if (!employee) return null;

  // تنسيق التعيينات للعرض (مثال: "إمام المحضار و خطيب الرحمة")
  const formattedAssignments =
    assignments.length > 0
      ? assignments.map((a) => `${a.type} ${a.mosque_name}`).join(" و ")
      : "لا توجد تعيينات";

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">معلومات الموظف</h2>

        <div className="details-container">
          <div className="details-row">
            <div className="details-label">اسم الموظف:</div>
            <div className="details-value">{employee.name}</div>
          </div>

          <div className="details-row">
            <div className="details-label">رقم التلفون:</div>
            <div className="details-value">{employee.phone}</div>
          </div>

          <div className="details-row">
            <div className="details-label">الجنس:</div>
            <div className="details-value">{employee.gender}</div>
          </div>

          <div className="details-row">
            <div className="details-label">تاريخ الميلاد:</div>
            <div className="details-value">{employee.birthDate}</div>
          </div>

          <div className="details-row">
            <div className="details-label">يعمل كـ:</div>
            <div className="details-value">{employee.workAs}</div>
          </div>

          <div className="details-row">
            <div className="details-label">الحالة:</div>
            <div className="details-value">{employee.statue}</div>
          </div>

          <div className="details-row">
            <div className="details-label">الراتب:</div>
            <div className="details-value">{employee.salary}</div>
          </div>

          <div className="details-row">
            <div className="details-label">المؤهل:</div>
            <div className="details-value">{employee.abilities}</div>
          </div>

          <div className="details-row">
            <div className="details-label">التعيينات:</div>
            <div className="details-value">{formattedAssignments}</div>
          </div>

          <div className="details-row">
            <div className="details-label">المحافظة:</div>
            <div className="details-value">{employee.governorate}</div>
          </div>

          <div className="details-row">
            <div className="details-label">المدينة:</div>
            <div className="details-value">{employee.city}</div>
          </div>

          <div className="details-row">
            <div className="details-label">الحي:</div>
            <div className="details-value">{employee.neighborhood}</div>
          </div>
        </div>

        <button className="modal-close-btn" onClick={onClose}>
          إغلاق
        </button>
      </div>
    </div>
  );
}
