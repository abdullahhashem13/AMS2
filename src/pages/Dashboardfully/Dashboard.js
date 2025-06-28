import Saidbar from "../../components/saidbar";
import StatCard from "../../components/StatCard";
import Managmenttitle from "../../components/Managmenttitle";
import "../../components/StatCard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Dashboard() {
  // حالة إظهار كلمة السر لكل مستخدم
  const [showPassword, setShowPassword] = useState({});

  // تبديل إظهار/إخفاء كلمة السر لمستخدم معين
  const toggleShowPassword = (userId) => {
    setShowPassword((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };
  // حذف مستخدم مع تأكيد
  const handleDeleteUser = (userId) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف المستخدم نهائياً ولا يمكن التراجع!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3001/Users/${userId}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (res.ok) {
              setUsers((prev) => prev.filter((u) => u.id !== userId));
              Swal.fire("تم الحذف!", "تم حذف المستخدم بنجاح.", "success");
            } else {
              Swal.fire("خطأ", "حدث خطأ أثناء حذف المستخدم!", "error");
            }
          })
          .catch(() => {
            Swal.fire("خطأ", "تعذر الاتصال بالخادم!", "error");
          });
      }
    });
  };
  // بيانات AllData
  const [allData, setAllData] = useState({});
  const [stats, setStats] = useState([]);

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  // ضع هنا stats إذا كنت تحتاجها لاحقاً
  useEffect(() => {
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        setAllData(data);
        setUsers(data.Users || []);
        // بناء الكروت الإحصائية ديناميكياً
        setStats([
          {
            image: "mosques.png",
            label: "عدد المساجد",
            value: Array.isArray(data.Mosques) ? data.Mosques.length : 0,
            color: "#4e73df",
          },
          {
            image: "properties.png",
            label: "عدد الأعيان",
            value: Array.isArray(data.Properties) ? data.Properties.length : 0,
            color: "#1cc88a",
          },
          {
            image: "employees.png",
            label: "عدد القائمين بالمساجد",
            value: Array.isArray(data.Employees) ? data.Employees.length : 0,
            color: "#36b9cc",
          },
          {
            image: "branches.png",
            label: "عدد الفروع",
            value: Array.isArray(data.Branches) ? data.Branches.length : 0,
            color: "#f6c23e",
          },
          {
            image: "guaid.png",
            label: "عدد مراكز التحفيظ",
            value: Array.isArray(data.Gauidnces) ? data.Gauidnces.length : 0,
            color: "#e74a3b",
          },
          {
            image: "aenats.png",
            label: "عدد المستأجرين",
            value: Array.isArray(data.Tenants) ? data.Tenants.length : 0,
            color: "#858796",
          },
          {
            image: "profile.png",
            label: "عدد البنائين",
            value: Array.isArray(data.Builder) ? data.Builder.length : 0,
            color: "#6f42c1",
          },
          {
            image: "aggrements.png",
            label: "عدد الاتفاقيات",
            value: Array.isArray(data.Aggrements) ? data.Aggrements.length : 0,
            color: "#17a2b8",
          },
          {
            image: "contracts.png",
            label: "عدد العقود",
            value: Array.isArray(data.PropertyContract)
              ? data.PropertyContract.length
              : 0,
            color: "#dc3545",
          },
          {
            image: "expenses.png",
            label: "المصروفات",
            value: Array.isArray(data.Expenses)
              ? data.Expenses.reduce(
                  (sum, e) => sum + (parseFloat(e.amount) || 0),
                  0
                )
              : 0,
            color: "#fd7e14",
          },
          {
            image: "revenues.png",
            label: "الايرادات",
            value: Array.isArray(data.Revenues)
              ? data.Revenues.reduce(
                  (sum, r) => sum + (parseFloat(r.amount) || 0),
                  0
                )
              : 0,
            color: "#20c997",
          },
        ]);
      });
  }, []);

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div style={{ width: "100%", padding: "32px 24px", marginLeft: 40 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Managmenttitle title="لوحة التحكم" />
          <div
            style={{
              background: "#97c1ab",
              borderRadius: 18,
              padding: "32px 18px 24px 18px",
              marginTop: 24,
              width: "fit-content",
              marginLeft: "auto",
              marginRight: "auto",
              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.07)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "18px",
                justifyItems: "center",
                alignItems: "center",
                maxWidth: 1100,
              }}
            >
              {(() => {
                const cards = [];
                const n = stats.length;
                const perRow = 3;
                for (let i = 0; i < n; i += perRow) {
                  const row = stats.slice(i, i + perRow);
                  // إذا كان هذا هو السطر الأخير وفيه كاردين فقط
                  if (row.length === 2 && i + perRow >= n) {
                    // أضف div فارغ مخفي بنفس حجم الكارد في البداية لمحاذاة وسطية
                    cards.push(
                      <div
                        key={`empty-begin-${i}`}
                        style={{ visibility: "hidden" }}
                      >
                        <StatCard
                          label=""
                          value=""
                          image=""
                          color="#fff"
                          icon={null}
                        />
                      </div>
                    );
                    row.forEach((stat, j) => {
                      cards.push(
                        <StatCard
                          key={i + j}
                          {...stat}
                          icon={null}
                          image={process.env.PUBLIC_URL + "/" + stat.image}
                        />
                      );
                    });
                  } else if (row.length === 1 && i + perRow >= n) {
                    // لو كان هناك كارد واحد فقط في السطر الأخير
                    cards.push(<div key={`empty-begin1-${i}`}></div>);
                    cards.push(
                      <StatCard
                        key={i}
                        {...row[0]}
                        icon={null}
                        image={process.env.PUBLIC_URL + "/" + row[0].image}
                      />
                    );
                    cards.push(<div key={`empty-end1-${i}`}></div>);
                  } else {
                    row.forEach((stat, j) => {
                      cards.push(
                        <StatCard
                          key={i + j}
                          {...stat}
                          icon={null}
                          image={process.env.PUBLIC_URL + "/" + stat.image}
                        />
                      );
                    });
                  }
                }
                return cards;
              })()}
            </div>
          </div>
          {/* جدول المستخدمين */}
          <div
            style={{
              width: "100%",
              maxWidth: 1100,
              marginTop: 36,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Managmenttitle title="إدارة المستخدمين" />
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06)",
                padding: "18px 12px",
                overflowX: "auto",
                width: "100%",
                maxWidth: 1100,
              }}
            >
              {/* زر إضافة مستخدم */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: 16,
                }}
              >
                <button
                  style={{
                    background: "var(--primary-color)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 20px",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 1px 4px 0 rgba(0,0,0,0.07)",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#375ab7")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "var(--primary-color)")
                  }
                  onClick={() => navigate("/Registrationpage")}
                >
                  إضافة مستخدم
                </button>
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "inherit",
                }}
              >
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    <th
                      style={{
                        padding: "10px 8px",
                        border: "1px solid #e0e0e0",
                        fontWeight: 600,
                        fontSize: 16,
                      }}
                    >
                      الحالة
                    </th>
                    <th
                      style={{
                        padding: "10px 8px",
                        border: "1px solid #e0e0e0",
                        fontWeight: 600,
                        fontSize: 16,
                      }}
                    >
                      العمليات
                    </th>
                    <th
                      style={{
                        padding: "10px 8px",
                        border: "1px solid #e0e0e0",
                        fontWeight: 600,
                        fontSize: 16,
                      }}
                    >
                      الدور
                    </th>
                    <th
                      style={{
                        padding: "10px 8px",
                        border: "1px solid #e0e0e0",
                        fontWeight: 600,
                        fontSize: 16,
                      }}
                    >
                      كلمة السر
                    </th>
                    <th
                      style={{
                        padding: "10px 8px",
                        border: "1px solid #e0e0e0",
                        fontWeight: 600,
                        fontSize: 16,
                      }}
                    >
                      اسم المستخدم
                    </th>
                    <th
                      style={{
                        padding: "10px 8px",
                        border: "1px solid #e0e0e0",
                        fontWeight: 600,
                        fontSize: 16,
                      }}
                    >
                      الاسم الرباعي
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{ textAlign: "center", padding: 16 }}
                      >
                        لا يوجد مستخدمون
                      </td>
                    </tr>
                  ) : (
                    users.map((user, idx) => (
                      <tr key={user.id || idx}>
                        <td
                          style={{
                            padding: "8px 6px",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <select
                            value={user.status || "فعال"}
                            style={{
                              width: "100%",
                              padding: "4px 8px",
                              borderRadius: 6,
                              border: "1px solid #ccc",
                              fontSize: 15,
                              background: "#f9f9f9",
                              textAlign: "center",
                            }}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              setUsers((prev) =>
                                prev.map((u) =>
                                  u.id === user.id
                                    ? { ...u, status: newStatus }
                                    : u
                                )
                              );
                            }}
                          >
                            <option value="فعال">فعال</option>
                            <option value="موقف">موقف</option>
                          </select>
                        </td>
                        <td
                          style={{
                            padding: "8px 6px",
                            border: "1px solid #e0e0e0",
                            textAlign: "center",
                          }}
                        >
                          <span
                            style={{
                              cursor: "pointer",
                              color: "#e74c3c",
                              margin: "0 8px",
                              fontSize: 20,
                              verticalAlign: "middle",
                            }}
                            title="حذف"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            🗑️
                          </span>
                          <span
                            style={{
                              cursor: "pointer",
                              color: "#2980b9",
                              margin: "0 8px",
                              fontSize: 20,
                              verticalAlign: "middle",
                            }}
                            title="تعديل"
                            onClick={() => navigate(`/EditUser/${user.id}`)}
                          >
                            ✏️
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "8px 6px",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <select
                            value={user.role || "مدير عام"}
                            style={{
                              width: "100%",
                              padding: "4px 8px",
                              borderRadius: 6,
                              border: "1px solid #ccc",
                              fontSize: 15,
                              background: "#f9f9f9",
                              textAlign: "center",
                            }}
                            onChange={(e) => {
                              const newRole = e.target.value;
                              setUsers((prev) =>
                                prev.map((u) =>
                                  u.id === user.id ? { ...u, role: newRole } : u
                                )
                              );
                            }}
                          >
                            <option value="مدير عام">مدير عام</option>
                            <option value="مدير فرع">مدير فرع</option>
                            <option value="مدير المساجد">مدير المساجد</option>
                            <option value="مسؤول التحصيل">مسؤول التحصيل</option>
                            <option value="مسؤول الصندوق">مسؤول الصندوق</option>
                            <option value="مدير الارشاد">مدير الارشاد</option>
                          </select>
                        </td>
                        <td
                          style={{
                            padding: "8px 6px",
                            border: "1px solid #e0e0e0",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                direction: "ltr",
                                userSelect: "all",
                                fontFamily: "monospace",
                              }}
                            >
                              {showPassword[user.id] ? user.password : "******"}
                            </span>
                            <span
                              style={{
                                cursor: "pointer",
                                fontSize: 18,
                                color: showPassword[user.id]
                                  ? "#2980b9"
                                  : "#888",
                                verticalAlign: "middle",
                              }}
                              title={
                                showPassword[user.id]
                                  ? "إخفاء كلمة السر"
                                  : "إظهار كلمة السر"
                              }
                              onClick={() => toggleShowPassword(user.id)}
                            >
                              {showPassword[user.id] ? "🙈" : "👁️"}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "8px 6px",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          {user.username}
                        </td>
                        <td
                          style={{
                            padding: "8px 6px",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          {user.fullName}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
