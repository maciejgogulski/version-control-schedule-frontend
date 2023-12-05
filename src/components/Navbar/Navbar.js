import React from 'react';
import {Link, useLocation} from "react-router-dom";
import {AiOutlineSchedule} from "react-icons/ai";
import {FaRegAddressBook} from "react-icons/fa";
import {useTranslation} from "react-i18next";

const Navbar = () => {
    const location = useLocation();
    const { t } = useTranslation();

    const isActiveRoute = (route) => {
        return location.pathname.startsWith(route) ? "bg-light text-primary" : "bg-primary text-light";
    };

    const isActiveIcon = (route) => {
        return location.pathname.startsWith(route) ? "cornflowerblue" : "white";
    };

    return (
        <nav className="navbar p-0">
            <ul className="navbar-nav w-100">
                <Link to="/schedule">
                    <li className={`nav-item px-4 py-3 ${isActiveRoute("/schedule")}`}>
                        <AiOutlineSchedule color={isActiveIcon("/schedule")} size={25}/> {t('navigation.schedules')}
                    </li>
                </Link>
                <Link to="/addressee">
                    <li className={`nav-item px-4 py-3 ${isActiveRoute("/addressee")}`}>
                        <FaRegAddressBook color={isActiveIcon("/addressee")} size={25}/> {t('navigation.addressees')}
                    </li>
                </Link>
            </ul>
        </nav>
    );
};

export default Navbar;
