import { useNotification } from '../../contexts/NotificationContext/NotificationContext';

export function useNotificationService() {
    const { addNotification } = useNotification();

    return {
        sendSuccessNotification: (message) => addNotification('success', message),
        sendErrorNotification: (message) => {
            const stripped = message?.startsWith('Validation error:')
                ? message.slice('Validation error:'.length).trim()
                : message;
            addNotification('error', stripped);
        },
    };
}
