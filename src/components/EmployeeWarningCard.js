import React, { useState } from "react";
import "../style/Cards.css";
// @ts-ignore
import { RiDeleteBin6Line } from "react-icons/ri";
// @ts-ignore
import { FiEdit } from "react-icons/fi";
// @ts-ignore
import Swal from "sweetalert2";
// @ts-ignore
import { useNavigate } from "react-router-dom";
import EmployeeWarningDetails from "../pages/management/Employees/EmployeeWarningDetails";

export default function EmployeeWarningCard(props) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [warningDetails, setWarningDetails] = useState(null);

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/management/Employee/EmployeeWaringEdit/${props.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا الإجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، قم بالحذف!",
      cancelButtonText: "إلغاء",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:3001/EmployeeWaring/${props.id}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("فشل في حذف الإنذار");
          }

          // استدعاء دالة التحديث من الأب
          if (props.onDelete) {
            props.onDelete(props.id);
          }

          Swal.fire("تم الحذف!", "تم حذف الإنذار بنجاح.", "success");
        } catch (error) {
          console.error("Error deleting warning:", error);
          Swal.fire("خطأ!", "حدث خطأ أثناء حذف الإنذار.", "error");
        }
      }
    });
  };

  const handleCardClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/EmployeeWaring/${props.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setWarningDetails(data);
        setShowDetails(true);
      }
    } catch (error) {
      console.error("Error fetching warning details:", error);
    }
  };

  return (
    <>
      <div
        className="cards"
        onClick={handleCardClick}
        style={{ cursor: "pointer" }}
      >
        <div>
          <p>{props.employeeName || "اسم الموظف"}</p>
        </div>
        <div className="displayflexjust alinmentcenter">
          <div>
            <p>{props.typeOfWarning || "نوع الإنذار"}</p>
          </div>
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

      {showDetails && (
        <EmployeeWarningDetails
          warning={warningDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
