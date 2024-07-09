import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  CssBaseline,
  Grid,
  Container,
} from "@mui/material";
import axios from "axios";
import Nav from "../Header/menu";
import SimplePaper from "../SimplePaper";
import AcceptButton from "../Button";
import { FormContext } from "../FormContext";
import useEmailCookie from "../useEmailCookie"; // Import the useEmailCookie hook


const statements = [
  "Include as many skills/job experiences as I have",
  "Avoid using exact words mentioned in a job posting, as a hiring manager might assume that I copied their job posting into my resume",
];

const options = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

function Resume() {
  const { formData, updateFormData } = useContext(FormContext);
  const email = useEmailCookie();// Check email cookie existence

  const resumeData = formData?.resume || {};

  const [responses, setResponses] = useState(Array(statements.length).fill(""));
  const [resumeLength, setResumeLength] = useState("");
  const [jobPostingRequirements, setJobPostingRequirements] = useState({
    companyValues: false,
    softSkills: false,
    technicalSkills: false,
    educationRequired: false,
    workExperienceRequired: false,
  });

  useEffect(() => {
    if (resumeData) {
      setResponses(resumeData.job_posting_effectiveness?.map(index => options[index]) || Array(statements.length).fill(""));
      setResumeLength(resumeData.length === 1 ? "1 page" : resumeData.length === 2 ? "2 pages" : resumeData.length === 3 ? "More than 2 pages" : "");
      setJobPostingRequirements(resumeData.customization?.reduce((acc, val, index) => {
        acc[Object.keys(jobPostingRequirements)[index]] = val === 1;
        return acc;
      }, {}) || {
        companyValues: false,
        softSkills: false,
        technicalSkills: false,
        educationRequired: false,
        workExperienceRequired: false,
      });
    }
  }, [resumeData]);

  const handleRadioChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleResumeLengthChange = (event) => {
    setResumeLength(event.target.value);
  };

  const handleJobPostingRequirementsChange = (event) => {
    setJobPostingRequirements({
      ...jobPostingRequirements,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async () => {

    let resumeLengthNumber;
    if (resumeLength === "1 page") {
      resumeLengthNumber = 1;
    } else if (resumeLength === "2 pages") {
      resumeLengthNumber = 2;
    } else if (resumeLength === "More than 2 pages") {
      resumeLengthNumber = 3;
    } else {
      resumeLengthNumber = 0;
    }

    const formDataToSubmit = {
      part: "resume",
      email,
      job_posting_effectiveness: responses.map(response => options.indexOf(response)),
      length: resumeLengthNumber,
      customization: Object.values(jobPostingRequirements).map(val => val ? 1 : 0),
    };

    try {
      await axios.post("http://localhost:3000/api/saveForm", formDataToSubmit);
      alert("Form submitted successfully!");
      updateFormData('resume', {
        job_posting_effectiveness: responses.map(response => options.indexOf(response)),
        length: resumeLengthNumber,
        customization: Object.values(jobPostingRequirements).map(val => val ? 1 : 0),
      });
      updateFormCompletion("resume", true);
    } catch (error) {
      console.error("There was an error submitting the form:", error);
      alert("Form submission failed. Please try again.");
    }
  };

  return (
    <div className="relative h-full w-full bg-white">
      <div className="absolute bottom-0 left-0 "></div>
      <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100 space-y-4">
        <Nav />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <CssBaseline />
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="h6"></Typography>
            </Grid>
            <Grid item xs={8}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                {options.map((option, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{ flex: 1, textAlign: "center" }}
                  >
                    {option}
                  </Typography>
                ))}
              </Box>
            </Grid>
          </Grid>
          {statements.map((statement, index) => (
            <SimplePaper
              key={index}
              elevation={24}
              padding="25px"
              maxWidth="md"
              fontSize="1rem"
              fontWeight="400"
              height="auto"
              sx={{ mb: 2 }}
            >
              <Grid container alignItems="center">
                <Grid item xs={4} sx={{ pr: 2 }}>
                  <Typography variant="body1">{statement}</Typography>
                </Grid>
                <Grid item xs={8}>
                  <RadioGroup
                    row
                    value={responses[index]}
                    onChange={(e) => handleRadioChange(index, e.target.value)}
                    sx={{ justifyContent: "space-between" }}
                  >
                    {options.map((option, optionIndex) => (
                      <FormControlLabel
                        key={optionIndex}
                        value={option}
                        control={<Radio />}
                        label=""
                        sx={{ flex: 1, textAlign: "center" }}
                      />
                    ))}
                  </RadioGroup>
                </Grid>
              </Grid>
            </SimplePaper>
          ))}
          <SimplePaper
            elevation={24}
            padding="25px"
            maxWidth="md"
            fontSize="1rem"
            fontWeight="400"
            height="auto"
            sx={{ mb: 2 }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="body1">
                  How long is your resume?
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <RadioGroup
                  value={resumeLength}
                  onChange={handleResumeLengthChange}
                >
                  <FormControlLabel
                    value="1 page"
                    control={<Radio />}
                    label="1 page"
                  />
                  <FormControlLabel
                    value="2 pages"
                    control={<Radio />}
                    label="2 pages"
                  />
                  <FormControlLabel
                    value="More than 2 pages"
                    control={<Radio />}
                    label="More than 2 pages"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </SimplePaper>
          <SimplePaper
            elevation={24}
            padding="25px"
            maxWidth="md"
            fontSize="1rem"
            fontWeight="400"
            height="auto"
            sx={{ mb: 2 }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="body1">
                  When looking through a job posting for what a position
                  requires, I look at (select as many as apply):
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={jobPostingRequirements.companyValues}
                        onChange={handleJobPostingRequirementsChange}
                        name="companyValues"
                      />
                    }
                    label="Values of the company"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={jobPostingRequirements.softSkills}
                        onChange={handleJobPostingRequirementsChange}
                        name="softSkills"
                      />
                    }
                    label="Soft skills"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={jobPostingRequirements.technicalSkills}
                        onChange={handleJobPostingRequirementsChange}
                        name="technicalSkills"
                      />
                    }
                    label="Technical skills"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={jobPostingRequirements.educationRequired}
                        onChange={handleJobPostingRequirementsChange}
                        name="educationRequired"
                      />
                    }
                    label="Education required"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={jobPostingRequirements.workExperienceRequired}
                        onChange={handleJobPostingRequirementsChange}
                        name="workExperienceRequired"
                      />
                    }
                    label="Work experience required"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </SimplePaper>
          <Grid container justifyContent="center">
            <Grid item>
              <AcceptButton onClick={handleSubmit} />
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
}

export default Resume;
