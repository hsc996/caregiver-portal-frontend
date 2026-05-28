import { createContext, useContext } from 'react';

export const UserAuthContext = createContext({
    userJwt: '',
    setUserJwt: () => {},
    currentUser: null,
});

export function useUserAuthContext(){
    return useContext(UserAuthContext);
}