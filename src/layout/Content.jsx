import { Routes, Route } from "react-router-dom";

import Register from "../pages/Register";
import NoFound from "../pages/NoFound";
import Home from "../pages/Home";
import Login from "../pages/Login";

const Content = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="*" element={<NoFound />} />
    </Routes>
  );
};

export default Content;
