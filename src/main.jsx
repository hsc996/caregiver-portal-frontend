import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserAuthContextProvider } from "./contexts/AuthContext/AuthProvider.jsx";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <UserAuthContextProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </UserAuthContextProvider>
    </React.StrictMode>,
);