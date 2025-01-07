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
export { fetchHospital, fetchProviders };
