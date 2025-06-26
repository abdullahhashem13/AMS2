import { useEffect, useState } from "react";
// @ts-ignore
import Bigbutton from "../../../components/Bigbutton";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import "../../../style/Table.css";
import ButtonInput from "../../../components/ButtonInput";
import "../../../style/Modal.css";
import "../../../style/Modal.css";

export default function AllBranch() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        // جلب البيانات مباشرة من ملف JSON المحلي
        const response = await fetch("/JsonData/AllData.json");
        if (!response.ok) {
          throw new Error("خطأ في جلب البيانات");
        }
        const data = await response.json();
        console.log("تم استلام البيانات:", data);
        // Ensure branches is always an array
        setBranches(Array.isArray(data.Branches) ? data.Branches : []);
      } catch (err) {
        console.error("خطأ في جلب البيانات:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // دالة طباعة
  const handlePrint = () => {
    const printContents = document.getElementById("propertyreport")?.outerHTML;
    if (!printContents) {
      console.error("Element with ID 'propertyreport' not found");
      return;
    }

    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  // دالة لتحديث الصفحة بعد اغلاق نافذة الطباعه
  useEffect(() => {
    const handleAfterPrint = () => {
      window.location.reload();
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
        <Managmenttitle title="إدارة الفروع" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div></div>
            <div className="displayflexjust">
              <Bigbutton
                text="جميع الفروع"
                path="/management/Branchs/AllBranch"
              />
              <Mainbutton
                text="بحث"
                path="/management/Branchs/DisplaySearchBranch"
              />
              <Mainbutton text="إضافة" path="/management/Branchs/AddBranch" />
            </div>
          </div>
          <div className="divforconten">
            <h2
              style={{
                fontFamily: "amiri",
              }}
            >
              جميع الفروع
            </h2>

            {loading ? (
              <div className="loading">جاري التحميل...</div>
            ) : error ? (
              <div className="error">خطأ: {error}</div>
            ) : !branches || branches.length === 0 ? (
              <p>لا توجد فروع متاحة</p>
            ) : (
              <>
                <table id="propertyreport">
                  <thead>
                    <tr>
                      <th>الحي</th>
                      <th>المدينة</th>
                      <th>المحافظة</th>
                      <th>المدير</th>
                      <th>رقم التلفون</th>
                      <th>اسم الفرع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map((branch) => (
                      <tr key={branch.id || branch._id || branch.name}>
                        <td>{branch.neighborhood}</td>
                        <td>{branch.city}</td>
                        <td>{branch.governorate}</td>
                        <td>{branch.manager}</td>
                        <td>{branch.phone}</td>
                        <td>{branch.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="RowForInsertinputs">
                  <ButtonInput text="طباعة" onClick={handlePrint} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
