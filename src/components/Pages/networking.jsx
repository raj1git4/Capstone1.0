import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
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
  "I spend most of the time with people with the same background (my country of origin)",
  "I believe that I can use the same strategies, which I used to get a job at home, to land a job in Canada",
  "I am who I am. Changing my personality to a new environment feels like a betrayal to me",
  "I accept circumstances out of my control and work with them",
  "I can change my opinion when I hear good arguments",
];

const options = [
  { label: "Strongly Disagree", value: 0 },
  { label: "Disagree", value: 1 },
  { label: "Neutral", value: 2 },
  { label: "Agree", value: 3 },
  { label: "Strongly Agree", value: 4 },
];

function Networking() {
  const { formData, updateFormData, updateFormCompletion } = useContext(FormContext);
  const email = useEmailCookie();// Check email cookie existence

  const networkingData = formData?.networking || {};

  const [responses, setResponses] = useState([]);
  const [networkingTime, setNetworkingTime] = useState(-1);
  const [informationalInterview, setInformationalInterview] = useState(-1);

  useEffect(() => {
    const initialResponses = statements.map((_, index) => {
      return networkingData.understanding_networking?.[index] ?? -1;
    });

    setResponses(initialResponses);
    setNetworkingTime(networkingData.linkedin_reaching_out ?? -1);
    setInformationalInterview(networkingData.informational_interviews ?? -1);
  }, [networkingData]);

  const handleRadioChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = parseInt(value, 10);
    setResponses(newResponses);
  };

  const handleNetworkingTimeChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setNetworkingTime(value);
  };

  const handleInformationalInterviewChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setInformationalInterview(value);
  };

  const handleSubmit = async () => {

    const formDataToSubmit = {
      part: "networking",
      email,
      linkedin_reaching_out: networkingTime,
      informational_interviews: informationalInterview,
      understanding_networking: responses,
    };

    try {
      await axios.post("http://localhost:3000/api/saveForm", formDataToSubmit);
      alert("Form submitted successfully!");
      updateFormData("networking", {
        linkedin_reaching_out: networkingTime,
        informational_interviews: informationalInterview,
        understanding_networking: responses,
      });
      updateFormCompletion("networking", true);
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
              <Typography variant="h6">Networking Assessment</Typography>
            </Grid>
            <Grid item xs={8}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                {options.map((option, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{ flex: 1, textAlign: "center" }}
                  >
                    {option.label}
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
              sx={{ mb: 3 }}
            >
              <Grid container alignItems="center">
                <Grid item xs={4} sx={{ pr: 2 }}>
                  <Typography variant="body1">{statement}</Typography>
                </Grid>
                <Grid item xs={8}>
                  <RadioGroup
                    row
                    value={responses[index] >= 0 ? responses[index].toString() : ""}
                    onChange={(e) => handleRadioChange(index, e.target.value)}
                    sx={{ justifyContent: "space-between" }}
                  >
                    {options.map((option, optionIndex) => (
                      <FormControlLabel
                        key={optionIndex}
                        value={option.value.toString()}
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
            sx={{ mb: 3 }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Your contract expires in a year, when is the best time for you
                  to start networking for a new role?
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <RadioGroup
                  value={networkingTime >= 0 ? networkingTime.toString() : ""}
                  onChange={handleNetworkingTimeChange}
                >
                  <FormControlLabel
                    value="0"
                    control={<Radio />}
                    label="I constantly network with people irrespective of my job situation"
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Sooner rather than later"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="About 3 months before the contract expires"
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio />}
                    label="I will use the network I already have rather than making new connections"
                  />
                  <FormControlLabel
                    value="4"
                    control={<Radio />}
                    label="I will contact people if their company is hiring"
                  />
                  <FormControlLabel
                    value="5"
                    control={<Radio />}
                    label="Why do I need to network? I will start applying for positions with my resume directly"
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
            sx={{ mb: 3 }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Have you conducted informational interviews? (Like coffee
                  chats, where YOU are the one asking questions...)
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <RadioGroup
                  value={informationalInterview >= 0 ? informationalInterview.toString() : ""}
                  onChange={handleInformationalInterviewChange}
                >
                  <FormControlLabel
                    value="0"
                    control={<Radio />}
                    label="What is an informational interview?"
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="No, I haven’t done any yet"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="Yes, I have done a few"
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio />}
                    label="Yes, I have done many"
                  />
                </RadioGroup>
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

export default Networking;
