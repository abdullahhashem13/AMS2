import { useState, useEffect } from "react";
import Checkpoint from "../../../components/checkpoint";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import SelectWithLabel from "../../../components/SelectWithLabel";
import Submitinput from "../../../components/submitinput";
import "../../../style/Table.css";
import ButtonInput from "../../../components/ButtonInput";
import SearchableSelect from "../../../components/SearchableSelect";
import SelectWithLabel4 from "../../../components/SelectWithLabel4";

export default function ReportAggrement() {
  // فلاتر ديناميكية
  // const [branches, setBranches] = useState([]); // حذف حقل الفروع نهائياً
  const [builders, setBuilders] = useState([]);

  const [aggrements, setAggrements] = useState([]);
  const [filteredAggrements, setFilteredAggrements] = useState([]);
  const [formData, setFormData] = useState({
    // branch_name: "الجميع", // حذف حقل الفرع
    agreementType: "الجميع",
    builderMosque_name: "الجميع",
  });
  const [error, setErrors] = useState({});
  const [buildersData, setBuildersData] = useState([]);
  // const [branchesData, setBranchesData] = useState([]); // حذف بيانات الفروع نهائياً

  // جلب البيانات من AllData.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/JsonData/AllData.json");
        if (response.ok) {
          const allData = await response.json();
          // setBranches(["الجميع", ...allData.Branches.map((b) => b.name)]);
          // setBranchesData(allData.Branches); // حذف جلب الفروع
          setBuilders(["الجميع", ...allData.Builder.map((b) => b.name)]);
          setBuildersData(allData.Builder); // حفظ البنائين ككائنات
          // استخراج أنواع الاتفاقية من Aggrements
          const types = Array.from(
            new Set(allData.Aggrements.map((a) => a.agreementType))
          );
          setAggrements(allData.Aggrements);
        }
      } catch (err) {
        // setBranches(["الجميع"]); // حذف نهائي
        // setBranchesData([]); // حذف نهائي
        setBuilders(["الجميع"]);
        setBuildersData([]);
        setAggrements([]);
      }
    };
    fetchData();
  }, []);

  // عند تحميل الصفحة، أظهر كل الاتفاقيات افتراضياً
  useEffect(() => {
    setFilteredAggrements(aggrements);
  }, [aggrements]);

  // تصفية النتائج فقط عند الضغط على زر نتيجة
  const handleSubmit = (e) => {
    e.preventDefault();
    let filtered = aggrements;
    // حذف تصفية الفرع
    if (
      formData.builderMosque_name &&
      formData.builderMosque_name !== "الجميع"
    ) {
      filtered = filtered.filter(
        (a) =>
          a.builderMosque_name === formData.builderMosque_name ||
          a.name === formData.builderMosque_name
      );
    }
    if (formData.agreementType && formData.agreementType !== "الجميع") {
      filtered = filtered.filter(
        (a) => a.agreementType === formData.agreementType
      );
    }
    setFilteredAggrements(filtered);
  };

  // جلب فرع الباني حسب الاسم
  // حذف دالة جلب اسم الفرع

  // تحديث الفلاتر
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
  };

  // أعمدة الجدول الإضافية
  const [showfirstWitness, setShowfirstWitness] = useState(false);
  const [showsecondWitness, setShowsecondWitness] = useState(false);
  const [showtotalArea, setShowtotalArea] = useState(false);
  const [shownorth, setShownorth] = useState(false);
  const [showsouth, setShowsouth] = useState(false);
  const [showeast, setShoweast] = useState(false);
  const [showwest, setShowwest] = useState(false);
  const [showbuilderMosque_NOIdentity, setShowbuilderMosque_NOIdentity] =
    useState(false);
  const [showbuilderMosque_issuedFrom, setShowbuilderMosque_issuedFrom] =
    useState(false);
  const [showbuilderMosque_issuedDate, setShowbuilderMosque_issuedDate] =
    useState(false);

  // دالة طباعة
  const handlePrint = () => {
    const printContents = document.getElementById("propertyreport").outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  // تحديث الصفحة بعد الطباعة
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
        <Managmenttitle title="إدارة الإتفاقيات" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div>
              <Mainbutton
                text="باني المسجد"
                path="/management/Builders/DisplaySearchBuilders"
              />
            </div>
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Aggrements/ReportAggrement"
              />
              <Mainbutton
                text="بحث"
                path="/management/Aggrements/DisplaySearchAggrements"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Aggrements/AddAggrement"
              />
            </div>
          </div>
          <div>
            <form className="divforconten" onSubmit={handleSubmit}>
              <div className="RowForInsertinputs">
                <SearchableSelect
                  name="builderMosque_name"
                  text="اسم الباني"
                  value={formData.builderMosque_name}
                  change={handleChange}
                  options={builders.map((b) => ({ value: b, label: b }))}
                />
                <div className="widthbetween"></div>
                <SelectWithLabel4
                  name="agreementType"
                  text="نوع الاتفاقية"
                  value={formData.agreementType}
                  change={handleChange}
                  value1="الجميع"
                  value2="بناء"
                  value3="هدم وإعادة بناء"
                  value4="تشطيب"
                />
              </div>
              <div className="RowForInsertinputs">
                <Checkpoint
                  text="تاريخ اصدار"
                  change={(e) =>
                    setShowbuilderMosque_issuedDate(e.target.checked)
                  }
                />
                <Checkpoint
                  text="صدرت من"
                  change={(e) =>
                    setShowbuilderMosque_issuedFrom(e.target.checked)
                  }
                />
                <Checkpoint
                  text="رقم الهوية"
                  change={(e) =>
                    setShowbuilderMosque_NOIdentity(e.target.checked)
                  }
                />
                <Checkpoint
                  text="غرب"
                  change={(e) => setShowwest(e.target.checked)}
                />
                <Checkpoint
                  text="شرق"
                  change={(e) => setShoweast(e.target.checked)}
                />
                <Checkpoint
                  text="شمال"
                  change={(e) => setShownorth(e.target.checked)}
                />
                <Checkpoint
                  text="جنوب"
                  change={(e) => setShowsouth(e.target.checked)}
                />
                <Checkpoint
                  text="اجمالي المساحة"
                  change={(e) => setShowtotalArea(e.target.checked)}
                />
                <Checkpoint
                  text="الشاهد الثاني"
                  change={(e) => setShowsecondWitness(e.target.checked)}
                />
                <Checkpoint
                  text="الشاهد الأول"
                  change={(e) => setShowfirstWitness(e.target.checked)}
                />
              </div>
              <div className="RowForInsertinputs">
                <Submitinput text="نتيجة" />
              </div>
              <div
                className="divfortable"
                style={{
                  overflowX: "auto",
                  width: "100%",
                  whiteSpace: "nowrap",
                }}
              >
                <table
                  id="propertyreport"
                  style={{ minWidth: 800, direction: "ltr" }}
                >
                  <thead>
                    <tr>
                      <th>رقم الإتفاقية</th>
                      <th>نوع الإتفاقية</th>
                      <th>تاريخ الاتفاقية</th>
                      <th>فترة البناء</th>
                      {showfirstWitness && <th>الشاهد الأول</th>}
                      {showsecondWitness && <th>الشاهد الثاني</th>}
                      <th>الطول</th>
                      <th>العرض</th>
                      {showtotalArea && <th>اجمالي المساحة</th>}
                      {showsouth && <th>جنوبا</th>}
                      {shownorth && <th>شمالا</th>}
                      {showeast && <th>شرقا</th>}
                      {showwest && <th>غربا</th>}
                      {/* حذف عمود الفرع */}
                      <th>اسم الباني</th>
                      {showbuilderMosque_NOIdentity && <th>رقم الهوية</th>}
                      {showbuilderMosque_issuedFrom && <th>صدرت من</th>}
                      {showbuilderMosque_issuedDate && <th>تاريخ الإصدار</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAggrements.map((a, idx) => {
                      const builder =
                        buildersData.find(
                          (b) => b.builderMosque_name === a.builderMosque_name
                        ) || {};
                      return (
                        <tr key={idx}>
                          <td>{a.aggrementNo}</td>
                          <td>{a.agreementType}</td>
                          <td>{a.date}</td>
                          <td>{a.timeToBuild}</td>
                          {showfirstWitness && <td>{a.firstWitness}</td>}
                          {showsecondWitness && <td>{a.secondWitness}</td>}
                          <td>{a.height}</td>
                          <td>{a.width}</td>
                          {showtotalArea && <td>{a.totalArea}</td>}
                          {showsouth && <td>{a.south}</td>}
                          {shownorth && <td>{a.north}</td>}
                          {showeast && <td>{a.east}</td>}
                          {showwest && <td>{a.west}</td>}
                          {/* حذف قيمة الفرع */}
                          <td>{a.builderMosque_name || a.name || "-"}</td>
                          {showbuilderMosque_NOIdentity && (
                            <td>{builder.builderMosque_NOIdentity || "-"}</td>
                          )}
                          {showbuilderMosque_issuedFrom && (
                            <td>{builder.builderMosque_issuedFrom || "-"}</td>
                          )}
                          {showbuilderMosque_issuedDate && (
                            <td>{builder.builderMosque_issuedDate || "-"}</td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
