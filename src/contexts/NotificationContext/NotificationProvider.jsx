import { useState } from 'react';
import { NotificationContext } from './NotificationContext';
import ToastContainer from '../../components/Notifications/ToastContainer';

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const addNotification = (type, message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, message }]);
        setTimeout(() => removeNotification(id), 4000);
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <ToastContainer notifications={notifications} onClose={removeNotification} />
        </NotificationContext.Provider>
    );
}
