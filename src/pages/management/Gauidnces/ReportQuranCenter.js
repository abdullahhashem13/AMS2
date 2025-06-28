import { useState, useEffect } from "react";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import ButtonInput from "../../../components/ButtonInput";
import Mainbutton from "../../../components/Mainbutton";
import "../../../style/Table.css";

export default function ReportQuranCenter() {
  const [centers, setCenters] = useState([]);
  const [mosques, setMosques] = useState([]);

  useEffect(() => {
    // جلب جميع بيانات مراكز القرآن والمساجد
    const fetchData = async () => {
      try {
        const [centersRes, mosquesRes] = await Promise.all([
          fetch("http://localhost:3001/Gauidnces"),
          fetch("http://localhost:3001/Mosques"),
        ]);
        let centersData = [];
        let mosquesData = [];
        if (centersRes.ok) centersData = await centersRes.json();
        if (mosquesRes.ok) mosquesData = await mosquesRes.json();
        setCenters(centersData);
        setMosques(mosquesData);
      } catch {
        setCenters([]);
        setMosques([]);
      }
    };
    fetchData();
  }, []);

  // دالة طباعة
  const handlePrint = () => {
    const printContents =
      document.getElementById("qurancenterreport").outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة الإرشاد" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div></div>
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Gauidnces/ReportQuranCenter"
              />
              <Mainbutton
                text="بحث"
                path="/management/Gauidnces/DisplaySearchQuranCenter"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Gauidnces/AddQuranCenter"
              />
            </div>
          </div>
          <div
            className="divforconten"
            style={{ margin: 0, padding: 0, minHeight: "auto", height: "80%" }}
          >
            <div
              className="divfortable"
              style={{
                marginTop: 30,
                marginBottom: 0,
                paddingBottom: 0,
                minHeight: "auto",
                height: "80%",
              }}
            >
              <table id="qurancenterreport">
                <thead>
                  <tr>
                    <th>تلفون المدير</th>
                    <th>رقم الهوية</th>
                    <th>اسم المدير</th>
                    <th>الحي</th>
                    <th>المدينة</th>
                    <th>المحافظة</th>
                    <th>تابع لمسجد</th>
                    <th>اسم المركز</th>
                  </tr>
                </thead>
                <tbody>
                  {centers.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center" }}>
                        لا توجد بيانات
                      </td>
                    </tr>
                  ) : (
                    centers.map((center, idx) => {
                      // جلب اسم المسجد من قائمة المساجد
                      let mosqueName = "";
                      if (center.mosque_id && mosques.length > 0) {
                        const mosque = mosques.find(
                          (m) => m.id === center.mosque_id
                        );
                        mosqueName = mosque ? mosque.name : "";
                      }
                      return (
                        <tr key={idx}>
                          <td>{center.managerPhone || ""}</td>
                          <td>{center.managerIdNumber || ""}</td>
                          <td>{center.managerName || ""}</td>
                          <td>{center.neighborhood || ""}</td>
                          <td>{center.city || ""}</td>
                          <td>{center.governorate || ""}</td>
                          <td>{mosqueName}</td>
                          <td>{center.name || ""}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div
              className="RowForInsertinputs"
              style={{
                margin: 0,
                padding: 0,
                minHeight: "auto",
                height: "auto",
              }}
            >
              <ButtonInput text="طباعة" onClick={handlePrint} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
