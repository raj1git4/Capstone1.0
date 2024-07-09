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
  "If I only know someone through a social media (LinkedIn, Facebook), it's inappropriate to ask them for a meeting",
  "Networking is all about finding people who can help me with my next career move",
  "I find the idea of networking with strangers challenging",
  "I feel comfortable walking up to someone I find interesting and talking to them",
  "I actively attend job fairs and professional events related to analytics",
];

const options = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

const appealWordsOptions = [
  "Achieved, managed, resolved, launched",
  "Go-getter, think outside of the box, people pleaser",
  "Excellent communicator, highly organized, motivated",
];

function Linkedin() {
  const { formData, updateFormData, updateFormCompletion } = useContext(FormContext);
  const email = useEmailCookie(); // Check email cookie existence
  const linkedinData = formData?.linkedin || {};

  const [responses, setResponses] = useState(Array(statements.length).fill(""));
  const [persona, setPersona] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [connections, setConnections] = useState("");
  const [approach, setApproach] = useState("");
  const [appealWords, setAppealWords] = useState("");

  useEffect(() => {
    if (linkedinData) {
      const initialResponses = linkedinData.behavioral && linkedinData.behavioral.length
        ? linkedinData.behavioral.map(index => options[index])
        : Array(statements.length).fill("");
      setResponses(initialResponses);

      setPersona(
        linkedinData.persona === 1 ? "dont" :
        linkedinData.persona === 2 ? "Casual" :
        linkedinData.persona === 3 ? "Occasional" :
        linkedinData.persona === 4 ? "leader" :
        ""
      );

      setRecommendations(
        linkedinData.recommendations === 1 ? "None" :
        linkedinData.recommendations === 2 ? "Between 1 and 2" :
        linkedinData.recommendations === 3 ? "Between 3 and 5" :
        linkedinData.recommendations === 4 ? "More than 5" :
        ""
      );

      setConnections(
        linkedinData.connections === 1 ? "Less than 100" :
        linkedinData.connections === 2 ? "Between 100 and 200" :
        linkedinData.connections === 3 ? "Between 201 and 300" :
        linkedinData.connections === 4 ? "Between 301 and 400" :
        linkedinData.connections === 5 ? "Between 401 and 500" :
        linkedinData.connections === 6 ? "More than 500" :
        ""
      );

      setApproach(
        linkedinData.approach === 1 ? "To meet me to share their experience in the career similar to the one I want to build" :
        linkedinData.approach === 2 ? "To help me get a job in their company" :
        linkedinData.approach === 3 ? "To refer me to a hiring manager for a job posting" :
        linkedinData.approach === 4 ? "I don't contact people on LinkedIn" :
        ""
      );

      setAppealWords(linkedinData.appealWords || "");
    }
  }, [linkedinData]);

  const handleRadioChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handlePersonaChange = (event) => {
    setPersona(event.target.value);
  };

  const handleRecommendationsChange = (event) => {
    setRecommendations(event.target.value);
  };

  const handleConnectionsChange = (event) => {
    setConnections(event.target.value);
  };

  const handleApproachChange = (event) => {
    setApproach(event.target.value);
  };

  const handleAppealWordsChange = (event) => {
    setAppealWords(event.target.value);
  };

  const handleSubmit = async () => {
    const formDataToSubmit = {
      part: "linkedin_profile",
      email,
      persona:
        persona === "dont" ? 1 :
        persona === "Casual" ? 2 :
        persona === "Occasional" ? 3 :
        persona === "leader" ? 4 : 0,
      recommendations:
        recommendations === "None" ? 1 :
        recommendations === "Between 1 and 2" ? 2 :
        recommendations === "Between 3 and 5" ? 3 :
        recommendations === "More than 5" ? 4 : 0,
      connections:
        connections === "Less than 100" ? 1 :
        connections === "Between 100 and 200" ? 2 :
        connections === "Between 201 and 300" ? 3 :
        connections === "Between 301 and 400" ? 4 :
        connections === "Between 401 and 500" ? 5 :
        connections === "More than 500" ? 6 : 0,
      behavioral: responses.map((response) => options.indexOf(response)),
      approach:
        approach === "To meet me to share their experience in the career similar to the one I want to build" ? 1 :
        approach === "To help me get a job in their company" ? 2 :
        approach === "To refer me to a hiring manager for a job posting" ? 3 :
        approach === "I don't contact people on LinkedIn" ? 4 : 0,
      appealWords,
    };

    try {
      await axios.post("http://localhost:3000/api/saveForm", formDataToSubmit);
      alert("Form submitted successfully!");
      updateFormData("linkedin", {
        persona: formDataToSubmit.persona,
        recommendations: formDataToSubmit.recommendations,
        connections: formDataToSubmit.connections,
        behavioral: formDataToSubmit.behavioral,
        approach: formDataToSubmit.approach,
        appealWords: formDataToSubmit.appealWords,
      });
      updateFormCompletion("linkedin", true);
    } catch (error) {
      console.error("There was an error submitting the form:", error);
      alert("There was an error submitting the form. Please try again.");
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
            <Grid item xs={12}>
              <SimplePaper>
                <Typography variant="body1">
                  What is your LinkedIn persona?
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={persona === "dont"}
                        onChange={handlePersonaChange}
                        value="dont"
                      />
                    }
                    label="I don’t have a LinkedIn profile"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={persona === "Casual"}
                        onChange={handlePersonaChange}
                        value="Casual"
                      />
                    }
                    label="Casual observer (i.e., scroll through others' news and posts)"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={persona === "Occasional"}
                        onChange={handlePersonaChange}
                        value="Occasional"
                      />
                    }
                    label="Occasional commentator (i.e., you 'like' others' posts, you comment on others' posts)"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={persona === "leader"}
                        onChange={handlePersonaChange}
                        value="leader"
                      />
                    }
                    label="Thought leader (i.e., you have your own posts on LinkedIn)"
                  />
                </Box>
              </SimplePaper>
            </Grid>
            <Grid item xs={12}>
              <SimplePaper>
                <Typography variant="body1">
                  How many LinkedIn recommendations do you have?
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={recommendations === "None"}
                        onChange={handleRecommendationsChange}
                        value="None"
                      />
                    }
                    label="None"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={recommendations === "Between 1 and 2"}
                        onChange={handleRecommendationsChange}
                        value="Between 1 and 2"
                      />
                    }
                    label="Between 1 and 2"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={recommendations === "Between 3 and 5"}
                        onChange={handleRecommendationsChange}
                        value="Between 3 and 5"
                      />
                    }
                    label="Between 3 and 5"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={recommendations === "More than 5"}
                        onChange={handleRecommendationsChange}
                        value="More than 5"
                      />
                    }
                    label="More than 5"
                  />
                </Box>
              </SimplePaper>
            </Grid>
            <Grid item xs={12}>
              <SimplePaper>
                <Typography variant="body1">
                  How many LinkedIn connections do you have?
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={connections === "Less than 100"}
                        onChange={handleConnectionsChange}
                        value="Less than 100"
                      />
                    }
                    label="Less than 100"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={connections === "Between 100 and 200"}
                        onChange={handleConnectionsChange}
                        value="Between 100 and 200"
                      />
                    }
                    label="Between 100 and 200"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={connections === "Between 201 and 300"}
                        onChange={handleConnectionsChange}
                        value="Between 201 and 300"
                      />
                    }
                    label="Between 201 and 300"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={connections === "Between 301 and 400"}
                        onChange={handleConnectionsChange}
                        value="Between 301 and 400"
                      />
                    }
                    label="Between 301 and 400"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={connections === "Between 401 and 500"}
                        onChange={handleConnectionsChange}
                        value="Between 401 and 500"
                      />
                    }
                    label="Between 401 and 500"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={connections === "More than 500"}
                        onChange={handleConnectionsChange}
                        value="More than 500"
                      />
                    }
                    label="More than 500"
                  />
                </Box>
              </SimplePaper>
            </Grid>
            <Grid item xs={12}>
              <SimplePaper>
                <Typography variant="body1">
                  When reaching out to a person on LinkedIn for the first time,
                  what would you ask?
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={
                          approach ===
                          "To meet me to share their experience in the career similar to the one I want to build"
                        }
                        onChange={handleApproachChange}
                        value="To meet me to share their experience in the career similar to the one I want to build"
                      />
                    }
                    label="To meet me to share their experience in the career similar to the one I want to build"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={
                          approach ===
                          "To help me get a job in their company"
                        }
                        onChange={handleApproachChange}
                        value="To help me get a job in their company"
                      />
                    }
                    label="To help me get a job in their company"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={
                          approach ===
                          "To refer me to a hiring manager for a job posting"
                        }
                        onChange={handleApproachChange}
                        value="To refer me to a hiring manager for a job posting"
                      />
                    }
                    label="To refer me to a hiring manager for a job posting"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={
                          approach ===
                          "I don't contact people on LinkedIn"
                        }
                        onChange={handleApproachChange}
                        value="I don't contact people on LinkedIn"
                      />
                    }
                    label="I don't contact people on LinkedIn"
                  />
                </Box>
              </SimplePaper>
            </Grid>
            <Grid item xs={12}>
              <SimplePaper>
                <Typography variant="body1">
                  Which words do you think appeal to employers the most?
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={appealWords === appealWordsOptions[0]}
                        onChange={handleAppealWordsChange}
                        value={appealWordsOptions[0]}
                      />
                    }
                    label={appealWordsOptions[0]}
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={appealWords === appealWordsOptions[1]}
                        onChange={handleAppealWordsChange}
                        value={appealWordsOptions[1]}
                      />
                    }
                    label={appealWordsOptions[1]}
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={appealWords === appealWordsOptions[2]}
                        onChange={handleAppealWordsChange}
                        value={appealWordsOptions[2]}
                      />
                    }
                    label={appealWordsOptions[2]}
                  />
                </Box>
              </SimplePaper>
            </Grid>
            <Grid item xs={12}>
              <SimplePaper>
                <Typography variant="body1">
                  To which extent do you agree with the following statements:
                </Typography>
                <Grid container justifyContent="space-between">
                  {options.map((option, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      sx={{ flex: 1, textAlign: "center" }}
                    >
                      {option}
                    </Typography>
                  ))}
                </Grid>
              </SimplePaper>
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
                        value={responses[index] || ""}
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

export default Linkedin;
