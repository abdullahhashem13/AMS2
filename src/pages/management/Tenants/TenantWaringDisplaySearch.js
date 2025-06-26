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
      const response = await fetch("/JsonData/AllData.json");
      if (!response.ok) {
        throw new Error("فشل في جلب البيانات");
      }
      const data = await response.json();

      // جلب بيانات المستأجرين
      const tenantsData = data.Tenants || [];
      setTenants(tenantsData);

      // جلب بيانات الإنذارات
      const warningsData = data.TenantWaring || [];

      // دمج بيانات الإنذارات مع أسماء المستأجرين
      const warningsWithNames = warningsData.map((warning) => {
        const tenant = tenantsData.find((t) => t.id === warning.tenant_id);
        return {
          ...warning,
          tenantName: tenant ? tenant.name : "مستأجر غير معروف",
          warningType: warning.typeOfWarning,
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
