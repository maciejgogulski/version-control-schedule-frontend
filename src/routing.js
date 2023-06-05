import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/Home/Home";
import Schedule from "./components/Schedule/Schedule";
import Navbar from "./components/Navbar/Navbar";

function Routing() {
    return (
        <Router>
            <div className="row">
                <div className="col-sm-2 bg-primary p-0">
                    <Navbar/>
                </div>
                <div className="col-sm-10">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/schedule" element={<Schedule/>}/>
                    </Routes>
                </div>
            </div>
        </Router>

    );
}

export default Routing;