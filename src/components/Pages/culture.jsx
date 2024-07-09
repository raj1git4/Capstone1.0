import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, Checkbox, CssBaseline, Grid, Container } from '@mui/material';
import axios from 'axios';
import Nav from '../Header/menu';
import SimplePaper from '../SimplePaper';
import "../../assets/styles/index.css";
import AcceptButton from "../Button";
// import Cookies from 'universal-cookie';
import { FormContext } from "../FormContext";
import useEmailCookie from "../useEmailCookie"; // Import the useEmailCookie hook


const statements = [
  "I notice cultural differences (i.e., body language, gestures, social distance) between people from my culture and people born in Canada.",
  "I feel comfortable engaging in a small talk with people at professional events, in an elevator, at work."
];

const options = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree"
];

function Culture() {
  const { formData, updateFormData, updateFormCompletion } = useContext(FormContext);
  const email = useEmailCookie();// Check email cookie existence
  const culturalIntelligenceData = formData?.culture || {};
  const [responses, setResponses] = useState([
    options[culturalIntelligenceData.culture - 1] || "",
    options[culturalIntelligenceData.comfortable - 1] || ""
  ]);

  const [smallTalkTopics, setSmallTalkTopics] = useState({
    whatIsSmallTalk: culturalIntelligenceData.small_talk_topics?.whatIsSmallTalk || false,
    politics: culturalIntelligenceData.small_talk_topics?.politics || false,
    weather: culturalIntelligenceData.small_talk_topics?.weather || false,
    hobbies: culturalIntelligenceData.small_talk_topics?.hobbies || false,
    moviesPerformancesBooks: culturalIntelligenceData.small_talk_topics?.moviesPerformancesBooks || false,
    sportEvents: culturalIntelligenceData.small_talk_topics?.sportEvents || false,
    healthIssues: culturalIntelligenceData.small_talk_topics?.healthIssues || false,
    jobIssues: culturalIntelligenceData.small_talk_topics?.jobIssues || false,
    salary: culturalIntelligenceData.small_talk_topics?.salary || false,
    pets: culturalIntelligenceData.small_talk_topics?.pets || false,
    stressProblems: culturalIntelligenceData.small_talk_topics?.stressProblems || false,
    cookingMealsCuisines: culturalIntelligenceData.small_talk_topics?.cookingMealsCuisines || false,
    travel: culturalIntelligenceData.small_talk_topics?.travel || false,
    familyPersonalIssues: culturalIntelligenceData.small_talk_topics?.familyPersonalIssues || false
  });

  useEffect(() => {
    if (culturalIntelligenceData) {
      setResponses([
        options[culturalIntelligenceData.culture - 1] || "",
        options[culturalIntelligenceData.comfortable - 1] || ""
      ]);

      setSmallTalkTopics({
        whatIsSmallTalk: culturalIntelligenceData.small_talk_topics?.whatIsSmallTalk || false,
        politics: culturalIntelligenceData.small_talk_topics?.politics || false,
        weather: culturalIntelligenceData.small_talk_topics?.weather || false,
        hobbies: culturalIntelligenceData.small_talk_topics?.hobbies || false,
        moviesPerformancesBooks: culturalIntelligenceData.small_talk_topics?.moviesPerformancesBooks || false,
        sportEvents: culturalIntelligenceData.small_talk_topics?.sportEvents || false,
        healthIssues: culturalIntelligenceData.small_talk_topics?.healthIssues || false,
        jobIssues: culturalIntelligenceData.small_talk_topics?.jobIssues || false,
        salary: culturalIntelligenceData.small_talk_topics?.salary || false,
        pets: culturalIntelligenceData.small_talk_topics?.pets || false,
        stressProblems: culturalIntelligenceData.small_talk_topics?.stressProblems || false,
        cookingMealsCuisines: culturalIntelligenceData.small_talk_topics?.cookingMealsCuisines || false,
        travel: culturalIntelligenceData.small_talk_topics?.travel || false,
        familyPersonalIssues: culturalIntelligenceData.small_talk_topics?.familyPersonalIssues || false
      });
    }
  }, [culturalIntelligenceData]);

  const handleCheckboxChange = (event) => {
    setSmallTalkTopics({ ...smallTalkTopics, [event.target.name]: event.target.checked });
  };

  const handleRadioChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = async () => {
    
    const formData = {
      part: 'cultural_intelligence',
      email,
      culture: options.indexOf(responses[0]) + 1,
      comfortable: options.indexOf(responses[1]) + 1,
      smallTalkTopics
    };

    try {
      await axios.post('http://localhost:3000/api/saveForm', formData);
      alert('Form submitted successfully!');
      updateFormData("culture", {
        culture: options.indexOf(responses[0]) + 1,
        comfortable: options.indexOf(responses[1]) + 1,
        small_talk_topics: smallTalkTopics
      });
      updateFormCompletion("culture", true);
    } catch (error) {
      console.log('There was an error submitting the form!', error);
      alert('Form submission Error!', error);
    }
  };

  return (
    <div className="relative h-full w-full bg-white">
      <div className="absolute bottom-0 left-0 "></div>
      <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100 space-y-4">
        <Nav />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <CssBaseline />
          <SimplePaper
            elevation={24}
            padding="25px"
            maxWidth="md"
            fontSize="1rem"
            fontWeight="400"
            height="auto"
            sx={{ mb: 2 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">Select all the topics that you believe are appropriate for a small talk:</Typography>
              </Grid>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormControlLabel
                  control={<Checkbox checked={smallTalkTopics.whatIsSmallTalk} onChange={handleCheckboxChange} name="whatIsSmallTalk" />}
                  label="What is a small talk?"
                />
                <FormControlLabel
                  control={<Checkbox checked={smallTalkTopics.politics} onChange={handleCheckboxChange} name="politics" />}
                  label="Politics"
                />
                <FormControlLabel
                  control={<Checkbox checked={smallTalkTopics.weather} onChange={handleCheckboxChange} name="weather" />}
                  label="Weather"
                />
                <FormControlLabel
                  control={<Checkbox checked={smallTalkTopics.hobbies} onChange={handleCheckboxChange} name="hobbies" />}
                  label="Hobbies"
                />
                <FormControlLabel
                  control={<Checkbox checked={smallTalkTopics.moviesPerformancesBooks} onChange={handleCheckboxChange} name="moviesPerformancesBooks" />}
                  label="Movies/performances/books"
                />
                <FormControlLabel
                  control={<Checkbox checked={smallTalkTopics.sportEvents} onChange={handleCheckboxChange} name="sportEvents" />}
                  label="Sport events"
                />
                <FormControlLabel
                  control={<Checkbox checked={smallTalkTopics.healthIssues} onChange={handleCheckboxChange} name="healthIssues" />}
                  label="Health issues"
                />
                <FormControlLabel
                  control={<Checkbox checked={smallTalkTopics.jobIssues} onChange={handleCheckboxChange} name="jobIssues" />}
                  label="Job issues"
                />
                <FormControlLabel
                  control={<Checkbox checked={smallTalkTopics.salary} onChange={handleCheckboxChange} name="salary" />}
                  label="Salary"
                />
                <FormControlLabel
                  control={<Checkbox checked={smallTalkTopics.pets} onChange={handleCheckboxChange} name="pets" />}
                  label="Pets"
                />
                <FormControlLabel
                  control={<Checkbox checked={smallTalkTopics.stressProblems} onChange={handleCheckboxChange} name="stressProblems" />}
                  label="Current problems that cause your stress"
                />
                <FormControlLabel
                  control={<Checkbox checked={smallTalkTopics.cookingMealsCuisines} onChange={handleCheckboxChange} name="cookingMealsCuisines" />}
                  label="Cooking/meals/cuisines one likes"
                />
                <FormControlLabel
                  control={<Checkbox checked={smallTalkTopics.travel} onChange={handleCheckboxChange} name="travel" />}
                  label="Travel"
                />
                <FormControlLabel
                  control={<Checkbox checked={smallTalkTopics.familyPersonalIssues} onChange={handleCheckboxChange} name="familyPersonalIssues" />}
                  label="Family/personal issues"
                />
              </Box>
            </Grid>
          </SimplePaper>
          <Grid container spacing={2} paddingTop={4}>
            <Grid item xs={12}>
              <Typography variant="body1">To which extent do you agree with the following statements:</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6"></Typography>
            </Grid>
            <Grid item xs={8}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {options.map((option, index) => (
                  <Typography key={index} variant="body2" sx={{ flex: 1, textAlign: 'center' }}>
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
                    sx={{ justifyContent: 'space-between' }}
                  >
                    {options.map((option, optionIndex) => (
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

export default Culture;
