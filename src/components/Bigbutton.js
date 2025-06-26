import "../style/Mainbutton.css";
// @ts-ignore
import { useNavigate } from "react-router-dom";

export default function Bigbutton(props) {
  const navigate = useNavigate();

  return (
    <div>
      <button className="Bigbutton" onClick={() => navigate(props.path)}>
        {props.text}
      </button>
    </div>
  );
}
