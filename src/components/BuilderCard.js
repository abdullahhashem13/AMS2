import "../style/Cards.css";
// @ts-ignore
import { RiDeleteBin6Line } from "react-icons/ri";
// @ts-ignore
import { FiEdit } from "react-icons/fi";

export default function BuilderCard({
  builderMosque_name,
  onEdit,
  onDelete,
  onClick,
}) {
  return (
    <div className="cards" style={{ cursor: "pointer" }} onClick={onClick}>
      <div>
        <p>{builderMosque_name}</p>
      </div>
      <div
        className="displayflexjust deleteAndEditicons"
        onClick={(e) => e.stopPropagation()}
      >
        <FiEdit size="27" onClick={onEdit} style={{ cursor: "pointer" }} />
        <div className="spacebetweenicons"></div>
        <RiDeleteBin6Line
          size="30"
          onClick={onDelete}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}
