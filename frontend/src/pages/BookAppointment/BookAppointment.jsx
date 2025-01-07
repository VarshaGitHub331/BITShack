import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTimeSlots } from "../../apis/TimeSlots";
import TimeSlotBooking from "../../components/TimeSlotBooking/TimeSlotBooking";
export default function BookAppointment() {
  const location = useLocation();
  const provider = location.state?.provider;
  console.log(provider);
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchTimeSlots({ provider_id: provider?.provider_id }),
    queryKey: ["timeslots", provider?.provider_id],
  });
  console.log(data);
  return (
    <>
      <div className="flex flex-col items-center  w-full h-screen">
        <div className="flex w-full  py-4 space-x-8 justify-center">
          <div className="bg-white rounded-lg">
            <img
              src="./assets/Logo.webp"
              alt="doctor"
              className="w-full h-40  object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col rounded-md w-1/2 bg-white text-black shadow-lg p-4">
            <div className="text-slate-700 text-lg font-semibold">
              {provider?.provider_name}
            </div>
            <p className="mt-2 text-slate-600">
              Specialization - {provider?.specialization || "N/A"}
            </p>
            <p className="mt-2 text-slate-600">
              Hospital - {provider?.Hospital.hospital_name || "N/A"}
            </p>
            <p className="mt-2 text-slate-600">
              Gender - {provider?.gender || "N/A"}
            </p>
            <p className="mt-2 text-slate-600">
              Location - {`${provider?.details.addressLine1}` || "N/A"}
            </p>
            <p className="mt-2 text-slate-600">
              State- {provider?.details.city}
            </p>
          </div>
        </div>
        <div className="w-full">
          {data && <TimeSlotBooking timeSlots={data} />}
        </div>
      </div>
    </>
  );
}
