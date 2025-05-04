import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header >
      <Link to="/" >
        Student Dashboard
      </Link>
      <nav>
        <button >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
