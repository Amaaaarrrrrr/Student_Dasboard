import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-blue-800 text-white p-4 flex justify-between items-center shadow">
      <Link to="/" className="text-2xl font-bold">
        Student Dashboard
      </Link>
      <nav>
        <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
