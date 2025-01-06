import { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchTimeSlots } from "../../apis/TimeSlots";
import TimeSlotDisplay from "../../components/TimeSlotDisplay/TimeSlotDisplay";
export default function DisplayTimeSlots() {
  const { userState } = useAuthContext();
  const { user_id } = userState;
  const { data, isLoading, error } = useQuery({
    queryKey: ["timeSlots", { provider_id: user_id }],
    queryFn: () => fetchTimeSlots({ provider_id: user_id }),
  });
  console.log(data);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <TimeSlotDisplay timeSlots={data} />
    </div>
  );
}
