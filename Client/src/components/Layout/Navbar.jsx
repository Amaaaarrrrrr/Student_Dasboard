import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <header style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "#f5f5f5" }}>
      <Link to="/" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        Student Dashboard
      </Link>
      <nav>
        {!token ? (
          <>
            <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={{ cursor: "pointer" }}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
