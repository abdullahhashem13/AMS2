import "../style/submitinput.css";
export default function ButtonInput(props) {
  return (
    <input
      className="submitinput"
      type="button"
      value={props.text}
      onClick={props.onClick}
    ></input>
  );
}
// button
