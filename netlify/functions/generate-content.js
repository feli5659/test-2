const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event) => {
  try {
    const keyword = event.queryStringParameters.keyword;

    // Return error if no keyword provided
    if (!keyword) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No keyword provided" }),
      };
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Du er en professionel marketingekspert der skriver på dansk om Refyne's services. Du skriver engagerende og overbevisende tekster der fokuserer på data-drevet tilgang og målbare resultater.",
        },
        {
          role: "user",
          content: `Skriv en engagerende paragraf om hvordan Refyne hjælper virksomheder med ${keyword}. 
          Teksten skal være professionel og fokusere på Refyne's datadrevne tilgang og evne til at skabe målbare resultater. 
          Hold teksten omkring 2-3 sætninger.`,
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
