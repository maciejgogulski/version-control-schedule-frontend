import React from 'react';
import {Link, useLocation} from "react-router-dom";
import {AiOutlineHome, AiOutlineSchedule} from "react-icons/ai";
import {HiOutlineUserGroup} from "react-icons/hi";
import {FaRegAddressBook} from "react-icons/fa";

const Navbar = () => {
    const location = useLocation();

    const isActiveRoute = (route) => {
        return location.pathname === route ? "bg-light text-primary" : "bg-primary text-light";
    };

    const isActiveIcon = (route) => {
        return location.pathname === route ? "cornflowerblue" : "white";
    };

    return (
        <nav className="navbar">
            <ul className="navbar-nav w-100">
                <Link to="/">
                    <li className={`nav-item px-4 py-3 ${isActiveRoute("/")}`}>
                        <AiOutlineHome color={isActiveIcon("/")} size={25}/> Strona główna
                    </li>
                </Link>

                <Link to="/schedule">
                    <li className={`nav-item px-4 py-3 ${isActiveRoute("/schedule")}`}>
                        <AiOutlineSchedule color={isActiveIcon("/schedule")} size={25}/> Plany
                    </li>
                </Link>
                <Link to="/addressees">
                    <li className={`nav-item px-4 py-3 ${isActiveRoute("/addressees")}`}>
                        <FaRegAddressBook color={isActiveIcon("/addressees")} size={25}/> Grupy adresatów
                    </li>
                </Link>
                <Link to="/users">
                    <li className={`nav-item px-4 py-3 ${isActiveRoute("/users")}`}>
                        <HiOutlineUserGroup color={isActiveIcon("/users")} size={25}/> Użytkownicy
                    </li>
                </Link>
            </ul>
        </nav>
    )
        ;
};

export default Navbar;
