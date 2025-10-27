import {  useEffect, useState } from 'react';
import { UserAuthContext } from "./AuthContext";

export function UserAuthContextProvider({ children }){
    let [userJwt, setUserJwtState] = useState(() => {
        return localStorage.getItem('userJwt') || '';
    });

    const setUserJwt = (jwt) => {
        setUserJwtState(jwt);
        if (jwt) {
            localStorage.setItem('userJwt', jwt);
        } else {
            localStorage.removeItem('userJwt');
        }
    }

    // Basic expiry check on mount/when token changes
    useEffect(() => {
        if (!userJwt) return;

        try {
            // Decode JWT to check expiry
            const payload = JSON.parse(atob(userJwt.split('.')[1]));
            const expiresAt = payload.exp * 1000;
            const now = Date.now();

            // If token is already expired, clear it
            if (expiresAt < now){
                console.log("Token expired, clearing...");
                setUserJwt('');
            }
        } catch (error) {
            console.error('Invalid token format: ' + error);
            setUserJwt('');
        }
    }, [userJwt]);

    return (
        <UserAuthContext.Provider value={[userJwt, setUserJwt]}>
            {children}
        </UserAuthContext.Provider>
    )
}