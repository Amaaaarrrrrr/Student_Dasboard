import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/Layout/AdminLayout";
import LecturerLayout from "./components/Layout/LecturerLayout";
import StudentLayout from "./components/Layout/StudentLayout";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import Footer from "./components/Layout/Footer";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar role="student" /> {/* Adjust role dynamically */}
          <main className="flex-1 p-4 bg-gray-50">
            <Routes>
              {/* Public Route */}
              <Route path="/" element={<h1>Welcome to the Student Portal</h1>} />

              {/* Protected Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lecturer/*"
                element={
                  <ProtectedRoute allowedRoles={["lecturer"]}>
                    <LecturerLayout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/*"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;