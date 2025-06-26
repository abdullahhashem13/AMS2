import React from "react";
import "../style/Cards.css";
// @ts-ignore
import { RiDeleteBin6Line } from "react-icons/ri";
// @ts-ignore
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ExpenseCard(props) {
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.stopPropagation(); // منع انتشار الحدث

    // طباعة المعرف للتأكد من وجوده
    console.log("Expense ID:", props.id);

    // التنقل إلى صفحة التعديل
    navigate(`/management/Expenses/EditExpense/${props.id}`);
  };

  return (
    <div className="cards">
      {/* تأخذ رقم السند */}
      <div>
        <p>{props.bondNumber || "رقم السند"}</p>
      </div>
      {/* ياخذ اسم المسجد و ايقونات */}
      <div className="displayflexjust alinmentcenter">
        {/* تأخذ اسم المسجد */}
        <div>
          <p>{props.mosqueName || "اسم المسجد"}</p>
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
            onClick={props.onDelete}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
}
