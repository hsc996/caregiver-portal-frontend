import { createContext, useContext } from 'react';

export const UserAuthContext = createContext("");

export function useUserAuthContext(){
    return useContext(UserAuthContext);
}