// import Managmenttitle from "../components/Managmenttitle";
// @ts-ignore
import Saidbar from "../components/saidbar";
import Sectionmanagment from "../components/Sectionmanagment";
import "../style/home.css";

export default function Home() {
  return (
    // الديف يأخذ مساحة الصفحة الرئيسية كاملة
    <div className="displayflexhome">
      {/*  */}
      {/* سايد بار */}
      <Saidbar />
      {/*  */}
      {/* مساحة أخذنها بمثابة السايد البار لانه عملت السايد بار ثابت على اليسار */}
      <div className="sizeboxUnderSaidbar"></div>
      {/*  */}
      {/* ياخذ المحتوى الي بصفحة الرئيسية غير السايد بار */}
      <div className="homepage">
        {/*  */}
        {/* العنوان الرئيسي للصفحة الرئيسية */}
        <div className="divforlogintitlehome">
          <h1> نــظـام إدارة الاوقـــــــــاف</h1>
        </div>
        {/*  */}
        {/* العنوان الفرعي تحت الرئيسي */}
        {/* <Managmenttitle title="الإدارات" /> */}
        {/*  */}
        {/* يأخذ كل الاقسام الإدارة */}
        <div className="displayflexjust">
          <Sectionmanagment
            text="إدارة الفروع"
            image="branches.png"
            namepage="/management/Branchs/DisplaySearchBranch"
          />
          <Sectionmanagment
            text="إدارة الموظفين"
            image="employees.png"
            namepage="/management/Employee/DisplaySearchEmployee"
          />
          <Sectionmanagment
            text="إدارة المساجد"
            image="mosques.png"
            namepage="/management/Mosques/DisplaySearchMosque"
          />
          <Sectionmanagment
            text="إدارة الأعيان"
            image="properties.png"
            namepage="/management/Properties/DisplaySearchProperty"
          />
        </div>
        <div className="displayflexjust">
          <Sectionmanagment
            text="إدارة الإرشاد"
            image="guaid.png"
            namepage="/management/Gauidnces/DisplaySearchQuranCenter"
          />
          <Sectionmanagment
            text="إدارة المستأجرين"
            image="aenats.png"
            namepage="/management/Tenants/DisplaySearchTenant"
          />
          <Sectionmanagment
            text=" إدارة المصروفات "
            image="expenses.png"
            namepage="/management/Expenses/DisplaySearchExpenses"
          />
          <Sectionmanagment
            text="إدارة الإيرادات"
            image="revenues.png"
            namepage="/management/Revenues/DisplaySearchRevenues"
          />
        </div>
        <div className="displayflexjust">
          <Sectionmanagment
            text="إدارة العقود"
            image="contracts.png"
            namepage="/management/Contracts/DisplaySearchContract"
          />
          <Sectionmanagment
            text="إدارة الإتفاقيات"
            image="aggrements.png"
            namepage="/management/Aggrements/DisplaySearchAggrements"
          />
        </div>
      </div>
    </div>
  );
}
