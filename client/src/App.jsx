import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Attendence from "./pages/Attendence";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Layout from "./pages/Layout";
import Leave from "./pages/Leave";
import LoginLanding from "./pages/LoginLanding";
import Payslips from "./pages/Payslips";
import PrintPayslips from "./pages/PrintPayslips";
import Settings from "./pages/Settings";
import LoginForm from "./components/LoginForm";

const App = () => {
  return (
    <>  
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginLanding />} />

      <Route path="/login/admin" element={<LoginForm role="admin" subtitle="sign in to manage the organization" />} />
      <Route path="/login/employee" element={<LoginForm role="employee" subtitle="sign in to access the account" />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/attendence" element={<Attendence />} />
          <Route path="/payslips" element={<Payslips />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/print/payslips/:id" element={<PrintPayslips />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  )
};

export default App;
