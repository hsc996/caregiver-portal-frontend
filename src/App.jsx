import { Routes, Route } from "react-router-dom";
import LandingPage from "./routes/LandingPage";
import PatientDashboard from "./routes/PatientDashboard";
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";
import { NotificationProvider } from "./contexts/NotificationContext/NotificationProvider";
import ForgotPassword from "./routes/ForgotPasswordPage";
import ResetPasswordPage from "./routes/ResetPasswordPage";

function App() {
  return (
    <NotificationProvider>
      <div className='flex min-h-screen w-dvw flex-col bg-background px-0 sm:px-10'>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/dashboard" element={<PatientDashboard />}/>
          <Route path="/signin" element={<LoginPage />}/>
          <Route path="/signup" element={<RegisterPage />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>
          <Route path="/reset-password" element={<ResetPasswordPage />}/>
        </Routes>
      </div>
    </NotificationProvider>
  )
}

export default App
