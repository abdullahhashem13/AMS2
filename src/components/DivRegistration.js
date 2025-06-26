// @ts-nocheck
// @ts-ignore
import { MdPerson } from "react-icons/md";
// @ts-ignore
import { FaLock } from "react-icons/fa";
// @ts-ignore
import { FaUserCircle } from "react-icons/fa";
// @ts-ignore
import { MdPhoneAndroid } from "react-icons/md";
// @ts-ignore
import { FaLocationDot } from "react-icons/fa6";
// @ts-ignore
import { FaUserGraduate } from "react-icons/fa";
// @ts-ignore
import { FaTransgender } from "react-icons/fa";
import React, { useState } from "react";

export default function DivRegistration() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    educationalQualification: "",
    gender: "",
  });

  const [errors, setErrors] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // مسح الخطأ عند التغيير
  };

  const validateUsername = (username) => {
    if (!username) {
      return "يجب تعبئة الحقل";
    } else if (username.length < 3 || username.length > 20) {
      return "اسم المستخدم يجب أن يكون بين 3 و 20 حرفًا";
    } else if (/[\u0600-\u06FF]/.test(username)) {
      return "يجب اسم المستخدم ان يكون احرف غير العربية";
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) {
      return "يجب تعبئة الحقل";
    } else if (password.length < 8) {
      // مثال: كلمة المرور يجب أن تكون 8 أحرف على الأقل
      return "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }
    return null;
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return "يجب تعبئة الحقل";
    } else if (confirmPassword !== password) {
      return "كلمة السر غير متطابقة";
    }
    return null;
  };

  const validateFullName = (fullName) => {
    if (!fullName) {
      return "يجب تعبئة الحقل";
    } else if (/^[a-zA-Z]+$/.test(fullName)) {
      return "يجب ان يكون الاسم باللغة العربية";
    }
    return null;
  };

  const validatePhoneNumber = (phoneNumber) => {
    const numbersOnly = phoneNumber.replace(/[^0-9]/g, "");
    if (!phoneNumber) {
      return "يجب تعبئة الحقل";
    } else if (numbersOnly.length !== 9) {
      return "يجب ان يكون ارقام ويتكون من 9 ارقام";
    }

    return null;
  };

  const validateAddress = (address) => {
    if (!address) {
      return "يجب تعبئة الحقل";
    } else if (/^[a-zA-Z]+$/.test(address)) {
      return "يجب ان يكون العنوان باللغة العربية";
    }
    return null;
  };

  const validateForm = () => {
    let newErrors = {};

    newErrors.username = validateUsername(formData.username);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );
    newErrors.fullName = validateFullName(formData.fullName);
    newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber);
    newErrors.address = validateAddress(formData.address);

    setErrors(newErrors); // تحديث errors بكائن newErrors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/Registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Registration successful!");
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
    <div className="divforcontainerlogin">
      <div className="divforlogintitle">
        <h1>نــــظــــام إدارة الاوقــــاف</h1>
      </div>
      {/* end of title */}
      {/* ................................................... */}
      {/* عنوان تسجيل الدخول */}
      {/* <div className="sizebox10"></div> */}
      <div className="divforloginword">
        <hr className="st_hr2"></hr>
        <h2
          style={{
            margin: 0,
          }}
        >
          إنشاء حساب
        </h2>
        <hr className="st_hr1"></hr>
      </div>
      {/* انتهاء عنوان  */}
      <div>
        <form onSubmit={handleSubmit}>
          {/* div for username */}
          <div
            style={{
              position: "relative",
            }}
          >
            <label className="labelgeneral" htmlFor="username">
              اسم المستخدم
            </label>
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              type="text"
              className="inputgeneral"
              placeholder="ادخل اسم المستخدم"
              dir="rtl"
            ></input>
            <MdPerson className="iconUserNameRe"></MdPerson>
            {errors.username && ( // تحقق من وجود خطأ في حقل اسم المستخدم
              <p className="erorrinput1">{errors.username}</p>
            )}
          </div>
          {/* end of user name */}
          {/* div for password */}
          <div className="sizebox10"></div>
          <div
            style={{
              position: "relative",
            }}
          >
            <label className="labelgeneral" htmlFor="password">
              كلمة السر
            </label>
            <input
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="inputgeneral"
              placeholder="ادخل كلمة السر"
              dir="rtl"
            ></input>
            <FaLock className="iconPasswordRe"></FaLock>
            {errors.password && ( // تحقق من وجود خطأ في حقل اسم المستخدم
              <p className="erorrinput1">{errors.password}</p>
            )}
          </div>
          {/* end of password */}
          {/* div for confirm password */}
          <div className="sizebox10"></div>
          <div
            style={{
              position: "relative",
            }}
          >
            <label className="labelgeneral" htmlFor="confirmPassword">
              تأكيد كلمة السر
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              className="inputgeneral"
              placeholder="ادخل تأكيد كلمة السر"
              dir="rtl"
            ></input>
            <FaLock className="iconPasswordRe"></FaLock>
            {errors.confirmPassword && ( // تحقق من وجود خطأ في حقل اسم المستخدم
              <p className="erorrinput1">{errors.confirmPassword}</p>
            )}
          </div>
          {/* end of confirm password */}
          {/* div for ful name */}
          <div className="sizebox10"></div>
          <div
            style={{
              position: "relative",
            }}
          >
            <label className="labelgeneral" htmlFor="fullName">
              الإسم الرباعي
            </label>
            <input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              type="text"
              className="inputgeneral"
              placeholder="ادخل الإسم الرباعي"
              dir="rtl"
            ></input>
            <FaUserCircle className="iconfulname"></FaUserCircle>
            {errors.fullName && ( // تحقق من وجود خطأ في حقل اسم المستخدم
              <p className="erorrinput1">{errors.fullName}</p>
            )}
          </div>
          {/* end of full name */}
          {/* div for number phone */}
          <div className="sizebox10"></div>
          <div
            style={{
              position: "relative",
            }}
          >
            <label className="labelgeneral" htmlFor="phoneNumber">
              رقم الجوال
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              type="text"
              className="inputgeneral"
              placeholder="ادخل رقم الجوال"
              dir="rtl"
            ></input>
            <MdPhoneAndroid className="iconfulname"></MdPhoneAndroid>
            <img src="yemen.png" alt="yemen" className="iconyemen"></img>
            <h4 className="iconkeyyemen">+967</h4>
            {errors.phoneNumber && ( // تحقق من وجود خطأ في حقل اسم المستخدم
              <p className="erorrinput1">{errors.phoneNumber}</p>
            )}
          </div>
          {/* end of number phone */}
          {/* div for address */}
          <div className="sizebox10"></div>
          <div
            style={{
              position: "relative",
            }}
          >
            <label className="labelgeneral" htmlFor="address">
              العنوان
            </label>
            <input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              type="text"
              className="inputgeneral"
              placeholder="ادخل عنوان المسكن"
              dir="rtl"
            ></input>
            <FaLocationDot className="iconPasswordRe"></FaLocationDot>
            {errors.address && ( // تحقق من وجود خطأ في حقل اسم المستخدم
              <p className="erorrinput1">{errors.address}</p>
            )}
          </div>
          {/* end of address */}
          <div className="sizebox10"></div>
          {/* div for two inputs  */}
          <div
            style={{
              display: "flex",
            }}
          >
            {/* div for cabilities */}
            <div
              style={{
                position: "relative",
              }}
            >
              <label className="labelgeneral" htmlFor="gender">
                الجنس
              </label>
              {/* <input
                type="text"
                className="inputgeneralgender"
                placeholder="الجنس"
                dir="rtl"
              /> */}
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="inputgeneralgender"
                dir="rtl"
                required
              >
                <option value="" disabled></option>

                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
              <FaTransgender className="icongender"></FaTransgender>
            </div>

            {/* end for cabilities */}

            <div className="sizeboxwidth20"></div>
            {/* div for gender */}
            <div
              style={{
                position: "relative",
              }}
            >
              <label
                className="labelgeneral"
                htmlFor="educationalQualification"
              >
                المؤهلات العلمية
              </label>
              {/* <input
                id="educationalQualification"
                name="educationalQualification"
                value={formData.educationalQualification}
                onChange={handleChange}
                type="text"
                className="inputgeneral3"
                placeholder="ادخل المؤهلات العلمية"
                dir="rtl"
              ></input> */}
              <select
                id="educationalQualification"
                name="educationalQualification"
                value={formData.educationalQualification}
                onChange={handleChange}
                className="inputgeneralgradu"
                dir="rtl"
                required
              >
                <option value="" disabled></option>
                <option value="ثانوي">ثانوي</option>
                <option value="دبلوم">دبلوم</option>
                <option value="بكلاريوس">بكلاريوس</option>
                <option value="ماجستير">ماجستير</option>
                <option value="دكتوراه">دكتوراه</option>
              </select>
              <FaUserGraduate className="icongrad"></FaUserGraduate>
            </div>
            {/* end for gender */}
          </div>
          <div className="sizebox20"></div>
          <div>
            <button
              type="submit"
              className="inputbutton"
              style={{
                marginLeft: 50,
              }}
              //   onClick={() => navigate("/Registrationpage")}
            >
              إنـشـاء
            </button>
            <div className="sizebox5"></div>
          </div>
        </form>
        <div
          style={{
            display: "flex",
            marginLeft: 115,
          }}
        >
          <a
            href="/"
            style={{
              color: "black",
              fontWeight: "bold",
              fontFamily: "amiri",
            }}
          >
            تسجيل الدخول
          </a>
          <div className="sizeboxwidth4"></div>
          <h5
            style={{
              marginTop: 0,
              color: "white",
            }}
          >
            اذا تملك حساب فيمكنك
          </h5>
        </div>
      </div>
    </div>
  );
}
