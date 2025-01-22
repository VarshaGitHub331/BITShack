import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPatientAppointments } from "../../apis/appointment";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { useState } from "react";

const APPOINTMENTS_PER_PAGE = 6;

export default function ViewAppointments() {
  const queryClient = new QueryClient();
  const { userState } = useAuthContext();
  const { user_id } = userState;
  const [cancelling, setCancelling] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPrescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [isObservationModalOpen, setObservationModalOpen] = useState(false);
  const [isDiagnosisModalOpen, setDiagnosisModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const {
    data: patientAppointments,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => fetchPatientAppointments({ patient_id: user_id }),
    queryKey: ["patient_appointments", user_id],
  });

  const handleCancel = async (appointmentId) => {
    setCancelling(true);
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
      setCancelling(false);
      queryClient.invalidateQueries(["patient_appointments"]);
    } catch (e) {
      setCancelling(false);
      console.error(e);
    }
  };

  const pageCount = Math.ceil(
    patientAppointments?.length / APPOINTMENTS_PER_PAGE
  );
  const offset = currentPage * APPOINTMENTS_PER_PAGE;
  const currentAppointments = patientAppointments?.slice(
    offset,
    offset + APPOINTMENTS_PER_PAGE
  );

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  const openModal = (appointment, modalType) => {
    setSelectedAppointment(appointment);
    if (modalType === "prescription") setPrescriptionModalOpen(true);
    if (modalType === "observation") setObservationModalOpen(true);
    if (modalType === "diagnosis") setDiagnosisModalOpen(true);
  };

  const closeModal = () => {
    setPrescriptionModalOpen(false);
    setObservationModalOpen(false);
    setDiagnosisModalOpen(false);
  };

  if (isLoading)
    return <div className="text-blue-500">Loading appointments...</div>;
  if (isError)
    return <div className="text-red-500">Failed to fetch appointments.</div>;
  if (!patientAppointments?.length)
    return <div className="text-gray-500">No appointments found.</div>;

  return (
    <>
      <div className="text-purple-500 text-md mb-4 font-bold">
        My Appointments
      </div>
      <div
        className="flex flex-col w-full md:w-3/4 space-y-4"
        style={{ maxHeight: "80vh", paddingRight: "1rem" }}
      >
        {currentAppointments?.map((appointment) => (
          <div
            key={appointment.id}
            className="relative flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex-shrink-0">
              <img
                src={appointment.provider.image || "./assets/Logo.webp"}
                className="object-cover h-12 w-12 rounded-full border border-gray-300"
                alt="doc"
              />
            </div>
            <div className="flex-grow ml-3">
              <p className="text-slate-700 font-semibold">
                {appointment.provider.provider_name}
              </p>
              <p className="text-sm text-slate-500">
                Specialization: {appointment.provider.specialization}
              </p>
              <p className="text-sm text-slate-500">
                Hospital: {appointment.provider["Hospital.hospital_name"]}
              </p>
              <div className="flex gap-x-2">
                <button
                  className="mt-2 bg-purple-500 text-white py-1 px-3 rounded-md text-xs md:text-sm"
                  onClick={() => openModal(appointment, "prescription")}
                >
                  Prescription
                </button>
                <button
                  className="mt-2 bg-purple-500 text-white py-1 px-3 rounded-md text-xs md:text-sm"
                  onClick={() => openModal(appointment, "observation")}
                >
                  Observation
                </button>
                <button
                  className="mt-2 bg-purple-500 text-white py-1 px-3 rounded-md text-xs md:text-sm"
                  onClick={() => openModal(appointment, "diagnosis")}
                >
                  Diagnosis
                </button>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-blue-100 text-blue-500 text-xs md:text-sm px-3 py-1 rounded-md font-semibold">
              {appointment.status}
            </div>
            {appointment.status !== "Cancelled" && (
              <div
                className="absolute bottom-2 right-2 py-1 px-3 bg-purple-500 text-white text-xs md:text-sm rounded-md cursor-pointer"
                onClick={() => handleCancel(appointment.appointment_id)}
              >
                {cancelling ? "Cancelling..." : "Cancel"}
              </div>
            )}
          </div>
        ))}
        <div className="mt-6 flex justify-center">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={handlePageChange}
            containerClassName={"flex items-center gap-2"}
            activeClassName={"bg-blue-500 text-white rounded px-2"}
            pageClassName={"px-2 py-1 border rounded"}
            previousClassName={"px-3 py-1 border rounded bg-gray-200"}
            nextClassName={"px-3 py-1 border rounded bg-gray-200"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
          />
        </div>
      </div>
      {/* Modal Components */}
      {isPrescriptionModalOpen && (
        <Modal
          content={
            selectedAppointment?.prescription || "No prescription available"
          }
          closeModal={closeModal}
          title="Prescription"
        />
      )}
      {isObservationModalOpen && (
        <Modal
          content={
            selectedAppointment?.observation || "No observation available"
          }
          closeModal={closeModal}
          title="Observation"
        />
      )}
      {isDiagnosisModalOpen && (
        <Modal
          content={selectedAppointment?.diagnosis || "No diagnosis available"}
          closeModal={closeModal}
          title="Diagnosis"
        />
      )}
    </>
  );
}

const Modal = ({ content, closeModal, title }) => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-5 rounded-lg w-1/3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2">{content}</p>
      <button
        onClick={closeModal}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Close
      </button>
    </div>
  </div>
);
