import { X, User, Calendar } from "lucide-react";
import ShiftCard from './ShiftCard';

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
    <div className="p-g animate-in slide-in-from-right w-96 rounded-xl bg-white shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {selectedDate?.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h3>
        <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
          <X className="tex-gray-500 h-5 w-5" />
        </button>
      </div>

      <div className="space-x-6">
        <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center">
                <User className="h-4 w-4 mr-2"/>
                Scheduled Shifts
            </h4>
            {shifts.length > 0 ? (
                <div className="space-y-3">
                    {shifts.map(shift => (
                        <ShiftCard key={shift.id} shift={shift} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg">
                    <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No shifts scheduled</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default DailySidebar;
