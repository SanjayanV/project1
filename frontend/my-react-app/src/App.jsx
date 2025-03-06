import Dashboard from "./Components/Dashboard.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductSelection from "./Components/ProductSelection.jsx";
import Login from "./Components/Login.jsx"
import Register from "./Components/Register.jsx";
import  Home  from "./Components/Home.jsx";
import {useState} from 'react';
import Loginfar from "./Components/LoginFar.jsx";

function App(){
  const [isAuthenticated, setAuth] = useState(false);

  return (
    <><><title>FARMER TO CONSUMER PLATFORM</title></><Router>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Loginfar/>} />
        <Route path="/signup" element={<Register setAuth={setAuth} />} />
        <Route
          path="/dashboard"
          element={
            
              <Dashboard />
            
          }/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pro" element={<ProductSelection />} />
        
        
      </Routes>
    </Router></>

  );
}
export default App;