
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./Pages/Home";
import Profile from "./Formularios/Profile";
import Dashboard from "./Pages/Dashboard";
import Carteira from "./Pages/Carteira";
import MonthlyOverview from "./Components/MonthlyOverview";
import DebtsDashboard from "./Pages/DebtsDashboard";
import GastosMensaisDashboard from "./Pages/GastosMensaisDashBoard";

function App() {
  return (
      <Router>  
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/perfil" element={<Profile/>}/>
            
            <Route path='/page' element={<Carteira/>}>
              <Route index path="/page/geral" element={<MonthlyOverview/>}/>
              <Route path="/page/dividas" element={<DebtsDashboard/>}/>
              <Route path="/page/gastosmensais" element={<GastosMensaisDashboard/>}/>
              <Route path="/page/diaria" element={<Dashboard/>}/>
            </Route>
          </Routes>
      </Router>
  );
}

export default App;
