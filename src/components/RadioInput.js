export default function RadioInput(props) {
  return (
    <div
      style={{
        width: "14%",
      }}
    >
      <input
        type="radio"
        name={props.name}
        id={props.value}
        value={props.value}
        checked={props.checked}
        onChange={props.change}
      ></input>
      <label className="labeltextinput" htmlFor={props.value}>
        {props.text}
      </label>
    </div>
  );
}
