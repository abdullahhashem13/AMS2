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
import TenantWarningDetails from "../pages/management/Tenants/TenantWarningDetails";

export default function TenantWarningCard(props) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [warningDetails, setWarningDetails] = useState(null);

  const handleEdit = (e) => {
    e.stopPropagation(); // منع انتشار الحدث للعنصر الأب
    navigate(`/management/Tenants/TenantWarningEdit/${props.id}`);
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
            `http://localhost:3001/TenantWaring/${props.id}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("فشل في حذف الإنذار");
          }

          // إذا نجح الحذف، استدعاء دالة onDelete لتحديث واجهة المستخدم
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
        `http://localhost:3001/TenantWaring/${props.id}`
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
        {/* اسم المستأجر على اليمين */}
        <div>
          <p>{props.tenantName || "اسم المستأجر"}</p>
        </div>
        {/* نوع الإنذار على اليسار مع أيقونات الحذف والتعديل */}
        <div className="displayflexjust alinmentcenter">
          {/* نوع الإنذار */}
          <div>
            <p>{props.warningType || "نوع الإنذار"}</p>
          </div>
          {/* أيقونات الحذف والتعديل */}
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
        <TenantWarningDetails
          warning={warningDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
