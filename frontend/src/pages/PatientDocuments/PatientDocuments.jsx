import { useAuthContext } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPatientDocuments } from "../../apis/Patient";

export default function PatientDocuments() {
  const { userState } = useAuthContext();
  const { user_id, token } = userState;

  const location = useLocation();
  const patient_id =
    location.state?.patient_id ||
    new URLSearchParams(location.search).get("patient_id");

  const {
    data: patientDocuments,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () =>
      getPatientDocuments({
        user_id,
        patient_id,
        token,
      }),
    queryKey: ["patientDocuments", patient_id],
    enabled: !!patient_id,
  });

  if (!patient_id) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-2xl font-semibold text-red-600">
          No Patient Selected
        </h1>
        <p className="text-gray-600">
          Please select a patient to view documents.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <p className="text-xl text-blue-500 animate-pulse">
          Loading patient documents...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-xl font-bold text-red-500">Error</h1>
        <p className="text-gray-600">
          Failed to load documents. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 px-6 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <p className="text-gray-700 text-sm mb-2">
          <strong>Patient Documents:</strong>
        </p>

        {patientDocuments?.length > 0 ? (
          <ul className="space-y-4">
            {patientDocuments.map((doc, index) => (
              <li
                key={doc.id || index}
                className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {doc.type?.text || "Unknown Document"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last Updated:{" "}
                    {new Date(doc.meta?.lastUpdated).toLocaleDateString() ||
                      "N/A"}
                  </p>
                  {doc.content?.[0]?.attachment?.title && (
                    <p className="text-sm text-gray-500 mt-2">
                      <strong>File Name:</strong>{" "}
                      {doc.content[0].attachment.title}
                    </p>
                  )}
                  <p className="mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        doc.status === "current"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </p>
                </div>
                {doc.content?.[0]?.attachment?.url && (
                  <a
                    href={doc.content[0].attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 md:mt-0 text-sm font-medium text-purple-600 hover:text-purple-800 underline"
                  >
                    View Document
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">
            No documents available for this patient.
          </p>
        )}
      </div>
    </div>
  );
}
