// @ts-nocheck
import "../style/styleful.css";
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

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Divwhite from "./DivWhite";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [errors, setErrors] = useState({});
  const [existingUsernames, setExistingUsernames] = useState([]);

  // جلب بيانات المستخدم الحالي وأسماء المستخدمين عند تحميل الصفحة
  useEffect(() => {
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        // جلب جميع أسماء المستخدمين
        setExistingUsernames(
          Array.isArray(data.Users) ? data.Users.map((u) => u.username) : []
        );
        // جلب بيانات المستخدم المطلوب
        if (Array.isArray(data.Users)) {
          const user = data.Users.find((u) => String(u.id) === String(id));
          if (user) {
            setFormData({
              username: user.username || "",
              password: user.password || "",
              confirmPassword: user.password || "",
              fullName: user.fullName || "",
              phoneNumber: user.phoneNumber || "",
              address: user.address || "",
              educationalQualification: user.educationalQualification || "",
              gender: user.gender || "",
            });
          }
        }
      });
  }, [id]);

  // ...existing code (all handlers, validation, and return JSX)...

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // مسح الخطأ عند التغيير
  };
  // نفس الفاليديشن الموجود في صفحة التسجيل
  const validateUsername = (username) => {
    if (!username) {
      return "يجب تعبئة الحقل";
    } else if (username.length < 3 || username.length > 20) {
      return "اسم المستخدم يجب أن يكون بين 3 و 20 حرفًا";
    } else if (/[^a-zA-Z0-9]/.test(username)) {
      return "يجب اسم المستخدم ان يكون احرف غير العربية";
    } else if (
      existingUsernames.includes(username) &&
      username !== formData.username // السماح باسم المستخدم الحالي
    ) {
      return "اسم المستخدم مستخدم بالفعل";
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) {
      return "يجب تعبئة الحقل";
    } else if (password.length < 8) {
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
    // يجب التأكد أن جميع القيم فارغة (null أو undefined)
    return Object.values(newErrors).every((err) => !err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    try {
      // تحديث بيانات المستخدم بدلاً من الإضافة
      const response = await fetch(`http://localhost:3001/Users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("User updated successfully!");
        navigate("/Dashboardfully/Dashboard");
      } else {
        const data = await response.json();
        if (data && data.message) {
          if (typeof data.message === "object") {
            setErrors({ ...errors, ...data.message });
          } else if (typeof data.message === "string") {
            setErrors({ ...errors, general: data.message });
          } else {
            setErrors({ ...errors, general: "User update failed." });
          }
        } else {
          setErrors({ ...errors, general: "User update failed." });
        }
      }
    } catch (err) {
      setErrors({ ...errors, general: "An error occurred." });
    }
  };
  return (
    <div
      className="divforcontainerlogin"
      style={{ display: "flex", flexDirection: "row", alignItems: "stretch" }}
    >
      <Divwhite />
      <div style={{ flex: 1 }}>
        <div className="divforlogintitle">
          <h1>نــــظــــام إدارة الاوقــــاف</h1>
        </div>
        <div className="divforloginword">
          <hr className="st_hr2" />
          <h2 style={{ margin: 0 }}>تعديل المستخدم</h2>
          <hr className="st_hr1" />
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="input-container" style={{ position: "relative" }}>
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
              />
              <MdPerson className="iconUserNameRe" />
              {errors.username && (
                <p className="erorrinput1">{errors.username}</p>
              )}
            </div>
            <div className="sizebox10"></div>
            <div className="input-container" style={{ position: "relative" }}>
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
              />
              <FaLock className="iconPasswordRe" />
              {errors.password && (
                <p className="erorrinput1">{errors.password}</p>
              )}
            </div>
            <div className="sizebox10"></div>
            <div className="input-container" style={{ position: "relative" }}>
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
              />
              <FaLock className="iconPasswordRe" />
              {errors.confirmPassword && (
                <p className="erorrinput1">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="sizebox10"></div>
            <div className="input-container" style={{ position: "relative" }}>
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
              />
              <FaUserCircle className="iconfulname" />
              {errors.fullName && (
                <p className="erorrinput1">{errors.fullName}</p>
              )}
            </div>
            <div className="sizebox10"></div>
            <div className="input-container" style={{ position: "relative" }}>
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
              />
              <MdPhoneAndroid className="iconfulname" />
              <img src="yemen.png" alt="yemen" className="iconyemen" />
              <h4 className="iconkeyyemen">+967</h4>
              {errors.phoneNumber && (
                <p className="erorrinput1">{errors.phoneNumber}</p>
              )}
            </div>
            <div className="sizebox10"></div>
            <div className="input-container" style={{ position: "relative" }}>
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
              />
              <FaLocationDot className="iconPasswordRe" />
              {errors.address && (
                <p className="erorrinput1">{errors.address}</p>
              )}
            </div>
            <div className="sizebox10"></div>
            <div style={{ display: "flex" }}>
              <div className="input-container" style={{ position: "relative" }}>
                <label className="labelgeneral" htmlFor="gender">
                  الجنس
                </label>
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
                <FaTransgender className="icongender" />
              </div>
              <div className="sizeboxwidth20"></div>
              <div className="input-container" style={{ position: "relative" }}>
                <label
                  className="labelgeneral"
                  htmlFor="educationalQualification"
                >
                  المؤهلات العلمية
                </label>
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
                <FaUserGraduate className="icongrad" />
              </div>
            </div>
            <div className="sizebox20"></div>
            <div>
              <button
                type="submit"
                className="inputbutton"
                style={{ marginLeft: 50 }}
              >
                حفظ التعديل
              </button>
              <div className="sizebox5"></div>
            </div>
          </form>
          <div style={{ display: "flex", marginLeft: 115 }}>
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
            <h5 style={{ marginTop: 0, color: "white" }}>
              اذا تملك حساب فيمكنك
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}
