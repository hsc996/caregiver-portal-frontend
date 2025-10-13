import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LandingPage from "./routes/LandingPage";

function App() {
  return (
    <>
      <div className='flex min-h-screen w-dvw flex-col bg-background px-0 sm:px-10'>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
        </Routes>
      </div>
    </>
  )
}

export default App
