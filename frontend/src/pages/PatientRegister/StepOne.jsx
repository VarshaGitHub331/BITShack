export default function StepOne({ formData, updateFormData, nextStep }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-center mb-4 text-purple-500">
        Basic Details
      </h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 text-left
          mb-2"
          >
            First Name
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => updateFormData("first_name", e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 text-left
          mb-2"
          >
            Last Name
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => updateFormData("last_name", e.target.value)}
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
            Birth Date
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => updateFormData("birthDate", e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="button"
          onClick={nextStep}
          className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
        >
          Next
        </button>
      </form>
    </div>
  );
}
