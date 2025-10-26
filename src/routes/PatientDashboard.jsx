import React, { useState } from "react";
import MainNav from "../components/MainNav";
import CalendarGrid from "../components/Dashboard/CaregiverCal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DailySidebar from "../components/Dashboard/DailySidebar";
import PatientProfile from "../components/Dashboard/PatientProfile";
import HandoverNotes from "../components/Dashboard/HandoverNotes";

function PatientDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [sidebarOpen, setSideBarOpen] = useState(false);
  const [taskStates, setTaskStates] = useState({});

  // Mock data for shifts
  const shifts = {
    "2025-10-15": [
      {
        id: 1,
        caregiver: "Sarah Johnson",
        time: "8:00 AM - 4:00 PM",
        type: "Morning Care",
      },
      {
        id: 2,
        caregiver: "Mike Chen",
        time: "4:00 PM - 12:00 AM",
        type: "Evening Care",
      },
    ],
    "2025-10-16": [
      {
        id: 3,
        caregiver: "Emma Davis",
        time: "8:00 AM - 2:00 PM",
        type: "Morning Care",
      },
    ],
    "2025-10-20": [
      {
        id: 4,
        caregiver: "Sarah Johnson",
        time: "9:00 AM - 5:00 PM",
        type: "Day Shift",
      },
      {
        id: 5,
        caregiver: "David Lee",
        time: "5:00 PM - 9:00 PM",
        type: "Evening Visit",
      },
    ],
  };

  const medications = [
    {
      id: 1,
      name: "Metoprolol 50mg",
      time: "8:00 AM",
      frequency: "Daily",
      completed: false,
    },
    {
      id: 2,
      name: "Lisinopril 10mg",
      time: "8:00 AM",
      frequency: "Daily",
      completed: false,
    },
    {
      id: 3,
      name: "Aspirin 81mg",
      time: "12:00 PM",
      frequency: "Daily",
      completed: false,
    },
    {
      id: 4,
      name: "Metoprolol 50mg",
      time: "8:00 PM",
      frequency: "Daily",
      completed: false,
    },
  ];

  const adls = [
    {
      id: 1,
      task: "Morning hygiene routine",
      time: "7:30 AM",
      completed: false,
      addedBy: "Sarah Johnson",
    },
    {
      id: 2,
      task: "Breakfast",
      time: "8:30 AM",
      completed: false,
      addedBy: "Emma Davis",
    },
    {
      id: 3,
      task: "Physical therapy exercises",
      time: "10:00 AM",
      completed: false,
      addedBy: "Sarah Johnson",
    },
    {
      id: 4,
      task: "Lunch",
      time: "12:30 PM",
      completed: false,
      addedBy: "Emma Davis",
    },
    {
      id: 5,
      task: "Afternoon walk",
      time: "3:00 PM",
      completed: false,
      addedBy: "Mike Chen",
    },
    {
      id: 6,
      task: "Dinner",
      time: "6:00 PM",
      completed: false,
      addedBy: "David Lee",
    },
    {
      id: 7,
      task: "Evening hygiene routine",
      time: "8:30 PM",
      completed: false,
      addedBy: "Mike Chen",
    },
  ];

  const patient = {
    name: 'Harold Thompson',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Margaret',
    dob: 'March 15, 1945',
    allergies: 'Penicillin, Shellfish',
    carers: ['Sarah Johnson, Mike Chen, Emma Davis']
  };

  const formatDateKey = (year, month, date) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-us", { month: "long", year: "numeric" });
  };

  const getPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const getNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    setSelectedDate(clickedDate);
    setSideBarOpen(true);
  };

  const hasShifts = (day) => {
    const dateKey = formatDateKey(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return shifts[dateKey] || [];
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      today.getDate() == day &&
      today.getMonth() == currentDate.getMonth() &&
      today.getFullYear() == currentDate.getFullYear()
    );
  };

  const getShiftsForDate = (date) => {
    if (!date) return [];
    const dateKey = formatDateKey(date.getFullYear(), date.getMonth(), date.getDate());
    return shifts[dateKey] || [];
  };

  const toggleTask = (type, id) => {
    const key = `${type}-${id}`;
    setTaskStates(prev => ({
        ...prev,
        [key]: !prev[key]
    }));
  };

  return (
    <>
      <MainNav />

      <main className="ring-border mx-auto min-h-screen w-full max-w-7xl pt-30 ring-1 ring-offset-0">
        <PatientProfile patient={patient}/>
        <div className="flex w-full">
        </div>
        <div className="flex w-full gap-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
          <div
            className={`flex-1 transition-all duration-300 ${sidebarOpen ? "mr-0" : ""}`}
          >
            <div className="bd-white rounded-xl p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <div className="text-lg">{formatDate(currentDate)}</div>
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
              <CalendarGrid
                currentDate={currentDate}
                onDateClick={handleDateClick}
                hasShifts={hasShifts}
                isToday={isToday}
              />
            </div>
          </div>
          {/* Sidebar component will go here */}
          {sidebarOpen && (
            <DailySidebar
            selectedDate={selectedDate}
            onClose={() => setSideBarOpen(false)}
            shifts={getShiftsForDate(selectedDate)}
            medications={medications}
            adls={adls}
            taskStates={taskStates}
            onToggleTask={toggleTask}
            />
          )}
        </div>
      </main>
    </>
  );
}
export default PatientDashboard;
