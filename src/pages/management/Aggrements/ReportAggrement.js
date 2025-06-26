import { useState, useEffect } from "react";
import Checkpoint from "../../../components/checkpoint";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import SelectWithLabel from "../../../components/SelectWithLabel";
import Submitinput from "../../../components/submitinput";
import "../../../style/Table.css";
import ButtonInput from "../../../components/ButtonInput";
import SearchableSelect from "../../../components/SearchableSelect";

export default function ReportAggrement() {
  // فلاتر ديناميكية
  const [branches, setBranches] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [agreementTypes, setAgreementTypes] = useState([]);
  const [aggrements, setAggrements] = useState([]);
  const [filteredAggrements, setFilteredAggrements] = useState([]);
  const [formData, setFormData] = useState({
    branch_name: "الجميع",
    aggrement_agreementType: "الجميع",
    builderMosque_name: "الجميع",
  });
  const [error, setErrors] = useState({});
  const [buildersData, setBuildersData] = useState([]);
  const [branchesData, setBranchesData] = useState([]);

  // جلب البيانات من AllData.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/JsonData/AllData.json");
        if (response.ok) {
          const allData = await response.json();
          setBranches(["الجميع", ...allData.Branches.map((b) => b.name)]);
          setBranchesData(allData.Branches); // حفظ بيانات الفروع ككائنات
          setBuilders([
            "الجميع",
            ...allData.Builder.map((b) => b.builderMosque_name),
          ]);
          setBuildersData(allData.Builder); // حفظ البنائين ككائنات
          // استخراج أنواع الاتفاقية من Aggrements
          const types = Array.from(
            new Set(allData.Aggrements.map((a) => a.aggrement_agreementType))
          );
          setAgreementTypes(["الجميع", ...types]);
          setAggrements(allData.Aggrements);
        }
      } catch (err) {
        setBranches(["الجميع"]);
        setBranchesData([]);
        setBuilders(["الجميع"]);
        setBuildersData([]);
        setAgreementTypes(["الجميع"]);
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
    if (formData.branch_name && formData.branch_name !== "الجميع") {
      filtered = filtered.filter((a) => {
        const builder = buildersData.find(
          (b) => b.builderMosque_name === a.builderMosque_name
        );
        return builder && builder.builderMosque_branch === formData.branch_name;
      });
    }
    if (
      formData.builderMosque_name &&
      formData.builderMosque_name !== "الجميع"
    ) {
      filtered = filtered.filter(
        (a) => a.builderMosque_name === formData.builderMosque_name
      );
    }
    if (
      formData.aggrement_agreementType &&
      formData.aggrement_agreementType !== "الجميع"
    ) {
      filtered = filtered.filter(
        (a) => a.aggrement_agreementType === formData.aggrement_agreementType
      );
    }
    setFilteredAggrements(filtered);
  };

  // جلب فرع الباني حسب الاسم
  const getBuilderBranch = (builderName) => {
    const builder = buildersData.find(
      (b) => b.builderMosque_name === builderName
    );
    if (!builder) return "-";
    // جلب اسم الفرع من id الفرع الخاص بالباني
    const branchObj = branchesData.find(
      (b) => b.id === builder.builderMosque_branch
    );
    return branchObj ? branchObj.name : builder.builderMosque_branch || "-";
  };

  // تحديث الفلاتر
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...error, [e.target.name]: "" });
  };

  // أعمدة الجدول الإضافية
  const [showaggrement_firstWitness, setShowaggrement_firstWitness] =
    useState(false);
  const [showaggrement_secondWitness, setShowaggrement_secondWitness] =
    useState(false);
  const [showaggrement_totalArea, setShowaggrement_totalArea] = useState(false);
  const [showaggrement_north, setShowaggrement_north] = useState(false);
  const [showaggrement_south, setShowaggrement_south] = useState(false);
  const [showaggrement_east, setShowaggrement_east] = useState(false);
  const [showaggrement_west, setShowaggrement_west] = useState(false);
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
                  name="branch_name"
                  text="الفرع"
                  value={formData.branch_name}
                  change={handleChange}
                  options={branches.map((b) => ({ value: b, label: b }))}
                />
                <div className="widthbetween"></div>
                <SearchableSelect
                  name="builderMosque_name"
                  text="اسم الباني"
                  value={formData.builderMosque_name}
                  change={handleChange}
                  options={builders.map((b) => ({ value: b, label: b }))}
                />
                <div className="widthbetween"></div>
                <SelectWithLabel
                  name="aggrement_agreementType"
                  text="نوع الاتفاقية"
                  value={formData.aggrement_agreementType}
                  change={handleChange}
                  value1={agreementTypes[0] || "الجميع"}
                  value2={agreementTypes[1] || ""}
                  value3={agreementTypes[2] || ""}
                  value4={agreementTypes[3] || ""}
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
                  change={(e) => setShowaggrement_west(e.target.checked)}
                />
                <Checkpoint
                  text="شرق"
                  change={(e) => setShowaggrement_east(e.target.checked)}
                />
                <Checkpoint
                  text="شمال"
                  change={(e) => setShowaggrement_north(e.target.checked)}
                />
                <Checkpoint
                  text="جنوب"
                  change={(e) => setShowaggrement_south(e.target.checked)}
                />
                <Checkpoint
                  text="اجمالي المساحة"
                  change={(e) => setShowaggrement_totalArea(e.target.checked)}
                />
                <Checkpoint
                  text="الشاهد الثاني"
                  change={(e) =>
                    setShowaggrement_secondWitness(e.target.checked)
                  }
                />
                <Checkpoint
                  text="الشاهد الأول"
                  change={(e) =>
                    setShowaggrement_firstWitness(e.target.checked)
                  }
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
                      {showaggrement_firstWitness && <th>الشاهد الأول</th>}
                      {showaggrement_secondWitness && <th>الشاهد الثاني</th>}
                      <th>الطول</th>
                      <th>العرض</th>
                      {showaggrement_totalArea && <th>اجمالي المساحة</th>}
                      {showaggrement_south && <th>جنوبا</th>}
                      {showaggrement_north && <th>شمالا</th>}
                      {showaggrement_east && <th>شرقا</th>}
                      {showaggrement_west && <th>غربا</th>}
                      <th>الفرع</th>
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
                          <td>{a.aggrement_aggrementNo}</td>
                          <td>{a.aggrement_agreementType}</td>
                          <td>{a.aggrement_date}</td>
                          <td>{a.aggrement_timeToBuild}</td>
                          {showaggrement_firstWitness && (
                            <td>{a.aggrement_firstWitness}</td>
                          )}
                          {showaggrement_secondWitness && (
                            <td>{a.aggrement_secondWitness}</td>
                          )}
                          <td>{a.aggrement_height}</td>
                          <td>{a.aggrement_width}</td>
                          {showaggrement_totalArea && (
                            <td>{a.aggrement_totalArea}</td>
                          )}
                          {showaggrement_south && <td>{a.aggrement_south}</td>}
                          {showaggrement_north && <td>{a.aggrement_north}</td>}
                          {showaggrement_east && <td>{a.aggrement_east}</td>}
                          {showaggrement_west && <td>{a.aggrement_west}</td>}
                          <td>{getBuilderBranch(a.builderMosque_name)}</td>
                          <td>{a.builderMosque_name}</td>
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
