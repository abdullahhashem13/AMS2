import "../style/Inputwithlabel.css";
export default function Inputwithlabel(props) {
  return (
    <div className="Inputwithlabel">
      <input
        type="text"
        className="Inputfield"
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.change}
        disabled={props.disabled}
      ></input>
      <label htmlFor={props.name} className="labeltextinput">
        {props.text}
      </label>
    </div>
  );
}
