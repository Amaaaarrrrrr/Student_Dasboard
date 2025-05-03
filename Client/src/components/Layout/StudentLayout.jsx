import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import Footer from "../Layout/Footer";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="student" />
        <main className="flex-1 p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default StudentLayout;
