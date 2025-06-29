import { useState, useEffect } from "react";
import Bigbutton from "../../../components/Bigbutton";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Searchsection from "../../../components/Searchsection";
import TenantCard from "../../../components/TenantCard";

export default function DisplaySearchTenant() {
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // جلب بيانات المستأجرين
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch("http://awgaff1.runasp.net/api/Tenant");
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
        const data = await response.json();
        // دعم جميع أشكال الاستجابة: مصفوفة مباشرة أو داخل خاصية Tenants أو data أو payload أو result
        let tenantsArr = [];
        if (Array.isArray(data)) {
          tenantsArr = data;
        } else if (Array.isArray(data.Tenants)) {
          tenantsArr = data.Tenants;
        } else if (Array.isArray(data.data)) {
          tenantsArr = data.data;
        } else if (Array.isArray(data.payload)) {
          tenantsArr = data.payload;
        } else if (Array.isArray(data.result)) {
          tenantsArr = data.result;
        }
        setTenants(tenantsArr);
        setFilteredTenants(tenantsArr);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  // تصفية المستأجرين حسب البحث
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTenants(tenants);
    } else {
      const filtered = tenants.filter((tenant) =>
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTenants(filtered);
    }
  }, [searchTerm, tenants]);

  // معالجة البحث
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // معالجة حذف المستأجر
  const handleDeleteTenant = (tenantId) => {
    // تحديث قائمة المستأجرين بعد الحذف
    setTenants((prevTenants) =>
      prevTenants.filter((tenant) => tenant.id !== tenantId)
    );
  };

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة المستأجرين" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div></div>
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
          <div className="divforconten">
            <div className="divforsearchandcards">
              <div className="displayflexjust divforsearch">
                <Searchsection
                  placeholder="ابحث بإسم المستأجر"
                  maxLength="30"
                  onSearch={handleSearch}
                />
              </div>
              <div className="divforcards">
                {loading ? (
                  <p>جاري التحميل...</p>
                ) : filteredTenants.length === 0 ? (
                  <p>لا يوجد مستأجرين</p>
                ) : (
                  filteredTenants.map((tenant) => (
                    <TenantCard
                      tenantStatus={tenant.type}
                      key={tenant.id || tenant._id}
                      name={tenant.name}
                      id={tenant.id || tenant._id}
                      onDelete={handleDeleteTenant}
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
