import React, { useState, useContext } from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, CssBaseline, Grid, Container } from '@mui/material';
import axios from 'axios';
import Nav from '../Header/menu';
import SimplePaper from '../SimplePaper';
import "../../assets/styles/index.css";
import AcceptButton from "../Button";
import { FormContext } from "../FormContext";
import useEmailCookie from "../useEmailCookie"; // Import the useEmailCookie hook


const statements = [
  "SQL",
  "Python",
  "Microsoft Excel/Google Sheets",
  "Power BI/Tableau/Looker",
  "R"
];

const options = [
  "Not studied yet",
  "Studied but need to apply this skill",
  "Have some experience but still learning",
  "Have enough experience but require occasional support",
  "Can execute complex tasks",
  "Can train others"
];

function TechnicalSkills() {
  const { formData, updateFormData, updateFormCompletion } = useContext(FormContext);
  const email = useEmailCookie();// Check email cookie existence
  const technicalSkillsData = formData?.technicalSkills || {};

  const [responses, setResponses] = useState([
    options[technicalSkillsData.sql - 1] || "",
    options[technicalSkillsData.python - 1] || "",
    options[technicalSkillsData.excel - 1] || "",
    options[technicalSkillsData.BI - 1] || "",
    options[technicalSkillsData.r - 1] || ""
  ]);

  const handleRadioChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = async () => {

    const formData = {
      part: "technical_skills",
      email,
      sql: options.indexOf(responses[0]) + 1,
      python: options.indexOf(responses[1]) + 1,
      excel: options.indexOf(responses[2]) + 1,
      BI: options.indexOf(responses[3]) + 1,
      r: options.indexOf(responses[4]) + 1
    };

    try {
      await axios.post('http://localhost:3000/api/saveForm', formData);
      alert('Form submitted successfully!');
      updateFormData("technicalSkills", {
        sql: formData.sql,
        python: formData.python,
        excel: formData.excel,
        BI: formData.BI,
        r: formData.r
      });
      updateFormCompletion("technicalSkills", true);
    } catch (error) {
      console.log('There was an error submitting the form!', error);
      alert('There was an error submitting the form!', error);
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

export default TechnicalSkills;
