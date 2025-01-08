import { useQuery } from "@tanstack/react-query";
import { fetchProviderAppointments } from "../../apis/appointment";
import { useAuthContext } from "../../contexts/AuthContext";

import axios from "axios";

export default function ViewAppointments() {
  const { userState } = useAuthContext();
  const { user_id } = userState;

  const {
    data: providerAppointments,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => fetchProviderAppointments({ provider_id: user_id }),
    queryKey: ["provider_appointments", user_id],
  });

  const handleCancel = async (appointmentId) => {
    console.log("Canceling appointment:", appointmentId);
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
      alert("Cancelled");
    } catch (e) {
      console.log(e);
    }
    // Add cancellation API call or logic here
  };

  if (isLoading) {
    return <div className="text-blue-500">Loading appointments...</div>;
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
        {providerAppointments?.map((appointment) => (
          <div
            key={appointment.id}
            className="relative flex items-center border-x-slate-300 space-x-2 bg-white py-2 rounded-lg"
          >
            <div className="absolute top-2 right-2 bg-blue-100 text-blue-500 text-xs md:text-sm px-3 py-1 rounded-md font-semibold">
              {appointment.status}
            </div>
            {appointment.status !== "Cancelled" && (
              <div
                className="absolute bottom-2 text-center right-2 w-1/4 py-1 md:py-2 bg-purple-500 px-3 rounded-md text-white cursor-pointer"
                onClick={() => handleCancel(appointment.appointment_id)}
              >
                Cancel
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
