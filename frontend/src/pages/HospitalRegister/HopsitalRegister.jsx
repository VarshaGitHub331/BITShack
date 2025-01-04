import { useState } from "react";
import FirstStep from "./StepTwo.jsx";
import SecondStep from "./StepThree.jsx";
import Register from "./StepOne.jsx";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthContext.js";
import { useNavigate } from "react-router-dom";
export default function HospitalRegister() {
  const { userState, UserLogin } = useAuthContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    hospitalName: "",
    hospital_regno: "",
    contact_no: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [step, setStep] = useState(1);
  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const [loading, setLoading] = useState(false);
  async function handleSubmit() {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/hospital/registerHospital`,
        {
          email: formData.email,
          password: formData.password,
          hospital_name: formData.hospitalName,
          hospital_regno: formData.hospital_regno,
          details: {
            contact_no: formData.contact_no,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      UserLogin(response.data.user);
      setLoading(false);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      {step === 1 && (
        <Register
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
        />
      )}
      {step !== 1 && (
        <div className="min-h-screen p-4 flex items-center justify-center bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            {step === 2 && (
              <FirstStep
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {step === 3 && (
              <SecondStep
                formData={formData}
                updateFormData={updateFormData}
                prevStep={prevStep}
                loading={loading}
                handleSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
