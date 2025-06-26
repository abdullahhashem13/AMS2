import "../style/Inputwithlabel.css";
export default function SelectWithLabel4(props) {
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
        <option disabled defaultValue=""></option>

        <option value={props.value1}>{props.value1}</option>
        <option value={props.value2}>{props.value2}</option>
        <option value={props.value3}>{props.value3}</option>
        <option value={props.value4}>{props.value4}</option>
      </select>
      <label htmlFor={props.name} className="labeltextinput">
        {props.text}
      </label>
    </div>
  );
}
