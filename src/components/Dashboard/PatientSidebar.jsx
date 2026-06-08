import { useEffect, useState } from 'react';
import { UserRound, Users, Settings, X, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { patientAPI, userAPI } from '../../api/patient';
import MagneticButton from '../MagneticButton';
import { AccordionSection } from '../ui/Accordion';
import { useUserAuthContext } from '../../contexts/AuthContext/AuthContext';
import { useNotificationService } from '../Notifications/notificationService';

const inputClass =
    'flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all hover:border-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:border-brand-300';

function Initials({ firstName, lastName }) {
    const letters = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
    return (
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
            {letters || <UserRound className="h-4 w-4 text-brand-400" />}
        </div>
    );
}

function CreateUserModal({ onClose }) {
    const { sendErrorNotification } = useNotificationService();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: '', role: 'User' });

    const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await userAPI.sendInvite(form);
            onClose();
        } catch (err) {
            sendErrorNotification(err.response?.data?.message || 'Failed to send invite.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />
            <motion.div
                className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Send Invite Code</h2>
                    <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100 transition-colors">
                        <X className="h-4 w-4 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="user@example.com"
                            className={inputClass}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-700">Role</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <p className="text-xs text-zinc-400">
                        An invite code and registration link will be sent to this address. The recipient will complete their own account details.
                    </p>

                    <div className="flex gap-2 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-lg bg-brand-600 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loading ? 'Sending…' : 'Send Invite'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function PatientSidebar({ onSelect }) {
    const { currentUser } = useUserAuthContext();

    const [patients, setPatients]     = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const [users, setUsers]           = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState(false);
    const [usersOpen, setUsersOpen]     = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const isAdmin = currentUser?.role === 'Admin';

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

    useEffect(() => {
        let cancelled = false;
        async function fetchUsers() {
            try {
                const res = await userAPI.getAllUsers();
                if (cancelled) return;
                setUsers(res.data.data ?? []);
            } catch {
                if (!cancelled) setUsersError(true);
            } finally {
                if (!cancelled) setUsersLoading(false);
            }
        }
        fetchUsers();
        return () => { cancelled = true; };
    }, []);

    function handleSelect(patient) {
        setSelectedId(patient._id);
        onSelect(patient);
    }

    return (
        <>
            <motion.aside
                initial={{ x: -224, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 22 }}
                className="flex w-56 flex-shrink-0 flex-col border-r border-gray-200 bg-white"
            >
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
                                onClick={() => { setError(false); setLoading(true); setRetryCount((c) => c + 1); }}
                                className="rounded-md bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-100 transition-colors"
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
                                                className="absolute inset-x-0 inset-y-0.5 rounded-full bg-brand-50"
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
                                            <span className={`truncate text-sm font-medium ${active ? 'text-brand-700' : 'text-gray-800'}`}>
                                                {fullName}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Users accordion pinned to the bottom */}
                <div className="border-t border-gray-100 px-3 py-3">
                    <AccordionSection
                        icon={Users}
                        label="Users"
                        open={usersOpen}
                        onToggle={() => setUsersOpen((o) => !o)}
                        subtle
                    >
                        {usersLoading ? (
                            <div className="space-y-1 px-1 pb-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-2">
                                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-100 animate-pulse" />
                                        <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : usersError ? (
                            <p className="px-2 py-3 text-center text-xs text-gray-400">Failed to load users</p>
                        ) : users.length === 0 ? (
                            <p className="px-2 py-3 text-center text-xs text-gray-400">No users found</p>
                        ) : (
                            <ul className="space-y-0.5 px-1 pb-1">
                                {users.map((user) => {
                                    const fullName = `${user.firstName} ${user.lastName}`;
                                    return (
                                        <li key={user._id} className="flex items-center gap-3 rounded-lg px-2 py-2">
                                            {user.profileImg ? (
                                                <img
                                                    src={user.profileImg}
                                                    alt={fullName}
                                                    className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                                                />
                                            ) : (
                                                <Initials firstName={user.firstName} lastName={user.lastName} />
                                            )}
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-gray-800">{fullName}</p>
                                                <p className="truncate text-xs text-gray-400">{user.role ?? ''}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </AccordionSection>

                    <div className="border-t border-gray-100 my-1" />

                    <AccordionSection
                        icon={Settings}
                        label="Settings"
                        open={settingsOpen}
                        onToggle={() => setSettingsOpen((o) => !o)}
                        subtle
                    >
                        {isAdmin ? (
                            <div className="px-1 pb-2 pt-1">
                                <button
                                    onClick={() => setCreateModalOpen(true)}
                                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                                >
                                    <UserPlus className="h-4 w-4 shrink-0" />
                                    Send Invite Code
                                </button>
                            </div>
                        ) : (
                            <p className="px-2 py-3 text-xs text-gray-400">No settings available.</p>
                        )}
                    </AccordionSection>
                </div>
            </motion.aside>

            <AnimatePresence>
                {createModalOpen && (
                    <CreateUserModal
                        onClose={() => setCreateModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export default PatientSidebar;
