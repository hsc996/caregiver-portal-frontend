import { Routes, Route } from "react-router-dom";
import LandingPage from "./routes/LandingPage";
import PatientDashboard from "./routes/PatientDashboard";
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";
import { NotificationProvider } from "./contexts/NotificationContext/NotificationProvider";

function App() {
  return (
    <NotificationProvider>
      <div className='flex min-h-screen w-dvw flex-col bg-background px-0 sm:px-10'>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/dashboard" element={<PatientDashboard />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<RegisterPage />}/>
        </Routes>
      </div>
    </NotificationProvider>
  )
}

export default App
