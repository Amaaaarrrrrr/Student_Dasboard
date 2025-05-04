import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import Footer from "../Layout/Footer";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {
  return (
    <div >
      <Navbar />
      <div >
        <Sidebar role="student" />
        <main >
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default StudentLayout;
