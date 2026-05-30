import { useState } from "react";
import { motion } from "motion/react";
import { X, User, Calendar, Pill, ClipboardList, Plus, FileText } from "lucide-react";
import ShiftCard from "./ShiftCard";
import MedicationItem from "./MedicationItem";
import ADLItem from "./ADLItem";
import { AccordionSection } from "../ui/Accordion";

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
      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
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
}) {
  const [shiftsOpen, setShiftsOpen]         = useState(true);
  const [medsOpen, setMedsOpen]             = useState(true);
  const [adlsOpen, setAdlsOpen]             = useState(true);
  const [handoverOpen, setHandoverOpen]     = useState(true);

  const isToday = selectedDate?.toDateString() === new Date().toDateString();

  return (
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
          <div className="space-y-2">
            {medications.map((med) => (
              <MedicationItem
                key={med.id}
                medication={med}
                isCompleted={taskStates[`med-${med.id}`] || false}
                onToggle={() => onToggleTask("med", med.id)}
                isToday={isToday}
              />
            ))}
          </div>
        </AccordionSection>

        <AccordionSection
          icon={ClipboardList}
          label="Daily Tasks (ADLs)"
          open={adlsOpen}
          onToggle={() => setAdlsOpen((o) => !o)}
          action={
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-indigo-600 hover:text-indigo-700">
              <Plus className="h-5 w-5" />
            </motion.button>
          }
        >
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
  );
}

export default DailySidebar;
