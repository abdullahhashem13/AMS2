import "../style/CardForTypesOfManagement.css";
// @ts-ignore
import { RiDeleteBin6Line } from "react-icons/ri";

export default function CardForTypesOfManagement(props) {
  return (
    <div className="CardForTypesOfManagement">
      <p>{props.text}</p>
      <div className="spacebetweentextandicon">
        <RiDeleteBin6Line
          size="23"
          onClick={props.onDelete}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}
