import { useState, useEffect } from "react";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Searchsection from "../../../components/Searchsection";
// @ts-ignore
import Swal from "sweetalert2";
import "../../../style/Modal.css"; // تغيير من Details.css إلى Modal.css
// استيراد أيقونات التعديل والحذف
// @ts-ignore
import { RiDeleteBin6Line } from "react-icons/ri";
// @ts-ignore
import { FiEdit } from "react-icons/fi";

// مكون تفاصيل المصروف - تم تحديثه ليشبه بقية الإدارات
function ExpenseDetails({ expense, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  if (!expense) return null;

  const handleClose = () => {
    setIsClosing(true);
    // انتظر حتى ينتهي الانيميشن قبل إغلاق النافذة فعليًا
    setTimeout(() => {
      onClose();
    }, 280); // وقت أقل قليلاً من مدة الانيميشن (300ms)
  };

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`}>
      <div className={`modal-content ${isClosing ? "closing" : ""}`}>
        <h2 className="modal-title">تفاصيل السند</h2>

        <div className="details-container">
          <div className="details-row">
            <span className="details-label">رقم السند:</span>
            <span className="details-value">{expense.bondNumber}</span>
          </div>

          <div className="details-row">
            <span className="details-label">التاريخ:</span>
            <span className="details-value">{expense.date}</span>
          </div>

          <div className="details-row">
            <span className="details-label">المبلغ:</span>
            <span className="details-value">{expense.amount} ريال</span>
          </div>

          <div className="details-row">
            <span className="details-label">المبلغ كتابة:</span>
            <span className="details-value">{expense.writtenAmount}</span>
          </div>

          <div className="details-row">
            <span className="details-label">اسم المستلم:</span>
            <span className="details-value">{expense.recipient}</span>
          </div>

          <div className="details-row">
            <span className="details-label">الجهة المستفيدة:</span>
            <span className="details-value">
              {"مسجد " + expense.mosqueName || "غير محدد"}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">وصف المصروف:</span>
            <span className="details-value">{expense.description}</span>
          </div>
        </div>

        <button className="modal-close-btn" onClick={handleClose}>
          إغلاق
        </button>
      </div>
    </div>
  );
}

export default function DisplaySearchExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // @ts-ignore
  const [, setSearchTerm] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null);
  // @ts-ignore
  const [, setMosques] = useState([]);

  // جلب بيانات المصروفات والمساجد
  const fetchData = async () => {
    try {
      setLoading(true);

      // جلب بيانات المصروفات
      const expensesResponse = await fetch("http://localhost:3001/Expenses");
      if (!expensesResponse.ok) {
        throw new Error("فشل في جلب بيانات المصروفات");
      }
      const expensesData = await expensesResponse.json();

      // جلب بيانات المساجد
      const mosquesResponse = await fetch("http://localhost:3001/Mosques");
      if (!mosquesResponse.ok) {
        throw new Error("فشل في جلب بيانات المساجد");
      }
      const mosquesData = await mosquesResponse.json();
      setMosques(mosquesData);

      // إضافة اسم المسجد إلى بيانات المصروفات
      const expensesWithMosqueNames = expensesData.map((expense) => {
        if (expense.mosque_id) {
          const mosque = mosquesData.find((m) => m.id === expense.mosque_id);
          return {
            ...expense,
            mosqueName: mosque ? mosque.name : "غير محدد",
          };
        }
        return {
          ...expense,
          mosqueName: "غير محدد",
        };
      });

      setExpenses(expensesWithMosqueNames);
      setFilteredExpenses(expensesWithMosqueNames);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // البحث في المصروفات
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredExpenses(expenses);
      return;
    }

    const filtered = expenses.filter((expense) =>
      expense.bondNumber.toString().includes(term)
    );
    setFilteredExpenses(filtered);
  };

  // حذف مصروف
  const handleDeleteExpense = async (id) => {
    // إضافة تأكيد قبل الحذف
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3001/Expenses/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("فشل في حذف المصروف");
        }

        Swal.fire({
          title: "تم الحذف!",
          text: "تم حذف المصروف بنجاح",
          icon: "success",
          confirmButtonText: "حسناً",
        });

        // تحديث القائمة بعد الحذف
        fetchData();
      } catch (err) {
        Swal.fire({
          title: "خطأ!",
          text: err.message,
          icon: "error",
          confirmButtonText: "حسناً",
        });
      }
    }
  };

  // تعديل مصروف
  const handleEditExpense = (id) => {
    // توجيه المستخدم إلى صفحة التعديل
    window.location.href = `/management/Expenses/EditExpense/${id}`;
  };

  // عرض تفاصيل المصروف
  const handleShowDetails = (expense) => {
    setSelectedExpense(expense);
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
        <Managmenttitle title="إدارة المصروفات" />
        {/*  */}
        {/* يحمل ما تحت العنوان */}
        <div className="subhomepage">
          {/* يحمل البوتنس */}
          <div className="divforbuttons">
            {/* تم تقسيمهن الى دفيين عشان كل دف يكون في الطرف */}

            {/* الثاني */}
            <div></div>
            {/* الاول */}
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Expenses/ReportExpenses"
              />
              <Mainbutton
                text="بحث"
                path="/management/Expenses/DisplaySearchExpenses"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Expenses/AddExpenses"
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
                  placeholder="ابحث برقم السند"
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
                ) : filteredExpenses.length === 0 ? (
                  <p>لا توجد مصروفات</p>
                ) : (
                  filteredExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="cards"
                      onClick={() => handleShowDetails(expense)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* رقم السند */}
                      <div>
                        <p>{expense.bondNumber || "رقم السند"}</p>
                      </div>
                      {/* اسم المسجد والأيقونات */}
                      <div className="displayflexjust alinmentcenter">
                        {/* اسم المسجد */}
                        <div>
                          <p>{"مسجد " + expense.mosqueName || "غير محدد"}</p>
                        </div>
                        {/* أيقونات التعديل والحذف */}
                        <div className="displayflexjust deleteAndEditicons">
                          <FiEdit
                            size="27"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditExpense(expense.id);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                          <div className="spacebetweenicons"></div>
                          <RiDeleteBin6Line
                            size="30"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteExpense(expense.id);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </div>
                    </div>
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

      {/* عرض تفاصيل المصروف عند اختيار مصروف */}
      {selectedExpense && (
        <ExpenseDetails
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </div>
  );
}
