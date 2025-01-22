const OpenAI = require("openai");
const axios = require("axios");

const API_KEY = process.env.NVIDIA_API_KEY; // Replace with your actual NVIDIA API key

const openai = new OpenAI({
  apiKey: `${API_KEY}`,
  baseURL: "https://integrate.api.nvidia.com/v1", // NVIDIA API endpoint
});
async function extractObservationDetails(req, res, next) {
  const prompt = `
  You are a medical AI trained to extract LOINC codes and their corresponding observation data from text. 
  For each medical observation mentioned, provide the LOINC code (obsCode) and the recorded result (obsData). 
  Return the result as a JSON array of objects, where each object contains the fields "obsCode" and "obsData".
  
  Text: "${req.body.extractText}"
  
  Format your response like this:
  [
    {"obsCode": "LOINC_CODE_1", "obsData": "RESULT_1"},
    {"obsCode": "LOINC_CODE_2", "obsData": "RESULT_2"}
  ]
  
  Extracted Observations:`;

  try {
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-405b-instruct", // Example NVIDIA model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.0,
      top_p: 1.0,
      max_tokens: 300,
    });

    // Log the raw response
    const rawResponse = completion.choices[0]?.message?.content.trim();
    console.log("Raw API Response:", rawResponse);

    // Extract only the JSON part by splitting at the first appearance of "Note:"
    const jsonResponse = rawResponse.split("Note:")[0].trim();

    // Parse the structured data
    let observations;
    try {
      observations = JSON.parse(jsonResponse);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      return res.status(500).json({
        error:
          "Failed to parse the AI response. Please check the response format.",
        rawResponse,
      });
    }

    // Store the observations in the request body
    req.body.observations = observations;
    console.log("Extracted Observations:", observations);
    next();
  } catch (error) {
    console.error("Error extracting observations:", error);
    res.status(500).json({ error: "Failed to extract observation details." });
  }
}
async function extractStructuredData(req, res, next) {
  const { inputText, type } = req.body;

  // Modify the prompt to ask for only one type of structured data (either diagnosis or prescription)
  let prompt = `
    You are an AI trained to extract structured data from natural language text.
    Input text: "${inputText}"

    Please return the extracted data as a JSON array, with no additional explanation or text.

    Only return ${
      type === "diagnosis" ? "diagnoses" : "prescriptions"
    } in the format described below:

    - For diagnoses, return an array of JSON objects with the following keys:
      - "diagnosisCode": the diagnosis code (e.g., ICD-10 code).
      - "description": a brief description of the diagnosis.

    - For prescriptions, return an array of JSON objects with the following keys:
      - "medicationCode": the code for the medication (if applicable).
      - "medicationName": the name of the medication (if applicable).
      - "dosage": the prescribed dosage.

    Do not include any other type of data or extra text, only the relevant data based on the input type.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-405b-instruct", // Example model you're using
      messages: [{ role: "user", content: prompt }],
      temperature: 0.0,
      top_p: 1.0,
      max_tokens: 300,
    });

    // Log the raw response for debugging
    let rawResponse = completion.choices[0]?.message?.content.trim();
    console.log("Raw API Response:", rawResponse);

    // Clean up the response by removing backticks or extra characters
    rawResponse = rawResponse.replace(/`+/g, "").trim();

    // Handle cases where the response is not valid JSON or is empty
    if (!rawResponse || rawResponse.startsWith("Since the text is")) {
      return res.status(400).json({
        error: "No medical observations found or input text is invalid.",
      });
    }

    // Parse the cleaned-up response
    let structuredData;
    try {
      structuredData = JSON.parse(rawResponse);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      return res.status(500).json({
        error: "Failed to parse the AI response.",
        rawResponse,
      });
    }

    // Store the structured data in the request body based on the type
    if (type == "diagnosis") {
      req.body.diagnoses = structuredData;
    } else if (type == "prescription") {
      req.body.prescriptions = structuredData;
    }

    next(); // Pass to the next middleware or handler
  } catch (error) {
    console.error("Error extracting structured data:", error);
    res.status(500).json({ error: "Failed to extract structured data." });
  }
}

module.exports = { extractObservationDetails, extractStructuredData };
