import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Header() {
  return (
    <nav className="header">
      <Link to="/">My Site</Link>
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/latest" className={({ isActive }) => (isActive ? 'active' : '')}>Latest</NavLink>
        </li>
        <li>
          <NavLink to="/search" className={({ isActive }) => (isActive ? 'active' : '')}>Search</NavLink>
        </li>
        <li>
          <NavLink to="/make-a-post" className={({ isActive }) => (isActive ? 'active' : '')}>Post</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
