import { useQuery } from "@tanstack/react-query";
import { fetchHospital } from "../../apis/Hospital";
export default function StepOne({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) {
  const { data: hospitals, hospitalLoading } = useQuery({
    queryKey: ["hospitals"],
    queryFn: () => fetchHospital(),
  });
  return (
    <div>
      <h2 className="text-lg font-semibold text-center mb-4 text-purple-500">
        Basic Details
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          nextStep();
        }}
      >
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 text-left
              mb-2"
          >
            Provider Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData("name", e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 text-left
              mb-2"
          >
            Hospital Registration Number
          </label>
          <select
            value={formData.hospital_regno}
            onChange={(e) => {
              const selectedIndex = e.target.selectedIndex; // Adjust index to account for the "Loading..." option
              if (selectedIndex >= 0) {
                // Ensure it's not the "Loading..." option
                const selectedHospital = hospitals[selectedIndex];
                updateFormData(
                  "hospital_regno",
                  selectedHospital.hospital_regno
                );
                updateFormData("hospital_id", selectedHospital.hospital_id);
              }
            }}
            className="w-full p-2 border rounded-lg"
            required
          >
            {hospitalLoading ? (
              <option>Loading...</option>
            ) : (
              hospitals?.map((hospital) => (
                <option
                  key={hospital.hospital_id}
                  value={hospital.hospital_regno}
                >
                  {hospital.hospital_regno}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 text-left
              mb-2"
          >
            Contact Number
          </label>
          <input
            type="text"
            value={formData.contact_no}
            onChange={(e) => updateFormData("contact_no", e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 text-left
          mb-2"
          >
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => updateFormData("gender", e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 text-left
          mb-2"
          >
            Specialization
          </label>
          <input
            type="text"
            value={formData.specialization}
            onChange={(e) => updateFormData("specialization", e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 flex-1"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 flex-1"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
