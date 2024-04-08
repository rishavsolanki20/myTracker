import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Admin from "./Pages/Admin";
// import EmployeeDetailView from "./Pages/EmployeeDetailView";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path={`/employee/:id`} element={<EmployeeDetailView />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
