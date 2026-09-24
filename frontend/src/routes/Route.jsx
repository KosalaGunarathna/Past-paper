// src/routes/Route.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";

// Home Page
import Home from "../pages/Home.jsx";

// Subject Pages
import OLevelSubjects from "../pages/subjects/OLevelSubjects.jsx";
import ALevelSubjects from "../pages/subjects/ALevelSubjects.jsx";
import SubjectDetail from "../pages/subjects/SubjectDetail.jsx";

// Paper & Search Pages
import SearchResults from "../pages/papers/SearchResults.jsx";
import DocumentViewer from "../pages/papers/DocumentViewer.jsx";
import Resources from "../pages/papers/Resources.jsx";

// Student Pages
import Dashboard from "../pages/student/Dashboard.jsx";

// Info & Contact Pages
import About from "../pages/info/About.jsx";
import Contact from "../pages/info/Contact.jsx";

// Auth Pages
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

// Admin Panel Layout & Pages
import AdminProtectedRoute from "../components/AdminProtectedRoute.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import ManageSubjects from "../pages/admin/ManageSubjects.jsx";
import ManagePapers from "../pages/admin/ManagePapers.jsx";
import ManageMetadata from "../pages/admin/ManageMetadata.jsx";
import ManageUsers from "../pages/admin/ManageUsers.jsx";

const router = createBrowserRouter([
  // Public & Student Routes
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "o-level", element: <OLevelSubjects /> },
      { path: "a-level", element: <ALevelSubjects /> },
      { path: "subject/:level/:subjectId", element: <SubjectDetail /> },
      { path: "search", element: <SearchResults /> },
      { path: "view/:paperId", element: <DocumentViewer /> },
      { path: "resources", element: <Resources /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "dashboard", element: <Dashboard /> },
    ],
  },
  // 🔒 Admin Panel Routes (Protected for Admin role only)
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "subjects", element: <ManageSubjects /> },
      { path: "papers", element: <ManagePapers /> },
      { path: "metadata", element: <ManageMetadata /> },
      { path: "users", element: <ManageUsers /> },
    ],
  },
]);

export default router;
