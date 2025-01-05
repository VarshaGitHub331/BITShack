import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import FirstStep from "./StepTwo";
import SecondStep from "./StepThree";
import Register from "./StepOne";

export default function ProviderRegister() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    specialization: "",
    gender: "",
    hospital_regno: "",
    hospital_id: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    qualifications: "",
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
  const { UserLogin } = useAuthContext();
  const navigate = useNavigate();
  async function handleSubmit() {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/hospitalProvider/register`,
        {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          hospital_id: formData.hospital_id,
          specialization: formData.specialization,
          gender: formData.gender,
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
      setLoading(false);
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
