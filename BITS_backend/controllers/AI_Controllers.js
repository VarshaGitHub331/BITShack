const API_KEY = process.env.NVIDIA_API_KEY; // Replace with your actual NVIDIA API key
const OpenAI = require("openai");

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
      model: "meta/llama-3.1-405b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.0,
      top_p: 1.0,
      max_tokens: 300,
    });

    // Log the raw response
    const rawResponse = completion.choices[0]?.message?.content.trim();
    console.log("Raw API Response:", rawResponse);

    // Validate JSON format
    let observations;
    try {
      observations = JSON.parse(rawResponse);
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

module.exports = { extractObservationDetails };
