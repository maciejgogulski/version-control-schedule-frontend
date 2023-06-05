import React from 'react';
import './Navbar.css';
import {Link, useLocation} from "react-router-dom";
import {AiOutlineHome, AiOutlineSchedule} from "react-icons/ai";
import {HiOutlineUserGroup} from "react-icons/hi";
import {FaRegAddressBook} from "react-icons/fa";

const Navbar = () => {
    const location = useLocation();

    const isActiveRoute = (route) => {
        return location.pathname === route ? "active" : "";
    };

    const isActiveIcon = (route) => {
        return location.pathname === route ? "cornflowerblue" : "white";
    };

    return (
        <nav className="navbar">
            <ul className="navbar-nav w-100">
                <li className={`nav-item p-3 ${isActiveRoute("/")}`}>
                    <AiOutlineHome color={isActiveIcon("/")} size={25}/> <Link to="/">Strona główna</Link>
                </li>
                <li className={`nav-item p-3 ${isActiveRoute("/schedule")}`}>
                    <AiOutlineSchedule color={isActiveIcon("/schedule")} size={25}/> <Link to="/schedule">Plany</Link>
                </li>
                <li className={`nav-item p-3 ${isActiveRoute("/services")}`}>
                    <FaRegAddressBook color={isActiveIcon("/services")} size={25}/> <Link to="/addressees">Grupy adresatów</Link>
                </li>
                <li className={`nav-item p-3 ${isActiveRoute("/contact")}`}>
                    <HiOutlineUserGroup color={isActiveIcon("/contact")} size={25}/> <Link to="/users">Użytkownicy</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
