import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import Footer from "../Layout/Footer";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Sidebar role="admin" />
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;