import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Register from "../pages/Register";
import NoFound from "../pages/NoFound";




const Content = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NoFound />} />
        </Routes>

    )
}

export default Content