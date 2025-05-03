import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  const links = {
    student: [
      { to: "/student/dashboard", label: "Dashboard" },
      { to: "/student/units", label: "Units" },
      { to: "/student/accommodation", label: "Accommodation" },
      { to: "/student/fees", label: "Fees" },
      { to: "/student/clearance", label: "Clearance" },
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
    <aside className="w-64 bg-white border-r p-4">
      <nav className="space-y-2">
        {(links[role] || []).map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="block py-2 px-3 rounded hover:bg-gray-100 text-gray-700"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
