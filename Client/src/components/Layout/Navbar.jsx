import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="bg-red-800 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Title */}
        <h2 className="text-2xl font-bold text-white">
          Lecturer Dashboard
        </h2>

        {/* Navigation Links */}
        <div className="flex space-x-10">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-indigo-200'
                : 'text-white hover:text-indigo-100 transition-colors duration-300'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-indigo-200'
                : 'text-white hover:text-indigo-100 transition-colors duration-300'
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/announcements"
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-indigo-200'
                : 'text-white hover:text-indigo-100 transition-colors duration-300'
            }
          >
            Announcements
          </NavLink>
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-indigo-200'
                : 'text-white hover:text-indigo-100 transition-colors duration-300'
            }
          >
            Courses
          </NavLink>
          <NavLink
            to="/students"
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-indigo-200'
                : 'text-white hover:text-indigo-100 transition-colors duration-300'
            }
          >
            Students
          </NavLink>
          <NavLink
            to="/grades"
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-indigo-200'
                : 'text-white hover:text-indigo-100 transition-colors duration-300'
            }
          >
            Grades
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
