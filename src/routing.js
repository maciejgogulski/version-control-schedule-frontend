import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/home/Home";
import Schedule from "./components/Schedule/Schedule";

function Routing() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/schedule" element={<Schedule />}/>
            </Routes>
        </Router>
    );
}

export default Routing;