import { Routes, Route } from "react-router-dom";

import Register from "../pages/Register";
import NoFound from "../pages/NoFound";
import Home from "../pages/Home";




const Content = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NoFound />} />
        </Routes>

    )
}

export default Content