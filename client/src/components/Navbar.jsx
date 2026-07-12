import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        Bayou Bucket List
      </NavLink>

      <nav className="nav-links">
        <NavLink to="/">Adventures</NavLink>
        <NavLink to="/add">Add Adventure</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
