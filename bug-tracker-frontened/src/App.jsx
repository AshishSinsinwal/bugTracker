import { Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import NavBar from "./components/navbar";
import Footer from "./components/footer";

function App() {
  return (
    <>
    <NavBar/>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects/:projectId" element={<ProjectPage />} />
    </Routes>
    <Footer/>
    </>
    
  );
}

export default App;
