import "../style/submitinput.css";
export default function Submitinput(props) {
  return (
    <input
      className="submitinput"
      type="submit"
      value={props.text}
      onClick={props.onClick}
    ></input>
  );
}
// button
