import React, { useState, useEffect } from "react";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Searchsection from "../../../components/Searchsection";
import RevenueCard from "../../../components/RevenueCard"; // استخدام الكارد الجديد الخاص بالإيرادات

export default function DisplaySearchRevenues() {
  const [revenues, setRevenues] = useState([]);
  const [filteredRevenues, setFilteredRevenues] = useState([]);
  const [, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب بيانات الإيرادات والمستأجرين
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // جلب بيانات المستأجرين
        const tenantsResponse = await fetch("/JsonData/AllData.json");
        if (!tenantsResponse.ok) {
          throw new Error("فشل في جلب بيانات المستأجرين");
        }
        const tenantsData = await tenantsResponse.json();
        const tenantsList = tenantsData.Tenants || [];
        setTenants(tenantsList);

        // جلب بيانات الإيرادات
        const revenuesResponse = await fetch("http://localhost:3001/Revenues");
        if (!revenuesResponse.ok) {
          throw new Error("فشل في جلب بيانات الإيرادات");
        }
        const revenuesData = await revenuesResponse.json();

        // إضافة اسم المستأجر إلى بيانات الإيرادات
        const revenuesWithTenantNames = revenuesData.map((revenue) => {
          if (revenue.tenant_name) {
            const tenant = tenantsList.find(
              (t) => t.id === revenue.tenant_name
            );
            return {
              ...revenue,
              tenantName: tenant ? tenant.name : "غير محدد",
              bondNumber: revenue.receiptVoucher_bondNumber,
            };
          }
          return {
            ...revenue,
            tenantName: "غير محدد",
            bondNumber: revenue.receiptVoucher_bondNumber,
          };
        });

        setRevenues(revenuesWithTenantNames);
        setFilteredRevenues(revenuesWithTenantNames);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // وظيفة البحث
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredRevenues(revenues);
      return;
    }

    const filtered = revenues.filter((revenue) =>
      revenue.bondNumber.includes(searchTerm)
    );
    setFilteredRevenues(filtered);
  };

  // وظيفة تحديث القائمة بعد الحذف
  const handleDeleteRevenue = (id) => {
    setRevenues(revenues.filter((revenue) => revenue.id !== id));
    setFilteredRevenues(
      filteredRevenues.filter((revenue) => revenue.id !== id)
    );
  };

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة الايرادات" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div></div>
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Revenues/ReportRevenues"
              />
              <Mainbutton
                text="بحث"
                path="/management/Revenues/DisplaySearchRevenues"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Revenues/AddRevenues"
              />
            </div>
          </div>
          <div className="divforconten">
            <div className="divforsearchandcards">
              <div className="displayflexjust divforsearch">
                <Searchsection
                  placeholder="ابحث برقم السند"
                  maxLength="30"
                  onSearch={handleSearch}
                />
              </div>
              <div className="divforcards">
                {loading ? (
                  <p>جاري التحميل...</p>
                ) : error ? (
                  <p>خطأ: {error}</p>
                ) : filteredRevenues.length === 0 ? (
                  <p>لا توجد إيرادات</p>
                ) : (
                  filteredRevenues.map((revenue) => (
                    <RevenueCard
                      key={revenue.id}
                      id={revenue.id}
                      bondNumber={revenue.bondNumber}
                      tenantName={revenue.tenantName}
                      path={`/management/Revenues/ViewRevenues/${revenue.id}`}
                      onDelete={handleDeleteRevenue}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
