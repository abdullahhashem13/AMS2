import { useState, useEffect } from "react";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import SelectWithLabel4 from "../../../components/SelectWithLabel4";
import SearchableSelect from "../../../components/SearchableSelect";
import Submitinput from "../../../components/submitinput";
import "../../../style/Table.css";
import ButtonInput from "../../../components/ButtonInput";

export default function TenantWaringReport() {
  const [formData, setFormData] = useState({
    branch_id: "الجميع",
    tenantWaring_typeOfWarning: "جميع الإنذارات",
    tenant_id: "الجميع",
  });
  const [error, setErrors] = useState({});
  const [warnings, setWarnings] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [filteredWarnings, setFilteredWarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب بيانات الإنذارات والمستأجرين والفروع
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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

        // دمج بيانات الإنذارات مع أسماء المستأجرين فقط (بدون فروع)
        const warningsWithDetails = warningsData.map((warning) => {
          const tenantObj = tenantsData.find((t) => t.id === warning.tenant_id);
          return {
            ...warning,
            tenantName: tenantObj ? tenantObj.name : "مستأجر غير معروف",
            tenantId: tenantObj ? tenantObj.id : "",
          };
        });

        setWarnings(warningsWithDetails);
        setFilteredWarnings(warningsWithDetails);
        setLoading(false);
      } catch (err) {
        console.error("خطأ في جلب البيانات:", err);
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
      let filtered = [...warnings];

      // فلترة حسب الفرع
      if (formData.branch_id && formData.branch_id !== "الجميع") {
        filtered = filtered.filter(
          (warning) => warning.branchId === formData.branch_id
        );
      }

      // فلترة حسب نوع الإنذار
      if (
        formData.tenantWaring_typeOfWarning &&
        formData.tenantWaring_typeOfWarning !== "جميع الإنذارات"
      ) {
        filtered = filtered.filter(
          (warning) =>
            warning.typeOfWarning === formData.tenantWaring_typeOfWarning
        );
      }

      // فلترة حسب اسم المستأجر
      if (formData.tenant_id && formData.tenant_id !== "الجميع") {
        filtered = filtered.filter(
          (warning) => warning.tenantId === formData.tenant_id
        );
      }

      setFilteredWarnings(filtered);
    } catch (err) {
      setErrors({ ...error, general: "حدث خطأ أثناء الفلترة." });
      console.error(err);
    }
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

  // إعداد خيارات المستأجرين للبحث
  const tenantSearchOptions = [
    { value: "الجميع", label: "جميع المستأجرين" },
    ...tenants.map((tenant) => ({
      value: tenant.id,
      label: tenant.name,
    })),
  ];

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إنذارات المستأجرين" />
        <div className="subhomepage">
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
          <div className="divforconten">
            <form className="divforconten" onSubmit={handleSubmit}>
              <div className="RowForInsertinputs">
                {/* <SelectWithLabelDynamic
                  name="branch_id"
                  text="الفرع"
                  value={formData.branch_id}
                  change={handleChange}
                  options={branchOptions}
                  placeholder="اختر الفرع"
                  valueKey="id"
                  displayKey="name"
                /> */}
                {/* حذف حقل الفرع من الفلاتر */}
                <div className="widthbetween"></div>
                <SelectWithLabel4
                  name="tenantWaring_typeOfWarning"
                  text="نوع الإنذار"
                  value={formData.tenantWaring_typeOfWarning}
                  change={handleChange}
                  // values
                  value1="إنذار أول"
                  value2="إنذار ثاني"
                  value3="إنذار نهائي"
                  value4="جميع الإنذارات"
                />
                <div className="widthbetween"></div>
                <SearchableSelect
                  name="tenant_id"
                  text="اسم المستأجر"
                  options={tenantSearchOptions}
                  value={formData.tenant_id}
                  change={handleChange}
                />
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
                        {/* <th>الفرع</th> */}
                        <th>الوصف</th>
                        <th>التاريخ</th>
                        <th>نوع الإنذار</th>
                        <th>اسم المستأجر</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWarnings.length === 0 ? (
                        <tr>
                          <td
                            // @ts-ignore
                            colSpan="4"
                          >
                            لا توجد بيانات
                          </td>
                        </tr>
                      ) : (
                        filteredWarnings.map((warning) => (
                          <tr key={warning.id || warning._id}>
                            {/* <td>{warning.branchName}</td> */}
                            <td>{warning.description || "غير محدد"}</td>
                            <td>{warning.date || "غير محدد"}</td>
                            <td>{warning.typeOfWarning || "غير محدد"}</td>
                            <td>{warning.tenantName || "غير محدد"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="RowForInsertinputs"></div>
              <div className="RowForInsertinputs">
                <ButtonInput text="طباعة" Click={handlePrint} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
