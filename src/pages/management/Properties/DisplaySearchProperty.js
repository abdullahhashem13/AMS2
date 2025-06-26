import React, { useState, useEffect } from "react";
import Bigbutton from "../../../components/Bigbutton";
import Mainbutton from "../../../components/Mainbutton";
import Managmenttitle from "../../../components/Managmenttitle";
import Saidbar from "../../../components/Saidbar";
import Searchsection from "../../../components/Searchsection";
import PropertyCard from "../../../components/PropertyCard";
// @ts-ignore

export default function DisplaySearchProperty() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch("/JsonData/AllData.json");
      if (!response.ok) {
        throw new Error("فشل في جلب بيانات الأعيان");
      }
      const data = await response.json();
      const propertiesData = data.Properties || [];
      setProperties(propertiesData);
      setFilteredProperties(propertiesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredProperties(properties);
      return;
    }

    const filtered = properties.filter((property) =>
      property.property_number.toString().includes(searchTerm)
    );
    setFilteredProperties(filtered);
  };

  const handleDeleteProperty = (id) => {
    setProperties(properties.filter((property) => property.id !== id));
    setFilteredProperties(
      filteredProperties.filter((property) => property.id !== id)
    );
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
        <Managmenttitle title="إدارة الأعيان" />
        {/*  */}
        {/* يحمل ما تحت العنوان */}
        <div className="subhomepage">
          {/* يحمل البوتنس */}
          <div className="divforbuttons">
            {/* تم تقسيمهن الى دفيين عشان كل دف يكون في الطرف */}

            {/* الثاني */}
            <div>
              <Bigbutton
                text="أنواع الاعيان"
                path="/management/Properties/TypesProperty"
              />
            </div>
            {/* الاول */}
            <div className="displayflexjust">
              <Mainbutton
                text="تقرير"
                path="/management/Properties/ReportProperty"
              />
              <Mainbutton
                text="بحث"
                path="/management/Properties/DisplaySearchProperty"
              />
              <Mainbutton
                text="إضافة"
                path="/management/Properties/AddProperty"
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
                  placeholder="ابحث برقم العين"
                  maxLength="10"
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
                ) : filteredProperties.length === 0 ? (
                  <p>لا توجد أعيان</p>
                ) : (
                  filteredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      id={property.id}
                      number={property.property_number}
                      type={property.property_type}
                      status={property.property_statue}
                      onDelete={handleDeleteProperty}
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
