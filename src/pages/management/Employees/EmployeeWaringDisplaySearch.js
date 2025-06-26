import React, { useState, useEffect } from "react";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/saidbar";
import Searchsection from "../../../components/Searchsection";
import EmployeeWarningCard from "../../../components/EmployeeWarningCard";

export default function EmployeeWaringDisplaySearch() {
  const [warnings, setWarnings] = useState([]);
  const [filteredWarnings, setFilteredWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWarnings();
  }, []);

  const fetchWarnings = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/EmployeeWaring");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWarnings(data);
      setFilteredWarnings(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching warnings:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredWarnings(warnings);
      return;
    }

    const filtered = warnings.filter((warning) =>
      warning.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWarnings(filtered);
  };

  const handleDeleteWarning = (id) => {
    // تحديث واجهة المستخدم بعد الحذف
    setWarnings(warnings.filter((warning) => warning.id !== id));
    setFilteredWarnings(
      filteredWarnings.filter((warning) => warning.id !== id)
    );
  };

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="إنذارات الموظفين" />
        <div className="subhomepage">
          <div className="divforbuttons">
            <div></div>
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Employee/EmployeeWaringReport"
              />
              <Mainbutton
                text="بحث"
                path="/management/Employee/EmployeeWaringDisplaySearch"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Employee/EmployeeWaringAdd"
              />
            </div>
          </div>
          <div className="divforconten">
            <div className="divforsearchandcards">
              <div className="displayflexjust divforsearch">
                <Searchsection
                  placeholder="ابحث بإسم الموظف"
                  maxLength="30"
                  onSearch={handleSearch}
                />
              </div>
              <div className="divforcards">
                {loading ? (
                  <p>جاري التحميل...</p>
                ) : error ? (
                  <p>خطأ: {error}</p>
                ) : filteredWarnings.length === 0 ? (
                  <p>لا توجد إنذارات</p>
                ) : (
                  filteredWarnings.map((warning) => (
                    <EmployeeWarningCard
                      key={warning.id}
                      id={warning.id}
                      employeeName={warning.employee_name}
                      typeOfWarning={warning.typeOfWarning}
                      onDelete={handleDeleteWarning}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
