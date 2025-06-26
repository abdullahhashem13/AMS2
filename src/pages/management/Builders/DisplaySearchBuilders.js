import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import { useEffect, useState } from "react";
import BuilderCard from "../../../components/BuilderCard";
// @ts-ignore
import Swal from "sweetalert2";
// @ts-ignore
import { useNavigate } from "react-router-dom";
import BuilderDetailsModal from "../../../components/BuilderDetailsModal";

export default function DisplaySearchBuilders() {
  const [builders, setBuilders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedBuilder, setSelectedBuilder] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        // جلب البنائين من مصفوفة Builder وليس Aggrements
        const all = data.Builder || [];
        setBuilders(all);
        setFiltered(all);
      });
  }, []);

  const handleSearch = (term) => {
    if (!term) {
      setFiltered(builders);
      return;
    }
    setFiltered(
      builders.filter(
        (b) => b.builderMosque_name && b.builderMosque_name.includes(term)
      )
    );
  };

  // حذف باني من AllData.json (محليًا فقط، إذا كان لديك API احذف من السيرفر)
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استعادة هذا الباني!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    });
    if (!result.isConfirmed) return;
    try {
      // حذف فعلي من السيرفر (json-server أو API)
      const res = await fetch(`http://localhost:3001/Builder/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("فشل في حذف الباني من السيرفر");
      // تحديث الواجهة بعد الحذف
      const newBuilders = builders.filter((b) => b.id !== id);
      setBuilders(newBuilders);
      setFiltered(newBuilders);
      Swal.fire("تم الحذف!", "تم حذف الباني بنجاح.", "success");
    } catch (err) {
      Swal.fire("خطأ!", "حدث خطأ أثناء حذف الباني.", "error");
      console.error("فشل حذف الباني من السيرفر", err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/management/Builders/EditBuilder/${id}`);
  };

  const handleShowDetails = (id) => {
    const builder = filtered.find((b) => b.id === id);
    setSelectedBuilder(builder);
    // جلب اسم الفرع
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        if (builder && data.Branches) {
          const branch = data.Branches.find(
            (br) => br.id === builder.builderMosque_branch
          );
          setSelectedBranch(branch ? branch.name : "-");
        } else {
          setSelectedBranch("");
        }
      });
  };

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إدارة البنائين" />
        <div className="subhomepage">
          <div className="divforbuttons" style={{ justifyContent: "flex-end" }}>
            <div
              className="displayflexjust"
              style={{ flexDirection: "row-reverse" }}
            >
              <Mainbutton text="إضافة" path="/management/Builders/AddBuilder" />
              <Mainbutton
                text="بحث"
                path="/management/Builders/DisplaySearchBuilders"
              />
              <Mainbutton
                text="تقرير"
                path="/management/Builders/ReportBuilders"
              />
            </div>
          </div>
          <div className="divforconten">
            <div className="divforsearchandcards">
              <div
                className="displayflexjust divforsearch"
                style={{
                  justifyContent: "center",
                  alignItems: "flex-start",
                  marginTop: "10px",
                  minHeight: 50,
                }}
              >
                <input
                  className="inputsearch"
                  type="text"
                  placeholder="ابحث باسم الباني"
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{
                    width: "30%",
                    minWidth: 220,
                    maxWidth: 400,
                    height: 30,
                    borderRadius: 50,
                    border: "2px solid black",
                    backgroundColor: "#97c1ab",
                    textAlign: "center",
                    fontSize: 18,
                    fontFamily: "amiri",
                  }}
                />
              </div>
              <div className="divforcards">
                {filtered.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#888",
                      marginTop: 20,
                    }}
                  >
                    لا يوجد نتائج مطابقة
                  </div>
                ) : (
                  filtered.map((b) => (
                    <BuilderCard
                      key={
                        b.id ||
                        b.builderMosque_NOIdentity ||
                        b.builderMosque_name
                      }
                      builderMosque_name={b.builderMosque_name}
                      onEdit={() => handleEdit(b.id)}
                      onDelete={() => handleDelete(b.id)}
                      onClick={() => handleShowDetails(b.id)}
                    />
                  ))
                )}
                <BuilderDetailsModal
                  builder={selectedBuilder}
                  branchName={selectedBranch}
                  onClose={() => setSelectedBuilder(null)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
