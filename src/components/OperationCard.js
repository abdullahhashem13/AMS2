import React from "react";

// النوع: add | edit | delete
// props: type, username, itemName, managementName
const typeMap = {
  add: {
    color: "#19c95a",
    label: "إضافة",
  },
  edit: {
    color: "#ffe600",
    label: "تعديل",
  },
  delete: {
    color: "#ff2222",
    label: "حذف",
  },
};

export default function OperationCard({
  type = "add",
  username,
  itemName,
  managementName,
  fontSize = 15,
  cardHeight = 60,
}) {
  const info = typeMap[type] || typeMap.add;
  let actionText = "";
  if (type === "add") {
    actionText = `بإضافة (${itemName}) في إدارة (${managementName})`;
  } else if (type === "edit") {
    actionText = `بتعديل على (${itemName}) في إدارة (${managementName})`;
  } else if (type === "delete") {
    actionText = `بحذف (${itemName}) في إدارة (${managementName})`;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "center",
        background: "#21867a",
        borderRadius: 14,
        marginBottom: 18,
        overflow: "hidden",
        minHeight: cardHeight,
        width: "96%",
        maxWidth: "900px",
        marginRight: "auto",
        marginLeft: "auto",
        boxSizing: "border-box",
        boxShadow: "0 2px 8px #0002, 0 1px 0 #fff3 inset",
        border: "1px solid #e6e6e6",
        transition: "box-shadow 0.2s",
        position: "relative",
      }}
    >
      <div
        style={{
          background: info.color,
          color: type === "edit" ? "#222" : "#fff",
          fontWeight: "bold",
          fontSize: fontSize + 2,
          minWidth: 80,
          textAlign: "center",
          padding: "10px 0",
          fontFamily: "amiri, cairo, Arial",
          borderTopLeftRadius: 14,
          borderBottomLeftRadius: 14,
          boxShadow:
            type === "add"
              ? "0 0 0 2px #19c95a33"
              : type === "edit"
              ? "0 0 0 2px #ffe60055"
              : "0 0 0 2px #ff222233",
        }}
      >
        {info.label}
      </div>
      <div
        style={{
          flex: 1,
          padding: "10px 16px 10px 0",
          color: "#fff",
          fontSize: fontSize,
          textAlign: "right",
          fontFamily: "amiri, cairo, Arial",
          letterSpacing: 0.2,
          lineHeight: 1.5,
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        <span
          style={{ display: "inline-block", direction: "rtl", width: "100%" }}
        >
          {`لقد قام المستخدم (${username}) ${actionText}`}
        </span>
      </div>
    </div>
  );
}
