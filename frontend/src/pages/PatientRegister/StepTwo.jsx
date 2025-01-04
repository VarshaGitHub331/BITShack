export default function StepTwo({
  formData,
  updateFormData,
  prevStep,
  handleSubmit,
  loading,
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-center mb-4 text-purple-700">
        Location Details
      </h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4">
          <label className="block text-sm mb-2 font-medium text-gray-700 text-left">
            Address Line 1
          </label>
          <input
            type="text"
            value={formData.addressLine1}
            onChange={(e) => updateFormData("addressLine1", e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2 font-medium text-gray-700 text-left">
            Address Line 2
          </label>
          <input
            type="text"
            value={formData.addressLine2}
            onChange={(e) => updateFormData("addressLine2", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2 font-medium text-gray-700 text-left">
            City
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => updateFormData("city", e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2 font-medium text-gray-700 text-left">
            State
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => updateFormData("state", e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2 font-medium text-gray-700 text-left">
            Zip Code
          </label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => updateFormData("zipCode", e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2 font-medium text-gray-700 text-left">
            Country
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => updateFormData("country", e.target.value)}
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
            type="button"
            onClick={handleSubmit}
            className={`bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 flex-1 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
