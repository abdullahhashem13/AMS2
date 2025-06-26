import "../style/styleful.css";

// @ts-ignore
import { FaLock } from "react-icons/fa";
// @ts-ignore
import { MdPerson } from "react-icons/md";

// @ts-ignore
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DivLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  // @ts-ignore
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // تصحيح الخطأ هنا
  };
  // @ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("successful!");
      } else {
        const data = await response.json();

        if (data && data.message) {
          // تحقق من وجود data و data.message
          if (typeof data.message === "object") {
            setErrors({ ...errors, ...data.message }); // دمج أخطاء الخادم
          } else if (typeof data.message === "string") {
            setErrors({ ...errors, general: data.message }); // خطأ عام
          } else {
            setErrors({ ...errors, general: "Registration failed." });
          }
        } else {
          setErrors({ ...errors, general: "Registration failed." });
        }
      }
    } catch (err) {
      setErrors({ ...errors, general: "An error occurred." });
      console.error(err);
    }
  };

  return (
    //div that content all divs for login
    <div className="divforcontainerlogin">
      {/* first components or title */}
      <div className="divforlogintitle">
        <h1>نــــظــــام إدارة الاوقــــاف</h1>
      </div>
      {/* end of title */}
      {/* ................................................... */}
      {/* عنوان تسجيل الدخول */}

      <div className="sizebox30"></div>
      <div className="divforloginword">
        <hr className="st_hr2"></hr>
        <h2>تسجيل الدخول</h2>
        <hr className="st_hr1"></hr>
      </div>
      {/* انتهاء عنوان  */}
      {/* form for username and password */}
      <div>
        <form onSubmit={handleSubmit}>
          {/* div for username */}
          <div
            style={{
              position: "relative",
            }}
          >
            <label className="labelgeneral">اسم المستخدم</label>
            <input
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              type="text"
              className="inputgeneral2"
              placeholder="ادخل اسم المستخدم"
              dir="rtl"
            ></input>
            <MdPerson className="iconUserName"></MdPerson>
          </div>
          {/* end of user name */}
          {/* div for password */}
          <div className="sizebox30"></div>
          <div
            style={{
              position: "relative",
            }}
          >
            <label className="labelgeneral">كلمة السر</label>
            <input
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="inputgeneral2"
              placeholder="ادخل كلمة السر"
              dir="rtl"
            ></input>
            <FaLock className="iconPassword"></FaLock>
          </div>
          {/* end of password */}
          {/* check for remember */}
          <div className="sizebox10"></div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <label className="labelcheckbox">ذكـرنـي</label>
            <input type="checkbox" className="inputcheckbox"></input>
          </div>
          {/* end of checkbox */}
          <div className="sizebox30"></div>
          <div>
            <button className="inputbutton" onClick={() => navigate("/home")}>
              تـسـجـيـل
            </button>
            <div className="sizebox10"></div>
            <div
              style={{
                display: "flex",
                marginLeft: 60,
              }}
            >
              <a
                href="/Registrationpage"
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontFamily: "amiri",
                }}
              >
                إنشاء حساب
              </a>
              <div className="sizeboxwidth4"></div>
              <h5
                style={{
                  marginTop: 0,
                  color: "white",
                }}
              >
                اذا لم يكن لديك حساب فيمكنك
              </h5>
            </div>
            {/* </div>
          <div className="sizebox30"></div>
          <div className="divforloginword">
            <hr className="st_hr2"></hr>
            <h4>أو</h4>
            <hr className="st_hr1"></hr>
          </div>
          <div className="sizebox30"></div>
          <div>
            <button
              className="inputbutton"
              onClick={() => navigate("/Registrationpage")}
            >
              إنـشـاء حـسـاب
            </button> */}
          </div>
        </form>
      </div>
      {/* end of form */}
    </div>
  );
}
