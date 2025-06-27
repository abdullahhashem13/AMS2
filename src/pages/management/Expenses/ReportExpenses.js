import { useState, useEffect } from "react";

import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import SearchableSelect from "../../../components/SearchableSelect";
import Submitinput from "../../../components/submitinput";
import "../../../style/Table.css";
import ButtonInput from "../../../components/ButtonInput";
import InputDate from "../../../components/InputDate";

export default function ReportExpenses() {
  // تحديد تاريخ اليوم بالتنسيق المناسب (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    startofdate: "", // سيتم تحديثه لاحقًا بأقدم تاريخ
    endofdate: today,
    mosque_id: "الجميع",
  });
  const [error, setErrors] = useState({});
  const [mosques, setMosques] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  // @ts-ignore
  const [, setOldestDate] = useState("");

  // دالة لحساب مجموع المبالغ
  const calculateTotalAmount = () => {
    if (!filteredExpenses || filteredExpenses.length === 0) {
      return 0;
    }

    return filteredExpenses.reduce((total, expense) => {
      // تحويل المبلغ إلى رقم إذا كان نصًا
      const amount = parseFloat(expense.amount) || 0;
      return total + amount;
    }, 0);
  };

  // جلب المساجد والمصروفات عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // جلب المساجد
        const mosquesResponse = await fetch("http://localhost:3001/Mosques");
        if (!mosquesResponse.ok) {
          throw new Error("Failed to fetch mosques");
        }
        const mosquesData = await mosquesResponse.json();
        setMosques(mosquesData);

        // جلب المصروفات
        const expensesResponse = await fetch("http://localhost:3001/Expenses");
        if (!expensesResponse.ok) {
          throw new Error("Failed to fetch expenses");
        }
        const expensesData = await expensesResponse.json();

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

        // تحديد أقدم تاريخ سند
        if (expensesWithMosqueNames.length > 0) {
          // فرز المصروفات حسب التاريخ تصاعديًا
          const sortedExpenses = [...expensesWithMosqueNames].sort((a, b) => {
            return (
              // @ts-ignore
              new Date(a.date) - new Date(b.date)
            );
          });

          // الحصول على أقدم تاريخ
          const oldest = sortedExpenses[0].date;
          setOldestDate(oldest);

          // تحديث نموذج البيانات بأقدم تاريخ
          setFormData((prev) => ({
            ...prev,
            startofdate: oldest,
          }));

          // تطبيق الفلترة الأولية (من أقدم تاريخ إلى تاريخ اليوم وجميع المساجد)
          filterExpenses(expensesWithMosqueNames, {
            startofdate: oldest,
            endofdate: today,
            mosque_id: "الجميع",
          });
        } else {
          // إذا لم تكن هناك مصروفات، استخدم تاريخ اليوم
          setFormData((prev) => ({
            ...prev,
            startofdate: today,
          }));
          setOldestDate(today);
          setFilteredExpenses([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [today]);

  // دالة مساعدة للفلترة
  const filterExpenses = (expensesData, filterCriteria) => {
    let filtered = [...expensesData];

    // فلترة حسب المسجد
    if (filterCriteria.mosque_id && filterCriteria.mosque_id !== "الجميع") {
      filtered = filtered.filter(
        (expense) => expense.mosque_id === filterCriteria.mosque_id
      );
    }

    // فلترة حسب التاريخ (من تاريخ)
    if (filterCriteria.startofdate) {
      const startDate = new Date(filterCriteria.startofdate);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate;
      });
    }

    // فلترة حسب التاريخ (إلى تاريخ)
    if (filterCriteria.endofdate) {
      const endDate = new Date(filterCriteria.endofdate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate <= endDate;
      });
    }

    setFilteredExpenses(filtered);
  };

  const handleChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
    setErrors({ ...error, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    filterExpenses(expenses, formData);
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
        <Managmenttitle title="إدارة المصروفات" />
        <div className="subhomepage">
          <div className="divforbuttons">
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
          <div>
            <form className="divforconten" onSubmit={handleSubmit}>
              <div className="RowForInsertinputs">
                <InputDate
                  name="endofdate"
                  text="الى تاريخ"
                  value={formData.endofdate}
                  change={handleChange}
                />
                <div className="widthbetween"></div>
                <InputDate
                  name="startofdate"
                  text="من تاريخ"
                  value={formData.startofdate}
                  change={handleChange}
                  disabled={true} // جعل حقل "من تاريخ" غير قابل للتعديل
                />
                <SearchableSelect
                  name="mosque_id"
                  text="المسجد"
                  options={[
                    { value: "الجميع", label: "الجميع" },
                    ...mosques.map((mosque) => ({
                      value: mosque.id,
                      label: mosque.name,
                    })),
                  ]}
                  value={formData.mosque_id}
                  change={handleChange}
                />
              </div>
              <div className="RowForInsertinputs">
                <Submitinput text="نتيجة" />
              </div>
              <div className="divfortable">
                <table id="propertyreport">
                  <thead>
                    <tr>
                      <th>رقم السند</th>
                      <th>التاريخ</th>
                      <th>مقابل</th>
                      <th>المبلغ</th>
                      <th>اسم المسجد</th>
                      <th>بيد المحترم</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          // @ts-ignore
                          colSpan="6"
                        >
                          جاري تحميل البيانات...
                        </td>
                      </tr>
                    ) : filteredExpenses.length === 0 ? (
                      <tr>
                        <td
                          // @ts-ignore
                          colSpan="6"
                        >
                          لا توجد بيانات متطابقة مع معايير البحث
                        </td>
                      </tr>
                    ) : (
                      <>
                        {filteredExpenses.map((expense) => (
                          <tr key={expense.id}>
                            <td>{expense.bondNumber || "غير محدد"}</td>
                            <td>{expense.date || "غير محدد"}</td>
                            <td>{expense.description || "غير محدد"}</td>
                            <td>{expense.amount || "0"}</td>
                            <td>{expense.mosqueName || "غير محدد"}</td>
                            <td>{expense.recipient || "غير محدد"}</td>
                          </tr>
                        ))}
                        {/* سطر المجموع */}
                        <tr className="total-row">
                          <td
                            // @ts-ignore
                            colSpan="3"
                            style={{ textAlign: "left", fontWeight: "bold" }}
                          ></td>
                          <td style={{ fontWeight: "bold" }}>
                            {calculateTotalAmount().toLocaleString()}
                          </td>
                          <td></td>
                          <td></td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="RowForInsertinputs"></div>
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
