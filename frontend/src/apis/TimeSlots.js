import axios from "axios";
async function fetchTimeSlots({ provider_id }) {
  const response = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/hospitalProvider/getTimeSlots?provider_id=${provider_id}`
  );
  console.log(response);
  return response.data;
}
export { fetchTimeSlots };
