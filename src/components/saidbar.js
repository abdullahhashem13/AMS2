import "../style/saidbar.css";
import { Saidbardata } from "./saidbardata";

export default function Saidbar() {
  return (
    <div className="saidbar">
      {/* البروفايل */}
      <div className="displayflex">
        <div>
          <img
            src="/profile.png"
            alt="صورة البروفايل"
            className="imageprofile"
          />
        </div>
        <div className="centeritem">
          <p className="nameprofile">عبدالله هاشم الحامد</p>
          <p className="namerole"> ــــ مدير ــــ</p>
        </div>
      </div>
      {/* انتهى البروفايل */}
      {/* المنيو الجانبي */}
      <ul className="saidbarlist">
        {Saidbardata.map((val, key) => (
          <li
            className={`row ${val.title === "تسجيل الخروج" ? "logout" : ""}`} // إضافة فئة logout
            id={window.location.pathname === val.link ? "active" : ""}
            key={key}
            onClick={() => {
              window.location.pathname = val.link;
            }}
          >
            <div id="icon">{val.icon}</div>
            <div id="title">{val.title}</div>
          </li>
        ))}
      </ul>
      {/* انتهاء المنيو الجانبي */}
    </div>
  );
}
