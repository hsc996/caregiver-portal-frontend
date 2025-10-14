import { Clock } from "lucide-react";

function MedicationItem({ medication, isCompleted, onToggle }) {
  return (
    <div
      className={`rounded-lg border p-3 transition ${
        isCompleted
          ? "border-green-200 bg-green-50"
          : "border-gray-200 hover:border-indigo-200"
      }`}
    >
      <div className="flex items-start space-x-3">
        <button
          onClick={onToggle}
          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition ${
            isCompleted
              ? "border-green-500 bg-green-500"
              : "border-gray-300 hover:border-indigo-400"
          }`}
        >
          {isCompleted && <Check className="h-3 w-3 text-white" />}
        </button>
        <div className="flex-1">
          <h5
            className={`font-medium ${
              isCompleted ? "text-green-900 line-through" : "text-gray 900"
            }`}
          >
            {medication.name}
          </h5>
          <div className="mt-1 flex items-center text-sm text-gray-600">
            <Clock className="mr-1 h-3 w-3" />
            {medication.time} • {medication.frequency}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicationItem;
