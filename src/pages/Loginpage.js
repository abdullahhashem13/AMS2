import "../style/Body.css";

import Divwhite from "../components/DivWhite.js";
import DivLogin from "../components/DivLogin.js";
function Loginpage() {
  return (
    <div className="displayflex">
      <Divwhite />
      <div className="spacebetweepagesLoginAndRegistration"></div>
      <DivLogin />
    </div>
  );
}

export default Loginpage;
