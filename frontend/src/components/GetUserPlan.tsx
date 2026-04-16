import React, { useEffect, useState } from 'react'
import API from '../Api/axios';
import '../style/GetUserPlan.css'

const GetUserPlan = () => {
    const [plan, setPlan] = useState<any>(null);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const getPlan = async (id:number) => {
      try {
        const res = await API.get(`/user/plan/${id}/`);
        setPlan(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    useEffect(() => {
      if (user.user_id) getPlan(user.user_id);
    }, []);

    return (
       <div className="formal-dashboard-widget">
        <div className="widget-header">
           <h2 className="widget-title">Active Subscription</h2>
           <p className="widget-subtitle">Manage your current billing cycle and benefits.</p>
        </div>

        {plan && plan.length > 0 ? (
          <div className="formal-plan-container">
            {plan.map((p:any, index:any) => (
              <div key={index} className="formal-plan-card">
                <div className="card-content">
                  
                  <div className="plan-header-flex">
                    <div className="plan-title-group">
                      <div className="badge-formal">Current Plan</div>
                      <h3 className="plan-name">{p[0]}</h3>
                    </div>
                    <div className="status-container-formal">
                      <div className="dot-formal"></div>
                      <span className="status-text-formal">Active</span>
                    </div>
                  </div>

                  <div className="validity-box-formal">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Renews on <strong>{p[4]}</strong></span>
                  </div>

                  <div className="formal-stats">
                    <div className="stat-box">
                      <div className="stat-icon-wrapper blue-accent">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="stat-info">
                        <span className="stat-label">Max Books</span>
                        <span className="stat-value">{p[1] === -1 ? 'Unlimited' : p[1]}</span>
                      </div>
                    </div>

                    <div className="stat-box">
                      <div className="stat-icon-wrapper green-accent">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="stat-info">
                        <span className="stat-label">Issue Period</span>
                        <span className="stat-value">{p[2]} Days</span>
                      </div>
                    </div>

                    <div className="stat-box">
                      <div className="stat-icon-wrapper purple-accent">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div className="stat-info">
                        <span className="stat-label">Discount</span>
                        <span className="stat-value">{p[3]}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="formal-empty-state">
            <div className="empty-icon-formal">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3>No Active Subscription</h3>
            <p>Upgrade to a plan to unlock library access and seamless reading features.</p>
            <button className="upgrade-btn-formal">Review Plans</button>
          </div>
        )}
      </div>
    )
}

export default GetUserPlan
