import Saidbar from "../../components/Saidbar";

export default function Dashboard() {
  return (
    <div className="displayflexhome">
      <Saidbar />
      {/* مساحة أخذنها بمثابة السايد البار لانه عملت السايد بار ثابت على اليسار */}
      <div className="sizeboxUnderSaidbar"></div>
      {/*  */}
      <h1>Dashboard</h1>
    </div>
  );
}
