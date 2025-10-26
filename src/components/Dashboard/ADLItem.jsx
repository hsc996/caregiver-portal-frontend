import { Check, Clock } from "lucide-react";

function ADLItem({ adl, isCompleted, onToggle }) {
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
              isCompleted ? "line-through text-green-900" : "text-gray-900"
            }`}
          >
            {adl.task}
          </h5>
          <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {adl.time}
            </div>
            <span>Added by {adl.addedBy}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ADLItem;
