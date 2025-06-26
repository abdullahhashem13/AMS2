import React, { useState, useEffect } from "react";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Searchsection from "../../../components/Searchsection";
import AggrementCard from "../../../components/AggrementCard";
import AgreementDetailsModal from "./AgreementDetails";
// @ts-ignore
import Swal from "sweetalert2";

export default function DisplaySearchAggrements() {
  const [agreements, setAgreements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        const aggs = data.Aggrements || [];
        setAgreements(aggs);
        setFiltered(aggs);
      });
  }, []);

  const handleSearch = (term) => {
    if (!term) {
      setFiltered(agreements);
      return;
    }
    setFiltered(
      agreements.filter(
        (a) => a.builderMosque_name && a.builderMosque_name.includes(term)
      )
    );
  };

  // دالة حذف الاتفاقية من السيرفر json-server مع تأكيد وحذف فعلي وتحديث القائمة
  const handleDeleteAggrement = async (id) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استعادة هذه الاتفاقية!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`http://localhost:3001/Aggrements/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("فشل في حذف الاتفاقية من السيرفر");
      const newAgreements = agreements.filter((a) => a.id !== id);
      setAgreements(newAgreements);
      setFiltered(newAgreements);
      Swal.fire("تم الحذف!", "تم حذف الاتفاقية بنجاح.", "success");
    } catch (err) {
      Swal.fire("خطأ!", "حدث خطأ أثناء حذف الاتفاقية.", "error");
      console.error("فشل حذف الاتفاقية من السيرفر", err);
    }
  };

  // دالة فتح التفاصيل من الكارد
  const handleCardDetails = (id) => {
    setSelectedId(id);
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
        <Managmenttitle title="إدارة الاتفاقيات" />
        {/*  */}
        {/* يحمل ما تحت العنوان */}
        <div className="subhomepage">
          {/* يحمل البوتنس */}
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
          {/*  */}
          {/* يحمل المحتوى تحت البوتنس */}
          <div className="divforconten">
            {/* يأخذ الدف الداخلي الذي سيحمل البحث والكاردات */}
            <div className="divforsearchandcards">
              {/* يأخذ عناصر البحث كاملا */}
              <div className="displayflexjust divforsearch">
                <Searchsection
                  placeholder="ابحث بإسم صاحب الاتفاقية"
                  maxLength="10"
                  onSearch={handleSearch}
                />
              </div>
              {/*  */}
              {/* ياخذ الكاردات */}
              <div className="divforcards">
                {filtered.map((a) => (
                  <AggrementCard
                    key={a.id}
                    builderMosque_name={a.builderMosque_name}
                    aggrement_agreementType={a.aggrement_agreementType}
                    aggrement_aggrementNo={a.aggrement_aggrementNo} // رقم الاتفاقية للعرض
                    id={a.id} // id الحقيقي للحذف
                    onDelete={handleDeleteAggrement}
                    onDetails={handleCardDetails}
                  />
                ))}
              </div>
              {/*  */}
            </div>
          </div>
          {/*  */}
        </div>
      </div>
      {/* نافذة التفاصيل المنبثقة */}
      {selectedId && (
        <AgreementDetailsModal
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
