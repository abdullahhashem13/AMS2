import "../style/Checkpoint.css";
export default function Checkpoint(props) {
  return (
    <div className="checkpoint">
      <input
        type="checkbox"
        value={props.value}
        name={props.name}
        id={props.name}
        onChange={props.change}
      ></input>
      <label htmlFor={props.name}>{props.text}</label>
    </div>
  );
}
