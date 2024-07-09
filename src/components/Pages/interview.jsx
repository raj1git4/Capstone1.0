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
import AcceptButton from "../Button";
import { FormContext } from "../FormContext";
import useEmailCookie from "../useEmailCookie"; // Import the useEmailCookie hook

const technicalStatements = [
  "Once given a problem, assume that all the information is provided. Don’t ask additional questions",
  "Respond to a question as quickly as possible. An employer looks for the speed with which you can apply a technical skill",
  "There are multiple technical solutions and methods to one problem",
  "Focus on presenting the solution to a problem than your thinking process",
];

const interviewStatements = [
  "I have a document with drafts of job interview questions to prepare for a job interview",
  "When a person talks about their accomplishments, they need to be humble while responding to interview questions",
  "To succeed in an interview, one needs to use the STAR (SAR) story technique to respond to behavioral questions",
  "Preparation for interviews is overestimated; if one has necessary technical skills, they will get a job",
];

const options = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

const platforms = [
  { name: "none", label: "None" },
  { name: "leetcode", label: "Leetcode" },
  { name: "coderbyte", label: "Coderbyte" },
  { name: "formation", label: "Formation" },
  { name: "algoExpert", label: "AlgoExpert" },
  { name: "strataScratch", label: "StrataScratch" },
  { name: "hackerRank", label: "HackerRank" },
  { name: "interviewQuery", label: "Interview Query" },
  { name: "other", label: "Other" },
];

function Interview() {
  const { formData, updateFormData, updateFormCompletion } = useContext(FormContext);
  const email = useEmailCookie(); // Check email cookie existence

  const interviewData = formData?.interview || {};
  console.log(formData);
  const [responses, setResponses] = useState(
    Array(technicalStatements.length).fill("")
  );
  const [responses2, setResponses2] = useState(
    Array(interviewStatements.length).fill("")
  );
  const [satisfactionResponse, setSatisfactionResponse] = useState(
    interviewData.satisfaction || ""
  );
  const [technicalInterview, setTechnicalInterview] = useState(
    platforms.reduce((acc, platform) => ({ ...acc, [platform.name]: false }), {})
  );

  useEffect(() => {
    if (interviewData) {
      const initResponses = interviewData.behavioral
        ? interviewData.behavioral.map((response) => (response !== null ? options[response] : ""))
        : Array(technicalStatements.length).fill("");
      const initResponses2 = interviewData.technical
        ? interviewData.technical.map((response) => (response !== null ? options[response] : ""))
        : Array(interviewStatements.length).fill("");
      const initTechnicalInterview = interviewData.platforms_used || platforms.reduce(
        (acc, platform) => ({ ...acc, [platform.name]: false }), {});

      setResponses(initResponses);
      setResponses2(initResponses2);
      setTechnicalInterview(initTechnicalInterview);
    }
  }, [interviewData]);

  const handleCheckboxChange = (event) => {
    setTechnicalInterview({
      ...technicalInterview,
      [event.target.name]: event.target.checked,
    });
  };

  const handleRadioChange = (index, value, responseType) => {
    const newResponses =
      responseType === "technical" ? [...responses] : [...responses2];
    newResponses[index] = value;
    responseType === "technical"
      ? setResponses(newResponses)
      : setResponses2(newResponses);
  };

  const handleSatisfactionResponseChange = (value) => {
    setSatisfactionResponse(value);
  };

  const handleSubmit = async () => {
    const formData = {
      part: "interviewing",
      email,
      behavioral: responses.map((response) => options.indexOf(response)),
      technical: responses2.map((response) => options.indexOf(response)),
      platforms_used: technicalInterview,
      satisfaction: satisfactionResponse,
    };

    try {
      await axios.post("http://localhost:3000/api/saveForm", formData);
      alert("Form submitted successfully!");
      updateFormData("interview", {
        behavioral: formData.behavioral,
        technical: formData.technical,
        platforms_used: technicalInterview,
        satisfaction: formData.satisfaction,
      });
      updateFormCompletion("interview", true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
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
              <Typography variant="body1">
                To which extent do you agree with the following statements about
                a technical interview process:
              </Typography>
            </Grid>
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
            {technicalStatements.map((statement, index) => (
              <Grid item xs={12} key={index}>
                <SimplePaper sx={{ mb: 2 }}>
                  <Grid container alignItems="center">
                    <Grid item xs={4}>
                      <Typography variant="body1">{statement}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <RadioGroup
                        row
                        value={responses[index] || ""}
                        onChange={(e) =>
                          handleRadioChange(index, e.target.value, "technical")
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
              <SimplePaper sx={{ mb: 2 }}>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Select the platforms you used while preparing for technical
                    interviews:
                  </Typography>
                </Grid>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  {platforms.map((platform) => (
                    <FormControlLabel
                      key={platform.name}
                      control={
                        <Checkbox
                          checked={technicalInterview[platform.name] || false}
                          onChange={handleCheckboxChange}
                          name={platform.name}
                        />
                      }
                      label={platform.label}
                    />
                  ))}
                </Box>
              </SimplePaper>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                To which extent do you agree with the following statements about
                interview preparation:
              </Typography>
            </Grid>
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
            {interviewStatements.map((statement, index) => (
              <Grid item xs={12} key={index}>
                <SimplePaper sx={{ mb: 2 }}>
                  <Grid container alignItems="center">
                    <Grid item xs={4}>
                      <Typography variant="body1">{statement}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <RadioGroup
                        row
                        value={responses2[index] || ""}
                        onChange={(e) =>
                          handleRadioChange(index, e.target.value, "interview")
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
              <SimplePaper sx={{ mb: 2 }}>
                <Grid container alignItems="center">
                  <Grid item xs={4}>
                    <Typography variant="body1">
                      I am/was satisfied with my first job in analytics in
                      Canada:
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <RadioGroup
                      row
                      value={satisfactionResponse}
                      onChange={(e) =>
                        handleSatisfactionResponseChange(e.target.value)
                      }
                      sx={{ justifyContent: "space-between" }}
                    >
                      {options.map((option, index) => (
                        <FormControlLabel
                          key={index}
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

export default Interview;
