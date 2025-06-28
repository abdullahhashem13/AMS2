// @ts-ignore
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loginpage from "./pages/Loginpage";
// import EditUser from "./pages/EditUser";
import EditUser from "./components/EditUser";
import NoMatch from "./pages/NoMatch";
import Registrationpage from "./pages/Registrationpage";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboardfully/Dashboard";

import Setting from "./pages/Setting";

import Notfigation from "./pages/Notfigation";
// @ts-ignore
import DisplaySearchAggrements from "./pages/management/Aggrements/DisplaySearchAggrements";
// @ts-ignore
import DisplaySearchProperty from "./pages/management/Properties/DisplaySearchProperty";
import AddProperty from "./pages/management/Properties/AddProperty";
import ReportProperty from "./pages/management/Properties/ReportProperty";
import TypesProperty from "./pages/management/Properties/TypesProperty";
import DisplaySearchMosque from "./pages/management/Mosques/DisplaySearchMosque";
import AddMosque from "./pages/management/Mosques/AddMosque";
import ReportMosque from "./pages/management/Mosques/ReportMosque";
import TypesMosque from "./pages/management/Mosques/TypesMosque";
import DisplaySearchEmployee from "./pages/management/Employees/DisplaySearchEmployee";
import AddEmployee from "./pages/management/Employees/AddEmployee";
import ReportEmployee from "./pages/management/Employees/ReportEmployee";
import TypesOfEmployee from "./pages/management/Employees/TypesOfEmployee";
import DisplaySearchBranch from "./pages/management/Branchs/DisplaySearchBranch";
import AddBranch from "./pages/management/Branchs/AddBranch";
import AllBranch from "./pages/management/Branchs/AllBranchs";
import DisplaySearchExpenses from "./pages/management/Expenses/DisplaySearchExpenses";
import AddExpenses from "./pages/management/Expenses/AddExpenses";
import ReportExpenses from "./pages/management/Expenses/ReportExpenses";
import DisplaySearchRevenues from "./pages/management/Revenues/DisplaySearchRevenues";
import AddRevenues from "./pages/management/Revenues/AddRevenues";
import ReportRevenues from "./pages/management/Revenues/ReportRevenues";
import EditRevenues from "./pages/management/Revenues/EditRevenues";
import ReportTenant from "./pages/management/Tenants/ReportTenant";
import AddTenant from "./pages/management/Tenants/AddTenant";
import DisplaySearchTenant from "./pages/management/Tenants/DisplaySearchTenant";
import AddQuranCenter from "./pages/management/Gauidnces/AddQuranCenter";
import DisplaySearchQuranCenter from "./pages/management/Gauidnces/DisplaySearchQuranCenter";
import ReportQuranCenter from "./pages/management/Gauidnces/ReportQuranCenter";
import AddAggrement from "./pages/management/Aggrements/AddAggrement";
import ReportAggrement from "./pages/management/Aggrements/ReportAggrement";
import DisplaySearchContract from "./pages/management/Contracts/DisplaySearchContract";
import ReportContract from "./pages/management/Contracts/ReportContract";
import AddLandFarmingContract from "./pages/management/Contracts/AddLandFarmingContract";
import AddWhiteLandContract from "./pages/management/Contracts/AddWhiteLandContract";
import AddPropertyContract from "./pages/management/Contracts/AddPropertyContract";
import TenantWaringAdd from "./pages/management/Tenants/TenantWaringAdd";
import TenantWaringDisplaySearch from "./pages/management/Tenants/TenantWaringDisplaySearch";
import TenantWaringReport from "./pages/management/Tenants/TenantWaringReport";
import EmployeeWaringAdd from "./pages/management/Employees/EmployeeWaringAdd";
import EmployeeWaringDisplaySearch from "./pages/management/Employees/EmployeeWaringDisplaySearch";
import EmployeeWaringReport from "./pages/management/Employees/EmployeeWaringReport";
import EditBranch from "./pages/management/Branchs/EditBranch";
import EditTenant from "./pages/management/Tenants/EditTenant";
import TenantWarningEdit from "./pages/management/Tenants/TenantWarningEdit";
import EditMosque from "./pages/management/Mosques/EditMosque";
import EditEmployee from "./pages/management/Employees/EditEmployee";
import EmployeeWaringEdit from "./pages/management/Employees/EmployeeWaringEdit";
import EditProperty from "./pages/management/Properties/EditProperty";
import EditQuranCenter from "./pages/management/Gauidnces/EditQuranCenter";
import EditExpense from "./pages/management/Expenses/EditExpense";
import DisplaySearchBuilders from "./pages/management/Builders/DisplaySearchBuilders";
import AddBuilder from "./pages/management/Builders/AddBuilder";
import EditBuilder from "./pages/management/Builders/EditBuilder";
import BuilderDetails from "./pages/management/Builders/BuilderDetails";
import ReportBuilders from "./pages/management/Builders/ReportBuilders";
import EditAggrement from "./pages/management/Aggrements/EditAggrement";
import EditLandFarmingContract from "./pages/management/Contracts/EditLandFarmingContract";
import EditWhiteLandContract from "./pages/management/Contracts/EditWhiteLandContract";
import EditPropertyContract from "./pages/management/Contracts/EditPropertyContract";
import EditRenewlyContract from "./pages/management/Contracts/EditRenewlyContract";
import AddRenewlyContract from "./pages/management/Contracts/AddRenewlyContract";

function App() {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* saidbar */}
          <Route path="/" element={<Loginpage />} />
          <Route path="/registrationpage" element={<Registrationpage />} />
          <Route path="*" element={<NoMatch />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Dashboardfully/Dashboard" element={<Dashboard />} />
          <Route path="/EditUser/:id" element={<EditUser />} />
          <Route path="/Setting" element={<Setting />} />
          <Route path="/Notfigation" element={<Notfigation />} />
          {/*  */}
          {/* managements */}
          {/* aggrements */}
          <Route
            path="/management/Aggrements/Display_Search"
            element={<DisplaySearchAggrements />}
          />
          {/*  */}
          {/* properties */}
          <Route
            path="/management/Properties/DisplaySearchProperty"
            element={<DisplaySearchProperty />}
          />
          <Route
            path="/management/Properties/AddProperty"
            element={<AddProperty />}
          />
          <Route
            path="/management/Properties/ReportProperty"
            element={<ReportProperty />}
          />
          <Route
            path="/management/Properties/TypesProperty"
            element={<TypesProperty />}
          />
          <Route
            path="/management/Properties/EditProperty/:id"
            element={<EditProperty />}
          />
          {/*  */}
          {/* Mosque */}
          <Route
            path="/management/Mosques/DisplaySearchMosque"
            element={<DisplaySearchMosque />}
          />
          <Route path="/management/Mosques/AddMosque" element={<AddMosque />} />
          <Route
            path="/management/Mosques/ReportMosque"
            element={<ReportMosque />}
          />
          <Route
            path="/management/Mosques/TypesMosque"
            element={<TypesMosque />}
          />
          <Route
            path="/management/Mosques/EditMosque/:id"
            element={<EditMosque />}
          />
          {/*  */}
          {/* Employee */}
          <Route
            path="/management/Employee/DisplaySearchEmployee"
            element={<DisplaySearchEmployee />}
          />
          <Route
            path="/management/Employee/AddEmployee"
            element={<AddEmployee />}
          />
          <Route
            path="/management/Employee/ReportEmployee"
            element={<ReportEmployee />}
          />
          <Route
            path="/management/Employee/TypesOfEmployee"
            element={<TypesOfEmployee />}
          />
          <Route
            path="/management/Employee/EmployeeWaringAdd"
            element={<EmployeeWaringAdd />}
          />
          <Route
            path="/management/Employee/EmployeeWaringDisplaySearch"
            element={<EmployeeWaringDisplaySearch />}
          />
          <Route
            path="/management/Employee/EmployeeWaringReport"
            element={<EmployeeWaringReport />}
          />
          <Route
            path="/management/Employee/EditEmployee/:id"
            element={<EditEmployee />}
          />
          {/*  */}
          {/* branch */}
          <Route
            path="/management/Branchs/DisplaySearchBranch"
            element={<DisplaySearchBranch />}
          />
          <Route path="/management/Branchs/AddBranch" element={<AddBranch />} />
          <Route path="/management/Branchs/AllBranch" element={<AllBranch />} />
          <Route
            path="/management/Branchs/EditBranch/:id"
            element={<EditBranch />}
          />

          {/*  */}
          {/* Expenses */}
          <Route
            path="/management/Expenses/DisplaySearchExpenses"
            element={<DisplaySearchExpenses />}
          />
          <Route
            path="/management/Expenses/AddExpenses"
            element={<AddExpenses />}
          />
          <Route
            path="/management/Expenses/ReportExpenses"
            element={<ReportExpenses />}
          />
          <Route
            path="/management/Expenses/EditExpense/:id"
            element={<EditExpense />}
          />
          {/*  */}
          {/* Revenues */}
          <Route
            path="/management/Revenues/DisplaySearchRevenues"
            element={<DisplaySearchRevenues />}
          />
          <Route
            path="/management/Revenues/AddRevenues"
            element={<AddRevenues />}
          />
          <Route
            path="/management/Revenues/ReportRevenues"
            element={<ReportRevenues />}
          />
          <Route
            path="/management/Revenues/EditRevenues/:id"
            element={<EditRevenues />}
          />
          {/*  */}
          {/* Tenants */}
          <Route
            path="/management/Tenants/DisplaySearchTenant"
            element={<DisplaySearchTenant />}
          />
          <Route path="/management/Tenants/AddTenant" element={<AddTenant />} />
          <Route
            path="/management/Tenants/ReportTenant"
            element={<ReportTenant />}
          />
          <Route
            path="/management/Tenants/EditTenant/:id"
            element={<EditTenant />}
          />

          <Route
            path="/management/Tenants/TenantWaringAdd"
            element={<TenantWaringAdd />}
          />
          <Route
            path="/management/Tenants/TenantWarningEdit/:id"
            element={<TenantWarningEdit />}
          />
          <Route
            path="/management/Tenants/TenantWaringDisplaySearch"
            element={<TenantWaringDisplaySearch />}
          />
          <Route
            path="/management/Tenants/TenantWaringReport"
            element={<TenantWaringReport />}
          />
          {/*  */}
          {/* Gauidnces */}
          <Route
            path="/management/Gauidnces/DisplaySearchQuranCenter"
            element={<DisplaySearchQuranCenter />}
          />
          <Route
            path="/management/Gauidnces/AddQuranCenter"
            element={<AddQuranCenter />}
          />
          <Route
            path="/management/Gauidnces/ReportQuranCenter"
            element={<ReportQuranCenter />}
          />
          <Route
            path="/management/Gauidnces/EditQuranCenter/:id"
            element={<EditQuranCenter />}
          />
          {/*  */}
          {/* Aggrement */}
          <Route
            path="/management/Aggrements/DisplaySearchAggrements"
            element={<DisplaySearchAggrements />}
          />
          <Route
            path="/management/Aggrements/AddAggrement"
            element={<AddAggrement />}
          />
          <Route
            path="/management/Aggrements/ReportAggrement"
            element={<ReportAggrement />}
          />
          <Route
            path="/management/Aggrements/EditAggrement/:id"
            element={<EditAggrement />}
          />
          {/*  */}
          {/* Contracts */}
          <Route
            path="/management/Contracts/DisplaySearchContract"
            element={<DisplaySearchContract />}
          />
          <Route
            path="/management/Contracts/ReportContract"
            element={<ReportContract />}
          />
          <Route
            path="/management/Contracts/AddLandFarmingContract"
            element={<AddLandFarmingContract />}
          />
          <Route
            path="/management/Contracts/AddWhiteLandContract"
            element={<AddWhiteLandContract />}
          />
          <Route
            path="/management/Contracts/AddPropertyContract"
            element={<AddPropertyContract />}
          />
          <Route
            path="/management/Employee/EmployeeWaringEdit/:id"
            element={<EmployeeWaringEdit />}
          />
          <Route
            path="/management/Contracts/EditLandFarmingContract/:id"
            element={<EditLandFarmingContract />}
          />
          <Route
            path="/management/Contracts/EditWhiteLandContract/:id"
            element={<EditWhiteLandContract />}
          />
          <Route
            path="/management/Contracts/EditPropertyContract/:id"
            element={<EditPropertyContract />}
          />
          <Route
            path="/management/Contracts/AddRenewlyContract/:id"
            element={<AddRenewlyContract />}
          />
          <Route
            path="/management/Contracts/EditRenewlyContract/:id"
            element={<EditRenewlyContract />}
          />
          <Route
            path="/management/Builders/DisplaySearchBuilders"
            element={<DisplaySearchBuilders />}
          />
          <Route
            path="/management/Builders/AddBuilder"
            element={<AddBuilder />}
          />
          <Route
            path="/management/Builders/EditBuilder/:id"
            element={<EditBuilder />}
          />
          <Route
            path="/management/Builders/BuilderDetails/:id"
            element={<BuilderDetails />}
          />
          <Route
            path="/management/Builders/ReportBuilders"
            element={<ReportBuilders />}
          />
          {/*  */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
