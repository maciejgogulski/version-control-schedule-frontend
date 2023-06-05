import React from 'react';
import './Navbar.css';
import {Link, useLocation} from "react-router-dom";

const Navbar = () => {
    const location = useLocation();

    const isActiveRoute = (route) => {
        return location.pathname === route ? "active" : "";
    };

    return (
        <nav className="navbar">
            <ul className="navbar-nav w-100">
                <li className={`nav-item p-3 ${isActiveRoute("/")}`}>
                    <Link to="/">Strona główna</Link>
                </li>
                <li className={`nav-item p-3 ${isActiveRoute("/schedule")}`}>
                    <Link to="/schedule">Plany</Link>
                </li>
                <li className={`nav-item p-3 ${isActiveRoute("/services")}`}>
                    <Link to="/addressees">Grupy adresatów</Link>
                </li>
                <li className={`nav-item p-3 ${isActiveRoute("/contact")}`}>
                    <Link to="/users">Użytkownicy</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
