import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/Navbar/Navbar";
import Home from "./views/Home/Home";
import MyAppointments from "./views/MisTurnos/MisTurnos";
import Register from "./views/Register/Register";
import Login from "./views/Login/Login";
import PageNotFound from "./views/PageNotFound/PageNotFound";
import AdminAppointments from "./views/AdminAppointments/Adminappointments";
import AdminServices from "./views/AdminServices/AdminServices";
import AdminStats from "./views/AdminStats/AdminStats";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointments" element={<MyAppointments />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/stats" element={<AdminStats />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
