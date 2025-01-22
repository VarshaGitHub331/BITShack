import axios from "axios";
async function getPatientProfile({ user_id }) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/patient/patientProfile?user_id=${user_id}`
    );
    console.log(response);
    return response.data;
  } catch (e) {
    console.log(e);
  }
}
async function uploadPatientFile(formData) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/patient/uploadDocument`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
  } catch (e) {
    throw new Error(e);
  }
}
async function getPatientDocuments({ patient_id, user_id, token }) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/hospitalProvider/patientDocuments?user_id=${user_id}&patient_id=${patient_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
}
export { getPatientProfile, uploadPatientFile, getPatientDocuments };
