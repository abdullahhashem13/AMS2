import React, { useState, useEffect } from "react";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Submitinput from "../../../components/submitinput";
import InputDate from "../../../components/InputDate";
import SelectWithLabel3 from "../../../components/SelectWithLabel3";
import SearchableSelect from "../../../components/SearchableSelect";
import Inputwithlabel from "../../../components/Inputwithlabel";
// @ts-ignore
import { useNavigate, useParams } from "react-router-dom";

export default function EditAggrement() {
  const [formData, setFormData] = useState({
    aggrementNo: "",
    agreementType: "بناء",
    date: new Date().toISOString().split("T")[0],
    timeToBuild: "",
    firstWitness: "",
    secondWitness: "",
    height: "",
    width: "",
    totalArea: "",
    north: "",
    south: "",
    east: "",
    west: "",
    builderMosque_name: "",
    mosque_id: "",
  });
  const [error, setErrors] = useState({
    aggrementNo: "",
    builderMosque_name: "",
    mosque_id: "",
    general: "",
  });
  const [mosques, setMosques] = useState([]);
  // جلب المساجد
  useEffect(() => {
    const fetchMosques = async () => {
      try {
        const response = await fetch("http://localhost:3001/Mosques");
        if (response.ok) {
          const data = await response.json();
          setMosques(data);
        } else {
          setMosques([]);
        }
      } catch {
        setMosques([]);
      }
    };
    fetchMosques();
  }, []);
  // دالة اختيار المسجد
  const handleMosqueSelect = (e) => {
    setFormData((prev) => ({
      ...prev,
      mosque_id: e.target.value || "",
    }));
    setErrors((prev) => ({ ...prev, mosque_id: "" }));
  };
  const [existingAgreementNumbers, setExistingAgreementNumbers] = useState([]);
  const [existingBuilders, setExistingBuilders] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // جلب بيانات الاتفاقية الحالية
    const fetchAggrement = async () => {
      try {
        const response = await fetch(`http://localhost:3001/Aggrements/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          general: "فشل في جلب بيانات الاتفاقية",
        }));
      }
    };
    fetchAggrement();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aggrementResponse = await fetch(
          "http://localhost:3001/Aggrements"
        );
        if (aggrementResponse.ok) {
          const aggrementData = await aggrementResponse.json();
          const agreementNumbers = aggrementData.map(
            (aggrement) => aggrement.aggrementNo
          );
          setExistingAgreementNumbers(agreementNumbers);
        }
      } catch (error) {
        // ...
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBuilders = async () => {
      try {
        const response = await fetch("/JsonData/AllData.json");
        if (response.ok) {
          const allData = await response.json();
          if (allData.Builder && Array.isArray(allData.Builder)) {
            setExistingBuilders(allData.Builder);
          } else {
            setExistingBuilders([]);
          }
        } else {
          const apiResponse = await fetch("http://localhost:3001/Builders");
          if (apiResponse.ok) {
            const apiBuilders = await apiResponse.json();
            setExistingBuilders(apiBuilders);
          }
        }
      } catch (error) {
        // ...
      }
    };
    fetchBuilders();
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case "aggrementNo":
        if (!value) return "يجب تعبئة الحقل";
        if (!/^\d+$/.test(value))
          return "يجب أن يحتوي رقم الاتفاقية على أرقام فقط";
        // لا تتحقق من التكرار إذا كان نفس الرقم الحالي
        if (
          value !== formData.aggrementNo &&
          existingAgreementNumbers.includes(value)
        )
          return "رقم الاتفاقية موجود بالفعل";
        return "";
      case "timeToBuild":
        if (!value) return "يجب تعبئة الحقل";
        if (!/^[\u0600-\u06FF\s0-9]+$/.test(value))
          return "يجب أن تحتوي فترة البناء على أحرف عربية وأرقام فقط";
        return "";
      case "firstWitness":
      case "secondWitness":
        if (!value) return "يجب تعبئة الحقل";
        if (!/^[\u0600-\u06FF\s]+$/.test(value))
          return "يجب أن يحتوي الاسم على أحرف عربية فقط";
        if (value.trim().split(/\s+/).length < 4)
          return "يجب أن يكون اسم الشاهد رباعي";
        return "";
      case "height":
        if (!value) return "يجب تعبئة الحقل";
        if (!/^\d+$/.test(value)) return "يجب أن يحتوي الحقل على أرقام فقط";
        return "";
      case "width":
        if (!value) return "يجب تعبئة الحقل";
        if (!/^\d+$/.test(value)) return "يجب أن يحتوي الحقل على أرقام فقط";
        return "";
      case "builderMosque_name":
        if (!value) return "يجب اختيار اسم الباني";
        return "";
      case "north":
      case "south":
      case "east":
      case "west":
        if (!value) return "يجب تعبئة الحقل";
        if (!/^[\u0600-\u06FF\s0-9]+$/.test(value))
          return "يجب أن يحتوي الحقل على أحرف عربية وأرقام فقط";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };
    if (name === "height" || name === "width") {
      const height = name === "height" ? value : formData.height;
      const width = name === "width" ? value : formData.width;
      if (/^\d+$/.test(height) && /^\d+$/.test(width)) {
        updatedForm.totalArea = (parseInt(height) * parseInt(width)).toString();
      } else {
        updatedForm.totalArea = "";
      }
    }
    setFormData(updatedForm);
    setErrors({ ...error, [name]: validateField(name, value) });
  };

  const handleBuilderSelect = (e) => {
    setFormData((prev) => ({
      ...prev,
      builderMosque_name: e.target.value || "",
    }));
    setErrors((prev) => ({ ...prev, builderMosque_name: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {
      aggrementNo: "",
      builderMosque_name: "",
      general: "",
      timeToBuild: "",
      firstWitness: "",
      secondWitness: "",
      height: "",
      width: "",
      north: "",
      south: "",
      east: "",
      west: "",
    };
    if (!formData.aggrementNo) {
      newErrors.aggrementNo = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.aggrementNo)) {
      newErrors.aggrementNo = "يجب أن يحتوي رقم الاتفاقية على أرقام فقط";
      isValid = false;
    } else if (
      formData.aggrementNo !== formData.aggrementNo &&
      existingAgreementNumbers.includes(formData.aggrementNo)
    ) {
      newErrors.aggrementNo = "رقم الاتفاقية موجود بالفعل";
      isValid = false;
    }
    if (!formData.timeToBuild) {
      newErrors.timeToBuild = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s0-9]+$/.test(formData.timeToBuild)) {
      newErrors.timeToBuild =
        "يجب أن تحتوي فترة البناء على أحرف عربية وأرقام فقط";
      isValid = false;
    }
    if (!formData.firstWitness) {
      newErrors.firstWitness = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.firstWitness)) {
      newErrors.firstWitness = "يجب أن يحتوي الاسم على أحرف عربية فقط";
      isValid = false;
    } else {
      const words = formData.firstWitness.trim().split(/\s+/);
      if (words.length < 4) {
        newErrors.firstWitness = "يجب أن يكون اسم الشاهد رباعي";
        isValid = false;
      }
    }
    if (!formData.secondWitness) {
      newErrors.secondWitness = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.secondWitness)) {
      newErrors.secondWitness = "يجب أن يحتوي الاسم على أحرف عربية فقط";
      isValid = false;
    } else {
      const words = formData.secondWitness.trim().split(/\s+/);
      if (words.length < 4) {
        newErrors.secondWitness = "يجب أن يكون اسم الشاهد رباعي";
        isValid = false;
      }
    }
    if (!formData.height) {
      newErrors.height = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.height)) {
      newErrors.height = "يجب أن يحتوي الحقل على أرقام فقط";
      isValid = false;
    }
    if (!formData.width) {
      newErrors.width = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.width)) {
      newErrors.width = "يجب أن يحتوي الحقل على أرقام فقط";
      isValid = false;
    }
    if (!formData.builderMosque_name) {
      newErrors.builderMosque_name = "يجب اختيار اسم الباني";
      isValid = false;
    }
    if (!formData.mosque_id) {
      newErrors.mosque_id = "يجب اختيار المسجد";
      isValid = false;
    }
    ["north", "south", "east", "west"].forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "يجب تعبئة الحقل";
        isValid = false;
      } else if (!/^[\u0600-\u06FF\s0-9]+$/.test(formData[field])) {
        newErrors[field] = "يجب أن يحتوي الحقل على أحرف عربية وأرقام فقط";
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/Aggrements/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        navigate("/management/Aggrements/DisplaySearchAggrements");
      } else {
        setErrors((prev) => ({ ...prev, general: "فشل في حفظ التعديلات" }));
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, general: "حدث خطأ أثناء الحفظ" }));
    }
  };

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="تعديل اتفاقية" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div></div>
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Aggrements/ReportAggrement"
              />
              <Mainbutton
                text="بحث"
                path="/management/Aggrements/DisplaySearchAggrements"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Aggrements/AddAggrement"
              />
            </div>
          </div>
          <form className="divforconten" onSubmit={handleSubmit}>
            <Managementdata dataname="بيانات الاتفاقية" />
            <div className="divforaddmosque">
              <div
                className="RowForInsertinputs"
                style={{ marginBottom: 25, marginTop: 15 }}
              >
                <div className="input-container">
                  <InputDate
                    value={formData.date}
                    name="date"
                    change={handleChange}
                    text="تاريخ"
                  />
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <SelectWithLabel3
                    value={formData.agreementType}
                    name="agreementType"
                    change={handleChange}
                    value1="بناء"
                    value2="هدم واعادة بناء"
                    value3="تشطيب"
                    text="نوع الإتفاقية"
                  />
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.aggrementNo}
                    name="aggrementNo"
                    change={handleChange}
                    text="رقم الاتفاقية"
                    className="inputwithlabel"
                  />
                  {error.aggrementNo && (
                    <div className="error-message">{error.aggrementNo}</div>
                  )}
                </div>
              </div>
              <div className="RowForInsertinputs" style={{ marginBottom: 25 }}>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.secondWitness}
                    name="secondWitness"
                    change={handleChange}
                    text="الشاهد الثاني"
                  />
                  {
                    // @ts-ignore
                    error.secondWitness && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          error.secondWitness
                        }
                      </div>
                    )
                  }
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.firstWitness}
                    name="firstWitness"
                    change={handleChange}
                    text="الشاهد الاول"
                  />
                  {
                    // @ts-ignore
                    error.firstWitness && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          error.firstWitness
                        }
                      </div>
                    )
                  }
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.timeToBuild}
                    name="timeToBuild"
                    change={handleChange}
                    text="فترة البناء"
                  />
                  {
                    // @ts-ignore
                    error.timeToBuild && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          error.timeToBuild
                        }
                      </div>
                    )
                  }
                </div>
              </div>
              <div className="RowForInsertinputs">
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.totalArea}
                    name="totalArea"
                    change={() => {}}
                    text="الإجمالي"
                    disabled={true}
                    readOnly={true}
                    style={{ backgroundColor: "#f0f0f0" }}
                  />
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.width}
                    name="width"
                    change={handleChange}
                    text="العرض"
                  />
                  {
                    // @ts-ignore
                    error.width && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          error.width
                        }
                      </div>
                    )
                  }
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.height}
                    name="height"
                    change={handleChange}
                    text="الطول"
                  />
                  {
                    // @ts-ignore
                    error.height && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          error.height
                        }
                      </div>
                    )
                  }
                </div>
              </div>
              <div
                className="RowForInsertinputs"
                style={{
                  marginTop: 30,
                  width: "60%",
                  display: "flex",
                  gap: 18,
                }}
              >
                <div className="input-container" style={{ flex: 1 }}>
                  <SearchableSelect
                    name="builderMosque_name"
                    text="اسم الباني"
                    options={existingBuilders
                      .filter(
                        (builder) =>
                          builder &&
                          (builder.name ||
                            builder.builderMosque_name ||
                            builder.fullName)
                      )
                      .map((builder) => ({
                        value:
                          builder.name ||
                          builder.builderMosque_name ||
                          builder.fullName,
                        label:
                          builder.name ||
                          builder.builderMosque_name ||
                          builder.fullName,
                      }))}
                    value={formData.builderMosque_name}
                    change={handleBuilderSelect}
                  />
                  {error.builderMosque_name && (
                    <div className="error-message">
                      {error.builderMosque_name}
                    </div>
                  )}
                </div>
                <div className="input-container" style={{ flex: 1 }}>
                  <SearchableSelect
                    name="mosque_id"
                    text="تابع لمسجد"
                    options={mosques.map((mosque) => ({
                      value: mosque.id,
                      label: mosque.name,
                    }))}
                    value={formData.mosque_id}
                    change={handleMosqueSelect}
                  />
                  {error.mosque_id && (
                    <div className="error-message">{error.mosque_id}</div>
                  )}
                </div>
              </div>
              <div className="RowForInsertinputs">
                <div className="deviderwithword">
                  <hr className="st_hr2managment"></hr>
                  <h2>الحدود</h2>
                  <hr className="st_hr1managment"></hr>
                </div>
              </div>
              <div style={{ width: "90%", marginLeft: "10%" }}>
                <div className="RowForInsertinputs">
                  <div className="input-container">
                    <Inputwithlabel
                      value={formData.south}
                      name="south"
                      change={handleChange}
                      text="جنوب"
                    />
                    {
                      // @ts-ignore
                      error.south && (
                        <div className="error-message">
                          {
                            // @ts-ignore
                            error.south
                          }
                        </div>
                      )
                    }
                  </div>
                  <div className="widthbetween"></div>
                  <div className="widthbetween"></div>
                  <div className="widthbetween"></div>
                  <div className="input-container">
                    <Inputwithlabel
                      value={formData.north}
                      name="north"
                      change={handleChange}
                      text="شمال"
                    />
                    {
                      // @ts-ignore
                      error.north && (
                        <div className="error-message">
                          {
                            // @ts-ignore
                            error.north
                          }
                        </div>
                      )
                    }
                  </div>
                </div>
                <div style={{ height: 20 }}></div>
                <div className="RowForInsertinputs">
                  <div className="input-container">
                    <Inputwithlabel
                      value={formData.west}
                      name="west"
                      change={handleChange}
                      text="غرب"
                    />
                    {
                      // @ts-ignore
                      error.west && (
                        <div className="error-message">
                          {
                            // @ts-ignore
                            error.west
                          }
                        </div>
                      )
                    }
                  </div>
                  <div className="widthbetween"></div>
                  <div className="widthbetween"></div>
                  <div className="widthbetween"></div>
                  <div className="input-container">
                    <Inputwithlabel
                      value={formData.east}
                      name="east"
                      change={handleChange}
                      text="شرق"
                    />
                    {
                      // @ts-ignore
                      error.east && (
                        <div className="error-message">
                          {
                            // @ts-ignore
                            error.east
                          }
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
              <div className="RowForInsertinputs">
                <Submitinput text="حفظ التعديلات" />
                {error.general && (
                  <div className="error-message">{error.general}</div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
