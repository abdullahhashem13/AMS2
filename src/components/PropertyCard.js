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
import PropertyDetails from "../pages/management/Properties/PropertyDetails";

export default function PropertyCard(props) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState(null);

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/management/Properties/EditProperty/${props.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
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
            `http://localhost:3001/Properties/${props.id}`,
            {
              method: "DELETE",
            }
          );
          if (!response.ok) {
            throw new Error("فشل في حذف العين");
          }
          Swal.fire("تم الحذف!", "تم حذف العين بنجاح.", "success");
          if (props.onDelete) {
            props.onDelete(props.id);
          }
        } catch (error) {
          console.error("Error deleting property:", error);
          Swal.fire("خطأ!", "حدث خطأ أثناء حذف العين.", "error");
        }
      }
    });
  };

  const handleCardClick = async () => {
    try {
      // استخدام ملف JSON المحلي بدلاً من API
      const response = await fetch("/JsonData/AllData.json");
      if (response.ok) {
        const data = await response.json();
        // البحث عن العين المحددة باستخدام props.id
        const property = data.Properties.find((prop) => prop.id === props.id);
        if (property) {
          setPropertyDetails(property);
          setShowDetails(true);
        }
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
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
          <p>{props.number || "رقم العين"}</p>
          <p>{props.type || "نوع العين"}</p>
        </div>
        <div className="displayflexjust alinmentcenter">
          <div>
            <p>{props.status || "حالة العين"}</p>
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
        <PropertyDetails
          property={propertyDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
