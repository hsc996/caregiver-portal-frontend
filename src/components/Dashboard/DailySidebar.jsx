import { X, User, Calendar, Pill, ClipboardList, Plus } from "lucide-react";
import ShiftCard from "./ShiftCard";
import MedicationItem from "./MedicationItem";
import ADLItem from "./ADLItem";

function DailySidebar({
  selectedDate,
  onClose,
  shifts,
  medications,
  adls,
  taskStates,
  onToggleTask,
}) {
  return (
    <div className="p-6 animate-in slide-in-from-right w-96 rounded-xl bg-white shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {selectedDate?.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h3>
        <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
          <X className="text-gray-500 h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="mb-3 flex items-center text-sm font-semibold tracking-wide text-gray-700 uppercase">
            <User className="mr-2 h-4 w-4" />
            Scheduled Shifts
          </h4>
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
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="mb-3 flex items-center text-sm font-semibold tracking-wide text-gray-700 uppercase">
              <Pill className="mr-2 h-4 w-4" />
              Medications
            </h4>
          </div>
          <div className="space-y-2">
            {medications.map((med) => (
              <MedicationItem
                key={med.id}
                medication={med}
                isCompleted={taskStates[`med-${med.id}`] || false}
                onToggle={() => onToggleTask("med", med.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="flex items-center text-sm font-semibold tracking-wide text-gray-700 uppercase">
              <ClipboardList className="mr-2 h-4 w-4" />
              Daily Tasks (ADLs)
            </h4>
            <button className="text-indigo-600 hover:text-indigo-700">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {adls.map(adl => (
              <ADLItem
                key={adl.id}
                adl={adl}
                isCompleted={taskStates[`adl-${adl.id}`] || false}
                onToggle={() => onToggleTask("adl", adl.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailySidebar;
