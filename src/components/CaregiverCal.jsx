function CalendarGrid({ currentDate, hasShifts, onDateClick, isToday }) {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  return (
    <div className="grid grid-cols-7 gap-2">
      {/* Day Headers */}
      {["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="py-2 text-center text-sm font-medium text-gray-500"
        >
          {day}
        </div>
      ))}

      {/* Empty placeholder cells for days before month starts */}
      {[...Array(startingDayOfWeek)].map((_, i) => (
        <div key={`empty-${i}`} className="aspect-square" />
      ))}

      {/* Calendar days */}
      {[...Array(daysInMonth)].map((_, i) => {
        const day = i + 1;
        const shifts = hasShifts(day);
        return (
          <button
            key={day}
            onClick={() => onDateClick(day)}
            className={`aspect-square rounded-lg p-2 text-sm transition-all hover:shadow-md ${
              isToday(day)
                ? "bg-indigo-300 font-bold text-white"
                : shifts.length > 0
                  ? "bg-indigo-100 font-medium text-indigo-900 hover:bg-indigo-200"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex h-full flex-col items-center justify-center">
              <span>{day}</span>
              {shifts.length > 0 && (
                <div className="mt-1 flex space-x-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default CalendarGrid;
