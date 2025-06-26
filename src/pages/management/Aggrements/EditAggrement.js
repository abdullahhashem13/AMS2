import React, { useState, useEffect } from "react";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import Submitinput from "../../../components/submitinput";
import InputDate from "../../../components/InputDate";
import SelectWithLabel3 from "../../../components/SelectWithLabel3";
import SearchableSelect from "../../../components/SearchableSelect";
import Inputwithlabel from "../../../components/Inputwithlabel";
// @ts-ignore
import { useNavigate, useParams } from "react-router-dom";

export default function EditAggrement() {
  const [formData, setFormData] = useState({
    aggrement_aggrementNo: "",
    aggrement_agreementType: "بناء",
    aggrement_date: new Date().toISOString().split("T")[0],
    aggrement_timeToBuild: "",
    aggrement_firstWitness: "",
    aggrement_secondWitness: "",
    aggrement_height: "",
    aggrement_width: "",
    aggrement_totalArea: "",
    aggrement_north: "",
    aggrement_south: "",
    aggrement_east: "",
    aggrement_west: "",
    builderMosque_name: "",
  });
  const [error, setErrors] = useState({
    aggrement_aggrementNo: "",
    builderMosque_name: "",
    general: "",
  });
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
            (aggrement) => aggrement.aggrement_aggrementNo
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
      case "aggrement_aggrementNo":
        if (!value) return "يجب تعبئة الحقل";
        if (!/^\d+$/.test(value))
          return "يجب أن يحتوي رقم الاتفاقية على أرقام فقط";
        // لا تتحقق من التكرار إذا كان نفس الرقم الحالي
        if (
          value !== formData.aggrement_aggrementNo &&
          existingAgreementNumbers.includes(value)
        )
          return "رقم الاتفاقية موجود بالفعل";
        return "";
      case "aggrement_timeToBuild":
        if (!value) return "يجب تعبئة الحقل";
        if (!/^[\u0600-\u06FF\s0-9]+$/.test(value))
          return "يجب أن تحتوي فترة البناء على أحرف عربية وأرقام فقط";
        return "";
      case "aggrement_firstWitness":
      case "aggrement_secondWitness":
        if (!value) return "يجب تعبئة الحقل";
        if (!/^[\u0600-\u06FF\s]+$/.test(value))
          return "يجب أن يحتوي الاسم على أحرف عربية فقط";
        if (value.trim().split(/\s+/).length < 4)
          return "يجب أن يكون اسم الشاهد رباعي";
        return "";
      case "aggrement_height":
        if (!value) return "يجب تعبئة الحقل";
        if (!/^\d+$/.test(value)) return "يجب أن يحتوي الحقل على أرقام فقط";
        return "";
      case "aggrement_width":
        if (!value) return "يجب تعبئة الحقل";
        if (!/^\d+$/.test(value)) return "يجب أن يحتوي الحقل على أرقام فقط";
        return "";
      case "builderMosque_name":
        if (!value) return "يجب اختيار اسم الباني";
        return "";
      case "aggrement_north":
      case "aggrement_south":
      case "aggrement_east":
      case "aggrement_west":
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
    if (name === "aggrement_height" || name === "aggrement_width") {
      const height =
        name === "aggrement_height" ? value : formData.aggrement_height;
      const width =
        name === "aggrement_width" ? value : formData.aggrement_width;
      if (/^\d+$/.test(height) && /^\d+$/.test(width)) {
        updatedForm.aggrement_totalArea = (
          parseInt(height) * parseInt(width)
        ).toString();
      } else {
        updatedForm.aggrement_totalArea = "";
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
      aggrement_aggrementNo: "",
      builderMosque_name: "",
      general: "",
      aggrement_timeToBuild: "",
      aggrement_firstWitness: "",
      aggrement_secondWitness: "",
      aggrement_height: "",
      aggrement_width: "",
      aggrement_north: "",
      aggrement_south: "",
      aggrement_east: "",
      aggrement_west: "",
    };
    if (!formData.aggrement_aggrementNo) {
      newErrors.aggrement_aggrementNo = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.aggrement_aggrementNo)) {
      newErrors.aggrement_aggrementNo =
        "يجب أن يحتوي رقم الاتفاقية على أرقام فقط";
      isValid = false;
    } else if (
      formData.aggrement_aggrementNo !== formData.aggrement_aggrementNo &&
      existingAgreementNumbers.includes(formData.aggrement_aggrementNo)
    ) {
      newErrors.aggrement_aggrementNo = "رقم الاتفاقية موجود بالفعل";
      isValid = false;
    }
    if (!formData.aggrement_timeToBuild) {
      newErrors.aggrement_timeToBuild = "يجب تعبئة الحقل";
      isValid = false;
    } else if (
      !/^[\u0600-\u06FF\s0-9]+$/.test(formData.aggrement_timeToBuild)
    ) {
      newErrors.aggrement_timeToBuild =
        "يجب أن تحتوي فترة البناء على أحرف عربية وأرقام فقط";
      isValid = false;
    }
    if (!formData.aggrement_firstWitness) {
      newErrors.aggrement_firstWitness = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.aggrement_firstWitness)) {
      newErrors.aggrement_firstWitness =
        "يجب أن يحتوي الاسم على أحرف عربية فقط";
      isValid = false;
    } else {
      const words = formData.aggrement_firstWitness.trim().split(/\s+/);
      if (words.length < 4) {
        newErrors.aggrement_firstWitness = "يجب أن يكون اسم الشاهد رباعي";
        isValid = false;
      }
    }
    if (!formData.aggrement_secondWitness) {
      newErrors.aggrement_secondWitness = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.aggrement_secondWitness)) {
      newErrors.aggrement_secondWitness =
        "يجب أن يحتوي الاسم على أحرف عربية فقط";
      isValid = false;
    } else {
      const words = formData.aggrement_secondWitness.trim().split(/\s+/);
      if (words.length < 4) {
        newErrors.aggrement_secondWitness = "يجب أن يكون اسم الشاهد رباعي";
        isValid = false;
      }
    }
    if (!formData.aggrement_height) {
      newErrors.aggrement_height = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.aggrement_height)) {
      newErrors.aggrement_height = "يجب أن يحتوي الحقل على أرقام فقط";
      isValid = false;
    }
    if (!formData.aggrement_width) {
      newErrors.aggrement_width = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.aggrement_width)) {
      newErrors.aggrement_width = "يجب أن يحتوي الحقل على أرقام فقط";
      isValid = false;
    }
    if (!formData.builderMosque_name) {
      newErrors.builderMosque_name = "يجب اختيار اسم الباني";
      isValid = false;
    }
    [
      "aggrement_north",
      "aggrement_south",
      "aggrement_east",
      "aggrement_west",
    ].forEach((field) => {
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
                    value={formData.aggrement_date}
                    name="aggrement_date"
                    change={handleChange}
                    text="تاريخ"
                  />
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <SelectWithLabel3
                    value={formData.aggrement_agreementType}
                    name="aggrement_agreementType"
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
                    value={formData.aggrement_aggrementNo}
                    name="aggrement_aggrementNo"
                    change={handleChange}
                    text="رقم الاتفاقية"
                    className="inputwithlabel"
                  />
                  {error.aggrement_aggrementNo && (
                    <div className="error-message">
                      {error.aggrement_aggrementNo}
                    </div>
                  )}
                </div>
              </div>
              <div className="RowForInsertinputs" style={{ marginBottom: 25 }}>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.aggrement_secondWitness}
                    name="aggrement_secondWitness"
                    change={handleChange}
                    text="الشاهد الثاني"
                  />
                  {// @ts-ignore
                  error.aggrement_secondWitness && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.aggrement_secondWitness
                      }
                    </div>
                  )}
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.aggrement_firstWitness}
                    name="aggrement_firstWitness"
                    change={handleChange}
                    text="الشاهد الاول"
                  />
                  {// @ts-ignore
                  error.aggrement_firstWitness && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.aggrement_firstWitness
                      }
                    </div>
                  )}
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.aggrement_timeToBuild}
                    name="aggrement_timeToBuild"
                    change={handleChange}
                    text="فترة البناء"
                  />
                  {// @ts-ignore
                  error.aggrement_timeToBuild && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.aggrement_timeToBuild
                      }
                    </div>
                  )}
                </div>
              </div>
              <div className="RowForInsertinputs">
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.aggrement_totalArea}
                    name="aggrement_totalArea"
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
                    value={formData.aggrement_width}
                    name="aggrement_width"
                    change={handleChange}
                    text="العرض"
                  />
                  {// @ts-ignore
                  error.aggrement_width && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.aggrement_width
                      }
                    </div>
                  )}
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.aggrement_height}
                    name="aggrement_height"
                    change={handleChange}
                    text="الطول"
                  />
                  {// @ts-ignore
                  error.aggrement_height && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.aggrement_height
                      }
                    </div>
                  )}
                </div>
              </div>
              {/* حقل اسم الباني فقط */}
              <div
                className="RowForInsertinputs"
                style={{ marginTop: 30, width: "30%" }}
              >
                <div className="input-container">
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
                      value={formData.aggrement_south}
                      name="aggrement_south"
                      change={handleChange}
                      text="جنوب"
                    />
                    {// @ts-ignore
                    error.aggrement_south && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          error.aggrement_south
                        }
                      </div>
                    )}
                  </div>
                  <div className="widthbetween"></div>
                  <div className="widthbetween"></div>
                  <div className="widthbetween"></div>
                  <div className="input-container">
                    <Inputwithlabel
                      value={formData.aggrement_north}
                      name="aggrement_north"
                      change={handleChange}
                      text="شمال"
                    />
                    {// @ts-ignore
                    error.aggrement_north && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          error.aggrement_north
                        }
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ height: 20 }}></div>
                <div className="RowForInsertinputs">
                  <div className="input-container">
                    <Inputwithlabel
                      value={formData.aggrement_west}
                      name="aggrement_west"
                      change={handleChange}
                      text="غرب"
                    />
                    {// @ts-ignore
                    error.aggrement_west && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          error.aggrement_west
                        }
                      </div>
                    )}
                  </div>
                  <div className="widthbetween"></div>
                  <div className="widthbetween"></div>
                  <div className="widthbetween"></div>
                  <div className="input-container">
                    <Inputwithlabel
                      value={formData.aggrement_east}
                      name="aggrement_east"
                      change={handleChange}
                      text="شرق"
                    />
                    {// @ts-ignore
                    error.aggrement_east && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          error.aggrement_east
                        }
                      </div>
                    )}
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
