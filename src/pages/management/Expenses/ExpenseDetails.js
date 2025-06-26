import React from "react";
import "../../../style/Modal.css";

export default function ExpenseDetails({ expense, onClose }) {
  if (!expense) return null;

  return (
    <div className="details-overlay">
      <div className="details-container">
        <div className="details-header">
          <h2>تفاصيل السند</h2>
          <button className="close-button" onClick={onClose}></button>
        </div>
        <div className="details-content">
          <div className="details-row">
            <div className="details-label">رقم السند:</div>
            <div className="details-value">
              {expense.paymentVoucher_bondNumber}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">التاريخ:</div>
            <div className="details-value">{expense.paymentVoucher_date}</div>
          </div>
          <div className="details-row">
            <div className="details-label">المبلغ:</div>
            <div className="details-value">
              {expense.paymentVoucher_amount} ريال
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">المبلغ كتابة:</div>
            <div className="details-value">
              {expense.paymentVoucher_writtenAmount}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">اسم المستلم:</div>
            <div className="details-value">
              {expense.paymentVoucher_recipient}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">الجهة المستفيدة:</div>
            <div className="details-value">
              {expense.mosque_name || "غير محدد"}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">وصف المصروف:</div>
            <div className="details-value">
              {expense.paymentVoucher_description}
            </div>
          </div>
        </div>
        <div className="details-footer">
          <button className="details-button" onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
