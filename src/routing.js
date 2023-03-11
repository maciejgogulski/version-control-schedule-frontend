import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/home/Home";
import OtherPage from "./components/home/OtherPage";

function Routing() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/other-page" element={<OtherPage />}/>
            </Routes>
        </Router>
    );
}

export default Routing;