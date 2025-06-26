import { useState, useEffect } from "react";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import Searchsection from "../../../components/Searchsection";
import QuranCenterCard from "../../../components/QuranCenterCard";

export default function DisplaySearchQuranCenter() {
  const [quranCenters, setQuranCenters] = useState([]);
  const [filteredCenters, setFilteredCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب مراكز القرآن عند تحميل الصفحة
  useEffect(() => {
    const fetchQuranCenters = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/Gauidnces");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuranCenters(data);
        setFilteredCenters(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quran centers:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuranCenters();
  }, []);

  // وظيفة البحث
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredCenters(quranCenters);
      return;
    }

    const filtered = quranCenters.filter((center) =>
      center.quranCenter_name.includes(searchTerm)
    );
    setFilteredCenters(filtered);
  };

  // وظيفة حذف مركز
  const handleDeleteCenter = (id) => {
    setQuranCenters(quranCenters.filter((center) => center.id !== id));
    setFilteredCenters(filteredCenters.filter((center) => center.id !== id));
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
        <Managmenttitle title="إدارة الارشاد" />
        {/*  */}
        {/* يحمل ما تحت العنوان */}
        <div className="subhomepage">
          {/* يحمل البوتنس */}
          <div className="divforbuttons">
            {/* تم تقسيمهن الى دفيين عشان كل دف يكون في الطرف */}
            <div>
              {/* <Bigbutton
                text="أنواع الموظفين"
                path="/management/Employee/TypesOfEmployee"
              /> */}
            </div>
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
          {/*  */}
          {/* يحمل المحتوى تحت البوتنس */}
          <div className="divforconten">
            {/* يأخذ الدف الداخلي الذي سيحمل البحث والكاردات */}
            <div className="divforsearchandcards">
              {/* يأخذ عناصر البحث كاملا */}
              <div className="displayflexjust divforsearch">
                <Searchsection
                  placeholder="ابحث بإسم المركز"
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
                ) : filteredCenters.length === 0 ? (
                  <p>لا توجد مراكز</p>
                ) : (
                  filteredCenters.map((center) => (
                    <QuranCenterCard
                      key={center.id}
                      id={center.id}
                      name={center.quranCenter_name}
                      mosqueName={center.mosque_name}
                      onDelete={handleDeleteCenter}
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
