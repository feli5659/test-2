const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generatePrompt = (keyword) => {
  const prompts = {
    "b2b markedsføring": "Skriv en engagerende paragraf om hvordan Refyne hjælper B2B virksomheder med deres markedsføring med fokus på data-drevet tilgang og målbare resultater.",
    "customer data platform": "Skriv en engagerende paragraf om hvordan Refyne hjælper virksomheder med at implementere og udnytte Customer Data Platforms til at skabe bedre kundeoplevelser og øget ROI.",
    "seo analyse": "Skriv en engagerende paragraf om hvordan Refyne udfører dybdegående SEO-analyser og implementerer datadrevne strategier for at forbedre organisk synlighed.",
  };

  return prompts[keyword.toLowerCase()] || prompts["b2b markedsføring"];
};

exports.handler = async (event) => {
  try {
    const keyword = event.queryStringParameters.keyword || "b2b markedsføring";

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Du er en professionel marketingekspert der skriver på dansk om Refyne's services.",
        },
        {
          role: "user",
          content: generatePrompt(keyword),
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: completion.choices[0].message.content,
        keyword: keyword,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
