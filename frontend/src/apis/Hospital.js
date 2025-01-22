import axios from "axios";
async function fetchHospital() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/hospital/getHospitals`
    );
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
}
async function fetchProviders() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/hospitalProvider/fetchProviders`
    );
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
}
async function fetchHospitalDetails({ hospital_name }) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/hospital/getProviderAppointments?name=${hospital_name}`
    );
    console.log(response);
    return response.data.details;
  } catch (e) {
    console.log(e);
  }
}
export { fetchHospital, fetchProviders, fetchHospitalDetails };
