import Saidbar from "../components/saidbar";
import Managmenttitle from "../components/Managmenttitle";
import OperationCard from "../components/OperationCard";
import SearchableSelect from "../components/SearchableSelect";
import SelectWithLabel4 from "../components/SelectWithLabel4";
import InputDate from "../components/InputDate";
import React, { useEffect, useState } from "react";

// الإدارات التي تريد مراقبتها
const MANAGEMENTS = [
  { key: "Users", name: "المستخدمين" },
  { key: "Employees", name: "الموظفين" },
  { key: "Contracts", name: "العقود" },
  { key: "Properties", name: "العقارات" },
  { key: "Revenues", name: "الإيرادات" },
  { key: "Expenses", name: "المصروفات" },
  { key: "Mosques", name: "المساجد" },
  { key: "QuranCenters", name: "مراكز القرآن" },
  { key: "Tenants", name: "المستأجرين" },
  { key: "Branches", name: "الفروع" },
];

export default function Notfigation() {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usernames, setUsernames] = useState([]);
  const [filters, setFilters] = useState({
    username: "all",
    type: "الجميع",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        let ops = [];
        let usersSet = new Set();
        MANAGEMENTS.forEach((mgmt) => {
          const arr = data[mgmt.key];
          if (Array.isArray(arr)) {
            arr.forEach((item) => {
              // عملية إضافة (كل عنصر موجود يعتبر مضاف)
              if (item.createdBy) usersSet.add(item.createdBy);
              ops.push({
                type: "add",
                username: item.createdBy || "غير معروف",
                itemName:
                  item.name ||
                  item.fullName ||
                  item.username ||
                  item.title ||
                  "عنصر",
                managementName: mgmt.name,
                date: item.createdAt || "",
              });
              // عملية تعديل (إذا كان هناك updatedBy أو updatedAt)
              if (item.updatedBy || item.updatedAt) {
                if (item.updatedBy) usersSet.add(item.updatedBy);
                ops.push({
                  type: "edit",
                  username: item.updatedBy || "غير معروف",
                  itemName:
                    item.name ||
                    item.fullName ||
                    item.username ||
                    item.title ||
                    "عنصر",
                  managementName: mgmt.name,
                  date: item.updatedAt || "",
                });
              }
              // عملية حذف (إذا كان هناك isDeleted أو deletedBy)
              if (item.isDeleted || item.deletedBy) {
                if (item.deletedBy) usersSet.add(item.deletedBy);
                ops.push({
                  type: "delete",
                  username: item.deletedBy || "غير معروف",
                  itemName:
                    item.name ||
                    item.fullName ||
                    item.username ||
                    item.title ||
                    "عنصر",
                  managementName: mgmt.name,
                  date: item.deletedAt || "",
                });
              }
            });
          }
        });
        // ترتيب العمليات من الأحدث للأقدم حسب التاريخ إذا وجد
        ops.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
        setOperations(ops);
        setUsernames(["الجميع", ...Array.from(usersSet)]);
        setLoading(false);
      })
      .catch(() => {
        setOperations([]);
        setUsernames(["الجميع"]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Managmenttitle title="مراقبة العمليات" />
        <div
          style={{
            width: "85%",
            marginTop: 20,
            background: "#fff",
            borderRadius: 12,
            minHeight: 100,
            boxShadow: "0 2px 8px #0001",
            padding: 16,
          }}
        >
          {/* حقول الفلترة */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <SearchableSelect
                name="username"
                value={filters.username}
                options={usernames.map((u) => ({ value: u, label: u }))}
                change={(e) =>
                  setFilters((f) => ({ ...f, username: e.target.value }))
                }
                text="اسم المستخدم"
                placeholder="اختر المستخدم أو الجميع"
              />
              <SelectWithLabel4
                name="type"
                value={filters.type}
                change={(e) =>
                  setFilters((f) => ({ ...f, type: e.target.value }))
                }
                value1="الجميع"
                value2="الاضافة"
                value3="التعديل"
                value4="الحذف"
                text="نوع العملية"
              />
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <InputDate
                name="fromDate"
                value={filters.fromDate}
                change={(e) =>
                  setFilters((f) => ({ ...f, fromDate: e.target.value }))
                }
                text="من تاريخ"
              />
              <InputDate
                name="toDate"
                value={filters.toDate}
                change={(e) =>
                  setFilters((f) => ({ ...f, toDate: e.target.value }))
                }
                text="إلى تاريخ"
              />
            </div>
          </div>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                color: "#888",
                fontFamily: "amiri",
                fontSize: 22,
              }}
            >
              جاري التحميل...
            </div>
          ) : operations.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#888",
                fontFamily: "amiri",
                fontSize: 22,
              }}
            >
              لا توجد عمليات حتى الآن
            </div>
          ) : (
            operations.map((op, i) => (
              <OperationCard key={i} {...op} fontSize={15} cardHeight={60} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
