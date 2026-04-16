import React from 'react';
import '../style/Notification.css';

interface NotificationProps {
  onClose: () => void;
}

const Notification = ({ onClose }: NotificationProps) => {
  return (
    <>
      {/* Backdrop overlay */}
      <div className="notification-backdrop" onClick={onClose}></div>
      
      {/* Drawer panel */}
      <div className="notification-drawer">
        <div className="notification-header">
          <div className="notification-title">
            <h3>Notifications</h3>
            <span className="badge">0 New</span>
          </div>
          <button onClick={onClose} className="btn-close-drawer" aria-label="Close">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="notification-body">
          <div className="notification-empty">
            <div className="empty-bell-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h4>All caught up!</h4>
            <p>You don't have any new notifications at the moment.</p>
          </div>
          
          {/* Example of a populated notification item for developer reference */}
          {/* 
          <div className="notification-item unread">
            <div className="notification-icon success">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="notification-content">
              <h5>Membership Renewed</h5>
              <p>Your premium plan has been actively renewed.</p>
              <span className="time">Just now</span>
            </div>
          </div> 
          */}
        </div>
      </div>
    </>
  );
};

export default Notification;