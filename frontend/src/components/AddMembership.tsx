import React from "react";
import API from "../Api/axios";
import "../style/AddMembership.css";

const AddMembership = ({ plan, onClose }: any) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleBuy = async () => {
    try {
      const res = await API.post("user/plan/", {
        user_id: user.user_id,
        plan_id: plan[0] || plan.id,
      });

      alert(res.data.success);
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-modal">
        <div className="modal-header">
          <div className="icon-wrapper">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2>Confirm Subscription</h2>
        </div>

        <div className="modal-body">
          <p>You are about to subscribe to the <strong>{plan[1]}</strong> plan.</p>
          <div className="price-tag">
            Total: <span>₹{plan[2]}</span>
          </div>
          <p className="notice">This change will be applied to your account immediately.</p>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={handleBuy}>
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMembership;