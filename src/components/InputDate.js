import "../style/Inputwithlabel.css";
export default function InputDate(props) {
  return (
    <div className="Inputwithlabel">
      <input
        type="date"
        required
        className="Inputfield"
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.change}
      ></input>
      <label htmlFor={props.name} className="labeltextinput">
        {props.text}
      </label>
    </div>
  );
}
