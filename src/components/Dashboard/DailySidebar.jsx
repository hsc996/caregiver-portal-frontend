import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, User, Calendar, Pill, ClipboardList, Plus, FileText } from "lucide-react";
import ShiftCard from "./ShiftCard";
import MedicationItem from "./MedicationItem";
import ADLItem from "./ADLItem";
import MedicationValidationModal from "./MedicationValidationModal";
import MedicationUnvalidationModal from "./MedicationUnvalidationModal";
import { AccordionSection } from "../ui/Accordion";
import { patientAPI } from "../../api/patient";
import { useNotificationService } from "../Notifications/notificationService";

function HandoverNoteItem({ note, onClick }) {
  const time = new Date(note.submittedAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <motion.button
      onClick={() => onClick(note)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-left transition hover:border-brand-300 hover:bg-brand-50"
    >
      <p className="text-sm font-medium text-gray-900 truncate">{note.caregiver}</p>
      <p className="mt-0.5 text-xs text-gray-500">{time}</p>
    </motion.button>
  );
}

function DailySidebar({
  selectedDate,
  onClose,
  shifts,
  medications,
  adls,
  taskStates,
  onToggleTask,
  handoverNotes,
  onNoteClick,
  patientId,
  currentUser,
  medicationRecords,
  onMedicationValidated,
  onMedicationUnvalidated,
}) {
  const { sendErrorNotification } = useNotificationService();

  const [shiftsOpen, setShiftsOpen]     = useState(() => shifts.length > 0);
  const [medsOpen, setMedsOpen]         = useState(() => medications.length > 0);
  const [adlsOpen, setAdlsOpen]         = useState(() => adls.length > 0);
  const [handoverOpen, setHandoverOpen] = useState(() => handoverNotes.length > 0);

  const [validatingMed, setValidatingMed] = useState(null);
  const [unvalidatingMed, setUnvalidatingMed] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setShiftsOpen(shifts.length > 0);
    setMedsOpen(medications.length > 0);
    setAdlsOpen(adls.length > 0);
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setHandoverOpen(handoverNotes.length > 0);
  }, [handoverNotes]);

  // Sync accordion open state with incoming records (populated after fetch)
  useEffect(() => {
    if (Object.keys(medicationRecords).length > 0) setMedsOpen(true);
  }, [medicationRecords]);

  const isToday = selectedDate?.toDateString() === new Date().toDateString();

  async function handleConfirmValidation() {
    if (!validatingMed || !patientId || !currentUser) return;
    setIsSaving(true);
    try {
      const res = await patientAPI.recordMedicationAdministration(patientId, {
        medicationName: validatingMed.name,
        dosage: validatingMed.dosage,
        route: validatingMed.route,
        scheduledTime: validatingMed.time,
      });

      const givenBy = `${currentUser.firstName} ${currentUser.lastName}`.trim();
      const record = { recordId: res.data.data._id, givenBy, givenAt: new Date() };

      onMedicationValidated(validatingMed.id, record);
      setValidatingMed(null);
    } catch {
      sendErrorNotification('Failed to record medication. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleConfirmUnvalidation(reason) {
    if (!unvalidatingMed || !patientId) return;
    const recordId = medicationRecords[unvalidatingMed.id]?.recordId;
    if (!recordId) {
      sendErrorNotification('Could not find the administration record. Try refreshing the page.');
      return;
    }
    setIsSaving(true);
    try {
      await patientAPI.unvalidateMedicationAdministration(patientId, recordId, reason);
      onMedicationUnvalidated(unvalidatingMed.id);
      setUnvalidatingMed(null);
    } catch {
      sendErrorNotification('Failed to unvalidate medication. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="p-6 w-96 rounded-xl bg-white shadow-lg overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedDate?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <motion.button onClick={onClose} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="rounded-lg p-1 hover:bg-gray-100">
            <X className="text-gray-500 h-5 w-5" />
          </motion.button>
        </div>

        <div className="space-y-6">
          <AccordionSection
            icon={User}
            label="Scheduled Shifts"
            open={shiftsOpen}
            onToggle={() => setShiftsOpen((o) => !o)}
          >
            {shifts.length > 0 ? (
              <div className="space-y-3">
                {shifts.map((shift) => (
                  <ShiftCard key={shift.id} shift={shift} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 py-6 text-center">
                <Calendar className="mx-auto mb-2 h-10 w-10 text-gray-300" />
                <p className="text-sm text-gray-500">No shifts scheduled</p>
              </div>
            )}
          </AccordionSection>

          <AccordionSection
            icon={Pill}
            label="Medications"
            open={medsOpen}
            onToggle={() => setMedsOpen((o) => !o)}
          >
            {medications.length > 0 ? (
              <div className="space-y-2">
                {medications.map((med) => (
                  <MedicationItem
                    key={med.id}
                    medication={med}
                    givenBy={medicationRecords[med.id]?.givenBy ?? null}
                    givenAt={medicationRecords[med.id]?.givenAt ?? null}
                    onValidate={() => setValidatingMed(med)}
                    onUnvalidate={() => setUnvalidatingMed(med)}
                    isToday={isToday}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 py-6 text-center">
                <Pill className="mx-auto mb-2 h-10 w-10 text-gray-300" />
                <p className="text-sm text-gray-500">No medications scheduled</p>
              </div>
            )}
          </AccordionSection>

          <AccordionSection
            icon={ClipboardList}
            label="Daily Tasks (ADLs)"
            open={adlsOpen}
            onToggle={() => setAdlsOpen((o) => !o)}
            action={
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-brand-600 hover:text-brand-700">
                <Plus className="h-5 w-5" />
              </motion.button>
            }
          >
            {adls.length > 0 ? (
              <div className="space-y-2">
                {adls.map((adl) => (
                  <ADLItem
                    key={adl.id}
                    adl={adl}
                    isCompleted={taskStates[`adl-${adl.id}`] || false}
                    onToggle={() => onToggleTask("adl", adl.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 py-6 text-center">
                <ClipboardList className="mx-auto mb-2 h-10 w-10 text-gray-300" />
                <p className="text-sm text-gray-500">No tasks scheduled</p>
              </div>
            )}
          </AccordionSection>

          <AccordionSection
            icon={FileText}
            label="Handover Notes"
            open={handoverOpen}
            onToggle={() => setHandoverOpen((o) => !o)}
          >
            {handoverNotes.length > 0 ? (
              <div className="space-y-2">
                {handoverNotes.map((note) => (
                  <HandoverNoteItem key={note.id} note={note} onClick={onNoteClick} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 py-6 text-center">
                <FileText className="mx-auto mb-2 h-10 w-10 text-gray-300" />
                <p className="text-sm text-gray-500">No notes submitted</p>
              </div>
            )}
          </AccordionSection>
        </div>
      </div>

      <MedicationValidationModal
        medication={validatingMed}
        onConfirm={handleConfirmValidation}
        onCancel={() => setValidatingMed(null)}
        isSaving={isSaving}
      />

      <MedicationUnvalidationModal
        medication={unvalidatingMed}
        onConfirm={handleConfirmUnvalidation}
        onCancel={() => setUnvalidatingMed(null)}
        isSaving={isSaving}
      />
    </>
  );
}

export default DailySidebar;
