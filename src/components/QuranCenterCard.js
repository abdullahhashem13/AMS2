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
import QuranCenterDetails from "../pages/management/Gauidnces/QuranCenterDetails";

export default function QuranCenterCard(props) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [centerDetails, setCenterDetails] = useState(null);

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/management/Gauidnces/EditQuranCenter/${props.id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
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
            `http://localhost:3001/Gauidnces/${props.id}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("فشل في حذف المركز");
          }

          if (props.onDelete) {
            props.onDelete(props.id);
          }

          Swal.fire("تم الحذف!", "تم حذف المركز بنجاح.", "success");
        } catch (error) {
          console.error("Error deleting quran center:", error);
          Swal.fire("خطأ!", "حدث خطأ أثناء حذف المركز.", "error");
        }
      }
    });
  };

  const handleCardClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/Gauidnces/${props.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setCenterDetails(data);
        setShowDetails(true);
      }
    } catch (error) {
      console.error("Error fetching quran center details:", error);
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
            <p>{props.mosqueName || ""}</p>
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
        <QuranCenterDetails
          center={centerDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
