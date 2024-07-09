import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  CssBaseline,
  Grid,
  Container,
} from "@mui/material";
import axios from "axios";
import Nav from "../Header/menu";
import SimplePaper from "../SimplePaper";
import "../../assets/styles/index.css";
import AcceptButton from "../Button";
import { FormContext } from "../FormContext";
import useEmailCookie from "../useEmailCookie"; // Import the useEmailCookie hook


const statements = [
  "When I present to an audience, I use visual tools and/or body language",
  "When I tell a story, I usually manage to get my audience’s attention and recognition",
  "I can convey emotions in my presentations",
  "I have the ability to simplify complex information and present it in an understandable way",
  "I am able to use various narrative techniques (dialogue, descriptions, metaphors) in my presentations",
];

const options = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

const smallTalkTopics = [
  { name: "politics", label: "Politics" },
  { name: "weather", label: "Weather" },
  { name: "hobbies", label: "Hobbies" },
  { name: "movies", label: "Movies/Performances/Books" },
  { name: "sports", label: "Sport Events" },
  { name: "healthIssues", label: "Health Issues" },
  { name: "jobIssues", label: "Job Issues" },
  { name: "salary", label: "Salary" },
  { name: "pets", label: "Pets" },
  { name: "stress", label: "Current Problems that Cause Your Stress" },
  { name: "cooking", label: "Cooking/Meals/Cuisines One Likes" },
  { name: "travel", label: "Travel" },
  { name: "family", label: "Family/Personal Issues" },
];

function SoftSkills() {
  const { formData, updateFormData, updateFormCompletion } = useContext(FormContext);
  const email = useEmailCookie();// Check email cookie existence
  const softSkillsData = formData?.softSkills || {};

  const [responses, setResponses] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState({});

  useEffect(() => {
    const initialResponses = statements.map((_, index) => {
      const key = ["present", "story", "convey", "simplify", "narrative"][index];
      return softSkillsData[key] ? options[softSkillsData[key] - 1] : "";
    });

    const initialSelectedTopics = smallTalkTopics.reduce((acc, topic) => {
      acc[topic.name] = Boolean(softSkillsData.smallTalkTopics?.[topic.name]);
      return acc;
    }, {});

    setResponses(initialResponses);
    setSelectedTopics(initialSelectedTopics);
  }, [softSkillsData]);

  const handleRadioChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleCheckboxChange = (event) => {
    setSelectedTopics({
      ...selectedTopics,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async () => {

    const formDataToSubmit = {
      part: "soft_skills",
      email,
      present: options.indexOf(responses[0]) + 1,
      story: options.indexOf(responses[1]) + 1,
      convey: options.indexOf(responses[2]) + 1,
      simplify: options.indexOf(responses[3]) + 1,
      narrative: options.indexOf(responses[4]) + 1,
      smallTalkTopics: selectedTopics,
    };

    try {
      await axios.post("http://localhost:3000/api/saveForm", formDataToSubmit);
      alert("Form submitted successfully!");
      updateFormData("softSkills", {
        present: options.indexOf(responses[0]) + 1,
        story: options.indexOf(responses[1]) + 1,
        convey: options.indexOf(responses[2]) + 1,
        simplify: options.indexOf(responses[3]) + 1,
        narrative: options.indexOf(responses[4]) + 1,
        smallTalkTopics: selectedTopics,
      });
      updateFormCompletion("softSkills", true);
    } catch (error) {
      console.log("There was an error submitting the form!", error);
      alert("There was an error submitting the form!");
    }
  };

  return (
    <div className="relative h-full w-full bg-white">
      <div className="absolute bottom-0 left-0 "></div>
      <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100 space-y-4">
        <Nav />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <CssBaseline />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Typography variant="h6">Soft Skills Assessment</Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
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
                <Grid item xs={12} sm={4} sx={{ pr: 2 }}>
                  <Typography variant="body1">{statement}</Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <RadioGroup
                    row
                    value={responses[index] || ""}
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
            <Typography variant="body1">
              Select all the topics that you believe are appropriate for a small talk:
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
              {smallTalkTopics.map((topic) => (
                <FormControlLabel
                  key={topic.name}
                  control={
                    <Checkbox
                      checked={selectedTopics[topic.name] || false}
                      onChange={handleCheckboxChange}
                      name={topic.name}
                    />
                  }
                  label={topic.label}
                />
              ))}
            </Box>
          </SimplePaper>
          <Grid container justifyContent="center" sx={{ mt: 3 }}>
            <Grid item>
              <AcceptButton onClick={handleSubmit} />
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
}

export default SoftSkills;
