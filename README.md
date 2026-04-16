<div align="center">
  <h1>📚 Modern Library Management System</h1>
  <p><strong>A comprehensive, full-stack enterprise solution for managing library operations seamlessly.</strong></p>
</div>

---

## 📖 Overview

The **Modern Library Management System** is a robust and scalable web application designed to streamline the complex operations of a modern library. Built with enterprise-grade architecture, the platform serves multiple stakeholders—including Patrons (Users), Librarians, and Administrators—providing them with tailored interfaces and capabilities. 

From dynamic inventory tracking (Books, Authors, and Categories) to sophisticated Membership Management and secure Role-Based Access Control (RBAC), this system ensures an intuitive and highly secure user experience. It serves as an excellent demonstration of full-stack engineering, seamlessly integrating a powerful Python backend with a responsive, modern TypeScript frontend.

---

## ✨ Key Features

### 🔐 Security & Access Management
- **Role-Based Access Control (RBAC):** Customized dashboards, routing, and strict permission enforcement for Admins, Librarians, and standard Users.
- **Session Protection:** Automated session locking mechanisms and idle timeout features to protect user data from unauthorized access.
- **Database-Level Integrity:** Advanced PostgreSQL PL/pgSQL functions and triggers for robust data manipulation and integrity.

### 🏢 Library Operations
- **Inventory Management:** Effortlessly browse, add, and manage Books, Categories, and Authors.
- **Membership & Subscriptions:** Tiered membership plans with automated tracking of plan issuance and expiration.
- **Interactive Dashboards:** Visual representations of library data using Recharts, giving administrators and librarians a bird's-eye view of library health.

### 💻 Modern User Interface
- **Dynamic Single-Page Application (SPA):** Tabbed interface layouts and minimal page reloads using React Router context.
- **Responsive Overlays:** Interactive sliders (`Swiper`) for announcements or featured books.
- **Real-Time Feedback:** Instant notifications and form validations via `react-toastify` and `react-hook-form`.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 / TypeScript
- **State Management & Data Fetching:** React Query (TanStack), Axios
- **Routing:** React Router DOM v7
- **UI & Visualization:** Recharts (Analytics), Swiper (Carousels), React Toastify (Notifications)
- **Forms:** React Hook Form

### Backend
- **Framework:** Python / Django & Django REST Framework (DRF)
- **Database:** PostgreSQL (with complex PL/pgSQL stored procedures for roles)
- **Security:** CORS Headers, Custom Middlewares, API Token/JWT Integration
- **Mailing:** Django integrated SMTP Email Backend

---

## ⚙️ Prerequisites

Before you begin setting up the project locally, ensure you have the following installed on your system:
- **Node.js** (v18.x or higher) & **npm**
- **Python** (v3.9 or higher)
- **PostgreSQL** (Running locally or a cloud instance)
- **Git**

---

## 🚀 Installation & Setup Guide

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd Library_management
```

### 2. Database Overview
The application uses **PostgreSQL** as its foundation. To enforce robust, database-level security and logic, the architecture heavily relies on custom **Stored Procedures (SP)** and **Functions** (PL/pgSQL). These functions handle critical operations like creating users, managing roles, and assigning permissions.

*(Note: The full schemas and custom SQL functions can be previewed in the `Role_Rights.txt` file.)*

### 3. Backend Setup (Django)
Navigate to the backend directory and set up the Python environment:

```bash
cd backend
# Create a virtual environment
python -m venv env

# Activate the virtual environment
# Windows:
env\Scripts\activate
# macOS/Linux:
source env/bin/activate

# Install required dependencies
pip install django djangorestframework psycopg2-binary django-cors-headers

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Start the Django development server
python manage.py runserver
```
*The backend server should now be running on `http://localhost:8000/`.*

### 4. Frontend Setup (React/TypeScript)
Open a new terminal window, navigate to the frontend directory, and start the React application:

```bash
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm start
```
*The frontend application should now open in your browser automatically at `http://localhost:3000/`.*

---

## 🎯 Usage & Walkthrough

1. **Authentication:** 
   Upon loading the frontend, you will be prompted to log in. The system supports distinct roles: `ADMIN`, `LIBRARIAN`, and `USER`.
2. **User Dashboard:** 
   If logged in as a normal user, navigating to the Home page will present a clean layout with interactive tabs for **📚 Books**, **🗂 Category**, and **✍ Author**.
3. **Purchasing Memberships:** 
   Users can navigate to the Membership portal to buy or upgrade their subscription plans, communicating with the `/membership/` endpoints on the Django backend.
4. **Administration:** 
   Librarians and Admins bypass the standard user view to access broader dashboards allowing CRUD operations on the library inventory and user permissions.

---

## 📁 Project Structure

```text
Library_management/
│
├── backend/                   # Django REST API Backend
│   ├── backend/               # Main configurations (settings.py, urls.py)
│   ├── libApp/                # Core Library Domain App (Views, Services, Models, Serializers)
│   ├── media/                 # Uploaded static assets (book covers, profiles)
│   └── manage.py              # Django entry point
│
├── frontend/                  # React + TypeScript Frontend
│   ├── public/                # Static HTML/Assets
│   ├── src/                   # React Components, Contexts, Hooks, Styles
│   │   ├── components/        # View components (Home, Books, AddMembership, etc.)
│   │   ├── router/            # React Router setup
│   │   └── App.tsx            # Root application logic with Session Lock integration
│   ├── package.json           # Frontend dependencies and scripts
│   └── tsconfig.json          # TypeScript configurations
│
├── Role_Rights.txt            # Essential PL/pgSQL scripts for manual DB seeding
└── Deploy.txt                 # Deployment configurations for rendering DBs
```

---

## 🛡️ Future Enhancements
- **Automated Cron Jobs:** Scheduled tasks for automatically clearing expired memberships and sending reminder emails.
- **Dockerization:** Containerizing the frontend and backend using Docker Compose for easier environment standardizations.
- **Reporting:** Exporting charts and library histories directly to PDF/CSV formats for management meetings.

---

<div align="center">
  <i>Developed with ❤️ for Academic Excellence.</i>
</div>