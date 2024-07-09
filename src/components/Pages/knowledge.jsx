import React, { useState, useContext, useEffect } from "react";
import SimplePaper from "../SimplePaper";
import CheckboxComponent from "../checkboxComponent";
import ReusableRadioGroup from "../radioButton";
import AcceptButton from "../Button";
import "../../assets/styles/index.css";
import axios from "axios";
import Nav from "../Header/menu";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FormContext } from "../FormContext";
import useEmailCookie from "../useEmailCookie"; // Import the useEmailCookie hook

function Knowledge() {
  const { formData, updateFormData, updateFormCompletion } = useContext(FormContext);
  const knowledgeData = formData?.knowledge || {};

  const email = useEmailCookie(); // Check email cookie existence

  const [submitted, setSubmitted] = useState(false);
  const [graduationDate, setGraduationDate] = useState(
    knowledgeData.graduationDate ? new Date(knowledgeData.graduationDate) : null
  );
  const [analyticsDegrees, setAnalyticsDegrees] = useState({
    courseNoCert: !!knowledgeData.training_education_analytics?.[0],
    courseWithCert: !!knowledgeData.training_education_analytics?.[1],
    undergrad: !!knowledgeData.training_education_analytics?.[2],
    gradPostGrad: !!knowledgeData.training_education_analytics?.[3],
  });
  const [firstJobAnalytics, setFirstJobAnalytics] = useState(knowledgeData.firstJobAnalytics || "");
  const [projectsPortfolio, setProjectsPortfolio] = useState(knowledgeData.projectsPortfolio || "");
  const [informationalInterviews, setInformationalInterviews] = useState(knowledgeData.informationalInterviews || "");

  const handleGraduationDateChange = (date) => {
    setGraduationDate(date);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setAnalyticsDegrees((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleFirstJobAnalyticsChange = (event) => {
    setFirstJobAnalytics(event.target.value);
  };

  const handleProjectsPortfolioChange = (event) => {
    setProjectsPortfolio(event.target.value);
  };

  const handleInformationalInterviewsChange = (event) => {
    setInformationalInterviews(event.target.value);
  };

  const handleSubmit = async () => {
    const training_education_analytics = [
      analyticsDegrees.courseNoCert ? 1 : 0,
      analyticsDegrees.courseWithCert ? 1 : 0,
      analyticsDegrees.undergrad ? 1 : 0,
      analyticsDegrees.gradPostGrad ? 1 : 0,
    ];

    const formData = {
      part: "knowledge",
      email,
      graduationDate: graduationDate ? graduationDate.toISOString() : null,
      training_education_analytics,
      firstJobAnalytics,
      projectsPortfolio,
      informationalInterviews,
    };

    try {
      await axios.post("http://localhost:3000/api/saveForm", formData);
      alert("Form submitted successfully!");
      updateFormData("knowledge", {
        graduationDate,
        training_education_analytics,
        firstJobAnalytics,
        projectsPortfolio,
        informationalInterviews,
      });
      updateFormCompletion("knowledge", true);
      setSubmitted(true);
    } catch (error) {
      console.log("There was an error submitting the form!", error);
      alert("There was an error submitting the form!", error);
    }
  };

  const analyticsOptions = [
    {
      label: "Completed some analytics-related courses with no certificates",
      value: "courseNoCert",
    },
    {
      label: "Completed some analytics-related courses with certificates",
      value: "courseWithCert",
    },
    {
      label: "Pursuing or completed an undergraduate degree in analytics",
      value: "undergrad",
    },
    {
      label:
        "Pursuing or completed a graduate or post-graduate degree in analytics",
      value: "gradPostGrad",
    },
  ];

  const firstJobOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  const projectsOptions = [
    { label: "I don't have a portfolio of projects yet", value: "None" },
    { label: "One project", value: "One" },
    { label: "Two projects", value: "Two" },
    { label: "Three projects", value: "Three" },
    { label: "More than three", value: "MoreThanThree" },
  ];

  const informationalInterviewOptions = [
    { label: "What is an informational interview?", value: "WhatIs" },
    { label: "No, I haven't done any yet", value: "None" },
    { label: "Yes, I have done a few", value: "Few" },
    { label: "Yes, I have done many", value: "Many" },
  ];

  return (
    <div className="relative h-full w-full bg-white">
      <div className="absolute bottom-0 left-0 "></div>
      <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100 space-y-4">
        <Nav />
        <SimplePaper
          text="What date did you graduate?"
          elevation={24}
          padding="25px"
          maxWidth="600px"
          fontSize="1.5rem"
          fontWeight="400"
          height="10rem"
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select graduation date"
              value={graduationDate}
              onChange={handleGraduationDateChange}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </SimplePaper>
        <SimplePaper
          text="Have you already got your first job in analytics in Canada?"
          elevation={24}
          padding="25px"
          maxWidth="600px"
          fontSize="1.5rem"
          fontWeight="400"
          height="auto"
        >
          <ReusableRadioGroup
            label="Select One"
            options={firstJobOptions}
            selectedValue={firstJobAnalytics}
            handleChange={handleFirstJobAnalyticsChange}
          />
        </SimplePaper>
        <SimplePaper
          text="Do you have a formal education/degree in analytics (select as many as apply)?"
          elevation={24}
          padding="25px"
          maxWidth="600px"
          fontSize="1.5rem"
          fontWeight="400"
          height="auto"
        >
          {analyticsOptions.map((option) => (
            <CheckboxComponent
              key={option.value}
              label={option.label}
              checked={!!analyticsDegrees[option.value]}
              onChange={handleCheckboxChange}
              name={option.value}
            />
          ))}
        </SimplePaper>
        <SimplePaper
          text="How many analytics-related projects in your professional portfolio (Microsoft PowerPoint, LinkedIn, website, etc.) do you have to showcase to employers?"
          elevation={24}
          padding="25px"
          maxWidth="600px"
          fontSize="1.5rem"
          fontWeight="400"
          height="auto"
        >
          <ReusableRadioGroup
            label="Select One"
            options={projectsOptions}
            selectedValue={projectsPortfolio}
            handleChange={handleProjectsPortfolioChange}
          />
        </SimplePaper>
        <SimplePaper
          text="Have you conducted informational interviews? (Like coffee chats, where YOU are the one making questions...)"
          elevation={24}
          padding="25px"
          maxWidth="600px"
          fontSize="1.5rem"
          fontWeight="400"
          height="auto"
        >
          <ReusableRadioGroup
            label="Select One"
            options={informationalInterviewOptions}
            selectedValue={informationalInterviews}
            handleChange={handleInformationalInterviewsChange}
          />
        </SimplePaper>
        <div>
          <AcceptButton onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

export default Knowledge;
