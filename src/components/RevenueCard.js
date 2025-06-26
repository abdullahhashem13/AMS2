import React, { useState } from "react";
import "../style/Cards.css";
// @ts-ignore
import { RiDeleteBin6Line } from "react-icons/ri";
// @ts-ignore
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import Swal from "sweetalert2";
import RevenueDetails from "../pages/management/Revenues/RevenueDetails";

export default function RevenueCard(props) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [revenueDetails, setRevenueDetails] = useState(null);

  const handleEdit = (e) => {
    e.stopPropagation(); // منع انتشار الحدث
    // توجيه المستخدم إلى صفحة تعديل الإيراد
    navigate(`/management/Revenues/EditRevenues/${props.id}`);
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:3001/Revenues/${props.id}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("فشل في حذف الإيراد");
          }

          // استدعاء دالة التحديث من الأب
          if (props.onDelete) {
            props.onDelete(props.id);
          }

          Swal.fire("تم الحذف!", "تم حذف الإيراد بنجاح.", "success");
        } catch (error) {
          console.error("Error deleting revenue:", error);
          Swal.fire("خطأ!", "حدث خطأ أثناء حذف الإيراد.", "error");
        }
      }
    });
  };

  const handleCardClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/Revenues/${props.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setRevenueDetails(data);
        setShowDetails(true);
      } else {
        console.error("Failed to fetch revenue details");
      }
    } catch (error) {
      console.error("Error fetching revenue details:", error);
    }
  };

  return (
    <>
      <div
        className="cards"
        onClick={handleCardClick}
        style={{ cursor: "pointer" }}
      >
        {/* تأخذ رقم السند */}
        <div>
          <p>{props.bondNumber || "رقم السند"}</p>
        </div>
        {/* ياخذ اسم المستأجر و ايقونات */}
        <div className="displayflexjust alinmentcenter">
          {/* تأخذ اسم المستأجر */}
          <div>
            <p>{props.tenantName || "اسم المستأجر"}</p>
          </div>
          {/* تاخذ ايقونتين الحذف والتعديل */}
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
        <RevenueDetails
          revenue={revenueDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
