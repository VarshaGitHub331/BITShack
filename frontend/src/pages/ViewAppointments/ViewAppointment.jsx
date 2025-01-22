import { useQuery } from "@tanstack/react-query";
import { fetchPatientAppointments } from "../../apis/appointment";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ReactPaginate from "react-paginate";
const APPOINTMENTS_PER_PAGE = 6;
export default function ViewAppointments() {
  const queryClient = new QueryClient();
  const { userState } = useAuthContext();
  const { user_id } = userState;
  const [cancelling, setCancelling] = useState(false);
  const [currentPage, setCurrentPage] = useState(false);
  const {
    data: patientAppointment,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => fetchPatientAppointments({ patient_id: user_id }),
    queryKey: ["patient_appointments", user_id],
  });

  const handleCancel = async (appointmentId) => {
    console.log("Canceling appointment:", appointmentId);
    try {
      setCancelling(true);
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
      queryClient.invalidateQueries(["timeslots"]);
    } catch (e) {
      console.log(e);
    }
  };
  const pageCount = Math.ceil(
    patientAppointment?.length / APPOINTMENTS_PER_PAGE
  );
  const offset = currentPage * APPOINTMENTS_PER_PAGE;
  const currentAppointments = patientAppointment?.slice(
    offset,
    offset + APPOINTMENTS_PER_PAGE
  );
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  if (isLoading) {
    return <div className="text-blue-500">Loading appointments...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Failed to fetch appointments.</div>;
  }

  if (patientAppointment?.length === 0) {
    return <div className="text-gray-500">No appointments found.</div>;
  }

  return (
    <>
      <div className="text-purple-500 text-md mb-4 font-bold">
        My Appointments
      </div>
      {/* Appointment Cards Container */}
      <div
        className="flex flex-col w-full md:w-3/4  space-y-4"
        style={{
          maxHeight: "80vh", // Set a maximum height for the container
          paddingRight: "1rem", // Space for scrollbar
        }}
      >
        {currentAppointments?.map((appointment) => (
          <div
            key={appointment.id}
            className="relative flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200"
          >
            {/* Doctor's Image */}
            <div className="flex-shrink-0">
              <img
                src={appointment.provider.image || "./assets/Logo.webp"}
                className="object-cover h-12 w-12 rounded-full border border-gray-300"
                alt="doc"
              />
            </div>

            {/* Appointment Details */}
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
            </div>

            {/* Appointment Status */}
            <div className="absolute top-2 right-2 bg-blue-100 text-blue-500 text-xs md:text-sm px-3 py-1 rounded-md font-semibold">
              {appointment.status}
            </div>

            {/* Cancel Button */}
            {appointment.status !== "Cancelled" && (
              <div
                className="absolute bottom-2 right-2 py-1 px-3 bg-purple-500 text-white text-xs md:text-sm rounded-md cursor-pointer"
                onClick={() => handleCancel(appointment.appointment_id)}
              >
                {cancelling === true ? "Cancelling" : "Cancel"}
              </div>
            )}
          </div>
        ))}
        <div className="mt-6 flex justify-center">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
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
      </div>
    </>
  );
}
