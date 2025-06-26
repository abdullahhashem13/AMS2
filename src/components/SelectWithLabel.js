import "../style/Inputwithlabel.css";
export default function SelectWithLabel(props) {
  return (
    <div className="SelectWithLabel">
      <select
        required
        className="selectInput"
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.change}
      >
        <option disabled value="">
          {`اختر ${props.text}`}
        </option>

        <option value={props.value1}>{props.value1}</option>
        <option value={props.value2}>{props.value2}</option>
      </select>
      <label htmlFor={props.name} className="labeltextinput">
        {props.text}
      </label>
    </div>
  );
}
