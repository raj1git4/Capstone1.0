import React, { useState } from "react";
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
  "I know how to care for myself in stressful periods",
  "I am aware of my strengths and weaknesses",
  "I have clearly defined values that outline what is most important to me",
  "I can describe my ideal work environment",
  "I know what activities give me the most joy",
  "After I set a goal, I create a plan with clear actions to monitor my progress",
  "I often end up doing things at the last possible moment",
  "My personal work style is closer to spontaneous bursts of energy than organized and consistent efforts",
  "I like to use organizing tools like schedules and to-do lists",
  "I define the importance and the urgency of tasks in order to prioritize them",
  "I have a long-term vision of what I want for my life",
  "I objectively weigh the costs and benefits of each possible solution when making a decision",
  "When I come up with a solution to a problem, I think through any new problems that solution could create before implementing it",
];

const options = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

const interviewOptions = [
  "I just interviewed for the position that I got",
  "I interviewed for 2 positions in total (Including the position that I got)",
  "I interviewed for 3 positions in total (Including the position that I got)",
  "I interviewed for more than 3 positions in total (Including the position that I got)",
];

function Personality() {
  const [responses, setResponses] = useState(Array(statements.length).fill(""));
  const email = useEmailCookie(); // Check email cookie existence

  const [persona, setPersona] = useState("");
  const [interviewResponse, setInterviewResponse] = useState("");

  const handleRadioChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handlePersonaChange = (event) => {
    setPersona(event.target.value);
  };

  const handleInterviewResponseChange = (event) => {
    setInterviewResponse(event.target.value);
  };

  const handleSubmit = async () => {
    const formData = {
      part: "technicalSkills",
      email,
      present: options.indexOf(responses[0]) + 1,
      story: options.indexOf(responses[1]) + 1,
      convey: options.indexOf(responses[2]) + 1,
      simplify: options.indexOf(responses[3]) + 1,
      narrative: options.indexOf(responses[4]) + 1,
      interview: interviewOptions.indexOf(interviewResponse) + 1,
    };

    try {
      await axios.post("http://localhost:3000/api/saveForm", formData);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("There was an error submitting the form:", error);
      alert("Form submission failed. Please try again.");
    }
  };

  return (
    <div className="relative h-full w-full bg-white">
      <div className="absolute bottom-0 left-0 right-0 top-0"></div>
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
            {statements.map((statement, index) => (
              <Grid item xs={12} key={index}>
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
                      <Typography variant="body1">{statement}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <RadioGroup
                        row
                        value={responses[index]}
                        onChange={(e) =>
                          handleRadioChange(index, e.target.value)
                        }
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
              </Grid>
            ))}
            <Grid item xs={12}>
              <SimplePaper>
                <Typography variant="body1">
                  Which words do you think appeal to employers the most?
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={persona === "Achieved"}
                        onChange={handlePersonaChange}
                        value="Achieved"
                      />
                    }
                    label="Achieved, managed, resolved, launched"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={persona === "GoGetter"}
                        onChange={handlePersonaChange}
                        value="GoGetter"
                      />
                    }
                    label="Go-getter, think outside of the box, people pleaser"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={persona === "ExcellentCommunicator"}
                        onChange={handlePersonaChange}
                        value="ExcellentCommunicator"
                      />
                    }
                    label="Excellent communicator, highly organized, motivated"
                  />
                </Box>
              </SimplePaper>
            </Grid>
            <Grid item xs={12}>
              <SimplePaper
                elevation={24}
                padding="25px"
                maxWidth="md"
                fontSize="1rem"
                fontWeight="400"
                height="auto"
                sx={{ mb: 2 }}
              >
                <Typography variant="body1">
                  How many positions did you interview for before you got your
                  first job in analytics in Canada?
                </Typography>
                <RadioGroup
                  value={interviewResponse}
                  onChange={handleInterviewResponseChange}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  {interviewOptions.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                      sx={{ textAlign: "left", mb: 1 }}
                    />
                  ))}
                </RadioGroup>
              </SimplePaper>
            </Grid>
            <Grid container justifyContent="center">
              <Grid item>
                <AcceptButton onClick={handleSubmit} />
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
}

export default Personality;
