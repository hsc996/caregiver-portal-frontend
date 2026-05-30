import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check, Clock, User } from "lucide-react";

function parseMedTime(timeStr) {
    if (!timeStr || timeStr === "—") return null;
    const [h, m] = timeStr.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
}

function getMedStatus(medication, isGiven, isToday, now) {
    if (!isToday || isGiven) return "normal";
    const dueTime = parseMedTime(medication.time);
    if (!dueTime) return "normal";
    const diffMs = now - dueTime;
    const oneHour = 60 * 60 * 1000;
    if (diffMs >= -oneHour && diffMs < 0) return "due";
    if (diffMs >= oneHour) return "overdue";
    return "normal";
}

function MedicationItem({ medication, givenBy, givenAt, onValidate, isToday }) {
    const isGiven = !!givenAt;
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        if (!isToday) return;
        const id = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(id);
    }, [isToday]);

    const status = getMedStatus(medication, isGiven, isToday, now);

    const containerClass = isGiven
        ? "border-green-200 bg-green-50"
        : status === "due"
        ? "border-green-400 bg-green-50 shadow-sm shadow-green-200"
        : status === "overdue"
        ? "border-red-400 bg-red-50 shadow-sm shadow-red-200"
        : "border-gray-200 hover:border-indigo-200";

    const givenAtFormatted = givenAt
        ? new Date(givenAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
        : null;

    return (
        <div className={`rounded-lg border p-3 transition ${containerClass}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h5 className={`font-medium truncate ${isGiven ? "text-green-900" : "text-gray-900"}`}>
                            {medication.name}
                        </h5>
                        {medication.dosage && (
                            <span className="shrink-0 text-xs text-gray-500">{medication.dosage}</span>
                        )}
                        {status === "due" && (
                            <span className="shrink-0 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                Due now
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

                    {isGiven && givenBy && (
                        <div className="mt-1.5 flex items-center gap-1 text-xs text-green-700">
                            <Check className="h-3 w-3 shrink-0" />
                            <User className="h-3 w-3 shrink-0" />
                            Given by {givenBy} at {givenAtFormatted}
                        </div>
                    )}
                </div>

                {!isGiven && (
                    <motion.button
                        onClick={onValidate}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition-colors"
                    >
                        Validate
                    </motion.button>
                )}
            </div>
        </div>
    );
}

export default MedicationItem;
