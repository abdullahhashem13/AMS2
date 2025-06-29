import { useState, useEffect } from "react";
import Bigbutton from "../../../components/Bigbutton";
import Checkpoint from "../../../components/checkpoint";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import SelectWithLabel from "../../../components/SelectWithLabel";
import Submitinput from "../../../components/submitinput";
import "../../../style/Table.css";
import ButtonInput from "../../../components/ButtonInput";
import SelectWithLabel3 from "../../../components/SelectWithLabel3";

export default function ReportTenant() {
  const [formData, setFormData] = useState({
    gender: "الجميع(الذكر والأنثى)",
    type: "الجميع(الحاليين والسابقين)",
  });
  const [error, setErrors] = useState({});
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب بيانات المستأجرين عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // جلب بيانات المستأجرين
        const tenantsResponse = await fetch(
          "http://awgaff1.runasp.net/api/Tenant"
        );
        if (!tenantsResponse.ok) {
          throw new Error("فشل في جلب بيانات المستأجرين");
        }
        const tenantsData = await tenantsResponse.json();
        // دعم جميع أشكال استجابة الـ API
        let tenantsArr = [];
        if (Array.isArray(tenantsData)) {
          tenantsArr = tenantsData;
        } else if (Array.isArray(tenantsData.Tenants)) {
          tenantsArr = tenantsData.Tenants;
        } else if (Array.isArray(tenantsData.data)) {
          tenantsArr = tenantsData.data;
        } else if (Array.isArray(tenantsData.payload)) {
          tenantsArr = tenantsData.payload;
        } else if (Array.isArray(tenantsData.result)) {
          tenantsArr = tenantsData.result;
        }
        // تحويل الحقول لتوحيدها مع الكود المحلي
        tenantsArr = tenantsArr.map((tenant) => ({
          ...tenant,
          idNumber: tenant.idNumber || tenant.IdNumber || "",
          genders: tenant.genders || tenant.gender || "",
        }));
        setTenants(tenantsArr);
        setFilteredTenants(tenantsArr); // عرض جميع المستأجرين افتراضياً

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors({ general: error.message });
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
    try {
      // تطبيق الفلترة على البيانات المحلية
      let filtered = [...tenants];

      // فلترة حسب الجنس
      if (formData.gender && formData.gender !== "الجميع(الذكر والأنثى)") {
        filtered = filtered.filter(
          (tenant) => (tenant.genders || tenant.gender) === formData.gender
        );
      }

      // فلترة حسب نوع المستأجر
      if (formData.type && formData.type !== "الجميع(الحاليين والسابقين)") {
        filtered = filtered.filter((tenant) => tenant.type === formData.type);
      }

      setFilteredTenants(filtered);
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ أثناء الفلترة." });
      console.error(err);
    }
  };

  // الأعمدة القابلة للاضافة
  const [showIDnumber, setshowIDnumber] = useState(false);
  const [showgovernorate, setShowgovernorate] = useState(false);
  const [showcity, setShowcity] = useState(false);
  const [showneighborhood, setShowneighborhood] = useState(false);

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

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة المستأجرين" />
        <div className="subhomepage">
          <div className="divforbuttons">
            {/* تم تقسيمهن الى دفيين عشان كل دف يكون في الطرف */}
            <div></div>
            {/* الاول */}
            <div className="displayflexjust">
              <Bigbutton
                text="إنذارات المستأجرين"
                path="/management/Tenants/TenantWaringDisplaySearch"
              />
              <Mainbutton
                text="تقرير"
                path="/management/Tenants/ReportTenant"
              />
              <Mainbutton
                text="بحث"
                path="/management/Tenants/DisplaySearchTenant"
              />
              <Mainbutton text="إضافة" path="/management/Tenants/AddTenant" />
            </div>
          </div>
          <div>
            <form className="divforconten" onSubmit={handleSubmit}>
              <div className="RowForInsertinputs">
                <SelectWithLabel3
                  name="gender"
                  text="الجنس"
                  value={formData.gender}
                  change={handleChange}
                  value1="ذكر"
                  value2="أنثى"
                  value3="الجميع(الذكر والأنثى)"
                />
                <div className="widthbetween"></div>
                <SelectWithLabel3
                  name="type"
                  text="نوع المستأجر"
                  value={formData.type}
                  change={handleChange}
                  value1="حالي"
                  value2="سابق"
                  value3="الجميع(الحاليين والسابقين)"
                />
              </div>
              <div className="RowForInsertinputs">
                <div
                  className="displayflexjust"
                  style={{
                    width: "100%",
                    justifyItems: "end",
                    justifyContent: "end",
                  }}
                >
                  <Checkpoint
                    text="الحي"
                    change={(e) => setShowneighborhood(e.target.checked)}
                  />
                  <Checkpoint
                    text="المدينة"
                    change={(e) => setShowcity(e.target.checked)}
                  />
                  <Checkpoint
                    text="المحافظة"
                    change={(e) => setShowgovernorate(e.target.checked)}
                  />
                  <Checkpoint
                    text="رقم الهوية"
                    change={(e) => setshowIDnumber(e.target.checked)}
                  />
                </div>
              </div>
              <div className="RowForInsertinputs">
                <Submitinput text="نتيجة" />
              </div>
              <div
                className="divfortable"
                style={{
                  height: "50%",
                }}
              >
                {loading ? (
                  <p>جاري تحميل البيانات...</p>
                ) : (
                  <table id="propertyreport">
                    <thead>
                      <tr>
                        {showgovernorate && <th>المحافظة</th>}
                        {showcity && <th>المدينة</th>}
                        {showneighborhood && <th>الحي</th>}
                        {showIDnumber && <th>رقم الهوية</th>}
                        <th>نوع المستأجر</th>
                        <th>الجنس</th>
                        <th>رقم التلفون</th>
                        <th>اسم المستأجر</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTenants.length === 0 ? (
                        <tr>
                          <td
                            // @ts-ignore
                            colSpan="9"
                          >
                            لا توجد بيانات
                          </td>
                        </tr>
                      ) : (
                        filteredTenants.map((tenant) => (
                          <tr key={tenant.id || tenant._id}>
                            {showgovernorate && (
                              <td>{tenant.governorate || "غير محدد"}</td>
                            )}
                            {showcity && <td>{tenant.city || "غير محدد"}</td>}
                            {showneighborhood && (
                              <td>{tenant.neighborhood || "غير محدد"}</td>
                            )}
                            {showIDnumber && (
                              <td>{tenant.idNumber || "غير محدد"}</td>
                            )}
                            <td>{tenant.type || "غير محدد"}</td>
                            <td>{tenant.genders || "غير محدد"}</td>
                            <td>{tenant.phone || "غير محدد"}</td>
                            <td>{tenant.name || "غير محدد"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="RowForInsertinputs"></div>
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
