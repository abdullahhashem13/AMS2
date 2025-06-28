import { useState, useEffect } from "react";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Submitinput from "../../../components/submitinput";
import "../../../style/Table.css";
import ButtonInput from "../../../components/ButtonInput";
import InputDate from "../../../components/InputDate";
import SearchableSelect from "../../../components/SearchableSelect";

export default function ReportRevenues() {
  // تحديد تاريخ اليوم بالتنسيق المناسب (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    startofdate: "", // سيتم تحديثه لاحقًا بأقدم تاريخ
    endofdate: today,
    tenant_id: "كل المستأجرين",
  });
  const [error, setErrors] = useState({});
  const [revenues, setRevenues] = useState([]);
  const [filteredRevenues, setFilteredRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState([]);

  // دالة لحساب مجموع المبالغ
  const calculateTotalAmount = () => {
    if (!filteredRevenues || filteredRevenues.length === 0) {
      return 0;
    }

    return filteredRevenues.reduce((total, revenue) => {
      const amount = parseFloat(revenue.amount) || 0;
      return total + amount;
    }, 0);
  };

  // دالة لتصفية الإيرادات بناءً على معايير البحث
  const filterRevenues = (revenuesList, criteria) => {
    return revenuesList.filter((revenue) => {
      // تحويل التواريخ إلى كائنات Date للمقارنة
      const revenueDate = new Date(revenue.date);
      const startDate = criteria.startofdate
        ? new Date(criteria.startofdate)
        : null;
      const endDate = criteria.endofdate ? new Date(criteria.endofdate) : null;

      // التحقق من التاريخ
      if (startDate && revenueDate < startDate) return false;
      if (endDate) {
        // إضافة يوم واحد لتاريخ النهاية ليشمل اليوم المحدد بالكامل
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        if (revenueDate >= adjustedEndDate) return false;
      }

      // التحقق من المستأجر
      if (criteria.tenant_id && criteria.tenant_id !== "كل المستأجرين") {
        // استخدام كلا الحقلين tenant_id و tenant_name للمقارنة
        const revenueTenantId = revenue.tenant_id || revenue.tenant_name;
        return revenueTenantId === criteria.tenant_id;
      }

      return true;
    });
  };

  // جلب بيانات الإيرادات والمستأجرين عند تحميل الصفحة فقط
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // جلب البيانات من ملف JSON المحلي
        const response = await fetch("/JsonData/AllData.json");
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
        const data = await response.json();

        // استخراج بيانات المستأجرين
        const tenantsData = data.Tenants || [];
        setTenants(tenantsData);

        // استخراج بيانات العقارات
        const propertiesData = data.Properties || [];

        // استخراج بيانات الإيرادات
        const revenuesData = data.Revenues || [];

        // إضافة اسم المستأجر ورقم العين النصي إلى كل إيراد
        const revenuesWithTenantAndProperty = revenuesData.map((revenue) => {
          // ملاحظة: في بعض الملفات، يتم استخدام tenant_name بدلاً من tenant_id
          const tenantId = revenue.tenant_id || revenue.tenant_name;
          // البحث عن المستأجر المرتبط بهذا الإيراد
          const tenant = tenantsData.find((t) => t.id === tenantId);
          // البحث عن العقار المرتبط بهذا الإيراد
          const propertyId = revenue.property_id;
          const property = propertiesData.find((p) => p.id === propertyId);
          return {
            ...revenue,
            tenantName: tenant ? tenant.name : "غير محدد",
            // تخزين معرف المستأجر بشكل موحد
            tenant_id: tenantId,
            propertyNumber: property ? property.number : "غير محدد",
          };
        });

        setRevenues(revenuesWithTenantAndProperty);

        // تحديد أقدم تاريخ إيراد
        let oldestDate = today;
        if (revenuesWithTenantAndProperty.length > 0) {
          // فرز الإيرادات حسب التاريخ تصاعديًا
          const sortedRevenues = [...revenuesWithTenantAndProperty].sort(
            (a, b) => {
              return (
                // @ts-ignore
                new Date(a.date) - new Date(b.date)
              );
            }
          );

          // الحصول على أقدم تاريخ
          oldestDate = sortedRevenues[0].date;

          // تحديث نموذج البيانات بأقدم تاريخ
          setFormData((prev) => ({
            ...prev,
            startofdate: oldestDate,
          }));
        } else {
          // إذا لم تكن هناك إيرادات، استخدم تاريخ اليوم
          setFormData((prev) => ({
            ...prev,
            startofdate: today,
          }));
        }

        // تطبيق الفلترة الأولية
        const initialFiltered = filterRevenues(revenuesWithTenantAndProperty, {
          startofdate: oldestDate,
          endofdate: today,
          tenant_id: "كل المستأجرين",
        });

        setFilteredRevenues(initialFiltered);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [today]); // إضافة مصفوفة تبعيات فارغة لتنفيذ الدالة مرة واحدة فقط عند تحميل المكون

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // طباعة معايير الفلترة للتصحيح
    console.log("معايير الفلترة:", formData);

    // تطبيق الفلترة على البيانات الموجودة
    const filtered = filterRevenues(revenues, formData);

    // طباعة النتائج للتصحيح
    console.log("نتائج الفلترة:", filtered);

    setFilteredRevenues(filtered);
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

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة الإيرادات" />
        <div className="subhomepage">
          <div className="divforbuttons">
            {/* الثاني */}
            <div></div>
            {/* الاول */}
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
            <form className="divforconten" onSubmit={handleSubmit}>
              <div className="RowForInsertinputs">
                <InputDate
                  name="endofdate"
                  text="الى تاريخ"
                  value={formData.endofdate}
                  change={handleChange}
                />
                <div className="widthbetween"></div>
                <InputDate
                  name="startofdate"
                  text="من تاريخ"
                  value={formData.startofdate}
                  change={handleChange}
                />
                <SearchableSelect
                  name="tenant_id"
                  text="المستأجر"
                  options={[
                    { value: "كل المستأجرين", label: "كل المستأجرين" },
                    ...tenants.map((tenant) => ({
                      value: tenant.id,
                      label:
                        tenant.name || tenant.tenant_name || "مستأجر بدون اسم",
                    })),
                  ]}
                  value={formData.tenant_id}
                  change={handleChange}
                />
              </div>
              <div className="RowForInsertinputs">
                <Submitinput text="نتيجة" />
              </div>
              <div className="divfortable">
                <table id="propertyreport">
                  <thead>
                    <tr>
                      <th>اسم المحصل</th>
                      <th>رقم العين</th>
                      <th>رقم السند</th>
                      <th>التاريخ</th>
                      <th>مقابل</th>
                      <th>المبلغ</th>
                      <th>اسم المستأجر</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          // @ts-ignore
                          colSpan="5"
                        >
                          جاري تحميل البيانات...
                        </td>
                      </tr>
                    ) : filteredRevenues.length === 0 ? (
                      <tr>
                        <td
                          // @ts-ignore
                          colSpan="5"
                        >
                          لا توجد بيانات متطابقة مع معايير البحث
                        </td>
                      </tr>
                    ) : (
                      <>
                        {filteredRevenues.map((revenue) => {
                          // البحث عن المستأجر مرة أخرى للتأكد
                          const tenantId =
                            revenue.tenant_id || revenue.tenant_name;
                          const tenant = tenants.find((t) => t.id === tenantId);
                          const tenantName = tenant
                            ? tenant.name
                            : revenue.tenantName || "غير محدد";
                          // اسم المحصل
                          const collectorName =
                            revenue.collectorName ||
                            revenue.collector_name ||
                            "غير محدد";
                          // رقم العين النصي فقط من جدول العقارات (property.number)
                          const propertyNumber =
                            revenue.propertyNumber || "غير محدد";
                          return (
                            <tr key={revenue.id}>
                              <td>{collectorName}</td>
                              <td>{propertyNumber}</td>
                              <td>{revenue.bondNumber || "غير محدد"}</td>
                              <td>{revenue.date || "غير محدد"}</td>
                              <td>{revenue.description || "غير محدد"}</td>
                              <td>{revenue.amount || "0"}</td>
                              <td>{tenantName}</td>
                            </tr>
                          );
                        })}
                        {/* سطر المجموع */}
                        <tr className="total-row">
                          <td></td>
                          <td></td>
                          <td
                            colSpan={3}
                            style={{ textAlign: "left", fontWeight: "bold" }}
                          ></td>
                          <td style={{ fontWeight: "bold" }}>
                            {calculateTotalAmount().toLocaleString()}
                          </td>
                          <td></td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
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
