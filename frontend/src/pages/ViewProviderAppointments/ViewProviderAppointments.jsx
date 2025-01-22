import { useQuery } from "@tanstack/react-query";
import { fetchProviderAppointments } from "../../apis/appointment";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useState } from "react";

const ITEMS_PER_PAGE = 5; // Number of appointments per page

export default function ViewAppointments() {
  const { userState } = useAuthContext();
  const { user_id } = userState;
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: providerAppointments,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryFn: () => fetchProviderAppointments({ provider_id: user_id }),
    queryKey: ["provider_appointments", user_id],
  });

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

            {/* Date, Time, and Cancel Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 space-y-2 md:space-y-0">
              <div className="text-sm md:text-base text-gray-600 font-bold ">
                {
                  new Date(appointment["Time_Slot.slot_date"])
                    .toISOString()
                    .split("T")[0]
                }
                | {appointment["Time_Slot.start_time"]}
              </div>

              {appointment.status !== "Cancelled" && (
                <button
                  className="py-1 px-3 bg-purple-500 text-white rounded-md text-sm md:text-base hover:bg-purple-600"
                  onClick={() => handleCancel(appointment.appointment_id)}
                >
                  Cancel
                </button>
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
    </>
  );
}
