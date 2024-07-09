// Imports
import React, { useState } from "react";
import SimplePaper from "../SimplePaper";
import FormPropsTextFields from "../textField";
import ReusableRadioGroup from "../radioButton";
import CheckboxComponent from "../checkboxComponent";
import { Typography, Button } from "@mui/material";
import AcceptButton from "../Button";
import { RadioButtonChecked } from "@mui/icons-material";
import "../../assets/styles/index.css";
import axios from "axios"; 
import Nav from "../Header/menu";

function Form({ email }) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [graduationDate, setGraduationDate] = useState(null);
  const [analyticsDegrees, setAnalyticsDegrees] = useState({
    courseNoCert: false,
    courseWithCert: false,
    undergrad: false,
    gradPostGrad: false,
  });
  const [firstJobAnalytics, setFirstJobAnalytics] = useState("");
  const [interviewPositions, setInterviewPositions] = useState("");
  const [jobOffersBeforeFirstJob, setJobOffersBeforeFirstJob] = useState("");
  const [satisfaction, setSatisfaction] = useState("");
  const [portfolioProjects, setPortfolioProjects] = useState("");

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

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

  const handleInterviewPositionsChange = (event) => {
    setInterviewPositions(event.target.value);
  };

  const handleJobOffersChange = (event) => {
    setJobOffersBeforeFirstJob(event.target.value);
  };

  const handleSatisfactionChange = (event) => {
    setSatisfaction(event.target.value);
  };

  const handlePortfolioProjectsChange = (event) => {
    setPortfolioProjects(event.target.value);
  };

  const handleSubmit = async () => {
    const education = Object.values(analyticsDegrees).map((value) =>
      value ? 1 : 0
    );
    const formData = {
      email,
      demographics: {
        age,
        gender,
        graduationDate,
      },
      education,
      firstJobAnalytics,
      interviewPositions,
      jobOffersBeforeFirstJob,
      satisfaction,
      portfolioProjects,
    };
    console.log(formData);

    try {
      await axios.post("http://localhost:3000/api/saveForm", formData);
      alert("Form submitted successfully!");
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

  const interviewPositionsOptions = [
    { label: "I just interviewed for the position that I got", value: "1" },
    {
      label:
        "I interviewed for 2 positions in total (Including the position that I got)",
      value: "2",
    },
    {
      label:
        "I interviewed for 3 positions in total (Including the position that I got)",
      value: "3",
    },
    {
      label:
        "I interviewed for more than 3 positions in total (Including the position that I got)",
      value: "more",
    },
  ];

  const jobOffersOptions = [
    { label: "I received one offer for the first job that I got", value: "1" },
    {
      label: "I received 2 offers in total (Including the offer that I got)",
      value: "2",
    },
    {
      label: "I received 3 offers in total (Including the offer that I got)",
      value: "3",
    },
    {
      label:
        "I received more than 3 offers in total (Including the offer that I got)",
      value: "more",
    },
  ];

  const satisfactionOptions = [
    { label: "Strongly disagree", value: "strongly_disagree" },
    { label: "Disagree", value: "disagree" },
    { label: "Neutral", value: "neutral" },
    { label: "Agree", value: "agree" },
    { label: "Strongly agree", value: "strongly_agree" },
  ];
  const portfolioProjectsOptions = [
    { label: "I don't have a portfolio of projects yet", value: "none" },
    { label: "One project", value: "one" },
    { label: "Two projects", value: "two" },
    { label: "Three projects", value: "three" },
    { label: "More than three projects", value: "more" },
  ];

  return (
    <div className="relative h-full w-full bg-white">
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
          value={age}
        >
          <FormPropsTextFields value={age} />
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
        <SimplePaper
          text="What date did you graduate?"
          elevation={24}
          padding="25px"
          maxWidth="600px"
          fontSize="1.5rem"
          fontWeight="400"
          height="auto"
        >
          {/* <DatePickerComponent
            label="Graduation Date"
            value={graduationDate}
            onChange={handleGraduationDateChange}
          /> */}
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
              checked={analyticsDegrees[option.value]}
              onChange={handleCheckboxChange}
              name={option.value}
            />
          ))}
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
          text="How many positions did you interview for before you got your first job in analytics in Canada?"
          elevation={24}
          padding="25px"
          maxWidth="600px"
          fontSize="1.5rem"
          fontWeight="400"
          height="auto"
        >
          <ReusableRadioGroup
            label="Select One"
            options={interviewPositionsOptions}
            selectedValue={interviewPositions}
            handleChange={handleInterviewPositionsChange}
          />
        </SimplePaper>
        <SimplePaper
          text="How many job offers did you receive before your first job in analytics in Canada?"
          elevation={24}
          padding="25px"
          maxWidth="600px"
          fontSize="1.5rem"
          fontWeight="400"
          height="auto"
        >
          <ReusableRadioGroup
            label="Select One"
            options={jobOffersOptions}
            selectedValue={jobOffersBeforeFirstJob}
            handleChange={handleJobOffersChange}
          />
        </SimplePaper>
        <SimplePaper
          text="To what extent do you agree with the following statement:"
          elevation={24}
          padding="25px"
          maxWidth="600px"
          fontSize="2rem"
          fontWeight="400"
          height="auto"
        >
          <Typography variant="body1" component="span" fontWeight="bold">
            I am/was satisfied with my first job in analytics in Canada
          </Typography>
          <ReusableRadioGroup
            label=""
            options={satisfactionOptions}
            selectedValue={satisfaction}
            handleChange={handleSatisfactionChange}
          />
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
            options={portfolioProjectsOptions}
            selectedValue={portfolioProjects}
            handleChange={handlePortfolioProjectsChange}
          />
        </SimplePaper>{" "}
        <SimplePaper
          text="Question Goes here?"
          elevation={24}
          padding="25px"
          maxWidth="600px"
          fontSize="1.5rem"
          fontWeight="400"
          height="auto"
        ></SimplePaper>
        <SimplePaper
          text="Question Goes here?"
          elevation={24}
          padding="25px"
          maxWidth="600px"
          fontSize="1.5rem"
          fontWeight="400"
          height="auto"
        ></SimplePaper>
        <SimplePaper
          text="Question Goes here?"
          elevation={24}
          padding="25px"
          maxWidth="600px"
          fontSize="1.5rem"
          fontWeight="400"
          height="auto"
        ></SimplePaper>
        <div>
          <AcceptButton onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

export default Form;
