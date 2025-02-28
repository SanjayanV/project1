import Dashboard from "./Components/Dashboard.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductSelection from "./Components/ProductSelection.jsx";

function App(){
  return (
    <><><title>FARMER TO CONSUMER PLATFORM</title></><Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/addpro" element={<ProductSelection />} />

      </Routes>
    </Router></>

  );
}
export default App;