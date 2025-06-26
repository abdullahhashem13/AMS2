import React, { useEffect, useState } from "react";
// @ts-ignore
import { useParams, useNavigate } from "react-router-dom";
import Saidbar from "../../../components/saidbar";
import Managmenttitle from "../../../components/Managmenttitle";

export default function BuilderDetails() {
  const { id } = useParams();
  const [builder, setBuilder] = useState(null);
  const [branchName, setBranchName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/JsonData/AllData.json")
      .then((res) => res.json())
      .then((data) => {
        const found = (data.Builder || []).find((b) => b.id === id);
        setBuilder(found);
        if (found && data.Branches) {
          const branch = data.Branches.find(
            (br) => br.id === found.builderMosque_branch
          );
          setBranchName(branch ? branch.name : "-");
        }
      });
  }, [id]);

  if (!builder) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>جاري التحميل...</div>
    );
  }

  return (
    <div className="displayflexhome">
      <Saidbar />
      <div className="sizeboxUnderSaidbar"></div>
      <div className="homepage">
        <Managmenttitle title="تفاصيل الباني" />
        <div className="subhomepage">
          <div className="divforconten">
            <div className="details-card">
              <h2
                style={{
                  textAlign: "center",
                  color: "#2a5d4d",
                  marginBottom: 20,
                }}
              >
                بيانات الباني
              </h2>
              <div className="details-row">
                <span className="details-label">اسم الباني الرباعي:</span>
                <span>{builder.builderMosque_name || "-"}</span>
              </div>
              <div className="details-row">
                <span className="details-label">رقم الهوية:</span>
                <span>{builder.builderMosque_NOIdentity || "-"}</span>
              </div>
              <div className="details-row">
                <span className="details-label">رقم الهاتف:</span>
                <span>{builder.builderMosque_phone || "-"}</span>
              </div>
              <div className="details-row">
                <span className="details-label">الفرع:</span>
                <span>{branchName}</span>
              </div>
              <div className="details-row">
                <span className="details-label">المحافظة:</span>
                <span>{builder.builderMosque_governorate || "-"}</span>
              </div>
              <div className="details-row">
                <span className="details-label">المدينة:</span>
                <span>{builder.builderMosque_city || "-"}</span>
              </div>
              <div className="details-row">
                <span className="details-label">الحي:</span>
                <span>{builder.builderMosque_neighborhood || "-"}</span>
              </div>
              <div className="details-row">
                <span className="details-label">مكان الإصدار:</span>
                <span>{builder.builderMosque_issuedFrom || "-"}</span>
              </div>
              <div className="details-row">
                <span className="details-label">تاريخ الإصدار:</span>
                <span>{builder.builderMosque_issuedDate || "-"}</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 16,
                marginTop: 30,
              }}
            >
              <button className="mainbutton" onClick={() => navigate(-1)}>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
