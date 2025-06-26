import { useState, useEffect } from "react";
import Bigbutton from "../../../components/Bigbutton";
import Checkpoint from "../../../components/checkpoint";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Submitinput from "../../../components/submitinput";
import "../../../style/Table.css";
import ButtonInput from "../../../components/ButtonInput";
import SelectWithLabel4 from "../../../components/SelectWithLabel4";
import SelectWithLabelDynamic from "../../../components/SelectWithLabelDynamic";
import SearchableSelect from "../../../components/SearchableSelect";

export default function ReportProperty() {
  const [formData, setFormData] = useState({
    branch_id: "الجميع",
    mosque_id: "الجميع",
    type_id: "الجميع",
    statue: "الجميع",
  });
  const [error, setErrors] = useState({});
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [mosques, setMosques] = useState([]);

  // الأعمدة القابلة للاضافة
  const [showgovernorate, setShowgovernorate] = useState(false);
  const [showCity, setShowCity] = useState(false);
  const [showNeighborhood, setShowNeighborhood] = useState(false);
  const [showRent, setShowRent] = useState(false);

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // جلب بيانات الأعيان
        const propertiesResponse = await fetch(
          "http://localhost:3001/Properties"
        );
        if (propertiesResponse.ok) {
          const propertiesData = await propertiesResponse.json();
          setProperties(propertiesData);
          setFilteredProperties(propertiesData);
        }

        // جلب أنواع الأعيان
        const typesResponse = await fetch(
          "http://localhost:3001/TypeOfProperty"
        );
        if (typesResponse.ok) {
          const typesData = await typesResponse.json();
          setPropertyTypes(typesData);
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

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // تطبيق الفلترة على البيانات
    let filtered = [...properties];

    // فلترة حسب الفرع
    if (formData.branch_id !== "الجميع") {
      filtered = filtered.filter(
        (property) => property.branch_id === formData.branch_id
      );
    }

    // فلترة حسب المسجد
    if (formData.mosque_id !== "الجميع") {
      filtered = filtered.filter(
        (property) => property.mosque_id === formData.mosque_id
      );
    }

    // فلترة حسب نوع العين
    if (formData.type_id !== "الجميع") {
      filtered = filtered.filter(
        (property) => property.type_id === formData.type_id
      );
    }

    // فلترة حسب حالة العين
    if (formData.statue !== "الجميع") {
      filtered = filtered.filter(
        (property) => property.statue === formData.statue
      );
    }

    setFilteredProperties(filtered);
  };

  // دالة طباعة
  const handlePrint = () => {
    const printContents = document.getElementById("propertyreport").outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  // دالة لتحديث الصفحة بعد اغلاق نافذة الطباعه
  useEffect(() => {
    const handleAfterPrint = () => {
      window.location.reload(); // تحديث الصفحة
    };

    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  // إعداد خيارات الفروع للقائمة المنسدلة
  const branchOptions = [
    { value: "الجميع", label: "جميع الفروع" },
    ...branches.map((branch) => ({
      value: branch.id,
      label: branch.name,
    })),
  ];

  // إعداد خيارات المساجد للقائمة المنسدلة
  const mosqueOptions = [
    { value: "الجميع", label: "جميع المساجد" },
    ...mosques.map((mosque) => ({
      value: mosque.id,
      label: mosque.name,
    })),
  ];

  // إعداد خيارات أنواع الأعيان للقائمة المنسدلة
  const propertyTypeOptions = [
    { value: "الجميع", label: "جميع الأنواع" },
    ...propertyTypes.map((type) => ({
      value: type.id,
      label: type.type,
    })),
  ];

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة الأعيان" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div>
              <Bigbutton
                text="أنواع الاعيان"
                path="/management/Properties/TypesProperty"
              />
            </div>
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
          <div>
            <form className="divforconten" onSubmit={handleSubmit}>
              <div className="RowForInsertinputs">
                <SearchableSelect
                  name="mosque_id"
                  text="المسجد"
                  options={mosqueOptions}
                  value={formData.mosque_id}
                  change={handleChange}
                />
                <div className="widthbetween"></div>
                <SearchableSelect
                  name="branch_id"
                  text="الفرع"
                  options={branchOptions}
                  value={formData.branch_id}
                  change={handleChange}
                />
                <div className="widthbetween"></div>
                <SearchableSelect
                  name="type_id"
                  text="نوع العين"
                  options={propertyTypeOptions}
                  value={formData.type_id}
                  change={handleChange}
                />
              </div>
              <div className="RowForInsertinputs">
                <div className="displayflexjust">
                  <Checkpoint
                    text="الحي"
                    change={(e) => setShowNeighborhood(e.target.checked)}
                  />
                  <Checkpoint
                    text="المدينة"
                    change={(e) => setShowCity(e.target.checked)}
                  />
                  <Checkpoint
                    text="المحافظة"
                    change={(e) => setShowgovernorate(e.target.checked)}
                  />
                  <Checkpoint
                    text="الإيجار"
                    change={(e) => setShowRent(e.target.checked)}
                  />
                </div>
                <div
                  style={{
                    width: "29.5%",
                  }}
                >
                  <SelectWithLabel4
                    name="statue"
                    text="حالة العين"
                    value={formData.statue}
                    change={handleChange}
                    // values
                    value1="الجميع"
                    value2="متاحة"
                    value3="تحت الصيانة"
                    value4="مستأجرة"
                  />
                </div>
              </div>
              <div className="RowForInsertinputs">
                <Submitinput text="نتيجة" />
              </div>
              <div className="divfortable">
                {loading ? (
                  <p>جاري تحميل البيانات...</p>
                ) : (
                  <table id="propertyreport">
                    <thead>
                      <tr>
                        {showgovernorate && <th>المحافظة</th>}
                        {showCity && <th>المدينة</th>}
                        {showNeighborhood && <th>الحي</th>}
                        {showRent && <th>الإيجار</th>}
                        <th>الفرع</th>
                        <th>المسجد</th>
                        <th>حالة العين</th>
                        <th>نوع العين</th>
                        <th>رقم العين</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProperties.length > 0 ? (
                        filteredProperties.map((property) => (
                          <tr key={property.id}>
                            {showgovernorate && <td>{property.governorate}</td>}
                            {showCity && <td>{property.city}</td>}
                            {showNeighborhood && (
                              <td>{property.neighborhood}</td>
                            )}
                            {showRent && <td>{property.rent}</td>}
                            <td>
                              {(() => {
                                const mosque = mosques.find(
                                  (m) =>
                                    String(m.id) === String(property.mosque_id)
                                );
                                const branch = branches.find(
                                  (b) =>
                                    String(b.id) === String(mosque?.branch_id)
                                );
                                return branch?.name || "";
                              })()}
                            </td>
                            <td>
                              {mosques.find((m) => m.id === property.mosque_id)
                                ?.name || ""}
                            </td>
                            <td>{property.statue}</td>
                            <td>
                              {propertyTypes.find(
                                (t) => t.id === property.type_id
                              )?.type || ""}
                            </td>
                            <td>{property.number}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9}>
                            لا توجد بيانات متطابقة مع معايير البحث
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="RowForInsertinputs">
                <ButtonInput text="طباعة" onClick={handlePrint} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
