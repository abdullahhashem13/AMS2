import "../style/Cards.css";
// @ts-ignore
import { RiDeleteBin6Line } from "react-icons/ri";
// @ts-ignore
import { FiEdit } from "react-icons/fi";
// @ts-ignore
import { RxUpdate } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

export default function ContractCard({
  tenantName,
  contractNumber,
  contractStatue,
  contractId,
  contractType,
  onDelete,
  onClick,
}) {
  const navigate = useNavigate();

  // دالة التوجيه لصفحة التعديل حسب نوع العقد
  const handleEdit = (e) => {
    e.stopPropagation();
    if (contractType === "LandFarmingContract")
      navigate(`/management/Contracts/EditLandFarmingContract/${contractId}`);
    if (contractType === "WhiteLandContract")
      navigate(`/management/Contracts/EditWhiteLandContract/${contractId}`);
    if (contractType === "PropertyContract")
      navigate(`/management/Contracts/EditPropertyContract/${contractId}`);
  };

  // دالة التوجيه لصفحة التجديد
  const handleRenew = (e) => {
    e.stopPropagation();
    navigate(`/management/Contracts/AddRenewlyContract/${contractId}`);
  };

  return (
    <div className="cards" onClick={onClick} style={{ cursor: "pointer" }}>
      {/* تأخذ اسم العين وارقم */}
      <div>
        <p>{contractNumber}</p>
        <p>{contractStatue}</p>
      </div>
      {/*  */}
      {/* ياخذ حالة العين و ايقونات */}
      <div className="displayflexjust alinmentcenter">
        {/* تأخذ حالة العين */}
        <div>
          <p>{tenantName}</p>
        </div>
        {/*  */}
        {/* تاخذ ايقونتين الحذف والتعديل */}
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
          {contractType !== "RenewlyContract" && (
            <RxUpdate
              size="27"
              style={{ cursor: "pointer" }}
              onClick={handleRenew}
            />
          )}
          <div className="spacebetweenicons"></div>
          <RiDeleteBin6Line
            size="30"
            style={{ cursor: "pointer" }}
            onClick={() => onDelete && onDelete(contractId, contractType)}
          />
        </div>
        {/*  */}
      </div>
    </div>
  );
}
