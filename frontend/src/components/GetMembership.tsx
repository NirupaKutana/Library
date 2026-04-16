import React, { useEffect, useState } from "react";
import API from "../Api/axios";
import AddMembership from "./AddMembership";
import "../style/GetMembership.css"

const GetMembership = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const getPlans = async () => {
    try {
      const res = await API.get("/membership/plan/");
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  return (
    <div className="membership-container">
      <div className="header-section">
        <h1 className="title">Pricing Plans</h1>
        <p className="subtitle">Choose the perfect plan for your reading needs. Simple, transparent pricing.</p>
      </div>

      <div className="plan-grid">
        {plans.map((plan) => {
          const isHighlight = plan[1] === "Yearly";
          return (
            <div
              key={plan.id !== undefined ? plan.id : plan[0]}
              className={`card ${isHighlight ? "highlight" : ""}`}
            >
              {isHighlight && <div className="badge">Most Popular</div>}

              <div className="card-header">
                <h3>{plan[1]}</h3>
                <h1>₹{plan[2]}<span>/plan</span></h1>
                <p className="description">Best for dedicated readers.</p>
              </div>

              <div className="divider"></div>

              <ul className="features-list">
                <li>
                  <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>
                    {plan[4] === -1 ? "Unlimited Books" : `${plan[4]} Max Books`}
                  </span>
                </li>
                <li>
                  <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{plan[5]} Days Access</span>
                </li>
                <li>
                  <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>{plan[6]}% Discount</span>
                </li>
              </ul>

              <button onClick={() => setSelectedPlan(plan)} className={isHighlight ? "btn-primary" : "btn-secondary"}>
                Get Started
              </button>
            </div>
          )
        })}
      </div>

      {selectedPlan && (
        <AddMembership
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
};

export default GetMembership;