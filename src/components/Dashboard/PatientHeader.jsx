import { useNavigate } from 'react-router-dom';

function PatientHeader({ patient }) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex w-full bg-white py-4">
        <div className="flex items-center justify-start space-x-6 p-8 ml-6">
          <div className="relative">
            <button
              onClick={() => patient._id && navigate(`/patient/${patient._id}`)}
              className="relative group focus:outline-none"
              aria-label="Edit patient profile"
            >
              <img
                src={patient.profileImg || './src/assets/images/example_profilepic.png'}
                alt={patient.name}
                className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-indigo-100 object-cover transition-opacity group-hover:opacity-80 cursor-pointer"
              />
              <span className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="rounded-full bg-black/40 px-2 py-1 text-xs text-white">Edit</span>
              </span>
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
            <div className="mt-3 space-y-0.5 text-sm">
              <div>
                <span className="text-gray-500">Date of Birth:</span>
                <span className="ml-2 text-gray-900 font-medium">{patient.dob}</span>
              </div>
              <div>
                <span className="text-gray-500">Allergies:</span>
                <span className="ml-2 text-gray-900 font-medium">{patient.allergies}</span>
              </div>
              <div>
                <span className="text-gray-500">Care Team:</span>
                <span className="ml-2 text-gray-900 font-medium">{patient.carers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PatientHeader;
