import { useState, useEffect } from "react";
import { Check, Clock } from "lucide-react";

function parseMedTime(timeStr) {
    if (!timeStr || timeStr === "—") return null;
    const [h, m] = timeStr.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
}

function getMedStatus(medication, isCompleted, isToday, now) {
    if (!isToday || isCompleted) return "normal";
    const dueTime = parseMedTime(medication.time);
    if (!dueTime) return "normal";
    const diffMs = now - dueTime;
    const oneHour = 60 * 60 * 1000;
    if (diffMs >= -oneHour && diffMs < 0) return "due";
    if (diffMs >= oneHour) return "overdue";
    return "normal";
}

function MedicationItem({ medication, isCompleted, onToggle, isToday }) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        if (!isToday) return;
        const id = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(id);
    }, [isToday]);

    const status = getMedStatus(medication, isCompleted, isToday, now);

    const containerClass = isCompleted
        ? "border-green-200 bg-green-50"
        : status === "due"
        ? "border-green-400 bg-green-50 shadow-sm shadow-green-200"
        : status === "overdue"
        ? "border-red-400 bg-red-50 shadow-sm shadow-red-200"
        : "border-gray-200 hover:border-indigo-200";

    const checkboxClass = isCompleted
        ? "border-green-500 bg-green-500"
        : status === "due"
        ? "border-green-400 hover:border-green-500"
        : status === "overdue"
        ? "border-red-400 hover:border-red-500"
        : "border-gray-300 hover:border-indigo-400";

    return (
        <div className={`rounded-lg border p-3 transition ${containerClass}`}>
            <div className="flex items-start space-x-3">
                <button
                    onClick={onToggle}
                    className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition ${checkboxClass}`}
                >
                    {isCompleted && <Check className="h-3 w-3 text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h5
                            className={`font-medium truncate ${
                                isCompleted ? "text-green-900 line-through" : "text-gray-900"
                            }`}
                        >
                            {medication.name}
                        </h5>
                        {status === "due" && (
                            <span className="shrink-0 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                Medication due
                            </span>
                        )}
                        {status === "overdue" && (
                            <span className="shrink-0 text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                                Overdue
                            </span>
                        )}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-600">
                        <Clock className="mr-1 h-3 w-3 shrink-0" />
                        {medication.time} • {medication.frequency}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MedicationItem;
