import { useQuery } from "@tanstack/react-query";
import { fetchProviderAppointments } from "../../apis/appointment";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import { FaFileAlt } from "react-icons/fa"; // Import icon library
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 4; // Number of appointments per page

export default function ViewAppointments() {
  const { userState } = useAuthContext();
  const { user_id } = userState;
  const [currentPage, setCurrentPage] = useState(0);
  const [active, setActive] = useState("");
  const [diag, setDiag] = useState(false);
  const [obs, setObs] = useState(false);
  const [pres, setPres] = useState(false);
  const {
    data: providerAppointments,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryFn: () => fetchProviderAppointments({ provider_id: user_id }),
    queryKey: ["provider_appointments", user_id],
  });
  const navigate = useNavigate();
  const handleCancel = async (appointmentId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/appointment/updateStatus`,
        {
          status: "Cancelled",
          appointment_id: appointmentId,
        },
        {
          headers: {
            "Content-type": "Application/json",
          },
        }
      );
      refetch(); // Refresh the appointments list
    } catch (e) {
      console.error("Error cancelling appointment:", e);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Paginated data
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentPageAppointments = providerAppointments?.slice(
    offset,
    offset + ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
        <span className="ml-2 text-blue-500">Loading appointments...</span>
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Failed to fetch appointments.</div>;
  }

  if (providerAppointments?.length === 0) {
    return <div className="text-gray-500">No appointments found.</div>;
  }

  return (
    <>
      <div className="text-purple-500 text-md mb-4">My Appointments</div>
      <div className="flex flex-col w-full h-screen md:w-3/4">
        {currentPageAppointments?.map((appointment) => (
          <div
            key={appointment.id}
            className="relative flex flex-col border border-slate-300 bg-white py-4 px-4 rounded-lg mb-4"
          >
            {/* Patient Name */}
            <div className="text-sm md:text-base font-medium text-gray-700">
              {appointment["Patient.first_name"]}
            </div>

            {/* Date, Time, Cancel Button, and Documents Icon */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 space-y-2 md:space-y-0">
              <div className="text-sm md:text-base text-gray-600 font-bold ">
                {
                  new Date(appointment["Time_Slot.slot_date"])
                    .toISOString()
                    .split("T")[0]
                }
                | {appointment["Time_Slot.start_time"]}
              </div>
            </div>
            <div className="flex space-x-2 justify-end">
              <button
                className="text-blue-500 hover:text-blue-700"
                title="View Documents"
                onClick={() =>
                  navigate("/patientDocuments", {
                    state: {
                      patient_id: appointment.patient_id,
                    },
                  })
                }
              >
                <FaFileAlt size={20} />
              </button>
              <button
                className="text-white bg-purple-500 p-1 rounded-md"
                onClick={(e) => {
                  setPres(true);
                  setActive((active) => appointment);
                }}
              >
                Prescription
              </button>
              <button
                className="text-white bg-purple-500 p-1 rounded-md"
                onClick={(e) => {
                  setDiag(true);
                  setActive((active) => appointment);
                }}
              >
                Diagnosis
              </button>
              <button
                className="text-white bg-purple-500 p-1 rounded-md "
                onClick={(e) => {
                  setObs(true);
                  setActive((active) => appointment);
                }}
              >
                Observation
              </button>
              {appointment.status !== "Cancelled" && (
                <div className="flex items-center gap-4">
                  <button
                    className="py-1 px-3 bg-purple-500 text-white rounded-md text-sm md:text-base hover:bg-purple-600"
                    onClick={() => handleCancel(appointment.appointment_id)}
                  >
                    Cancel
                  </button>

                  {/* View Documents Icon */}
                </div>
              )}
            </div>

            {/* Appointment Status */}
            <div className="absolute top-2 right-2 bg-blue-100 text-blue-500 text-xs md:text-sm px-3 py-1 rounded-md font-semibold">
              {appointment.status}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Component */}
      <div className="mt-6 flex justify-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(providerAppointments.length / ITEMS_PER_PAGE)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          containerClassName={"flex items-center gap-2"}
          activeClassName={"bg-blue-500 text-white rounded px-2"}
          pageClassName={"px-2 py-1 border rounded"}
          previousClassName={"px-3 py-1 border rounded bg-gray-200"}
          nextClassName={"px-3 py-1 border rounded bg-gray-200"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      </div>
      {obs && <ObsPopUp active={active} setObs={setObs} />}
      {diag && <DiagPopUp active={active} setDiag={setDiag} />}
      {pres && <PresPopUp active={active} setPres={setPres} />}
    </>
  );
}
function ObsPopUp({ active, setObs, patient_id }) {
  const [observation, setObservation] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  async function handleObsSave() {
    setIsLoading(true); // Set loading state to true when the request starts
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/fhir/storeObservation`,
        {
          appointment_id: active.appointment_id,
          patient_id: active.patient_id,
          extractText: observation,
        }
      );
      alert("Observation saved successfully.");
    } catch (e) {
      alert("Failed to save observation. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state when the request ends
    }
  }

  const handleClose = () => {
    setObs(false);
  };

  return (
    <div
      className={`${
        active
          ? "fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
          : "hidden"
      }`}
    >
      <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
        <h3 className="text-md text-purple-500 font-bold mb-4">
          Add Observation
        </h3>
        <textarea
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder="Enter observation..."
          className="w-full p-2 border rounded mb-4"
        ></textarea>
        <div className="flex justify-between">
          <button
            className="bg-gray-500 text-white p-2 rounded-md"
            onClick={handleClose}
            disabled={isLoading} // Disable button when loading
          >
            Close
          </button>
          <button
            className="bg-purple-500 text-white p-2 rounded-md"
            onClick={handleObsSave}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full text-white"></span>
            ) : (
              "Save Observation"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
function DiagPopUp({ active, setDiag, patient_id }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleSave = async () => {
    setIsLoading(true); // Set loading state to true when the request starts
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/fhir/storeDiagnosis`,
        {
          appointment_id: active.appointment_id,
          patient_id: active.patient_id,
          inputText: diagnosis,
          type: "diagnosis",
        }
      );
      alert("Diagnosis saved successfully.");
      setDiag(false); // Close the modal after saving
    } catch (e) {
      console.error("Error saving diagnosis:", e);
      alert("Failed to save diagnosis. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state when the request ends
    }
  };

  const handleClose = () => {
    setDiag(false);
  };

  return (
    <div
      className={`${
        active
          ? "fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
          : "hidden"
      }`}
    >
      <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
        <h3 className="text-md text-purple-500 font-bold mb-4">
          Add Diagnosis
        </h3>
        <textarea
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="Enter diagnosis..."
          className="w-full p-2 border rounded mb-4"
        ></textarea>
        <div className="flex justify-between">
          <button
            className="bg-gray-500 text-white p-2 rounded-md"
            onClick={handleClose}
            disabled={isLoading} // Disable button when loading
          >
            Close
          </button>
          <button
            className="bg-purple-500 text-white p-2 rounded-md"
            onClick={handleSave}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full text-white"></span>
            ) : (
              "Save Diagnosis"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
function PresPopUp({ active, setPres, patient_id }) {
  const [prescription, setPrescription] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleSave = async () => {
    setIsLoading(true); // Set loading state to true when the request starts
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/fhir/storePrescription`,
        {
          appointment_id: active.appointment_id,
          patient_id: active.patient_id,
          inputText: prescription,
          type: "prescription",
        }
      );
      alert("Prescription saved successfully.");
      setPres(false); // Close the modal after saving
    } catch (e) {
      console.error("Error saving prescription:", e);
      alert("Failed to save prescription. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state when the request ends
    }
  };

  const handleClose = () => {
    setPres(false);
  };

  return (
    <div
      className={`${
        active
          ? "fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
          : "hidden"
      }`}
    >
      <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
        <h3 className="text-md text-purple-500 font-bold mb-4">
          Add Prescription
        </h3>
        <textarea
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
          placeholder="Enter prescription..."
          className="w-full p-2 border rounded mb-4"
        ></textarea>
        <div className="flex justify-between">
          <button
            className="bg-gray-500 text-white p-2 rounded-md"
            onClick={handleClose}
            disabled={isLoading} // Disable button when loading
          >
            Close
          </button>
          <button
            className="bg-purple-500 text-white p-2 rounded-md"
            onClick={handleSave}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full text-white"></span>
            ) : (
              "Save Prescription"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
