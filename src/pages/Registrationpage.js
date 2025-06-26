import "../style/styleful.css";

import Divwhite from "../components/DivWhite.js";
import DivRegistration from "../components/DivRegistration.js";
function Registrationpage() {
  return (
    <div className="displayflex">
      <Divwhite />
      <div className="spacebetweepagesLoginAndRegistration"></div>
      <DivRegistration />
    </div>
  );
}

export default Registrationpage;
