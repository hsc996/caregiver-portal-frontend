import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import fallbackProfileImg from '../../assets/images/stockprofile.png';

function PatientHeader({ patient, rawPatient }) {
  const navigate = useNavigate();

  function handleEditClick() {
    if (!patient._id) return;
    navigate(`/patient/${patient._id}`, { state: { patient: rawPatient } });
  }

  return (
    <>
      <div className="flex w-full items-center bg-white/40 backdrop-blur-md border-b border-white/30 py-4 px-8">
        <div className="flex items-center gap-6 px-4 ml-2">
          <motion.button
            onClick={handleEditClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="relative group focus:outline-none shrink-0"
            aria-label="Edit patient profile"
          >
            <img
              src={patient.profileImg || fallbackProfileImg}
              alt={patient.name}
              className="h-16 w-16 rounded-full border-2 border-indigo-100 object-cover transition-opacity group-hover:opacity-80 cursor-pointer"
            />
            <span className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="rounded-full bg-black/40 px-1.5 py-0.5 text-xs text-white">Edit</span>
            </span>
          </motion.button>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{patient.name}</h2>
            <div className="text-sm text-gray-500 mt-1.5">
              <span>DOB:</span>
              <span className="ml-1 text-gray-700 font-medium">{patient.dob}</span>
            </div>
          </div>
        </div>

        {patient.allergies && patient.allergies !== '—' && (
          <div className="ml-auto mr-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-red-600">Allergies:</span>
            <span className="text-sm font-medium text-red-800">{patient.allergies}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default PatientHeader;
