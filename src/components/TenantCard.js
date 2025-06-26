import React from "react";
import "../style/Cards.css";
// @ts-ignore
import { RiDeleteBin6Line } from "react-icons/ri";
// @ts-ignore
import { FiEdit } from "react-icons/fi";
import { useState } from "react";
// @ts-ignore
import Swal from "sweetalert2";
// @ts-ignore
import { useNavigate } from "react-router-dom";
import TenantDetails from "../pages/management/Tenants/TenantDetails";

export default function TenantCard(props) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [tenantDetails, setTenantDetails] = useState(null);

  const handleEdit = (e) => {
    e.stopPropagation(); // منع انتشار الحدث للعنصر الأب
    navigate(`/management/Tenants/EditTenant/${props.id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // منع انتشار الحدث للعنصر الأب
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
          // إرسال طلب حذف إلى الخادم
          const response = await fetch(
            `http://localhost:3001/Tenants/${props.id}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("فشل في حذف المستأجر");
          }

          // إذا نجح الحذف، استدعاء دالة onDelete لتحديث واجهة المستخدم
          if (props.onDelete) {
            props.onDelete(props.id);
          }

          Swal.fire("تم الحذف!", "تم حذف المستأجر بنجاح.", "success");
        } catch (error) {
          console.error("Error deleting tenant:", error);
          Swal.fire("خطأ!", "حدث خطأ أثناء حذف المستأجر.", "error");
        }
      }
    });
  };

  const handleCardClick = async () => {
    try {
      const response = await fetch(`http://localhost:3001/Tenants/${props.id}`);
      if (response.ok) {
        const data = await response.json();
        setTenantDetails(data);
        setShowDetails(true);
      }
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
  };

  return (
    <>
      <div
        className="cards"
        onClick={handleCardClick}
        style={{ cursor: "pointer" }}
      >
        {/* تأخذ اسم المستأجر */}
        <div>
          <p>{props.name || "اسم المستأجر"}</p>
        </div>
        {/*  */}
        {/* ياخذ أيقونات الحذف والتعديل */}
        <div className="displayflexjust alinmentcenter">
          {/* تأخذ حالة المستأجر إذا كان مطلوبًا */}
          <div>
            <p>{props.tenantStatus || ""}</p>
          </div>
          {/*  */}
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
          {/*  */}
        </div>
      </div>

      {showDetails && (
        <TenantDetails
          tenant={tenantDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
