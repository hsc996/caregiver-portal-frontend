import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import PatientDashboard from "./routes/PatientDashboard";

function App() {
  return (
    <>
      <div className='flex min-h-screen w-dvw flex-col bg-background px-0 sm:px-10'>
        <Routes>
          <Route path="/" element={<PatientDashboard />}/>
        </Routes>
      </div>
    </>
  )
}

export default App
