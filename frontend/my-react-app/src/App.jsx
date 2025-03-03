import Dashboard from "./Components/Dashboard.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductSelection from "./Components/ProductSelection.jsx";
import Login from './Components/Login.jsx'
function App(){
  return (
    <><><title>FARMER TO CONSUMER PLATFORM</title></><Router>
      <Routes>
        
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/addpro" element={<ProductSelection />} />
        <Route path= "/login" element={<Login />} />

      </Routes>
    </Router></>

  );
}
export default App;