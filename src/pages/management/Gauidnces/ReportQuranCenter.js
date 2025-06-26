import { useState, useEffect } from "react";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import SelectWithLabel from "../../../components/SelectWithLabel";
import Submitinput from "../../../components/submitinput";
import "../../../style/Table.css";
import ButtonInput from "../../../components/ButtonInput";

export default function ReportQuranCenter() {
  const [formData, setFormData] = useState({
    quranCenter_governorate: "",
    quranCenter_city: "",
  });
  const [error, setErrors] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/ReportRevenues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("successful!");
      } else {
        const data = await response.json();

        if (data && data.message) {
          // تحقق من وجود data و data.message
          if (typeof data.message === "object") {
            setErrors({ ...error, ...data.message }); // دمج أخطاء الخادم
          } else if (typeof data.message === "string") {
            setErrors({ ...error, general: data.message }); // خطأ عام
          } else {
            setErrors({ ...error, general: "Registration failed." });
          }
        } else {
          setErrors({ ...error, general: "Registration failed." });
        }
      }
    } catch (err) {
      setErrors({ ...error, general: "An error occurred." });
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

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة الارشاد" />
        <div className="subhomepage">
          <div className="divforbuttons">
            {/* الثاني */}
            <div></div>
            {/* الاول */}
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
          <div className="divforconten">
            <form className="divforconten" onSubmit={handleSubmit}>
              <div className="RowForInsertinputs">
                <SelectWithLabel
                  name="quranCenter_governorate"
                  text="المحافظة"
                  value={formData.quranCenter_governorate}
                  change={handleChange}
                  // values
                  value1="كل المحافظات"
                  value2="حضرموت"
                  value3="شبوة"
                />
                <div className="widthbetween"></div>
                <SelectWithLabel
                  name="quranCenter_city"
                  text="المدينة"
                  value={formData.quranCenter_city}
                  change={handleChange}
                  // values
                  value1="كل المدن"
                  value2="المكلا"
                  value3="الشحر"
                />
              </div>
              <div className="RowForInsertinputs">
                <Submitinput text="نتيجة" />
              </div>
              <div className="divfortable">
                <table id="propertyreport">
                  <thead>
                    <tr>
                      <th>تلفون المدير</th>
                      <th>رقم الهوية</th>
                      <th> اسم المدير</th>
                      <th>الحي</th>
                      <th>المدينة</th>
                      <th>المحافظة</th>
                      <th>تابع لمسجد</th>
                      <th>اسم المركز</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>fggggggggggdcsd</td>
                      <td>fswfesdcsd</td>
                      <td>hfkjesheshjsd</td>
                      <td>fswfesdcsd</td>
                      <td>fswfesdcsd</td>
                      <td>hfkjeskhdcsd</td>
                      <td>fswfesdcsd</td>
                      <td>fswfesdcsd</td>
                    </tr>
                  </tbody>
                </table>
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
