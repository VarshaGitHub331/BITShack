import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPatientProfile, uploadPatientFile } from "../../apis/Patient";
import { useAuthContext } from "../../contexts/AuthContext";

export default function PatientDashboard() {
  const { userState } = useAuthContext();
  const { user_id } = userState;

  // Fetch patient details using React Query
  const {
    data: patientDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => getPatientProfile({ user_id }),
    queryKey: ["PatientDetails", user_id],
  });

  // State for file upload
  const [file, setFile] = useState(null);
  const [recordType, setRecordType] = useState(""); // New state for record type
  const [uploadStatus, setUploadStatus] = useState("");

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file || !recordType) {
      setUploadStatus("Please select a file and record type to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("user_id", user_id); // Pass user_id for backend association
      formData.append("record_type", recordType); // Pass the record type

      await uploadPatientFile(formData); // Call API to upload the file
      setFile();
      setRecordType("");
      setUploadStatus("");
      setUploadStatus("");
    } catch (error) {
      console.error(error);
      setUploadStatus("Failed to upload the file. Please try again.");
    }
  };

  // Loading state
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Error handling
  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  // Patient profile data
  const {
    first_name,
    last_name,
    gender,
    details: {
      addressLine1,
      addressLine2,
      zipCode,
      birthDate,
      city,
      state,
      country,
    },
  } = patientDetails;

  // Format birthdate (optional)
  const formattedBirthDate = new Date(birthDate).toLocaleDateString();

  return (
    <div className="min-h-screen py-8 px-6">
      {/* Profile Picture (placeholder) */}
      <div className="flex justify-start mb-6">
        <div className="w-24 h-24 bg-purple-300 rounded-full flex items-center justify-center text-lg text-white">
          No Photo
        </div>
      </div>
      <div className="font-semibold text-purple-600 text-xl">
        {first_name} {last_name}
      </div>
      <hr className="text-xl" />
      {/* Patient Profile Details */}
      <div className="space-y-6 text-gray-800 mt-4 ">
        <div>
          <strong className="font-semibold text-purple-600">Gender:</strong>{" "}
          {gender}
        </div>
        <div>
          <strong className="font-semibold text-purple-600">Birthdate:</strong>{" "}
          {formattedBirthDate}
        </div>
        <div>
          <strong className="font-semibold text-purple-600">Address:</strong>{" "}
          {addressLine1}, {city}, {state}, {country}, {zipCode}
        </div>
      </div>

      {/* File Upload Section */}
      <div className="mt-8 space-y-4 ">
        <h3 className="text-md font-semibold text-purple-500 mb-2">
          Upload Medical Records
        </h3>
        <hr />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />
        <select
          value={recordType}
          onChange={(e) => setRecordType(e.target.value)}
          className="mb-4 p-2 border rounded mx-2"
        >
          <option value="">Select Record Type</option>
          <option value="Prescription">Prescription</option>
          <option value="Lab Report">Lab Report</option>
          <option value="Imaging">Imaging (X-ray, MRI, etc.)</option>
          <option value="Discharge Summary">Discharge Summary</option>
        </select>
        <button
          onClick={handleFileUpload}
          className="bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-500"
        >
          Upload File
        </button>
        {uploadStatus && (
          <p className="mt-4 text-sm text-gray-600">{uploadStatus}</p>
        )}
      </div>
    </div>
  );
}
