import React, { useState, useEffect, useContext } from "react";
import SimplePaper from "../SimplePaper";
import ReusableRadioGroup from "../radioButton";
import AcceptButton from "../Button";
import "../../assets/styles/index.css";
import axios from "axios";
import Nav from "../Header/menu";
import { FormContext } from "../FormContext";
import useEmailCookie from "../useEmailCookie"; // Import the useEmailCookie hook

function Demographic() {
  const { formData, updateFormData, updateFormCompletion } = useContext(FormContext);
  const email = useEmailCookie();// Check email cookie existence

  const demographicData = formData?.demographic || {};

  const [age, setAge] = useState(demographicData?.age || "");
  const [gender, setGender] = useState(demographicData?.gender || "");

  useEffect(() => {
    if (demographicData.age) setAge(demographicData?.age);
    if (demographicData.gender) setGender(demographicData?.gender);
  }, [demographicData]);

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleSubmit = async () => {

    const formData = {
      part: "demographic",
      email,
      age,
      gender,
    };

    try {
      await axios.post("http://localhost:3000/api/saveform", formData);
      alert("Form submitted successfully!");
      updateFormData("demographic", { age, gender });
      updateFormCompletion("demographic", true);
    } catch (error) {
      console.log("There was an error submitting the form!", error);
      alert("There was an error submitting the form!", error);
    }
  };

  const genderOptions = [
    { label: "Men", value: "Men" },
    { label: "Female", value: "Female" },
    { label: "Non-binary", value: "Non-binary" },
    { label: "Prefer not to say", value: "Prefer not to say" },
  ];

  const ageOptions = Array.from({ length: 85 }, (_, i) => i + 16);

  return (
    <div className="relative h-full w-full bg-white">
      <div className="absolute bottom-0 left-0 "></div>
      <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100 space-y-4">
        <Nav />
        <SimplePaper
          text="What's your age?"
          elevation={24}
          padding="25px"
          maxWidth="600px"
          fontSize="1.5rem"
          fontWeight="400"
          height="auto"
        >
          <select value={age} onChange={handleAgeChange} className="p-2 border rounded">
            <option value="">Select Age</option>
            {ageOptions.map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
        </SimplePaper>
        <SimplePaper
          text="Gender"
          elevation={24}
          padding="25px"
          maxWidth="600px"
          fontSize="1.5rem"
          fontWeight="400"
          height="auto"
        >
          <ReusableRadioGroup
            label="Select One"
            options={genderOptions}
            selectedValue={gender}
            handleChange={handleGenderChange}
          />
        </SimplePaper>
        <div>
          <AcceptButton onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

export default Demographic;
