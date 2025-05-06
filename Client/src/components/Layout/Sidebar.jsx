import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  const links = {
    student: [
      { to: "/student/dashboard", label: "Dashboard" },
      { to: "/student/units", label: "Units" },
      { to: "/student/accommodation", label: "Accommodation" },
      { to: "/student/fees", label: "Fees" },
      { to: "/student/Announcement", label: "Announcement" },
      { to: "/student/documents", label: "Documents" },
      { to: "/student/grades", label: "Grades" },
    ],
    lecturer: [
      { to: "/lecturer/dashboard", label: "Dashboard" },
      { to: "/lecturer/courses", label: "Courses" },
      { to: "/lecturer/grades/courseId", label: "Grade Submission" },
      { to: "/lecturer/announcements", label: "Announcements" },
    ],
    admin: [
      { to: "/admin/dashboard", label: "Dashboard" },
      { to: "/admin/users", label: "Manage Users" },
      { to: "/admin/semesters", label: "Semesters" },
      { to: "/admin/hostels", label: "Hostels" },
      { to: "/admin/fees", label: "Fee Structures" },
      { to: "/admin/clearance", label: "Clearance Management" },
      { to: "/admin/logs", label: "Audit Logs" },
    ],
  };

  return (
    <aside>
      <nav>
        {(links[role] || []).map((link) => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;