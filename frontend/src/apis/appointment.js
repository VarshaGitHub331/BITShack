import axios from "axios";
async function fetchPatientAppointments({ patient_id }) {
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/patient/fetchAppointments?user_id=${patient_id}`
    );
    console.log(result);
    return result.data;
  } catch (e) {
    console.log(e);
  }
}
async function fetchProviderAppointments({ provider_id }) {
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/hospitalProvider/fetchProviderAppointments?provider_id=${provider_id}`
    );
    console.log(result);
    return result.data;
  } catch (e) {
    console.log(e);
  }
}
export { fetchPatientAppointments, fetchProviderAppointments };
