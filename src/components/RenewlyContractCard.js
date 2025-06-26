import "../style/Cards.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function RenewlyContractCard({
  tenantName,
  contractNumber,
  contractStatue,
  contractId,
  contractType,
  renewalOrder, // إضافة البروب الجديد
  onDelete,
  onClick,
}) {
  const navigate = useNavigate();

  // دالة التوجيه لصفحة التعديل حسب نوع العقد
  const handleEdit = (e) => {
    e.stopPropagation();
    if (contractType === "RenewlyContract")
      navigate(`/management/Contracts/EditRenewlyContract/${contractId}`);
  };

  // دالة الحذف مع رسالة تأكيد
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (onDelete) await onDelete(contractId, contractType); // فقط نفذ الحذف، لا تظهر SweetAlert هنا
  };

  return (
    <div className="cards" onClick={onClick} style={{ cursor: "pointer" }}>
      <div>
        <p>{contractNumber}</p>
        <p>{renewalOrder ? renewalOrder : contractStatue}</p>{" "}
        {/* عرض ترتيب التجديد إذا توفر */}
      </div>
      <div className="displayflexjust alinmentcenter">
        <div>
          <p>{tenantName}</p>
        </div>
        <div
          className="displayflexjust deleteAndEditicons"
          onClick={(e) => e.stopPropagation()}
        >
          <FiEdit
            size="27"
            style={{ cursor: "pointer" }}
            onClick={handleEdit}
          />
          <div className="spacebetweenicons"></div>
          <RiDeleteBin6Line
            size="30"
            style={{ cursor: "pointer" }}
            onClick={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
