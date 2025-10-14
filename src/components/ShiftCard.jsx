import { User, Clock } from "lucide-react";

function ShiftCard({ shift }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 transition hover:border-indigo-300">
      <div className="flex items-start space-x-3">
        <div className="bf-indigo-100 rounded-lg p-2">
          <User className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h5 className="font-medium text-gray-900">{shift.caregiver}</h5>
          <div className="mt-1 flex items-center text-sm text-gray-600">
            <Clock className="mr-1 h-4 w-4" />
            {shift.time}
          </div>
          <p className="mt-2 text-sm text-gray-500">{shift.type}</p>
        </div>
      </div>
    </div>
  );
}

export default ShiftCard;
