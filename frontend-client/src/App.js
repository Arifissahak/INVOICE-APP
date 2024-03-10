import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MainLayout from "./components/MainLayout";
import Customers from "./pages/Customers";
import AddClient from "./pages/AddClient";
import Addinvoice from "./pages/Addinvoice";
import Invoicelist from "./pages/Invoicelist";
import Invoicebill from "./pages/Invoicebill";
import Signup from "./pages/Signup";
import Selectclient from "./pages/Selectclient";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="profile" element={<Profile />} />
          <Route path="add-client" element={<AddClient />} />
          <Route path="client" element={<Selectclient />} />
          <Route path="client/add-invoice" element={<Addinvoice />} />
          <Route path="invoice" element={<Invoicelist />} />
          <Route path="invoice/:invoiceId" element={<Invoicebill />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
