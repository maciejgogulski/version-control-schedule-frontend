import {BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom"
import Schedule from "./components/Schedule/Schedule"
import Navbar from "./components/Navbar/Navbar"
import ScheduleList from "./components/Schedule/ScheduleList"
import AddresseeList from "./components/Addressees/AddresseeList"
import {useAuth} from "./context/Auth"
import LoginPage from "./components/Login/LoginPage"
import Header from "./components/Header/Header";
import {ToastContainer} from "react-toastify";

export default function Routing() {
    const {loggedIn} = useAuth()

    return (
        <Router>
            <Header/>
            {loggedIn ? (
                <div className="row">
                    <div className="col-sm-2 bg-primary p-0 min-vh-100">
                        <Navbar/>
                    </div>
                    <main className="col-sm-10 pt-3 bg-light min-vh-100">
                        <Routes>
                            <Route path="/schedule" element={<ScheduleList/>}/>
                            <Route path="/schedule/:scheduleId" element={<Schedule/>}/>
                            <Route path="/addressee" element={<AddresseeList/>}/>
                        </Routes>
                    </main>
                </div>
            ) : (
                <main className={'min-vh-100'}>
                    <div className={'m-auto mt-5 w-25 p-3 align-content-center justify-content-center border shadow rounded'}>
                        <Routes>
                            <Route path="/login" element={<LoginPage/>}/>
                        </Routes>
                    </div>
                </main>
            )}
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </Router>
    )
}
