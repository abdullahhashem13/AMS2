import "../style/home.css";

export default function Sectionmanagment(props) {
  return (
    <a
      className="divsection zoom-div"
      href={props.namepage}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
      target="_self"
    >
      <div className="divsection-title">
        <h4 className="divsection-title-text no-select">{props.text}</h4>
      </div>
      <img src={props.image} alt="" className="image" />
    </a>
  );
}
