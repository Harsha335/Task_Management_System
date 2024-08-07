import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import PageNotFound from "./components/PageNotFound";
import Project from "./components/Projects";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route element={<ProtectedRoute/>}>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/projects" element={<Project/>}/>
        </Route>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </Router>
  )
}

export default App;
