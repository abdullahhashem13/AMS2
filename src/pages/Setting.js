import Saidbar from "../components/saidbar";

export default function Setting() {
  return (
    <div className="displayflexhome">
      <Saidbar />
      {/* مساحة أخذنها بمثابة السايد البار لانه عملت السايد بار ثابت على اليسار */}
      <div className="sizeboxUnderSaidbar"></div>
      {/*  */}
      <h1>Setting</h1>
    </div>
  );
}
