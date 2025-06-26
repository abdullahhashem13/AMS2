import Bigbutton from "../../../components/Bigbutton";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Searchsection from "../../../components/Searchsection";
import BranchCard from "../../../components/BranchCard";
import { useEffect, useState } from "react";

export default function DisplaySearchBranch() {
  const [branches, setBranches] = useState([]);
  const [loding, setLoding] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // جلب البيانات مباشرة من ملف JSON المحلي
    fetch("/JsonData/AllData.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("فشل جلب ملف JSON");
        }
        return response.json();
      })
      .then((data) => {
        console.log("تم استلام البيانات:", data);
        setBranches(Array.isArray(data.Branches) ? data.Branches : []);
        setLoding(false);
      })
      .catch((err) => {
        console.error("خطأ في جلب البيانات:", err);
        setError(err.message);
        setLoding(false);
      });
  }, []);
  if (loding) {
    return <div>loding...</div>;
  }
  if (error) {
    return <div>error:{error}</div>;
  }

  const filteredBranches = branches.filter((branch) =>
    branch && branch.name
      ? branch.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false
  );
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  const handleDeleteBranch = async (branchId) => {
    try {
      // تحديث الواجهة أولاً
      setBranches((prevBranches) =>
        prevBranches.filter((branch) => branch.id !== branchId)
      );

      // يمكنك إزالة هذا السطر إذا كنت تريد الاعتماد على الحذف من BranchCard فقط
      // أو تركه كنسخة احتياطية
    } catch (error) {
      console.error("Error updating branches state:", error);
    }
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
        <Managmenttitle title="إدارة الفروع" />
        {/*  */}
        {/* يحمل ما تحت العنوان */}
        <div className="subhomepage">
          {/* يحمل البوتنس */}
          <div className="divforbuttons">
            {/* تم تقسيمهن الى دفيين عشان كل دف يكون في الطرف */}
            <div></div>
            {/* الاول */}
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
          {/*  */}
          {/* يحمل المحتوى تحت البوتنس */}
          <div className="divforconten">
            {/* يأخذ الدف الداخلي الذي سيحمل البحث والكاردات */}
            <div className="divforsearchandcards">
              {/* يأخذ عناصر البحث كاملا */}
              <div className="displayflexjust divforsearch">
                <Searchsection
                  placeholder="ابحث بإسم الفرع"
                  maxLength="30"
                  onSearch={handleSearch}
                />
              </div>
              {/*  */}
              {/* ياخذ الكاردات */}
              <div className="divforcards">
                {filteredBranches.map((branch) => (
                  <BranchCard
                    key={branch.id || branch._id}
                    id={branch.id || branch._id}
                    name={branch.name}
                    onDelete={handleDeleteBranch}
                  />
                ))}
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
