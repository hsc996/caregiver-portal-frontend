function PatientProfile({ patient }) {
  return (
    <>
      <div className="flex h-64 w-full bg-white py-20">
        <div className="flex items-center justify-start space-x-6 p-8 ml-4">
          <div className="relative">
            <img
              src={patient.imgUrl || './src/assets/images/example_profilepic.png'}
              alt={patient.name}
              className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-indigo-100 object-cover"
            />
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

export default PatientProfile;
