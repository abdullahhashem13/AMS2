import { useState, useEffect } from "react";
// @ts-ignore
import { useNavigate, useParams } from "react-router-dom";
import Bigbutton from "../../../components/Bigbutton";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import SelectWithLabel3 from "../../../components/SelectWithLabel3";
import SelectWithLabelDynamic from "../../../components/SelectWithLabelDynamic";
import Submitinput from "../../../components/submitinput";
import RadioInput from "../../../components/RadioInput";
import SearchableSelect from "../../../components/SearchableSelect";
// @ts-ignore
import Swal from "sweetalert2";

export default function EditMosque() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    branch_id: "",
    type_id: "",
    statue: "",
    isForAwgaf: true,
    governorate: "",
    city: "",
    neighborhood: "",
    numberOfProperty: "",
  });
  const [errors, setErrors] = useState({});
  const [branches, setBranches] = useState([]);
  const [mosqueTypes, setMosqueTypes] = useState([]);
  const [existingMosqueNumbers, setExistingMosqueNumbers] = useState([]);
  const [originalMosqueNumber, setOriginalMosqueNumber] = useState("");

  // جلب بيانات المسجد المحدد والبيانات الأخرى عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب بيانات المسجد المحدد
        const mosqueResponse = await fetch(
          `http://localhost:3001/Mosques/${id}`
        );
        if (mosqueResponse.ok) {
          const mosqueData = await mosqueResponse.json();
          setFormData(mosqueData);
          setOriginalMosqueNumber(mosqueData.number);
          console.log("Mosque data loaded:", mosqueData);
        } else {
          console.error("Failed to fetch mosque:", mosqueResponse.status);
          Swal.fire("خطأ", "لم يتم العثور على بيانات المسجد", "error");
        }

        // جلب الفروع
        const branchesResponse = await fetch("http://localhost:3001/Branches");
        if (branchesResponse.ok) {
          const branchesData = await branchesResponse.json();
          setBranches(branchesData);
          console.log("Branches loaded:", branchesData);
        } else {
          console.error("Failed to fetch branches:", branchesResponse.status);
        }

        // جلب أنواع المساجد
        const typesResponse = await fetch("http://localhost:3001/TypeOfMosque");
        if (typesResponse.ok) {
          const typesData = await typesResponse.json();
          setMosqueTypes(typesData);
          console.log("Mosque types loaded:", typesData);
        } else {
          console.error("Failed to fetch mosque types:", typesResponse.status);
        }

        // جلب أرقام المساجد الموجودة
        const mosquesResponse = await fetch("http://localhost:3001/Mosques");
        if (mosquesResponse.ok) {
          const mosquesData = await mosquesResponse.json();
          setExistingMosqueNumbers(
            mosquesData
              .filter((mosque) => mosque.id !== id)
              .map((mosque) => mosque.number)
          );
        } else {
          console.error("Failed to fetch mosques:", mosquesResponse.status);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        Swal.fire("خطأ", "حدث خطأ أثناء جلب البيانات", "error");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // معالجة خاصة للراديو بوتن
    if (name === "isForAwgaf") {
      setFormData({
        ...formData,
        [name]: value === "true" || value === true,
      });
    } else {
      // تحديث البيانات العادية
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // إزالة رسالة الخطأ للحقل الذي يتم تعديله
    const newErrors = { ...errors };
    delete newErrors[name];
    setErrors(newErrors);

    // التحقق من رقم الاتفاقية
    if (name === "aggrement_aggrementNo") {
      if (value && !/^\d*$/.test(value)) {
        setErrors({
          ...newErrors,
          [name]: "يجب أن يحتوي رقم الاتفاقية على أرقام فقط",
        });
      }
    }

    // تحقق مباشر من صحة عدد الأعين
    if (name === "numberOfProperty") {
      if (value && !/^\d*$/.test(value)) {
        setErrors({
          ...errors,
          [name]: "يجب أن يحتوي عدد الأعين على أرقام فقط",
        });
        return;
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    // التحقق من اسم المسجد (أحرف عربية فقط)
    if (!formData.name) {
      errors.name = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.name)) {
      errors.name = "يجب أن يحتوي اسم المسجد على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من رقم المسجد (أرقام فقط ولا تزيد عن 3 خانات)
    if (!formData.number) {
      errors.number = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.number)) {
      errors.number = "يجب أن يحتوي رقم المسجد على أرقام فقط";
      isValid = false;
    } else if (formData.number.length > 3) {
      errors.number = "يجب ألا يزيد رقم المسجد عن 3 خانات";
      isValid = false;
    } else if (
      formData.number !== originalMosqueNumber &&
      existingMosqueNumbers.includes(formData.number)
    ) {
      errors.number = "رقم المسجد موجود بالفعل";
      isValid = false;
    }

    // التحقق من اختيار الفرع
    if (!formData.branch_id) {
      errors.branch_id = "يجب اختيار الفرع";
      isValid = false;
    }

    // التحقق من اختيار نوع المسجد
    if (!formData.type_id) {
      errors.type_id = "يجب اختيار نوع المسجد";
      isValid = false;
    }

    // التحقق من اختيار حالة المسجد
    if (!formData.statue) {
      errors.statue = "يجب اختيار حالة المسجد";
      isValid = false;
    }

    // التحقق من المحافظة (أحرف عربية فقط)
    if (!formData.governorate) {
      errors.governorate = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.governorate)) {
      errors.governorate = "يجب أن تحتوي المحافظة على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من المدينة (أحرف عربية فقط)
    if (!formData.city) {
      errors.city = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.city)) {
      errors.city = "يجب أن تحتوي المدينة على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من الحي (أحرف عربية فقط)
    if (!formData.neighborhood) {
      errors.neighborhood = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.neighborhood)) {
      errors.neighborhood = "يجب أن يحتوي الحي على أحرف عربية فقط";
      isValid = false;
    }

    // التحقق من عدد الأعين (أرقام فقط ولا يكون فارغًا)
    if (!formData.numberOfProperty) {
      errors.numberOfProperty = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.numberOfProperty)) {
      errors.numberOfProperty = "يجب أن يحتوي عدد الأعين على أرقام فقط";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // تأكيد التعديل
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "هل تريد تحديث بيانات المسجد؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، قم بالتحديث!",
      cancelButtonText: "إلغاء",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/Mosques/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire("تم التحديث!", "تم تحديث بيانات المسجد بنجاح.", "success");
        navigate("/management/Mosques/DisplaySearchMosque");
      } else {
        const data = await response.json();
        setErrors({
          ...errors,
          general: data.message || "فشل في تحديث البيانات",
        });
      }
    } catch (err) {
      setErrors({ ...errors, general: "حدث خطأ أثناء التحديث" });
      console.error(err);
    }
  };
  return (
    <div className="displayflexhome">
      <Saidbar />
      {/* مساحة أخذنها بمثابة السايد البار لانه عملت السايد بار ثابت على اليسار */}
      <div className="sizeboxUnderSaidbar"></div>
      {/*  */}
      {/* المحتوى الخاص بالصفحة */}
      <div className="homepage">
        {/* عنوان الصفحة */}
        <Managmenttitle title="إدارة المساجد" />
        {/*  */}
        {/* يحمل ما تحت العنوان */}
        <div className="subhomepage">
          {/* يحمل البوتنس */}
          <div className="divforbuttons">
            {/* تم تقسيمهن الى دفيين عشان كل دف يكون في الطرف */}
            {/* الثاني */}
            <div>
              <Bigbutton
                text="أنواع المساجد"
                path="/management/Mosques/TypesMosque"
              />
            </div>
            {/* الاول */}
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Mosques/ReportMosque"
              />
              <Mainbutton
                text="بحث"
                path="/management/Mosques/DisplaySearchMosque"
              />
              <Mainbutton text="إضافة" path="/management/Mosques/AddMosque" />
            </div>
          </div>
          {/*  */}
          {/* يحمل المحتوى تحت البوتنس */}
          <form className="divforconten" onSubmit={handleSubmit}>
            <Managementdata dataname="تعديل بيانات المسجد" />
            <div className="divforaddmosque">
              <div
                className="RowForInsertinputs"
                style={{
                  marginTop: 25,
                  marginBottom: 25,
                }}
              >
                <div className="input-container">
                  <SearchableSelect
                    name="branch_id"
                    text="تابعة لفرع"
                    options={branches.map((b) => ({
                      value: b.id,
                      label: b.name,
                    }))}
                    value={formData.branch_id}
                    change={handleChange}
                    placeholder="اختر الفرع"
                  />
                  {
                    // @ts-ignore
                    errors.branch_id && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          errors.branch_id
                        }
                      </div>
                    )
                  }
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.number}
                    name="number"
                    change={handleChange}
                    text="رقم المسجد"
                  />
                  {
                    // @ts-ignore
                    errors.number && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          errors.number
                        }
                      </div>
                    )
                  }
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.name}
                    name="name"
                    change={handleChange}
                    text="اسم المسجد"
                  />
                  {
                    // @ts-ignore
                    errors.name && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          errors.name
                        }
                      </div>
                    )
                  }
                </div>
              </div>
              <div className="RowForInsertinputs">
                <div className="input-container">
                  <SelectWithLabel3
                    value={formData.statue}
                    name="statue"
                    change={handleChange}
                    text="حالة المسجد"
                    value1="جاهز"
                    value2="قيد البناء"
                    value3="موقف"
                  />
                  {
                    // @ts-ignore
                    errors.statue && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          errors.statue
                        }
                      </div>
                    )
                  }
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.numberOfProperty}
                    name="numberOfProperty"
                    change={handleChange}
                    text="عدد الأعين"
                  />
                  {
                    // @ts-ignore
                    errors.numberOfProperty && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          errors.numberOfProperty
                        }
                      </div>
                    )
                  }
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <SelectWithLabelDynamic
                    value={formData.type_id}
                    name="type_id"
                    change={handleChange}
                    text="نوع المسجد"
                    options={mosqueTypes}
                    placeholder="اختر نوع المسجد"
                    valueKey="id"
                    displayKey="type"
                  />
                  {
                    // @ts-ignore
                    errors.type_id && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          errors.type_id
                        }
                      </div>
                    )
                  }
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  marginTop: "2%",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <RadioInput
                  text="تابع لأخرى"
                  name="isForAwgaf"
                  change={handleChange}
                  value={false}
                  checked={formData.isForAwgaf === false}
                />
                <RadioInput
                  text="تابع للاوقاف"
                  name="isForAwgaf"
                  change={handleChange}
                  value={true}
                  checked={formData.isForAwgaf === true}
                />
              </div>

              <div
                className="RowForInsertinputs"
                style={{
                  marginBottom: 10,
                }}
              >
                <div className="deviderwithword">
                  <hr className="st_hr2managment"></hr>
                  <h2>الموقع</h2>
                  <hr className="st_hr1managment"></hr>
                </div>
              </div>
              <div className="RowForInsertinputs">
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.neighborhood}
                    name="neighborhood"
                    change={handleChange}
                    text="الحي"
                  />
                  {
                    // @ts-ignore
                    errors.neighborhood && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          errors.neighborhood
                        }
                      </div>
                    )
                  }
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.city}
                    name="city"
                    change={handleChange}
                    text="المدينة"
                  />
                  {
                    // @ts-ignore
                    errors.city && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          errors.city
                        }
                      </div>
                    )
                  }
                </div>
                <div className="widthbetween"></div>
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.governorate}
                    name="governorate"
                    change={handleChange}
                    text="المحافظة"
                  />
                  {
                    // @ts-ignore
                    errors.governorate && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          errors.governorate
                        }
                      </div>
                    )
                  }
                </div>
              </div>
              <div className="RowForInsertinputs"></div>
            </div>
            <div className="RowForInsertinputs">
              <Submitinput text="حفظ التعديلات" />
            </div>
          </form>
          {/*  */}
        </div>
      </div>
      {/*  */}
    </div>
  );
}
