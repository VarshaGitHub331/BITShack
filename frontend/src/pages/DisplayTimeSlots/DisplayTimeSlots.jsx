import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../contexts/AuthContext";
import TimeSlotDisplay from "../../components/TimeSlotDisplay/TimeSlotDisplay";
import { fetchTimeSlots } from "../../apis/TimeSlots";
export default function DisplayTimeSlots() {
  const { user_id } = useAuthContext().userState;
  const { data: timeSlots, isLoading } = useQuery({
    queryFn: () => fetchTimeSlots({ provider_id: user_id }),
    queryKey: ["timeslots", user_id],
  });
  return <>{timeSlots && <TimeSlotDisplay timeSlots={timeSlots} />}</>;
}
