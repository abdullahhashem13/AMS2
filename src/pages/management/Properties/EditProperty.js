import React, { useState, useEffect } from "react";
// @ts-ignore
import { useNavigate, useParams } from "react-router-dom"; // إضافة useParams لاستقبال معرف العين
import Bigbutton from "../../../components/Bigbutton";
import Inputwithlabel from "../../../components/Inputwithlabel";
import Mainbutton from "../../../components/Mainbutton";
import Managementdata from "../../../components/managementdata";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
// @ts-ignore
import Swal from "sweetalert2"; // إضافة Swal للرسائل
import SearchableSelect from "../../../components/SearchableSelect";
import Submitinput from "../../../components/submitinput";
import SelectWithLabel3 from "../../../components/SelectWithLabel3";

export default function EditProperty() {
  const navigate = useNavigate();
  const { id } = useParams(); // استقبال معرف العين من الرابط
  const [originalPropertyNumber, setOriginalPropertyNumber] = useState(""); // لتخزين رقم العين الأصلي
  const [formData, setFormData] = useState({
    property_number: "",
    property_type_id: "", // تغيير من property_type إلى property_type_id
    branch_id: "", // تغيير من branch_name إلى branch_id
    mosque_id: "", // تغيير من mosque_name إلى mosque_id
    property_rent: "",
    property_statue: "",
    property_governorate: "",
    property_city: "",
    property_neighborhood: "",
    property_north: "",
    property_south: "",
    property_east: "",
    property_west: "",
  });
  const [error, setErrors] = useState({});
  const [existingPropertyNumbers, setExistingPropertyNumbers] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [branches, setBranches] = useState([]); // إضافة حالة لتخزين الفروع
  const [mosques, setMosques] = useState([]); // إضافة حالة لتخزين المساجد

  // جلب بيانات العين المحددة والبيانات الأخرى عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب بيانات العين المحددة
        const propertyResponse = await fetch(
          `http://localhost:3001/Properties/${id}`
        );
        if (propertyResponse.ok) {
          const propertyData = await propertyResponse.json();
          setFormData(propertyData);
          setOriginalPropertyNumber(propertyData.property_number);
          console.log("Property data loaded:", propertyData);
        } else {
          console.error("Failed to fetch property:", propertyResponse.status);
          Swal.fire("خطأ", "لم يتم العثور على بيانات العين", "error");
        }

        // جلب أرقام العين الأخرى
        const propertiesResponse = await fetch(
          "http://localhost:3001/Properties"
        );
        if (propertiesResponse.ok) {
          const properties = await propertiesResponse.json();
          const numbers = properties
            .filter((property) => property.id !== id) // استبعاد العين الحالية
            .map((property) => property.property_number);
          setExistingPropertyNumbers(numbers);
        }

        // جلب أنواع الأعيان
        const typesResponse = await fetch(
          "http://localhost:3001/TypeOfProperty"
        );
        if (typesResponse.ok) {
          const types = await typesResponse.json();
          setPropertyTypes(types);
        }

        // جلب الفروع
        const branchesResponse = await fetch("http://localhost:3001/Branches");
        if (branchesResponse.ok) {
          const branchesData = await branchesResponse.json();
          setBranches(branchesData);
        }

        // جلب المساجد
        const mosquesResponse = await fetch("http://localhost:3001/Mosques");
        if (mosquesResponse.ok) {
          const mosquesData = await mosquesResponse.json();
          setMosques(mosquesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire("خطأ", "حدث خطأ أثناء جلب البيانات", "error");
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    // إزالة رسالة الخطأ للحقل الذي يتم تعديله
    const newErrors = { ...error };
    delete newErrors[name];

    // التحقق من رقم العين
    if (name === "property_number") {
      // التحقق من أن القيمة تتبع النمط المطلوب (رقم-رقم)
      const propertyNumberPattern = /^\d+-\d+$/;

      if (!value) {
        // @ts-ignore
        newErrors.property_number = "يجب تعبئة الحقل";
      } else if (!propertyNumberPattern.test(value)) {
        // @ts-ignore
        newErrors.property_number =
          "يجب أن يكون رقم العين بالشكل: رقم المسجد-رقم العين (مثال: 9-12)";
      } else if (
        value !== originalPropertyNumber &&
        existingPropertyNumbers.includes(value)
      ) {
        // @ts-ignore
        newErrors.property_number = "رقم العين موجود بالفعل";
      }
    }

    // التحقق من إيجار العين (أرقام فقط)
    if (name === "property_rent") {
      if (!value) {
        // @ts-ignore
        newErrors.property_rent = "يجب تعبئة الحقل";
      } else if (!/^\d+$/.test(value)) {
        // @ts-ignore
        newErrors.property_rent = "يجب أن يحتوي إيجار العين على أرقام فقط";
      }
    }

    // التحقق من حقول الموقع (أحرف عربية فقط)
    if (
      name === "property_governorate" ||
      name === "property_city" ||
      name === "property_neighborhood"
    ) {
      if (!value) {
        newErrors[name] = "يجب تعبئة الحقل";
      } else if (!/^[\u0600-\u06FF\s]+$/.test(value)) {
        newErrors[name] = "يجب أن يحتوي الحقل على أحرف عربية فقط";
      }
    }

    // التحقق من حقول الحدود (أحرف عربية وأرقام فقط)
    if (
      name === "property_north" ||
      name === "property_south" ||
      name === "property_east" ||
      name === "property_west"
    ) {
      if (!value) {
        newErrors[name] = "يجب تعبئة الحقل";
      } else if (!/^[\u0600-\u06FF0-9\s]+$/.test(value)) {
        newErrors[name] = "يجب أن يحتوي الحقل على أحرف عربية وأرقام فقط";
      }
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    // التحقق من رقم العين
    if (!formData.property_number) {
      errors.property_number = "يجب تعبئة الحقل";
      isValid = false;
    } else {
      const propertyNumberPattern = /^\d+-\d+$/;
      if (!propertyNumberPattern.test(formData.property_number)) {
        errors.property_number =
          "يجب أن يكون رقم العين بالشكل: رقم المسجد-رقم العين (مثال: 9-12)";
        isValid = false;
      } else if (
        formData.property_number !== originalPropertyNumber &&
        existingPropertyNumbers.includes(formData.property_number)
      ) {
        errors.property_number = "رقم العين موجود بالفعل";
        isValid = false;
      }
    }

    // التحقق من اختيار الفرع
    if (!formData.branch_id) {
      errors.branch_id = "يجب اختيار الفرع";
      isValid = false;
    }

    // التحقق من اختيار نوع العين
    if (!formData.property_type_id) {
      errors.property_type_id = "يجب اختيار نوع العين";
      isValid = false;
    }

    // التحقق من اختيار حالة العين
    if (!formData.property_statue) {
      errors.property_statue = "يجب اختيار حالة العين";
      isValid = false;
    }

    // التحقق من اختيار المسجد
    if (!formData.mosque_id) {
      errors.mosque_id = "يجب اختيار المسجد";
      isValid = false;
    }

    // التحقق من إيجار العين (أرقام فقط)
    if (!formData.property_rent) {
      errors.property_rent = "يجب تعبئة الحقل";
      isValid = false;
    } else if (!/^\d+$/.test(formData.property_rent)) {
      errors.property_rent = "يجب أن يحتوي إيجار العين على أرقام فقط";
      isValid = false;
    }

    // التحقق من حقول الموقع (أحرف عربية فقط)
    const locationFields = [
      { name: "property_governorate", label: "المحافظة" },
      { name: "property_city", label: "المدينة" },
      { name: "property_neighborhood", label: "الحي" },
    ];

    locationFields.forEach((field) => {
      if (!formData[field.name]) {
        errors[field.name] = "يجب تعبئة الحقل";
        isValid = false;
      } else if (!/^[\u0600-\u06FF\s]+$/.test(formData[field.name])) {
        errors[field.name] = `يجب أن تحتوي ${field.label} على أحرف عربية فقط`;
        isValid = false;
      }
    });

    // التحقق من حقول الحدود (أحرف عربية وأرقام فقط)
    const boundaryFields = [
      { name: "property_north", label: "الحد الشمالي" },
      { name: "property_south", label: "الحد الجنوبي" },
      { name: "property_east", label: "الحد الشرقي" },
      { name: "property_west", label: "الحد الغربي" },
    ];

    boundaryFields.forEach((field) => {
      if (!formData[field.name]) {
        errors[field.name] = "يجب تعبئة الحقل";
        isValid = false;
      } else if (!/^[\u0600-\u06FF0-9\s]+$/.test(formData[field.name])) {
        errors[
          field.name
        ] = `يجب أن يحتوي ${field.label} على أحرف عربية وأرقام فقط`;
        isValid = false;
      }
    });

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
      text: "هل تريد تحديث بيانات العين؟",
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
      // إنشاء كائن البيانات للإرسال
      const dataToSend = {
        ...formData,
        // إضافة أسماء الفرع والمسجد ونوع العين للعرض
        branch_name:
          branches.find((b) => b.id === formData.branch_id)?.name || "",
        mosque_name:
          mosques.find((m) => m.id === formData.mosque_id)?.mosque_name || "",
        property_type:
          propertyTypes.find((t) => t.id === formData.property_type_id)
            ?.property_type || "",
      };

      const response = await fetch(`http://localhost:3001/Properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        Swal.fire("تم التحديث!", "تم تحديث بيانات العين بنجاح.", "success");
        navigate("/management/Properties/DisplaySearchProperty");
      } else {
        const data = await response.json();
        setErrors({
          ...error,
          general: data.message || "فشل في تحديث البيانات",
        });
      }
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ أثناء التحديث" });
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
        <Managmenttitle title="إدارة الأعيان" />
        {/*  */}
        {/* يحمل ما تحت العنوان */}
        <div className="subhomepage">
          {/* يحمل البوتنس */}
          <div className="divforbuttons">
            {/* تم تقسيمهن الى دفيين عشان كل دف يكون في الطرف */}

            {/* الثاني */}
            <div>
              <Bigbutton
                text="أنواع الاعيان"
                path="/management/Properties/TypesProperty"
              />
            </div>
            {/* الاول */}
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Properties/ReportProperty"
              />
              <Mainbutton
                text="بحث"
                path="/management/Properties/DisplaySearchProperty"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Properties/AddProperty"
              />
            </div>
          </div>
          {/*  */}
          {/* يحمل المحتوى تحت البوتنس */}
          <form
            className="divforconten"
            onSubmit={handleSubmit}
            // action="/management/Properties/AddProperty"
          >
            <Managementdata dataname="تعديل بيانات العين" />
            <div className="RowForInsertinputs">
              <div className="input-container">
                <SearchableSelect
                  name="branch_id"
                  text="تابعة لفرع"
                  options={branches.map((branch) => ({
                    value: branch.id,
                    label: branch.name,
                  }))}
                  value={formData.branch_id}
                  change={handleChange}
                />
                {
                  // @ts-ignore
                  error.branch_id && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.branch_id
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <SearchableSelect
                  name="property_type_id"
                  text="نوع العين"
                  options={propertyTypes.map((type) => ({
                    value: type.id,
                    label: type.property_type,
                  }))}
                  value={formData.property_type_id}
                  change={handleChange}
                />
                {
                  // @ts-ignore
                  error.property_type_id && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.property_type_id
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.property_number}
                  name="property_number"
                  change={handleChange}
                  text="رقم العين"
                />
                {
                  // @ts-ignore
                  error.property_number && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.property_number
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div className="RowForInsertinputs">
              <div className="input-container">
                <SelectWithLabel3
                  value={formData.property_statue}
                  name="property_statue"
                  change={handleChange}
                  text="حالة العين"
                  // values
                  value1="متاحة"
                  value2="تحت الصيانة"
                  value3="مستأجرة"
                />
                {
                  // @ts-ignore
                  error.property_statue && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.property_statue
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.property_rent}
                  name="property_rent"
                  change={handleChange}
                  text="إيجار العين"
                />
                {
                  // @ts-ignore
                  error.property_rent && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.property_rent
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <SearchableSelect
                  name="mosque_id"
                  text="تابعة لمسجد"
                  options={mosques.map((mosque) => ({
                    value: mosque.id,
                    label: mosque.mosque_name,
                  }))}
                  value={formData.mosque_id}
                  change={handleChange}
                />
                {
                  // @ts-ignore
                  error.mosque_id && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.mosque_id
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div className="RowForInsertinputs">
              <div className="deviderwithword">
                <hr className="st_hr2managment"></hr>
                <h2>الموقع</h2>
                <hr className="st_hr1managment"></hr>
              </div>
            </div>
            <div className="RowForInsertinputs">
              <div className="input-container">
                <Inputwithlabel
                  value={formData.property_neighborhood}
                  name="property_neighborhood"
                  change={handleChange}
                  text="الحي"
                />
                {
                  // @ts-ignore
                  error.property_neighborhood && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.property_neighborhood
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.property_city}
                  name="property_city"
                  change={handleChange}
                  text="المدينة"
                />
                {
                  // @ts-ignore
                  error.property_city && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.property_city
                      }
                    </div>
                  )
                }
              </div>
              <div className="widthbetween"></div>
              <div className="input-container">
                <Inputwithlabel
                  value={formData.property_governorate}
                  name="property_governorate"
                  change={handleChange}
                  text="المحافظة"
                />
                {
                  // @ts-ignore
                  error.property_governorate && (
                    <div className="error-message">
                      {
                        // @ts-ignore
                        error.property_governorate
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div className="RowForInsertinputs">
              <div className="deviderwithword">
                <hr className="st_hr2managment"></hr>
                <h2>الحدود</h2>
                <hr className="st_hr1managment"></hr>
              </div>
            </div>
            <div
              style={{
                width: "90%",
                marginLeft: "10%",
              }}
            >
              <div className="RowForInsertinputs">
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.property_south}
                    name="property_south"
                    change={handleChange}
                    text="جنوب"
                  />
                  {
                    // @ts-ignore
                    error.property_south && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          error.property_south
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
                    value={formData.property_north}
                    name="property_north"
                    change={handleChange}
                    text="شمال"
                  />
                  {
                    // @ts-ignore
                    error.property_north && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          error.property_north
                        }
                      </div>
                    )
                  }
                </div>
              </div>
              <div
                style={{
                  height: 20,
                }}
              ></div>
              <div className="RowForInsertinputs">
                <div className="input-container">
                  <Inputwithlabel
                    value={formData.property_east}
                    name="property_east"
                    change={handleChange}
                    text="غرب"
                  />
                  {
                    // @ts-ignore
                    error.property_east && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          error.property_east
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
                    value={formData.property_west}
                    name="property_west"
                    change={handleChange}
                    text="شرق"
                  />
                  {
                    // @ts-ignore
                    error.property_west && (
                      <div className="error-message">
                        {
                          // @ts-ignore
                          error.property_west
                        }
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="RowForInsertinputs"></div>
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
