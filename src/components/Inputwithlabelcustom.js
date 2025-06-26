import "../style/Inputwithlabel.css";
export default function Inputwithlabelcustom(props) {
  return (
    <div className="Inputwithlabel">
      <input
        style={{
          width: props.widthinput,
        }}
        type="text"
        required
        className="Inputfield"
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.change}
      ></input>
      <label
        htmlFor={props.name}
        className="labeltextinput"
        style={{
          width: props.widthlabel,
        }}
      >
        {props.text}
      </label>
    </div>
  );
}
