import { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthContext";
export default function App() {
  const SERVER = process.env.REACT_APP_SERVER_URL;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    birthDate: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const { userState, UpdateName } = useAuthContext();
  const { user_id, token } = userState;

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    alert("called");
    setLoading(true);
    try {
      const response = await axios.post(
        `${SERVER}/patient/patientRegister`,
        {
          user_id: user_id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          gender: formData.gender,
          details: {
            birthDate: formData.birthDate,
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
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      UpdateName(response.data.first_name);
      alert("done patient registration");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during registration.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        {currentStep === 1 && (
          <StepOne
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        )}
        {currentStep === 2 && (
          <StepTwo
            formData={formData}
            updateFormData={updateFormData}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
