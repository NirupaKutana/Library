import { useNavigate } from "react-router-dom";
import '../style/unauthorized.css'
const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="unauth-container">
        <div className="unauth-card">
        <h1 className="unauth-code" >403</h1>
        <h2 className="unauth-title">Access Denied</h2>
        <p className="unauth-text" >You don’t have permission to access this page.</p>
        <div className="unauth-actions">
        <button className="btn primary" onClick={() => navigate("/")}>Go to Home</button>
        <button className="btn secondary" onClick={() =>{localStorage.clear(); navigate("/login");}}>Logout</button>
        </div>
        </div>
    </div>
    </>
  );
};


export default Unauthorized;
