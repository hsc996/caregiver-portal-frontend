import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import fallbackProfileImg from '../../assets/images/example_profilepic.png';

function PatientHeader({ patient, rawPatient }) {
  const navigate = useNavigate();

  function handleEditClick() {
    if (!patient._id) return;
    navigate(`/patient/${patient._id}`, { state: { patient: rawPatient } });
  }

  return (
    <>
      <div className="flex w-full items-center bg-white/40 backdrop-blur-md border-b border-white/30 py-4 px-8">
        <div className="flex items-center space-x-6 p-8 ml-6">
          <div className="relative">
            <motion.button
              onClick={handleEditClick}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative group focus:outline-none"
              aria-label="Edit patient profile"
            >
              <img
                src={patient.profileImg || fallbackProfileImg}
                alt={patient.name}
                className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-indigo-100 object-cover transition-opacity group-hover:opacity-80 cursor-pointer"
              />
              <span className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="rounded-full bg-black/40 px-2 py-1 text-xs text-white">Edit</span>
              </span>
            </motion.button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
            <div className="mt-3 text-sm">
              <span className="text-gray-500">Date of Birth:</span>
              <span className="ml-2 text-gray-900 font-medium">{patient.dob}</span>
            </div>
          </div>
        </div>

        {patient.allergies && patient.allergies !== '—' && (
          <div className="ml-auto mr-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-red-600">Allergies:</span>
            <span className="text-sm font-medium text-red-800">{patient.allergies}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default PatientHeader;
