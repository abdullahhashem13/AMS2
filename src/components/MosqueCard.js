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
import MosqueDetails from "../pages/management/Mosques/MosqueDetails";

export default function MosqueCard(props) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [mosqueDetails, setMosqueDetails] = useState(null);

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/management/Mosques/EditMosque/${props.id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    // الكود الحالي للحذف
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
            `http://localhost:3001/Mosques/${props.id}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("فشل في حذف المسجد");
          }

          if (props.onDelete) {
            props.onDelete(props.id);
          }

          Swal.fire("تم الحذف!", "تم حذف المسجد بنجاح.", "success");
        } catch (error) {
          console.error("Error deleting mosque:", error);
          Swal.fire("خطأ!", "حدث خطأ أثناء حذف المسجد.", "error");
        }
      }
    });
  };

  const handleCardClick = async () => {
    try {
      const response = await fetch(`/JsonData/AllData.json`);
      if (response.ok) {
        const data = await response.json();
        // البحث عن المسجد المحدد باستخدام props.id
        const mosque = data.Mosques.find((mosque) => mosque.id === props.id);
        if (mosque) {
          setMosqueDetails(mosque);
          setShowDetails(true);
        }
      }
    } catch (error) {
      console.error("Error fetching mosque details:", error);
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
          <p>{props.name}</p>
        </div>
        <div className="displayflexjust alinmentcenter">
          <div>
            <p>{props.statue}</p>
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
        <MosqueDetails
          mosque={mosqueDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
// تأكد أن جميع عمليات العرض واستخدام props تستخدم الأسماء الموحدة للحقول المذكورة.
