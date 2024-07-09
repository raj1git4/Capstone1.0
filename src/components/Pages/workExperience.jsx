import React, { useState, useContext } from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, CssBaseline, Grid, Container, CircularProgress, TextField } from '@mui/material';
import axios from 'axios';
import Nav from '../Header/menu';
import SimplePaper from '../SimplePaper';
import "../../assets/styles/index.css";
import AcceptButton from "../Button";
import { FormContext } from "../FormContext";
import useEmailCookie from "../useEmailCookie"; // Import the useEmailCookie hook

const workExperienceStatements = [
  "Work experience in Canada (not related to data analytics)",
  "Work experience in Canada (related to data analytics)",
  "Work experience abroad (related to data analytics)"
];

const workExperienceOptions = [
  "None",
  "Less than 1 year",
  "1 year",
  "2 years",
  "More than 2 years"
];

const interviewOptions = [
  "I received one offer for the first job that I got",
  "I received 2 offers in total (Including the offer that I got)",
  "I received 3 offers in total (Including the offer that I got)",
  "I received more than 3 offers in total (Including the offer that I got)"
];

function WorkExperience() {
  const { formData, updateFormData, updateFormCompletion } = useContext(FormContext);
  const email = useEmailCookie(); // Check email cookie existence

  const workExperienceData = formData?.workExperience || {};

  const [responses, setResponses] = useState([
    workExperienceOptions[workExperienceData.non_analytics_canada - 1] || "",
    workExperienceOptions[workExperienceData.analytics_canada - 1] || "",
    workExperienceOptions[workExperienceData.analytics_abroad - 1] || "",
  ]);
  const [date, setDate] = useState(workExperienceData.first_job_date || "");
  const [interviewResponse, setInterviewResponse] = useState(interviewOptions[workExperienceData.interview_offers - 1] || "");
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const handleRadioChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleInterviewResponseChange = (value) => {
    setInterviewResponse(value);
  };

  const handleSubmit = async () => {
    // Validation
    if (responses.includes("") || !date || !interviewResponse) {
      alert("Please answer all the questions before submitting.");
      return;
    }

    const formData = {
      part: "work_experience",
      email,
      workExperienceCanadaNonAnalytics: workExperienceOptions.indexOf(responses[0]) + 1,
      workExperienceCanadaAnalytics: workExperienceOptions.indexOf(responses[1]) + 1,
      workExperienceAbroadAnalytics: workExperienceOptions.indexOf(responses[2]) + 1,
      firstJobDate: date,
      interviewOffers: interviewOptions.indexOf(interviewResponse) + 1,
      portfolioProjects: 0,
    };

    setLoading(true); // Start loading
    setError(null); // Reset error state

    try {
      await axios.post('http://localhost:3000/api/saveForm', formData);
      alert('Form submitted successfully!');
      updateFormData("workExperience", {
        non_analytics_canada: formData.workExperienceCanadaNonAnalytics,
        analytics_canada: formData.workExperienceCanadaAnalytics,
        analytics_abroad: formData.workExperienceAbroadAnalytics,
        first_job_date: formData.firstJobDate,
        interview_offers: formData.interviewOffers,
        portfolio_projects: formData.portfolioProjects
      });
      updateFormCompletion("workExperience", true);
    } catch (error) {
      console.error('There was an error submitting the form!', error);
      setError('There was an error submitting the form! Please try again.'); // Set error state
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="relative h-full w-full bg-white">
      <div className="absolute bottom-0 left-0 right-0 top-0 "></div>
      <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100 space-y-4">
        <Nav />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <CssBaseline />
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="h6"></Typography>
            </Grid>
            <Grid item xs={8}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {workExperienceOptions.map((option, index) => (
                  <Typography key={index} variant="body2" sx={{ flex: 1, textAlign: 'center' }}>
                    {option}
                  </Typography>
                ))}
              </Box>
            </Grid>
          </Grid>
          {workExperienceStatements.map((statement, index) => (
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
                    sx={{ justifyContent: 'space-between' }}
                  >
                    {workExperienceOptions.map((option, optionIndex) => (
                      <FormControlLabel
                        key={optionIndex}
                        value={option}
                        control={<Radio />}
                        label=""
                        sx={{ flex: 1, textAlign: 'center' }}
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
            <Grid container alignItems="center">
              <Grid item xs={4} sx={{ pr: 2 }}>
                <Typography variant="body1">
                  When did you land the first job in analytics in Canada?
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  fullWidth
                />
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
            <Grid container alignItems="center">
              <Grid item xs={4} sx={{ pr: 2 }}>
                <Typography variant="body1">
                  How many job offers did you receive before your first job in analytics in Canada? *
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <RadioGroup
                  value={interviewResponse}
                  onChange={(e) => handleInterviewResponseChange(e.target.value)}
                >
                  {interviewOptions.map((option, optionIndex) => (
                    <FormControlLabel
                      key={optionIndex}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </Grid>
            </Grid>
          </SimplePaper>
          <Grid container justifyContent="center">
            <Grid item>
              {loading ? (
                <CircularProgress />
              ) : (
                <AcceptButton onClick={handleSubmit} />
              )}
            </Grid>
          </Grid>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Container>
      </div>
    </div>
  );
}

export default WorkExperience;
