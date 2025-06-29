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
import BranchDetails from "../pages/management/Branchs/BranchDetails";

export default function BranchCard(props) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [branchDetails, setBranchDetails] = useState(null);

  const handleEdit = (e) => {
    e.stopPropagation(); // منع انتشار الحدث للعنصر الأب
    navigate(`/management/Branchs/EditBranch/${props.id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // منع انتشار الحدث للعنصر الأب
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استعادة هذا الفرع!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://awgaff1.runasp.net/api/Branch/${props.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("فشل في حذف الفرع");

        props.onDelete(props.id);

        Swal.fire("تم الحذف!", "تم حذف الفرع بنجاح.", "success");
      } catch (error) {
        Swal.fire("خطأ!", "حدث خطأ أثناء حذف الفرع.", "error");
      }
    }
  };

  const handleCardClick = async () => {
    try {
      const response = await fetch(
        `http://awgaff1.runasp.net/api/Branch/${props.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setBranchDetails(data);
        setShowDetails(true);
      }
    } catch (error) {
      console.error("Error fetching branch details:", error);
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

      {showDetails && (
        <BranchDetails
          branch={branchDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
