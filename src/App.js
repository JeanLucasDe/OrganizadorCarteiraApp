
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Profile from "./Formularios/Profile";
import Dashboard from "./Pages/Dashboard";
import MonthlyDashboard from "./Pages/MonthlyDashboard";

function App() {
  return (
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>}/>
            
            <Route path="/perfil" element={<Profile/>}/>
            <Route path="/diaria" element={<Dashboard/>}/>
            <Route path="/controle" element={<MonthlyDashboard/>}/>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
