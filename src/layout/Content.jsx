import { Routes, Route } from "react-router-dom";

import Register from "../pages/Register";
import NoFound from "../pages/NoFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import CreateDocument from "../pages/CreateDocument";
import ViewAllDocuments from "../pages/ViewAllDocuments";
import Search from "../pages/Search";



const Content = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-new-document" element={<CreateDocument />} />
      <Route path="/view-all-documents" element={<ViewAllDocuments />} />
      <Route path="/search-document" element={<Search />} />
      <Route path="*" element={<NoFound />} />
    </Routes>
  );
};

export default Content;
