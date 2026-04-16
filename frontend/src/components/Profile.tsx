import { useEffect, useState } from "react";
import "../style/Profile.css";
import API from "../Api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Books from "./Books";
import Category from "./Category";
import Author from "./Author";
import Issue from "./Issue";
import Dashboard from "./Dashboard";
import Audit from "./Audit";
import LoginAudit from "./LoginAudit";
import UserList from "./UserList";
import ImageFile from "./ImageFile";
import Librarian from "./Librarian";
import RoleRights from "./RoleRights";
import { hasPermission, hasAllPermissions } from "./RBAC";
import ViewRoleRights from "./ViewRoleRights";

/* ── ONE icon for all group headers ── */
const GroupIcon = () => (
  <svg className="nav-icon" width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

/* ── ONE icon for all sub-items ── */
const LeafIcon = () => (
  <svg className="nav-icon leaf" width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

const Chevron = ({ open }: { open: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ marginLeft: "auto", flexShrink: 0, opacity: 0.45,
      transition: "transform 0.28s cubic-bezier(.4,0,.2,1)",
      transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── types ── */
type Tab =
  | "Dashboard" | "Users" | "Librarian" | "Role-Right" | "View-RoleRight"
  | "issue" | "Book" | "AddImage" | "Category" | "Author"
  | "Audit" | "LoginAudit" | "profile";

interface NavItem  { label: string; tab: Tab; }
interface NavGroup { label: string; items: NavItem[]; }

const NavLeaf = ({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) => (
  <li className={`nav-item sub ${active ? "active" : ""}`} onClick={onClick}>
    <LeafIcon />
    <span>{item.label}</span>
    {active && <span className="nav-pip" />}
  </li>
);

const NavDropdown = ({ group, activeTab, onSelect }: { group: NavGroup; activeTab: Tab; onSelect: (t: Tab) => void }) => {
  const hasActive = group.items.some((i) => i.tab === activeTab);
  const [open, setOpen] = useState(hasActive);
  useEffect(() => { if (hasActive) setOpen(true); }, [hasActive]);

  return (
    <div className="nav-group">
      <div className={`nav-group-header ${hasActive ? "has-active" : ""}`} onClick={() => setOpen((o) => !o)}>
        <GroupIcon />
        <span>{group.label}</span>
        <Chevron open={open} />
      </div>
      <div className={`nav-group-body ${open ? "open" : ""}`}>
        <ul className="nav-sub-list">
          {group.items.map((item) => (
            <NavLeaf key={item.tab} item={item} active={activeTab === item.tab} onClick={() => onSelect(item.tab)} />
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   PROFILE COMPONENT  — logic UNCHANGED
═══════════════════════════════════════════ */
const Profile = () => {
  const location  = useLocation();
  const [userdata,  setUserData]  = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [userList,  setUserList]  = useState([]);
  const [issue,     setIssue]     = useState([]);
  const navigate     = useNavigate();
  const [issuedata, setIssuedata] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { navigate("/login"); return; }
    const user = localStorage.getItem("user");
    if (user) {
      const parseUser = JSON.parse(user);
      API.get(`/user/${parseUser.user_id}/`)
        .then((res) => setUserData(res.data))
        .catch((err) => console.log(err));
    }
  }, [navigate]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parseUser = JSON.parse(user);
      API.get(`/issue/user/${parseUser.user_id}/`)
        .then((res) => setIssuedata(res.data))
        .catch((err: any) => { toast.error(err.response?.data?.error); });
    }
  }, []);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    } else {
      const role = localStorage.getItem("role");
      if (role === "ADMIN")          setActiveTab("Dashboard");
      else if (role === "LIBRARIAN") setActiveTab("Users");
      else                           setActiveTab("profile");
    }
  }, [location.state]);

  useEffect(() => { API.get(`/getusers/`).then((res) => setUserList(res.data)); }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;
    const parseUser = JSON.parse(user);
    API.get(`/issue/user/${parseUser.user_id}/`).then((res) => setIssue(res.data));
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  const role    = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  /* Library group — Category & Author included */
  const libraryItems: NavItem[] = [];
  if (hasAllPermissions(["AddBook",     "ViewBook"]))     libraryItems.push({ label: "Books",       tab: "Book"     });
  if (hasPermission("AddImage"))                          libraryItems.push({ label: "Book Image",  tab: "AddImage" });
  if (hasPermission("IssueBook"))                         libraryItems.push({ label: "Issue Books", tab: "issue"    });
  if (hasAllPermissions(["AddCategory", "ViewCategory"])) libraryItems.push({ label: "Category",    tab: "Category" });
  if (hasAllPermissions(["AddAuthor",   "ViewAuthor"]))   libraryItems.push({ label: "Author",      tab: "Author"   });

  const logsItems: NavItem[] = [];
  if (hasPermission("ViewAudit"))      logsItems.push({ label: "Audit Logs",  tab: "Audit"      });
  if (hasPermission("ViewLoginAudit")) logsItems.push({ label: "Login Audit", tab: "LoginAudit" });

  const pageTitles: Partial<Record<Tab, string>> = {
    Dashboard: "Dashboard", Users: "User Management", Librarian: "Librarians",
    "Role-Right": "Role Rights", "View-RoleRight": "View Role Rights",
    issue: "Issue Books", Book: "Books", AddImage: "Book Images",
    Category: "Categories", Author: "Authors", Audit: "Audit Logs", LoginAudit: "Login Audit",
  };

  return (
    <div className="dashboard-container">

      {/* ══ SIDEBAR ══ */}
      <aside className="sidebar">

        {/* User card */}
        <div className="user-card">
          <div className="user-avatar">
            {userdata?.user_name?.charAt(0).toUpperCase() ?? "?"}
            <span className="avatar-ring" />
          </div>
          <div className="user-info">
            <p className="user-name">{userdata?.user_name ?? "Loading…"}</p>
            <p className="user-email">{userdata?.user_email}</p>
          </div>
          <span className="user-role-badge">{role}</span>
        </div>

        {/* Nav */}
        <div className="nav-section-label">NAVIGATION</div>

        <nav className="sidebar-nav">
          {isAdmin && (
            <ul className="nav-top-list">
              <li className={`nav-item top-level ${activeTab === "Dashboard" ? "active" : ""}`}
                onClick={() => setActiveTab("Dashboard")}>
                <GroupIcon />
                <span>Dashboard</span>
                {activeTab === "Dashboard" && <span className="nav-pip" />}
              </li>
            </ul>
          )}

          {hasPermission("ViewUsers") && (
            <ul className="nav-top-list">
              <li className={`nav-item top-level ${activeTab === "Users" ? "active" : ""}`}
                onClick={() => setActiveTab("Users")}>
                <GroupIcon />
                <span>User List</span>
                {activeTab === "Users" && <span className="nav-pip" />}
              </li>
            </ul>
          )}

          {libraryItems.length > 0 && (
            <NavDropdown group={{ label: "Library", items: libraryItems }} activeTab={activeTab} onSelect={setActiveTab} />
          )}

          {isAdmin && (
            <NavDropdown
              group={{
                label: "Administration",
                items: [
                  { label: "Librarians",      tab: "Librarian"      },
                  { label: "Role Rights",      tab: "Role-Right"     },
                  { label: "View Role Rights", tab: "View-RoleRight" },
                ],
              }}
              activeTab={activeTab} onSelect={setActiveTab}
            />
          )}

          {logsItems.length > 0 && (
            <NavDropdown group={{ label: "Logs", items: logsItems }} activeTab={activeTab} onSelect={setActiveTab} />
          )}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="footer-status-row">
            <span className="status-dot" />
            <span className="status-text">All systems operational</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ══ CONTENT ══ */}
      <main className="content-area">
        <header className="content-topbar">
          <div className="topbar-left">
            <h1 className="page-title">{pageTitles[activeTab] ?? "Home"}</h1>
          </div>
          <div className="topbar-right">
            <div className="date-chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>
        </header>

        <div className="content-body">
          {activeTab === "Dashboard"      && <Dashboard />}
          {activeTab === "Users"          && <UserList />}
          {activeTab === "Librarian"      && <Librarian />}
          {activeTab === "Role-Right"     && <RoleRights />}
          {activeTab === "View-RoleRight" && <ViewRoleRights />}
          {activeTab === "issue"          && <Issue />}
          {activeTab === "Book"           && <Books />}
          {activeTab === "AddImage"       && <ImageFile />}
          {activeTab === "Category"       && <Category />}
          {activeTab === "Author"         && <Author />}
          {activeTab === "Audit"          && userList && <Audit />}
          {activeTab === "LoginAudit"     && userList && <LoginAudit />}
        </div>
      </main>
    </div>
  );
};

export default Profile;