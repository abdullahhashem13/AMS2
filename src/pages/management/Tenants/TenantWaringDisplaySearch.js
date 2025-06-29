import React, { useState, useEffect } from "react";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Searchsection from "../../../components/Searchsection";
import TenantWarningCard from "../../../components/TenantWarningCard";

export default function TenantWaringDisplaySearch() {
  const [warnings, setWarnings] = useState([]);
  const [filteredWarnings, setFilteredWarnings] = useState([]);
  const [, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // جلب بيانات المستأجرين من API الخارجي
      const tenantsRes = await fetch("http://awgaff1.runasp.net/api/Tenant");
      let tenantsArr = [];
      if (tenantsRes.ok) {
        const tenantsData = await tenantsRes.json();
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
        setTenants(tenantsArr);
      } else {
        setTenants([]);
      }

      // جلب بيانات الإنذارات من API الخارجي
      const warningsRes = await fetch(
        "http://awgaff1.runasp.net/api/TenantWarning"
      );
      let warningsArr = [];
      if (warningsRes.ok) {
        const warningsData = await warningsRes.json();
        if (Array.isArray(warningsData)) {
          warningsArr = warningsData;
        } else if (Array.isArray(warningsData.TenantWarning)) {
          warningsArr = warningsData.TenantWarning;
        } else if (Array.isArray(warningsData.data)) {
          warningsArr = warningsData.data;
        } else if (Array.isArray(warningsData.payload)) {
          warningsArr = warningsData.payload;
        } else if (Array.isArray(warningsData.result)) {
          warningsArr = warningsData.result;
        }
      }

      // دمج بيانات الإنذارات مع أسماء المستأجرين
      const warningsWithNames = warningsArr.map((warning) => {
        // دعم حالتين: إذا كان الاسم موجود مباشرة في بيانات الإنذار أو يحتاج جلبه من المستأجرين
        let tenantName = "مستأجر غير معروف";
        if (warning.name) {
          tenantName = warning.name;
        } else {
          const tenant = tenantsArr.find(
            (t) =>
              String(t.id) === String(warning.tenant_id || warning.tenant_Id)
          );
          if (tenant && tenant.name) tenantName = tenant.name;
        }
        // دعم تعدد أسماء الحقول لنوع الإنذار
        const warningType = warning.typeOfWarning || warning.typeOfWarining;
        return {
          ...warning,
          tenantName,
          warningType,
        };
      });

      setWarnings(warningsWithNames);
      setFilteredWarnings(warningsWithNames);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredWarnings(warnings);
      return;
    }

    const filtered = warnings.filter((warning) =>
      warning.tenantName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWarnings(filtered);
  };

  const handleDeleteWarning = (id) => {
    setWarnings(warnings.filter((warning) => warning.id !== id));
    setFilteredWarnings(
      filteredWarnings.filter((warning) => warning.id !== id)
    );
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
        <Managmenttitle title="إنذارات المستأجرين" />
        {/*  */}
        {/* يحمل ما تحت العنوان */}
        <div className="subhomepage">
          {/* يحمل البوتنس */}
          <div className="divforbuttons">
            {/* تم تقسيمهن الى دفيين عشان كل دف يكون في الطرف */}
            <div>
              {/* <Bigbutton
                            text="إنذارات الموظفين"
                            path="/management/Employee/EmployeeWaringDisplaySearch"
                          /> */}
            </div>
            {}
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Tenants/TenantWaringReport"
              />

              <Mainbutton
                text="بحث"
                path="/management/Tenants/TenantWaringDisplaySearch"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Tenants/TenantWaringAdd"
              />
            </div>
          </div>
          {/*  */}
          {/* يحمل المحتوى تحت البوتنس */}
          <div className="divforconten">
            {/* يأخذ الدف الداخلي الذي سيحمل البحث والكاردات */}
            <div className="divforsearchandcards">
              {/* يأخذ عناصر البحث كاملا */}
              <div className="displayflexjust divforsearch">
                <Searchsection
                  placeholder="ابحث بإسم المستأجر"
                  maxLength="30"
                  onSearch={handleSearch}
                />
              </div>
              {/*  */}
              {/* ياخذ الكاردات */}
              <div className="divforcards">
                {loading ? (
                  <p>جاري التحميل...</p>
                ) : error ? (
                  <p>خطأ: {error}</p>
                ) : filteredWarnings.length === 0 ? (
                  <p>لا توجد إنذارات</p>
                ) : (
                  filteredWarnings.map((warning) => (
                    <TenantWarningCard
                      key={warning.id || warning._id}
                      id={warning.id || warning._id}
                      tenantName={warning.tenantName}
                      warningType={warning.warningType}
                      onDelete={handleDeleteWarning}
                    />
                  ))
                )}
              </div>
              {/*  */}
            </div>
          </div>
          {/*  */}
        </div>
      </div>
      {/*  */}
    </div>
  );
}
