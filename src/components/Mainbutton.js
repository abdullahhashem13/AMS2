import "../style/Mainbutton.css";
// @ts-ignore
import { useNavigate } from "react-router-dom";

export default function Mainbutton(props) {
  const navigate = useNavigate();

  return (
    <div>
      <button className="mainbutton" onClick={() => navigate(props.path)}>
        {props.text}
      </button>
    </div>
  );
}
