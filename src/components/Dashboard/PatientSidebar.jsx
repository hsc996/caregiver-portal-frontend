import { useEffect, useState } from 'react';
import { UserRound } from 'lucide-react';
import { motion } from 'motion/react';
import { patientAPI } from '../../api/patient';
import MagneticButton from '../MagneticButton';

function Initials({ firstName, lastName }) {
    const letters = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
    return (
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
            {letters || <UserRound className="h-4 w-4 text-indigo-400" />}
        </div>
    );
}

function PatientSidebar({ onSelect }) {
    const [patients, setPatients] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const retry = () => {
        setError(false);
        setLoading(true);
        setRetryCount((c) => c + 1);
    };

    useEffect(() => {
        let cancelled = false;
        async function fetchPatients() {
            try {
                const res = await patientAPI.getAllPatients();
                if (cancelled) return;
                const list = res.data.data ?? [];
                setPatients(list);
                if (list.length > 0) {
                    setSelectedId(list[0]._id);
                    onSelect(list[0]);
                }
            } catch {
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchPatients();
        return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retryCount]);

    function handleSelect(patient) {
        setSelectedId(patient._id);
        onSelect(patient);
    }

    return (
        <aside className="flex w-56 flex-shrink-0 flex-col border-r border-gray-200 bg-white">
            <div className="px-4 py-5 border-b border-gray-100">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Patients
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
                {loading ? (
                    <div className="space-y-1 px-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                                <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gray-100 animate-pulse" />
                                <div className="h-3.5 w-28 rounded bg-gray-100 animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center gap-3 px-4 py-6 text-center">
                        <p className="text-xs text-gray-400">Failed to load patients</p>
                        <MagneticButton
                            onClick={retry}
                            className="rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition-colors"
                        >
                            Try again
                        </MagneticButton>
                    </div>
                ) : patients.length === 0 ? (
                    <p className="px-4 py-6 text-center text-xs text-gray-400">No patients found</p>
                ) : (
                    <ul className="space-y-0.5 px-2">
                        {patients.map((patient) => {
                            const active = patient._id === selectedId;
                            const fullName = `${patient.firstName} ${patient.lastName}`;
                            return (
                                <li key={patient._id} className="relative group">
                                    {!active && (
                                        <div className="absolute inset-x-0 inset-y-0.5 rounded-full bg-gray-200/70 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                                    )}
                                    {active && (
                                        <motion.div
                                            layoutId="sidebar-highlight"
                                            className="absolute inset-x-0 inset-y-0.5 rounded-full bg-indigo-50"
                                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                        />
                                    )}
                                    <button
                                        onClick={() => handleSelect(patient)}
                                        className="relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left"
                                    >
                                        {patient.profileImg ? (
                                            <img
                                                src={patient.profileImg}
                                                alt={fullName}
                                                className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                                            />
                                        ) : (
                                            <Initials firstName={patient.firstName} lastName={patient.lastName} />
                                        )}
                                        <span className={`truncate text-sm font-medium ${active ? 'text-indigo-700' : 'text-gray-800'}`}>
                                            {fullName}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </aside>
    );
}

export default PatientSidebar;
