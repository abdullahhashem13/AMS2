import "../style/Cards.css";
// @ts-ignore
import { RiDeleteBin6Line } from "react-icons/ri";
// @ts-ignore
import { FiEdit } from "react-icons/fi";
// @ts-ignore
import { useNavigate } from "react-router-dom";

export default function AggrementCard({
  builderMosque_name,
  aggrement_agreementType,
  aggrement_aggrementNo, // رقم الاتفاقية للعرض
  id, // id الحقيقي للحذف
  onDelete,
  onDetails, // جديد: دالة فتح التفاصيل المنبثقة
}) {
  const navigate = useNavigate();
  // دالة الحذف بدون تأكيد (التأكيد في صفحة العرض فقط)
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/management/Aggrements/EditAggrement/${id}`);
  };

  // دالة فتح التفاصيل عند الضغط على الكارد
  const handleCardClick = (e) => {
    // تجاهل الضغط إذا كان على أيقونة التعديل أو الحذف
    if (e.target.closest(".deleteAndEditicons") || e.target.closest("svg")) {
      return;
    }
    if (onDetails) {
      onDetails(id);
    } else {
      navigate(`/management/Aggrements/AgreementDetails/${id}`);
    }
  };

  return (
    <div
      className="cards"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      {/* تاخذ نوع الاتفاقية ورقم الاتفاقية */}
      <div>
        <p>{aggrement_agreementType}</p>
        <p>{aggrement_aggrementNo}</p> {/* عرض رقم الاتفاقية فقط */}
      </div>
      {/* ياخذ اسم الباني و ايقونات */}
      <div className="displayflexjust alinmentcenter">
        <div>
          <p>{builderMosque_name}</p>
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
  );
}
