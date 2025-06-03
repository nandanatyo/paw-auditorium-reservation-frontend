
import { useAuth } from "../contexts/auth/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  console.log("User in Navbar:", user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Conference Hub
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sessions">
                Sessions
              </Link>
            </li>
            {user && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  My Account
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/my-proposals">
                      My Proposals
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/my-sessions">
                      My Sessions
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/create-proposal">
                      Create Proposal
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            {user && user.role === "event_coordinator" && (
              <li className="nav-item">
                <Link className="nav-link" to="/coordinator">
                  Coordinator Dashboard
                </Link>
              </li>
            )}
            {user && user.role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  {user.name}
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/edit-profile">
                      Edit Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
