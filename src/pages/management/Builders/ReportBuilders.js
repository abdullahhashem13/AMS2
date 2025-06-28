import React, { useEffect, useState } from "react";
import Saidbar from "../../../components/saidbar";
import Managmenttitle from "../../../components/Managmenttitle";
import Mainbutton from "../../../components/Mainbutton";
import "../../../style/Table.css";

export default function ReportBuilders() {
  const [builders, setBuilders] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        setBuilders(data.Builder || []);
        setBranches(data.Branches || []);
      });
  }, []);

  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : "-";
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
            <div style={{ overflowX: "auto", width: "100%" }}>
              <table className="report-table" style={{ direction: "rtl" }}>
                <thead>
                  <tr>
                    <th>م</th>
                    <th>اسم الباني الرباعي</th>
                    <th>رقم الهاتف</th>
                    <th>رقم الهوية</th>
                    <th>الفرع</th>
                    <th>المحافظة</th>
                    <th>المدينة</th>
                    <th>الحي</th>
                    <th>مكان الإصدار</th>
                    <th>تاريخ الإصدار</th>
                  </tr>
                </thead>
                <tbody>
                  {builders.map((b, i) => (
                    <tr key={b.id || i}>
                      <td>{i + 1}</td>
                      <td>{b.name || "-"}</td>
                      <td>{b.phone || "-"}</td>
                      <td>{b.NOIdentity || "-"}</td>
                      <td>{getBranchName(b.branch)}</td>
                      <td>{b.governorate || "-"}</td>
                      <td>{b.city || "-"}</td>
                      <td>{b.neighborhood || "-"}</td>
                      <td>{b.issuedFrom || "-"}</td>
                      <td>{b.issuedDate || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
