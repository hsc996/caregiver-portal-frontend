import { useState, useEffect } from 'react';
import MainNav from '../components/LandingPage/MainNav';
import CalendarGrid from '../components/Dashboard/CaregiverCal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DailySidebar from '../components/Dashboard/DailySidebar';
import PatientHeader from '../components/Dashboard/PatientHeader';
import PatientSidebar from '../components/Dashboard/PatientSidebar';
import { patientAPI } from '../api/patient';
import { useNotificationService } from '../components/Notifications/notificationService';

// ─── Shape adapters ──────────────────────────────────────────────────────────

function toHeaderShape(patient) {
    if (!patient) return null;
    return {
        _id: patient._id,
        name: `${patient.firstName} ${patient.lastName}`,
        profileImg: patient.profileImg ?? null,
        dob: patient.dateOfBirth
            ? new Date(patient.dateOfBirth).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric',
              })
            : '—',
        allergies: patient.allergies?.join(', ') || '—',
        carers: '—',
    };
}

function toMedications(patient) {
    return (patient?.medicationSchedule ?? [])
        .filter((m) => m.isActive !== false)
        .flatMap((m, i) =>
            (m.scheduledTimes?.length ? m.scheduledTimes : ['—']).map((time, j) => ({
                id: `${i}-${j}`,
                name: [m.name, m.dosage].filter(Boolean).join(' '),
                time,
                frequency: m.frequency ?? '',
                completed: false,
            }))
        );
}

function toAdls(patient) {
    return (patient?.careTaskSchedule ?? []).map((t, i) => ({
        id: i,
        task: t.task,
        time: t.frequency ?? '',
        completed: false,
        addedBy: t.category ?? '',
    }));
}

const formatDateKey = (year, month, day) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

// ─── Component ───────────────────────────────────────────────────────────────

function PatientDashboard() {
    const { sendErrorNotification } = useNotificationService();

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [currentDate, setCurrentDate]         = useState(new Date());
    const [selectedDate, setSelectedDate]       = useState(null);
    const [dailySidebarOpen, setDailySidebarOpen] = useState(false);
    const [taskStates, setTaskStates]           = useState({});
    const [shifts, setShifts]                   = useState({});
    const [shiftsLoading, setShiftsLoading]     = useState(false);

    useEffect(() => {
        if (!selectedPatient?._id) return;

        let cancelled = false;
        async function fetchShifts() {
            setShiftsLoading(true);
            try {
                const res = await patientAPI.getPatientShifts(
                    selectedPatient._id,
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                );
                if (!cancelled) setShifts(res.data.data);
            } catch {
                if (!cancelled) sendErrorNotification('Failed to load shifts.');
            } finally {
                if (!cancelled) setShiftsLoading(false);
            }
        }
        fetchShifts();
        return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPatient?._id, currentDate.getFullYear(), currentDate.getMonth()]);

    const headerPatient = toHeaderShape(selectedPatient);
    const medications   = toMedications(selectedPatient);
    const adls          = toAdls(selectedPatient);

    const formatDate = (date) =>
        date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const getPreviousMonth = () =>
        setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1));

    const getNextMonth = () =>
        setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1));

    const handleDateClick = (day) => {
        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        setDailySidebarOpen(true);
    };

    const hasShifts = (day) =>
        shifts[formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)] ?? [];

    const isToday = (day) => {
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear()
        );
    };

    const getShiftsForDate = (date) => {
        if (!date) return [];
        return shifts[formatDateKey(date.getFullYear(), date.getMonth(), date.getDate())] ?? [];
    };

    const toggleTask = (type, id) => {
        const key = `${type}-${id}`;
        setTaskStates((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setShifts({});
        setDailySidebarOpen(false);
        setSelectedDate(null);
        setTaskStates({});
    };

    return (
        <>
            <MainNav />

            <div className="flex min-h-screen w-full pt-16">
                <PatientSidebar onSelect={handlePatientSelect} />

                <main className="flex flex-1 flex-col min-w-0">
                    {headerPatient && <PatientHeader patient={headerPatient} />}

                    <div className="flex flex-1 gap-6 bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                        <div className="flex-1 min-w-0 rounded-xl bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <span className="text-lg font-medium text-gray-700">
                                    {formatDate(currentDate)}
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={getPreviousMonth}
                                        className="rounded-lg p-2 transition hover:bg-gray-100"
                                    >
                                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={getNextMonth}
                                        className="rounded-lg p-2 transition hover:bg-gray-100"
                                    >
                                        <ChevronRight className="h-5 w-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {shiftsLoading ? (
                                <div className="flex h-64 items-center justify-center text-sm text-gray-400">
                                    Loading schedule…
                                </div>
                            ) : (
                                <CalendarGrid
                                    currentDate={currentDate}
                                    onDateClick={handleDateClick}
                                    hasShifts={hasShifts}
                                    isToday={isToday}
                                />
                            )}
                        </div>

                        {dailySidebarOpen && (
                            <DailySidebar
                                selectedDate={selectedDate}
                                onClose={() => setDailySidebarOpen(false)}
                                shifts={getShiftsForDate(selectedDate)}
                                medications={medications}
                                adls={adls}
                                taskStates={taskStates}
                                onToggleTask={toggleTask}
                            />
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

export default PatientDashboard;
