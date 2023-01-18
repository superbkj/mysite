import {Link, NavLink} from "react-router-dom";

function Header() {
  return (
    <nav className="navbar">
      <Link to="/">My Site</Link>
      <ul>
        <li>
          <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/new" className={({isActive}) => isActive ? "active" : ""}>New</NavLink>
        </li>
        <li>
          <NavLink to="/search" className={({isActive}) => isActive ? "active" : ""}>Search</NavLink>
        </li>
        <li>
          <NavLink to="/post" className={({isActive}) => isActive ? "active" : ""}>Post</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Header;