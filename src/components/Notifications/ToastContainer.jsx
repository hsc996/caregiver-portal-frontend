import { CheckCircle, XCircle, X } from 'lucide-react';

function Toast({ id, type, message, onClose }) {
    const isSuccess = type === 'success';

    return (
        <div className={`flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg text-sm text-white w-80
            ${isSuccess ? 'bg-green-600' : 'bg-red-600'}`}
        >
            {isSuccess
                ? <CheckCircle className="mt-0.5 shrink-0" size={16} />
                : <XCircle className="mt-0.5 shrink-0" size={16} />
            }
            <span className="flex-1">{message}</span>
            <button onClick={() => onClose(id)} className="shrink-0 opacity-70 hover:opacity-100">
                <X size={14} />
            </button>
        </div>
    );
}

export default function ToastContainer({ notifications, onClose }) {
    if (!notifications.length) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            {notifications.map(n => (
                <Toast key={n.id} {...n} onClose={onClose} />
            ))}
        </div>
    );
}
