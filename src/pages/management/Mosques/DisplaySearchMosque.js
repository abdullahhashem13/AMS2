import React, { useState, useEffect } from "react";
import Bigbutton from "../../../components/Bigbutton";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import Searchsection from "../../../components/Searchsection";
import MosqueCard from "../../../components/MosqueCard";

export default function DisplaySearchMosque() {
  const [mosques, setMosques] = useState([]);
  const [filteredMosques, setFilteredMosques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMosques();
  }, []);

  const fetchMosques = async () => {
    try {
      setLoading(true);
      // استخدام ملف AllData.json بدلاً من API
      const response = await fetch("/JsonData/AllData.json");
      if (!response.ok) {
        throw new Error("فشل في جلب بيانات المساجد");
      }
      const data = await response.json();
      // استخراج مصفوفة المساجد من البيانات
      const mosquesData = data.Mosques || [];
      setMosques(mosquesData);
      setFilteredMosques(mosquesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching mosques:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredMosques(mosques);
      return;
    }

    const filtered = mosques.filter((mosque) =>
      mosque.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMosques(filtered);
  };

  const handleDeleteMosque = (id) => {
    setFilteredMosques(filteredMosques.filter((mosque) => mosque.id !== id));
    setMosques(mosques.filter((mosque) => mosque.id !== id));
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
        <Managmenttitle title="إدارة المساجد" />
        {/*  */}
        {/* يحمل ما تحت العنوان */}
        <div className="subhomepage">
          {/* يحمل البوتنس */}
          <div className="divforbuttons">
            {/* تم تقسيمهن الى دفيين عشان كل دف يكون في الطرف */}

            {/* الثاني */}
            <div>
              <Bigbutton
                text="أنواع المساجد"
                path="/management/Mosques/TypesMosque"
              />
            </div>
            {/* الاول */}
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Mosques/ReportMosque"
              />
              <Mainbutton
                text="بحث"
                path="/management/Mosques/DisplaySearchMosque"
              />
              <Mainbutton text="إضافة" path="/management/Mosques/AddMosque" />
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
                  placeholder="ابحث بإسم المسجد"
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
                ) : filteredMosques.length === 0 ? (
                  <p>لا توجد مساجد</p>
                ) : (
                  filteredMosques.map((mosque) => (
                    <MosqueCard
                      key={mosque.id}
                      id={mosque.id}
                      name={mosque.name}
                      statue={mosque.statue}
                      onDelete={handleDeleteMosque}
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
// تأكد أن جميع عمليات البحث والعرض تستخدم الأسماء الموحدة للحقول المذكورة.
