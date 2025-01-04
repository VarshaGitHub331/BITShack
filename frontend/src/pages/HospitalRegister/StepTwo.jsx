export default function StepOne({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) {
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
            Hospital Name
          </label>
          <input
            type="text"
            value={formData.hospitalName}
            onChange={(e) => updateFormData("hospitalName", e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 text-left
            mb-2"
          >
            Registration Number
          </label>
          <input
            type="text"
            value={formData.hospital_regno}
            onChange={(e) => updateFormData("hospital_regno", e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
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
