import { useEffect, useMemo, useState } from 'react';
import { UserAuthContext } from "./AuthContext";

function decodeJwt(jwt) {
    try {
        const parts = jwt.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1]));
        return payload;
    } catch {
        return null;
    }
}

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
    
    useEffect(() => {
        if (!userJwt) return;

        const payload = decodeJwt(userJwt);
        if (!payload) {
            console.error('Invalid token format');
            setUserJwt('');
            return;
        }

        if (payload.exp * 1000 < Date.now()) {
            console.log("Token expired, clearing...");
            setUserJwt('');
        }
    }, [userJwt]);

    const currentUser = useMemo(() => {
        if (!userJwt) return null;
        const payload = decodeJwt(userJwt);
        if (!payload) return null;
        return {
            id: payload.id,
            role: payload.role,
            firstName: payload.firstName ?? '',
            lastName: payload.lastName ?? '',
            companyId: payload.companyId ?? null,
        };
    }, [userJwt]);

    return (
        <UserAuthContext.Provider value={{ userJwt, setUserJwt, currentUser }}>
            {children}
        </UserAuthContext.Provider>
    )
}